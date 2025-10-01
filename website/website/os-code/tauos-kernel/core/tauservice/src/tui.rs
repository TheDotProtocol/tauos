use crate::service_manager::{ServiceManager, ServiceState, ServiceStatus};
use crate::state::StateManager;
use crate::sandbox::SecurityAuditor;
use anyhow::Result;
use std::io::{self, Write};
use std::time::Duration;
use tokio::time::sleep;
use log::{info, warn, error};

pub struct TauServiceTUI {
    service_manager: ServiceManager,
    state_manager: StateManager,
    security_auditor: SecurityAuditor,
}

impl TauServiceTUI {
    pub fn new() -> Result<Self> {
        Ok(Self {
            service_manager: ServiceManager::new()?,
            state_manager: StateManager::new()?,
            security_auditor: SecurityAuditor::new(),
        })
    }
    
    pub async fn run(&mut self) -> Result<()> {
        self.service_manager.load_units()?;
        
        loop {
            self.clear_screen()?;
            self.display_header()?;
            self.display_services()?;
            self.display_menu()?;
            
            let choice = self.get_user_choice()?;
            
            match choice.as_str() {
                "1" => self.start_service_prompt().await?,
                "2" => self.stop_service_prompt().await?,
                "3" => self.restart_service_prompt().await?,
                "4" => self.enable_service_prompt().await?,
                "5" => self.disable_service_prompt().await?,
                "6" => self.show_service_logs().await?,
                "7" => self.show_security_audit().await?,
                "8" => self.show_system_stats().await?,
                "9" => self.reload_units().await?,
                "0" => break,
                _ => {
                    println!("Invalid choice. Press Enter to continue...");
                    self.wait_for_enter()?;
                }
            }
        }
        
        println!("Exiting TauService TUI...");
        Ok(())
    }
    
    fn clear_screen(&self) -> Result<()> {
        print!("\x1B[2J\x1B[1;1H");
        io::stdout().flush()?;
        Ok(())
    }
    
    fn display_header(&self) -> Result<()> {
        println!("╔══════════════════════════════════════════════════════════════╗");
        println!("║                    TauService TUI                            ║");
        println!("║                Tau OS Service Manager                        ║");
        println!("╚══════════════════════════════════════════════════════════════╝");
        println!();
        Ok(())
    }
    
    fn display_services(&self) -> Result<()> {
        let services = self.service_manager.list_services(None);
        
        println!("📋 Service Status:");
        println!("{:<20} {:<12} {:<10} {:<8}", "SERVICE", "STATE", "PID", "ENABLED");
        println!("{:-<50}", "");
        
        for status in services {
            let state_icon = match status.state {
                ServiceState::Active => "🟢",
                ServiceState::Inactive => "⚪",
                ServiceState::Activating => "🟡",
                ServiceState::Deactivating => "🟡",
                ServiceState::Failed => "🔴",
                ServiceState::Reloading => "🟡",
            };
            
            let state_str = match status.state {
                ServiceState::Active => "active",
                ServiceState::Inactive => "inactive",
                ServiceState::Activating => "activating",
                ServiceState::Deactivating => "deactivating",
                ServiceState::Failed => "failed",
                ServiceState::Reloading => "reloading",
            };
            
            let pid_str = status.pid.map_or("".to_string(), |pid| pid.to_string());
            let enabled = if let Some(unit) = self.service_manager.get_unit(&status.name).ok() {
                if unit.is_enabled() { "yes" } else { "no" }
            } else {
                "no"
            };
            
            println!("{:<20} {:<12} {:<10} {:<8}", 
                status.name, 
                format!("{} {}", state_icon, state_str),
                pid_str,
                enabled);
        }
        
        println!();
        Ok(())
    }
    
    fn display_menu(&self) -> Result<()> {
        println!("🔧 Actions:");
        println!("  1. Start Service");
        println!("  2. Stop Service");
        println!("  3. Restart Service");
        println!("  4. Enable Service");
        println!("  5. Disable Service");
        println!("  6. Show Service Logs");
        println!("  7. Security Audit");
        println!("  8. System Stats");
        println!("  9. Reload Units");
        println!("  0. Exit");
        println!();
        print!("Enter your choice: ");
        io::stdout().flush()?;
        Ok(())
    }
    
    fn get_user_choice(&self) -> Result<String> {
        let mut choice = String::new();
        io::stdin().read_line(&mut choice)?;
        Ok(choice.trim().to_string())
    }
    
    async fn start_service_prompt(&mut self) -> Result<()> {
        print!("Enter service name to start: ");
        io::stdout().flush()?;
        
        let mut service_name = String::new();
        io::stdin().read_line(&mut service_name)?;
        let service_name = service_name.trim();
        
        if !service_name.is_empty() {
            info!("Starting service: {}", service_name);
            if let Err(e) = self.service_manager.start_service(service_name) {
                error!("Failed to start service {}: {}", service_name, e);
                println!("❌ Failed to start service: {}", e);
            } else {
                println!("✅ Service {} started successfully", service_name);
            }
        }
        
        self.wait_for_enter()?;
        Ok(())
    }
    
    async fn stop_service_prompt(&mut self) -> Result<()> {
        print!("Enter service name to stop: ");
        io::stdout().flush()?;
        
        let mut service_name = String::new();
        io::stdin().read_line(&mut service_name)?;
        let service_name = service_name.trim();
        
        if !service_name.is_empty() {
            info!("Stopping service: {}", service_name);
            if let Err(e) = self.service_manager.stop_service(service_name) {
                error!("Failed to stop service {}: {}", service_name, e);
                println!("❌ Failed to stop service: {}", e);
            } else {
                println!("✅ Service {} stopped successfully", service_name);
            }
        }
        
        self.wait_for_enter()?;
        Ok(())
    }
    
    async fn restart_service_prompt(&mut self) -> Result<()> {
        print!("Enter service name to restart: ");
        io::stdout().flush()?;
        
        let mut service_name = String::new();
        io::stdin().read_line(&mut service_name)?;
        let service_name = service_name.trim();
        
        if !service_name.is_empty() {
            info!("Restarting service: {}", service_name);
            if let Err(e) = self.service_manager.restart_service(service_name).await {
                error!("Failed to restart service {}: {}", service_name, e);
                println!("❌ Failed to restart service: {}", e);
            } else {
                println!("✅ Service {} restarted successfully", service_name);
            }
        }
        
        self.wait_for_enter()?;
        Ok(())
    }
    
    async fn enable_service_prompt(&mut self) -> Result<()> {
        print!("Enter service name to enable: ");
        io::stdout().flush()?;
        
        let mut service_name = String::new();
        io::stdin().read_line(&mut service_name)?;
        let service_name = service_name.trim();
        
        if !service_name.is_empty() {
            info!("Enabling service: {}", service_name);
            if let Err(e) = self.service_manager.enable_service(service_name) {
                error!("Failed to enable service {}: {}", service_name, e);
                println!("❌ Failed to enable service: {}", e);
            } else {
                println!("✅ Service {} enabled successfully", service_name);
            }
        }
        
        self.wait_for_enter()?;
        Ok(())
    }
    
    async fn disable_service_prompt(&mut self) -> Result<()> {
        print!("Enter service name to disable: ");
        io::stdout().flush()?;
        
        let mut service_name = String::new();
        io::stdin().read_line(&mut service_name)?;
        let service_name = service_name.trim();
        
        if !service_name.is_empty() {
            info!("Disabling service: {}", service_name);
            if let Err(e) = self.service_manager.disable_service(service_name) {
                error!("Failed to disable service {}: {}", service_name, e);
                println!("❌ Failed to disable service: {}", e);
            } else {
                println!("✅ Service {} disabled successfully", service_name);
            }
        }
        
        self.wait_for_enter()?;
        Ok(())
    }
    
    async fn show_service_logs(&mut self) -> Result<()> {
        print!("Enter service name for logs: ");
        io::stdout().flush()?;
        
        let mut service_name = String::new();
        io::stdin().read_line(&mut service_name)?;
        let service_name = service_name.trim();
        
        if !service_name.is_empty() {
            println!("📋 Recent logs for service: {}", service_name);
            println!("{:-<60}", "");
            
            // This would integrate with the journal system
            println!("(Log display would be implemented here)");
        }
        
        self.wait_for_enter()?;
        Ok(())
    }
    
    async fn show_security_audit(&mut self) -> Result<()> {
        println!("🔒 Security Audit");
        println!("{:-<40}", "");
        
        let services = self.service_manager.list_services(None);
        
        for status in services {
            if let Ok(unit) = self.service_manager.get_unit(&status.name) {
                if let Some(sandbox) = &unit.sandbox {
                    let report = self.security_auditor.audit_service_security(&status.name, sandbox);
                    println!("Service: {}", status.name);
                    println!("Security Score: {:.1}%", report.overall_score);
                    println!();
                }
            }
        }
        
        self.wait_for_enter()?;
        Ok(())
    }
    
    async fn show_system_stats(&mut self) -> Result<()> {
        println!("📊 System Statistics");
        println!("{:-<40}", "");
        
        if let Ok(summary) = self.state_manager.get_state_summary() {
            println!("Total Services: {}", summary.total_services);
            println!("Enabled Services: {}", summary.enabled_services);
            println!("Running Services: {}", summary.running_services);
            println!("Last Save: {}", summary.last_save);
        }
        
        let services = self.service_manager.list_services(None);
        let active_count = services.iter().filter(|s| s.state == ServiceState::Active).count();
        let failed_count = services.iter().filter(|s| s.state == ServiceState::Failed).count();
        
        println!("Active Services: {}", active_count);
        println!("Failed Services: {}", failed_count);
        
        self.wait_for_enter()?;
        Ok(())
    }
    
    async fn reload_units(&mut self) -> Result<()> {
        info!("Reloading service units");
        if let Err(e) = self.service_manager.load_units() {
            error!("Failed to reload units: {}", e);
            println!("❌ Failed to reload units: {}", e);
        } else {
            println!("✅ Service units reloaded successfully");
        }
        
        self.wait_for_enter()?;
        Ok(())
    }
    
    fn wait_for_enter(&self) -> Result<()> {
        print!("Press Enter to continue...");
        io::stdout().flush()?;
        let mut input = String::new();
        io::stdin().read_line(&mut input)?;
        Ok(())
    }
} 