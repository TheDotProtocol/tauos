use serde::{Deserialize, Serialize};
use std::fs;
use anyhow::Result;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonitorConfig {
    pub resource_monitoring: ResourceMonitoringConfig,
    pub crash_recovery: CrashRecoveryConfig,
    pub process_management: ProcessManagementConfig,
    pub health_checking: HealthCheckingConfig,
    pub logging: LoggingConfig,
    pub general: GeneralConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceMonitoringConfig {
    pub enabled: bool,
    pub interval_seconds: u64,
    pub cpu_threshold_percent: f64,
    pub memory_threshold_percent: f64,
    pub disk_threshold_percent: f64,
    pub network_monitoring: bool,
    pub temperature_monitoring: bool,
    pub alert_on_threshold: bool,
    pub log_resource_usage: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrashRecoveryConfig {
    pub enabled: bool,
    pub auto_recovery: bool,
    pub max_recovery_attempts: u32,
    pub recovery_timeout_seconds: u64,
    pub save_session_state: bool,
    pub session_state_path: String,
    pub critical_processes: Vec<String>,
    pub recovery_strategies: Vec<RecoveryStrategy>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RecoveryStrategy {
    Restart,
    RestartWithDelay { delay_seconds: u64 },
    RestartWithBackoff { max_delay_seconds: u64 },
    FallbackToSafeMode,
    NotifyAdmin,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessManagementConfig {
    pub enabled: bool,
    pub max_concurrent_processes: u32,
    pub process_priority_levels: u32,
    pub memory_limit_mb: u64,
    pub cpu_limit_percent: f64,
    pub auto_cleanup_zombies: bool,
    pub process_isolation: bool,
    pub resource_pooling: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthCheckingConfig {
    pub enabled: bool,
    pub check_interval_seconds: u64,
    pub system_health_checks: Vec<String>,
    pub service_health_checks: Vec<String>,
    pub alert_on_failure: bool,
    pub auto_restart_failed_services: bool,
    pub health_score_threshold: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoggingConfig {
    pub log_level: String,
    pub log_file_path: String,
    pub max_log_size_mb: u64,
    pub log_rotation: bool,
    pub structured_logging: bool,
    pub log_compression: bool,
    pub audit_logging: bool,
    pub performance_logging: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GeneralConfig {
    pub daemon_mode: bool,
    pub foreground_mode: bool,
    pub pid_file_path: String,
    pub config_file_path: String,
    pub data_directory: String,
    pub temp_directory: String,
    pub max_log_files: u32,
    pub cleanup_interval_hours: u64,
}

impl MonitorConfig {
    pub fn load(path: &str) -> Result<Self> {
        if let Ok(contents) = fs::read_to_string(path) {
            let config: MonitorConfig = toml::from_str(&contents)?;
            Ok(config)
        } else {
            // Return default configuration
            Ok(Self::default())
        }
    }
    
    pub fn save(&self, path: &str) -> Result<()> {
        let contents = toml::to_string_pretty(self)?;
        fs::write(path, contents)?;
        Ok(())
    }
}

impl Default for MonitorConfig {
    fn default() -> Self {
        Self {
            resource_monitoring: ResourceMonitoringConfig {
                enabled: true,
                interval_seconds: 30,
                cpu_threshold_percent: 80.0,
                memory_threshold_percent: 85.0,
                disk_threshold_percent: 90.0,
                network_monitoring: true,
                temperature_monitoring: true,
                alert_on_threshold: true,
                log_resource_usage: true,
            },
            crash_recovery: CrashRecoveryConfig {
                enabled: true,
                auto_recovery: true,
                max_recovery_attempts: 3,
                recovery_timeout_seconds: 60,
                save_session_state: true,
                session_state_path: "/var/lib/tau/session_state".to_string(),
                critical_processes: vec![
                    "tau-session".to_string(),
                    "tau-powerd".to_string(),
                    "tau-inputd".to_string(),
                    "tau-displaysvc".to_string(),
                ],
                recovery_strategies: vec![
                    RecoveryStrategy::Restart,
                    RecoveryStrategy::RestartWithDelay { delay_seconds: 5 },
                    RecoveryStrategy::FallbackToSafeMode,
                ],
            },
            process_management: ProcessManagementConfig {
                enabled: true,
                max_concurrent_processes: 100,
                process_priority_levels: 5,
                memory_limit_mb: 2048,
                cpu_limit_percent: 50.0,
                auto_cleanup_zombies: true,
                process_isolation: true,
                resource_pooling: true,
            },
            health_checking: HealthCheckingConfig {
                enabled: true,
                check_interval_seconds: 60,
                system_health_checks: vec![
                    "cpu_usage".to_string(),
                    "memory_usage".to_string(),
                    "disk_usage".to_string(),
                    "network_connectivity".to_string(),
                ],
                service_health_checks: vec![
                    "tau-session".to_string(),
                    "tau-powerd".to_string(),
                    "tau-inputd".to_string(),
                    "tau-displaysvc".to_string(),
                ],
                alert_on_failure: true,
                auto_restart_failed_services: true,
                health_score_threshold: 0.7,
            },
            logging: LoggingConfig {
                log_level: "info".to_string(),
                log_file_path: "/var/log/tau/monitor.log".to_string(),
                max_log_size_mb: 100,
                log_rotation: true,
                structured_logging: true,
                log_compression: true,
                audit_logging: true,
                performance_logging: true,
            },
            general: GeneralConfig {
                daemon_mode: true,
                foreground_mode: false,
                pid_file_path: "/var/run/tau-monitor.pid".to_string(),
                config_file_path: "/etc/tau/monitor.toml".to_string(),
                data_directory: "/var/lib/tau/monitor".to_string(),
                temp_directory: "/tmp/tau-monitor".to_string(),
                max_log_files: 10,
                cleanup_interval_hours: 24,
            },
        }
    }
} 