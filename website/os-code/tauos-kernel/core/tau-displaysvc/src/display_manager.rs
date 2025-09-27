use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use log::{info, warn, error};

use crate::config::DisplayConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Monitor {
    pub id: String,
    pub name: String,
    pub connector: String,
    pub manufacturer: Option<String>,
    pub model: Option<String>,
    pub serial: Option<String>,
    pub connected: bool,
    pub primary: bool,
    pub resolution: Resolution,
    pub refresh_rate: f32,
    pub brightness: f32,
    pub gamma: f32,
    pub rotation: Rotation,
    pub scale: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Resolution {
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Rotation {
    Normal,
    Left,
    Right,
    Inverted,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DisplayConfiguration {
    pub monitors: HashMap<String, Monitor>,
    pub primary_monitor: Option<String>,
    pub mirroring: bool,
    pub extended_desktop: bool,
}

pub struct DisplayManager {
    config: DisplayConfig,
    configuration: DisplayConfiguration,
    listeners: Vec<Box<dyn DisplayEventListener + Send + Sync>>,
}

#[async_trait::async_trait]
pub trait DisplayEventListener {
    async fn on_monitor_connected(&self, monitor: &Monitor);
    async fn on_monitor_disconnected(&self, monitor_id: &str);
    async fn on_resolution_changed(&self, monitor_id: &str, resolution: &Resolution);
    async fn on_brightness_changed(&self, monitor_id: &str, brightness: f32);
}

impl DisplayManager {
    pub fn new(config: DisplayConfig) -> Result<Self> {
        let configuration = DisplayConfiguration {
            monitors: HashMap::new(),
            primary_monitor: None,
            mirroring: false,
            extended_desktop: true,
        };
        
        Ok(Self {
            config,
            configuration,
            listeners: Vec::new(),
        })
    }
    
    pub async fn get_monitors(&self) -> Vec<Monitor> {
        self.configuration.monitors.values().cloned().collect()
    }
    
    pub async fn get_monitor(&self, monitor_id: &str) -> Option<Monitor> {
        self.configuration.monitors.get(monitor_id).cloned()
    }
    
    pub async fn add_monitor(&mut self, monitor: Monitor) -> Result<()> {
        info!("Adding monitor: {} ({})", monitor.name, monitor.connector);
        
        let monitor_id = monitor.id.clone();
        self.configuration.monitors.insert(monitor_id.clone(), monitor.clone());
        
        // Set as primary if it's the first monitor
        if self.configuration.primary_monitor.is_none() {
            self.configuration.primary_monitor = Some(monitor_id.clone());
        }
        
        // Notify listeners
        for listener in &self.listeners {
            listener.on_monitor_connected(&monitor).await;
        }
        
        Ok(())
    }
    
    pub async fn remove_monitor(&mut self, monitor_id: &str) -> Result<()> {
        if let Some(monitor) = self.configuration.monitors.remove(monitor_id) {
            info!("Removing monitor: {} ({})", monitor.name, monitor.connector);
            
            // Update primary monitor if needed
            if self.configuration.primary_monitor.as_ref() == Some(monitor_id) {
                self.configuration.primary_monitor = self.configuration.monitors.keys().next().cloned();
            }
            
            // Notify listeners
            for listener in &self.listeners {
                listener.on_monitor_disconnected(monitor_id).await;
            }
        }
        
        Ok(())
    }
    
    pub async fn set_resolution(&mut self, monitor_id: &str, resolution: Resolution) -> Result<()> {
        if let Some(monitor) = self.configuration.monitors.get_mut(monitor_id) {
            info!("Setting resolution for {} to {}x{}", monitor_id, resolution.width, resolution.height);
            
            let old_resolution = monitor.resolution.clone();
            monitor.resolution = resolution.clone();
            
            // Apply resolution using xrandr or similar
            self.apply_resolution(monitor_id, &resolution).await?;
            
            // Notify listeners
            for listener in &self.listeners {
                listener.on_resolution_changed(monitor_id, &resolution).await;
            }
        } else {
            return Err(anyhow::anyhow!("Monitor not found: {}", monitor_id));
        }
        
        Ok(())
    }
    
    pub async fn set_brightness(&mut self, monitor_id: &str, brightness: f32) -> Result<()> {
        if let Some(monitor) = self.configuration.monitors.get_mut(monitor_id) {
            let brightness = brightness.clamp(0.0, 1.0);
            info!("Setting brightness for {} to {:.2}", monitor_id, brightness);
            
            monitor.brightness = brightness;
            
            // Apply brightness
            self.apply_brightness(monitor_id, brightness).await?;
            
            // Notify listeners
            for listener in &self.listeners {
                listener.on_brightness_changed(monitor_id, brightness).await;
            }
        } else {
            return Err(anyhow::anyhow!("Monitor not found: {}", monitor_id));
        }
        
        Ok(())
    }
    
    pub async fn set_scale(&mut self, monitor_id: &str, scale: f32) -> Result<()> {
        if let Some(monitor) = self.configuration.monitors.get_mut(monitor_id) {
            let scale = scale.clamp(0.5, 3.0);
            info!("Setting scale for {} to {:.2}", monitor_id, scale);
            
            monitor.scale = scale;
            
            // Apply scale using xrandr or similar
            self.apply_scale(monitor_id, scale).await?;
        } else {
            return Err(anyhow::anyhow!("Monitor not found: {}", monitor_id));
        }
        
        Ok(())
    }
    
    pub async fn set_rotation(&mut self, monitor_id: &str, rotation: Rotation) -> Result<()> {
        if let Some(monitor) = self.configuration.monitors.get_mut(monitor_id) {
            info!("Setting rotation for {} to {:?}", monitor_id, rotation);
            
            monitor.rotation = rotation.clone();
            
            // Apply rotation using xrandr or similar
            self.apply_rotation(monitor_id, &rotation).await?;
        } else {
            return Err(anyhow::anyhow!("Monitor not found: {}", monitor_id));
        }
        
        Ok(())
    }
    
    pub async fn set_primary_monitor(&mut self, monitor_id: &str) -> Result<()> {
        if self.configuration.monitors.contains_key(monitor_id) {
            info!("Setting primary monitor to: {}", monitor_id);
            self.configuration.primary_monitor = Some(monitor_id.to_string());
            
            // Apply primary monitor setting
            self.apply_primary_monitor(monitor_id).await?;
        } else {
            return Err(anyhow::anyhow!("Monitor not found: {}", monitor_id));
        }
        
        Ok(())
    }
    
    pub async fn enable_mirroring(&mut self) -> Result<()> {
        info!("Enabling display mirroring");
        self.configuration.mirroring = true;
        self.configuration.extended_desktop = false;
        
        // Apply mirroring configuration
        self.apply_mirroring().await?;
        
        Ok(())
    }
    
    pub async fn disable_mirroring(&mut self) -> Result<()> {
        info!("Disabling display mirroring");
        self.configuration.mirroring = false;
        self.configuration.extended_desktop = true;
        
        // Apply extended desktop configuration
        self.apply_extended_desktop().await?;
        
        Ok(())
    }
    
    pub fn add_listener(&mut self, listener: Box<dyn DisplayEventListener + Send + Sync>) {
        self.listeners.push(listener);
    }
    
    async fn apply_resolution(&self, monitor_id: &str, resolution: &Resolution) -> Result<()> {
        // Use xrandr to set resolution
        let output = std::process::Command::new("xrandr")
            .args(&[
                "--output", monitor_id,
                "--mode", &format!("{}x{}", resolution.width, resolution.height)
            ])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to set resolution: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        Ok(())
    }
    
    async fn apply_brightness(&self, monitor_id: &str, brightness: f32) -> Result<()> {
        // Use xrandr to set brightness
        let output = std::process::Command::new("xrandr")
            .args(&[
                "--output", monitor_id,
                "--brightness", &format!("{:.2}", brightness)
            ])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to set brightness: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        Ok(())
    }
    
    async fn apply_scale(&self, monitor_id: &str, scale: f32) -> Result<()> {
        // Use xrandr to set scale
        let output = std::process::Command::new("xrandr")
            .args(&[
                "--output", monitor_id,
                "--scale", &format!("{:.2}x{:.2}", scale, scale)
            ])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to set scale: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        Ok(())
    }
    
    async fn apply_rotation(&self, monitor_id: &str, rotation: &Rotation) -> Result<()> {
        let rotation_str = match rotation {
            Rotation::Normal => "normal",
            Rotation::Left => "left",
            Rotation::Right => "right",
            Rotation::Inverted => "inverted",
        };
        
        let output = std::process::Command::new("xrandr")
            .args(&[
                "--output", monitor_id,
                "--rotation", rotation_str
            ])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to set rotation: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        Ok(())
    }
    
    async fn apply_primary_monitor(&self, monitor_id: &str) -> Result<()> {
        let output = std::process::Command::new("xrandr")
            .args(&[
                "--output", monitor_id,
                "--primary"
            ])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to set primary monitor: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        Ok(())
    }
    
    async fn apply_mirroring(&self) -> Result<()> {
        // Apply mirroring configuration using xrandr
        let monitors: Vec<_> = self.configuration.monitors.keys().collect();
        if monitors.len() >= 2 {
            let primary = &monitors[0];
            let secondary = &monitors[1];
            
            let output = std::process::Command::new("xrandr")
                .args(&[
                    "--output", secondary,
                    "--same-as", primary
                ])
                .output()?;
            
            if !output.status.success() {
                return Err(anyhow::anyhow!("Failed to enable mirroring: {}", 
                    String::from_utf8_lossy(&output.stderr)));
            }
        }
        
        Ok(())
    }
    
    async fn apply_extended_desktop(&self) -> Result<()> {
        // Apply extended desktop configuration using xrandr
        let monitors: Vec<_> = self.configuration.monitors.keys().collect();
        if monitors.len() >= 2 {
            let primary = &monitors[0];
            let secondary = &monitors[1];
            
            let output = std::process::Command::new("xrandr")
                .args(&[
                    "--output", secondary,
                    "--right-of", primary
                ])
                .output()?;
            
            if !output.status.success() {
                return Err(anyhow::anyhow!("Failed to enable extended desktop: {}", 
                    String::from_utf8_lossy(&output.stderr)));
            }
        }
        
        Ok(())
    }
} 