use serde::{Deserialize, Serialize};
use std::fs;
use anyhow::Result;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PowerConfig {
    pub monitoring_interval: u64,
    pub default_profile: PowerProfile,
    pub auto_suspend_enabled: bool,
    pub auto_suspend_timeout: u64,
    pub low_battery_threshold: f32,
    pub critical_battery_threshold: f32,
    pub brightness_control: bool,
    pub cpu_control: bool,
    pub log_level: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PowerProfile {
    Performance,
    Balanced,
    BatterySaver,
}

impl PowerConfig {
    pub fn load(path: &str) -> Result<Self> {
        if let Ok(contents) = fs::read_to_string(path) {
            let config: PowerConfig = toml::from_str(&contents)?;
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

impl Default for PowerConfig {
    fn default() -> Self {
        Self {
            monitoring_interval: 30,
            default_profile: PowerProfile::Balanced,
            auto_suspend_enabled: true,
            auto_suspend_timeout: 300, // 5 minutes
            low_battery_threshold: 20.0,
            critical_battery_threshold: 10.0,
            brightness_control: true,
            cpu_control: true,
            log_level: "info".to_string(),
        }
    }
} 