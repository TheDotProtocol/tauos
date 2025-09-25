use anyhow::Result;
use log::info;
use std::path::Path;

/// Run manager
pub struct RunManager;

impl RunManager {
    pub fn new(_project_path: &Path, _manifest: &crate::manifest::AppManifest) -> Self {
        Self
    }
    
    pub async fn run_app(&self, _args: &[String]) -> Result<()> {
        info!("Running application");
        Ok(())
    }
} 