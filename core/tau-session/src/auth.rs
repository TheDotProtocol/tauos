use std::collections::HashMap;
use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use bcrypt::{hash, verify, DEFAULT_COST};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub shell: Option<String>,
    pub gui: Option<String>,
    pub home: String,
    pub uid: u32,
    pub gid: u32,
    pub groups: Vec<String>,
    pub enabled: bool,
    pub admin: bool,
    pub failed_attempts: u32,
    pub last_failed: Option<u64>,
    pub locked_until: Option<u64>,
}

#[derive(Debug, Serialize, Deserialize)]
struct UsersConfig {
    users: HashMap<String, User>,
}

pub struct AuthManager {
    users_file: String,
    users: HashMap<String, User>,
    max_failed_attempts: u32,
    lockout_duration: u64, // seconds
}

impl AuthManager {
    pub fn new(users_file: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let mut auth_manager = AuthManager {
            users_file: users_file.to_string(),
            users: HashMap::new(),
            max_failed_attempts: 5,
            lockout_duration: 300, // 5 minutes
        };
        
        auth_manager.load_users()?;
        Ok(auth_manager)
    }
    
    fn load_users(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if Path::new(&self.users_file).exists() {
            let content = fs::read_to_string(&self.users_file)?;
            let config: UsersConfig = toml::from_str(&content)?;
            self.users = config.users;
        } else {
            // Create default admin user if no users file exists
            let default_user = User {
                username: "tau".to_string(),
                password_hash: hash("tauos", DEFAULT_COST)?,
                shell: Some("/bin/bash".to_string()),
                gui: Some("tau-desktop".to_string()),
                home: "/home/tau".to_string(),
                uid: 1000,
                gid: 1000,
                groups: vec!["users".to_string(), "wheel".to_string()],
                enabled: true,
                admin: true,
                failed_attempts: 0,
                last_failed: None,
                locked_until: None,
            };
            
            self.users.insert("tau".to_string(), default_user);
            self.save_users()?;
        }
        
        Ok(())
    }
    
    fn save_users(&self) -> Result<(), Box<dyn std::error::Error>> {
        // Ensure directory exists
        if let Some(parent) = Path::new(&self.users_file).parent() {
            fs::create_dir_all(parent)?;
        }
        
        let config = UsersConfig {
            users: self.users.clone(),
        };
        
        let content = toml::to_string_pretty(&config)?;
        fs::write(&self.users_file, content)?;
        
        Ok(())
    }
    
    pub fn authenticate(&mut self, username: &str, password: &str) -> Result<User, Box<dyn std::error::Error>> {
        let user = self.users.get_mut(username)
            .ok_or("User not found")?;
        
        // Check if account is locked
        if let Some(locked_until) = user.locked_until {
            let now = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs();
            
            if now < locked_until {
                let remaining = locked_until - now;
                return Err(format!("Account locked for {} more seconds", remaining).into());
            } else {
                // Unlock account
                user.locked_until = None;
                user.failed_attempts = 0;
            }
        }
        
        // Verify password
        if verify(password, &user.password_hash)? {
            // Reset failed attempts on successful login
            user.failed_attempts = 0;
            user.last_failed = None;
            user.locked_until = None;
            self.save_users()?;
            
            Ok(user.clone())
        } else {
            // Increment failed attempts
            user.failed_attempts += 1;
            user.last_failed = Some(
                std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs()
            );
            
            // Lock account if too many failed attempts
            if user.failed_attempts >= self.max_failed_attempts {
                let lockout_until = std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs() + self.lockout_duration;
                user.locked_until = Some(lockout_until);
            }
            
            self.save_users()?;
            Err("Invalid password".into())
        }
    }
    
    pub fn get_user(&self, username: &str) -> Result<User, Box<dyn std::error::Error>> {
        self.users.get(username)
            .cloned()
            .ok_or("User not found".into())
    }
    
    pub fn add_user(&mut self, username: &str, password: &str, admin: bool) -> Result<(), Box<dyn std::error::Error>> {
        if self.users.contains_key(username) {
            return Err("User already exists".into());
        }
        
        let password_hash = hash(password, DEFAULT_COST)?;
        let uid = self.get_next_uid()?;
        
        let user = User {
            username: username.to_string(),
            password_hash,
            shell: Some("/bin/bash".to_string()),
            gui: Some("tau-desktop".to_string()),
            home: format!("/home/{}", username),
            uid,
            gid: uid,
            groups: vec!["users".to_string()],
            enabled: true,
            admin,
            failed_attempts: 0,
            last_failed: None,
            locked_until: None,
        };
        
        self.users.insert(username.to_string(), user);
        self.save_users()?;
        
        Ok(())
    }
    
    pub fn remove_user(&mut self, username: &str) -> Result<(), Box<dyn std::error::Error>> {
        if username == "tau" {
            return Err("Cannot remove default admin user".into());
        }
        
        if self.users.remove(username).is_some() {
            self.save_users()?;
            Ok(())
        } else {
            Err("User not found".into())
        }
    }
    
    pub fn enable_user(&mut self, username: &str) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(user) = self.users.get_mut(username) {
            user.enabled = true;
            self.save_users()?;
            Ok(())
        } else {
            Err("User not found".into())
        }
    }
    
    pub fn disable_user(&mut self, username: &str) -> Result<(), Box<dyn std::error::Error>> {
        if username == "tau" {
            return Err("Cannot disable default admin user".into());
        }
        
        if let Some(user) = self.users.get_mut(username) {
            user.enabled = false;
            self.save_users()?;
            Ok(())
        } else {
            Err("User not found".into())
        }
    }
    
    pub fn change_password(&mut self, username: &str, new_password: &str) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(user) = self.users.get_mut(username) {
            user.password_hash = hash(new_password, DEFAULT_COST)?;
            user.failed_attempts = 0;
            user.last_failed = None;
            user.locked_until = None;
            self.save_users()?;
            Ok(())
        } else {
            Err("User not found".into())
        }
    }
    
    pub fn list_users(&self) -> Vec<&User> {
        self.users.values().collect()
    }
    
    fn get_next_uid(&self) -> Result<u32, Box<dyn std::error::Error>> {
        let mut max_uid = 1000; // Start from 1000 for regular users
        
        for user in self.users.values() {
            if user.uid > max_uid {
                max_uid = user.uid;
            }
        }
        
        Ok(max_uid + 1)
    }
    
    pub fn is_admin(&self, username: &str) -> bool {
        self.users.get(username)
            .map(|user| user.admin)
            .unwrap_or(false)
    }
    
    pub fn get_failed_attempts(&self, username: &str) -> u32 {
        self.users.get(username)
            .map(|user| user.failed_attempts)
            .unwrap_or(0)
    }
    
    pub fn unlock_account(&mut self, username: &str) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(user) = self.users.get_mut(username) {
            user.failed_attempts = 0;
            user.last_failed = None;
            user.locked_until = None;
            self.save_users()?;
            Ok(())
        } else {
            Err("User not found".into())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    
    #[test]
    fn test_auth_manager() {
        let temp_dir = tempdir().unwrap();
        let users_file = temp_dir.path().join("users.toml");
        
        let mut auth_manager = AuthManager::new(users_file.to_str().unwrap()).unwrap();
        
        // Test default user creation
        assert!(auth_manager.users.contains_key("tau"));
        
        // Test user addition
        auth_manager.add_user("testuser", "password123", false).unwrap();
        assert!(auth_manager.users.contains_key("testuser"));
        
        // Test authentication
        let user = auth_manager.authenticate("testuser", "password123").unwrap();
        assert_eq!(user.username, "testuser");
        assert!(!user.admin);
        
        // Test failed authentication
        let result = auth_manager.authenticate("testuser", "wrongpassword");
        assert!(result.is_err());
        
        // Test account lockout
        for _ in 0..5 {
            let _ = auth_manager.authenticate("testuser", "wrongpassword");
        }
        
        let result = auth_manager.authenticate("testuser", "password123");
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("locked"));
    }
} 