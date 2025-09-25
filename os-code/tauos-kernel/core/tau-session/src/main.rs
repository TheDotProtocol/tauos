use std::collections::HashMap;
use std::fs;
use std::io::{self, Write};
use std::os::unix::process::CommandExt;
use std::path::Path;
use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use serde::{Deserialize, Serialize};
use toml;
use uuid::Uuid;

mod auth;
mod session;
mod config;
mod logging;

use auth::AuthManager;
use session::{Session, SessionManager};
use config::{UserConfig, SessionConfig};
use logging::SessionLogger;

const USERS_FILE: &str = "/etc/tau/users.toml";
const SESSION_LOG: &str = "/var/log/tau/session.log";
const SESSION_DIR: &str = "/var/lib/tau/sessions";

#[derive(Debug, Serialize, Deserialize)]
struct User {
    username: String,
    password_hash: String,
    shell: Option<String>,
    gui: Option<String>,
    home: String,
    uid: u32,
    gid: u32,
    groups: Vec<String>,
    enabled: bool,
    admin: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct SessionInfo {
    session_id: String,
    username: String,
    start_time: u64,
    tty: Option<String>,
    display: Option<String>,
    pid: u32,
    status: String, // active, locked, terminated
}

struct TauSession {
    auth_manager: AuthManager,
    session_manager: SessionManager,
    logger: SessionLogger,
    active_sessions: Arc<Mutex<HashMap<String, SessionInfo>>>,
}

impl TauSession {
    fn new() -> Result<Self, Box<dyn std::error::Error>> {
        // Ensure directories exist
        fs::create_dir_all(SESSION_DIR)?;
        fs::create_dir_all("/var/log/tau")?;
        
        let auth_manager = AuthManager::new(USERS_FILE)?;
        let session_manager = SessionManager::new()?;
        let logger = SessionLogger::new(SESSION_LOG)?;
        let active_sessions = Arc::new(Mutex::new(HashMap::new()));
        
        Ok(TauSession {
            auth_manager,
            session_manager,
            logger,
            active_sessions,
        })
    }
    
    fn login(&mut self, username: &str, password: &str, tty: Option<&str>) -> Result<String, Box<dyn std::error::Error>> {
        // Authenticate user
        let user = self.auth_manager.authenticate(username, password)?;
        
        if !user.enabled {
            return Err("User account is disabled".into());
        }
        
        // Check for existing sessions
        let sessions = self.active_sessions.lock().unwrap();
        for (_, session_info) in sessions.iter() {
            if session_info.username == username && session_info.status == "active" {
                return Err("User already has an active session".into());
            }
        }
        drop(sessions);
        
        // Create new session
        let session_id = Uuid::new_v4().to_string();
        let start_time = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        let session_info = SessionInfo {
            session_id: session_id.clone(),
            username: username.to_string(),
            start_time,
            tty: tty.map(|t| t.to_string()),
            display: None,
            pid: 0,
            status: "active".to_string(),
        };
        
        // Log login event
        self.logger.log_event(&format!(
            "LOGIN: user={} session={} tty={}",
            username,
            session_id,
            tty.unwrap_or("none")
        ))?;
        
        // Add to active sessions
        {
            let mut sessions = self.active_sessions.lock().unwrap();
            sessions.insert(session_id.clone(), session_info);
        }
        
        Ok(session_id)
    }
    
    fn start_session(&mut self, session_id: &str, username: &str) -> Result<(), Box<dyn std::error::Error>> {
        let user = self.auth_manager.get_user(username)?;
        
        // Load user session configuration
        let session_config = self.load_session_config(username)?;
        
        // Set up environment
        let env = self.setup_environment(username, &user, &session_config)?;
        
        // Start user session
        let session = Session::new(
            session_id,
            username,
            &session_config,
            env,
        )?;
        
        // Update session info with PID
        {
            let mut sessions = self.active_sessions.lock().unwrap();
            if let Some(session_info) = sessions.get_mut(session_id) {
                session_info.pid = session.pid;
            }
        }
        
        // Start session in background
        self.session_manager.start_session(session)?;
        
        Ok(())
    }
    
    fn load_session_config(&self, username: &str) -> Result<SessionConfig, Box<dyn std::error::Error>> {
        let home = format!("/home/{}", username);
        let config_path = format!("{}/.tau/session.toml", home);
        
        if Path::new(&config_path).exists() {
            let config_content = fs::read_to_string(&config_path)?;
            let config: SessionConfig = toml::from_str(&config_content)?;
            Ok(config)
        } else {
            // Return default configuration
            Ok(SessionConfig {
                shell: Some("/bin/bash".to_string()),
                gui: Some("tau-desktop".to_string()),
                startup_apps: vec![],
                theme: "tau-dark".to_string(),
                locale: "en_US.UTF-8".to_string(),
                session_timeout: 3600, // 1 hour
                auto_lock: true,
            })
        }
    }
    
    fn setup_environment(&self, username: &str, user: &User, config: &SessionConfig) -> Result<HashMap<String, String>, Box<dyn std::error::Error>> {
        let mut env = HashMap::new();
        
        // Basic environment variables
        env.insert("USER".to_string(), username.to_string());
        env.insert("HOME".to_string(), user.home.clone());
        env.insert("SHELL".to_string(), config.shell.clone().unwrap_or_else(|| "/bin/bash".to_string()));
        env.insert("LANG".to_string(), config.locale.clone());
        env.insert("TZ".to_string(), "UTC".to_string());
        env.insert("PATH".to_string(), "/usr/local/bin:/usr/bin:/bin".to_string());
        
        // XDG directories
        let home = &user.home;
        env.insert("XDG_CONFIG_HOME".to_string(), format!("{}/.config", home));
        env.insert("XDG_CACHE_HOME".to_string(), format!("{}/.cache", home));
        env.insert("XDG_DATA_HOME".to_string(), format!("{}/.local/share", home));
        env.insert("XDG_RUNTIME_DIR".to_string(), format!("/run/user/{}", user.uid));
        
        // Display and session
        env.insert("DISPLAY".to_string(), ":0".to_string());
        env.insert("XAUTHORITY".to_string(), format!("{}/.Xauthority", home));
        env.insert("DBUS_SESSION_BUS_ADDRESS".to_string(), "unix:path=/run/user/1000/bus".to_string());
        
        // Tau-specific variables
        env.insert("TAU_SESSION_ID".to_string(), Uuid::new_v4().to_string());
        env.insert("TAU_THEME".to_string(), config.theme.clone());
        
        Ok(env)
    }
    
    fn logout(&mut self, session_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        // Get session info
        let session_info = {
            let sessions = self.active_sessions.lock().unwrap();
            sessions.get(session_id).cloned()
        };
        
        if let Some(info) = session_info {
            // Terminate session
            self.session_manager.terminate_session(&info)?;
            
            // Log logout event
            self.logger.log_event(&format!(
                "LOGOUT: user={} session={} duration={}",
                info.username,
                session_id,
                SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs() - info.start_time
            ))?;
            
            // Remove from active sessions
            {
                let mut sessions = self.active_sessions.lock().unwrap();
                sessions.remove(session_id);
            }
        }
        
        Ok(())
    }
    
    fn lock_session(&mut self, session_id: &str) -> Result<(), Box<dyn std::error::Error>> {
        // Update session status
        {
            let mut sessions = self.active_sessions.lock().unwrap();
            if let Some(session_info) = sessions.get_mut(session_id) {
                session_info.status = "locked".to_string();
            }
        }
        
        // Launch lock screen
        let lock_screen = Command::new("tau-lock")
            .spawn()?;
        
        self.logger.log_event(&format!("LOCK: session={}", session_id))?;
        
        Ok(())
    }
    
    fn unlock_session(&mut self, session_id: &str, password: &str) -> Result<(), Box<dyn std::error::Error>> {
        // Get session info
        let session_info = {
            let sessions = self.active_sessions.lock().unwrap();
            sessions.get(session_id).cloned()
        };
        
        if let Some(info) = session_info {
            // Verify password
            self.auth_manager.authenticate(&info.username, password)?;
            
            // Update session status
            {
                let mut sessions = self.active_sessions.lock().unwrap();
                if let Some(session_info) = sessions.get_mut(session_id) {
                    session_info.status = "active".to_string();
                }
            }
            
            self.logger.log_event(&format!("UNLOCK: session={}", session_id))?;
        }
        
        Ok(())
    }
    
    fn list_sessions(&self) -> Vec<SessionInfo> {
        let sessions = self.active_sessions.lock().unwrap();
        sessions.values().cloned().collect()
    }
    
    fn switch_user(&mut self, new_username: &str, password: &str) -> Result<String, Box<dyn std::error::Error>> {
        // Authenticate new user
        let user = self.auth_manager.authenticate(new_username, password)?;
        
        if !user.enabled {
            return Err("User account is disabled".into());
        }
        
        // Create new session for the user
        let session_id = self.login(new_username, password, None)?;
        self.start_session(&session_id, new_username)?;
        
        Ok(session_id)
    }
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    
    if args.len() < 2 {
        eprintln!("Usage: {} <command> [options]", args[0]);
        eprintln!("Commands:");
        eprintln!("  login <username> [--tty <tty>]");
        eprintln!("  logout <session_id>");
        eprintln!("  lock <session_id>");
        eprintln!("  unlock <session_id>");
        eprintln!("  switch <username>");
        eprintln!("  list");
        eprintln!("  daemon");
        std::process::exit(1);
    }
    
    let command = &args[1];
    
    match command.as_str() {
        "login" => {
            if args.len() < 3 {
                eprintln!("Usage: {} login <username> [--tty <tty>]", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            let mut tty = None;
            
            // Parse optional TTY argument
            for i in 3..args.len() {
                if args[i] == "--tty" && i + 1 < args.len() {
                    tty = Some(args[i + 1].as_str());
                }
            }
            
            let mut tau_session = TauSession::new().expect("Failed to initialize TauSession");
            
            // Get password
            print!("Password: ");
            io::stdout().flush().unwrap();
            let mut password = String::new();
            io::stdin().read_line(&mut password).unwrap();
            let password = password.trim();
            
            match tau_session.login(username, password, tty) {
                Ok(session_id) => {
                    println!("Login successful! Session ID: {}", session_id);
                    tau_session.start_session(&session_id, username).expect("Failed to start session");
                }
                Err(e) => {
                    eprintln!("Login failed: {}", e);
                    std::process::exit(1);
                }
            }
        }
        
        "logout" => {
            if args.len() < 3 {
                eprintln!("Usage: {} logout <session_id>", args[0]);
                std::process::exit(1);
            }
            
            let session_id = &args[2];
            let mut tau_session = TauSession::new().expect("Failed to initialize TauSession");
            tau_session.logout(session_id).expect("Failed to logout");
            println!("Logged out successfully");
        }
        
        "lock" => {
            if args.len() < 3 {
                eprintln!("Usage: {} lock <session_id>", args[0]);
                std::process::exit(1);
            }
            
            let session_id = &args[2];
            let mut tau_session = TauSession::new().expect("Failed to initialize TauSession");
            tau_session.lock_session(session_id).expect("Failed to lock session");
            println!("Session locked");
        }
        
        "unlock" => {
            if args.len() < 3 {
                eprintln!("Usage: {} unlock <session_id>", args[0]);
                std::process::exit(1);
            }
            
            let session_id = &args[2];
            let mut tau_session = TauSession::new().expect("Failed to initialize TauSession");
            
            print!("Password: ");
            io::stdout().flush().unwrap();
            let mut password = String::new();
            io::stdin().read_line(&mut password).unwrap();
            let password = password.trim();
            
            tau_session.unlock_session(session_id, password).expect("Failed to unlock session");
            println!("Session unlocked");
        }
        
        "switch" => {
            if args.len() < 3 {
                eprintln!("Usage: {} switch <username>", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            let mut tau_session = TauSession::new().expect("Failed to initialize TauSession");
            
            print!("Password: ");
            io::stdout().flush().unwrap();
            let mut password = String::new();
            io::stdin().read_line(&mut password).unwrap();
            let password = password.trim();
            
            match tau_session.switch_user(username, password) {
                Ok(session_id) => {
                    println!("Switched to user {} successfully! Session ID: {}", username, session_id);
                }
                Err(e) => {
                    eprintln!("Switch user failed: {}", e);
                    std::process::exit(1);
                }
            }
        }
        
        "list" => {
            let tau_session = TauSession::new().expect("Failed to initialize TauSession");
            let sessions = tau_session.list_sessions();
            
            println!("Active Sessions:");
            for session in sessions {
                println!("  Session ID: {}", session.session_id);
                println!("  User: {}", session.username);
                println!("  Status: {}", session.status);
                println!("  TTY: {}", session.tty.as_deref().unwrap_or("none"));
                println!("  Display: {}", session.display.as_deref().unwrap_or("none"));
                println!("  PID: {}", session.pid);
                println!("  Start Time: {}", session.start_time);
                println!();
            }
        }
        
        "daemon" => {
            run_daemon().expect("Daemon failed");
        }
        
        _ => {
            eprintln!("Unknown command: {}", command);
            std::process::exit(1);
        }
    }
}

fn run_daemon() -> Result<(), Box<dyn std::error::Error>> {
    println!("[tau-session] Starting session daemon...");
    
    let mut tau_session = TauSession::new()?;
    
    // Set up signal handling
    ctrlc::set_handler(move || {
        println!("\n[tau-session] Shutting down...");
        std::process::exit(0);
    })?;
    
    // Main daemon loop
    loop {
        thread::sleep(Duration::from_secs(1));
        
        // Check for session timeouts
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        let sessions = tau_session.list_sessions();
        for session in sessions {
            if session.status == "active" {
                // Check for timeout (default 1 hour)
                if now - session.start_time > 3600 {
                    println!("[tau-session] Session {} timed out, logging out", session.session_id);
                    tau_session.logout(&session.session_id)?;
                }
            }
        }
    }
} 