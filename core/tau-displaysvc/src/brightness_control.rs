use std::sync::Arc;
use tokio::sync::Mutex;
use anyhow::Result;
use log::{info, warn, error};

use crate::display_manager::DisplayManager;

pub struct BrightnessControl {
    display_manager: Arc<Mutex<DisplayManager>>,
}

impl BrightnessControl {
    pub fn new(display_manager: Arc<Mutex<DisplayManager>>) -> Self {
        Self { display_manager }
    }
    
    pub async fn set_brightness(&self, monitor_id: &str, brightness: f32) -> Result<()> {
        if let Ok(mut manager) = self.display_manager.lock().await {
            manager.set_brightness(monitor_id, brightness).await?;
        }
        Ok(())
    }
    
    pub async fn get_brightness(&self, monitor_id: &str) -> Result<f32> {
        if let Ok(manager) = self.display_manager.lock().await {
            if let Some(monitor) = manager.get_monitor(monitor_id).await {
                return Ok(monitor.brightness);
            }
        }
        Err(anyhow::anyhow!("Monitor not found: {}", monitor_id))
    }
    
    pub async fn adjust_brightness(&self, monitor_id: &str, delta: f32) -> Result<()> {
        let current_brightness = self.get_brightness(monitor_id).await?;
        let new_brightness = (current_brightness + delta).clamp(0.0, 1.0);
        self.set_brightness(monitor_id, new_brightness).await?;
        Ok(())
    }
} 