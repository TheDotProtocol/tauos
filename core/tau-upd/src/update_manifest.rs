use serde::{Deserialize, Serialize};
use anyhow::Result;
use log::{info, warn, error};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateManifest {
    pub version: String,
    pub release_date: chrono::DateTime<chrono::Utc>,
    pub description: String,
    pub changelog: String,
    pub size_bytes: u64,
    pub sha256_hash: String,
    pub signature: String,
    pub packages: Vec<UpdatePackage>,
    pub dependencies: Vec<String>,
    pub requires_reboot: bool,
    pub rollback_supported: bool,
    pub channel: String,
    pub priority: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdatePackage {
    pub name: String,
    pub version: String,
    pub size_bytes: u64,
    pub sha256_hash: String,
    pub delta_from: Option<String>,
    pub install_path: String,
    pub backup_path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateInfo {
    pub version: String,
    pub manifest: UpdateManifest,
    pub download_url: String,
    pub size_bytes: u64,
    pub is_delta: bool,
    pub base_version: Option<String>,
}

impl UpdateManifest {
    pub fn from_json(json: &str) -> Result<Self> {
        let manifest: UpdateManifest = serde_json::from_str(json)?;
        Ok(manifest)
    }
    
    pub fn to_json(&self) -> Result<String> {
        let json = serde_json::to_string_pretty(self)?;
        Ok(json)
    }
    
    pub fn verify_signature(&self, public_key: &str) -> Result<bool> {
        // In a real implementation, this would verify the signature using the public key
        // For now, we'll simulate signature verification
        info!("Verifying update manifest signature for version: {}", self.version);
        
        // Mock verification - in real implementation this would use cryptographic verification
        if self.signature.is_empty() {
            return Err(anyhow::anyhow!("No signature provided"));
        }
        
        // Simulate signature verification
        Ok(true)
    }
    
    pub fn calculate_total_size(&self) -> u64 {
        self.packages.iter().map(|pkg| pkg.size_bytes).sum()
    }
    
    pub fn get_package_by_name(&self, name: &str) -> Option<&UpdatePackage> {
        self.packages.iter().find(|pkg| pkg.name == name)
    }
    
    pub fn is_compatible_with(&self, current_version: &str) -> bool {
        // Check if this update is compatible with the current version
        // This could include version range checks, dependency checks, etc.
        
        // For now, we'll do a simple version comparison
        // In a real implementation, this would use proper semantic versioning
        if let Some(current) = self.dependencies.iter().find(|dep| dep.starts_with("tau-os=")) {
            let required_version = current.strip_prefix("tau-os=").unwrap_or("");
            info!("Checking compatibility: current={}, required={}", current_version, required_version);
            
            // Simple version check - in real implementation use proper semver
            current_version != required_version
        } else {
            // No specific version requirement, assume compatible
            true
        }
    }
}

impl UpdateInfo {
    pub fn new(version: String, manifest: UpdateManifest, download_url: String) -> Self {
        let size_bytes = manifest.calculate_total_size();
        let is_delta = manifest.packages.iter().any(|pkg| pkg.delta_from.is_some());
        let base_version = if is_delta {
            manifest.packages.iter()
                .find_map(|pkg| pkg.delta_from.clone())
        } else {
            None
        };
        
        Self {
            version,
            manifest,
            download_url,
            size_bytes,
            is_delta,
            base_version,
        }
    }
    
    pub fn is_delta_update(&self) -> bool {
        self.is_delta
    }
    
    pub fn get_delta_base_version(&self) -> Option<&String> {
        self.base_version.as_ref()
    }
    
    pub fn get_download_size_mb(&self) -> f64 {
        self.size_bytes as f64 / (1024.0 * 1024.0)
    }
    
    pub fn requires_reboot(&self) -> bool {
        self.manifest.requires_reboot
    }
    
    pub fn supports_rollback(&self) -> bool {
        self.manifest.rollback_supported
    }
}

impl UpdatePackage {
    pub fn new(name: String, version: String, size_bytes: u64, install_path: String) -> Self {
        Self {
            name,
            version,
            size_bytes,
            sha256_hash: String::new(),
            delta_from: None,
            install_path,
            backup_path: None,
        }
    }
    
    pub fn with_delta(mut self, delta_from: String) -> Self {
        self.delta_from = Some(delta_from);
        self
    }
    
    pub fn with_backup(mut self, backup_path: String) -> Self {
        self.backup_path = Some(backup_path);
        self
    }
    
    pub fn is_delta_package(&self) -> bool {
        self.delta_from.is_some()
    }
    
    pub fn get_size_mb(&self) -> f64 {
        self.size_bytes as f64 / (1024.0 * 1024.0)
    }
} 