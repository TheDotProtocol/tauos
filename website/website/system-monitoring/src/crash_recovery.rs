use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{Duration, interval, timeout};
use log::{info, warn, error, debug};
use anyhow::Result;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use sysinfo::{System, SystemExt, ProcessExt};
use dashmap::DashMap;
use nix::unistd::Pid;
use nix::sys::signal::Signal;

use crate::config::{MonitorConfig, CrashRecoveryConfig, RecoveryStrategy};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionState {
    pub timestamp: DateTime<Utc>,
    pub user_id: String,
    pub running_apps: Vec<AppState>,
    pub open_documents: Vec<DocumentState>,
    pub window_positions: HashMap<String, WindowPosition>,
    pub system_state: SystemState,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppState {
    pub name: String,
    pub pid: u32,
    pub command_line: String,
    pub start_time: DateTime<Utc>,
    pub memory_usage_mb: u64,
    pub cpu_usage_percent: f64,
    pub status: AppStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AppStatus {
    Running,
    Suspended,
    Crashed,
    Terminated,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentState {
    pub path: String,
    pub app_name: String,
    pub last_modified: DateTime<Utc>,
    pub is_modified: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WindowPosition {
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
    pub is_maximized: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemState {
    pub cpu_usage_percent: f64,
    pub memory_usage_mb: u64,
    pub disk_usage_percent: f64,
    pub network_status: NetworkStatus,
    pub temperature_celsius: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum NetworkStatus {
    Connected,
    Disconnected,
    Limited,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrashEvent {
    pub timestamp: DateTime<Utc>,
    pub process_name: String,
    pub pid: u32,
    pub crash_type: CrashType,
    pub recovery_attempt: u32,
    pub recovery_strategy: RecoveryStrategy,
    pub success: bool,
    pub error_message: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CrashType {
    ProcessCrashed,
    ProcessHung,
    SystemCrash,
    MemoryExhaustion,
    ResourceExhaustion,
}

pub struct CrashRecovery {
    config: MonitorConfig,
    system: System,
    session_state: Option<SessionState>,
    crash_history: DashMap<String, Vec<CrashEvent>>,
    recovery_attempts: DashMap<u32, u32>,
    is_running: bool,
}

impl CrashRecovery {
    pub fn new(config: MonitorConfig) -> Result<Self> {
        let mut system = System::new_all();
        system.refresh_all();
        
        Ok(Self {
            config,
            system,
            session_state: None,
            crash_history: DashMap::new(),
            recovery_attempts: DashMap::new(),
            is_running: false,
        })
    }
    
    pub async fn run(&mut self) -> Result<()> {
        if !self.config.crash_recovery.enabled {
            info!("Crash recovery disabled");
            return Ok(());
        }
        
        self.is_running = true;
        let mut interval_timer = interval(Duration::from_secs(10)); // Check every 10 seconds
        
        info!("Starting crash recovery system");
        
        // Load existing session state if available
        self.load_session_state().await?;
        
        while self.is_running {
            interval_timer.tick().await;
            
            match self.check_for_crashes().await {
                Ok(()) => {
                    // Continue monitoring
                }
                Err(e) => {
                    error!("Failed to check for crashes: {}", e);
                }
            }
            
            // Save session state periodically
            if self.config.crash_recovery.save_session_state {
                self.save_session_state().await?;
            }
        }
        
        Ok(())
    }
    
    async fn check_for_crashes(&mut self) -> Result<()> {
        self.system.refresh_all();
        
        // Check critical processes
        for process_name in &self.config.crash_recovery.critical_processes {
            if let Some(process) = self.system.process_by_name(process_name).first() {
                let pid = process.pid();
                
                // Check if process is responding
                if !self.is_process_healthy(pid).await? {
                    warn!("Critical process {} (PID {}) is not healthy", process_name, pid);
                    self.handle_crash(process_name, pid, CrashType::ProcessCrashed).await?;
                }
            } else {
                // Process not found - it may have crashed
                warn!("Critical process {} not found - attempting recovery", process_name);
                self.handle_crash(process_name, 0, CrashType::ProcessCrashed).await?;
            }
        }
        
        // Check for hung processes
        self.check_for_hung_processes().await?;
        
        // Check system resources
        self.check_system_health().await?;
        
        Ok(())
    }
    
    async fn is_process_healthy(&self, pid: u32) -> Result<bool> {
        // Try to send a signal to check if process is responsive
        match nix::sys::signal::kill(Pid::from_raw(pid as i32), Signal::SIGCONT) {
            Ok(_) => {
                // Process is responsive
                Ok(true)
            }
            Err(_) => {
                // Process is not responding
                Ok(false)
            }
        }
    }
    
    async fn check_for_hung_processes(&mut self) -> Result<()> {
        let processes = self.system.processes();
        
        for (pid, process) in processes {
            // Check if process has been using high CPU for too long
            if process.cpu_usage() > 90.0 {
                // Check if this is a sustained high CPU usage
                if let Some(attempts) = self.recovery_attempts.get(&pid) {
                    if *attempts > 3 {
                        warn!("Process {} (PID {}) appears to be hung with high CPU usage", 
                            process.name(), pid);
                        self.handle_crash(&process.name(), pid, CrashType::ProcessHung).await?;
                    }
                }
            }
        }
        
        Ok(())
    }
    
    async fn check_system_health(&mut self) -> Result<()> {
        let memory = self.system.memory();
        let memory_usage_percent = (memory.used() as f64 / memory.total() as f64) * 100.0;
        
        // Check for memory exhaustion
        if memory_usage_percent > 95.0 {
            warn!("System memory usage is critical: {:.1}%", memory_usage_percent);
            self.handle_crash("system", 0, CrashType::MemoryExhaustion).await?;
        }
        
        // Check for resource exhaustion
        let process_count = self.system.processes().len();
        if process_count > self.config.process_management.max_concurrent_processes as usize {
            warn!("Too many processes running: {} (limit: {})", 
                process_count, self.config.process_management.max_concurrent_processes);
            self.handle_crash("system", 0, CrashType::ResourceExhaustion).await?;
        }
        
        Ok(())
    }
    
    async fn handle_crash(&mut self, process_name: &str, pid: u32, crash_type: CrashType) -> Result<()> {
        let recovery_attempt = self.recovery_attempts.get(&pid).map(|v| *v).unwrap_or(0);
        
        if recovery_attempt >= self.config.crash_recovery.max_recovery_attempts {
            error!("Maximum recovery attempts reached for process {} (PID {})", process_name, pid);
            return Ok(());
        }
        
        // Increment recovery attempts
        self.recovery_attempts.insert(pid, recovery_attempt + 1);
        
        // Save current session state before recovery
        if self.config.crash_recovery.save_session_state {
            self.save_session_state().await?;
        }
        
        // Try recovery strategies
        for strategy in &self.config.crash_recovery.recovery_strategies {
            match self.apply_recovery_strategy(process_name, pid, strategy).await {
                Ok(success) => {
                    if success {
                        info!("Successfully recovered process {} (PID {}) using strategy {:?}", 
                            process_name, pid, strategy);
                        
                        // Record successful recovery
                        self.record_crash_event(process_name, pid, crash_type.clone(), 
                            recovery_attempt + 1, strategy.clone(), true, None).await;
                        return Ok(());
                    }
                }
                Err(e) => {
                    warn!("Recovery strategy {:?} failed for process {} (PID {}): {}", 
                        strategy, process_name, pid, e);
                }
            }
        }
        
        // All recovery strategies failed
        error!("All recovery strategies failed for process {} (PID {})", process_name, pid);
        self.record_crash_event(process_name, pid, crash_type, recovery_attempt + 1, 
            RecoveryStrategy::Restart, false, Some("All recovery strategies failed".to_string())).await;
        
        Ok(())
    }
    
    async fn apply_recovery_strategy(&mut self, process_name: &str, pid: u32, strategy: &RecoveryStrategy) -> Result<bool> {
        match strategy {
            RecoveryStrategy::Restart => {
                self.restart_process(process_name, pid).await
            }
            RecoveryStrategy::RestartWithDelay { delay_seconds } => {
                tokio::time::sleep(Duration::from_secs(*delay_seconds)).await;
                self.restart_process(process_name, pid).await
            }
            RecoveryStrategy::RestartWithBackoff { max_delay_seconds } => {
                let recovery_attempt = self.recovery_attempts.get(&pid).map(|v| *v).unwrap_or(0);
                let delay = std::cmp::min(*max_delay_seconds, 2u64.pow(recovery_attempt as u32));
                tokio::time::sleep(Duration::from_secs(delay)).await;
                self.restart_process(process_name, pid).await
            }
            RecoveryStrategy::FallbackToSafeMode => {
                self.fallback_to_safe_mode().await
            }
            RecoveryStrategy::NotifyAdmin => {
                self.notify_admin(process_name, pid).await
            }
        }
    }
    
    async fn restart_process(&mut self, process_name: &str, pid: u32) -> Result<bool> {
        if pid > 0 {
            // Kill the existing process
            if let Err(e) = nix::sys::signal::kill(Pid::from_raw(pid as i32), Signal::SIGTERM) {
                warn!("Failed to terminate process {} (PID {}): {}", process_name, pid, e);
            } else {
                // Wait for process to terminate
                tokio::time::sleep(Duration::from_secs(2)).await;
            }
        }
        
        // Start the process again
        match self.start_process(process_name).await {
            Ok(new_pid) => {
                info!("Successfully restarted process {} with new PID {}", process_name, new_pid);
                Ok(true)
            }
            Err(e) => {
                error!("Failed to restart process {}: {}", process_name, e);
                Ok(false)
            }
        }
    }
    
    async fn start_process(&mut self, process_name: &str) -> Result<u32> {
        // This is a simplified implementation
        // In a real system, you would have a process registry or service manager
        let command = match process_name {
            "tau-session" => "tau-session",
            "tau-powerd" => "tau-powerd",
            "tau-inputd" => "tau-inputd",
            "tau-displaysvc" => "tau-displaysvc",
            _ => process_name,
        };
        
        // Start the process using std::process
        let child = std::process::Command::new(command)
            .spawn()?;
        
        Ok(child.id())
    }
    
    async fn fallback_to_safe_mode(&mut self) -> Result<bool> {
        info!("Entering safe mode");
        
        // Stop non-critical processes
        self.stop_non_critical_processes().await?;
        
        // Restart critical processes
        for process_name in &self.config.crash_recovery.critical_processes {
            self.start_process(process_name).await?;
        }
        
        // Restore minimal session state
        self.restore_minimal_session().await?;
        
        info!("Safe mode activated");
        Ok(true)
    }
    
    async fn stop_non_critical_processes(&mut self) -> Result<()> {
        let processes = self.system.processes();
        let critical_processes: std::collections::HashSet<&str> = 
            self.config.crash_recovery.critical_processes.iter().map(|s| s.as_str()).collect();
        
        for (pid, process) in processes {
            if !critical_processes.contains(process.name()) {
                if let Err(e) = nix::sys::signal::kill(Pid::from_raw(pid as i32), Signal::SIGTERM) {
                    debug!("Failed to stop non-critical process {} (PID {}): {}", process.name(), pid, e);
                }
            }
        }
        
        Ok(())
    }
    
    async fn restore_minimal_session(&mut self) -> Result<()> {
        // Create a minimal session state
        let minimal_session = SessionState {
            timestamp: Utc::now(),
            user_id: "safe_mode".to_string(),
            running_apps: vec![],
            open_documents: vec![],
            window_positions: HashMap::new(),
            system_state: SystemState {
                cpu_usage_percent: 0.0,
                memory_usage_mb: 0,
                disk_usage_percent: 0.0,
                network_status: NetworkStatus::Connected,
                temperature_celsius: None,
            },
        };
        
        self.session_state = Some(minimal_session);
        Ok(())
    }
    
    async fn notify_admin(&mut self, process_name: &str, pid: u32) -> Result<bool> {
        // In a real system, this would send a notification to the administrator
        error!("ADMIN NOTIFICATION: Process {} (PID {}) has crashed and requires manual intervention", 
            process_name, pid);
        Ok(false) // Manual intervention required
    }
    
    async fn record_crash_event(&mut self, process_name: &str, pid: u32, crash_type: CrashType, 
                               recovery_attempt: u32, strategy: RecoveryStrategy, success: bool, 
                               error_message: Option<String>) {
        let event = CrashEvent {
            timestamp: Utc::now(),
            process_name: process_name.to_string(),
            pid,
            crash_type,
            recovery_attempt,
            recovery_strategy: strategy,
            success,
            error_message,
        };
        
        let key = format!("{}:{}", process_name, pid);
        let mut events = self.crash_history.entry(key).or_insert_with(Vec::new);
        events.push(event);
        
        // Keep only last 50 events
        if events.len() > 50 {
            events.remove(0);
        }
    }
    
    async fn save_session_state(&mut self) -> Result<()> {
        if let Some(session) = &self.session_state {
            let session_data = serde_json::to_string_pretty(session)?;
            let path = &self.config.crash_recovery.session_state_path;
            
            // Create directory if it doesn't exist
            if let Some(parent) = std::path::Path::new(path).parent() {
                std::fs::create_dir_all(parent)?;
            }
            
            std::fs::write(path, session_data)?;
            debug!("Session state saved to {}", path);
        }
        
        Ok(())
    }
    
    async fn load_session_state(&mut self) -> Result<()> {
        let path = &self.config.crash_recovery.session_state_path;
        
        if let Ok(session_data) = std::fs::read_to_string(path) {
            if let Ok(session) = serde_json::from_str::<SessionState>(&session_data) {
                self.session_state = Some(session);
                info!("Session state loaded from {}", path);
            }
        }
        
        Ok(())
    }
    
    pub fn get_session_state(&self) -> Option<SessionState> {
        self.session_state.clone()
    }
    
    pub fn get_crash_history(&self, process_name: Option<&str>) -> Vec<CrashEvent> {
        if let Some(name) = process_name {
            self.crash_history.iter()
                .filter(|entry| entry.key().starts_with(name))
                .flat_map(|entry| entry.value().clone())
                .collect()
        } else {
            self.crash_history.iter()
                .flat_map(|entry| entry.value().clone())
                .collect()
        }
    }
    
    pub fn stop(&mut self) {
        self.is_running = false;
    }
} 