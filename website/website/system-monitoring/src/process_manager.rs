use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{Duration, interval};
use log::{info, warn, error, debug};
use anyhow::Result;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use sysinfo::{System, SystemExt, ProcessExt};
use dashmap::DashMap;
use nix::unistd::Pid;
use nix::sched::{sched_setaffinity, CpuSet};
use nix::sys::resource::{setrlimit, Resource, Rlimit};

use crate::config::{MonitorConfig, ProcessManagementConfig};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessInfo {
    pub pid: u32,
    pub name: String,
    pub cpu_usage_percent: f64,
    pub memory_usage_mb: u64,
    pub priority: ProcessPriority,
    pub state: ProcessState,
    pub start_time: DateTime<Utc>,
    pub parent_pid: Option<u32>,
    pub children: Vec<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ProcessPriority {
    Critical = 0,
    High = 1,
    Normal = 2,
    Low = 3,
    Background = 4,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ProcessState {
    Running,
    Sleeping,
    Stopped,
    Zombie,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourcePool {
    pub cpu_cores: Vec<u32>,
    pub memory_mb: u64,
    pub max_processes: u32,
    pub current_processes: u32,
    pub available_memory_mb: u64,
}

pub struct ProcessManager {
    config: MonitorConfig,
    system: System,
    processes: DashMap<u32, ProcessInfo>,
    resource_pools: DashMap<String, ResourcePool>,
    process_limits: DashMap<u32, ProcessLimits>,
    is_running: bool,
}

#[derive(Debug, Clone)]
pub struct ProcessLimits {
    pub cpu_limit_percent: f64,
    pub memory_limit_mb: u64,
    pub priority: ProcessPriority,
    pub isolation_level: IsolationLevel,
}

#[derive(Debug, Clone)]
pub enum IsolationLevel {
    None,
    Basic,
    Full,
}

impl ProcessManager {
    pub fn new(config: MonitorConfig) -> Result<Self> {
        let mut system = System::new_all();
        system.refresh_all();
        
        Ok(Self {
            config,
            system,
            processes: DashMap::new(),
            resource_pools: DashMap::new(),
            process_limits: DashMap::new(),
            is_running: false,
        })
    }
    
    pub async fn run(&mut self) -> Result<()> {
        if !self.config.process_management.enabled {
            info!("Process management disabled");
            return Ok(());
        }
        
        self.is_running = true;
        let mut interval_timer = interval(Duration::from_secs(5)); // Check every 5 seconds
        
        info!("Starting process management");
        
        // Initialize resource pools
        self.initialize_resource_pools().await?;
        
        while self.is_running {
            interval_timer.tick().await;
            
            match self.update_process_list().await {
                Ok(()) => {
                    self.manage_processes().await?;
                    self.cleanup_zombies().await?;
                }
                Err(e) => {
                    error!("Failed to update process list: {}", e);
                }
            }
        }
        
        Ok(())
    }
    
    async fn initialize_resource_pools(&mut self) -> Result<()> {
        let cpu_count = num_cpus::get() as u32;
        let memory_mb = self.system.memory().total() / 1024 / 1024;
        
        // Create main resource pool
        let main_pool = ResourcePool {
            cpu_cores: (0..cpu_count).collect(),
            memory_mb,
            max_processes: self.config.process_management.max_concurrent_processes,
            current_processes: 0,
            available_memory_mb: memory_mb,
        };
        
        self.resource_pools.insert("main".to_string(), main_pool);
        
        // Create high-priority pool (20% of resources)
        let high_priority_pool = ResourcePool {
            cpu_cores: (0..(cpu_count / 5)).collect(),
            memory_mb: memory_mb / 5,
            max_processes: self.config.process_management.max_concurrent_processes / 5,
            current_processes: 0,
            available_memory_mb: memory_mb / 5,
        };
        
        self.resource_pools.insert("high_priority".to_string(), high_priority_pool);
        
        info!("Initialized resource pools: {} CPU cores, {} MB memory", cpu_count, memory_mb);
        Ok(())
    }
    
    async fn update_process_list(&mut self) -> Result<()> {
        self.system.refresh_all();
        
        let current_processes: HashMap<u32, ProcessInfo> = self.system.processes()
            .iter()
            .map(|(pid, process)| {
                let priority = self.determine_process_priority(process.name(), *pid);
                let state = self.determine_process_state(process.status());
                
                (*pid, ProcessInfo {
                    pid: *pid,
                    name: process.name().to_string(),
                    cpu_usage_percent: process.cpu_usage(),
                    memory_usage_mb: process.memory() / 1024 / 1024,
                    priority,
                    state,
                    start_time: Utc::now(), // Simplified - would need to parse from /proc
                    parent_pid: process.parent(),
                    children: vec![], // Would need to build from process tree
                })
            })
            .collect();
        
        // Update our process list
        for (pid, info) in current_processes {
            self.processes.insert(pid, info);
        }
        
        // Remove processes that no longer exist
        let current_pids: std::collections::HashSet<u32> = current_processes.keys().cloned().collect();
        let to_remove: Vec<u32> = self.processes.iter()
            .filter_map(|entry| {
                if !current_pids.contains(entry.key()) {
                    Some(*entry.key())
                } else {
                    None
                }
            })
            .collect();
        
        for pid in to_remove {
            self.processes.remove(&pid);
        }
        
        Ok(())
    }
    
    fn determine_process_priority(&self, name: &str, pid: u32) -> ProcessPriority {
        // Critical system processes
        if matches!(name, "tau-session" | "tau-powerd" | "tau-inputd" | "tau-displaysvc") {
            return ProcessPriority::Critical;
        }
        
        // High priority user processes
        if matches!(name, "taukit" | "taustore" | "sandboxd") {
            return ProcessPriority::High;
        }
        
        // Background processes
        if matches!(name, "cron" | "systemd" | "dbus") {
            return ProcessPriority::Background;
        }
        
        // Default to normal priority
        ProcessPriority::Normal
    }
    
    fn determine_process_state(&self, status: sysinfo::ProcessStatus) -> ProcessState {
        match status {
            sysinfo::ProcessStatus::Run => ProcessState::Running,
            sysinfo::ProcessStatus::Sleep => ProcessState::Sleeping,
            sysinfo::ProcessStatus::Stop => ProcessState::Stopped,
            sysinfo::ProcessStatus::Zombie => ProcessState::Zombie,
            _ => ProcessState::Unknown,
        }
    }
    
    async fn manage_processes(&mut self) -> Result<()> {
        let config = &self.config.process_management;
        
        // Check process limits
        for process in self.processes.iter() {
            let pid = *process.key();
            let info = process.value();
            
            // Apply resource limits
            self.apply_process_limits(pid, info).await?;
            
            // Check memory usage
            if info.memory_usage_mb > config.memory_limit_mb {
                warn!("Process {} ({}) exceeded memory limit: {} MB > {} MB", 
                    info.name, pid, info.memory_usage_mb, config.memory_limit_mb);
                self.handle_memory_limit_exceeded(pid, info).await?;
            }
            
            // Check CPU usage
            if info.cpu_usage_percent > config.cpu_limit_percent {
                warn!("Process {} ({}) exceeded CPU limit: {:.1}% > {:.1}%", 
                    info.name, pid, info.cpu_usage_percent, config.cpu_limit_percent);
                self.handle_cpu_limit_exceeded(pid, info).await?;
            }
        }
        
        // Update resource pool usage
        self.update_resource_pools().await?;
        
        Ok(())
    }
    
    async fn apply_process_limits(&mut self, pid: u32, info: &ProcessInfo) -> Result<()> {
        let limits = self.get_or_create_process_limits(pid, info);
        
        // Set CPU affinity
        if let Ok(cpu_set) = CpuSet::new() {
            match info.priority {
                ProcessPriority::Critical => {
                    // Use all cores
                    for i in 0..num_cpus::get() {
                        cpu_set.set(i)?;
                    }
                }
                ProcessPriority::High => {
                    // Use first half of cores
                    for i in 0..(num_cpus::get() / 2) {
                        cpu_set.set(i)?;
                    }
                }
                ProcessPriority::Normal => {
                    // Use first quarter of cores
                    for i in 0..(num_cpus::get() / 4) {
                        cpu_set.set(i)?;
                    }
                }
                ProcessPriority::Low | ProcessPriority::Background => {
                    // Use only one core
                    cpu_set.set(0)?;
                }
            }
            
            if let Err(e) = sched_setaffinity(Pid::from_raw(pid as i32), &cpu_set) {
                debug!("Failed to set CPU affinity for process {}: {}", pid, e);
            }
        }
        
        // Set resource limits
        if let Err(e) = setrlimit(Resource::RLIMIT_AS, Rlimit::new(
            limits.memory_limit_mb * 1024 * 1024, // Convert to bytes
            limits.memory_limit_mb * 1024 * 1024
        )) {
            debug!("Failed to set memory limit for process {}: {}", pid, e);
        }
        
        Ok(())
    }
    
    fn get_or_create_process_limits(&mut self, pid: u32, info: &ProcessInfo) -> ProcessLimits {
        if let Some(limits) = self.process_limits.get(&pid) {
            return limits.clone();
        }
        
        let limits = ProcessLimits {
            cpu_limit_percent: self.config.process_management.cpu_limit_percent,
            memory_limit_mb: self.config.process_management.memory_limit_mb,
            priority: info.priority.clone(),
            isolation_level: if self.config.process_management.process_isolation {
                IsolationLevel::Basic
            } else {
                IsolationLevel::None
            },
        };
        
        self.process_limits.insert(pid, limits.clone());
        limits
    }
    
    async fn handle_memory_limit_exceeded(&mut self, pid: u32, info: &ProcessInfo) -> Result<()> {
        match info.priority {
            ProcessPriority::Critical => {
                // For critical processes, try to free memory from other processes
                self.free_memory_from_lower_priority_processes().await?;
            }
            ProcessPriority::High => {
                // For high priority processes, reduce memory usage of normal processes
                self.reduce_memory_usage_of_normal_processes().await?;
            }
            _ => {
                // For other processes, kill them if they exceed limits
                warn!("Killing process {} ({}) due to memory limit exceeded", info.name, pid);
                self.kill_process(pid).await?;
            }
        }
        Ok(())
    }
    
    async fn handle_cpu_limit_exceeded(&mut self, pid: u32, info: &ProcessInfo) -> Result<()> {
        match info.priority {
            ProcessPriority::Critical => {
                // For critical processes, reduce CPU usage of other processes
                self.reduce_cpu_usage_of_other_processes(pid).await?;
            }
            ProcessPriority::High => {
                // For high priority processes, throttle lower priority processes
                self.throttle_lower_priority_processes().await?;
            }
            _ => {
                // For other processes, throttle them
                self.throttle_process(pid).await?;
            }
        }
        Ok(())
    }
    
    async fn free_memory_from_lower_priority_processes(&mut self) -> Result<()> {
        // Find lower priority processes and reduce their memory usage
        for process in self.processes.iter() {
            let info = process.value();
            if matches!(info.priority, ProcessPriority::Normal | ProcessPriority::Low | ProcessPriority::Background) {
                // Send SIGUSR1 to request memory cleanup
                if let Err(e) = nix::sys::signal::kill(Pid::from_raw(info.pid as i32), nix::sys::signal::Signal::SIGUSR1) {
                    debug!("Failed to send SIGUSR1 to process {}: {}", info.pid, e);
                }
            }
        }
        Ok(())
    }
    
    async fn reduce_memory_usage_of_normal_processes(&mut self) -> Result<()> {
        // Similar to above but only target normal priority processes
        for process in self.processes.iter() {
            let info = process.value();
            if matches!(info.priority, ProcessPriority::Normal) {
                if let Err(e) = nix::sys::signal::kill(Pid::from_raw(info.pid as i32), nix::sys::signal::Signal::SIGUSR1) {
                    debug!("Failed to send SIGUSR1 to process {}: {}", info.pid, e);
                }
            }
        }
        Ok(())
    }
    
    async fn reduce_cpu_usage_of_other_processes(&mut self, critical_pid: u32) -> Result<()> {
        // Throttle all non-critical processes
        for process in self.processes.iter() {
            let info = process.value();
            if info.pid != critical_pid && !matches!(info.priority, ProcessPriority::Critical) {
                self.throttle_process(info.pid).await?;
            }
        }
        Ok(())
    }
    
    async fn throttle_lower_priority_processes(&mut self) -> Result<()> {
        // Throttle normal and lower priority processes
        for process in self.processes.iter() {
            let info = process.value();
            if matches!(info.priority, ProcessPriority::Normal | ProcessPriority::Low | ProcessPriority::Background) {
                self.throttle_process(info.pid).await?;
            }
        }
        Ok(())
    }
    
    async fn throttle_process(&mut self, pid: u32) -> Result<()> {
        // Send SIGSTOP to pause the process briefly
        if let Err(e) = nix::sys::signal::kill(Pid::from_raw(pid as i32), nix::sys::signal::Signal::SIGSTOP) {
            debug!("Failed to throttle process {}: {}", pid, e);
        } else {
            // Resume after a short delay
            tokio::time::sleep(Duration::from_millis(100)).await;
            if let Err(e) = nix::sys::signal::kill(Pid::from_raw(pid as i32), nix::sys::signal::Signal::SIGCONT) {
                debug!("Failed to resume process {}: {}", pid, e);
            }
        }
        Ok(())
    }
    
    async fn kill_process(&mut self, pid: u32) -> Result<()> {
        if let Err(e) = nix::sys::signal::kill(Pid::from_raw(pid as i32), nix::sys::signal::Signal::SIGTERM) {
            error!("Failed to kill process {}: {}", pid, e);
        }
        Ok(())
    }
    
    async fn update_resource_pools(&mut self) -> Result<()> {
        for pool in self.resource_pools.iter_mut() {
            let mut pool = pool.value_mut();
            pool.current_processes = self.processes.iter()
                .filter(|process| {
                    // Simplified logic - would need more sophisticated pool assignment
                    matches!(process.value().priority, ProcessPriority::Critical | ProcessPriority::High)
                })
                .count() as u32;
            
            let total_memory_used: u64 = self.processes.iter()
                .map(|process| process.value().memory_usage_mb)
                .sum();
            
            pool.available_memory_mb = if total_memory_used < pool.memory_mb {
                pool.memory_mb - total_memory_used
            } else {
                0
            };
        }
        Ok(())
    }
    
    async fn cleanup_zombies(&mut self) -> Result<()> {
        if !self.config.process_management.auto_cleanup_zombies {
            return Ok(());
        }
        
        let zombie_pids: Vec<u32> = self.processes.iter()
            .filter(|process| matches!(process.value().state, ProcessState::Zombie))
            .map(|process| *process.key())
            .collect();
        
        for pid in zombie_pids {
            info!("Cleaning up zombie process {}", pid);
            self.processes.remove(&pid);
            
            // Wait for the zombie process to be reaped
            if let Err(e) = nix::sys::wait::waitpid(Pid::from_raw(pid as i32), None) {
                debug!("Failed to reap zombie process {}: {}", pid, e);
            }
        }
        
        Ok(())
    }
    
    pub fn get_process_info(&self, pid: u32) -> Option<ProcessInfo> {
        self.processes.get(&pid).map(|info| info.clone())
    }
    
    pub fn get_all_processes(&self) -> Vec<ProcessInfo> {
        self.processes.iter().map(|entry| entry.value().clone()).collect()
    }
    
    pub fn get_resource_pools(&self) -> Vec<(String, ResourcePool)> {
        self.resource_pools.iter()
            .map(|entry| (entry.key().clone(), entry.value().clone()))
            .collect()
    }
    
    pub fn stop(&mut self) {
        self.is_running = false;
    }
} 