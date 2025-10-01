use std::fs::{File, OpenOptions};
use std::io::{self, Write};
use std::path::Path;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct SessionLogger {
    log_file: String,
    file_handle: Mutex<Option<File>>,
    log_level: LogLevel,
    audit_enabled: bool,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum LogLevel {
    Debug,
    Info,
    Warning,
    Error,
    Audit,
}

impl LogLevel {
    fn as_str(&self) -> &'static str {
        match self {
            LogLevel::Debug => "DEBUG",
            LogLevel::Info => "INFO",
            LogLevel::Warning => "WARN",
            LogLevel::Error => "ERROR",
            LogLevel::Audit => "AUDIT",
        }
    }
}

impl SessionLogger {
    pub fn new(log_file: &str) -> Result<Self, Box<dyn std::error::Error>> {
        // Ensure log directory exists
        if let Some(parent) = Path::new(log_file).parent() {
            std::fs::create_dir_all(parent)?;
        }
        
        let logger = SessionLogger {
            log_file: log_file.to_string(),
            file_handle: Mutex::new(None),
            log_level: LogLevel::Info,
            audit_enabled: true,
        };
        
        // Initialize log file
        logger.init_log_file()?;
        
        Ok(logger)
    }
    
    fn init_log_file(&self) -> Result<(), Box<dyn std::error::Error>> {
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&self.log_file)?;
        
        {
            let mut handle = self.file_handle.lock().unwrap();
            *handle = Some(file);
        }
        
        Ok(())
    }
    
    pub fn log_event(&self, message: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.log(LogLevel::Info, message)
    }
    
    pub fn log_audit(&self, event: &str, username: &str, session_id: &str, details: &str) -> Result<(), Box<dyn std::error::Error>> {
        if !self.audit_enabled {
            return Ok(());
        }
        
        let audit_message = format!(
            "AUDIT: event={} user={} session={} details={}",
            event, username, session_id, details
        );
        
        self.log(LogLevel::Audit, &audit_message)
    }
    
    pub fn log_login(&self, username: &str, session_id: &str, tty: Option<&str>, success: bool) -> Result<(), Box<dyn std::error::Error>> {
        let event = if success { "LOGIN_SUCCESS" } else { "LOGIN_FAILED" };
        let tty_str = tty.unwrap_or("none");
        
        self.log_audit(event, username, session_id, &format!("tty={}", tty_str))
    }
    
    pub fn log_logout(&self, username: &str, session_id: &str, duration: u64) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit("LOGOUT", username, session_id, &format!("duration={}s", duration))
    }
    
    pub fn log_session_start(&self, username: &str, session_id: &str, shell: Option<&str>, gui: Option<&str>) -> Result<(), Box<dyn std::error::Error>> {
        let details = format!(
            "shell={} gui={}",
            shell.unwrap_or("none"),
            gui.unwrap_or("none")
        );
        
        self.log_audit("SESSION_START", username, session_id, &details)
    }
    
    pub fn log_session_end(&self, username: &str, session_id: &str, reason: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit("SESSION_END", username, session_id, &format!("reason={}", reason))
    }
    
    pub fn log_lock(&self, username: &str, session_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit("SESSION_LOCK", username, session_id, "")
    }
    
    pub fn log_unlock(&self, username: &str, session_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit("SESSION_UNLOCK", username, session_id, "")
    }
    
    pub fn log_user_switch(&self, from_user: &str, to_user: &str, session_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit("USER_SWITCH", to_user, session_id, &format!("from={}", from_user))
    }
    
    pub fn log_security_event(&self, event: &str, username: &str, session_id: &str, details: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit(event, username, session_id, details)
    }
    
    pub fn log_failed_login(&self, username: &str, reason: &str, ip: Option<&str>) -> Result<(), Box<dyn std::error::Error>> {
        let details = if let Some(ip_addr) = ip {
            format!("reason={} ip={}", reason, ip_addr)
        } else {
            format!("reason={}", reason)
        };
        
        self.log_audit("LOGIN_FAILED", username, "none", &details)
    }
    
    pub fn log_account_lockout(&self, username: &str, duration: u64) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit("ACCOUNT_LOCKOUT", username, "none", &format!("duration={}s", duration))
    }
    
    pub fn log_password_change(&self, username: &str, success: bool) -> Result<(), Box<dyn std::error::Error>> {
        let event = if success { "PASSWORD_CHANGE" } else { "PASSWORD_CHANGE_FAILED" };
        self.log_audit(event, username, "none", "")
    }
    
    pub fn log_user_creation(&self, username: &str, admin: bool) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit("USER_CREATED", username, "none", &format!("admin={}", admin))
    }
    
    pub fn log_user_deletion(&self, username: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit("USER_DELETED", username, "none", "")
    }
    
    pub fn log_user_modification(&self, username: &str, changes: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.log_audit("USER_MODIFIED", username, "none", &format!("changes={}", changes))
    }
    
    fn log(&self, level: LogLevel, message: &str) -> Result<(), Box<dyn std::error::Error>> {
        if level < self.log_level {
            return Ok(());
        }
        
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        let log_entry = format!(
            "[{}] {} {}: {}\n",
            timestamp,
            level.as_str(),
            chrono::Utc::now().format("%Y-%m-%d %H:%M:%S"),
            message
        );
        
        // Write to file
        {
            let mut handle = self.file_handle.lock().unwrap();
            if let Some(ref mut file) = *handle {
                file.write_all(log_entry.as_bytes())?;
                file.flush()?;
            }
        }
        
        // Also write to stdout for daemon mode
        if level >= LogLevel::Warning {
            print!("{}", log_entry);
            io::stdout().flush()?;
        }
        
        Ok(())
    }
    
    pub fn set_log_level(&mut self, level: LogLevel) {
        self.log_level = level;
    }
    
    pub fn enable_audit(&mut self) {
        self.audit_enabled = true;
    }
    
    pub fn disable_audit(&mut self) {
        self.audit_enabled = false;
    }
    
    pub fn rotate_logs(&self) -> Result<(), Box<dyn std::error::Error>> {
        let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
        let backup_file = format!("{}.{}", self.log_file, timestamp);
        
        // Rename current log file
        if Path::new(&self.log_file).exists() {
            std::fs::rename(&self.log_file, &backup_file)?;
        }
        
        // Create new log file
        self.init_log_file()?;
        
        self.log_event(&format!("Log rotated to {}", backup_file))?;
        
        Ok(())
    }
    
    pub fn get_log_stats(&self) -> Result<LogStats, Box<dyn std::error::Error>> {
        let content = std::fs::read_to_string(&self.log_file)?;
        let lines: Vec<&str> = content.lines().collect();
        
        let mut stats = LogStats {
            total_entries: lines.len(),
            logins: 0,
            logouts: 0,
            failed_logins: 0,
            security_events: 0,
            last_entry: None,
        };
        
        for line in lines {
            if line.contains("LOGIN_SUCCESS") {
                stats.logins += 1;
            } else if line.contains("LOGOUT") {
                stats.logouts += 1;
            } else if line.contains("LOGIN_FAILED") {
                stats.failed_logins += 1;
            } else if line.contains("AUDIT") {
                stats.security_events += 1;
            }
            
            stats.last_entry = Some(line.to_string());
        }
        
        Ok(stats)
    }
    
    pub fn search_logs(&self, query: &str, limit: usize) -> Result<Vec<String>, Box<dyn std::error::Error>> {
        let content = std::fs::read_to_string(&self.log_file)?;
        let lines: Vec<&str> = content.lines().collect();
        
        let mut results = Vec::new();
        
        for line in lines.iter().rev().take(limit) {
            if line.to_lowercase().contains(&query.to_lowercase()) {
                results.push(line.to_string());
            }
        }
        
        Ok(results)
    }
}

#[derive(Debug)]
pub struct LogStats {
    pub total_entries: usize,
    pub logins: usize,
    pub logouts: usize,
    pub failed_logins: usize,
    pub security_events: usize,
    pub last_entry: Option<String>,
}

impl PartialOrd for LogLevel {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for LogLevel {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        use std::cmp::Ordering;
        
        match (self, other) {
            (LogLevel::Debug, LogLevel::Debug) => Ordering::Equal,
            (LogLevel::Debug, _) => Ordering::Less,
            (LogLevel::Info, LogLevel::Debug) => Ordering::Greater,
            (LogLevel::Info, LogLevel::Info) => Ordering::Equal,
            (LogLevel::Info, _) => Ordering::Less,
            (LogLevel::Warning, LogLevel::Debug | LogLevel::Info) => Ordering::Greater,
            (LogLevel::Warning, LogLevel::Warning) => Ordering::Equal,
            (LogLevel::Warning, _) => Ordering::Less,
            (LogLevel::Error, LogLevel::Debug | LogLevel::Info | LogLevel::Warning) => Ordering::Greater,
            (LogLevel::Error, LogLevel::Error) => Ordering::Equal,
            (LogLevel::Error, LogLevel::Audit) => Ordering::Less,
            (LogLevel::Audit, LogLevel::Debug | LogLevel::Info | LogLevel::Warning | LogLevel::Error) => Ordering::Greater,
            (LogLevel::Audit, LogLevel::Audit) => Ordering::Equal,
        }
    }
}

impl PartialEq for LogLevel {
    fn eq(&self, other: &Self) -> bool {
        std::mem::discriminant(self) == std::mem::discriminant(other)
    }
}

impl Eq for LogLevel {}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    
    #[test]
    fn test_session_logger() {
        let temp_dir = tempdir().unwrap();
        let log_file = temp_dir.path().join("session.log");
        
        let logger = SessionLogger::new(log_file.to_str().unwrap()).unwrap();
        
        // Test basic logging
        logger.log_event("Test event").unwrap();
        
        // Test audit logging
        logger.log_login("testuser", "session123", Some("tty1"), true).unwrap();
        logger.log_logout("testuser", "session123", 3600).unwrap();
        
        // Test log stats
        let stats = logger.get_log_stats().unwrap();
        assert_eq!(stats.logins, 1);
        assert_eq!(stats.logouts, 1);
        assert!(stats.total_entries > 0);
    }
    
    #[test]
    fn test_log_levels() {
        let temp_dir = tempdir().unwrap();
        let log_file = temp_dir.path().join("session.log");
        
        let mut logger = SessionLogger::new(log_file.to_str().unwrap()).unwrap();
        
        // Test log level filtering
        logger.set_log_level(LogLevel::Warning);
        
        logger.log(LogLevel::Debug, "Debug message").unwrap();
        logger.log(LogLevel::Info, "Info message").unwrap();
        logger.log(LogLevel::Warning, "Warning message").unwrap();
        
        let stats = logger.get_log_stats().unwrap();
        // Only Warning and above should be logged
        assert!(stats.total_entries >= 1);
    }
} 