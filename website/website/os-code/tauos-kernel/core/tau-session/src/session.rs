use std::collections::HashMap;
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use serde::{Deserialize, Serialize};

use crate::config::SessionConfig;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SessionInfo {
    pub session_id: String,
    pub username: String,
    pub start_time: u64,
    pub tty: Option<String>,
    pub display: Option<String>,
    pub pid: u32,
    pub status: String, // active, locked, terminated
}

pub struct Session {
    pub session_id: String,
    pub username: String,
    pub config: SessionConfig,
    pub env: HashMap<String, String>,
    pub pid: u32,
    pub child: Option<Child>,
}

impl Session {
    pub fn new(
        session_id: &str,
        username: &str,
        config: &SessionConfig,
        env: HashMap<String, String>,
    ) -> Result<Self, Box<dyn std::error::Error>> {
        Ok(Session {
            session_id: session_id.to_string(),
            username: username.to_string(),
            config: config.clone(),
            env,
            pid: 0,
            child: None,
        })
    }
    
    pub fn start(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        // Set up XDG directories
        self.setup_xdg_directories()?;
        
        // Start the user's preferred environment
        if let Some(gui) = &self.config.gui {
            self.start_gui_session(gui)?;
        } else if let Some(shell) = &self.config.shell {
            self.start_shell_session(shell)?;
        } else {
            return Err("No shell or GUI specified for session".into());
        }
        
        // Start startup applications
        self.start_startup_apps()?;
        
        Ok(())
    }
    
    fn setup_xdg_directories(&self) -> Result<(), Box<dyn std::error::Error>> {
        let home = format!("/home/{}", self.username);
        let xdg_dirs = vec![
            format!("{}/.config", home),
            format!("{}/.cache", home),
            format!("{}/.local/share", home),
            format!("{}/.local/state", home),
        ];
        
        for dir in xdg_dirs {
            std::fs::create_dir_all(&dir)?;
        }
        
        // Set up runtime directory
        let runtime_dir = format!("/run/user/{}", self.get_uid()?);
        std::fs::create_dir_all(&runtime_dir)?;
        
        Ok(())
    }
    
    fn start_gui_session(&mut self, gui: &str) -> Result<(), Box<dyn std::error::Error>> {
        let mut cmd = Command::new(gui);
        
        // Set environment variables
        for (key, value) in &self.env {
            cmd.env(key, value);
        }
        
        // Set display
        cmd.env("DISPLAY", ":0");
        cmd.env("XAUTHORITY", format!("/home/{}/.Xauthority", self.username));
        
        // Start the GUI process
        let child = cmd
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()?;
        
        self.pid = child.id();
        self.child = Some(child);
        
        Ok(())
    }
    
    fn start_shell_session(&mut self, shell: &str) -> Result<(), Box<dyn std::error::Error>> {
        let mut cmd = Command::new(shell);
        
        // Set environment variables
        for (key, value) in &self.env {
            cmd.env(key, value);
        }
        
        // Set up TTY if available
        if let Some(tty) = &self.env.get("TTY") {
            cmd.env("TERM", "xterm-256color");
        }
        
        // Start the shell process
        let child = cmd
            .stdin(Stdio::inherit())
            .stdout(Stdio::inherit())
            .stderr(Stdio::inherit())
            .spawn()?;
        
        self.pid = child.id();
        self.child = Some(child);
        
        Ok(())
    }
    
    fn start_startup_apps(&self) -> Result<(), Box<dyn std::error::Error>> {
        for app in &self.config.startup_apps {
            let mut cmd = Command::new(app);
            
            // Set environment variables
            for (key, value) in &self.env {
                cmd.env(key, value);
            }
            
            // Start app in background
            cmd.spawn()?;
        }
        
        Ok(())
    }
    
    pub fn terminate(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(mut child) = self.child.take() {
            // Try graceful termination first
            child.kill()?;
            
            // Wait a bit for graceful shutdown
            thread::sleep(Duration::from_millis(100));
            
            // Force kill if still running
            if child.try_wait()?.is_none() {
                child.kill()?;
            }
        }
        
        // Kill any remaining processes in the session
        self.kill_session_processes()?;
        
        Ok(())
    }
    
    fn kill_session_processes(&self) -> Result<(), Box<dyn std::error::Error>> {
        // Find and kill all processes belonging to this session
        let output = Command::new("pgrep")
            .arg("-f")
            .arg(&format!("TAU_SESSION_ID={}", self.session_id))
            .output()?;
        
        if output.status.success() {
            let pids: Vec<&str> = std::str::from_utf8(&output.stdout)?
                .lines()
                .collect();
            
            for pid in pids {
                if let Ok(pid_num) = pid.parse::<u32>() {
                    let _ = Command::new("kill")
                        .arg("-TERM")
                        .arg(pid)
                        .output();
                }
            }
        }
        
        Ok(())
    }
    
    fn get_uid(&self) -> Result<u32, Box<dyn std::error::Error>> {
        // This would typically be retrieved from the user database
        // For now, use a default UID based on username
        Ok(1000) // Default UID for regular users
    }
    
    pub fn is_active(&self) -> bool {
        if let Some(ref child) = self.child {
            child.try_wait().unwrap_or(None).is_none()
        } else {
            false
        }
    }
    
    pub fn get_status(&self) -> String {
        if self.is_active() {
            "active".to_string()
        } else {
            "terminated".to_string()
        }
    }
}

pub struct SessionManager {
    sessions: Arc<Mutex<HashMap<String, Session>>>,
}

impl SessionManager {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        Ok(SessionManager {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        })
    }
    
    pub fn start_session(&mut self, mut session: Session) -> Result<(), Box<dyn std::error::Error>> {
        // Start the session
        session.start()?;
        
        // Store the session
        {
            let mut sessions = self.sessions.lock().unwrap();
            sessions.insert(session.session_id.clone(), session);
        }
        
        // Start monitoring thread
        let session_id = session.session_id.clone();
        let sessions = self.sessions.clone();
        
        thread::spawn(move || {
            Self::monitor_session(&session_id, sessions);
        });
        
        Ok(())
    }
    
    pub fn terminate_session(&mut self, session_info: &SessionInfo) -> Result<(), Box<dyn std::error::Error>> {
        let mut sessions = self.sessions.lock().unwrap();
        
        if let Some(session) = sessions.get_mut(&session_info.session_id) {
            session.terminate()?;
            sessions.remove(&session_info.session_id);
        }
        
        Ok(())
    }
    
    pub fn get_session(&self, session_id: &str) -> Option<Session> {
        let sessions = self.sessions.lock().unwrap();
        sessions.get(session_id).cloned()
    }
    
    pub fn list_sessions(&self) -> Vec<SessionInfo> {
        let sessions = self.sessions.lock().unwrap();
        sessions.values()
            .map(|session| SessionInfo {
                session_id: session.session_id.clone(),
                username: session.username.clone(),
                start_time: std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
                tty: None,
                display: Some(":0".to_string()),
                pid: session.pid,
                status: session.get_status(),
            })
            .collect()
    }
    
    fn monitor_session(session_id: String, sessions: Arc<Mutex<HashMap<String, Session>>>) {
        loop {
            thread::sleep(Duration::from_secs(1));
            
            let session_terminated = {
                let mut sessions = sessions.lock().unwrap();
                if let Some(session) = sessions.get(&session_id) {
                    if !session.is_active() {
                        sessions.remove(&session_id);
                        true
                    } else {
                        false
                    }
                } else {
                    true
                }
            };
            
            if session_terminated {
                println!("[session-manager] Session {} terminated", session_id);
                break;
            }
        }
    }
    
    pub fn lock_session(&mut self, session_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        // Launch lock screen
        let lock_screen = Command::new("tau-lock")
            .env("TAU_SESSION_ID", session_id)
            .spawn()?;
        
        Ok(())
    }
    
    pub fn unlock_session(&mut self, session_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        // Kill lock screen process
        let output = Command::new("pkill")
            .arg("-f")
            .arg("tau-lock")
            .output()?;
        
        if !output.status.success() {
            println!("[session-manager] Warning: Could not kill lock screen");
        }
        
        Ok(())
    }
    
    pub fn switch_session(&mut self, from_session_id: &str, to_session_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        // This would typically involve:
        // 1. Pausing the current session
        // 2. Switching display focus
        // 3. Resuming the target session
        
        // For now, just log the switch
        println!("[session-manager] Switching from session {} to {}", from_session_id, to_session_id);
        
        Ok(())
    }
    
    pub fn cleanup_session(&mut self, session_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        // Clean up session-specific resources
        let runtime_dir = format!("/run/user/1000"); // Would get actual UID
        let _ = std::fs::remove_dir_all(&runtime_dir);
        
        // Remove session from tracking
        {
            let mut sessions = self.sessions.lock().unwrap();
            sessions.remove(session_id);
        }
        
        Ok(())
    }
}

impl Clone for Session {
    fn clone(&self) -> Self {
        Session {
            session_id: self.session_id.clone(),
            username: self.username.clone(),
            config: self.config.clone(),
            env: self.env.clone(),
            pid: self.pid,
            child: None, // Cannot clone Child, so set to None
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::config::SessionConfig;
    
    #[test]
    fn test_session_creation() {
        let config = SessionConfig {
            shell: Some("/bin/bash".to_string()),
            gui: Some("tau-desktop".to_string()),
            startup_apps: vec![],
            theme: "tau-dark".to_string(),
            locale: "en_US.UTF-8".to_string(),
            session_timeout: 3600,
            auto_lock: true,
        };
        
        let env = HashMap::new();
        let session = Session::new("test-session", "testuser", &config, env).unwrap();
        
        assert_eq!(session.session_id, "test-session");
        assert_eq!(session.username, "testuser");
    }
    
    #[test]
    fn test_session_manager() {
        let mut manager = SessionManager::new().unwrap();
        let sessions = manager.list_sessions();
        assert_eq!(sessions.len(), 0);
    }
} 