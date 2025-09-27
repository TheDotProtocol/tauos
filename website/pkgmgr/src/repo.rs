use anyhow::{Result, Context};
use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use log::{info, warn};

#[derive(Debug, Serialize, Deserialize)]
pub struct RepositoryIndex {
    pub packages: HashMap<String, PackageMetadata>,
    pub last_updated: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PackageMetadata {
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub dependencies: Option<Vec<String>>,
    pub size: u64,
    pub checksum: String,
    pub download_url: String,
}

pub struct Repository {
    pub index: RepositoryIndex,
    pub cache_dir: PathBuf,
    pub index_url: String,
}

impl Repository {
    pub fn new() -> Self {
        let cache_dir = PathBuf::from("/var/cache/tau-pkg");
        let index_url = "https://packages.tauos.org/index.json".to_string();
        
        Self {
            index: RepositoryIndex {
                packages: HashMap::new(),
                last_updated: String::new(),
            },
            cache_dir,
            index_url,
        }
    }
    
    pub fn sync_repo(&mut self) -> Result<()> {
        info!("Syncing repository index...");
        
        let client = Client::new();
        let response = client.get(&self.index_url)
            .send()
            .context("Failed to fetch repository index")?;
        
        if !response.status().is_success() {
            return Err(anyhow::anyhow!("Failed to fetch repository index: {}", response.status()));
        }
        
        let index_data = response.text()
            .context("Failed to read repository index")?;
        
        self.index = serde_json::from_str(&index_data)
            .context("Failed to parse repository index")?;
        
        // Save index to cache
        fs::create_dir_all(&self.cache_dir)
            .context("Failed to create cache directory")?;
        
        let index_file = self.cache_dir.join("index.json");
        fs::write(&index_file, index_data)
            .context("Failed to save repository index")?;
        
        info!("Repository index synced successfully");
        Ok(())
    }
    
    pub fn search_repo(&self, query: &str) -> Vec<PackageMetadata> {
        let mut results = Vec::new();
        let query_lower = query.to_lowercase();
        
        for package in self.index.packages.values() {
            if package.name.to_lowercase().contains(&query_lower) ||
               package.description.as_ref().map_or(false, |desc| 
                   desc.to_lowercase().contains(&query_lower)) {
                results.push(package.clone());
            }
        }
        
        results
    }
    
    pub fn download_package(&self, package_name: &str) -> Result<Vec<u8>> {
        let package = self.index.packages.get(package_name)
            .ok_or_else(|| anyhow::anyhow!("Package {} not found in repository", package_name))?;
        
        info!("Downloading package: {} ({} bytes)", package_name, package.size);
        
        let client = Client::new();
        let response = client.get(&package.download_url)
            .send()
            .context("Failed to download package")?;
        
        if !response.status().is_success() {
            return Err(anyhow::anyhow!("Failed to download package: {}", response.status()));
        }
        
        let package_data = response.bytes()
            .context("Failed to read package data")?;
        
        // Verify checksum
        let calculated_checksum = sha2::Sha256::digest(&package_data);
        let expected_checksum = hex::decode(&package.checksum)
            .context("Invalid checksum format")?;
        
        if calculated_checksum.as_slice() != expected_checksum.as_slice() {
            return Err(anyhow::anyhow!("Package checksum verification failed"));
        }
        
        info!("Successfully downloaded package: {}", package_name);
        Ok(package_data.to_vec())
    }
    
    pub fn package_exists(&self, package_name: &str) -> bool {
        self.index.packages.contains_key(package_name)
    }
    
    pub fn get_package_metadata(&self, package_name: &str) -> Option<&PackageMetadata> {
        self.index.packages.get(package_name)
    }
    
    pub fn list_installed(&self) -> Vec<String> {
        // This would typically read from the package manager's state
        // For now, we'll return an empty vector
        Vec::new()
    }
    
    pub fn update_package(&self, package_name: &str) -> Result<()> {
        let package = self.index.packages.get(package_name)
            .ok_or_else(|| anyhow::anyhow!("Package {} not found in repository", package_name))?;
        
        info!("Updating package: {}", package_name);
        
        // Download and install the updated package
        let package_data = self.download_package(package_name)?;
        
        // The actual installation would be handled by the package manager
        // This is just a placeholder for the update logic
        
        info!("Successfully updated package: {}", package_name);
        Ok(())
    }
}

impl Clone for PackageMetadata {
    fn clone(&self) -> Self {
        Self {
            name: self.name.clone(),
            version: self.version.clone(),
            description: self.description.clone(),
            dependencies: self.dependencies.clone(),
            size: self.size,
            checksum: self.checksum.clone(),
            download_url: self.download_url.clone(),
        }
    }
} 