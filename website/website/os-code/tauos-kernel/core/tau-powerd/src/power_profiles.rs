use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PowerProfile {
    Performance,
    Balanced,
    BatterySaver,
}

impl PowerProfile {
    pub fn name(&self) -> &'static str {
        match self {
            PowerProfile::Performance => "Performance",
            PowerProfile::Balanced => "Balanced",
            PowerProfile::BatterySaver => "Battery Saver",
        }
    }
    
    pub fn description(&self) -> &'static str {
        match self {
            PowerProfile::Performance => "Maximum performance, higher power consumption",
            PowerProfile::Balanced => "Balanced performance and power consumption",
            PowerProfile::BatterySaver => "Maximum battery life, reduced performance",
        }
    }
    
    pub fn cpu_governor(&self) -> &'static str {
        match self {
            PowerProfile::Performance => "performance",
            PowerProfile::Balanced => "ondemand",
            PowerProfile::BatterySaver => "powersave",
        }
    }
    
    pub fn backlight_brightness(&self) -> u32 {
        match self {
            PowerProfile::Performance => 100,
            PowerProfile::Balanced => 80,
            PowerProfile::BatterySaver => 50,
        }
    }
    
    pub fn cpu_frequency_limits(&self) -> (Option<u32>, Option<u32>) {
        match self {
            PowerProfile::Performance => (None, None), // No limits
            PowerProfile::Balanced => (None, None), // No limits
            PowerProfile::BatterySaver => (Some(1200000), None), // Max 1.2GHz
        }
    }
    
    pub fn enable_power_saving(&self) -> bool {
        matches!(self, PowerProfile::BatterySaver)
    }
    
    pub fn auto_suspend_timeout(&self) -> Option<u32> {
        match self {
            PowerProfile::Performance => None,
            PowerProfile::Balanced => Some(300), // 5 minutes
            PowerProfile::BatterySaver => Some(120), // 2 minutes
        }
    }
    
    pub fn screen_timeout(&self) -> u32 {
        match self {
            PowerProfile::Performance => 600, // 10 minutes
            PowerProfile::Balanced => 300, // 5 minutes
            PowerProfile::BatterySaver => 120, // 2 minutes
        }
    }
} 