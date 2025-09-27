use std::process::Command;
use std::sync::Arc;
use tokio::sync::Mutex;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use log::{info, warn, error};

use crate::config::PowerConfig;
use crate::power_profiles::PowerProfile;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PowerState {
    OnBattery,
    OnAC,
    Charging,
    Discharging,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BatteryInfo {
    pub percentage: f32,
    pub state: PowerState,
    pub time_remaining: Option<u32>, // minutes
    pub temperature: Option<f32>,
    pub voltage: Option<f32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PowerInfo {
    pub battery: Option<BatteryInfo>,
    pub ac_connected: bool,
    pub current_profile: PowerProfile,
    pub system_state: PowerState,
}

pub struct PowerManager {
    config: PowerConfig,
    current_info: PowerInfo,
    listeners: Vec<Box<dyn PowerEventListener + Send + Sync>>,
}

#[async_trait::async_trait]
pub trait PowerEventListener {
    async fn on_power_state_change(&self, old_state: &PowerState, new_state: &PowerState);
    async fn on_battery_level_change(&self, old_level: f32, new_level: f32);
    async fn on_ac_state_change(&self, connected: bool);
}

impl PowerManager {
    pub fn new(config: PowerConfig) -> Result<Self> {
        let current_info = PowerInfo {
            battery: None,
            ac_connected: false,
            current_profile: PowerProfile::Balanced,
            system_state: PowerState::Unknown,
        };
        
        Ok(Self {
            config,
            current_info,
            listeners: Vec::new(),
        })
    }
    
    pub async fn get_power_info(&self) -> PowerInfo {
        self.current_info.clone()
    }
    
    pub async fn set_power_profile(&mut self, profile: PowerProfile) -> Result<()> {
        info!("Setting power profile to {:?}", profile);
        
        match profile {
            PowerProfile::Performance => {
                self.set_cpu_governor("performance").await?;
                self.set_backlight_brightness(100).await?;
            }
            PowerProfile::Balanced => {
                self.set_cpu_governor("ondemand").await?;
                self.set_backlight_brightness(80).await?;
            }
            PowerProfile::BatterySaver => {
                self.set_cpu_governor("powersave").await?;
                self.set_backlight_brightness(50).await?;
                self.enable_power_saving_features().await?;
            }
        }
        
        self.current_info.current_profile = profile;
        Ok(())
    }
    
    pub async fn suspend(&self) -> Result<()> {
        info!("Suspending system");
        let output = Command::new("systemctl")
            .args(&["suspend"])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to suspend: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        Ok(())
    }
    
    pub async fn shutdown(&self) -> Result<()> {
        info!("Shutting down system");
        let output = Command::new("systemctl")
            .args(&["poweroff"])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to shutdown: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        Ok(())
    }
    
    pub async fn reboot(&self) -> Result<()> {
        info!("Rebooting system");
        let output = Command::new("systemctl")
            .args(&["reboot"])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to reboot: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        Ok(())
    }
    
    pub async fn update_power_info(&mut self, info: PowerInfo) -> Result<()> {
        let old_info = self.current_info.clone();
        self.current_info = info;
        
        // Notify listeners of changes
        if old_info.system_state != self.current_info.system_state {
            for listener in &self.listeners {
                listener.on_power_state_change(&old_info.system_state, &self.current_info.system_state).await;
            }
        }
        
        if let (Some(old_battery), Some(new_battery)) = (old_info.battery, &self.current_info.battery) {
            if (old_battery.percentage - new_battery.percentage).abs() > 5.0 {
                for listener in &self.listeners {
                    listener.on_battery_level_change(old_battery.percentage, new_battery.percentage).await;
                }
            }
        }
        
        if old_info.ac_connected != self.current_info.ac_connected {
            for listener in &self.listeners {
                listener.on_ac_state_change(self.current_info.ac_connected).await;
            }
        }
        
        Ok(())
    }
    
    pub fn add_listener(&mut self, listener: Box<dyn PowerEventListener + Send + Sync>) {
        self.listeners.push(listener);
    }
    
    async fn set_cpu_governor(&self, governor: &str) -> Result<()> {
        // Set CPU governor for all cores
        for cpu in 0..num_cpus::get() {
            let governor_path = format!("/sys/devices/system/cpu/cpu{}/cpufreq/scaling_governor", cpu);
            std::fs::write(&governor_path, governor)?;
        }
        Ok(())
    }
    
    async fn set_backlight_brightness(&self, percentage: u32) -> Result<()> {
        // Set backlight brightness
        if let Ok(backlight_path) = std::fs::read_dir("/sys/class/backlight") {
            for entry in backlight_path {
                if let Ok(entry) = entry {
                    let brightness_path = format!("{}/brightness", entry.path().display());
                    let max_brightness_path = format!("{}/max_brightness", entry.path().display());
                    
                    if let Ok(max_brightness) = std::fs::read_to_string(&max_brightness_path) {
                        if let Ok(max_brightness) = max_brightness.trim().parse::<u32>() {
                            let brightness = (max_brightness * percentage) / 100;
                            let _ = std::fs::write(&brightness_path, brightness.to_string());
                        }
                    }
                }
            }
        }
        Ok(())
    }
    
    async fn enable_power_saving_features(&self) -> Result<()> {
        // Enable various power saving features
        let _ = Command::new("echo")
            .args(&["1"])
            .stdout(std::process::Stdio::from(
                std::fs::File::create("/sys/module/snd_hda_intel/parameters/power_save")?
            ))
            .output();
        
        let _ = Command::new("echo")
            .args(&["auto"])
            .stdout(std::process::Stdio::from(
                std::fs::File::create("/sys/bus/usb/devices/*/power/control")?
            ))
            .output();
        
        Ok(())
    }
} 