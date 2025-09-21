use serde::{Deserialize, Serialize};
use std::fs;
use anyhow::Result;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InputConfig {
    pub config_path: String,
    pub default_keymap: String,
    pub auto_detect_devices: bool,
    pub enable_accessibility: bool,
    pub sticky_keys_enabled: bool,
    pub slow_keys_enabled: bool,
    pub repeat_delay: u64,
    pub repeat_rate: u64,
    pub mouse_sensitivity: f32,
    pub touchpad_sensitivity: f32,
    pub log_level: String,
}

impl InputConfig {
    pub fn load(path: &str) -> Result<Self> {
        if let Ok(contents) = fs::read_to_string(path) {
            let config: InputConfig = toml::from_str(&contents)?;
            Ok(config)
        } else {
            // Return default configuration
            Ok(Self::default())
        }
    }
    
    pub fn save(&self, path: &str) -> Result<()> {
        let contents = toml::to_string_pretty(self)?;
        fs::write(path, contents)?;
        Ok(())
    }
}

impl Default for InputConfig {
    fn default() -> Self {
        Self {
            config_path: "/etc/tau/input.toml".to_string(),
            default_keymap: "us".to_string(),
            auto_detect_devices: true,
            enable_accessibility: false,
            sticky_keys_enabled: false,
            slow_keys_enabled: false,
            repeat_delay: 600, // milliseconds
            repeat_rate: 25,   // milliseconds
            mouse_sensitivity: 1.0,
            touchpad_sensitivity: 1.0,
            log_level: "info".to_string(),
        }
    }
} 