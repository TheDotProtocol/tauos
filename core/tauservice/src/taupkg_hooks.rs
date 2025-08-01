use crate::service_manager::ServiceManager;
use crate::unit::ServiceUnit;
use crate::sandbox::SandboxManager;
use anyhow::{Result, Context};
use std::fs;
use std::path::{Path, PathBuf};
use std::collections::HashMap;
use log::{info, warn, error};

pub struct TauPkgHooks {
    service_manager: ServiceManager,
    sandbox_manager: SandboxManager,
    hooks_dir: PathBuf,
}

impl TauPkgHooks {
    pub fn new() -> Result<Self> {
        let hooks_dir = PathBuf::from("/etc/tau-pkg/hooks");
        fs::create_dir_all(&hooks_dir)?;
        
        Ok(Self {
            service_manager: ServiceManager::new()?,
            sandbox_manager: SandboxManager::new(),
            hooks_dir,
        })
    }
    
    pub fn install_package_hooks(&self, package_name: &str, package_path: &Path) -> Result<()> {
        info!("Installing TauPkg hooks for package: {}", package_name);
        
        // Check if package provides services
        let service_units = self.discover_service_units(package_path)?;
        
        if !service_units.is_empty() {
            // Register services with TauService
            for (service_name, unit_content) in service_units {
                self.register_service(&service_name, &unit_content)?;
            }
            
            // Create post-install hook
            self.create_post_install_hook(package_name, &service_units)?;
            
            // Create post-remove hook
            self.create_post_remove_hook(package_name, &service_units)?;
        }
        
        info!("TauPkg hooks installed for package: {}", package_name);
        Ok(())
    }
    
    pub fn remove_package_hooks(&self, package_name: &str) -> Result<()> {
        info!("Removing TauPkg hooks for package: {}", package_name);
        
        // Get list of services provided by this package
        let services = self.get_package_services(package_name)?;
        
        for service_name in services {
            self.unregister_service(&service_name)?;
        }
        
        // Remove hook files
        let post_install_hook = self.hooks_dir.join(format!("{}.post-install", package_name));
        let post_remove_hook = self.hooks_dir.join(format!("{}.post-remove", package_name));
        
        if post_install_hook.exists() {
            fs::remove_file(&post_install_hook)?;
        }
        
        if post_remove_hook.exists() {
            fs::remove_file(&post_remove_hook)?;
        }
        
        info!("TauPkg hooks removed for package: {}", package_name);
        Ok(())
    }
    
    fn discover_service_units(&self, package_path: &Path) -> Result<HashMap<String, String>> {
        let mut service_units = HashMap::new();
        
        // Look for .tau files in the package
        for entry in walkdir::WalkDir::new(package_path)
            .follow_links(true)
            .into_iter()
            .filter_map(|e| e.ok()) {
            
            let path = entry.path();
            if path.is_file() && path.extension().map_or(false, |ext| ext == "tau") {
                if let Some(service_name) = path.file_stem() {
                    let content = fs::read_to_string(path)?;
                    service_units.insert(service_name.to_string_lossy().to_string(), content);
                }
            }
        }
        
        // Also check for service definitions in package manifest
        let manifest_path = package_path.join("manifest.toml");
        if manifest_path.exists() {
            if let Ok(manifest_content) = fs::read_to_string(&manifest_path) {
                if let Ok(services) = self.extract_services_from_manifest(&manifest_content) {
                    for (service_name, unit_content) in services {
                        service_units.insert(service_name, unit_content);
                    }
                }
            }
        }
        
        Ok(service_units)
    }
    
    fn extract_services_from_manifest(&self, manifest_content: &str) -> Result<HashMap<String, String>> {
        let mut services = HashMap::new();
        
        // Parse manifest for service definitions
        // This is a simplified implementation - in practice you'd use proper TOML parsing
        if manifest_content.contains("[services]") {
            // Extract service definitions from manifest
            // For now, we'll create a basic service template
            services.insert("default".to_string(), self.create_default_service_unit()?);
        }
        
        Ok(services)
    }
    
    fn create_default_service_unit(&self) -> Result<String> {
        let unit_content = r#"name = "default"
description = "Default service"

[service]
exec_start = "/usr/bin/default-service"
restart = "always"
type = "simple"

standard_output = "journal"
standard_error = "journal"

[sandbox]
no_new_privileges = true
private_tmp = true
network_access = true

[install]
wanted_by = ["multi-user.target"]
"#;
        
        Ok(unit_content.to_string())
    }
    
    fn register_service(&self, service_name: &str, unit_content: &str) -> Result<()> {
        // Write service unit file
        let service_path = PathBuf::from(format!("/etc/tau/services/{}.tau", service_name));
        fs::write(&service_path, unit_content)?;
        
        // Create security profile
        self.sandbox_manager.create_default_profile(service_name)?;
        
        // Reload service manager
        self.service_manager.load_units()?;
        
        info!("Registered service: {}", service_name);
        Ok(())
    }
    
    fn unregister_service(&self, service_name: &str) -> Result<()> {
        // Stop service if running
        if self.service_manager.is_service_active(service_name) {
            self.service_manager.stop_service(service_name)?;
        }
        
        // Remove service unit file
        let service_path = PathBuf::from(format!("/etc/tau/services/{}.tau", service_name));
        if service_path.exists() {
            fs::remove_file(&service_path)?;
        }
        
        // Remove security profile
        self.sandbox_manager.remove_security_profile(service_name)?;
        
        info!("Unregistered service: {}", service_name);
        Ok(())
    }
    
    fn create_post_install_hook(&self, package_name: &str, services: &HashMap<String, String>) -> Result<()> {
        let hook_path = self.hooks_dir.join(format!("{}.post-install", package_name));
        
        let mut hook_content = String::new();
        hook_content.push_str("#!/bin/sh\n");
        hook_content.push_str("# TauPkg post-install hook for package: ");
        hook_content.push_str(package_name);
        hook_content.push_str("\n\n");
        
        // Enable services if they should be enabled by default
        for service_name in services.keys() {
            hook_content.push_str(&format!("tau-service enable {}\n", service_name));
        }
        
        // Start services if they should be started by default
        for service_name in services.keys() {
            hook_content.push_str(&format!("tau-service start {}\n", service_name));
        }
        
        fs::write(&hook_path, hook_content)?;
        
        // Make hook executable
        use std::os::unix::fs::PermissionsExt;
        let mut perms = fs::metadata(&hook_path)?.permissions();
        perms.set_mode(0o755);
        fs::set_permissions(&hook_path, perms)?;
        
        info!("Created post-install hook for package: {}", package_name);
        Ok(())
    }
    
    fn create_post_remove_hook(&self, package_name: &str, services: &HashMap<String, String>) -> Result<()> {
        let hook_path = self.hooks_dir.join(format!("{}.post-remove", package_name));
        
        let mut hook_content = String::new();
        hook_content.push_str("#!/bin/sh\n");
        hook_content.push_str("# TauPkg post-remove hook for package: ");
        hook_content.push_str(package_name);
        hook_content.push_str("\n\n");
        
        // Stop and disable services
        for service_name in services.keys() {
            hook_content.push_str(&format!("tau-service stop {}\n", service_name));
            hook_content.push_str(&format!("tau-service disable {}\n", service_name));
        }
        
        fs::write(&hook_path, hook_content)?;
        
        // Make hook executable
        use std::os::unix::fs::PermissionsExt;
        let mut perms = fs::metadata(&hook_path)?.permissions();
        perms.set_mode(0o755);
        fs::set_permissions(&hook_path, perms)?;
        
        info!("Created post-remove hook for package: {}", package_name);
        Ok(())
    }
    
    fn get_package_services(&self, package_name: &str) -> Result<Vec<String>> {
        let mut services = Vec::new();
        
        // Check for services registered by this package
        let services_dir = PathBuf::from("/etc/tau/services");
        if services_dir.exists() {
            for entry in fs::read_dir(&services_dir)? {
                let entry = entry?;
                let path = entry.path();
                
                if path.is_file() && path.extension().map_or(false, |ext| ext == "tau") {
                    // Check if this service belongs to the package
                    if let Ok(content) = fs::read_to_string(&path) {
                        if content.contains(&format!("package = \"{}\"", package_name)) {
                            if let Some(service_name) = path.file_stem() {
                                services.push(service_name.to_string_lossy().to_string());
                            }
                        }
                    }
                }
            }
        }
        
        Ok(services)
    }
    
    pub fn list_package_services(&self, package_name: &str) -> Result<Vec<String>> {
        self.get_package_services(package_name)
    }
    
    pub fn auto_enable_services(&self, package_name: &str) -> Result<()> {
        let services = self.get_package_services(package_name)?;
        
        for service_name in services {
            info!("Auto-enabling service: {}", service_name);
            self.service_manager.enable_service(&service_name)?;
        }
        
        Ok(())
    }
    
    pub fn auto_disable_services(&self, package_name: &str) -> Result<()> {
        let services = self.get_package_services(package_name)?;
        
        for service_name in services {
            info!("Auto-disabling service: {}", service_name);
            self.service_manager.disable_service(&service_name)?;
        }
        
        Ok(())
    }
} 