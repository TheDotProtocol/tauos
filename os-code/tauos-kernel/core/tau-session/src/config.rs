use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserConfig {
    pub username: String,
    pub uid: u32,
    pub gid: u32,
    pub home: String,
    pub shell: Option<String>,
    pub gui: Option<String>,
    pub groups: Vec<String>,
    pub enabled: bool,
    pub admin: bool,
    pub preferences: UserPreferences,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserPreferences {
    pub theme: String,
    pub locale: String,
    pub timezone: String,
    pub keyboard_layout: String,
    pub accessibility: AccessibilitySettings,
    pub privacy: PrivacySettings,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AccessibilitySettings {
    pub high_contrast: bool,
    pub large_text: bool,
    pub screen_reader: bool,
    pub keyboard_navigation: bool,
    pub reduced_motion: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PrivacySettings {
    pub telemetry: bool,
    pub location_services: bool,
    pub camera_access: bool,
    pub microphone_access: bool,
    pub file_sharing: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SessionConfig {
    pub shell: Option<String>,
    pub gui: Option<String>,
    pub startup_apps: Vec<String>,
    pub theme: String,
    pub locale: String,
    pub session_timeout: u64, // seconds
    pub auto_lock: bool,
    pub auto_lock_timeout: u64, // seconds
    pub environment: HashMap<String, String>,
    pub permissions: SessionPermissions,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SessionPermissions {
    pub network_access: bool,
    pub file_system_access: bool,
    pub device_access: bool,
    pub system_access: bool,
    pub allowed_apps: Vec<String>,
    pub blocked_apps: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemConfig {
    pub default_shell: String,
    pub default_gui: String,
    pub session_timeout: u64,
    pub max_failed_logins: u32,
    pub lockout_duration: u64,
    pub guest_session_enabled: bool,
    pub remote_session_enabled: bool,
    pub security: SecuritySettings,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SecuritySettings {
    pub password_min_length: u32,
    pub require_special_chars: bool,
    pub require_numbers: bool,
    pub require_uppercase: bool,
    pub password_expiry_days: u32,
    pub session_encryption: bool,
    pub audit_logging: bool,
}

pub struct ConfigManager {
    system_config_path: String,
    user_config_dir: String,
}

impl ConfigManager {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let config_manager = ConfigManager {
            system_config_path: "/etc/tau/session.toml".to_string(),
            user_config_dir: "/home".to_string(),
        };
        
        // Ensure config directories exist
        fs::create_dir_all("/etc/tau")?;
        fs::create_dir_all("/var/lib/tau/sessions")?;
        
        Ok(config_manager)
    }
    
    pub fn load_system_config(&self) -> Result<SystemConfig, Box<dyn std::error::Error>> {
        if Path::new(&self.system_config_path).exists() {
            let content = fs::read_to_string(&self.system_config_path)?;
            let config: SystemConfig = toml::from_str(&content)?;
            Ok(config)
        } else {
            // Create default system configuration
            let default_config = SystemConfig {
                default_shell: "/bin/bash".to_string(),
                default_gui: "tau-desktop".to_string(),
                session_timeout: 3600, // 1 hour
                max_failed_logins: 5,
                lockout_duration: 300, // 5 minutes
                guest_session_enabled: true,
                remote_session_enabled: true,
                security: SecuritySettings {
                    password_min_length: 8,
                    require_special_chars: true,
                    require_numbers: true,
                    require_uppercase: true,
                    password_expiry_days: 90,
                    session_encryption: true,
                    audit_logging: true,
                },
            };
            
            self.save_system_config(&default_config)?;
            Ok(default_config)
        }
    }
    
    pub fn save_system_config(&self, config: &SystemConfig) -> Result<(), Box<dyn std::error::Error>> {
        let content = toml::to_string_pretty(config)?;
        fs::write(&self.system_config_path, content)?;
        Ok(())
    }
    
    pub fn load_user_config(&self, username: &str) -> Result<UserConfig, Box<dyn std::error::Error>> {
        let config_path = format!("{}/{}/.tau/config.toml", self.user_config_dir, username);
        
        if Path::new(&config_path).exists() {
            let content = fs::read_to_string(&config_path)?;
            let config: UserConfig = toml::from_str(&content)?;
            Ok(config)
        } else {
            // Create default user configuration
            let default_config = self.create_default_user_config(username)?;
            self.save_user_config(&default_config)?;
            Ok(default_config)
        }
    }
    
    pub fn save_user_config(&self, config: &UserConfig) -> Result<(), Box<dyn std::error::Error>> {
        let config_dir = format!("{}/{}/.tau", self.user_config_dir, config.username);
        fs::create_dir_all(&config_dir)?;
        
        let config_path = format!("{}/config.toml", config_dir);
        let content = toml::to_string_pretty(config)?;
        fs::write(&config_path, content)?;
        
        Ok(())
    }
    
    pub fn load_session_config(&self, username: &str) -> Result<SessionConfig, Box<dyn std::error::Error>> {
        let config_path = format!("{}/{}/.tau/session.toml", self.user_config_dir, username);
        
        if Path::new(&config_path).exists() {
            let content = fs::read_to_string(&config_path)?;
            let config: SessionConfig = toml::from_str(&content)?;
            Ok(config)
        } else {
            // Create default session configuration
            let default_config = self.create_default_session_config(username)?;
            self.save_session_config(username, &default_config)?;
            Ok(default_config)
        }
    }
    
    pub fn save_session_config(&self, username: &str, config: &SessionConfig) -> Result<(), Box<dyn std::error::Error>> {
        let config_dir = format!("{}/{}/.tau", self.user_config_dir, username);
        fs::create_dir_all(&config_dir)?;
        
        let config_path = format!("{}/session.toml", config_dir);
        let content = toml::to_string_pretty(config)?;
        fs::write(&config_path, content)?;
        
        Ok(())
    }
    
    fn create_default_user_config(&self, username: &str) -> Result<UserConfig, Box<dyn std::error::Error>> {
        let system_config = self.load_system_config()?;
        
        Ok(UserConfig {
            username: username.to_string(),
            uid: 1000, // Would be assigned by user management
            gid: 1000,
            home: format!("/home/{}", username),
            shell: Some(system_config.default_shell.clone()),
            gui: Some(system_config.default_gui.clone()),
            groups: vec!["users".to_string()],
            enabled: true,
            admin: false,
            preferences: UserPreferences {
                theme: "tau-dark".to_string(),
                locale: "en_US.UTF-8".to_string(),
                timezone: "UTC".to_string(),
                keyboard_layout: "us".to_string(),
                accessibility: AccessibilitySettings {
                    high_contrast: false,
                    large_text: false,
                    screen_reader: false,
                    keyboard_navigation: false,
                    reduced_motion: false,
                },
                privacy: PrivacySettings {
                    telemetry: false,
                    location_services: false,
                    camera_access: false,
                    microphone_access: false,
                    file_sharing: false,
                },
            },
        })
    }
    
    fn create_default_session_config(&self, username: &str) -> Result<SessionConfig, Box<dyn std::error::Error>> {
        let system_config = self.load_system_config()?;
        let user_config = self.load_user_config(username)?;
        
        let mut env = HashMap::new();
        env.insert("USER".to_string(), username.to_string());
        env.insert("HOME".to_string(), format!("/home/{}", username));
        env.insert("SHELL".to_string(), system_config.default_shell.clone());
        env.insert("LANG".to_string(), user_config.preferences.locale.clone());
        
        Ok(SessionConfig {
            shell: user_config.shell.clone(),
            gui: user_config.gui.clone(),
            startup_apps: vec![],
            theme: user_config.preferences.theme.clone(),
            locale: user_config.preferences.locale.clone(),
            session_timeout: system_config.session_timeout,
            auto_lock: true,
            auto_lock_timeout: 300, // 5 minutes
            environment: env,
            permissions: SessionPermissions {
                network_access: true,
                file_system_access: true,
                device_access: false,
                system_access: false,
                allowed_apps: vec![],
                blocked_apps: vec![],
            },
        })
    }
    
    pub fn validate_password(&self, password: &str) -> Result<(), Box<dyn std::error::Error>> {
        let system_config = self.load_system_config()?;
        let security = &system_config.security;
        
        if password.len() < security.password_min_length as usize {
            return Err(format!("Password must be at least {} characters long", security.password_min_length).into());
        }
        
        if security.require_special_chars && !password.chars().any(|c| "!@#$%^&*()_+-=[]{}|;:,.<>?".contains(c)) {
            return Err("Password must contain at least one special character".into());
        }
        
        if security.require_numbers && !password.chars().any(|c| c.is_numeric()) {
            return Err("Password must contain at least one number".into());
        }
        
        if security.require_uppercase && !password.chars().any(|c| c.is_uppercase()) {
            return Err("Password must contain at least one uppercase letter".into());
        }
        
        Ok(())
    }
    
    pub fn get_user_home(&self, username: &str) -> String {
        format!("{}/{}", self.user_config_dir, username)
    }
    
    pub fn ensure_user_directories(&self, username: &str) -> Result<(), Box<dyn std::error::Error>> {
        let home = self.get_user_home(username);
        let directories = vec![
            format!("{}/.config", home),
            format!("{}/.cache", home),
            format!("{}/.local/share", home),
            format!("{}/.local/state", home),
            format!("{}/.tau", home),
        ];
        
        for dir in directories {
            fs::create_dir_all(&dir)?;
        }
        
        Ok(())
    }
    
    pub fn list_user_configs(&self) -> Result<Vec<String>, Box<dyn std::error::Error>> {
        let mut users = Vec::new();
        
        if let Ok(entries) = fs::read_dir(&self.user_config_dir) {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if path.is_dir() {
                        if let Some(username) = path.file_name() {
                            if let Some(username_str) = username.to_str() {
                                let config_path = format!("{}/.tau/config.toml", path.display());
                                if Path::new(&config_path).exists() {
                                    users.push(username_str.to_string());
                                }
                            }
                        }
                    }
                }
            }
        }
        
        Ok(users)
    }
}

impl Default for SessionConfig {
    fn default() -> Self {
        SessionConfig {
            shell: Some("/bin/bash".to_string()),
            gui: Some("tau-desktop".to_string()),
            startup_apps: vec![],
            theme: "tau-dark".to_string(),
            locale: "en_US.UTF-8".to_string(),
            session_timeout: 3600,
            auto_lock: true,
            auto_lock_timeout: 300,
            environment: HashMap::new(),
            permissions: SessionPermissions {
                network_access: true,
                file_system_access: true,
                device_access: false,
                system_access: false,
                allowed_apps: vec![],
                blocked_apps: vec![],
            },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    
    #[test]
    fn test_config_manager() {
        let temp_dir = tempdir().unwrap();
        let config_dir = temp_dir.path().join("home");
        fs::create_dir_all(&config_dir).unwrap();
        
        let mut config_manager = ConfigManager {
            system_config_path: temp_dir.path().join("system.toml").to_str().unwrap().to_string(),
            user_config_dir: config_dir.to_str().unwrap().to_string(),
        };
        
        // Test system config creation
        let system_config = config_manager.load_system_config().unwrap();
        assert_eq!(system_config.default_shell, "/bin/bash");
        assert_eq!(system_config.max_failed_logins, 5);
        
        // Test user config creation
        let user_config = config_manager.load_user_config("testuser").unwrap();
        assert_eq!(user_config.username, "testuser");
        assert_eq!(user_config.home, "/home/testuser");
        
        // Test session config creation
        let session_config = config_manager.load_session_config("testuser").unwrap();
        assert_eq!(session_config.theme, "tau-dark");
        assert_eq!(session_config.locale, "en_US.UTF-8");
    }
    
    #[test]
    fn test_password_validation() {
        let temp_dir = tempdir().unwrap();
        let config_manager = ConfigManager {
            system_config_path: temp_dir.path().join("system.toml").to_str().unwrap().to_string(),
            user_config_dir: temp_dir.path().join("home").to_str().unwrap().to_string(),
        };
        
        // Test valid password
        assert!(config_manager.validate_password("SecurePass123!").is_ok());
        
        // Test too short password
        assert!(config_manager.validate_password("short").is_err());
        
        // Test password without special characters
        assert!(config_manager.validate_password("SecurePass123").is_err());
    }
} 