use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use log::{info, warn, error};

use crate::config::InputConfig;
use crate::keymap_manager::KeymapManager;
use crate::accessibility::AccessibilityManager;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum InputDeviceType {
    Keyboard,
    Mouse,
    Touchpad,
    Touchscreen,
    Gamepad,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InputDevice {
    pub id: String,
    pub name: String,
    pub device_type: InputDeviceType,
    pub path: String,
    pub vendor_id: Option<u16>,
    pub product_id: Option<u16>,
    pub capabilities: Vec<String>,
    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InputEvent {
    pub device_id: String,
    pub event_type: String,
    pub timestamp: u64,
    pub data: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KeymapInfo {
    pub name: String,
    pub description: String,
    pub layout: String,
    pub variant: Option<String>,
}

pub struct InputManager {
    config: InputConfig,
    devices: HashMap<String, InputDevice>,
    keymap_manager: KeymapManager,
    accessibility_manager: AccessibilityManager,
    listeners: Vec<Box<dyn InputEventListener + Send + Sync>>,
}

#[async_trait::async_trait]
pub trait InputEventListener {
    async fn on_device_added(&self, device: &InputDevice);
    async fn on_device_removed(&self, device_id: &str);
    async fn on_key_event(&self, event: &InputEvent);
    async fn on_mouse_event(&self, event: &InputEvent);
    async fn on_touch_event(&self, event: &InputEvent);
}

impl InputManager {
    pub fn new(config: InputConfig) -> Result<Self> {
        let keymap_manager = KeymapManager::new()?;
        let accessibility_manager = AccessibilityManager::new()?;
        
        Ok(Self {
            config,
            devices: HashMap::new(),
            keymap_manager,
            accessibility_manager,
            listeners: Vec::new(),
        })
    }
    
    pub async fn get_devices(&self) -> Vec<InputDevice> {
        self.devices.values().cloned().collect()
    }
    
    pub async fn get_device(&self, device_id: &str) -> Option<InputDevice> {
        self.devices.get(device_id).cloned()
    }
    
    pub async fn add_device(&mut self, device: InputDevice) -> Result<()> {
        info!("Adding input device: {} ({:?})", device.name, device.device_type);
        
        let device_id = device.id.clone();
        self.devices.insert(device_id.clone(), device.clone());
        
        // Notify listeners
        for listener in &self.listeners {
            listener.on_device_added(&device).await;
        }
        
        Ok(())
    }
    
    pub async fn remove_device(&mut self, device_id: &str) -> Result<()> {
        if let Some(device) = self.devices.remove(device_id) {
            info!("Removing input device: {} ({:?})", device.name, device.device_type);
            
            // Notify listeners
            for listener in &self.listeners {
                listener.on_device_removed(device_id).await;
            }
        }
        
        Ok(())
    }
    
    pub async fn process_event(&mut self, event: InputEvent) -> Result<()> {
        // Apply accessibility features
        let processed_event = self.accessibility_manager.process_event(&event).await?;
        
        // Apply keymap transformations
        let final_event = self.keymap_manager.process_event(&processed_event).await?;
        
        // Notify listeners based on event type
        match final_event.event_type.as_str() {
            "key" => {
                for listener in &self.listeners {
                    listener.on_key_event(&final_event).await;
                }
            }
            "mouse" => {
                for listener in &self.listeners {
                    listener.on_mouse_event(&final_event).await;
                }
            }
            "touch" => {
                for listener in &self.listeners {
                    listener.on_touch_event(&final_event).await;
                }
            }
            _ => {
                warn!("Unknown event type: {}", final_event.event_type);
            }
        }
        
        Ok(())
    }
    
    pub async fn set_keymap(&mut self, keymap: &str) -> Result<()> {
        self.keymap_manager.set_keymap(keymap).await?;
        info!("Keymap set to: {}", keymap);
        Ok(())
    }
    
    pub async fn get_available_keymaps(&self) -> Vec<KeymapInfo> {
        self.keymap_manager.get_available_keymaps().await
    }
    
    pub async fn get_current_keymap(&self) -> Option<String> {
        self.keymap_manager.get_current_keymap().await
    }
    
    pub async fn enable_accessibility_feature(&mut self, feature: &str) -> Result<()> {
        self.accessibility_manager.enable_feature(feature).await?;
        info!("Enabled accessibility feature: {}", feature);
        Ok(())
    }
    
    pub async fn disable_accessibility_feature(&mut self, feature: &str) -> Result<()> {
        self.accessibility_manager.disable_feature(feature).await?;
        info!("Disabled accessibility feature: {}", feature);
        Ok(())
    }
    
    pub async fn get_accessibility_features(&self) -> Vec<String> {
        self.accessibility_manager.get_enabled_features().await
    }
    
    pub async fn remap_key(&mut self, from: &str, to: &str) -> Result<()> {
        self.keymap_manager.remap_key(from, to).await?;
        info!("Remapped key {} to {}", from, to);
        Ok(())
    }
    
    pub fn add_listener(&mut self, listener: Box<dyn InputEventListener + Send + Sync>) {
        self.listeners.push(listener);
    }
    
    pub async fn reload_config(&mut self) -> Result<()> {
        // Reload configuration from file
        let new_config = InputConfig::load(&self.config.config_path)?;
        self.config = new_config;
        
        // Apply new settings
        self.keymap_manager.reload_config().await?;
        self.accessibility_manager.reload_config().await?;
        
        info!("Input configuration reloaded");
        Ok(())
    }
} 