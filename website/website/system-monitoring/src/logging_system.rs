use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{Duration, interval};
use log::{info, warn, error, debug};
use anyhow::Result;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use std::fs::{self, File, OpenOptions};
use std::io::{Write, BufWriter};
use std::path::Path;
use flate2::write::GzEncoder;
use flate2::Compression;

use crate::config::{MonitorConfig, LoggingConfig};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub timestamp: DateTime<Utc>,
    pub level: LogLevel,
    pub component: String,
    pub message: String,
    pub details: HashMap<String, String>,
    pub trace_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LogLevel {
    Debug,
    Info,
    Warning,
    Error,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditLogEntry {
    pub timestamp: DateTime<Utc>,
    pub user_id: String,
    pub action: String,
    pub resource: String,
    pub result: AuditResult,
    pub details: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AuditResult {
    Success,
    Failure,
    Denied,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceLogEntry {
    pub timestamp: DateTime<Utc>,
    pub component: String,
    pub operation: String,
    pub duration_ms: u64,
    pub memory_usage_mb: u64,
    pub cpu_usage_percent: f64,
    pub details: HashMap<String, String>,
}

pub struct LoggingSystem {
    config: MonitorConfig,
    log_file: Option<File>,
    audit_file: Option<File>,
    performance_file: Option<File>,
    log_buffer: Vec<LogEntry>,
    audit_buffer: Vec<AuditLogEntry>,
    performance_buffer: Vec<PerformanceLogEntry>,
    is_running: bool,
    current_log_size: u64,
    current_audit_size: u64,
    current_performance_size: u64,
}

impl LoggingSystem {
    pub fn new(config: MonitorConfig) -> Result<Self> {
        let log_file = Self::open_log_file(&config.logging.log_file_path)?;
        let audit_file = if config.logging.audit_logging {
            Some(Self::open_log_file(&format!("{}.audit", config.logging.log_file_path))?)
        } else {
            None
        };
        let performance_file = if config.logging.performance_logging {
            Some(Self::open_log_file(&format!("{}.performance", config.logging.log_file_path))?)
        } else {
            None
        };
        
        Ok(Self {
            config,
            log_file,
            audit_file,
            performance_file,
            log_buffer: Vec::new(),
            audit_buffer: Vec::new(),
            performance_buffer: Vec::new(),
            is_running: false,
            current_log_size: 0,
            current_audit_size: 0,
            current_performance_size: 0,
        })
    }
    
    fn open_log_file(path: &str) -> Result<Option<File>> {
        if let Some(parent) = Path::new(path).parent() {
            fs::create_dir_all(parent)?;
        }
        
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(path)?;
        
        Ok(Some(file))
    }
    
    pub async fn run(&mut self) -> Result<()> {
        if !self.config.logging.structured_logging {
            info!("Structured logging disabled");
            return Ok(());
        }
        
        self.is_running = true;
        let mut interval_timer = interval(Duration::from_secs(5)); // Flush every 5 seconds
        
        info!("Starting logging system");
        
        while self.is_running {
            interval_timer.tick().await;
            
            // Flush buffers to disk
            self.flush_logs().await?;
            
            // Check log rotation
            self.check_log_rotation().await?;
        }
        
        Ok(())
    }
    
    pub async fn log(&mut self, level: LogLevel, component: &str, message: &str, details: HashMap<String, String>) {
        let entry = LogEntry {
            timestamp: Utc::now(),
            level,
            component: component.to_string(),
            message: message.to_string(),
            details,
            trace_id: None, // Would be generated in a real system
        };
        
        self.log_buffer.push(entry);
        
        // Flush immediately for critical logs
        if matches!(level, LogLevel::Critical | LogLevel::Error) {
            if let Err(e) = self.flush_logs().await {
                error!("Failed to flush logs: {}", e);
            }
        }
    }
    
    pub async fn audit_log(&mut self, user_id: &str, action: &str, resource: &str, result: AuditResult, details: HashMap<String, String>) {
        if !self.config.logging.audit_logging {
            return;
        }
        
        let entry = AuditLogEntry {
            timestamp: Utc::now(),
            user_id: user_id.to_string(),
            action: action.to_string(),
            resource: resource.to_string(),
            result,
            details,
        };
        
        self.audit_buffer.push(entry);
    }
    
    pub async fn performance_log(&mut self, component: &str, operation: &str, duration_ms: u64, memory_usage_mb: u64, cpu_usage_percent: f64, details: HashMap<String, String>) {
        if !self.config.logging.performance_logging {
            return;
        }
        
        let entry = PerformanceLogEntry {
            timestamp: Utc::now(),
            component: component.to_string(),
            operation: operation.to_string(),
            duration_ms,
            memory_usage_mb,
            cpu_usage_percent,
            details,
        };
        
        self.performance_buffer.push(entry);
    }
    
    async fn flush_logs(&mut self) -> Result<()> {
        // Flush main logs
        if let Some(ref mut file) = self.log_file {
            for entry in &self.log_buffer {
                let json = serde_json::to_string(entry)?;
                writeln!(file, "{}", json)?;
                self.current_log_size += json.len() as u64 + 1; // +1 for newline
            }
            file.flush()?;
            self.log_buffer.clear();
        }
        
        // Flush audit logs
        if let Some(ref mut file) = self.audit_file {
            for entry in &self.audit_buffer {
                let json = serde_json::to_string(entry)?;
                writeln!(file, "{}", json)?;
                self.current_audit_size += json.len() as u64 + 1;
            }
            file.flush()?;
            self.audit_buffer.clear();
        }
        
        // Flush performance logs
        if let Some(ref mut file) = self.performance_file {
            for entry in &self.performance_buffer {
                let json = serde_json::to_string(entry)?;
                writeln!(file, "{}", json)?;
                self.current_performance_size += json.len() as u64 + 1;
            }
            file.flush()?;
            self.performance_buffer.clear();
        }
        
        Ok(())
    }
    
    async fn check_log_rotation(&mut self) -> Result<()> {
        let max_size_bytes = self.config.logging.max_log_size_mb * 1024 * 1024;
        
        // Check main log file
        if self.current_log_size > max_size_bytes {
            self.rotate_log_file(&self.config.logging.log_file_path).await?;
            self.current_log_size = 0;
        }
        
        // Check audit log file
        if self.current_audit_size > max_size_bytes {
            let audit_path = format!("{}.audit", self.config.logging.log_file_path);
            self.rotate_log_file(&audit_path).await?;
            self.current_audit_size = 0;
        }
        
        // Check performance log file
        if self.current_performance_size > max_size_bytes {
            let performance_path = format!("{}.performance", self.config.logging.log_file_path);
            self.rotate_log_file(&performance_path).await?;
            self.current_performance_size = 0;
        }
        
        Ok(())
    }
    
    async fn rotate_log_file(&mut self, path: &str) -> Result<()> {
        if !self.config.logging.log_rotation {
            return Ok(());
        }
        
        // Create backup filename with timestamp
        let timestamp = Utc::now().format("%Y%m%d_%H%M%S");
        let backup_path = format!("{}.{}", path, timestamp);
        
        // Rename current file to backup
        if Path::new(path).exists() {
            fs::rename(path, &backup_path)?;
        }
        
        // Compress backup if enabled
        if self.config.logging.log_compression {
            self.compress_log_file(&backup_path).await?;
        }
        
        // Create new log file
        self.log_file = Self::open_log_file(path)?;
        
        info!("Rotated log file: {} -> {}", path, backup_path);
        
        // Clean up old log files
        self.cleanup_old_logs(path).await?;
        
        Ok(())
    }
    
    async fn compress_log_file(&mut self, path: &str) -> Result<()> {
        let compressed_path = format!("{}.gz", path);
        
        let input = fs::read(path)?;
        let output = File::create(&compressed_path)?;
        let mut encoder = GzEncoder::new(output, Compression::default());
        encoder.write_all(&input)?;
        encoder.finish()?;
        
        // Remove original file
        fs::remove_file(path)?;
        
        Ok(())
    }
    
    async fn cleanup_old_logs(&mut self, base_path: &str) -> Result<()> {
        let max_files = self.config.general.max_log_files;
        
        if let Some(parent) = Path::new(base_path).parent() {
            if let Ok(entries) = fs::read_dir(parent) {
                let mut log_files: Vec<_> = entries
                    .filter_map(|entry| entry.ok())
                    .filter(|entry| {
                        let name = entry.file_name().to_string_lossy();
                        name.starts_with(Path::new(base_path).file_name().unwrap().to_string_lossy().as_ref())
                    })
                    .collect();
                
                // Sort by modification time (oldest first)
                log_files.sort_by(|a, b| {
                    a.metadata().unwrap().modified().unwrap()
                        .cmp(&b.metadata().unwrap().modified().unwrap())
                });
                
                // Remove oldest files if we have too many
                while log_files.len() > max_files as usize {
                    if let Some(oldest) = log_files.first() {
                        if let Err(e) = fs::remove_file(oldest.path()) {
                            warn!("Failed to remove old log file {:?}: {}", oldest.path(), e);
                        }
                        log_files.remove(0);
                    }
                }
            }
        }
        
        Ok(())
    }
    
    pub async fn get_log_stats(&self) -> HashMap<String, u64> {
        let mut stats = HashMap::new();
        stats.insert("log_buffer_size".to_string(), self.log_buffer.len() as u64);
        stats.insert("audit_buffer_size".to_string(), self.audit_buffer.len() as u64);
        stats.insert("performance_buffer_size".to_string(), self.performance_buffer.len() as u64);
        stats.insert("current_log_size_bytes".to_string(), self.current_log_size);
        stats.insert("current_audit_size_bytes".to_string(), self.current_audit_size);
        stats.insert("current_performance_size_bytes".to_string(), self.current_performance_size);
        stats
    }
    
    pub fn stop(&mut self) {
        self.is_running = false;
    }
} 