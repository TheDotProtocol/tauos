use std::sync::Arc;
use tokio::sync::Mutex;
use log::{info, error, warn};
use anyhow::Result;
use clap::Parser;

mod input_manager;
mod device_monitor;
mod event_handler;
mod keymap_manager;
mod accessibility;
mod dbus_api;
mod config;

use input_manager::InputManager;
use dbus_api::InputDbusApi;

#[derive(Parser)]
#[command(name = "tau-inputd")]
#[command(about = "Tau OS Input Device Daemon")]
struct Args {
    #[arg(long, default_value = "/var/log/tau/input.log")]
    log_file: String,
    
    #[arg(long, default_value = "/etc/tau/input.toml")]
    config_file: String,
    
    #[arg(long)]
    foreground: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    
    // Initialize logging
    env_logger::init();
    info!("Starting tau-inputd daemon");
    
    // Load configuration
    let config = config::InputConfig::load(&args.config_file)?;
    info!("Loaded input configuration from {}", args.config_file);
    
    // Initialize input manager
    let input_manager = Arc::new(Mutex::new(InputManager::new(config.clone())?));
    
    // Start D-Bus API
    let dbus_api = InputDbusApi::new(input_manager.clone());
    let dbus_handle = tokio::spawn(dbus_api.run());
    
    // Start device monitoring
    let device_monitor = device_monitor::DeviceMonitor::new(input_manager.clone());
    let monitor_handle = tokio::spawn(device_monitor.run());
    
    // Start event handling
    let event_handler = event_handler::EventHandler::new(input_manager.clone());
    let event_handle = tokio::spawn(event_handler.run());
    
    // Main daemon loop
    info!("tau-inputd daemon running");
    
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
                error!("Device monitor terminated unexpectedly");
            }
            _ = event_handle => {
                error!("Event handler terminated unexpectedly");
            }
        }
    } else {
        // Run as daemon
        tokio::select! {
            _ = dbus_handle => {
                error!("D-Bus API terminated unexpectedly");
            }
            _ = monitor_handle => {
                error!("Device monitor terminated unexpectedly");
            }
            _ = event_handle => {
                error!("Event handler terminated unexpectedly");
            }
        }
    }
    
    info!("tau-inputd daemon shutting down");
    Ok(())
} 