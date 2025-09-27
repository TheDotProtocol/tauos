use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{Duration, interval};
use log::{info, warn, error, debug};
use anyhow::Result;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use sysinfo::{System, SystemExt, ProcessExt};

use crate::config::{MonitorConfig, HealthCheckingConfig};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthCheck {
    pub name: String,
    pub status: HealthStatus,
    pub score: f64,
    pub message: String,
    pub timestamp: DateTime<Utc>,
    pub details: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum HealthStatus {
    Healthy,
    Warning,
    Critical,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemHealth {
    pub overall_score: f64,
    pub status: HealthStatus,
    pub checks: Vec<HealthCheck>,
    pub timestamp: DateTime<Utc>,
    pub recommendations: Vec<String>,
}

pub struct HealthChecker {
    config: MonitorConfig,
    system: System,
    health_history: Vec<SystemHealth>,
    is_running: bool,
}

impl HealthChecker {
    pub fn new(config: MonitorConfig) -> Self {
        let mut system = System::new_all();
        system.refresh_all();
        
        Self {
            config,
            system,
            health_history: Vec::new(),
            is_running: false,
        }
    }
    
    pub async fn run(&mut self) -> Result<()> {
        if !self.config.health_checking.enabled {
            info!("Health checking disabled");
            return Ok(());
        }
        
        self.is_running = true;
        let mut interval_timer = interval(Duration::from_secs(
            self.config.health_checking.check_interval_seconds
        ));
        
        info!("Starting health checker");
        
        while self.is_running {
            interval_timer.tick().await;
            
            match self.run_health_check().await {
                Ok(health) => {
                    self.process_health_results(health).await?;
                }
                Err(e) => {
                    error!("Failed to run health check: {}", e);
                }
            }
        }
        
        Ok(())
    }
    
    pub async fn run_health_check(&mut self) -> Result<SystemHealth> {
        self.system.refresh_all();
        
        let mut checks = Vec::new();
        
        // Run system health checks
        for check_name in &self.config.health_checking.system_health_checks {
            if let Some(check) = self.run_system_check(check_name).await? {
                checks.push(check);
            }
        }
        
        // Run service health checks
        for service_name in &self.config.health_checking.service_health_checks {
            if let Some(check) = self.run_service_check(service_name).await? {
                checks.push(check);
            }
        }
        
        // Calculate overall health score
        let overall_score = if checks.is_empty() {
            0.0
        } else {
            checks.iter().map(|check| check.score).sum::<f64>() / checks.len() as f64
        };
        
        let status = self.determine_overall_status(overall_score);
        let recommendations = self.generate_recommendations(&checks);
        
        let health = SystemHealth {
            overall_score,
            status,
            checks,
            timestamp: Utc::now(),
            recommendations,
        };
        
        Ok(health)
    }
    
    async fn run_system_check(&mut self, check_name: &str) -> Result<Option<HealthCheck>> {
        match check_name {
            "cpu_usage" => Ok(Some(self.check_cpu_usage().await)),
            "memory_usage" => Ok(Some(self.check_memory_usage().await)),
            "disk_usage" => Ok(Some(self.check_disk_usage().await)),
            "network_connectivity" => Ok(Some(self.check_network_connectivity().await)),
            "temperature" => Ok(Some(self.check_temperature().await)),
            "load_average" => Ok(Some(self.check_load_average().await)),
            _ => {
                warn!("Unknown system health check: {}", check_name);
                Ok(None)
            }
        }
    }
    
    async fn run_service_check(&mut self, service_name: &str) -> Result<Option<HealthCheck>> {
        let processes = self.system.processes();
        
        if let Some(process) = processes.values().find(|p| p.name() == service_name) {
            let pid = process.pid();
            let cpu_usage = process.cpu_usage();
            let memory_usage = process.memory() / 1024 / 1024; // Convert to MB
            
            let score = self.calculate_service_score(cpu_usage, memory_usage);
            let status = self.determine_health_status(score);
            
            let mut details = HashMap::new();
            details.insert("pid".to_string(), pid.to_string());
            details.insert("cpu_usage".to_string(), format!("{:.1}%", cpu_usage));
            details.insert("memory_usage".to_string(), format!("{} MB", memory_usage));
            
            let message = if status == HealthStatus::Healthy {
                format!("Service {} is running normally", service_name)
            } else {
                format!("Service {} may have issues", service_name)
            };
            
            Ok(Some(HealthCheck {
                name: format!("service_{}", service_name),
                status,
                score,
                message,
                timestamp: Utc::now(),
                details,
            }))
        } else {
            // Service not found
            Ok(Some(HealthCheck {
                name: format!("service_{}", service_name),
                status: HealthStatus::Critical,
                score: 0.0,
                message: format!("Service {} is not running", service_name),
                timestamp: Utc::now(),
                details: HashMap::new(),
            }))
        }
    }
    
    async fn check_cpu_usage(&mut self) -> HealthCheck {
        let cpu_usage = self.system.global_cpu_info().cpu_usage();
        let score = self.calculate_cpu_score(cpu_usage);
        let status = self.determine_health_status(score);
        
        let mut details = HashMap::new();
        details.insert("cpu_usage".to_string(), format!("{:.1}%", cpu_usage));
        
        let message = if status == HealthStatus::Healthy {
            "CPU usage is normal".to_string()
        } else {
            format!("CPU usage is high: {:.1}%", cpu_usage)
        };
        
        HealthCheck {
            name: "cpu_usage".to_string(),
            status,
            score,
            message,
            timestamp: Utc::now(),
            details,
        }
    }
    
    async fn check_memory_usage(&mut self) -> HealthCheck {
        let memory = self.system.memory();
        let memory_usage_percent = (memory.used() as f64 / memory.total() as f64) * 100.0;
        let score = self.calculate_memory_score(memory_usage_percent);
        let status = self.determine_health_status(score);
        
        let mut details = HashMap::new();
        details.insert("memory_usage_percent".to_string(), format!("{:.1}%", memory_usage_percent));
        details.insert("memory_used_mb".to_string(), format!("{} MB", memory.used() / 1024 / 1024));
        details.insert("memory_total_mb".to_string(), format!("{} MB", memory.total() / 1024 / 1024));
        
        let message = if status == HealthStatus::Healthy {
            "Memory usage is normal".to_string()
        } else {
            format!("Memory usage is high: {:.1}%", memory_usage_percent)
        };
        
        HealthCheck {
            name: "memory_usage".to_string(),
            status,
            score,
            message,
            timestamp: Utc::now(),
            details,
        }
    }
    
    async fn check_disk_usage(&mut self) -> HealthCheck {
        let disks = self.system.disks();
        let total_usage = disks.iter()
            .map(|disk| {
                let used = disk.total_space() - disk.available_space();
                let total = disk.total_space();
                (used, total)
            })
            .fold((0u64, 0u64), |(acc_used, acc_total), (used, total)| {
                (acc_used + used, acc_total + total)
            });
        
        let disk_usage_percent = if total_usage.1 > 0 {
            (total_usage.0 as f64 / total_usage.1 as f64) * 100.0
        } else {
            0.0
        };
        
        let score = self.calculate_disk_score(disk_usage_percent);
        let status = self.determine_health_status(score);
        
        let mut details = HashMap::new();
        details.insert("disk_usage_percent".to_string(), format!("{:.1}%", disk_usage_percent));
        details.insert("disk_used_gb".to_string(), format!("{:.1} GB", total_usage.0 as f64 / 1024.0 / 1024.0 / 1024.0));
        details.insert("disk_total_gb".to_string(), format!("{:.1} GB", total_usage.1 as f64 / 1024.0 / 1024.0 / 1024.0));
        
        let message = if status == HealthStatus::Healthy {
            "Disk usage is normal".to_string()
        } else {
            format!("Disk usage is high: {:.1}%", disk_usage_percent)
        };
        
        HealthCheck {
            name: "disk_usage".to_string(),
            status,
            score,
            message,
            timestamp: Utc::now(),
            details,
        }
    }
    
    async fn check_network_connectivity(&mut self) -> HealthCheck {
        // Simplified network check - in a real system you'd ping external hosts
        let networks = self.system.networks();
        let has_active_connections = networks.values().any(|interface| {
            interface.received() > 0 || interface.transmitted() > 0
        });
        
        let score = if has_active_connections { 1.0 } else { 0.0 };
        let status = self.determine_health_status(score);
        
        let mut details = HashMap::new();
        details.insert("has_active_connections".to_string(), has_active_connections.to_string());
        
        let message = if has_active_connections {
            "Network connectivity is normal".to_string()
        } else {
            "No network activity detected".to_string()
        };
        
        HealthCheck {
            name: "network_connectivity".to_string(),
            status,
            score,
            message,
            timestamp: Utc::now(),
            details,
        }
    }
    
    async fn check_temperature(&mut self) -> HealthCheck {
        // Try to read temperature from various sources
        let temperature = if let Ok(temp) = std::fs::read_to_string("/sys/class/thermal/thermal_zone0/temp") {
            if let Ok(temp_value) = temp.trim().parse::<f64>() {
                Some(temp_value / 1000.0) // Convert from millidegrees
            } else {
                None
            }
        } else {
            None
        };
        
        let score = if let Some(temp) = temperature {
            self.calculate_temperature_score(temp)
        } else {
            0.5 // Unknown temperature
        };
        
        let status = self.determine_health_status(score);
        
        let mut details = HashMap::new();
        if let Some(temp) = temperature {
            details.insert("temperature_celsius".to_string(), format!("{:.1}°C", temp));
        } else {
            details.insert("temperature_celsius".to_string(), "unknown".to_string());
        }
        
        let message = if let Some(temp) = temperature {
            if temp < 70.0 {
                "Temperature is normal".to_string()
            } else {
                format!("Temperature is high: {:.1}°C", temp)
            }
        } else {
            "Temperature monitoring not available".to_string()
        };
        
        HealthCheck {
            name: "temperature".to_string(),
            status,
            score,
            message,
            timestamp: Utc::now(),
            details,
        }
    }
    
    async fn check_load_average(&mut self) -> HealthCheck {
        let load_average = self.system.load_average().one;
        let cpu_count = num_cpus::get() as f64;
        let load_per_cpu = load_average / cpu_count;
        
        let score = self.calculate_load_score(load_per_cpu);
        let status = self.determine_health_status(score);
        
        let mut details = HashMap::new();
        details.insert("load_average".to_string(), format!("{:.2}", load_average));
        details.insert("load_per_cpu".to_string(), format!("{:.2}", load_per_cpu));
        details.insert("cpu_count".to_string(), cpu_count.to_string());
        
        let message = if status == HealthStatus::Healthy {
            "System load is normal".to_string()
        } else {
            format!("System load is high: {:.2}", load_average)
        };
        
        HealthCheck {
            name: "load_average".to_string(),
            status,
            score,
            message,
            timestamp: Utc::now(),
            details,
        }
    }
    
    fn calculate_cpu_score(&self, cpu_usage: f64) -> f64 {
        match cpu_usage {
            usage if usage < 50.0 => 1.0,
            usage if usage < 70.0 => 0.8,
            usage if usage < 85.0 => 0.5,
            usage if usage < 95.0 => 0.2,
            _ => 0.0,
        }
    }
    
    fn calculate_memory_score(&self, memory_usage: f64) -> f64 {
        match memory_usage {
            usage if usage < 60.0 => 1.0,
            usage if usage < 75.0 => 0.8,
            usage if usage < 85.0 => 0.5,
            usage if usage < 95.0 => 0.2,
            _ => 0.0,
        }
    }
    
    fn calculate_disk_score(&self, disk_usage: f64) -> f64 {
        match disk_usage {
            usage if usage < 70.0 => 1.0,
            usage if usage < 80.0 => 0.8,
            usage if usage < 90.0 => 0.5,
            usage if usage < 95.0 => 0.2,
            _ => 0.0,
        }
    }
    
    fn calculate_temperature_score(&self, temperature: f64) -> f64 {
        match temperature {
            temp if temp < 50.0 => 1.0,
            temp if temp < 60.0 => 0.8,
            temp if temp < 70.0 => 0.5,
            temp if temp < 80.0 => 0.2,
            _ => 0.0,
        }
    }
    
    fn calculate_load_score(&self, load_per_cpu: f64) -> f64 {
        match load_per_cpu {
            load if load < 0.5 => 1.0,
            load if load < 1.0 => 0.8,
            load if load < 2.0 => 0.5,
            load if load < 4.0 => 0.2,
            _ => 0.0,
        }
    }
    
    fn calculate_service_score(&self, cpu_usage: f64, memory_usage: u64) -> f64 {
        let cpu_score = self.calculate_cpu_score(cpu_usage);
        let memory_score = if memory_usage < 512 {
            1.0 // Less than 512MB is good
        } else if memory_usage < 1024 {
            0.8 // Less than 1GB is acceptable
        } else if memory_usage < 2048 {
            0.5 // Less than 2GB is concerning
        } else {
            0.2 // More than 2GB is problematic
        };
        
        (cpu_score + memory_score) / 2.0
    }
    
    fn determine_health_status(&self, score: f64) -> HealthStatus {
        match score {
            s if s >= 0.8 => HealthStatus::Healthy,
            s if s >= 0.5 => HealthStatus::Warning,
            s if s >= 0.2 => HealthStatus::Critical,
            _ => HealthStatus::Unknown,
        }
    }
    
    fn determine_overall_status(&self, score: f64) -> HealthStatus {
        if score >= self.config.health_checking.health_score_threshold {
            HealthStatus::Healthy
        } else {
            HealthStatus::Warning
        }
    }
    
    fn generate_recommendations(&self, checks: &[HealthCheck]) -> Vec<String> {
        let mut recommendations = Vec::new();
        
        for check in checks {
            match check.status {
                HealthStatus::Critical => {
                    match check.name.as_str() {
                        "cpu_usage" => recommendations.push("Consider reducing system load or upgrading CPU".to_string()),
                        "memory_usage" => recommendations.push("Consider closing applications or adding more RAM".to_string()),
                        "disk_usage" => recommendations.push("Consider cleaning up disk space or adding more storage".to_string()),
                        "temperature" => recommendations.push("Check system cooling and ventilation".to_string()),
                        _ => {
                            if check.name.starts_with("service_") {
                                recommendations.push(format!("Restart service: {}", check.name.trim_start_matches("service_")));
                            }
                        }
                    }
                }
                HealthStatus::Warning => {
                    match check.name.as_str() {
                        "cpu_usage" => recommendations.push("Monitor CPU usage and consider optimization".to_string()),
                        "memory_usage" => recommendations.push("Monitor memory usage and consider cleanup".to_string()),
                        "disk_usage" => recommendations.push("Monitor disk usage and plan for cleanup".to_string()),
                        _ => {}
                    }
                }
                _ => {}
            }
        }
        
        recommendations
    }
    
    async fn process_health_results(&mut self, health: SystemHealth) -> Result<()> {
        // Store in history
        self.health_history.push(health.clone());
        
        // Keep only last 100 health reports
        if self.health_history.len() > 100 {
            self.health_history.remove(0);
        }
        
        // Log health status
        match health.status {
            HealthStatus::Healthy => {
                info!("System health: Good (score: {:.2})", health.overall_score);
            }
            HealthStatus::Warning => {
                warn!("System health: Warning (score: {:.2})", health.overall_score);
            }
            HealthStatus::Critical => {
                error!("System health: Critical (score: {:.2})", health.overall_score);
            }
            HealthStatus::Unknown => {
                warn!("System health: Unknown (score: {:.2})", health.overall_score);
            }
        }
        
        // Handle critical health issues
        if health.status == HealthStatus::Critical && self.config.health_checking.alert_on_failure {
            self.handle_critical_health(health).await?;
        }
        
        // Auto-restart failed services
        if self.config.health_checking.auto_restart_failed_services {
            self.auto_restart_failed_services(&health.checks).await?;
        }
        
        Ok(())
    }
    
    async fn handle_critical_health(&mut self, health: SystemHealth) -> Result<()> {
        error!("CRITICAL HEALTH ALERT: System health score is {:.2}", health.overall_score);
        
        for check in &health.checks {
            if check.status == HealthStatus::Critical {
                error!("Critical check: {} - {}", check.name, check.message);
            }
        }
        
        // In a real system, you might send notifications or take automatic actions
        Ok(())
    }
    
    async fn auto_restart_failed_services(&mut self, checks: &[HealthCheck]) -> Result<()> {
        for check in checks {
            if check.name.starts_with("service_") && check.status == HealthStatus::Critical {
                let service_name = check.name.trim_start_matches("service_");
                warn!("Auto-restarting failed service: {}", service_name);
                
                // This would integrate with the process manager to restart the service
                // For now, just log the intention
                info!("Would restart service: {}", service_name);
            }
        }
        
        Ok(())
    }
    
    pub fn get_latest_health(&self) -> Option<SystemHealth> {
        self.health_history.last().cloned()
    }
    
    pub fn get_health_history(&self) -> Vec<SystemHealth> {
        self.health_history.clone()
    }
    
    pub fn stop(&mut self) {
        self.is_running = false;
    }
} 