use anyhow::{Result, anyhow};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

/// Basic application manifest
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: String,
    pub author: String,
    pub license: String,
}

impl AppManifest {
    pub fn validate_manifest(&self) -> Result<()> {
        if self.id.is_empty() {
            return Err(anyhow!("Application ID cannot be empty"));
        }
        if self.name.is_empty() {
            return Err(anyhow!("Application name cannot be empty"));
        }
        if self.version.is_empty() {
            return Err(anyhow!("Application version cannot be empty"));
        }
        Ok(())
    }
} 