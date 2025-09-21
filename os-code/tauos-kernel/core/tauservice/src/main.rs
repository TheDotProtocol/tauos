mod unit;
mod service_manager;
mod process;
mod journal;
mod boot;
mod state;
mod sandbox;
mod taupkg_hooks;
mod tui;

use clap::{Parser, Subcommand};
use service_manager::{ServiceManager, ServiceState};
use journal::JournalLogger;
use boot::BootManager;
use state::StateManager;
use sandbox::{SandboxManager, SecurityAuditor};
use taupkg_hooks::TauPkgHooks;
use tui::TauServiceTUI;
use anyhow::Result;
use log::{info, warn, error};
use std::sync::Arc;
use tokio::time::Duration;

#[derive(Parser)]
#[command(name = "tau-service")]
#[command(about = "Tau OS Service Manager", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
    /// Verbose output
    #[arg(short, long, default_value_t = false)]
    verbose: bool,
    /// Quiet mode
    #[arg(short, long, default_value_t = false)]
    quiet: bool,
}

#[derive(Subcommand)]
enum Commands {
    /// Start a service
    Start { 
        service: String,
        /// Wait for service to be fully started
        #[arg(long)]
        wait: bool,
    },
    /// Stop a service
    Stop { 
        service: String,
        /// Force stop (SIGKILL)
        #[arg(long)]
        force: bool,
    },
    /// Restart a service
    Restart { 
        service: String,
    },
    /// Reload a service configuration
    Reload { 
        service: String,
    },
    /// Enable a service to start at boot
    Enable { 
        service: String,
    },
    /// Disable a service from starting at boot
    Disable { 
        service: String,
    },
    /// Show service status
    Status { 
        service: Option<String>,
    },
    /// List services
    List {
        /// Show only running services
        #[arg(long)]
        running: bool,
        /// Show only enabled services
        #[arg(long)]
        enabled: bool,
        /// Show only failed services
        #[arg(long)]
        failed: bool,
    },
    /// Show service logs
    Logs { 
        service: String,
        /// Follow log output
        #[arg(short, long)]
        follow: bool,
        /// Number of lines to show
        #[arg(short, long, default_value = "50")]
        lines: usize,
    },
    /// Clear service logs
    ClearLogs { 
        service: Option<String>,
    },
    /// Reload all unit files
    DaemonReload,
    /// Start the service manager daemon
    Daemon,
    /// Open TUI interface
    Tui,
    /// Boot integration commands
    Boot {
        #[command(subcommand)]
        action: BootCommands,
    },
    /// State management commands
    State {
        #[command(subcommand)]
        action: StateCommands,
    },
    /// Security audit commands
    Security {
        #[command(subcommand)]
        action: SecurityCommands,
    },
    /// TauPkg integration commands
    TauPkg {
        #[command(subcommand)]
        action: TauPkgCommands,
    },
}

#[derive(Subcommand)]
enum BootCommands {
    /// Setup boot integration
    Setup,
    /// Start boot services
    Start,
    /// List boot services
    List,
    /// Enable service for boot
    Enable { service: String },
    /// Disable service from boot
    Disable { service: String },
}

#[derive(Subcommand)]
enum StateCommands {
    /// Show state summary
    Summary,
    /// Backup current state
    Backup,
    /// Restore state from backup
    Restore { timestamp: u64 },
    /// List available backups
    ListBackups,
    /// Clear all state
    Clear,
}

#[derive(Subcommand)]
enum SecurityCommands {
    /// Audit service security
    Audit { service: String },
    /// Create security profile
    CreateProfile { service: String },
    /// Remove security profile
    RemoveProfile { service: String },
    /// Show security report
    Report { service: String },
}

#[derive(Subcommand)]
enum TauPkgCommands {
    /// Install package hooks
    InstallHooks { package: String, path: String },
    /// Remove package hooks
    RemoveHooks { package: String },
    /// List package services
    ListServices { package: String },
    /// Auto-enable package services
    AutoEnable { package: String },
    /// Auto-disable package services
    AutoDisable { package: String },
}

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();
    
    let cli = Cli::parse();
    
    // Set log level based on verbosity
    if cli.verbose {
        std::env::set_var("RUST_LOG", "debug");
    } else if cli.quiet {
        std::env::set_var("RUST_LOG", "error");
    }
    
    match &cli.command {
        Commands::Start { service, wait } => {
            let manager = ServiceManager::new()?;
            manager.load_units()?;
            
            info!("Starting service: {}", service);
            manager.start_service(service)?;
            
            if *wait {
                // Wait for service to be active
                for _ in 0..30 {
                    if let Some(status) = manager.get_service_status(service) {
                        if status.state == ServiceState::Active {
                            info!("Service {} is now active", service);
                            break;
                        }
                    }
                    tokio::time::sleep(Duration::from_millis(100)).await;
                }
            }
        },
        
        Commands::Stop { service, force } => {
            let manager = ServiceManager::new()?;
            manager.load_units()?;
            
            info!("Stopping service: {}", service);
            if *force {
                warn!("Force stopping service: {}", service);
                // In a real implementation, you'd send SIGKILL
            }
            
            manager.stop_service(service)?;
        },
        
        Commands::Restart { service } => {
            let manager = ServiceManager::new()?;
            manager.load_units()?;
            
            info!("Restarting service: {}", service);
            manager.restart_service(service).await?;
        },
        
        Commands::Reload { service } => {
            let manager = ServiceManager::new()?;
            manager.load_units()?;
            
            info!("Reloading service: {}", service);
            manager.reload_service(service)?;
        },
        
        Commands::Enable { service } => {
            let manager = ServiceManager::new()?;
            manager.load_units()?;
            
            info!("Enabling service: {}", service);
            manager.enable_service(service)?;
        },
        
        Commands::Disable { service } => {
            let manager = ServiceManager::new()?;
            manager.load_units()?;
            
            info!("Disabling service: {}", service);
            manager.disable_service(service)?;
        },
        
        Commands::Status { service } => {
            let manager = ServiceManager::new()?;
            manager.load_units()?;
            
            if let Some(service_name) = service {
                if let Some(status) = manager.get_service_status(service_name) {
                    print_service_status(&status);
                } else {
                    println!("Service '{}' not found", service_name);
                }
            } else {
                // Show status of all services
                let services = manager.list_services(None);
                for status in services {
                    print_service_status(&status);
                }
            }
        },
        
        Commands::List { running, enabled, failed } => {
            let manager = ServiceManager::new()?;
            manager.load_units()?;
            
            let filter = if *running {
                Some(ServiceState::Active)
            } else if *failed {
                Some(ServiceState::Failed)
            } else {
                None
            };
            
            let services = manager.list_services(filter);
            
            if *enabled {
                // Filter enabled services
                let enabled_services: Vec<_> = services
                    .into_iter()
                    .filter(|s| {
                        if let Some(unit) = manager.get_unit(&s.name).ok() {
                            unit.is_enabled()
                        } else {
                            false
                        }
                    })
                    .collect();
                
                print_service_list(&enabled_services);
            } else {
                print_service_list(&services);
            }
        },
        
        Commands::Logs { service, follow, lines } => {
            let journal_logger = JournalLogger::new()?;
            journal_logger.load_existing_logs()?;
            
            let logs = journal_logger.get_logs(service, Some(*lines));
            
            for entry in logs {
                println!("{} [{}] {}: {}", 
                    entry.timestamp.format("%Y-%m-%d %H:%M:%S"),
                    entry.stream.to_uppercase(),
                    entry.level,
                    entry.message);
            }
            
            if *follow {
                println!("Following logs for {} (press Ctrl+C to stop)...", service);
                // In a real implementation, you'd implement file watching here
                loop {
                    tokio::time::sleep(Duration::from_secs(1)).await;
                }
            }
        },
        
        Commands::ClearLogs { service } => {
            let journal_logger = JournalLogger::new()?;
            
            if let Some(service_name) = service {
                info!("Clearing logs for service: {}", service_name);
                journal_logger.clear_logs(Some(service_name))?;
            } else {
                info!("Clearing all service logs");
                journal_logger.clear_logs(None)?;
            }
        },
        
        Commands::DaemonReload => {
            let manager = ServiceManager::new()?;
            info!("Reloading service units");
            manager.load_units()?;
            info!("Service units reloaded successfully");
        },
        
        Commands::Daemon => {
            info!("Starting TauService daemon");
            run_daemon().await?;
        },
        
        Commands::Tui => {
            info!("Starting TauService TUI");
            let mut tui = TauServiceTUI::new()?;
            tui.run().await?;
        },
        
        Commands::Boot { action } => {
            let boot_manager = BootManager::new();
            
            match action {
                BootCommands::Setup => {
                    boot_manager.setup_boot_integration()?;
                    println!("✅ Boot integration setup complete");
                },
                BootCommands::Start => {
                    let manager = ServiceManager::new()?;
                    manager.load_units()?;
                    boot_manager.start_boot_services(&manager)?;
                    println!("✅ Boot services started");
                },
                BootCommands::List => {
                    let services = boot_manager.get_boot_services()?;
                    println!("Boot services:");
                    for service in services {
                        println!("  - {}", service);
                    }
                },
                BootCommands::Enable { service } => {
                    boot_manager.enable_service_for_boot(service)?;
                    println!("✅ Service {} enabled for boot", service);
                },
                BootCommands::Disable { service } => {
                    boot_manager.disable_service_from_boot(service)?;
                    println!("✅ Service {} disabled from boot", service);
                },
            }
        },
        
        Commands::State { action } => {
            let state_manager = StateManager::new()?;
            
            match action {
                StateCommands::Summary => {
                    let summary = state_manager.get_state_summary()?;
                    println!("State Summary:");
                    println!("  Total Services: {}", summary.total_services);
                    println!("  Enabled Services: {}", summary.enabled_services);
                    println!("  Running Services: {}", summary.running_services);
                    println!("  Last Save: {}", summary.last_save);
                },
                StateCommands::Backup => {
                    state_manager.backup_state()?;
                    println!("✅ State backup created");
                },
                StateCommands::Restore { timestamp } => {
                    state_manager.restore_state(*timestamp)?;
                    println!("✅ State restored from backup {}", timestamp);
                },
                StateCommands::ListBackups => {
                    let backups = state_manager.list_backups()?;
                    println!("Available backups:");
                    for backup in backups {
                        println!("  - {}", backup);
                    }
                },
                StateCommands::Clear => {
                    state_manager.clear_all_state()?;
                    println!("✅ All state cleared");
                },
            }
        },
        
        Commands::Security { action } => {
            let security_auditor = SecurityAuditor::new();
            let sandbox_manager = SandboxManager::new();
            
            match action {
                SecurityCommands::Audit { service } => {
                    // This would audit the service's security configuration
                    println!("Security audit for service: {}", service);
                    println!("(Security audit implementation would go here)");
                },
                SecurityCommands::CreateProfile { service } => {
                    sandbox_manager.create_default_profile(service)?;
                    println!("✅ Security profile created for service: {}", service);
                },
                SecurityCommands::RemoveProfile { service } => {
                    sandbox_manager.remove_security_profile(service)?;
                    println!("✅ Security profile removed for service: {}", service);
                },
                SecurityCommands::Report { service } => {
                    println!("Security report for service: {}", service);
                    println!("(Security report implementation would go here)");
                },
            }
        },
        
        Commands::TauPkg { action } => {
            let hooks = TauPkgHooks::new()?;
            
            match action {
                TauPkgCommands::InstallHooks { package, path } => {
                    hooks.install_package_hooks(package, std::path::Path::new(path))?;
                    println!("✅ TauPkg hooks installed for package: {}", package);
                },
                TauPkgCommands::RemoveHooks { package } => {
                    hooks.remove_package_hooks(package)?;
                    println!("✅ TauPkg hooks removed for package: {}", package);
                },
                TauPkgCommands::ListServices { package } => {
                    let services = hooks.list_package_services(package)?;
                    println!("Services provided by package {}:", package);
                    for service in services {
                        println!("  - {}", service);
                    }
                },
                TauPkgCommands::AutoEnable { package } => {
                    hooks.auto_enable_services(package)?;
                    println!("✅ Services auto-enabled for package: {}", package);
                },
                TauPkgCommands::AutoDisable { package } => {
                    hooks.auto_disable_services(package)?;
                    println!("✅ Services auto-disabled for package: {}", package);
                },
            }
        },
    }
    
    Ok(())
}

fn print_service_status(status: &service_manager::ServiceStatus) {
    let state_str = match status.state {
        ServiceState::Inactive => "inactive",
        ServiceState::Activating => "activating",
        ServiceState::Active => "active",
        ServiceState::Deactivating => "deactivating",
        ServiceState::Failed => "failed",
        ServiceState::Reloading => "reloading",
    };
    
    let pid_str = status.pid.map_or("".to_string(), |pid| format!(" (PID: {})", pid));
    
    println!("● {} - {} {}", status.name, state_str, pid_str);
    
    if let Some(start_time) = status.start_time {
        let duration = start_time.elapsed();
        println!("   Started: {} ago", format_duration(duration));
    }
    
    if status.restart_count > 0 {
        println!("   Restarts: {}", status.restart_count);
    }
    
    if let Some(error) = &status.load_error {
        println!("   Error: {}", error);
    }
}

fn print_service_list(services: &[service_manager::ServiceStatus]) {
    if services.is_empty() {
        println!("No services found");
        return;
    }
    
    println!("{:<20} {:<12} {:<10}", "SERVICE", "STATE", "PID");
    println!("{:-<42}", "");
    
    for status in services {
        let state_str = match status.state {
            ServiceState::Inactive => "inactive",
            ServiceState::Activating => "activating",
            ServiceState::Active => "active",
            ServiceState::Deactivating => "deactivating",
            ServiceState::Failed => "failed",
            ServiceState::Reloading => "reloading",
        };
        
        let pid_str = status.pid.map_or("".to_string(), |pid| pid.to_string());
        
        println!("{:<20} {:<12} {:<10}", status.name, state_str, pid_str);
    }
}

fn format_duration(duration: std::time::Duration) -> String {
    let secs = duration.as_secs();
    if secs < 60 {
        format!("{}s", secs)
    } else if secs < 3600 {
        format!("{}m {}s", secs / 60, secs % 60)
    } else {
        let hours = secs / 3600;
        let mins = (secs % 3600) / 60;
        format!("{}h {}m", hours, mins)
    }
}

async fn run_daemon() -> Result<()> {
    let manager = ServiceManager::new()?;
    manager.load_units()?;
    
    info!("TauService daemon started");
    info!("Loaded {} service units", manager.list_services(None).len());
    
    // Keep daemon running
    loop {
        tokio::time::sleep(Duration::from_secs(60)).await;
        
        // Check for failed services and restart if needed
        let services = manager.list_services(Some(ServiceState::Failed));
        for service in services {
            warn!("Service {} failed, attempting restart", service.name);
            if let Err(e) = manager.restart_service(&service.name).await {
                error!("Failed to restart service {}: {}", service.name, e);
            }
        }
    }
} 