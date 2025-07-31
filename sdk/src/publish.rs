use crate::manifest::AppManifest;
use crate::package::PackageManager;
use anyhow::{Result, anyhow};
use log::{info, warn, error};
use std::path::{Path, PathBuf};
use std::collections::HashMap;
use reqwest::Client;
use serde::{Deserialize, Serialize};

/// TauStore API client
pub struct TauStoreClient {
    base_url: String,
    api_key: Option<String>,
    client: Client,
}

/// Publish manager for Tau applications
pub struct PublishManager {
    project_path: PathBuf,
    manifest: AppManifest,
    store_client: TauStoreClient,
}

// API response and request structs
#[derive(Debug, Serialize, Deserialize)]
pub struct TauStoreResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UploadRequest {
    pub metadata: AppMetadata,
    pub api_key: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppMetadata {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: String,
    pub author: String,
    pub category: String,
    pub tags: Vec<String>,
    pub screenshots: Vec<String>,
    pub website: Option<String>,
    pub repository: Option<String>,
    pub support: Option<String>,
}

impl TauStoreClient {
    pub fn new(base_url: String, api_key: Option<String>) -> Self {
        Self {
            base_url,
            api_key,
            client: Client::new(),
        }
    }

    /// Upload app to TauStore
    pub async fn upload_app(&self, package_path: &Path, metadata: &UploadRequest) -> Result<AppMetadata> {
        let url = format!("{}/api/v1/apps/upload", self.base_url);
        
        // Create multipart form
        let mut form = reqwest::multipart::Form::new()
            .text("metadata", serde_json::to_string(metadata)?);
        
        // Add file to form
        let file_content = std::fs::read(package_path)?;
        let file_part = reqwest::multipart::Part::bytes(file_content)
            .file_name(package_path.file_name().unwrap().to_string_lossy().to_string());
        form = form.part("package", file_part);
        
        // Add API key if available
        if let Some(ref api_key) = self.api_key {
            form = form.text("api_key", api_key.clone());
        }
        
        let response = self.client
            .post(&url)
            .multipart(form)
            .send()
            .await?;
        
        if response.status().is_success() {
            let response_data: TauStoreResponse<AppMetadata> = response.json().await?;
            if response_data.success {
                response_data.data.ok_or_else(|| anyhow!("No data in response"))
            } else {
                Err(anyhow!("Upload failed: {}", response_data.error.unwrap_or_default()))
            }
        } else {
            Err(anyhow!("Upload failed with status: {}", response.status()))
        }
    }

    /// Get app metadata
    pub async fn get_app_metadata(&self, app_id: &str) -> Result<AppMetadata> {
        let url = format!("{}/api/v1/apps/{}", self.base_url, app_id);
        
        let response = self.client
            .get(&url)
            .send()
            .await?;
        
        if response.status().is_success() {
            let response_data: TauStoreResponse<AppMetadata> = response.json().await?;
            if response_data.success {
                response_data.data.ok_or_else(|| anyhow!("No data in response"))
            } else {
                Err(anyhow!("Failed to get metadata: {}", response_data.error.unwrap_or_default()))
            }
        } else {
            Err(anyhow!("Failed to get metadata with status: {}", response.status()))
        }
    }

    /// Update app metadata
    pub async fn update_app_metadata(&self, app_id: &str, metadata: &AppMetadata) -> Result<AppMetadata> {
        let url = format!("{}/api/v1/apps/{}", self.base_url, app_id);
        
        let response = self.client
            .put(&url)
            .json(metadata)
            .send()
            .await?;
        
        if response.status().is_success() {
            let response_data: TauStoreResponse<AppMetadata> = response.json().await?;
            if response_data.success {
                response_data.data.ok_or_else(|| anyhow!("No data in response"))
            } else {
                Err(anyhow!("Update failed: {}", response_data.error.unwrap_or_default()))
            }
        } else {
            Err(anyhow!("Update failed with status: {}", response.status()))
        }
    }

    /// Delete app
    pub async fn delete_app(&self, app_id: &str, api_key: &str) -> Result<()> {
        let url = format!("{}/api/v1/apps/{}", self.base_url, app_id);
        
        let response = self.client
            .delete(&url)
            .header("Authorization", format!("Bearer {}", api_key))
            .send()
            .await?;
        
        if response.status().is_success() {
            Ok(())
        } else {
            Err(anyhow!("Delete failed with status: {}", response.status()))
        }
    }

    /// Search apps
    pub async fn search_apps(&self, query: &str) -> Result<Vec<AppMetadata>> {
        let url = format!("{}/api/v1/apps/search?q={}", self.base_url, query);
        
        let response = self.client
            .get(&url)
            .send()
            .await?;
        
        if response.status().is_success() {
            let response_data: TauStoreResponse<Vec<AppMetadata>> = response.json().await?;
            if response_data.success {
                response_data.data.ok_or_else(|| anyhow!("No data in response"))
            } else {
                Err(anyhow!("Search failed: {}", response_data.error.unwrap_or_default()))
            }
        } else {
            Err(anyhow!("Search failed with status: {}", response.status()))
        }
    }
}

impl PublishManager {
    pub fn new(project_path: &Path, manifest: &AppManifest) -> Self {
        Self {
            project_path: project_path.to_path_buf(),
            manifest: manifest.clone(),
            store_client: TauStoreClient::new(
                "https://taustore.tauos.dev".to_string(),
                None,
            ),
        }
    }

    /// Publish app to TauStore
    pub async fn publish_app(&mut self, _api_key: Option<String>) -> Result<()> {
        info!("Stub: Publishing app (not implemented in minimal SDK)");
        println!("⚠️  Publishing not implemented in minimal SDK");
        Ok(())
    }
    // All other methods are stubbed or commented out for the minimal SDK.
} 