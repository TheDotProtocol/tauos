use serde::{Deserialize, Serialize};
use std::fs;
use anyhow::Result;

use crate::update_manager::UpdateChannel;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateConfig {
    pub config_path: String,
    pub current_version: String,
    pub system_root: String,
    pub download_dir: String,
    pub backup_dir: String,
    pub temp_dir: String,
    pub public_key: String,
    pub system_architecture: Option<String>,
    pub update_channels: Vec<UpdateChannel>,
    pub check_interval: u64,
    pub auto_download: bool,
    pub auto_apply: bool,
    pub require_user_confirmation: bool,
    pub max_download_retries: u32,
    pub download_timeout: u64,
    pub log_level: String,
}

impl UpdateConfig {
    pub fn load(path: &str) -> Result<Self> {
        if let Ok(contents) = fs::read_to_string(path) {
            let mut config: UpdateConfig = toml::from_str(&contents)?;
            config.config_path = path.to_string();
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

impl Default for UpdateConfig {
    fn default() -> Self {
        Self {
            config_path: "/etc/tau/upd.toml".to_string(),
            current_version: "1.0.0".to_string(),
            system_root: "/".to_string(),
            download_dir: "/var/lib/tau/upd/downloads".to_string(),
            backup_dir: "/var/lib/tau/upd/backups".to_string(),
            temp_dir: "/tmp/tau-upd".to_string(),
            public_key: "".to_string(), // Would be loaded from secure storage
            system_architecture: Some("x86_64".to_string()),
            update_channels: vec![
                UpdateChannel {
                    name: "stable".to_string(),
                    url: "https://updates.tauos.com/stable".to_string(),
                    priority: 1,
                    enabled: true,
                },
                UpdateChannel {
                    name: "dev".to_string(),
                    url: "https://updates.tauos.com/dev".to_string(),
                    priority: 2,
                    enabled: false,
                },
                UpdateChannel {
                    name: "nightly".to_string(),
                    url: "https://updates.tauos.com/nightly".to_string(),
                    priority: 3,
                    enabled: false,
                },
            ],
            check_interval: 3600, // 1 hour
            auto_download: false,
            auto_apply: false,
            require_user_confirmation: true,
            max_download_retries: 3,
            download_timeout: 300, // 5 minutes
            log_level: "info".to_string(),
        }
    }
}

impl UpdateConfig {
    pub fn get_primary_channel(&self) -> Option<&UpdateChannel> {
        self.update_channels.iter()
            .filter(|c| c.enabled)
            .min_by_key(|c| c.priority)
    }
    
    pub fn get_enabled_channels(&self) -> Vec<&UpdateChannel> {
        self.update_channels.iter()
            .filter(|c| c.enabled)
            .collect()
    }
    
    pub fn is_channel_enabled(&self, channel_name: &str) -> bool {
        self.update_channels.iter()
            .any(|c| c.name == channel_name && c.enabled)
    }
    
    pub fn enable_channel(&mut self, channel_name: &str) -> Result<()> {
        if let Some(channel) = self.update_channels.iter_mut()
            .find(|c| c.name == channel_name) {
            channel.enabled = true;
            Ok(())
        } else {
            Err(anyhow::anyhow!("Channel not found: {}", channel_name))
        }
    }
    
    pub fn disable_channel(&mut self, channel_name: &str) -> Result<()> {
        if let Some(channel) = self.update_channels.iter_mut()
            .find(|c| c.name == channel_name) {
            channel.enabled = false;
            Ok(())
        } else {
            Err(anyhow::anyhow!("Channel not found: {}", channel_name))
        }
    }
    
    pub fn add_channel(&mut self, channel: UpdateChannel) {
        // Remove existing channel with same name if it exists
        self.update_channels.retain(|c| c.name != channel.name);
        self.update_channels.push(channel);
    }
    
    pub fn remove_channel(&mut self, channel_name: &str) -> Result<()> {
        let initial_len = self.update_channels.len();
        self.update_channels.retain(|c| c.name != channel_name);
        
        if self.update_channels.len() == initial_len {
            Err(anyhow::anyhow!("Channel not found: {}", channel_name))
        } else {
            Ok(())
        }
    }
    
    pub fn get_channel_by_name(&self, channel_name: &str) -> Option<&UpdateChannel> {
        self.update_channels.iter()
            .find(|c| c.name == channel_name)
    }
    
    pub fn validate(&self) -> Result<()> {
        // Validate configuration
        if self.current_version.is_empty() {
            return Err(anyhow::anyhow!("Current version cannot be empty"));
        }
        
        if self.public_key.is_empty() {
            return Err(anyhow::anyhow!("Public key cannot be empty"));
        }
        
        if self.update_channels.is_empty() {
            return Err(anyhow::anyhow!("At least one update channel must be configured"));
        }
        
        if self.check_interval == 0 {
            return Err(anyhow::anyhow!("Check interval must be greater than 0"));
        }
        
        if self.download_timeout == 0 {
            return Err(anyhow::anyhow!("Download timeout must be greater than 0"));
        }
        
        Ok(())
    }
} 