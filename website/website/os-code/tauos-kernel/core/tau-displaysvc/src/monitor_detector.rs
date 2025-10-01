use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{sleep, Duration};
use anyhow::Result;
use log::{info, warn, error};
use std::collections::HashMap;
use std::process::Command;

use crate::display_manager::{DisplayManager, Monitor, Resolution, Rotation};

pub struct MonitorDetector {
    display_manager: Arc<Mutex<DisplayManager>>,
    known_monitors: HashMap<String, Monitor>,
}

impl MonitorDetector {
    pub fn new(display_manager: Arc<Mutex<DisplayManager>>) -> Self {
        Self {
            display_manager,
            known_monitors: HashMap::new(),
        }
    }
    
    pub async fn run(mut self) -> Result<()> {
        info!("Starting monitor detector");
        
        // Initial monitor scan
        self.scan_monitors().await?;
        
        loop {
            // Monitor for changes
            self.check_monitor_changes().await?;
            
            sleep(Duration::from_secs(10)).await;
        }
    }
    
    async fn scan_monitors(&mut self) -> Result<()> {
        info!("Scanning for monitors");
        
        // Use xrandr to get monitor information
        let output = Command::new("xrandr")
            .args(&["--listmonitors"])
            .output()?;
        
        if output.status.success() {
            let output_str = String::from_utf8_lossy(&output.stdout);
            self.parse_xrandr_output(&output_str).await?;
        } else {
            warn!("Failed to get monitor information from xrandr");
        }
        
        info!("Found {} monitors", self.known_monitors.len());
        Ok(())
    }
    
    async fn check_monitor_changes(&mut self) -> Result<()> {
        let current_monitors = self.get_current_monitors().await?;
        
        // Check for removed monitors
        let mut to_remove = Vec::new();
        for (monitor_id, _) in &self.known_monitors {
            if !current_monitors.contains_key(monitor_id) {
                to_remove.push(monitor_id.clone());
            }
        }
        
        for monitor_id in to_remove {
            if let Some(monitor) = self.known_monitors.remove(&monitor_id) {
                info!("Monitor disconnected: {} ({})", monitor.name, monitor.connector);
                
                if let Ok(mut manager) = self.display_manager.lock().await {
                    if let Err(e) = manager.remove_monitor(&monitor_id).await {
                        error!("Failed to remove monitor: {}", e);
                    }
                }
            }
        }
        
        // Check for new monitors
        for (monitor_id, monitor) in current_monitors {
            if !self.known_monitors.contains_key(&monitor_id) {
                self.known_monitors.insert(monitor_id.clone(), monitor.clone());
                info!("Monitor connected: {} ({})", monitor.name, monitor.connector);
                
                if let Ok(mut manager) = self.display_manager.lock().await {
                    if let Err(e) = manager.add_monitor(monitor).await {
                        error!("Failed to add monitor: {}", e);
                    }
                }
            }
        }
        
        Ok(())
    }
    
    async fn get_current_monitors(&self) -> Result<HashMap<String, Monitor>> {
        let mut monitors = HashMap::new();
        
        // Use xrandr to get current monitor information
        let output = Command::new("xrandr")
            .args(&["--listmonitors"])
            .output()?;
        
        if output.status.success() {
            let output_str = String::from_utf8_lossy(&output.stdout);
            self.parse_xrandr_output_to_map(&output_str, &mut monitors).await?;
        }
        
        Ok(monitors)
    }
    
    async fn parse_xrandr_output(&mut self, output: &str) -> Result<()> {
        let mut monitors = HashMap::new();
        self.parse_xrandr_output_to_map(output, &mut monitors).await?;
        
        for (monitor_id, monitor) in monitors {
            self.known_monitors.insert(monitor_id.clone(), monitor.clone());
            
            if let Ok(mut manager) = self.display_manager.lock().await {
                if let Err(e) = manager.add_monitor(monitor).await {
                    error!("Failed to add monitor: {}", e);
                }
            }
        }
        
        Ok(())
    }
    
    async fn parse_xrandr_output_to_map(&self, output: &str, monitors: &mut HashMap<String, Monitor>) -> Result<()> {
        let lines: Vec<&str> = output.lines().collect();
        
        for line in lines {
            if line.contains(" connected ") {
                // Parse connected monitor line
                if let Some(monitor) = self.parse_monitor_line(line).await? {
                    monitors.insert(monitor.id.clone(), monitor);
                }
            }
        }
        
        Ok(())
    }
    
    async fn parse_monitor_line(&self, line: &str) -> Result<Option<Monitor>> {
        // Example line: "HDMI-1 connected 1920x1080+0+0 (normal left inverted right x axis y axis) 509mm x 286mm"
        let parts: Vec<&str> = line.split_whitespace().collect();
        
        if parts.len() < 3 {
            return Ok(None);
        }
        
        let connector = parts[0].to_string();
        let connected = parts[1] == "connected";
        
        if !connected {
            return Ok(None);
        }
        
        // Parse resolution
        let resolution_str = parts[2];
        let resolution = self.parse_resolution(resolution_str)?;
        
        // Parse refresh rate if available
        let refresh_rate = if parts.len() > 3 && parts[3].contains('*') {
            // Extract refresh rate from something like "60.00*"
            parts[3].trim_end_matches('*').parse().unwrap_or(60.0)
        } else {
            60.0
        };
        
        // Generate monitor ID
        let monitor_id = connector.clone();
        
        // Create monitor name from connector
        let name = match connector.as_str() {
            "eDP-1" | "LVDS-1" => "Built-in Display".to_string(),
            "HDMI-1" => "HDMI Display".to_string(),
            "DP-1" => "DisplayPort Display".to_string(),
            _ => format!("Display {}", connector),
        };
        
        let monitor = Monitor {
            id: monitor_id,
            name,
            connector,
            manufacturer: None,
            model: None,
            serial: None,
            connected: true,
            primary: false, // Will be set by display manager
            resolution,
            refresh_rate,
            brightness: 1.0,
            gamma: 1.0,
            rotation: Rotation::Normal,
            scale: 1.0,
        };
        
        Ok(Some(monitor))
    }
    
    fn parse_resolution(&self, resolution_str: &str) -> Result<Resolution> {
        // Parse resolution like "1920x1080"
        let parts: Vec<&str> = resolution_str.split('x').collect();
        
        if parts.len() != 2 {
            return Err(anyhow::anyhow!("Invalid resolution format: {}", resolution_str));
        }
        
        let width = parts[0].parse()?;
        let height = parts[1].parse()?;
        
        Ok(Resolution { width, height })
    }
} 