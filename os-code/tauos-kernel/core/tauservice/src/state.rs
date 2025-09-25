use crate::service_manager::{ServiceStatus, ServiceState};
use anyhow::{Result, Context};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};
use log::{info, warn, error};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PersistentServiceState {
    pub name: String,
    pub enabled: bool,
    pub last_state: ServiceState,
    pub last_pid: Option<u32>,
    pub last_start_time: Option<u64>,
    pub restart_count: u32,
    pub last_updated: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServiceStateStore {
    pub services: HashMap<String, PersistentServiceState>,
    pub last_save: u64,
    pub version: String,
}

pub struct StateManager {
    state_dir: PathBuf,
    state_file: PathBuf,
}

impl StateManager {
    pub fn new() -> Result<Self> {
        let state_dir = PathBuf::from("/var/lib/tau-service");
        let state_file = state_dir.join("state.json");
        
        // Ensure state directory exists
        fs::create_dir_all(&state_dir)?;
        
        Ok(Self {
            state_dir,
            state_file,
        })
    }
    
    pub fn save_service_state(&self, service_name: &str, status: &ServiceStatus, enabled: bool) -> Result<()> {
        let mut store = self.load_state_store()?;
        
        let persistent_state = PersistentServiceState {
            name: service_name.to_string(),
            enabled,
            last_state: status.state.clone(),
            last_pid: status.pid,
            last_start_time: status.start_time.map(|t| t.duration_since(UNIX_EPOCH).unwrap().as_secs()),
            restart_count: status.restart_count,
            last_updated: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
        };
        
        store.services.insert(service_name.to_string(), persistent_state);
        store.last_save = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
        
        self.save_state_store(&store)?;
        
        Ok(())
    }
    
    pub fn load_service_state(&self, service_name: &str) -> Result<Option<PersistentServiceState>> {
        let store = self.load_state_store()?;
        Ok(store.services.get(service_name).cloned())
    }
    
    pub fn get_enabled_services(&self) -> Result<Vec<String>> {
        let store = self.load_state_store()?;
        
        let enabled_services: Vec<String> = store.services
            .values()
            .filter(|state| state.enabled)
            .map(|state| state.name.clone())
            .collect();
        
        Ok(enabled_services)
    }
    
    pub fn get_service_stats(&self, service_name: &str) -> Result<Option<PersistentServiceState>> {
        self.load_service_state(service_name)
    }
    
    pub fn clear_service_state(&self, service_name: &str) -> Result<()> {
        let mut store = self.load_state_store()?;
        store.services.remove(service_name);
        
        self.save_state_store(&store)?;
        info!("Cleared state for service: {}", service_name);
        
        Ok(())
    }
    
    pub fn clear_all_state(&self) -> Result<()> {
        let store = ServiceStateStore {
            services: HashMap::new(),
            last_save: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
            version: "1.0".to_string(),
        };
        
        self.save_state_store(&store)?;
        info!("Cleared all service state");
        
        Ok(())
    }
    
    pub fn get_state_summary(&self) -> Result<StateSummary> {
        let store = self.load_state_store()?;
        
        let total_services = store.services.len();
        let enabled_services = store.services.values().filter(|s| s.enabled).count();
        let running_services = store.services.values().filter(|s| s.last_state == ServiceState::Active).count();
        
        Ok(StateSummary {
            total_services,
            enabled_services,
            running_services,
            last_save: store.last_save,
        })
    }
    
    fn load_state_store(&self) -> Result<ServiceStateStore> {
        if self.state_file.exists() {
            let content = fs::read_to_string(&self.state_file)
                .context("Failed to read state file")?;
            
            serde_json::from_str(&content)
                .context("Failed to parse state file")
        } else {
            Ok(ServiceStateStore {
                services: HashMap::new(),
                last_save: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
                version: "1.0".to_string(),
            })
        }
    }
    
    fn save_state_store(&self, store: &ServiceStateStore) -> Result<()> {
        let content = serde_json::to_string_pretty(store)
            .context("Failed to serialize state")?;
        
        fs::write(&self.state_file, content)
            .context("Failed to write state file")?;
        
        Ok(())
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StateSummary {
    pub total_services: usize,
    pub enabled_services: usize,
    pub running_services: usize,
    pub last_save: u64,
}

impl StateManager {
    pub fn backup_state(&self) -> Result<()> {
        let backup_file = self.state_dir.join(format!("state.backup.{}", 
            SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs()));
        
        if self.state_file.exists() {
            fs::copy(&self.state_file, &backup_file)?;
            info!("Created state backup: {}", backup_file.display());
        }
        
        Ok(())
    }
    
    pub fn restore_state(&self, backup_timestamp: u64) -> Result<()> {
        let backup_file = self.state_dir.join(format!("state.backup.{}", backup_timestamp));
        
        if backup_file.exists() {
            fs::copy(&backup_file, &self.state_file)?;
            info!("Restored state from backup: {}", backup_file.display());
        } else {
            return Err(anyhow::anyhow!("Backup not found for timestamp: {}", backup_timestamp));
        }
        
        Ok(())
    }
    
    pub fn list_backups(&self) -> Result<Vec<u64>> {
        let mut backups = Vec::new();
        
        for entry in fs::read_dir(&self.state_dir)? {
            let entry = entry?;
            let path = entry.path();
            
            if let Some(file_name) = path.file_name() {
                let file_name = file_name.to_string_lossy();
                if file_name.starts_with("state.backup.") {
                    if let Some(timestamp_str) = file_name.strip_prefix("state.backup.") {
                        if let Ok(timestamp) = timestamp_str.parse::<u64>() {
                            backups.push(timestamp);
                        }
                    }
                }
            }
        }
        
        backups.sort();
        Ok(backups)
    }
} 