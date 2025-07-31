use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{sleep, Duration};
use anyhow::Result;
use log::{info, warn, error};

use crate::power_manager::{PowerManager, PowerInfo, BatteryInfo, PowerState};

pub struct BatteryMonitor {
    power_manager: Arc<Mutex<PowerManager>>,
}

impl BatteryMonitor {
    pub fn new(power_manager: Arc<Mutex<PowerManager>>) -> Self {
        Self { power_manager }
    }
    
    pub async fn run(mut self) -> Result<()> {
        info!("Starting battery monitor");
        
        loop {
            match self.read_battery_info().await {
                Ok(battery_info) => {
                    let power_info = self.build_power_info(battery_info).await;
                    
                    if let Ok(mut manager) = self.power_manager.lock().await {
                        if let Err(e) = manager.update_power_info(power_info).await {
                            error!("Failed to update power info: {}", e);
                        }
                    }
                }
                Err(e) => {
                    warn!("Failed to read battery info: {}", e);
                }
            }
            
            sleep(Duration::from_secs(30)).await;
        }
    }
    
    async fn read_battery_info(&self) -> Result<Option<BatteryInfo>> {
        // Check if battery exists
        if !std::path::Path::new("/sys/class/power_supply/BAT0").exists() {
            return Ok(None);
        }
        
        let mut battery_info = BatteryInfo {
            percentage: 0.0,
            state: PowerState::Unknown,
            time_remaining: None,
            temperature: None,
            voltage: None,
        };
        
        // Read battery percentage
        if let Ok(percentage) = std::fs::read_to_string("/sys/class/power_supply/BAT0/capacity") {
            if let Ok(percentage) = percentage.trim().parse::<f32>() {
                battery_info.percentage = percentage;
            }
        }
        
        // Read battery status
        if let Ok(status) = std::fs::read_to_string("/sys/class/power_supply/BAT0/status") {
            battery_info.state = match status.trim() {
                "Charging" => PowerState::Charging,
                "Discharging" => PowerState::Discharging,
                "Full" => PowerState::OnAC,
                _ => PowerState::Unknown,
            };
        }
        
        // Read time remaining (if available)
        if let Ok(time) = std::fs::read_to_string("/sys/class/power_supply/BAT0/time_to_empty_now") {
            if let Ok(time) = time.trim().parse::<i32>() {
                if time > 0 {
                    battery_info.time_remaining = Some(time as u32);
                }
            }
        }
        
        // Read temperature (if available)
        if let Ok(temp) = std::fs::read_to_string("/sys/class/power_supply/BAT0/temp") {
            if let Ok(temp) = temp.trim().parse::<f32>() {
                battery_info.temperature = Some(temp / 10.0); // Convert from 0.1°C to °C
            }
        }
        
        // Read voltage (if available)
        if let Ok(voltage) = std::fs::read_to_string("/sys/class/power_supply/BAT0/voltage_now") {
            if let Ok(voltage) = voltage.trim().parse::<f32>() {
                battery_info.voltage = Some(voltage / 1_000_000.0); // Convert from μV to V
            }
        }
        
        Ok(Some(battery_info))
    }
    
    async fn build_power_info(&self, battery_info: Option<BatteryInfo>) -> PowerInfo {
        let ac_connected = self.check_ac_connected().await;
        
        let system_state = if ac_connected {
            if let Some(ref battery) = battery_info {
                match battery.state {
                    PowerState::Charging => PowerState::Charging,
                    _ => PowerState::OnAC,
                }
            } else {
                PowerState::OnAC
            }
        } else {
            PowerState::OnBattery
        };
        
        // Get current profile from power manager
        let current_profile = if let Ok(manager) = self.power_manager.lock().await {
            manager.get_power_info().await.current_profile
        } else {
            crate::power_profiles::PowerProfile::Balanced
        };
        
        PowerInfo {
            battery: battery_info,
            ac_connected,
            current_profile,
            system_state,
        }
    }
    
    async fn check_ac_connected(&self) -> bool {
        // Check if AC adapter is connected
        if std::path::Path::new("/sys/class/power_supply/AC/online").exists() {
            if let Ok(online) = std::fs::read_to_string("/sys/class/power_supply/AC/online") {
                return online.trim() == "1";
            }
        }
        
        // Alternative check for some systems
        if std::path::Path::new("/sys/class/power_supply/ADP1/online").exists() {
            if let Ok(online) = std::fs::read_to_string("/sys/class/power_supply/ADP1/online") {
                return online.trim() == "1";
            }
        }
        
        false
    }
} 