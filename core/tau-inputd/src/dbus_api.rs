use std::sync::Arc;
use tokio::sync::Mutex;
use zbus::{dbus_interface, Connection, SignalContext};
use anyhow::Result;
use log::{info, error};

use crate::input_manager::{InputManager, InputDevice, KeymapInfo};

pub struct InputDbusApi {
    input_manager: Arc<Mutex<InputManager>>,
}

impl InputDbusApi {
    pub fn new(input_manager: Arc<Mutex<InputManager>>) -> Self {
        Self { input_manager }
    }
    
    pub async fn run(self) -> Result<()> {
        let connection = Connection::system().await?;
        
        // Create the D-Bus object
        let object_server = connection.object_server();
        let path = "/org/tau/InputManager";
        let interface = InputManagerInterface { input_manager: self.input_manager };
        
        object_server.at(path, interface).await?;
        
        // Export the interface
        connection.request_name("org.tau.InputManager").await?;
        
        info!("Input Manager D-Bus API running on org.tau.InputManager");
        
        // Keep the connection alive
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        }
    }
}

struct InputManagerInterface {
    input_manager: Arc<Mutex<InputManager>>,
}

#[dbus_interface(name = "org.tau.InputManager")]
impl InputManagerInterface {
    async fn get_devices(&self) -> Result<Vec<InputDevice>, zbus::fdo::Error> {
        let manager = self.input_manager.lock().await;
        Ok(manager.get_devices().await)
    }
    
    async fn get_device(&self, device_id: String) -> Result<Option<InputDevice>, zbus::fdo::Error> {
        let manager = self.input_manager.lock().await;
        Ok(manager.get_device(&device_id).await)
    }
    
    async fn set_keymap(&self, keymap: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.input_manager.lock().await;
        manager.set_keymap(&keymap).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn get_available_keymaps(&self) -> Result<Vec<KeymapInfo>, zbus::fdo::Error> {
        let manager = self.input_manager.lock().await;
        Ok(manager.get_available_keymaps().await)
    }
    
    async fn get_current_keymap(&self) -> Result<Option<String>, zbus::fdo::Error> {
        let manager = self.input_manager.lock().await;
        Ok(manager.get_current_keymap().await)
    }
    
    async fn enable_accessibility_feature(&self, feature: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.input_manager.lock().await;
        manager.enable_accessibility_feature(&feature).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn disable_accessibility_feature(&self, feature: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.input_manager.lock().await;
        manager.disable_accessibility_feature(&feature).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn get_accessibility_features(&self) -> Result<Vec<String>, zbus::fdo::Error> {
        let manager = self.input_manager.lock().await;
        Ok(manager.get_accessibility_features().await)
    }
    
    async fn remap_key(&self, from: String, to: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.input_manager.lock().await;
        manager.remap_key(&from, &to).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn reload_config(&self) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.input_manager.lock().await;
        manager.reload_config().await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
} 