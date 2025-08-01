use std::sync::Arc;
use tokio::sync::Mutex;
use log::{info, error, warn};
use anyhow::Result;
use clap::Parser;

mod resource_monitor;
mod crash_recovery;
mod process_manager;
mod health_checker;
mod logging_system;
mod config;
mod cli;

use resource_monitor::ResourceMonitor;
use crash_recovery::CrashRecovery;
use process_manager::ProcessManager;
use health_checker::HealthChecker;
use logging_system::LoggingSystem;
use config::MonitorConfig;

#[derive(Parser)]
#[command(name = "tau-monitor")]
#[command(about = "Tau OS System Monitoring and Crash Recovery Daemon")]
struct Args {
    #[arg(long, default_value = "/var/log/tau/monitor.log")]
    log_file: String,
    
    #[arg(long, default_value = "/etc/tau/monitor.toml")]
    config_file: String,
    
    #[arg(long)]
    foreground: bool,
    
    #[arg(long)]
    daemon: bool,
    
    #[arg(long)]
    check: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    
    // Initialize logging
    env_logger::init();
    info!("Starting tau-monitor daemon");
    
    // Load configuration
    let config = MonitorConfig::load(&args.config_file)?;
    info!("Loaded monitoring configuration from {}", args.config_file);
    
    if args.check {
        // Run health check mode
        let health_checker = HealthChecker::new(config.clone());
        health_checker.run_health_check().await?;
        return Ok(());
    }
    
    // Initialize monitoring components
    let resource_monitor = Arc::new(Mutex::new(ResourceMonitor::new(config.clone())?));
    let crash_recovery = Arc::new(Mutex::new(CrashRecovery::new(config.clone())?));
    let process_manager = Arc::new(Mutex::new(ProcessManager::new(config.clone())?));
    let health_checker = Arc::new(Mutex::new(HealthChecker::new(config.clone())));
    let logging_system = Arc::new(Mutex::new(LoggingSystem::new(config.clone())?));
    
    // Start monitoring tasks
    let resource_handle = tokio::spawn({
        let monitor = resource_monitor.clone();
        async move {
            monitor.lock().await.run().await
        }
    });
    
    let recovery_handle = tokio::spawn({
        let recovery = crash_recovery.clone();
        async move {
            recovery.lock().await.run().await
        }
    });
    
    let process_handle = tokio::spawn({
        let manager = process_manager.clone();
        async move {
            manager.lock().await.run().await
        }
    });
    
    let health_handle = tokio::spawn({
        let checker = health_checker.clone();
        async move {
            checker.lock().await.run().await
        }
    });
    
    let logging_handle = tokio::spawn({
        let logger = logging_system.clone();
        async move {
            logger.lock().await.run().await
        }
    });
    
    // Main daemon loop
    info!("tau-monitor daemon running");
    
    if args.foreground {
        // Run in foreground mode
        tokio::select! {
            _ = resource_handle => {
                error!("Resource monitor task exited");
            }
            _ = recovery_handle => {
                error!("Crash recovery task exited");
            }
            _ = process_handle => {
                error!("Process manager task exited");
            }
            _ = health_handle => {
                error!("Health checker task exited");
            }
            _ = logging_handle => {
                error!("Logging system task exited");
            }
        }
    } else {
        // Run in background mode
        tokio::signal::ctrl_c().await?;
        info!("Shutting down tau-monitor daemon");
    }
    
    Ok(())
} 