use anyhow::{Result, Context};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::VecDeque;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use log::{info, warn, error};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JournalEntry {
    pub timestamp: DateTime<Utc>,
    pub service: String,
    pub stream: String, // "stdout", "stderr", "system"
    pub message: String,
    pub pid: Option<u32>,
    pub level: LogLevel,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum LogLevel {
    Debug,
    Info,
    Warning,
    Error,
    Critical,
}

pub struct JournalLogger {
    journal_dir: PathBuf,
    max_entries: usize,
    entries: Arc<Mutex<VecDeque<JournalEntry>>>,
}

impl JournalLogger {
    pub fn new() -> Result<Self> {
        let journal_dir = PathBuf::from("/var/log/tau/journal");
        fs::create_dir_all(&journal_dir)
            .context("Failed to create journal directory")?;
        
        Ok(Self {
            journal_dir,
            max_entries: 10000, // Keep last 10k entries in memory
            entries: Arc::new(Mutex::new(VecDeque::new())),
        })
    }
    
    pub fn log(&self, service: &str, stream: &str, message: &str) -> Result<()> {
        let entry = JournalEntry {
            timestamp: Utc::now(),
            service: service.to_string(),
            stream: stream.to_string(),
            message: message.to_string(),
            pid: None, // Will be set by caller if needed
            level: self.determine_level(message),
        };
        
        // Add to memory buffer
        {
            let mut entries = self.entries.lock().unwrap();
            entries.push_back(entry.clone());
            
            // Trim if too many entries
            while entries.len() > self.max_entries {
                entries.pop_front();
            }
        }
        
        // Write to file
        self.write_to_file(&entry)?;
        
        Ok(())
    }
    
    pub fn get_logs(&self, service: &str, limit: Option<usize>) -> Vec<JournalEntry> {
        let entries = self.entries.lock().unwrap();
        
        let filtered: Vec<JournalEntry> = entries
            .iter()
            .filter(|entry| entry.service == service)
            .cloned()
            .collect();
        
        if let Some(limit) = limit {
            filtered.into_iter().rev().take(limit).rev().collect()
        } else {
            filtered
        }
    }
    
    pub fn get_logs_follow(&self, service: &str) -> impl Iterator<Item = JournalEntry> {
        // This would be implemented with file watching in a real system
        // For now, return an empty iterator
        std::iter::empty()
    }
    
    pub fn clear_logs(&self, service: Option<&str>) -> Result<()> {
        if let Some(service) = service {
            // Clear logs for specific service
            let service_file = self.journal_dir.join(format!("{}.log", service));
            if service_file.exists() {
                fs::remove_file(&service_file)?;
            }
            
            // Remove from memory buffer
            {
                let mut entries = self.entries.lock().unwrap();
                entries.retain(|entry| entry.service != service);
            }
        } else {
            // Clear all logs
            for entry in fs::read_dir(&self.journal_dir)? {
                let entry = entry?;
                if entry.path().extension().map_or(false, |ext| ext == "log") {
                    fs::remove_file(entry.path())?;
                }
            }
            
            // Clear memory buffer
            {
                let mut entries = self.entries.lock().unwrap();
                entries.clear();
            }
        }
        
        Ok(())
    }
    
    pub fn list_services(&self) -> Vec<String> {
        let entries = self.entries.lock().unwrap();
        let mut services = std::collections::HashSet::new();
        
        for entry in entries.iter() {
            services.insert(entry.service.clone());
        }
        
        services.into_iter().collect()
    }
    
    fn write_to_file(&self, entry: &JournalEntry) -> Result<()> {
        let service_file = self.journal_dir.join(format!("{}.log", entry.service));
        
        let log_line = format!(
            "{} [{}] {}: {}\n",
            entry.timestamp.format("%Y-%m-%d %H:%M:%S"),
            entry.stream.to_uppercase(),
            entry.level.to_string(),
            entry.message
        );
        
        // Append to file
        use std::io::Write;
        let mut file = std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&service_file)?;
        
        file.write_all(log_line.as_bytes())?;
        
        Ok(())
    }
    
    fn determine_level(&self, message: &str) -> LogLevel {
        let message_lower = message.to_lowercase();
        
        if message_lower.contains("error") || message_lower.contains("fatal") {
            LogLevel::Error
        } else if message_lower.contains("warning") || message_lower.contains("warn") {
            LogLevel::Warning
        } else if message_lower.contains("debug") {
            LogLevel::Debug
        } else if message_lower.contains("critical") {
            LogLevel::Critical
        } else {
            LogLevel::Info
        }
    }
    
    pub fn load_existing_logs(&self) -> Result<()> {
        for entry in fs::read_dir(&self.journal_dir)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.extension().map_or(false, |ext| ext == "log") {
                if let Some(service_name) = path.file_stem() {
                    self.load_service_logs(service_name.to_string_lossy().as_ref())?;
                }
            }
        }
        
        Ok(())
    }
    
    fn load_service_logs(&self, service: &str) -> Result<()> {
        let service_file = self.journal_dir.join(format!("{}.log", service));
        
        if !service_file.exists() {
            return Ok(());
        }
        
        let content = fs::read_to_string(&service_file)?;
        
        for line in content.lines() {
            if let Ok(entry) = self.parse_log_line(line, service) {
                let mut entries = self.entries.lock().unwrap();
                entries.push_back(entry);
            }
        }
        
        Ok(())
    }
    
    fn parse_log_line(&self, line: &str, service: &str) -> Result<JournalEntry> {
        // Parse log line format: "2024-01-01 12:00:00 [STDOUT] INFO: message"
        let parts: Vec<&str> = line.splitn(4, ' ').collect();
        
        if parts.len() < 4 {
            return Err(anyhow::anyhow!("Invalid log line format"));
        }
        
        let timestamp_str = format!("{} {}", parts[0], parts[1]);
        let timestamp = DateTime::parse_from_str(&timestamp_str, "%Y-%m-%d %H:%M:%S")?
            .with_timezone(&Utc);
        
        let stream_part = parts[2].trim_matches('[').trim_matches(']');
        let stream = stream_part.to_lowercase();
        
        let level_message = parts[3];
        let colon_pos = level_message.find(':').unwrap_or(0);
        let level_str = &level_message[..colon_pos];
        let message = &level_message[colon_pos + 1..].trim();
        
        let level = match level_str.to_uppercase().as_str() {
            "DEBUG" => LogLevel::Debug,
            "INFO" => LogLevel::Info,
            "WARNING" => LogLevel::Warning,
            "ERROR" => LogLevel::Error,
            "CRITICAL" => LogLevel::Critical,
            _ => LogLevel::Info,
        };
        
        Ok(JournalEntry {
            timestamp,
            service: service.to_string(),
            stream,
            message: message.to_string(),
            pid: None,
            level,
        })
    }
}

impl Clone for JournalLogger {
    fn clone(&self) -> Self {
        Self {
            journal_dir: self.journal_dir.clone(),
            max_entries: self.max_entries,
            entries: Arc::clone(&self.entries),
        }
    }
}

impl std::fmt::Display for LogLevel {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            LogLevel::Debug => write!(f, "DEBUG"),
            LogLevel::Info => write!(f, "INFO"),
            LogLevel::Warning => write!(f, "WARNING"),
            LogLevel::Error => write!(f, "ERROR"),
            LogLevel::Critical => write!(f, "CRITICAL"),
        }
    }
} 