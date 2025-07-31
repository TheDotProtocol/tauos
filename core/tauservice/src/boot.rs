use crate::service_manager::ServiceManager;
use crate::unit::ServiceUnit;
use anyhow::{Result, Context};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use log::{info, warn, error};

pub struct BootManager {
    system_dir: PathBuf,
    state_dir: PathBuf,
    targets_dir: PathBuf,
}

impl BootManager {
    pub fn new() -> Self {
        Self {
            system_dir: PathBuf::from("/etc/tau/system"),
            state_dir: PathBuf::from("/var/lib/tau-service"),
            targets_dir: PathBuf::from("/etc/tau/system"),
        }
    }
    
    pub fn setup_boot_integration(&self) -> Result<()> {
        info!("Setting up TauService boot integration");
        
        // Create necessary directories
        fs::create_dir_all(&self.system_dir)?;
        fs::create_dir_all(&self.state_dir)?;
        fs::create_dir_all(&self.targets_dir)?;
        
        // Create boot.target
        self.create_boot_target()?;
        
        // Create multi-user.target
        self.create_multi_user_target()?;
        
        // Create network.target
        self.create_network_target()?;
        
        info!("Boot integration setup complete");
        Ok(())
    }
    
    fn create_boot_target(&self) -> Result<()> {
        let boot_target = self.targets_dir.join("boot.target");
        
        let content = r#"[Unit]
Description = Boot Target
DefaultDependencies = no
After = local-fs.target
Wants = local-fs.target

[Install]
WantedBy = multi-user.target
"#;
        
        fs::write(&boot_target, content)?;
        info!("Created boot.target");
        Ok(())
    }
    
    fn create_multi_user_target(&self) -> Result<()> {
        let multi_user_target = self.targets_dir.join("multi-user.target");
        
        let content = r#"[Unit]
Description = Multi-User System
Documentation = man:systemd.special(7)
DefaultDependencies = no
Requires = boot.target
After = boot.target
AllowIsolate = yes

[Install]
WantedBy = default.target
"#;
        
        fs::write(&multi_user_target, content)?;
        info!("Created multi-user.target");
        Ok(())
    }
    
    fn create_network_target(&self) -> Result<()> {
        let network_target = self.targets_dir.join("network.target");
        
        let content = r#"[Unit]
Description = Network
Documentation = man:systemd.special(7)
DefaultDependencies = no
After = network-online.target
Wants = network-online.target
"#;
        
        fs::write(&network_target, content)?;
        info!("Created network.target");
        Ok(())
    }
    
    pub fn enable_service_for_boot(&self, service_name: &str) -> Result<()> {
        let service_unit = format!("{}.tau", service_name);
        let source_path = PathBuf::from(format!("/etc/tau/services/{}", service_unit));
        let target_path = self.targets_dir.join("multi-user.target").join(service_unit);
        
        if !source_path.exists() {
            return Err(anyhow::anyhow!("Service unit file not found: {}", source_path.display()));
        }
        
        // Create symlink
        if target_path.exists() {
            fs::remove_file(&target_path)?;
        }
        
        std::os::unix::fs::symlink(&source_path, &target_path)?;
        info!("Enabled service {} for boot", service_name);
        
        Ok(())
    }
    
    pub fn disable_service_from_boot(&self, service_name: &str) -> Result<()> {
        let service_unit = format!("{}.tau", service_name);
        let target_path = self.targets_dir.join("multi-user.target").join(service_unit);
        
        if target_path.exists() {
            fs::remove_file(&target_path)?;
            info!("Disabled service {} from boot", service_name);
        }
        
        Ok(())
    }
    
    pub fn get_boot_services(&self) -> Result<Vec<String>> {
        let mut services = Vec::new();
        let multi_user_dir = self.targets_dir.join("multi-user.target");
        
        if multi_user_dir.exists() {
            for entry in fs::read_dir(&multi_user_dir)? {
                let entry = entry?;
                let path = entry.path();
                
                if path.is_file() && path.extension().map_or(false, |ext| ext == "tau") {
                    if let Some(service_name) = path.file_stem() {
                        services.push(service_name.to_string_lossy().to_string());
                    }
                }
            }
        }
        
        Ok(services)
    }
    
    pub fn start_boot_services(&self, manager: &ServiceManager) -> Result<()> {
        info!("Starting boot services");
        
        let boot_services = self.get_boot_services()?;
        
        for service in boot_services {
            info!("Starting boot service: {}", service);
            if let Err(e) = manager.start_service(&service) {
                error!("Failed to start boot service {}: {}", service, e);
            }
        }
        
        info!("Boot services started");
        Ok(())
    }
} 