use std::sync::Arc;
use tokio::sync::Mutex;
use zbus::{dbus_interface, Connection, SignalContext};
use anyhow::Result;
use log::{info, error};

use crate::update_manager::{UpdateManager, UpdateStatus, UpdateChannel};
use crate::update_manifest::UpdateInfo;

pub struct UpdateDbusApi {
    update_manager: Arc<Mutex<UpdateManager>>,
}

impl UpdateDbusApi {
    pub fn new(update_manager: Arc<Mutex<UpdateManager>>) -> Self {
        Self { update_manager }
    }
    
    pub async fn run(self) -> Result<()> {
        let connection = Connection::system().await?;
        
        // Create the D-Bus object
        let object_server = connection.object_server();
        let path = "/org/tau/Updater";
        let interface = UpdaterInterface { update_manager: self.update_manager };
        
        object_server.at(path, interface).await?;
        
        // Export the interface
        connection.request_name("org.tau.Updater").await?;
        
        info!("Update Manager D-Bus API running on org.tau.Updater");
        
        // Keep the connection alive
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        }
    }
}

struct UpdaterInterface {
    update_manager: Arc<Mutex<UpdateManager>>,
}

#[dbus_interface(name = "org.tau.Updater")]
impl UpdaterInterface {
    async fn get_status(&self) -> Result<UpdateStatus, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        Ok(manager.get_status().await)
    }
    
    async fn check_for_updates(&self) -> Result<Option<UpdateInfo>, zbus::fdo::Error> {
        let mut manager = self.update_manager.lock().await;
        manager.check_for_updates().await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))
    }
    
    async fn download_update(&self, version: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.update_manager.lock().await;
        
        // First check for updates to get the update info
        if let Ok(Some(update_info)) = manager.check_for_updates().await {
            if update_info.version == version {
                manager.download_update(&update_info).await
                    .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
                Ok(())
            } else {
                Err(zbus::fdo::Error::InvalidArgs("Version mismatch".into()))
            }
        } else {
            Err(zbus::fdo::Error::Failed("No update available".into()))
        }
    }
    
    async fn apply_update(&self, version: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.update_manager.lock().await;
        
        // First check for updates to get the update info
        if let Ok(Some(update_info)) = manager.check_for_updates().await {
            if update_info.version == version {
                // Download if not already downloaded
                if let Err(_) = manager.download_update(&update_info).await {
                    // Download failed, try to download
                    manager.download_update(&update_info).await
                        .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
                }
                
                // Verify the update
                manager.verify_update(&update_info).await
                    .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
                
                // Apply the update
                manager.apply_update(&update_info).await
                    .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
                
                Ok(())
            } else {
                Err(zbus::fdo::Error::InvalidArgs("Version mismatch".into()))
            }
        } else {
            Err(zbus::fdo::Error::Failed("No update available".into()))
        }
    }
    
    async fn rollback_update(&self) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.update_manager.lock().await;
        manager.rollback_update().await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))
    }
    
    async fn get_channels(&self) -> Result<Vec<UpdateChannel>, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        Ok(manager.get_channels().await)
    }
    
    async fn enable_channel(&self, channel_name: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.update_manager.lock().await;
        manager.enable_channel(&channel_name).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))
    }
    
    async fn disable_channel(&self, channel_name: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.update_manager.lock().await;
        manager.disable_channel(&channel_name).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))
    }
    
    async fn reload_config(&self) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.update_manager.lock().await;
        manager.reload_config().await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))
    }
    
    async fn get_current_version(&self) -> Result<String, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        Ok(status.current_version)
    }
    
    async fn get_available_version(&self) -> Result<Option<String>, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        Ok(status.available_version)
    }
    
    async fn get_download_progress(&self) -> Result<f32, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        Ok(status.download_progress)
    }
    
    async fn get_apply_progress(&self) -> Result<f32, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        Ok(status.apply_progress)
    }
    
    async fn get_last_check(&self) -> Result<Option<String>, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        Ok(status.last_check.map(|dt| dt.to_rfc3339()))
    }
    
    async fn get_error_message(&self) -> Result<Option<String>, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        Ok(status.error_message)
    }
    
    async fn is_update_available(&self) -> Result<bool, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        Ok(status.available_version.is_some())
    }
    
    async fn is_update_downloaded(&self) -> Result<bool, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        Ok(status.download_progress >= 100.0)
    }
    
    async fn is_update_applied(&self) -> Result<bool, zbus::fdo::Error> {
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        Ok(status.apply_progress >= 100.0)
    }
    
    async fn requires_reboot(&self) -> Result<bool, zbus::fdo::Error> {
        // Check if the current update requires a reboot
        let manager = self.update_manager.lock().await;
        let status = manager.get_status().await;
        
        if let Some(available_version) = &status.available_version {
            // In a real implementation, this would check the update manifest
            // For now, we'll return false
            Ok(false)
        } else {
            Ok(false)
        }
    }
    
    async fn get_update_size_mb(&self) -> Result<f64, zbus::fdo::Error> {
        // Get the size of the available update in MB
        let manager = self.update_manager.lock().await;
        
        if let Ok(Some(update_info)) = manager.check_for_updates().await {
            Ok(update_info.get_download_size_mb())
        } else {
            Ok(0.0)
        }
    }
} 