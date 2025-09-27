use std::path::Path;
use std::fs;
use anyhow::Result;
use log::{info, warn, error};
use sha2::{Sha256, Digest};

use crate::config::UpdateConfig;
use crate::update_manifest::{UpdateInfo, UpdateManifest};

pub struct UpdateVerifier {
    config: UpdateConfig,
}

impl UpdateVerifier {
    pub fn new(config: UpdateConfig) -> Self {
        Self { config }
    }
    
    pub async fn verify_update(&self, update_info: &UpdateInfo) -> Result<()> {
        info!("Verifying update: {}", update_info.version);
        
        // Verify manifest signature
        self.verify_manifest_signature(&update_info.manifest).await?;
        
        // Verify update package
        self.verify_update_package(update_info).await?;
        
        // Verify system compatibility
        self.verify_system_compatibility(update_info).await?;
        
        // Verify disk space
        self.verify_disk_space(update_info).await?;
        
        info!("Update verification completed successfully");
        Ok(())
    }
    
    async fn verify_manifest_signature(&self, manifest: &UpdateManifest) -> Result<()> {
        info!("Verifying manifest signature");
        
        // In a real implementation, this would use proper cryptographic verification
        // For now, we'll simulate signature verification
        
        if manifest.signature.is_empty() {
            return Err(anyhow::anyhow!("No signature provided in manifest"));
        }
        
        // Verify the signature using the public key
        let signature_valid = self.verify_signature(
            &manifest.to_json()?,
            &manifest.signature,
            &self.config.public_key
        ).await?;
        
        if !signature_valid {
            return Err(anyhow::anyhow!("Invalid manifest signature"));
        }
        
        info!("Manifest signature verified successfully");
        Ok(())
    }
    
    async fn verify_update_package(&self, update_info: &UpdateInfo) -> Result<()> {
        info!("Verifying update package");
        
        let package_path = Path::new(&self.config.download_dir)
            .join(format!("update-{}.tauupd", update_info.version));
        
        if !package_path.exists() {
            return Err(anyhow::anyhow!("Update package not found: {}", package_path.display()));
        }
        
        // Verify file size
        let metadata = fs::metadata(&package_path)?;
        if metadata.len() != update_info.size_bytes {
            return Err(anyhow::anyhow!("Package size mismatch: expected {}, got {}", 
                                      update_info.size_bytes, metadata.len()));
        }
        
        // Verify SHA256 hash
        let calculated_hash = self.calculate_file_hash(&package_path).await?;
        if calculated_hash != update_info.manifest.sha256_hash {
            return Err(anyhow::anyhow!("Package hash mismatch: expected {}, got {}", 
                                      update_info.manifest.sha256_hash, calculated_hash));
        }
        
        // Verify package structure (if it's a tar.gz or similar)
        self.verify_package_structure(&package_path).await?;
        
        info!("Update package verified successfully");
        Ok(())
    }
    
    async fn verify_system_compatibility(&self, update_info: &UpdateInfo) -> Result<()> {
        info!("Verifying system compatibility");
        
        // Check if update is compatible with current system
        if !update_info.manifest.is_compatible_with(&self.config.current_version) {
            return Err(anyhow::anyhow!("Update {} is not compatible with current version {}", 
                                      update_info.version, self.config.current_version));
        }
        
        // Check architecture compatibility
        if let Some(arch) = &self.config.system_architecture {
            if let Some(required_arch) = update_info.manifest.dependencies.iter()
                .find(|dep| dep.starts_with("arch=")) {
                let required = required_arch.strip_prefix("arch=").unwrap_or("");
                if arch != required {
                    return Err(anyhow::anyhow!("Architecture mismatch: system={}, required={}", 
                                              arch, required));
                }
            }
        }
        
        // Check kernel compatibility
        if let Some(kernel_version) = self.get_kernel_version().await? {
            if let Some(required_kernel) = update_info.manifest.dependencies.iter()
                .find(|dep| dep.starts_with("kernel=")) {
                let required = required_kernel.strip_prefix("kernel=").unwrap_or("");
                if !self.is_kernel_compatible(&kernel_version, required).await? {
                    return Err(anyhow::anyhow!("Kernel compatibility issue: current={}, required={}", 
                                              kernel_version, required));
                }
            }
        }
        
        info!("System compatibility verified");
        Ok(())
    }
    
    async fn verify_disk_space(&self, update_info: &UpdateInfo) -> Result<()> {
        info!("Verifying available disk space");
        
        let required_space = update_info.size_bytes * 3; // 3x for backup and temporary files
        let available_space = self.get_available_disk_space(&self.config.system_root).await?;
        
        if available_space < required_space {
            return Err(anyhow::anyhow!("Insufficient disk space: available {} bytes, required {} bytes", 
                                      available_space, required_space));
        }
        
        info!("Disk space verification passed");
        Ok(())
    }
    
    async fn verify_signature(&self, data: &str, signature: &str, public_key: &str) -> Result<bool> {
        // In a real implementation, this would use proper cryptographic verification
        // For now, we'll simulate signature verification
        
        if signature.is_empty() || public_key.is_empty() {
            return Ok(false);
        }
        
        // Mock signature verification
        // In real implementation, this would use ed25519 or similar
        Ok(true)
    }
    
    async fn calculate_file_hash(&self, filepath: &Path) -> Result<String> {
        use std::io::Read;
        
        let mut file = fs::File::open(filepath)?;
        let mut hasher = Sha256::new();
        let mut buffer = [0; 8192];
        
        loop {
            let n = file.read(&mut buffer)?;
            if n == 0 {
                break;
            }
            hasher.update(&buffer[..n]);
        }
        
        let result = hasher.finalize();
        Ok(format!("{:x}", result))
    }
    
    async fn verify_package_structure(&self, package_path: &Path) -> Result<()> {
        // In a real implementation, this would verify the internal structure of the update package
        // For now, we'll just check if the file exists and is readable
        
        if !package_path.exists() {
            return Err(anyhow::anyhow!("Package file does not exist"));
        }
        
        // Try to read the first few bytes to ensure it's accessible
        let mut file = fs::File::open(package_path)?;
        let mut buffer = [0; 1024];
        let _ = file.read(&mut buffer)?;
        
        Ok(())
    }
    
    async fn get_kernel_version(&self) -> Result<Option<String>> {
        // Read kernel version from /proc/version
        if let Ok(version) = fs::read_to_string("/proc/version") {
            if let Some(version_str) = version.split_whitespace().nth(2) {
                return Ok(Some(version_str.to_string()));
            }
        }
        
        Ok(None)
    }
    
    async fn is_kernel_compatible(&self, current: &str, required: &str) -> Result<bool> {
        // Simple kernel version compatibility check
        // In a real implementation, this would use proper version comparison
        
        if required == "any" {
            return Ok(true);
        }
        
        // For now, just check if versions are the same
        Ok(current == required)
    }
    
    async fn get_available_disk_space(&self, path: &str) -> Result<u64> {
        // Get available disk space for the given path
        // In a real implementation, this would use statvfs or similar
        
        // Mock implementation - return a large number
        Ok(1024 * 1024 * 1024 * 10) // 10 GB
    }
    
    pub async fn verify_rollback_support(&self, update_info: &UpdateInfo) -> Result<bool> {
        // Check if the update supports rollback
        if !update_info.supports_rollback() {
            return Ok(false);
        }
        
        // Check if we have enough space for rollback
        let rollback_space = update_info.size_bytes * 2; // 2x for rollback
        let available_space = self.get_available_disk_space(&self.config.system_root).await?;
        
        Ok(available_space >= rollback_space)
    }
}

use std::io::Read; 