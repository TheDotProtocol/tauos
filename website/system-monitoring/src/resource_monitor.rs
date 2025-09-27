use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{Duration, interval};
use log::{info, warn, error, debug};
use anyhow::Result;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use sysinfo::{System, SystemExt, CpuExt, DiskExt, NetworkExt};
use dashmap::DashMap;

use crate::config::{MonitorConfig, ResourceMonitoringConfig};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceUsage {
    pub timestamp: DateTime<Utc>,
    pub cpu_usage_percent: f64,
    pub memory_usage_mb: u64,
    pub memory_total_mb: u64,
    pub memory_usage_percent: f64,
    pub disk_usage_percent: f64,
    pub network_rx_mb: u64,
    pub network_tx_mb: u64,
    pub temperature_celsius: Option<f64>,
    pub load_average: f64,
    pub process_count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceAlert {
    pub timestamp: DateTime<Utc>,
    pub alert_type: AlertType,
    pub message: String,
    pub severity: AlertSeverity,
    pub resource_usage: ResourceUsage,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AlertType {
    CpuHigh,
    MemoryHigh,
    DiskFull,
    NetworkIssue,
    TemperatureHigh,
    ProcessLimit,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AlertSeverity {
    Low,
    Medium,
    High,
    Critical,
}

pub struct ResourceMonitor {
    config: MonitorConfig,
    system: System,
    resource_history: DashMap<String, Vec<ResourceUsage>>,
    alerts: DashMap<String, Vec<ResourceAlert>>,
    is_running: bool,
}

impl ResourceMonitor {
    pub fn new(config: MonitorConfig) -> Result<Self> {
        let mut system = System::new_all();
        system.refresh_all();
        
        Ok(Self {
            config,
            system,
            resource_history: DashMap::new(),
            alerts: DashMap::new(),
            is_running: false,
        })
    }
    
    pub async fn run(&mut self) -> Result<()> {
        if !self.config.resource_monitoring.enabled {
            info!("Resource monitoring disabled");
            return Ok(());
        }
        
        self.is_running = true;
        let mut interval_timer = interval(Duration::from_secs(
            self.config.resource_monitoring.interval_seconds
        ));
        
        info!("Starting resource monitoring");
        
        while self.is_running {
            interval_timer.tick().await;
            
            match self.collect_resource_usage().await {
                Ok(usage) => {
                    self.process_resource_usage(usage).await?;
                }
                Err(e) => {
                    error!("Failed to collect resource usage: {}", e);
                }
            }
        }
        
        Ok(())
    }
    
    async fn collect_resource_usage(&mut self) -> Result<ResourceUsage> {
        self.system.refresh_all();
        
        let cpu_usage = self.system.global_cpu_info().cpu_usage();
        let memory = self.system.memory();
        let disk = self.system.disks();
        let network = self.system.networks();
        
        // Calculate memory usage
        let memory_usage_mb = memory.used() / 1024 / 1024;
        let memory_total_mb = memory.total() / 1024 / 1024;
        let memory_usage_percent = (memory.used() as f64 / memory.total() as f64) * 100.0;
        
        // Calculate disk usage
        let total_disk_usage = disk.iter()
            .map(|disk| {
                let used = disk.total_space() - disk.available_space();
                let total = disk.total_space();
                (used, total)
            })
            .fold((0u64, 0u64), |(acc_used, acc_total), (used, total)| {
                (acc_used + used, acc_total + total)
            });
        
        let disk_usage_percent = if total_disk_usage.1 > 0 {
            (total_disk_usage.0 as f64 / total_disk_usage.1 as f64) * 100.0
        } else {
            0.0
        };
        
        // Calculate network usage
        let network_rx: u64 = network.values()
            .map(|interface| interface.received())
            .sum();
        let network_tx: u64 = network.values()
            .map(|interface| interface.transmitted())
            .sum();
        
        let network_rx_mb = network_rx / 1024 / 1024;
        let network_tx_mb = network_tx / 1024 / 1024;
        
        // Get temperature (if available)
        let temperature = self.get_temperature();
        
        // Get load average
        let load_average = self.system.load_average().one;
        
        // Get process count
        let process_count = self.system.processes().len() as u32;
        
        Ok(ResourceUsage {
            timestamp: Utc::now(),
            cpu_usage_percent: cpu_usage,
            memory_usage_mb,
            memory_total_mb,
            memory_usage_percent,
            disk_usage_percent,
            network_rx_mb,
            network_tx_mb,
            temperature_celsius: temperature,
            load_average,
            process_count,
        })
    }
    
    fn get_temperature(&self) -> Option<f64> {
        // Try to read temperature from various sources
        if let Ok(temp) = std::fs::read_to_string("/sys/class/thermal/thermal_zone0/temp") {
            if let Ok(temp_value) = temp.trim().parse::<f64>() {
                return Some(temp_value / 1000.0); // Convert from millidegrees
            }
        }
        
        // Try alternative temperature sources
        if let Ok(temp) = std::fs::read_to_string("/proc/acpi/thermal_zone/THM0/temperature") {
            if let Ok(temp_value) = temp.trim().trim_end_matches(" C").parse::<f64>() {
                return Some(temp_value);
            }
        }
        
        None
    }
    
    async fn process_resource_usage(&mut self, usage: ResourceUsage) -> Result<()> {
        // Store in history
        let key = "current".to_string();
        let mut history = self.resource_history.entry(key.clone()).or_insert_with(Vec::new);
        history.push(usage.clone());
        
        // Keep only last 100 entries
        if history.len() > 100 {
            history.remove(0);
        }
        
        // Check for alerts
        self.check_alerts(&usage).await?;
        
        // Log if configured
        if self.config.resource_monitoring.log_resource_usage {
            debug!("Resource usage: CPU: {:.1}%, Memory: {:.1}%, Disk: {:.1}%", 
                usage.cpu_usage_percent, usage.memory_usage_percent, usage.disk_usage_percent);
        }
        
        Ok(())
    }
    
    async fn check_alerts(&mut self, usage: &ResourceUsage) -> Result<()> {
        let config = &self.config.resource_monitoring;
        
        // Check CPU usage
        if usage.cpu_usage_percent > config.cpu_threshold_percent {
            self.create_alert(
                AlertType::CpuHigh,
                format!("CPU usage is {:.1}% (threshold: {:.1}%)", 
                    usage.cpu_usage_percent, config.cpu_threshold_percent),
                self.get_severity(usage.cpu_usage_percent, config.cpu_threshold_percent),
                usage.clone(),
            ).await;
        }
        
        // Check memory usage
        if usage.memory_usage_percent > config.memory_threshold_percent {
            self.create_alert(
                AlertType::MemoryHigh,
                format!("Memory usage is {:.1}% (threshold: {:.1}%)", 
                    usage.memory_usage_percent, config.memory_threshold_percent),
                self.get_severity(usage.memory_usage_percent, config.memory_threshold_percent),
                usage.clone(),
            ).await;
        }
        
        // Check disk usage
        if usage.disk_usage_percent > config.disk_threshold_percent {
            self.create_alert(
                AlertType::DiskFull,
                format!("Disk usage is {:.1}% (threshold: {:.1}%)", 
                    usage.disk_usage_percent, config.disk_threshold_percent),
                self.get_severity(usage.disk_usage_percent, config.disk_threshold_percent),
                usage.clone(),
            ).await;
        }
        
        // Check temperature
        if let Some(temp) = usage.temperature_celsius {
            if temp > 80.0 {
                self.create_alert(
                    AlertType::TemperatureHigh,
                    format!("Temperature is {:.1}°C (threshold: 80.0°C)", temp),
                    AlertSeverity::High,
                    usage.clone(),
                ).await;
            }
        }
        
        // Check process count
        if usage.process_count > self.config.process_management.max_concurrent_processes {
            self.create_alert(
                AlertType::ProcessLimit,
                format!("Process count is {} (limit: {})", 
                    usage.process_count, self.config.process_management.max_concurrent_processes),
                AlertSeverity::Medium,
                usage.clone(),
            ).await;
        }
        
        Ok(())
    }
    
    fn get_severity(&self, current: f64, threshold: f64) -> AlertSeverity {
        let ratio = current / threshold;
        match ratio {
            r if r >= 1.5 => AlertSeverity::Critical,
            r if r >= 1.2 => AlertSeverity::High,
            r if r >= 1.1 => AlertSeverity::Medium,
            _ => AlertSeverity::Low,
        }
    }
    
    async fn create_alert(&mut self, alert_type: AlertType, message: String, severity: AlertSeverity, usage: ResourceUsage) {
        let alert = ResourceAlert {
            timestamp: Utc::now(),
            alert_type,
            message,
            severity,
            resource_usage: usage,
        };
        
        let key = format!("{:?}", alert_type);
        let mut alerts = self.alerts.entry(key).or_insert_with(Vec::new);
        alerts.push(alert.clone());
        
        // Keep only last 50 alerts
        if alerts.len() > 50 {
            alerts.remove(0);
        }
        
        if self.config.resource_monitoring.alert_on_threshold {
            match severity {
                AlertSeverity::Critical => error!("CRITICAL: {}", alert.message),
                AlertSeverity::High => warn!("HIGH: {}", alert.message),
                AlertSeverity::Medium => warn!("MEDIUM: {}", alert.message),
                AlertSeverity::Low => info!("LOW: {}", alert.message),
            }
        }
    }
    
    pub fn get_current_usage(&self) -> Option<ResourceUsage> {
        self.resource_history.get("current")
            .and_then(|history| history.last().cloned())
    }
    
    pub fn get_resource_history(&self, key: &str) -> Vec<ResourceUsage> {
        self.resource_history.get(key)
            .map(|history| history.clone())
            .unwrap_or_default()
    }
    
    pub fn get_alerts(&self, alert_type: Option<AlertType>) -> Vec<ResourceAlert> {
        if let Some(alert_type) = alert_type {
            self.alerts.get(&format!("{:?}", alert_type))
                .map(|alerts| alerts.clone())
                .unwrap_or_default()
        } else {
            self.alerts.iter()
                .flat_map(|entry| entry.value().clone())
                .collect()
        }
    }
    
    pub fn stop(&mut self) {
        self.is_running = false;
    }
} 