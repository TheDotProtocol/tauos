use std::collections::HashMap;
use anyhow::Result;
use log::{info, warn, error};

use crate::input_manager::{InputEvent, KeymapInfo};

pub struct KeymapManager {
    current_keymap: String,
    key_remappings: HashMap<String, String>,
    available_keymaps: Vec<KeymapInfo>,
}

impl KeymapManager {
    pub fn new() -> Result<Self> {
        let available_keymaps = Self::load_available_keymaps()?;
        
        Ok(Self {
            current_keymap: "us".to_string(),
            key_remappings: HashMap::new(),
            available_keymaps,
        })
    }
    
    pub async fn set_keymap(&mut self, keymap: &str) -> Result<()> {
        // In a real implementation, this would use setxkbmap or similar
        info!("Setting keymap to: {}", keymap);
        
        // Validate keymap exists
        if !self.available_keymaps.iter().any(|k| k.name == keymap) {
            return Err(anyhow::anyhow!("Unknown keymap: {}", keymap));
        }
        
        self.current_keymap = keymap.to_string();
        
        // Apply keymap using system command
        let output = std::process::Command::new("setxkbmap")
            .args(&[keymap])
            .output();
        
        match output {
            Ok(_) => {
                info!("Successfully set keymap to: {}", keymap);
                Ok(())
            }
            Err(e) => {
                error!("Failed to set keymap: {}", e);
                Err(anyhow::anyhow!("Failed to set keymap: {}", e))
            }
        }
    }
    
    pub async fn get_available_keymaps(&self) -> Vec<KeymapInfo> {
        self.available_keymaps.clone()
    }
    
    pub async fn get_current_keymap(&self) -> Option<String> {
        Some(self.current_keymap.clone())
    }
    
    pub async fn remap_key(&mut self, from: &str, to: &str) -> Result<()> {
        info!("Remapping key {} to {}", from, to);
        self.key_remappings.insert(from.to_string(), to.to_string());
        Ok(())
    }
    
    pub async fn process_event(&self, event: &InputEvent) -> Result<InputEvent> {
        let mut processed_event = event.clone();
        
        // Apply key remappings if this is a keyboard event
        if event.event_type == "key" {
            if let Some(key_data) = event.data.get("key") {
                if let Some(key_str) = key_data.as_str() {
                    if let Some(remapped_key) = self.key_remappings.get(key_str) {
                        // Create new event with remapped key
                        let mut new_data = event.data.clone();
                        new_data["key"] = serde_json::Value::String(remapped_key.clone());
                        processed_event.data = new_data;
                    }
                }
            }
        }
        
        Ok(processed_event)
    }
    
    pub async fn reload_config(&mut self) -> Result<()> {
        // Reload key remappings from configuration file
        // This would read from ~/.tau/input.toml
        info!("Reloading keymap configuration");
        Ok(())
    }
    
    fn load_available_keymaps() -> Result<Vec<KeymapInfo>> {
        let mut keymaps = Vec::new();
        
        // Common keymaps
        keymaps.push(KeymapInfo {
            name: "us".to_string(),
            description: "US English".to_string(),
            layout: "us".to_string(),
            variant: None,
        });
        
        keymaps.push(KeymapInfo {
            name: "us-intl".to_string(),
            description: "US English (International)".to_string(),
            layout: "us".to_string(),
            variant: Some("intl".to_string()),
        });
        
        keymaps.push(KeymapInfo {
            name: "gb".to_string(),
            description: "British English".to_string(),
            layout: "gb".to_string(),
            variant: None,
        });
        
        keymaps.push(KeymapInfo {
            name: "de".to_string(),
            description: "German".to_string(),
            layout: "de".to_string(),
            variant: None,
        });
        
        keymaps.push(KeymapInfo {
            name: "fr".to_string(),
            description: "French".to_string(),
            layout: "fr".to_string(),
            variant: None,
        });
        
        keymaps.push(KeymapInfo {
            name: "es".to_string(),
            description: "Spanish".to_string(),
            layout: "es".to_string(),
            variant: None,
        });
        
        keymaps.push(KeymapInfo {
            name: "it".to_string(),
            description: "Italian".to_string(),
            layout: "it".to_string(),
            variant: None,
        });
        
        keymaps.push(KeymapInfo {
            name: "ru".to_string(),
            description: "Russian".to_string(),
            layout: "ru".to_string(),
            variant: None,
        });
        
        keymaps.push(KeymapInfo {
            name: "jp".to_string(),
            description: "Japanese".to_string(),
            layout: "jp".to_string(),
            variant: None,
        });
        
        keymaps.push(KeymapInfo {
            name: "cn".to_string(),
            description: "Chinese".to_string(),
            layout: "cn".to_string(),
            variant: None,
        });
        
        Ok(keymaps)
    }
} 