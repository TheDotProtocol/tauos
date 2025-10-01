use std::io::{self, Write};
use std::process::{Command, Stdio};
use std::env;
use std::path::Path;

mod auth;
mod config;
mod logging;

use auth::AuthManager;
use config::ConfigManager;
use logging::SessionLogger;

const USERS_FILE: &str = "/etc/tau/users.toml";
const SESSION_LOG: &str = "/var/log/tau/session.log";

fn main() {
    let args: Vec<String> = env::args().collect();
    
    if args.len() < 2 {
        eprintln!("Usage: {} <mode> [options]", args[0]);
        eprintln!("Modes:");
        eprintln!("  tty <tty_device>");
        eprintln!("  gui");
        eprintln!("  ssh");
        std::process::exit(1);
    }
    
    let mode = &args[1];
    
    match mode.as_str() {
        "tty" => {
            if args.len() < 3 {
                eprintln!("Usage: {} tty <tty_device>", args[0]);
                std::process::exit(1);
            }
            let tty = &args[2];
            run_tty_login(tty).expect("TTY login failed");
        }
        "gui" => {
            run_gui_login().expect("GUI login failed");
        }
        "ssh" => {
            run_ssh_login().expect("SSH login failed");
        }
        _ => {
            eprintln!("Unknown mode: {}", mode);
            std::process::exit(1);
        }
    }
}

fn run_tty_login(tty: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("Tau OS Login");
    println!("TTY: {}", tty);
    println!();
    
    let mut auth_manager = AuthManager::new(USERS_FILE)?;
    let config_manager = ConfigManager::new()?;
    let logger = SessionLogger::new(SESSION_LOG)?;
    
    loop {
        print!("Username: ");
        io::stdout().flush()?;
        
        let mut username = String::new();
        io::stdin().read_line(&mut username)?;
        let username = username.trim();
        
        if username.is_empty() {
            continue;
        }
        
        print!("Password: ");
        io::stdout().flush()?;
        
        let mut password = String::new();
        io::stdin().read_line(&mut password)?;
        let password = password.trim();
        
        // Attempt authentication
        match auth_manager.authenticate(username, password) {
            Ok(user) => {
                if !user.enabled {
                    println!("Account is disabled.");
                    logger.log_failed_login(username, "account disabled", None)?;
                    continue;
                }
                
                println!("Login successful!");
                logger.log_login(username, "tty-session", Some(tty), true)?;
                
                // Start user session
                start_user_session(username, &user, Some(tty))?;
                break;
            }
            Err(e) => {
                println!("Login failed: {}", e);
                logger.log_failed_login(username, &e.to_string(), None)?;
            }
        }
    }
    
    Ok(())
}

fn run_gui_login() -> Result<(), Box<dyn std::error::Error>> {
    // Launch graphical greeter
    let greeter = Command::new("tau-greeter")
        .env("DISPLAY", ":0")
        .env("XAUTHORITY", "/home/tau/.Xauthority")
        .spawn()?;
    
    let status = greeter.wait_with_output()?;
    
    if status.status.success() {
        // Parse greeter output for username and session info
        let output = String::from_utf8(status.stdout)?;
        let lines: Vec<&str> = output.lines().collect();
        
        if lines.len() >= 2 {
            let username = lines[0];
            let session_type = lines[1];
            
            let auth_manager = AuthManager::new(USERS_FILE)?;
            let user = auth_manager.get_user(username)?;
            
            let logger = SessionLogger::new(SESSION_LOG)?;
            logger.log_login(username, "gui-session", None, true)?;
            
            start_user_session(username, &user, None)?;
        }
    }
    
    Ok(())
}

fn run_ssh_login() -> Result<(), Box<dyn std::error::Error>> {
    // Get SSH connection info
    let ssh_client = env::var("SSH_CLIENT").unwrap_or_default();
    let ssh_connection = env::var("SSH_CONNECTION").unwrap_or_default();
    
    let username = env::var("USER").unwrap_or_else(|_| "unknown".to_string());
    
    let auth_manager = AuthManager::new(USERS_FILE)?;
    let user = auth_manager.get_user(&username)?;
    
    let logger = SessionLogger::new(SESSION_LOG)?;
    logger.log_login(&username, "ssh-session", None, true)?;
    
    // Start SSH session
    start_ssh_session(&username, &user, &ssh_client)?;
    
    Ok(())
}

fn start_user_session(username: &str, user: &auth::User, tty: Option<&str>) -> Result<(), Box<dyn std::error::Error>> {
    // Set up environment
    let mut env_vars = vec![
        ("USER", username),
        ("HOME", &user.home),
        ("SHELL", user.shell.as_deref().unwrap_or("/bin/bash")),
        ("LANG", "en_US.UTF-8"),
        ("PATH", "/usr/local/bin:/usr/bin:/bin"),
    ];
    
    if let Some(tty_device) = tty {
        env_vars.push(("TERM", "xterm-256color"));
        env_vars.push(("TTY", tty_device));
    }
    
    // Set up XDG directories
    let xdg_dirs = vec![
        format!("{}/.config", user.home),
        format!("{}/.cache", user.home),
        format!("{}/.local/share", user.home),
        format!("{}/.local/state", user.home),
    ];
    
    for dir in xdg_dirs {
        std::fs::create_dir_all(&dir)?;
    }
    
    // Set up runtime directory
    let runtime_dir = format!("/run/user/{}", user.uid);
    std::fs::create_dir_all(&runtime_dir)?;
    
    // Start user's preferred environment
    if let Some(gui) = &user.gui {
        start_gui_session(username, gui, &env_vars)?;
    } else if let Some(shell) = &user.shell {
        start_shell_session(username, shell, &env_vars, tty)?;
    } else {
        // Fallback to default shell
        start_shell_session(username, "/bin/bash", &env_vars, tty)?;
    }
    
    Ok(())
}

fn start_gui_session(username: &str, gui: &str, env_vars: &[(&str, &str)]) -> Result<(), Box<dyn std::error::Error>> {
    let mut cmd = Command::new(gui);
    
    // Set environment variables
    for (key, value) in env_vars {
        cmd.env(key, value);
    }
    
    // Set display-specific environment
    cmd.env("DISPLAY", ":0");
    cmd.env("XAUTHORITY", format!("/home/{}/.Xauthority", username));
    cmd.env("DBUS_SESSION_BUS_ADDRESS", "unix:path=/run/user/1000/bus");
    
    // Start GUI process
    let child = cmd
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()?;
    
    // Wait for GUI process to exit
    let _status = child.wait()?;
    
    Ok(())
}

fn start_shell_session(username: &str, shell: &str, env_vars: &[(&str, &str)], tty: Option<&str>) -> Result<(), Box<dyn std::error::Error>> {
    let mut cmd = Command::new(shell);
    
    // Set environment variables
    for (key, value) in env_vars {
        cmd.env(key, value);
    }
    
    // Set up TTY if available
    if let Some(tty_device) = tty {
        cmd.env("TERM", "xterm-256color");
        
        // Open TTY for input/output
        let tty_file = std::fs::File::open(tty_device)?;
        cmd.stdin(Stdio::from(tty_file.try_clone()?));
        cmd.stdout(Stdio::from(tty_file.try_clone()?));
        cmd.stderr(Stdio::from(tty_file));
    } else {
        // Use current stdin/stdout/stderr
        cmd.stdin(Stdio::inherit());
        cmd.stdout(Stdio::inherit());
        cmd.stderr(Stdio::inherit());
    }
    
    // Start shell process
    let child = cmd.spawn()?;
    
    // Wait for shell process to exit
    let _status = child.wait()?;
    
    Ok(())
}

fn start_ssh_session(username: &str, user: &auth::User, ssh_client: &str) -> Result<(), Box<dyn std::error::Error>> {
    // Set up environment for SSH session
    let env_vars = vec![
        ("USER", username),
        ("HOME", &user.home),
        ("SHELL", user.shell.as_deref().unwrap_or("/bin/bash")),
        ("LANG", "en_US.UTF-8"),
        ("PATH", "/usr/local/bin:/usr/bin:/bin"),
        ("SSH_CLIENT", ssh_client),
        ("SSH_CONNECTION", &env::var("SSH_CONNECTION").unwrap_or_default()),
    ];
    
    // Start shell for SSH session
    let shell = user.shell.as_deref().unwrap_or("/bin/bash");
    start_shell_session(username, shell, &env_vars, None)?;
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    
    #[test]
    fn test_tty_login() {
        let temp_dir = tempdir().unwrap();
        let users_file = temp_dir.path().join("users.toml");
        
        // Create a test user
        let mut auth_manager = AuthManager::new(users_file.to_str().unwrap()).unwrap();
        auth_manager.add_user("testuser", "password123", false).unwrap();
        
        // Test authentication
        let user = auth_manager.authenticate("testuser", "password123").unwrap();
        assert_eq!(user.username, "testuser");
        assert!(!user.admin);
    }
} 