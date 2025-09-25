use crate::metadata::{TauPkgManifest, PackageInfo, DependencyGraph, MetadataError, Dependency};
use crate::signature::{SignatureVerifier, SignatureError};
use crate::repo::Repository;
use anyhow::{Result, Context};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};
use tar::Archive;
use flate2::read::GzDecoder;
use walkdir::WalkDir;
use log::{info, warn, error};

#[derive(Debug)]
pub struct InstallationState {
    pub package_name: String,
    pub version: String,
    pub install_path: PathBuf,
    pub backup_path: Option<PathBuf>,
    pub dependencies: Vec<String>,
    pub timestamp: u64,
}

#[derive(Debug)]
pub struct PackageManager {
    pub dependency_graph: DependencyGraph,
    pub signature_verifier: SignatureVerifier,
    pub repository: Repository,
    pub install_root: PathBuf,
    pub state_file: PathBuf,
    pub backup_dir: PathBuf,
}

impl PackageManager {
    pub fn new(install_root: PathBuf) -> Result<Self> {
        let state_file = install_root.join("var/lib/tau-pkg/state.json");
        let backup_dir = install_root.join("var/lib/tau-pkg/backups");
        
        // Ensure directories exist
        fs::create_dir_all(&backup_dir)
            .context("Failed to create backup directory")?;
        fs::create_dir_all(state_file.parent().unwrap())
            .context("Failed to create state directory")?;
        
        let mut pm = Self {
            dependency_graph: DependencyGraph::new(),
            signature_verifier: SignatureVerifier::new(),
            repository: Repository::new(),
            install_root,
            state_file,
            backup_dir,
        };
        
        // Load trusted keys
        let trusted_keys_path = PathBuf::from("/etc/tau-pkg/trusted-keys");
        if trusted_keys_path.exists() {
            pm.signature_verifier.load_trusted_keys_from_file(&trusted_keys_path)
                .context("Failed to load trusted keys")?;
        }
        
        // Load existing state
        pm.load_state()?;
        
        Ok(pm)
    }
    
    pub fn install_package(&mut self, package_name: &str) -> Result<()> {
        info!("Installing package: {}", package_name);
        
        // Create installation state for rollback
        let mut install_state = InstallationState {
            package_name: package_name.to_string(),
            version: String::new(),
            install_path: PathBuf::new(),
            backup_path: None,
            dependencies: Vec::new(),
            timestamp: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
        };
        
        // Step 1: Download and verify package
        let package_data = self.repository.download_package(package_name)
            .context("Failed to download package")?;
        
        let manifest = self.extract_and_verify_manifest(&package_data, package_name)
            .context("Failed to extract and verify manifest")?;
        
        install_state.version = manifest.version.clone();
        
        // Step 2: Resolve dependencies
        let dependencies = self.resolve_dependencies(&manifest)
            .context("Failed to resolve dependencies")?;
        
        install_state.dependencies = dependencies.clone();
        
        // Step 3: Install dependencies first
        for dep_name in &dependencies {
            if !self.is_package_installed(dep_name) {
                info!("Installing dependency: {}", dep_name);
                self.install_package(dep_name)
                    .context(format!("Failed to install dependency: {}", dep_name))?;
            }
        }
        
        // Step 4: Backup existing installation if present
        let install_path = self.get_package_install_path(package_name);
        if install_path.exists() {
            let backup_path = self.create_backup(&install_path, package_name)
                .context("Failed to create backup")?;
            install_state.backup_path = Some(backup_path);
        }
        
        // Step 5: Install the package
        self.extract_package(&package_data, &install_path)
            .context("Failed to extract package")?;
        
        install_state.install_path = install_path.clone();
        
        // Step 6: Update package state
        let package_info = PackageInfo {
            manifest,
            installed: true,
            install_path: Some(install_path.to_string_lossy().to_string()),
            install_date: Some(install_state.timestamp.to_string()),
        };
        
        self.dependency_graph.add_package(package_info);
        self.save_state()
            .context("Failed to save package state")?;
        
        info!("Successfully installed package: {}", package_name);
        Ok(())
    }
    
    pub fn remove_package(&mut self, package_name: &str) -> Result<()> {
        info!("Removing package: {}", package_name);
        
        // Check if package is installed
        if !self.is_package_installed(package_name) {
            return Err(anyhow::anyhow!("Package {} is not installed", package_name));
        }
        
        // Check for reverse dependencies
        let reverse_deps = self.get_reverse_dependencies(package_name);
        if !reverse_deps.is_empty() {
            warn!("Package {} is required by: {:?}", package_name, reverse_deps);
            return Err(anyhow::anyhow!("Cannot remove package {}: it is required by other packages", package_name));
        }
        
        // Remove package files
        let install_path = self.get_package_install_path(package_name);
        if install_path.exists() {
            fs::remove_dir_all(&install_path)
                .context("Failed to remove package files")?;
        }
        
        // Update state
        self.dependency_graph.packages.remove(package_name);
        self.save_state()
            .context("Failed to save package state")?;
        
        info!("Successfully removed package: {}", package_name);
        Ok(())
    }
    
    pub fn rollback_installation(&mut self, package_name: &str) -> Result<()> {
        info!("Rolling back installation of package: {}", package_name);
        
        let install_path = self.get_package_install_path(package_name);
        let backup_path = self.backup_dir.join(format!("{}.backup", package_name));
        
        if !backup_path.exists() {
            return Err(anyhow::anyhow!("No backup found for package {}", package_name));
        }
        
        // Remove current installation
        if install_path.exists() {
            fs::remove_dir_all(&install_path)
                .context("Failed to remove current installation")?;
        }
        
        // Restore from backup
        fs::rename(&backup_path, &install_path)
            .context("Failed to restore from backup")?;
        
        info!("Successfully rolled back package: {}", package_name);
        Ok(())
    }
    
    fn resolve_dependencies(&self, manifest: &TauPkgManifest) -> Result<Vec<String>> {
        let mut resolved = Vec::new();
        
        if let Some(dependencies) = &manifest.dependencies {
            for dep in dependencies {
                resolved.push(dep.name.clone());
            }
        }
        
        // Add optional dependencies that are available
        if let Some(optional_deps) = &manifest.optional_dependencies {
            for dep in optional_deps {
                if self.repository.package_exists(&dep.name) {
                    resolved.push(dep.name.clone());
                }
            }
        }
        
        Ok(resolved)
    }
    
    fn extract_and_verify_manifest(&self, package_data: &[u8], package_name: &str) -> Result<TauPkgManifest> {
        // Extract manifest from package
        let mut archive = Archive::new(GzDecoder::new(package_data));
        
        for entry in archive.entries()
            .context("Failed to read package archive")? {
            let mut entry = entry.context("Failed to read archive entry")?;
            let path = entry.path().context("Failed to get entry path")?;
            
            if path.to_string_lossy().ends_with("manifest.toml") {
                let mut content = String::new();
                entry.read_to_string(&mut content)
                    .context("Failed to read manifest content")?;
                
                let manifest = TauPkgManifest::from_toml(&content)
                    .context("Failed to parse manifest")?;
                
                // Verify manifest
                manifest.validate()
                    .context("Invalid manifest")?;
                
                // Verify package signature if present
                if let Some(signature) = &manifest.signature {
                    let is_valid = self.signature_verifier.verify_package_signature(signature, package_data)
                        .context("Failed to verify package signature")?;
                    
                    if !is_valid {
                        return Err(anyhow::anyhow!("Package signature verification failed"));
                    }
                }
                
                return Ok(manifest);
            }
        }
        
        Err(anyhow::anyhow!("No manifest found in package"))
    }
    
    fn extract_package(&self, package_data: &[u8], install_path: &Path) -> Result<()> {
        fs::create_dir_all(install_path)
            .context("Failed to create install directory")?;
        
        let mut archive = Archive::new(GzDecoder::new(package_data));
        archive.unpack(install_path)
            .context("Failed to extract package")?;
        
        Ok(())
    }
    
    fn create_backup(&self, install_path: &Path, package_name: &str) -> Result<PathBuf> {
        let backup_path = self.backup_dir.join(format!("{}.backup", package_name));
        
        if backup_path.exists() {
            fs::remove_dir_all(&backup_path)
                .context("Failed to remove existing backup")?;
        }
        
        fs::rename(install_path, &backup_path)
            .context("Failed to create backup")?;
        
        Ok(backup_path)
    }
    
    fn get_package_install_path(&self, package_name: &str) -> PathBuf {
        self.install_root.join("usr/local/packages").join(package_name)
    }
    
    fn is_package_installed(&self, package_name: &str) -> bool {
        self.dependency_graph.packages.contains_key(package_name)
    }
    
    fn get_reverse_dependencies(&self, package_name: &str) -> Vec<String> {
        let mut reverse_deps = Vec::new();
        
        for (pkg_name, deps) in &self.dependency_graph.dependencies {
            if deps.contains(&package_name.to_string()) {
                reverse_deps.push(pkg_name.clone());
            }
        }
        
        reverse_deps
    }
    
    fn load_state(&mut self) -> Result<()> {
        if self.state_file.exists() {
            let content = fs::read_to_string(&self.state_file)
                .context("Failed to read state file")?;
            
            let state: HashMap<String, PackageInfo> = serde_json::from_str(&content)
                .context("Failed to parse state file")?;
            
            for (name, package_info) in state {
                self.dependency_graph.add_package(package_info);
            }
        }
        
        Ok(())
    }
    
    fn save_state(&self) -> Result<()> {
        let state: HashMap<String, PackageInfo> = self.dependency_graph.packages.clone();
        let content = serde_json::to_string_pretty(&state)
            .context("Failed to serialize state")?;
        
        fs::write(&self.state_file, content)
            .context("Failed to write state file")?;
        
        Ok(())
    }
} 