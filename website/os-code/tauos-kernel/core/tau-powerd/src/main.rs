use std::sync::Arc;
use tokio::sync::Mutex;
use log::{info, error, warn};
use anyhow::Result;
use clap::Parser;

mod power_manager;
mod battery_monitor;
mod power_profiles;
mod dbus_api;
mod config;

use power_manager::PowerManager;
use dbus_api::PowerDbusApi;

#[derive(Parser)]
#[command(name = "tau-powerd")]
#[command(about = "Tau OS Power Management Daemon")]
struct Args {
    #[arg(long, default_value = "/var/log/tau/power.log")]
    log_file: String,
    
    #[arg(long, default_value = "/etc/tau/power.toml")]
    config_file: String,
    
    #[arg(long)]
    foreground: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    
    // Initialize logging
    env_logger::init();
    info!("Starting tau-powerd daemon");
    
    // Load configuration
    let config = config::PowerConfig::load(&args.config_file)?;
    info!("Loaded power configuration from {}", args.config_file);
    
    // Initialize power manager
    let power_manager = Arc::new(Mutex::new(PowerManager::new(config.clone())?));
    
    // Start D-Bus API
    let dbus_api = PowerDbusApi::new(power_manager.clone());
    let dbus_handle = tokio::spawn(dbus_api.run());
    
    // Start battery monitoring
    let battery_monitor = battery_monitor::BatteryMonitor::new(power_manager.clone());
    let monitor_handle = tokio::spawn(battery_monitor.run());
    
    // Main daemon loop
    info!("tau-powerd daemon running");
    
    if args.foreground {
        // Run in foreground for debugging
        tokio::select! {
            _ = tokio::signal::ctrl_c() => {
                info!("Received shutdown signal");
            }
            _ = dbus_handle => {
                error!("D-Bus API terminated unexpectedly");
            }
            _ = monitor_handle => {
                error!("Battery monitor terminated unexpectedly");
            }
        }
    } else {
        // Run as daemon
        tokio::select! {
            _ = dbus_handle => {
                error!("D-Bus API terminated unexpectedly");
            }
            _ = monitor_handle => {
                error!("Battery monitor terminated unexpectedly");
            }
        }
    }
    
    info!("tau-powerd daemon shutting down");
    Ok(())
} 