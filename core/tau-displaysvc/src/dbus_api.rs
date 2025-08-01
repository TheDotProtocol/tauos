use std::sync::Arc;
use tokio::sync::Mutex;
use zbus::{dbus_interface, Connection, SignalContext};
use anyhow::Result;
use log::{info, error};

use crate::display_manager::{DisplayManager, Monitor, Resolution, Rotation};

pub struct DisplayDbusApi {
    display_manager: Arc<Mutex<DisplayManager>>,
}

impl DisplayDbusApi {
    pub fn new(display_manager: Arc<Mutex<DisplayManager>>) -> Self {
        Self { display_manager }
    }
    
    pub async fn run(self) -> Result<()> {
        let connection = Connection::system().await?;
        
        // Create the D-Bus object
        let object_server = connection.object_server();
        let path = "/org/tau/DisplayManager";
        let interface = DisplayManagerInterface { display_manager: self.display_manager };
        
        object_server.at(path, interface).await?;
        
        // Export the interface
        connection.request_name("org.tau.DisplayManager").await?;
        
        info!("Display Manager D-Bus API running on org.tau.DisplayManager");
        
        // Keep the connection alive
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        }
    }
}

struct DisplayManagerInterface {
    display_manager: Arc<Mutex<DisplayManager>>,
}

#[dbus_interface(name = "org.tau.DisplayManager")]
impl DisplayManagerInterface {
    async fn get_monitors(&self) -> Result<Vec<Monitor>, zbus::fdo::Error> {
        let manager = self.display_manager.lock().await;
        Ok(manager.get_monitors().await)
    }
    
    async fn get_monitor(&self, monitor_id: String) -> Result<Option<Monitor>, zbus::fdo::Error> {
        let manager = self.display_manager.lock().await;
        Ok(manager.get_monitor(&monitor_id).await)
    }
    
    async fn set_resolution(&self, monitor_id: String, width: u32, height: u32) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.display_manager.lock().await;
        let resolution = Resolution { width, height };
        manager.set_resolution(&monitor_id, resolution).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn set_brightness(&self, monitor_id: String, brightness: f32) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.display_manager.lock().await;
        manager.set_brightness(&monitor_id, brightness).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn set_scale(&self, monitor_id: String, scale: f32) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.display_manager.lock().await;
        manager.set_scale(&monitor_id, scale).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn set_rotation(&self, monitor_id: String, rotation: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.display_manager.lock().await;
        let rotation_enum = match rotation.as_str() {
            "normal" => Rotation::Normal,
            "left" => Rotation::Left,
            "right" => Rotation::Right,
            "inverted" => Rotation::Inverted,
            _ => return Err(zbus::fdo::Error::InvalidArgs("Invalid rotation".into())),
        };
        manager.set_rotation(&monitor_id, rotation_enum).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn set_primary_monitor(&self, monitor_id: String) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.display_manager.lock().await;
        manager.set_primary_monitor(&monitor_id).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn enable_mirroring(&self) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.display_manager.lock().await;
        manager.enable_mirroring().await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn disable_mirroring(&self) -> Result<(), zbus::fdo::Error> {
        let mut manager = self.display_manager.lock().await;
        manager.disable_mirroring().await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
} 