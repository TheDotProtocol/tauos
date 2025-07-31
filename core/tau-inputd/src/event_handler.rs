use std::sync::Arc;
use tokio::sync::Mutex;
use anyhow::Result;
use log::{info, warn, error};

use crate::input_manager::{InputManager, InputEvent};

pub struct EventHandler {
    input_manager: Arc<Mutex<InputManager>>,
}

impl EventHandler {
    pub fn new(input_manager: Arc<Mutex<InputManager>>) -> Self {
        Self { input_manager }
    }
    
    pub async fn run(self) -> Result<()> {
        info!("Starting input event handler");
        
        // In a real implementation, this would read from /dev/input/event*
        // For now, we'll simulate event processing
        loop {
            // Simulate processing events
            tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        }
    }
    
    async fn process_keyboard_event(&self, event: InputEvent) -> Result<()> {
        if let Ok(mut manager) = self.input_manager.lock().await {
            if let Err(e) = manager.process_event(event).await {
                error!("Failed to process keyboard event: {}", e);
            }
        }
        Ok(())
    }
    
    async fn process_mouse_event(&self, event: InputEvent) -> Result<()> {
        if let Ok(mut manager) = self.input_manager.lock().await {
            if let Err(e) = manager.process_event(event).await {
                error!("Failed to process mouse event: {}", e);
            }
        }
        Ok(())
    }
    
    async fn process_touch_event(&self, event: InputEvent) -> Result<()> {
        if let Ok(mut manager) = self.input_manager.lock().await {
            if let Err(e) = manager.process_event(event).await {
                error!("Failed to process touch event: {}", e);
            }
        }
        Ok(())
    }
} 