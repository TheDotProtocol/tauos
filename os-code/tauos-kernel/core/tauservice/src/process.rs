use crate::unit::ServiceUnit;
use crate::journal::JournalLogger;
use anyhow::{Result, Context};
use std::process::{Command, Stdio, Child};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::io::{AsyncReadExt, BufReader};
use tokio::process::Command as TokioCommand;
use nix::sys::signal::{kill, Signal};
use nix::unistd::Pid;
use log::{info, warn, error, debug};

pub struct ServiceProcess {
    unit: ServiceUnit,
    child: Option<Child>,
    pid: Option<u32>,
    journal_logger: Arc<JournalLogger>,
    stdout_handle: Option<tokio::task::JoinHandle<()>>,
    stderr_handle: Option<tokio::task::JoinHandle<()>>,
}

impl ServiceProcess {
    pub fn new(unit: &ServiceUnit, journal_logger: &JournalLogger) -> Result<Self> {
        Ok(Self {
            unit: unit.clone(),
            child: None,
            pid: None,
            journal_logger: Arc::new(journal_logger.clone()),
            stdout_handle: None,
            stderr_handle: None,
        })
    }
    
    pub fn start(&mut self) -> Result<()> {
        info!("Starting process for service: {}", self.unit.name);
        
        let exec_start = self.unit.service.exec_start.as_ref()
            .ok_or_else(|| anyhow::anyhow!("No ExecStart specified"))?;
        
        // Parse command and arguments
        let (command, args) = self.parse_command(exec_start)?;
        
        // Build command
        let mut cmd = Command::new(command);
        cmd.args(args);
        
        // Set working directory
        if let Some(working_dir) = &self.unit.service.working_directory {
            cmd.current_dir(working_dir);
        }
        
        // Set user/group if specified
        if let Some(user) = &self.unit.service.user {
            // In a real implementation, you'd set the user here
            debug!("Would run as user: {}", user);
        }
        
        // Set environment variables
        if let Some(env) = &self.unit.service.environment {
            for (key, value) in env {
                cmd.env(key, value);
            }
        }
        
        // Load environment files
        if let Some(env_files) = &self.unit.service.environment_file {
            for file in env_files {
                self.load_environment_file(&mut cmd, file)?;
            }
        }
        
        // Set up output handling
        cmd.stdout(Stdio::piped());
        cmd.stderr(Stdio::piped());
        
        // Apply sandboxing if configured
        self.apply_sandboxing(&mut cmd)?;
        
        // Start the process
        let mut child = cmd.spawn()
            .context("Failed to start service process")?;
        
        self.pid = child.id();
        self.child = Some(child);
        
        // Start output logging
        self.start_output_logging()?;
        
        info!("Process started with PID: {}", self.pid.unwrap());
        Ok(())
    }
    
    pub fn stop(&mut self) -> Result<()> {
        if let Some(pid) = self.pid {
            info!("Stopping process with PID: {}", pid);
            
            // Try graceful stop first
            if let Some(exec_stop) = &self.unit.service.exec_stop {
                self.execute_stop_command(exec_stop)?;
            } else {
                // Send SIGTERM
                kill(Pid::from_raw(pid as i32), Signal::SIGTERM)
                    .context("Failed to send SIGTERM")?;
            }
            
            // Wait for process to terminate
            if let Some(mut child) = self.child.take() {
                match child.wait() {
                    Ok(status) => {
                        info!("Process {} exited with status: {:?}", pid, status);
                    }
                    Err(e) => {
                        warn!("Error waiting for process {}: {}", pid, e);
                    }
                }
            }
            
            // Cancel output logging tasks
            if let Some(handle) = self.stdout_handle.take() {
                handle.abort();
            }
            if let Some(handle) = self.stderr_handle.take() {
                handle.abort();
            }
            
            self.pid = None;
        }
        
        Ok(())
    }
    
    pub fn reload(&mut self) -> Result<()> {
        if let Some(pid) = self.pid {
            info!("Reloading process with PID: {}", pid);
            
            if let Some(exec_reload) = &self.unit.service.exec_reload {
                self.execute_reload_command(exec_reload)?;
            } else {
                // Send SIGHUP for graceful reload
                kill(Pid::from_raw(pid as i32), Signal::SIGHUP)
                    .context("Failed to send SIGHUP")?;
            }
        }
        
        Ok(())
    }
    
    pub fn get_pid(&self) -> Option<u32> {
        self.pid
    }
    
    pub fn is_running(&self) -> bool {
        if let Some(pid) = self.pid {
            // Check if process is still running
            kill(Pid::from_raw(pid as i32), Signal::SIGCONT).is_ok()
        } else {
            false
        }
    }
    
    fn parse_command(&self, command: &str) -> Result<(String, Vec<String>)> {
        let parts: Vec<&str> = command.split_whitespace().collect();
        
        if parts.is_empty() {
            return Err(anyhow::anyhow!("Empty command"));
        }
        
        let cmd = parts[0].to_string();
        let args = parts[1..].iter().map(|s| s.to_string()).collect();
        
        Ok((cmd, args))
    }
    
    fn load_environment_file(&self, cmd: &mut Command, file: &str) -> Result<()> {
        let content = std::fs::read_to_string(file)
            .context(format!("Failed to read environment file: {}", file))?;
        
        for line in content.lines() {
            let line = line.trim();
            if !line.is_empty() && !line.starts_with('#') {
                if let Some(equal_pos) = line.find('=') {
                    let key = &line[..equal_pos];
                    let value = &line[equal_pos + 1..];
                    cmd.env(key, value);
                }
            }
        }
        
        Ok(())
    }
    
    fn apply_sandboxing(&self, cmd: &mut Command) -> Result<()> {
        if let Some(sandbox) = &self.unit.sandbox {
            // Apply sandboxing options
            if sandbox.no_new_privileges.unwrap_or(false) {
                // In a real implementation, you'd set no_new_privileges
                debug!("Would set no_new_privileges");
            }
            
            if sandbox.private_tmp.unwrap_or(false) {
                // In a real implementation, you'd set up private /tmp
                debug!("Would set up private /tmp");
            }
            
            if sandbox.private_devices.unwrap_or(false) {
                // In a real implementation, you'd restrict device access
                debug!("Would restrict device access");
            }
            
            if let Some(capabilities) = &sandbox.capabilities {
                // In a real implementation, you'd set capabilities
                debug!("Would set capabilities: {:?}", capabilities);
            }
        }
        
        Ok(())
    }
    
    fn execute_stop_command(&self, command: &str) -> Result<()> {
        let (cmd, args) = self.parse_command(command)?;
        
        let output = Command::new(cmd)
            .args(args)
            .output()
            .context("Failed to execute stop command")?;
        
        if !output.status.success() {
            warn!("Stop command failed: {:?}", output.status);
        }
        
        Ok(())
    }
    
    fn execute_reload_command(&self, command: &str) -> Result<()> {
        let (cmd, args) = self.parse_command(command)?;
        
        let output = Command::new(cmd)
            .args(args)
            .output()
            .context("Failed to execute reload command")?;
        
        if !output.status.success() {
            warn!("Reload command failed: {:?}", output.status);
        }
        
        Ok(())
    }
    
    fn start_output_logging(&mut self) -> Result<()> {
        if let Some(child) = &mut self.child {
            let service_name = self.unit.name.clone();
            let journal_logger = Arc::clone(&self.journal_logger);
            
            // Handle stdout
            if let Some(stdout) = child.stdout.take() {
                let handle = tokio::spawn(async move {
                    let mut reader = BufReader::new(stdout);
                    let mut buffer = [0; 1024];
                    
                    while let Ok(n) = reader.read(&mut buffer).await {
                        if n == 0 { break; }
                        
                        let output = String::from_utf8_lossy(&buffer[..n]);
                        for line in output.lines() {
                            if !line.trim().is_empty() {
                                journal_logger.log(&service_name, "stdout", line).ok();
                            }
                        }
                    }
                });
                self.stdout_handle = Some(handle);
            }
            
            // Handle stderr
            if let Some(stderr) = child.stderr.take() {
                let handle = tokio::spawn(async move {
                    let mut reader = BufReader::new(stderr);
                    let mut buffer = [0; 1024];
                    
                    while let Ok(n) = reader.read(&mut buffer).await {
                        if n == 0 { break; }
                        
                        let output = String::from_utf8_lossy(&buffer[..n]);
                        for line in output.lines() {
                            if !line.trim().is_empty() {
                                journal_logger.log(&service_name, "stderr", line).ok();
                            }
                        }
                    }
                });
                self.stderr_handle = Some(handle);
            }
        }
        
        Ok(())
    }
} 