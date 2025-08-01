use std::sync::Arc;
use tokio::sync::Mutex;
use zbus::{dbus_interface, Connection, SignalContext};
use anyhow::Result;
use log::{info, error};

use crate::power_manager::{PowerManager, PowerInfo, PowerState};
use crate::power_profiles::PowerProfile;

pub struct PowerDbusApi {
    power_manager: Arc<Mutex<PowerManager>>,
}

impl PowerDbusApi {
    pub fn new(power_manager: Arc<Mutex<PowerManager>>) -> Self {
        Self { power_manager }
    }
    
    pub async fn run(self) -> Result<()> {
        let connection = Connection::system().await?;
        
        // Create the D-Bus object
        let object_server = connection.object_server();
        let path = "/org/tau/PowerManager";
        let interface = PowerManagerInterface { power_manager: self.power_manager };
        
        object_server.at(path, interface).await?;
        
        // Export the interface
        connection.request_name("org.tau.PowerManager").await?;
        
        info!("Power Manager D-Bus API running on org.tau.PowerManager");
        
        // Keep the connection alive
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        }
    }
}

struct PowerManagerInterface {
    power_manager: Arc<Mutex<PowerManager>>,
}

#[dbus_interface(name = "org.tau.PowerManager")]
impl PowerManagerInterface {
    async fn get_power_info(&self) -> Result<PowerInfo, zbus::fdo::Error> {
        let manager = self.power_manager.lock().await;
        Ok(manager.get_power_info().await)
    }
    
    async fn set_power_profile(&self, profile: String) -> Result<(), zbus::fdo::Error> {
        let profile = match profile.as_str() {
            "performance" => PowerProfile::Performance,
            "balanced" => PowerProfile::Balanced,
            "battery-saver" => PowerProfile::BatterySaver,
            _ => return Err(zbus::fdo::Error::InvalidArgs("Invalid power profile".into())),
        };
        
        let mut manager = self.power_manager.lock().await;
        manager.set_power_profile(profile).await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        
        Ok(())
    }
    
    async fn suspend(&self) -> Result<(), zbus::fdo::Error> {
        let manager = self.power_manager.lock().await;
        manager.suspend().await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn shutdown(&self) -> Result<(), zbus::fdo::Error> {
        let manager = self.power_manager.lock().await;
        manager.shutdown().await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn reboot(&self) -> Result<(), zbus::fdo::Error> {
        let manager = self.power_manager.lock().await;
        manager.reboot().await
            .map_err(|e| zbus::fdo::Error::Failed(e.to_string()))?;
        Ok(())
    }
    
    async fn get_battery_percentage(&self) -> Result<f32, zbus::fdo::Error> {
        let manager = self.power_manager.lock().await;
        let info = manager.get_power_info().await;
        
        if let Some(battery) = info.battery {
            Ok(battery.percentage)
        } else {
            Err(zbus::fdo::Error::Failed("No battery available".into()))
        }
    }
    
    async fn is_ac_connected(&self) -> Result<bool, zbus::fdo::Error> {
        let manager = self.power_manager.lock().await;
        let info = manager.get_power_info().await;
        Ok(info.ac_connected)
    }
    
    async fn get_power_state(&self) -> Result<String, zbus::fdo::Error> {
        let manager = self.power_manager.lock().await;
        let info = manager.get_power_info().await;
        
        let state_str = match info.system_state {
            PowerState::OnBattery => "on-battery",
            PowerState::OnAC => "on-ac",
            PowerState::Charging => "charging",
            PowerState::Discharging => "discharging",
            PowerState::Unknown => "unknown",
        };
        
        Ok(state_str.to_string())
    }
    
    async fn get_current_profile(&self) -> Result<String, zbus::fdo::Error> {
        let manager = self.power_manager.lock().await;
        let info = manager.get_power_info().await;
        
        let profile_str = match info.current_profile {
            PowerProfile::Performance => "performance",
            PowerProfile::Balanced => "balanced",
            PowerProfile::BatterySaver => "battery-saver",
        };
        
        Ok(profile_str.to_string())
    }
} 