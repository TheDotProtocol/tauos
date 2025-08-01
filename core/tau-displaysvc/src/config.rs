use serde::{Deserialize, Serialize};
use std::fs;
use anyhow::Result;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DisplayConfig {
    pub config_path: String,
    pub auto_detect_monitors: bool,
    pub default_resolution: Resolution,
    pub default_scale: f32,
    pub default_brightness: f32,
    pub auto_brightness: bool,
    pub night_light_enabled: bool,
    pub night_light_temperature: u32,
    pub log_level: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Resolution {
    pub width: u32,
    pub height: u32,
}

impl DisplayConfig {
    pub fn load(path: &str) -> Result<Self> {
        if let Ok(contents) = fs::read_to_string(path) {
            let config: DisplayConfig = toml::from_str(&contents)?;
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

impl Default for DisplayConfig {
    fn default() -> Self {
        Self {
            config_path: "/etc/tau/display.toml".to_string(),
            auto_detect_monitors: true,
            default_resolution: Resolution {
                width: 1920,
                height: 1080,
            },
            default_scale: 1.0,
            default_brightness: 0.8,
            auto_brightness: false,
            night_light_enabled: false,
            night_light_temperature: 4000,
            log_level: "info".to_string(),
        }
    }
} 