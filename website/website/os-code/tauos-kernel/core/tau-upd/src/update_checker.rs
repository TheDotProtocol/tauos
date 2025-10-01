use std::sync::Arc;
use tokio::sync::Mutex;
use anyhow::Result;
use log::{info, warn, error};
use reqwest::Client;

use crate::config::UpdateConfig;
use crate::update_manifest::{UpdateManifest, UpdateInfo};
use crate::update_manager::UpdateChannel;

pub struct UpdateChecker {
    config: UpdateConfig,
    http_client: Client,
}

impl UpdateChecker {
    pub fn new(config: UpdateConfig) -> Self {
        let http_client = Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build()
            .unwrap_or_default();
        
        Self {
            config,
            http_client,
        }
    }
    
    pub async fn check_channel(&self, channel: &UpdateChannel) -> Result<Option<UpdateInfo>> {
        info!("Checking update channel: {}", channel.name);
        
        // Construct the manifest URL
        let manifest_url = format!("{}/manifest.json", channel.url);
        
        // Download the manifest
        let manifest_json = self.download_manifest(&manifest_url).await?;
        
        // Parse the manifest
        let manifest = UpdateManifest::from_json(&manifest_json)?;
        
        // Check if this update is newer than current version
        if !self.is_newer_version(&manifest.version)? {
            info!("No newer version available in channel: {}", channel.name);
            return Ok(None);
        }
        
        // Verify the manifest signature
        if !manifest.verify_signature(&self.config.public_key)? {
            return Err(anyhow::anyhow!("Invalid manifest signature"));
        }
        
        // Check compatibility
        if !manifest.is_compatible_with(&self.config.current_version) {
            warn!("Update {} is not compatible with current version {}", 
                  manifest.version, self.config.current_version);
            return Ok(None);
        }
        
        // Construct download URL
        let download_url = format!("{}/update-{}.tauupd", channel.url, manifest.version);
        
        // Create update info
        let update_info = UpdateInfo::new(
            manifest.version.clone(),
            manifest,
            download_url,
        );
        
        info!("Found update: {} -> {}", self.config.current_version, update_info.version);
        Ok(Some(update_info))
    }
    
    async fn download_manifest(&self, url: &str) -> Result<String> {
        info!("Downloading manifest from: {}", url);
        
        let response = self.http_client.get(url).send().await?;
        
        if !response.status().is_success() {
            return Err(anyhow::anyhow!("Failed to download manifest: HTTP {}", response.status()));
        }
        
        let manifest_text = response.text().await?;
        Ok(manifest_text)
    }
    
    fn is_newer_version(&self, new_version: &str) -> Result<bool> {
        // In a real implementation, this would use proper semantic versioning
        // For now, we'll do a simple string comparison
        let current = &self.config.current_version;
        
        // Simple version comparison - in real implementation use proper semver
        if current == new_version {
            return Ok(false);
        }
        
        // For now, assume any different version is newer
        // In real implementation, this would parse versions and compare properly
        Ok(true)
    }
    
    pub async fn check_all_channels(&self, channels: &[UpdateChannel]) -> Result<Option<UpdateInfo>> {
        for channel in channels {
            if !channel.enabled {
                continue;
            }
            
            match self.check_channel(channel).await {
                Ok(Some(update_info)) => {
                    return Ok(Some(update_info));
                }
                Ok(None) => {
                    info!("No update available in channel: {}", channel.name);
                }
                Err(e) => {
                    warn!("Failed to check channel {}: {}", channel.name, e);
                }
            }
        }
        
        Ok(None)
    }
    
    pub async fn get_channel_info(&self, channel: &UpdateChannel) -> Result<Option<UpdateManifest>> {
        let manifest_url = format!("{}/manifest.json", channel.url);
        
        match self.download_manifest(&manifest_url).await {
            Ok(manifest_json) => {
                let manifest = UpdateManifest::from_json(&manifest_json)?;
                Ok(Some(manifest))
            }
            Err(e) => {
                warn!("Failed to get channel info for {}: {}", channel.name, e);
                Ok(None)
            }
        }
    }
} 