use std::path::Path;
use std::fs;
use std::process::Command;
use anyhow::Result;
use log::{info, warn, error};
use tempfile::TempDir;

use crate::config::UpdateConfig;
use crate::update_manifest::{UpdateInfo, UpdatePackage};

pub struct UpdateApplier {
    config: UpdateConfig,
}

impl UpdateApplier {
    pub fn new(config: UpdateConfig) -> Self {
        Self { config }
    }
    
    pub async fn apply_update(&self, update_info: &UpdateInfo, progress: &mut f32) -> Result<()> {
        info!("Applying update: {}", update_info.version);
        
        // Create backup
        self.create_backup(update_info).await?;
        *progress = 10.0;
        
        // Stop relevant services
        self.stop_services().await?;
        *progress = 20.0;
        
        // Extract update package
        self.extract_update_package(update_info).await?;
        *progress = 40.0;
        
        // Apply package updates
        self.apply_package_updates(&update_info.manifest.packages).await?;
        *progress = 70.0;
        
        // Update system configuration
        self.update_system_config(update_info).await?;
        *progress = 85.0;
        
        // Restart services
        self.restart_services().await?;
        *progress = 95.0;
        
        // Mark update as applied
        self.mark_update_applied(update_info).await?;
        *progress = 100.0;
        
        info!("Update applied successfully");
        Ok(())
    }
    
    async fn create_backup(&self, update_info: &UpdateInfo) -> Result<()> {
        info!("Creating system backup");
        
        let backup_dir = Path::new(&self.config.backup_dir);
        fs::create_dir_all(backup_dir)?;
        
        let backup_name = format!("backup-{}-{}", 
                                self.config.current_version, 
                                chrono::Utc::now().format("%Y%m%d-%H%M%S"));
        let backup_path = backup_dir.join(&backup_name);
        
        // Create backup using tar
        let output = Command::new("tar")
            .args(&["-czf", &backup_path.to_string_lossy(), "-C", "/", "."])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to create backup: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        info!("Backup created: {}", backup_path.display());
        Ok(())
    }
    
    async fn stop_services(&self) -> Result<()> {
        info!("Stopping system services");
        
        let services_to_stop = vec![
            "tau-sessiond",
            "tau-powerd", 
            "tau-inputd",
            "tau-displaysvc",
            "tau-store",
        ];
        
        for service in services_to_stop {
            let _ = Command::new("systemctl")
                .args(&["stop", service])
                .output();
        }
        
        info!("Services stopped");
        Ok(())
    }
    
    async fn extract_update_package(&self, update_info: &UpdateInfo) -> Result<()> {
        info!("Extracting update package");
        
        let package_path = Path::new(&self.config.download_dir)
            .join(format!("update-{}.tauupd", update_info.version));
        
        let extract_dir = Path::new(&self.config.temp_dir);
        fs::create_dir_all(extract_dir)?;
        
        // Extract the update package (assuming it's a tar.gz)
        let output = Command::new("tar")
            .args(&["-xzf", &package_path.to_string_lossy(), "-C", &extract_dir.to_string_lossy()])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to extract update package: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        info!("Update package extracted");
        Ok(())
    }
    
    async fn apply_package_updates(&self, packages: &[UpdatePackage]) -> Result<()> {
        info!("Applying package updates");
        
        for package in packages {
            self.apply_single_package(package).await?;
        }
        
        info!("Package updates applied");
        Ok(())
    }
    
    async fn apply_single_package(&self, package: &UpdatePackage) -> Result<()> {
        info!("Applying package: {} {}", package.name, package.version);
        
        let temp_dir = Path::new(&self.config.temp_dir);
        let package_file = temp_dir.join(&package.name);
        
        if !package_file.exists() {
            return Err(anyhow::anyhow!("Package file not found: {}", package_file.display()));
        }
        
        // Backup existing file if it exists
        let install_path = Path::new(&package.install_path);
        if install_path.exists() {
            let backup_path = format!("{}.backup", package.install_path);
            fs::copy(install_path, &backup_path)?;
        }
        
        // Install the new package
        fs::copy(&package_file, install_path)?;
        
        // Set proper permissions
        let _ = Command::new("chmod")
            .args(&["755", &package.install_path])
            .output();
        
        info!("Package {} applied successfully", package.name);
        Ok(())
    }
    
    async fn update_system_config(&self, update_info: &UpdateInfo) -> Result<()> {
        info!("Updating system configuration");
        
        // Update version information
        let version_file = Path::new("/etc/tau/version");
        fs::write(version_file, &update_info.version)?;
        
        // Update package database
        let package_db = Path::new("/var/lib/tau/pkg/db");
        if package_db.exists() {
            // Update package database with new versions
            self.update_package_database(&update_info.manifest.packages).await?;
        }
        
        // Update boot configuration if needed
        if update_info.requires_reboot() {
            self.update_boot_config().await?;
        }
        
        info!("System configuration updated");
        Ok(())
    }
    
    async fn update_package_database(&self, packages: &[UpdatePackage]) -> Result<()> {
        // Update the package database with new package information
        // This would typically involve updating a SQLite database or similar
        
        for package in packages {
            // Update package entry in database
            info!("Updating package database entry for: {}", package.name);
        }
        
        Ok(())
    }
    
    async fn update_boot_config(&self) -> Result<()> {
        info!("Updating boot configuration");
        
        // Update GRUB or U-Boot configuration
        // This would involve updating bootloader configuration files
        
        Ok(())
    }
    
    async fn restart_services(&self) -> Result<()> {
        info!("Restarting system services");
        
        let services_to_start = vec![
            "tau-sessiond",
            "tau-powerd",
            "tau-inputd", 
            "tau-displaysvc",
            "tau-store",
        ];
        
        for service in services_to_start {
            let _ = Command::new("systemctl")
                .args(&["start", service])
                .output();
        }
        
        info!("Services restarted");
        Ok(())
    }
    
    async fn mark_update_applied(&self, update_info: &UpdateInfo) -> Result<()> {
        info!("Marking update as applied");
        
        // Create a marker file indicating the update was applied
        let marker_file = Path::new("/var/lib/tau/upd/applied");
        fs::create_dir_all(marker_file.parent().unwrap())?;
        
        let marker_content = format!("version={}\ndate={}\n", 
                                   update_info.version,
                                   chrono::Utc::now().to_rfc3339());
        fs::write(marker_file, marker_content)?;
        
        // Clean up temporary files
        self.cleanup_temp_files().await?;
        
        info!("Update marked as applied");
        Ok(())
    }
    
    async fn cleanup_temp_files(&self) -> Result<()> {
        info!("Cleaning up temporary files");
        
        let temp_dir = Path::new(&self.config.temp_dir);
        if temp_dir.exists() {
            fs::remove_dir_all(temp_dir)?;
        }
        
        Ok(())
    }
    
    pub async fn rollback_update(&self) -> Result<()> {
        info!("Rolling back update");
        
        // Check if rollback is supported
        let applied_marker = Path::new("/var/lib/tau/upd/applied");
        if !applied_marker.exists() {
            return Err(anyhow::anyhow!("No update to rollback"));
        }
        
        // Stop services
        self.stop_services().await?;
        
        // Restore from backup
        self.restore_from_backup().await?;
        
        // Restart services
        self.restart_services().await?;
        
        // Remove applied marker
        fs::remove_file(applied_marker)?;
        
        info!("Rollback completed successfully");
        Ok(())
    }
    
    async fn restore_from_backup(&self) -> Result<()> {
        info!("Restoring from backup");
        
        let backup_dir = Path::new(&self.config.backup_dir);
        if !backup_dir.exists() {
            return Err(anyhow::anyhow!("Backup directory not found"));
        }
        
        // Find the most recent backup
        let mut backups = Vec::new();
        for entry in fs::read_dir(backup_dir)? {
            if let Ok(entry) = entry {
                if let Some(name) = entry.file_name().to_str() {
                    if name.starts_with("backup-") {
                        backups.push(entry.path());
                    }
                }
            }
        }
        
        if backups.is_empty() {
            return Err(anyhow::anyhow!("No backup found"));
        }
        
        // Sort by modification time and get the most recent
        backups.sort_by(|a, b| {
            fs::metadata(b).unwrap_or_default().modified().unwrap_or_default()
                .cmp(&fs::metadata(a).unwrap_or_default().modified().unwrap_or_default())
        });
        
        let latest_backup = &backups[0];
        
        // Restore from backup
        let output = Command::new("tar")
            .args(&["-xzf", &latest_backup.to_string_lossy(), "-C", "/"])
            .output()?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to restore from backup: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        info!("System restored from backup: {}", latest_backup.display());
        Ok(())
    }
    
    pub async fn check_update_status(&self) -> Result<Option<String>> {
        let applied_marker = Path::new("/var/lib/tau/upd/applied");
        
        if applied_marker.exists() {
            if let Ok(content) = fs::read_to_string(applied_marker) {
                for line in content.lines() {
                    if line.starts_with("version=") {
                        return Ok(Some(line.strip_prefix("version=").unwrap_or("").to_string()));
                    }
                }
            }
        }
        
        Ok(None)
    }
} 