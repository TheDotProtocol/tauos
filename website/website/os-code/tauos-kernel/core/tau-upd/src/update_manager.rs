use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use log::{info, warn, error};

use crate::config::UpdateConfig;
use crate::update_manifest::{UpdateManifest, UpdateInfo};
use crate::update_checker::UpdateChecker;
use crate::update_downloader::UpdateDownloader;
use crate::update_applier::UpdateApplier;
use crate::update_verifier::UpdateVerifier;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UpdateState {
    Idle,
    Checking,
    Downloading,
    Verifying,
    Applying,
    Completed,
    Failed,
    RollingBack,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateStatus {
    pub state: UpdateState,
    pub current_version: String,
    pub available_version: Option<String>,
    pub download_progress: f32,
    pub apply_progress: f32,
    pub last_check: Option<chrono::DateTime<chrono::Utc>>,
    pub error_message: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateChannel {
    pub name: String,
    pub url: String,
    pub priority: u32,
    pub enabled: bool,
}

pub struct UpdateManager {
    config: UpdateConfig,
    status: UpdateStatus,
    channels: HashMap<String, UpdateChannel>,
    listeners: Vec<Box<dyn UpdateEventListener + Send + Sync>>,
}

#[async_trait::async_trait]
pub trait UpdateEventListener {
    async fn on_update_available(&self, update_info: &UpdateInfo);
    async fn on_update_progress(&self, progress: f32);
    async fn on_update_completed(&self, version: &str);
    async fn on_update_failed(&self, error: &str);
    async fn on_rollback_completed(&self);
}

impl UpdateManager {
    pub fn new(config: UpdateConfig) -> Result<Self> {
        let status = UpdateStatus {
            state: UpdateState::Idle,
            current_version: config.current_version.clone(),
            available_version: None,
            download_progress: 0.0,
            apply_progress: 0.0,
            last_check: None,
            error_message: None,
        };
        
        let mut channels = HashMap::new();
        for channel in &config.update_channels {
            channels.insert(channel.name.clone(), channel.clone());
        }
        
        Ok(Self {
            config,
            status,
            channels,
            listeners: Vec::new(),
        })
    }
    
    pub async fn get_status(&self) -> UpdateStatus {
        self.status.clone()
    }
    
    pub async fn check_for_updates(&mut self) -> Result<Option<UpdateInfo>> {
        info!("Checking for updates");
        self.status.state = UpdateState::Checking;
        self.status.error_message = None;
        
        let checker = UpdateChecker::new(self.config.clone());
        
        for (channel_name, channel) in &self.channels {
            if !channel.enabled {
                continue;
            }
            
            match checker.check_channel(channel).await {
                Ok(Some(update_info)) => {
                    info!("Update available: {} -> {}", 
                          self.status.current_version, update_info.version);
                    
                    self.status.available_version = Some(update_info.version.clone());
                    self.status.last_check = Some(chrono::Utc::now());
                    
                    // Notify listeners
                    for listener in &self.listeners {
                        listener.on_update_available(&update_info).await;
                    }
                    
                    return Ok(Some(update_info));
                }
                Ok(None) => {
                    info!("No updates available in channel: {}", channel_name);
                }
                Err(e) => {
                    warn!("Failed to check channel {}: {}", channel_name, e);
                }
            }
        }
        
        self.status.state = UpdateState::Idle;
        self.status.last_check = Some(chrono::Utc::now());
        Ok(None)
    }
    
    pub async fn download_update(&mut self, update_info: &UpdateInfo) -> Result<()> {
        info!("Downloading update: {}", update_info.version);
        self.status.state = UpdateState::Downloading;
        self.status.download_progress = 0.0;
        
        let downloader = UpdateDownloader::new(self.config.clone());
        
        match downloader.download_update(update_info, &mut self.status.download_progress).await {
            Ok(()) => {
                info!("Update downloaded successfully");
                self.status.download_progress = 100.0;
                Ok(())
            }
            Err(e) => {
                error!("Failed to download update: {}", e);
                self.status.state = UpdateState::Failed;
                self.status.error_message = Some(format!("Download failed: {}", e));
                Err(e)
            }
        }
    }
    
    pub async fn verify_update(&mut self, update_info: &UpdateInfo) -> Result<()> {
        info!("Verifying update: {}", update_info.version);
        self.status.state = UpdateState::Verifying;
        
        let verifier = UpdateVerifier::new(self.config.clone());
        
        match verifier.verify_update(update_info).await {
            Ok(()) => {
                info!("Update verified successfully");
                Ok(())
            }
            Err(e) => {
                error!("Failed to verify update: {}", e);
                self.status.state = UpdateState::Failed;
                self.status.error_message = Some(format!("Verification failed: {}", e));
                Err(e)
            }
        }
    }
    
    pub async fn apply_update(&mut self, update_info: &UpdateInfo) -> Result<()> {
        info!("Applying update: {}", update_info.version);
        self.status.state = UpdateState::Applying;
        self.status.apply_progress = 0.0;
        
        let applier = UpdateApplier::new(self.config.clone());
        
        match applier.apply_update(update_info, &mut self.status.apply_progress).await {
            Ok(()) => {
                info!("Update applied successfully");
                self.status.state = UpdateState::Completed;
                self.status.current_version = update_info.version.clone();
                self.status.apply_progress = 100.0;
                
                // Notify listeners
                for listener in &self.listeners {
                    listener.on_update_completed(&update_info.version).await;
                }
                
                Ok(())
            }
            Err(e) => {
                error!("Failed to apply update: {}", e);
                self.status.state = UpdateState::Failed;
                self.status.error_message = Some(format!("Apply failed: {}", e));
                
                // Notify listeners
                for listener in &self.listeners {
                    listener.on_update_failed(&e.to_string()).await;
                }
                
                Err(e)
            }
        }
    }
    
    pub async fn rollback_update(&mut self) -> Result<()> {
        info!("Rolling back update");
        self.status.state = UpdateState::RollingBack;
        
        let applier = UpdateApplier::new(self.config.clone());
        
        match applier.rollback_update().await {
            Ok(()) => {
                info!("Rollback completed successfully");
                self.status.state = UpdateState::Idle;
                
                // Notify listeners
                for listener in &self.listeners {
                    listener.on_rollback_completed().await;
                }
                
                Ok(())
            }
            Err(e) => {
                error!("Failed to rollback update: {}", e);
                self.status.state = UpdateState::Failed;
                self.status.error_message = Some(format!("Rollback failed: {}", e));
                Err(e)
            }
        }
    }
    
    pub async fn enable_channel(&mut self, channel_name: &str) -> Result<()> {
        if let Some(channel) = self.channels.get_mut(channel_name) {
            channel.enabled = true;
            info!("Enabled update channel: {}", channel_name);
            Ok(())
        } else {
            Err(anyhow::anyhow!("Channel not found: {}", channel_name))
        }
    }
    
    pub async fn disable_channel(&mut self, channel_name: &str) -> Result<()> {
        if let Some(channel) = self.channels.get_mut(channel_name) {
            channel.enabled = false;
            info!("Disabled update channel: {}", channel_name);
            Ok(())
        } else {
            Err(anyhow::anyhow!("Channel not found: {}", channel_name))
        }
    }
    
    pub fn add_listener(&mut self, listener: Box<dyn UpdateEventListener + Send + Sync>) {
        self.listeners.push(listener);
    }
    
    pub async fn get_channels(&self) -> Vec<UpdateChannel> {
        self.channels.values().cloned().collect()
    }
    
    pub async fn reload_config(&mut self) -> Result<()> {
        let new_config = UpdateConfig::load(&self.config.config_path)?;
        self.config = new_config;
        
        // Reload channels
        self.channels.clear();
        for channel in &self.config.update_channels {
            self.channels.insert(channel.name.clone(), channel.clone());
        }
        
        info!("Update configuration reloaded");
        Ok(())
    }
} 