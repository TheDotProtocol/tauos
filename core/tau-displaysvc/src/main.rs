use std::sync::Arc;
use tokio::sync::Mutex;
use log::{info, error, warn};
use anyhow::Result;
use clap::Parser;

mod display_manager;
mod monitor_detector;
mod configuration;
mod brightness_control;
mod dbus_api;
mod config;

use display_manager::DisplayManager;
use dbus_api::DisplayDbusApi;

#[derive(Parser)]
#[command(name = "tau-displaysvc")]
#[command(about = "Tau OS Display Configuration Daemon")]
struct Args {
    #[arg(long, default_value = "/var/log/tau/display.log")]
    log_file: String,
    
    #[arg(long, default_value = "/etc/tau/display.toml")]
    config_file: String,
    
    #[arg(long)]
    foreground: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    
    // Initialize logging
    env_logger::init();
    info!("Starting tau-displaysvc daemon");
    
    // Load configuration
    let config = config::DisplayConfig::load(&args.config_file)?;
    info!("Loaded display configuration from {}", args.config_file);
    
    // Initialize display manager
    let display_manager = Arc::new(Mutex::new(DisplayManager::new(config.clone())?));
    
    // Start D-Bus API
    let dbus_api = DisplayDbusApi::new(display_manager.clone());
    let dbus_handle = tokio::spawn(dbus_api.run());
    
    // Start monitor detection
    let monitor_detector = monitor_detector::MonitorDetector::new(display_manager.clone());
    let detector_handle = tokio::spawn(monitor_detector.run());
    
    // Start configuration management
    let configuration = configuration::ConfigurationManager::new(display_manager.clone());
    let config_handle = tokio::spawn(configuration.run());
    
    // Main daemon loop
    info!("tau-displaysvc daemon running");
    
    if args.foreground {
        // Run in foreground for debugging
        tokio::select! {
            _ = tokio::signal::ctrl_c() => {
                info!("Received shutdown signal");
            }
            _ = dbus_handle => {
                error!("D-Bus API terminated unexpectedly");
            }
            _ = detector_handle => {
                error!("Monitor detector terminated unexpectedly");
            }
            _ = config_handle => {
                error!("Configuration manager terminated unexpectedly");
            }
        }
    } else {
        // Run as daemon
        tokio::select! {
            _ = dbus_handle => {
                error!("D-Bus API terminated unexpectedly");
            }
            _ = detector_handle => {
                error!("Monitor detector terminated unexpectedly");
            }
            _ = config_handle => {
                error!("Configuration manager terminated unexpectedly");
            }
        }
    }
    
    info!("tau-displaysvc daemon shutting down");
    Ok(())
} 