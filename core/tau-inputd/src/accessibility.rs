use std::collections::HashMap;
use anyhow::Result;
use log::{info, warn, error};

use crate::input_manager::InputEvent;

pub struct AccessibilityManager {
    enabled_features: HashMap<String, bool>,
    sticky_keys: StickyKeysState,
    slow_keys: SlowKeysState,
    repeat_delay: u64,
    repeat_rate: u64,
}

#[derive(Debug, Clone)]
struct StickyKeysState {
    enabled: bool,
    modifier_keys: HashMap<String, bool>,
    latch_timeout: u64,
}

#[derive(Debug, Clone)]
struct SlowKeysState {
    enabled: bool,
    delay: u64,
    pressed_keys: HashMap<String, u64>,
}

impl AccessibilityManager {
    pub fn new() -> Result<Self> {
        Ok(Self {
            enabled_features: HashMap::new(),
            sticky_keys: StickyKeysState {
                enabled: false,
                modifier_keys: HashMap::new(),
                latch_timeout: 500, // milliseconds
            },
            slow_keys: SlowKeysState {
                enabled: false,
                delay: 300, // milliseconds
                pressed_keys: HashMap::new(),
            },
            repeat_delay: 600, // milliseconds
            repeat_rate: 25,   // milliseconds
        })
    }
    
    pub async fn enable_feature(&mut self, feature: &str) -> Result<()> {
        info!("Enabling accessibility feature: {}", feature);
        self.enabled_features.insert(feature.to_string(), true);
        
        match feature {
            "sticky-keys" => {
                self.sticky_keys.enabled = true;
            }
            "slow-keys" => {
                self.slow_keys.enabled = true;
            }
            "bounce-keys" => {
                // Implement bounce keys
            }
            "mouse-keys" => {
                // Implement mouse keys
            }
            _ => {
                warn!("Unknown accessibility feature: {}", feature);
            }
        }
        
        Ok(())
    }
    
    pub async fn disable_feature(&mut self, feature: &str) -> Result<()> {
        info!("Disabling accessibility feature: {}", feature);
        self.enabled_features.insert(feature.to_string(), false);
        
        match feature {
            "sticky-keys" => {
                self.sticky_keys.enabled = false;
                self.sticky_keys.modifier_keys.clear();
            }
            "slow-keys" => {
                self.slow_keys.enabled = false;
                self.slow_keys.pressed_keys.clear();
            }
            _ => {
                warn!("Unknown accessibility feature: {}", feature);
            }
        }
        
        Ok(())
    }
    
    pub async fn get_enabled_features(&self) -> Vec<String> {
        self.enabled_features
            .iter()
            .filter(|(_, &enabled)| enabled)
            .map(|(feature, _)| feature.clone())
            .collect()
    }
    
    pub async fn process_event(&self, event: &InputEvent) -> Result<InputEvent> {
        let mut processed_event = event.clone();
        
        // Apply accessibility features
        if event.event_type == "key" {
            processed_event = self.process_sticky_keys(&processed_event).await?;
            processed_event = self.process_slow_keys(&processed_event).await?;
        }
        
        Ok(processed_event)
    }
    
    async fn process_sticky_keys(&self, event: &InputEvent) -> Result<InputEvent> {
        if !self.sticky_keys.enabled {
            return Ok(event.clone());
        }
        
        let mut processed_event = event.clone();
        
        // Check if this is a modifier key
        if let Some(key_data) = event.data.get("key") {
            if let Some(key_str) = key_data.as_str() {
                let is_modifier = matches!(
                    key_str,
                    "Shift_L" | "Shift_R" | "Control_L" | "Control_R" | 
                    "Alt_L" | "Alt_R" | "Meta_L" | "Meta_R"
                );
                
                if is_modifier {
                    // Handle sticky keys logic
                    if let Some(pressed) = event.data.get("pressed") {
                        if let Some(&pressed_bool) = pressed.as_bool() {
                            if pressed_bool {
                                // Key pressed - toggle sticky state
                                let current_state = self.sticky_keys.modifier_keys.get(key_str).unwrap_or(&false);
                                let new_state = !current_state;
                                
                                // Update the event data
                                let mut new_data = event.data.clone();
                                new_data["sticky_active"] = serde_json::Value::Bool(new_state);
                                processed_event.data = new_data;
                            }
                        }
                    }
                }
            }
        }
        
        Ok(processed_event)
    }
    
    async fn process_slow_keys(&self, event: &InputEvent) -> Result<InputEvent> {
        if !self.slow_keys.enabled {
            return Ok(event.clone());
        }
        
        let mut processed_event = event.clone();
        
        // Check if key is pressed
        if let Some(pressed) = event.data.get("pressed") {
            if let Some(&pressed_bool) = pressed.as_bool() {
                if let Some(key_data) = event.data.get("key") {
                    if let Some(key_str) = key_data.as_str() {
                        if pressed_bool {
                            // Key pressed - check if it's been held long enough
                            let current_time = std::time::SystemTime::now()
                                .duration_since(std::time::UNIX_EPOCH)
                                .unwrap()
                                .as_millis() as u64;
                            
                            let press_time = self.slow_keys.pressed_keys.get(key_str).unwrap_or(&0);
                            let time_held = current_time - press_time;
                            
                            if time_held < self.slow_keys.delay {
                                // Key hasn't been held long enough - suppress the event
                                let mut new_data = event.data.clone();
                                new_data["suppressed"] = serde_json::Value::Bool(true);
                                processed_event.data = new_data;
                            }
                        } else {
                            // Key released - remove from tracking
                            // In a real implementation, this would be handled by the manager
                        }
                    }
                }
            }
        }
        
        Ok(processed_event)
    }
    
    pub async fn reload_config(&mut self) -> Result<()> {
        // Reload accessibility settings from configuration file
        info!("Reloading accessibility configuration");
        Ok(())
    }
    
    pub async fn set_sticky_keys_timeout(&mut self, timeout: u64) -> Result<()> {
        self.sticky_keys.latch_timeout = timeout;
        info!("Set sticky keys timeout to {}ms", timeout);
        Ok(())
    }
    
    pub async fn set_slow_keys_delay(&mut self, delay: u64) -> Result<()> {
        self.slow_keys.delay = delay;
        info!("Set slow keys delay to {}ms", delay);
        Ok(())
    }
    
    pub async fn set_repeat_delay(&mut self, delay: u64) -> Result<()> {
        self.repeat_delay = delay;
        info!("Set key repeat delay to {}ms", delay);
        Ok(())
    }
    
    pub async fn set_repeat_rate(&mut self, rate: u64) -> Result<()> {
        self.repeat_rate = rate;
        info!("Set key repeat rate to {}ms", rate);
        Ok(())
    }
} 