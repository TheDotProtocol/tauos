use gtk4 as gtk;
use gtk::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Clone, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os_version: String,
    pub kernel_version: String,
    pub architecture: String,
    pub memory_total: String,
    pub memory_used: String,
    pub storage_total: String,
    pub storage_used: String,
    pub cpu_model: String,
    pub cpu_cores: u32,
    pub uptime: String,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct SystemConfig {
    pub language: String,
    pub timezone: String,
    pub auto_time: bool,
    pub theme: String,
    pub animations_enabled: bool,
    pub transparency_enabled: bool,
    pub firewall_enabled: bool,
    pub auto_updates: bool,
    pub telemetry_enabled: bool,
    pub location_enabled: bool,
    pub camera_enabled: bool,
    pub microphone_enabled: bool,
    pub notifications_enabled: bool,
    pub do_not_disturb: bool,
    pub wifi_enabled: bool,
    pub bluetooth_enabled: bool,
    pub vpn_enabled: bool,
    pub volume_level: f32,
    pub sound_effects_enabled: bool,
    pub screen_reader_enabled: bool,
    pub high_contrast_enabled: bool,
    pub large_text_enabled: bool,
    pub developer_mode: bool,
    pub debug_mode: bool,
}

pub struct SystemConfigManager {
    system_info: Arc<Mutex<SystemInfo>>,
    config: Arc<Mutex<SystemConfig>>,
}

impl SystemConfigManager {
    pub fn new() -> Self {
        let system_info = SystemInfo {
            os_version: "TauOS 1.0.0".to_string(),
            kernel_version: "Linux 6.6.30".to_string(),
            architecture: "x86_64".to_string(),
            memory_total: "16 GB".to_string(),
            memory_used: "8.2 GB".to_string(),
            storage_total: "512 GB".to_string(),
            storage_used: "128 GB".to_string(),
            cpu_model: "Intel Core i7".to_string(),
            cpu_cores: 8,
            uptime: "2 days, 14 hours".to_string(),
        };
        
        let config = SystemConfig {
            language: "English (US)".to_string(),
            timezone: "UTC".to_string(),
            auto_time: true,
            theme: "Dark".to_string(),
            animations_enabled: true,
            transparency_enabled: true,
            firewall_enabled: true,
            auto_updates: true,
            telemetry_enabled: false,
            location_enabled: false,
            camera_enabled: false,
            microphone_enabled: false,
            notifications_enabled: true,
            do_not_disturb: false,
            wifi_enabled: true,
            bluetooth_enabled: false,
            vpn_enabled: false,
            volume_level: 75.0,
            sound_effects_enabled: true,
            screen_reader_enabled: false,
            high_contrast_enabled: false,
            large_text_enabled: false,
            developer_mode: false,
            debug_mode: false,
        };
        
        Self {
            system_info: Arc::new(Mutex::new(system_info)),
            config: Arc::new(Mutex::new(config)),
        }
    }
    
    pub fn get_system_info(&self) -> SystemInfo {
        if let Ok(info) = self.system_info.lock() {
            info.clone()
        } else {
            SystemInfo {
                os_version: "Unknown".to_string(),
                kernel_version: "Unknown".to_string(),
                architecture: "Unknown".to_string(),
                memory_total: "Unknown".to_string(),
                memory_used: "Unknown".to_string(),
                storage_total: "Unknown".to_string(),
                storage_used: "Unknown".to_string(),
                cpu_model: "Unknown".to_string(),
                cpu_cores: 0,
                uptime: "Unknown".to_string(),
            }
        }
    }
    
    pub fn get_config(&self) -> SystemConfig {
        if let Ok(config) = self.config.lock() {
            config.clone()
        } else {
            SystemConfig {
                language: "English (US)".to_string(),
                timezone: "UTC".to_string(),
                auto_time: true,
                theme: "Dark".to_string(),
                animations_enabled: true,
                transparency_enabled: true,
                firewall_enabled: true,
                auto_updates: true,
                telemetry_enabled: false,
                location_enabled: false,
                camera_enabled: false,
                microphone_enabled: false,
                notifications_enabled: true,
                do_not_disturb: false,
                wifi_enabled: true,
                bluetooth_enabled: false,
                vpn_enabled: false,
                volume_level: 75.0,
                sound_effects_enabled: true,
                screen_reader_enabled: false,
                high_contrast_enabled: false,
                large_text_enabled: false,
                developer_mode: false,
                debug_mode: false,
            }
        }
    }
    
    pub fn update_config(&self, new_config: SystemConfig) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            *config = new_config;
            println!("✅ System configuration updated");
            Ok(())
        } else {
            Err("Failed to update system configuration".to_string())
        }
    }
    
    pub fn update_language(&self, language: &str) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.language = language.to_string();
            println!("🌐 Language updated to: {}", language);
            Ok(())
        } else {
            Err("Failed to update language".to_string())
        }
    }
    
    pub fn update_theme(&self, theme: &str) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.theme = theme.to_string();
            println!("🎨 Theme updated to: {}", theme);
            Ok(())
        } else {
            Err("Failed to update theme".to_string())
        }
    }
    
    pub fn update_timezone(&self, timezone: &str) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.timezone = timezone.to_string();
            println!("🕐 Timezone updated to: {}", timezone);
            Ok(())
        } else {
            Err("Failed to update timezone".to_string())
        }
    }
    
    pub fn toggle_animations(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.animations_enabled = enabled;
            println!("🎬 Animations {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle animations".to_string())
        }
    }
    
    pub fn toggle_transparency(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.transparency_enabled = enabled;
            println!("🔍 Transparency {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle transparency".to_string())
        }
    }
    
    pub fn toggle_firewall(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.firewall_enabled = enabled;
            println!("🛡️ Firewall {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle firewall".to_string())
        }
    }
    
    pub fn toggle_auto_updates(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.auto_updates = enabled;
            println!("🔄 Auto updates {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle auto updates".to_string())
        }
    }
    
    pub fn toggle_telemetry(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.telemetry_enabled = enabled;
            println!("📊 Telemetry {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle telemetry".to_string())
        }
    }
    
    pub fn update_volume(&self, volume: f32) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.volume_level = volume;
            println!("🔊 Volume set to: {:.1}%", volume);
            Ok(())
        } else {
            Err("Failed to update volume".to_string())
        }
    }
    
    pub fn toggle_wifi(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.wifi_enabled = enabled;
            println!("📶 Wi-Fi {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle Wi-Fi".to_string())
        }
    }
    
    pub fn toggle_bluetooth(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.bluetooth_enabled = enabled;
            println!("📱 Bluetooth {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle Bluetooth".to_string())
        }
    }
    
    pub fn toggle_vpn(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.vpn_enabled = enabled;
            println!("🔒 VPN {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle VPN".to_string())
        }
    }
    
    pub fn toggle_notifications(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.notifications_enabled = enabled;
            println!("📱 Notifications {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle notifications".to_string())
        }
    }
    
    pub fn toggle_do_not_disturb(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.do_not_disturb = enabled;
            println!("🔕 Do not disturb {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle do not disturb".to_string())
        }
    }
    
    pub fn toggle_accessibility_feature(&self, feature: &str, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            match feature {
                "screen_reader" => config.screen_reader_enabled = enabled,
                "high_contrast" => config.high_contrast_enabled = enabled,
                "large_text" => config.large_text_enabled = enabled,
                _ => return Err("Unknown accessibility feature".to_string()),
            }
            println!("♿ {} {}", feature.replace("_", " "), if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle accessibility feature".to_string())
        }
    }
    
    pub fn toggle_developer_mode(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.developer_mode = enabled;
            println!("🔧 Developer mode {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle developer mode".to_string())
        }
    }
    
    pub fn toggle_debug_mode(&self, enabled: bool) -> Result<(), String> {
        if let Ok(mut config) = self.config.lock() {
            config.debug_mode = enabled;
            println!("🐛 Debug mode {}", if enabled { "enabled" } else { "disabled" });
            Ok(())
        } else {
            Err("Failed to toggle debug mode".to_string())
        }
    }
    
    pub fn save_config(&self) -> Result<(), String> {
        // Simulate saving configuration to disk
        println!("💾 Saving system configuration...");
        std::thread::sleep(std::time::Duration::from_millis(500));
        println!("✅ System configuration saved successfully");
        Ok(())
    }
    
    pub fn reset_to_defaults(&self) -> Result<(), String> {
        // Simulate resetting to default configuration
        println!("🔄 Resetting to default configuration...");
        std::thread::sleep(std::time::Duration::from_millis(1000));
        println!("✅ Configuration reset to defaults");
        Ok(())
    }
} 