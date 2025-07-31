use crate::unit::{ServiceUnit, UnitLoader};
use crate::process::ServiceProcess;
use crate::journal::JournalLogger;
use anyhow::{Result, Context};
use std::collections::{HashMap, HashSet};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tokio::sync::mpsc;
use tokio::time::sleep;
use uuid::Uuid;
use log::{info, warn, error, debug};
use std::path::PathBuf;
use std::fs;

#[derive(Debug, Clone, PartialEq)]
pub enum ServiceState {
    Inactive,
    Activating,
    Active,
    Deactivating,
    Failed,
    Reloading,
}

#[derive(Debug, Clone)]
pub struct ServiceStatus {
    pub name: String,
    pub state: ServiceState,
    pub pid: Option<u32>,
    pub exit_code: Option<i32>,
    pub start_time: Option<Instant>,
    pub last_restart: Option<Instant>,
    pub restart_count: u32,
    pub load_error: Option<String>,
}

pub struct ServiceManager {
    units: Arc<Mutex<HashMap<String, ServiceUnit>>>,
    processes: Arc<Mutex<HashMap<String, ServiceProcess>>>,
    status: Arc<Mutex<HashMap<String, ServiceStatus>>>,
    unit_loader: UnitLoader,
    journal_logger: JournalLogger,
    event_sender: mpsc::UnboundedSender<ServiceEvent>,
}

#[derive(Debug)]
pub enum ServiceEvent {
    Start { name: String },
    Stop { name: String },
    Restart { name: String },
    Reload { name: String },
    Enable { name: String },
    Disable { name: String },
    UnitChanged { name: String },
}

impl ServiceManager {
    pub fn new() -> Result<Self> {
        let (event_sender, event_receiver) = mpsc::unbounded_channel();
        
        let manager = Self {
            units: Arc::new(Mutex::new(HashMap::new())),
            processes: Arc::new(Mutex::new(HashMap::new())),
            status: Arc::new(Mutex::new(HashMap::new())),
            unit_loader: UnitLoader::new(),
            journal_logger: JournalLogger::new()?,
            event_sender,
        };
        
        // Start event loop
        let manager_clone = manager.clone();
        tokio::spawn(async move {
            manager_clone.event_loop(event_receiver).await;
        });
        
        Ok(manager)
    }
    
    pub fn start_service(&self, name: &str) -> Result<()> {
        info!("Starting service: {}", name);
        
        let unit = self.get_unit(name)?;
        let dependencies = self.resolve_dependencies(&unit)?;
        
        // Start dependencies first
        for dep in dependencies {
            if !self.is_service_active(&dep) {
                self.start_service(&dep)?;
            }
        }
        
        // Update status
        self.update_service_status(name, ServiceState::Activating, None)?;
        
        // Create and start process
        let mut process = ServiceProcess::new(&unit, &self.journal_logger)?;
        process.start()?;
        
        let pid = process.get_pid();
        self.update_service_status(name, ServiceState::Active, pid)?;
        
        // Store process
        {
            let mut processes = self.processes.lock().unwrap();
            processes.insert(name.to_string(), process);
        }
        
        info!("Service {} started successfully", name);
        Ok(())
    }
    
    pub fn stop_service(&self, name: &str) -> Result<()> {
        info!("Stopping service: {}", name);
        
        self.update_service_status(name, ServiceState::Deactivating, None)?;
        
        // Stop process
        {
            let mut processes = self.processes.lock().unwrap();
            if let Some(process) = processes.get_mut(name) {
                process.stop()?;
                processes.remove(name);
            }
        }
        
        self.update_service_status(name, ServiceState::Inactive, None)?;
        
        info!("Service {} stopped successfully", name);
        Ok(())
    }
    
    pub async fn restart_service(&self, name: &str) -> Result<()> {
        info!("Restarting service: {}", name);
        
        self.stop_service(name)?;
        sleep(Duration::from_millis(100)).await;
        self.start_service(name)?;
        
        info!("Service {} restarted successfully", name);
        Ok(())
    }
    
    pub fn reload_service(&self, name: &str) -> Result<()> {
        info!("Reloading service: {}", name);
        
        // Reload unit file
        let new_unit = self.unit_loader.reload_unit(name)?;
        {
            let mut units = self.units.lock().unwrap();
            units.insert(name.to_string(), new_unit);
        }
        
        self.update_service_status(name, ServiceState::Reloading, None)?;
        
        // Send reload signal to process
        {
            let mut processes = self.processes.lock().unwrap();
            if let Some(process) = processes.get_mut(name) {
                process.reload()?;
            }
        }
        
        self.update_service_status(name, ServiceState::Active, None)?;
        
        info!("Service {} reloaded successfully", name);
        Ok(())
    }
    
    pub fn enable_service(&self, name: &str) -> Result<()> {
        info!("Enabling service: {}", name);
        
        let unit = self.get_unit(name)?;
        let targets = unit.get_targets();
        
        for target in targets {
            self.create_symlink(name, &target)?;
        }
        
        info!("Service {} enabled successfully", name);
        Ok(())
    }
    
    pub fn disable_service(&self, name: &str) -> Result<()> {
        info!("Disabling service: {}", name);
        
        let unit = self.get_unit(name)?;
        let targets = unit.get_targets();
        
        for target in targets {
            self.remove_symlink(name, &target)?;
        }
        
        info!("Service {} disabled successfully", name);
        Ok(())
    }
    
    pub fn list_services(&self, filter: Option<ServiceState>) -> Vec<ServiceStatus> {
        let status = self.status.lock().unwrap();
        
        status.values()
            .filter(|s| filter.as_ref().map_or(true, |f| s.state == *f))
            .cloned()
            .collect()
    }
    
    pub fn get_service_status(&self, name: &str) -> Option<ServiceStatus> {
        let status = self.status.lock().unwrap();
        status.get(name).cloned()
    }
    
    pub fn is_service_active(&self, name: &str) -> bool {
        if let Some(status) = self.get_service_status(name) {
            status.state == ServiceState::Active
        } else {
            false
        }
    }
    
    pub fn get_unit(&self, name: &str) -> Result<ServiceUnit> {
        let units = self.units.lock().unwrap();
        units.get(name)
            .cloned()
            .ok_or_else(|| anyhow::anyhow!("Service unit not found: {}", name))
    }
    
    fn resolve_dependencies(&self, unit: &ServiceUnit) -> Result<Vec<String>> {
        let mut resolved = Vec::new();
        let mut visited = HashSet::new();
        let mut visiting = HashSet::new();
        
        self.dfs_resolve_dependencies(&unit.name, &mut resolved, &mut visited, &mut visiting)?;
        
        Ok(resolved)
    }
    
    fn dfs_resolve_dependencies(
        &self,
        service: &str,
        resolved: &mut Vec<String>,
        visited: &mut HashSet<String>,
        visiting: &mut HashSet<String>,
    ) -> Result<()> {
        if visited.contains(service) {
            return Ok(());
        }
        
        if visiting.contains(service) {
            return Err(anyhow::anyhow!("Circular dependency detected for service: {}", service));
        }
        
        visiting.insert(service.to_string());
        
        let unit = self.get_unit(service)?;
        let dependencies = unit.get_dependencies();
        
        for dep in dependencies {
            self.dfs_resolve_dependencies(&dep, resolved, visited, visiting)?;
        }
        
        visiting.remove(service);
        visited.insert(service.to_string());
        resolved.push(service.to_string());
        
        Ok(())
    }
    
    fn update_service_status(&self, name: &str, state: ServiceState, pid: Option<u32>) -> Result<()> {
        let mut status = self.status.lock().unwrap();
        
        let service_status = status.entry(name.to_string()).or_insert_with(|| ServiceStatus {
            name: name.to_string(),
            state: ServiceState::Inactive,
            pid: None,
            exit_code: None,
            start_time: None,
            last_restart: None,
            restart_count: 0,
            load_error: None,
        });
        
        service_status.state = state;
        service_status.pid = pid;
        
        if state == ServiceState::Active {
            service_status.start_time = Some(Instant::now());
        }
        
        Ok(())
    }
    
    fn create_symlink(&self, service_name: &str, target: &str) -> Result<()> {
        let target_dir = PathBuf::from(format!("/etc/tau/system/{}", target));
        fs::create_dir_all(&target_dir)?;
        
        let symlink_path = target_dir.join(format!("{}.tau", service_name));
        let unit_path = PathBuf::from(format!("/etc/tau/services/{}.tau", service_name));
        
        if symlink_path.exists() {
            fs::remove_file(&symlink_path)?;
        }
        
        std::os::unix::fs::symlink(&unit_path, &symlink_path)?;
        Ok(())
    }
    
    fn remove_symlink(&self, service_name: &str, target: &str) -> Result<()> {
        let symlink_path = PathBuf::from(format!("/etc/tau/system/{}/{}.tau", target, service_name));
        
        if symlink_path.exists() {
            fs::remove_file(&symlink_path)?;
        }
        
        Ok(())
    }
    
    async fn event_loop(&self, mut receiver: mpsc::UnboundedReceiver<ServiceEvent>) {
        while let Some(event) = receiver.recv().await {
            match event {
                ServiceEvent::Start { name } => {
                    if let Err(e) = self.start_service(&name) {
                        error!("Failed to start service {}: {}", name, e);
                    }
                }
                ServiceEvent::Stop { name } => {
                    if let Err(e) = self.stop_service(&name) {
                        error!("Failed to stop service {}: {}", name, e);
                    }
                }
                ServiceEvent::Restart { name } => {
                    if let Err(e) = self.restart_service(&name).await {
                        error!("Failed to restart service {}: {}", name, e);
                    }
                }
                ServiceEvent::Reload { name } => {
                    if let Err(e) = self.reload_service(&name) {
                        error!("Failed to reload service {}: {}", name, e);
                    }
                }
                ServiceEvent::Enable { name } => {
                    if let Err(e) = self.enable_service(&name) {
                        error!("Failed to enable service {}: {}", name, e);
                    }
                }
                ServiceEvent::Disable { name } => {
                    if let Err(e) = self.disable_service(&name) {
                        error!("Failed to disable service {}: {}", name, e);
                    }
                }
                ServiceEvent::UnitChanged { name } => {
                    if let Err(e) = self.reload_service(&name) {
                        error!("Failed to reload service {} after unit change: {}", name, e);
                    }
                }
            }
        }
    }
    
    pub fn load_units(&self) -> Result<()> {
        let units = self.unit_loader.load_all_units()?;
        
        {
            let mut units_guard = self.units.lock().unwrap();
            *units_guard = units;
        }
        
        // Initialize status for all units
        {
            let mut status = self.status.lock().unwrap();
            for (name, unit) in self.units.lock().unwrap().iter() {
                status.insert(name.clone(), ServiceStatus {
                    name: name.clone(),
                    state: ServiceState::Inactive,
                    pid: None,
                    exit_code: None,
                    start_time: None,
                    last_restart: None,
                    restart_count: 0,
                    load_error: None,
                });
            }
        }
        
        info!("Loaded {} service units", units.len());
        Ok(())
    }
}

impl Clone for ServiceManager {
    fn clone(&self) -> Self {
        Self {
            units: Arc::clone(&self.units),
            processes: Arc::clone(&self.processes),
            status: Arc::clone(&self.status),
            unit_loader: self.unit_loader.clone(),
            journal_logger: self.journal_logger.clone(),
            event_sender: self.event_sender.clone(),
        }
    }
} 