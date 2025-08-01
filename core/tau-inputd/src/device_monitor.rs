use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{sleep, Duration};
use anyhow::Result;
use log::{info, warn, error};
use std::collections::HashMap;
use std::fs;

use crate::input_manager::{InputManager, InputDevice, InputDeviceType, InputEvent};

pub struct DeviceMonitor {
    input_manager: Arc<Mutex<InputManager>>,
    known_devices: HashMap<String, InputDevice>,
}

impl DeviceMonitor {
    pub fn new(input_manager: Arc<Mutex<InputManager>>) -> Self {
        Self {
            input_manager,
            known_devices: HashMap::new(),
        }
    }
    
    pub async fn run(mut self) -> Result<()> {
        info!("Starting input device monitor");
        
        // Initial device scan
        self.scan_devices().await?;
        
        loop {
            // Monitor for device changes
            self.check_device_changes().await?;
            
            sleep(Duration::from_secs(5)).await;
        }
    }
    
    async fn scan_devices(&mut self) -> Result<()> {
        info!("Scanning for input devices");
        
        // Scan /dev/input directory
        if let Ok(entries) = fs::read_dir("/dev/input") {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if let Some(file_name) = path.file_name() {
                        if let Some(name) = file_name.to_str() {
                            if name.starts_with("event") {
                                if let Ok(device) = self.get_device_info(&path).await {
                                    self.known_devices.insert(device.id.clone(), device.clone());
                                    
                                    if let Ok(mut manager) = self.input_manager.lock().await {
                                        if let Err(e) = manager.add_device(device).await {
                                            error!("Failed to add device: {}", e);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Scan /sys/class/input for additional device information
        if let Ok(entries) = fs::read_dir("/sys/class/input") {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if let Some(device_name) = path.file_name() {
                        if let Some(name) = device_name.to_str() {
                            if name.starts_with("input") {
                                if let Ok(device) = self.get_sys_device_info(&path).await {
                                    self.known_devices.insert(device.id.clone(), device.clone());
                                    
                                    if let Ok(mut manager) = self.input_manager.lock().await {
                                        if let Err(e) = manager.add_device(device).await {
                                            error!("Failed to add device: {}", e);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        info!("Found {} input devices", self.known_devices.len());
        Ok(())
    }
    
    async fn check_device_changes(&mut self) -> Result<()> {
        let current_devices = self.get_current_devices().await?;
        
        // Check for removed devices
        let mut to_remove = Vec::new();
        for (device_id, _) in &self.known_devices {
            if !current_devices.contains_key(device_id) {
                to_remove.push(device_id.clone());
            }
        }
        
        for device_id in to_remove {
            if let Some(device) = self.known_devices.remove(&device_id) {
                info!("Device removed: {} ({:?})", device.name, device.device_type);
                
                if let Ok(mut manager) = self.input_manager.lock().await {
                    if let Err(e) = manager.remove_device(&device_id).await {
                        error!("Failed to remove device: {}", e);
                    }
                }
            }
        }
        
        // Check for new devices
        for (device_id, device) in current_devices {
            if !self.known_devices.contains_key(&device_id) {
                self.known_devices.insert(device_id.clone(), device.clone());
                info!("New device detected: {} ({:?})", device.name, device.device_type);
                
                if let Ok(mut manager) = self.input_manager.lock().await {
                    if let Err(e) = manager.add_device(device).await {
                        error!("Failed to add device: {}", e);
                    }
                }
            }
        }
        
        Ok(())
    }
    
    async fn get_current_devices(&self) -> Result<HashMap<String, InputDevice>> {
        let mut devices = HashMap::new();
        
        // Scan /dev/input
        if let Ok(entries) = fs::read_dir("/dev/input") {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if let Some(file_name) = path.file_name() {
                        if let Some(name) = file_name.to_str() {
                            if name.starts_with("event") {
                                if let Ok(device) = self.get_device_info(&path).await {
                                    devices.insert(device.id.clone(), device);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        Ok(devices)
    }
    
    async fn get_device_info(&self, path: &std::path::Path) -> Result<InputDevice> {
        let device_id = path.file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("unknown")
            .to_string();
        
        let mut device = InputDevice {
            id: device_id.clone(),
            name: "Unknown Device".to_string(),
            device_type: InputDeviceType::Unknown,
            path: path.to_string_lossy().to_string(),
            vendor_id: None,
            product_id: None,
            capabilities: Vec::new(),
            enabled: true,
        };
        
        // Try to get device name from /proc/bus/input/devices
        if let Ok(devices_content) = fs::read_to_string("/proc/bus/input/devices") {
            for line in devices_content.lines() {
                if line.contains(&format!("event{}", device_id.trim_start_matches("event"))) {
                    if line.contains("Name=") {
                        if let Some(name) = line.split("Name=").nth(1) {
                            device.name = name.trim_matches('"').to_string();
                        }
                    }
                    
                    if line.contains("Handlers=") {
                        if let Some(handlers) = line.split("Handlers=").nth(1) {
                            device.capabilities = handlers.split_whitespace()
                                .map(|s| s.to_string())
                                .collect();
                            
                            // Determine device type from capabilities
                            device.device_type = if handlers.contains("kbd") {
                                InputDeviceType::Keyboard
                            } else if handlers.contains("mouse") {
                                InputDeviceType::Mouse
                            } else if handlers.contains("touchpad") {
                                InputDeviceType::Touchpad
                            } else if handlers.contains("touchscreen") {
                                InputDeviceType::Touchscreen
                            } else if handlers.contains("js") {
                                InputDeviceType::Gamepad
                            } else {
                                InputDeviceType::Unknown
                            };
                        }
                    }
                }
            }
        }
        
        Ok(device)
    }
    
    async fn get_sys_device_info(&self, path: &std::path::Path) -> Result<InputDevice> {
        let device_id = path.file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("unknown")
            .to_string();
        
        let mut device = InputDevice {
            id: device_id.clone(),
            name: "Unknown Device".to_string(),
            device_type: InputDeviceType::Unknown,
            path: format!("/dev/input/event{}", device_id.trim_start_matches("input")),
            vendor_id: None,
            product_id: None,
            capabilities: Vec::new(),
            enabled: true,
        };
        
        // Read device name
        if let Ok(name) = fs::read_to_string(path.join("name")) {
            device.name = name.trim().to_string();
        }
        
        // Read device capabilities
        if let Ok(capabilities) = fs::read_to_string(path.join("capabilities")) {
            device.capabilities = capabilities.split_whitespace()
                .map(|s| s.to_string())
                .collect();
        }
        
        // Determine device type
        if let Ok(uevent) = fs::read_to_string(path.join("uevent")) {
            if uevent.contains("EV=120013") {
                device.device_type = InputDeviceType::Keyboard;
            } else if uevent.contains("EV=17") {
                device.device_type = InputDeviceType::Mouse;
            } else if uevent.contains("EV=3") {
                device.device_type = InputDeviceType::Touchpad;
            } else if uevent.contains("EV=1b") {
                device.device_type = InputDeviceType::Touchscreen;
            }
        }
        
        Ok(device)
    }
} 