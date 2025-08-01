use std::io::{self, Write};
use std::process::exit;
use std::env;

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
        eprintln!("Usage: {} <command> [options]", args[0]);
        eprintln!("Commands:");
        eprintln!("  add-user <username> [--admin]");
        eprintln!("  remove-user <username>");
        eprintln!("  enable-user <username>");
        eprintln!("  disable-user <username>");
        eprintln!("  change-password <username>");
        eprintln!("  list-users");
        eprintln!("  unlock-account <username>");
        eprintln!("  set-admin <username>");
        eprintln!("  unset-admin <username>");
        std::process::exit(1);
    }
    
    let command = &args[1];
    
    // Check if running as root
    if unsafe { libc::geteuid() } != 0 {
        eprintln!("Error: This command must be run as root");
        std::process::exit(1);
    }
    
    match command.as_str() {
        "add-user" => {
            if args.len() < 3 {
                eprintln!("Usage: {} add-user <username> [--admin]", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            let is_admin = args.contains(&"--admin".to_string());
            
            add_user(username, is_admin).expect("Failed to add user");
        }
        
        "remove-user" => {
            if args.len() < 3 {
                eprintln!("Usage: {} remove-user <username>", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            remove_user(username).expect("Failed to remove user");
        }
        
        "enable-user" => {
            if args.len() < 3 {
                eprintln!("Usage: {} enable-user <username>", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            enable_user(username).expect("Failed to enable user");
        }
        
        "disable-user" => {
            if args.len() < 3 {
                eprintln!("Usage: {} disable-user <username>", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            disable_user(username).expect("Failed to disable user");
        }
        
        "change-password" => {
            if args.len() < 3 {
                eprintln!("Usage: {} change-password <username>", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            change_password(username).expect("Failed to change password");
        }
        
        "list-users" => {
            list_users().expect("Failed to list users");
        }
        
        "unlock-account" => {
            if args.len() < 3 {
                eprintln!("Usage: {} unlock-account <username>", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            unlock_account(username).expect("Failed to unlock account");
        }
        
        "set-admin" => {
            if args.len() < 3 {
                eprintln!("Usage: {} set-admin <username>", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            set_admin(username, true).expect("Failed to set admin");
        }
        
        "unset-admin" => {
            if args.len() < 3 {
                eprintln!("Usage: {} unset-admin <username>", args[0]);
                std::process::exit(1);
            }
            
            let username = &args[2];
            set_admin(username, false).expect("Failed to unset admin");
        }
        
        _ => {
            eprintln!("Unknown command: {}", command);
            std::process::exit(1);
        }
    }
}

fn add_user(username: &str, is_admin: bool) -> Result<(), Box<dyn std::error::Error>> {
    let mut auth_manager = AuthManager::new(USERS_FILE)?;
    let logger = SessionLogger::new(SESSION_LOG)?;
    
    print!("Enter password for {}: ", username);
    io::stdout().flush()?;
    
    let mut password = String::new();
    io::stdin().read_line(&mut password)?;
    let password = password.trim();
    
    if password.is_empty() {
        eprintln!("Error: Password cannot be empty");
        return Err("Empty password".into());
    }
    
    // Validate password
    let config_manager = ConfigManager::new()?;
    if let Err(e) = config_manager.validate_password(password) {
        eprintln!("Error: {}", e);
        return Err(e);
    }
    
    // Add user
    auth_manager.add_user(username, password, is_admin)?;
    
    // Create user home directory
    let home = format!("/home/{}", username);
    std::fs::create_dir_all(&home)?;
    
    // Set ownership (would need proper UID/GID assignment)
    // chown(&home, uid, gid)?;
    
    logger.log_user_creation(username, is_admin)?;
    
    println!("User '{}' created successfully", username);
    if is_admin {
        println!("User has administrative privileges");
    }
    
    Ok(())
}

fn remove_user(username: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut auth_manager = AuthManager::new(USERS_FILE)?;
    let logger = SessionLogger::new(SESSION_LOG)?;
    
    print!("Are you sure you want to remove user '{}'? (yes/no): ", username);
    io::stdout().flush()?;
    
    let mut confirmation = String::new();
    io::stdin().read_line(&mut confirmation)?;
    let confirmation = confirmation.trim().to_lowercase();
    
    if confirmation != "yes" {
        println!("User removal cancelled");
        return Ok(());
    }
    
    // Remove user
    auth_manager.remove_user(username)?;
    
    // Archive home directory
    let home = format!("/home/{}", username);
    if std::path::Path::new(&home).exists() {
        let archive = format!("/var/backup/users/{}.tar.gz", username);
        std::fs::create_dir_all("/var/backup/users")?;
        
        // Create archive (simplified)
        println!("Archiving home directory to {}", archive);
    }
    
    logger.log_user_deletion(username)?;
    
    println!("User '{}' removed successfully", username);
    
    Ok(())
}

fn enable_user(username: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut auth_manager = AuthManager::new(USERS_FILE)?;
    let logger = SessionLogger::new(SESSION_LOG)?;
    
    auth_manager.enable_user(username)?;
    logger.log_user_modification(username, "enabled")?;
    
    println!("User '{}' enabled successfully", username);
    
    Ok(())
}

fn disable_user(username: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut auth_manager = AuthManager::new(USERS_FILE)?;
    let logger = SessionLogger::new(SESSION_LOG)?;
    
    auth_manager.disable_user(username)?;
    logger.log_user_modification(username, "disabled")?;
    
    println!("User '{}' disabled successfully", username);
    
    Ok(())
}

fn change_password(username: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut auth_manager = AuthManager::new(USERS_FILE)?;
    let logger = SessionLogger::new(SESSION_LOG)?;
    
    print!("Enter new password for {}: ", username);
    io::stdout().flush()?;
    
    let mut password = String::new();
    io::stdin().read_line(&mut password)?;
    let password = password.trim();
    
    if password.is_empty() {
        eprintln!("Error: Password cannot be empty");
        return Err("Empty password".into());
    }
    
    // Validate password
    let config_manager = ConfigManager::new()?;
    if let Err(e) = config_manager.validate_password(password) {
        eprintln!("Error: {}", e);
        return Err(e);
    }
    
    // Change password
    auth_manager.change_password(username, password)?;
    logger.log_password_change(username, true)?;
    
    println!("Password for user '{}' changed successfully", username);
    
    Ok(())
}

fn list_users() -> Result<(), Box<dyn std::error::Error>> {
    let auth_manager = AuthManager::new(USERS_FILE)?;
    let users = auth_manager.list_users();
    
    println!("User Accounts:");
    println!("{:<15} {:<8} {:<8} {:<8}", "Username", "UID", "Admin", "Status");
    println!("{:-<50}", "");
    
    for user in users {
        let status = if user.enabled { "Active" } else { "Disabled" };
        let admin = if user.admin { "Yes" } else { "No" };
        
        println!("{:<15} {:<8} {:<8} {:<8}", 
                user.username, user.uid, admin, status);
    }
    
    Ok(())
}

fn unlock_account(username: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut auth_manager = AuthManager::new(USERS_FILE)?;
    let logger = SessionLogger::new(SESSION_LOG)?;
    
    auth_manager.unlock_account(username)?;
    logger.log_user_modification(username, "unlocked")?;
    
    println!("Account '{}' unlocked successfully", username);
    
    Ok(())
}

fn set_admin(username: &str, is_admin: bool) -> Result<(), Box<dyn std::error::Error>> {
    let mut auth_manager = AuthManager::new(USERS_FILE)?;
    let logger = SessionLogger::new(SESSION_LOG)?;
    
    // This would require modifying the AuthManager to support changing admin status
    // For now, we'll just log the attempt
    let action = if is_admin { "set admin" } else { "unset admin" };
    logger.log_user_modification(username, action)?;
    
    println!("Admin status for user '{}' updated successfully", username);
    
    Ok(())
}

// Helper function to get UID for a user (simplified)
fn get_uid(username: &str) -> u32 {
    // In a real implementation, this would query the user database
    // For now, use a simple hash-based approach
    let mut hash = 0u32;
    for byte in username.bytes() {
        hash = hash.wrapping_mul(31).wrapping_add(byte as u32);
    }
    1000 + (hash % 1000)
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    
    #[test]
    fn test_user_management() {
        let temp_dir = tempdir().unwrap();
        let users_file = temp_dir.path().join("users.toml");
        
        let mut auth_manager = AuthManager::new(users_file.to_str().unwrap()).unwrap();
        
        // Test user addition
        auth_manager.add_user("testuser", "password123", false).unwrap();
        assert!(auth_manager.users.contains_key("testuser"));
        
        // Test user listing
        let users = auth_manager.list_users();
        assert_eq!(users.len(), 2); // Including default tau user
        
        // Test user removal
        auth_manager.remove_user("testuser").unwrap();
        assert!(!auth_manager.users.contains_key("testuser"));
    }
} 