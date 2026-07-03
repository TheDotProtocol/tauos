use std::path::Path;
use std::fs;
use anyhow::Result;
use log::{info, warn, error};
use reqwest::Client;
use indicatif::{ProgressBar, ProgressStyle};

use crate::config::UpdateConfig;
use crate::update_manifest::UpdateInfo;

pub struct UpdateDownloader {
    config: UpdateConfig,
    http_client: Client,
}

impl UpdateDownloader {
    pub fn new(config: UpdateConfig) -> Self {
        let http_client = Client::builder()
            .timeout(std::time::Duration::from_secs(300)) // 5 minutes for large downloads
            .build()
            .unwrap_or_default();
        
        Self {
            config,
            http_client,
        }
    }
    
    pub async fn download_update(&self, update_info: &UpdateInfo, progress: &mut f32) -> Result<()> {
        info!("Downloading update: {} ({:.2} MB)", 
              update_info.version, update_info.get_download_size_mb());
        
        // Create download directory
        let download_dir = Path::new(&self.config.download_dir);
        fs::create_dir_all(download_dir)?;
        
        // Download the update package
        let filename = format!("update-{}.tauupd", update_info.version);
        let filepath = download_dir.join(&filename);
        
        // Check if file already exists and is complete
        if filepath.exists() {
            if let Ok(metadata) = fs::metadata(&filepath) {
                if metadata.len() == update_info.size_bytes {
                    info!("Update file already exists and is complete");
                    *progress = 100.0;
                    return Ok(());
                }
            }
        }
        
        // Download with progress tracking
        self.download_file_with_progress(&update_info.download_url, &filepath, progress).await?;
        
        // Verify downloaded file
        self.verify_downloaded_file(&filepath, update_info).await?;
        
        info!("Update downloaded successfully to: {}", filepath.display());
        Ok(())
    }
    
    async fn download_file_with_progress(&self, url: &str, filepath: &Path, progress: &mut f32) -> Result<()> {
        info!("Downloading from: {}", url);
        
        let response = self.http_client.get(url).send().await?;
        
        if !response.status().is_success() {
            return Err(anyhow::anyhow!("Failed to download: HTTP {}", response.status()));
        }
        
        let total_size = response.content_length().unwrap_or(0);
        let mut downloaded: u64 = 0;
        
        // Create progress bar
        let pb = ProgressBar::new(total_size);
        pb.set_style(ProgressStyle::default_bar()
            .template("{spinner:.green} [{elapsed_precise}] [{bar:40.cyan/blue}] {bytes}/{total_bytes} ({eta})")
            .unwrap()
            .progress_chars("#>-"));
        
        // Create file
        let mut file = fs::File::create(filepath)?;
        
        // Download with progress tracking
        let mut stream = response.bytes_stream();
        
        while let Some(chunk) = stream.next().await {
            let chunk = chunk?;
            file.write_all(&chunk)?;
            
            downloaded += chunk.len() as u64;
            
            // Update progress
            if total_size > 0 {
                *progress = (downloaded as f32 / total_size as f32) * 100.0;
                pb.set_position(downloaded);
            }
        }
        
        pb.finish_with_message("Download completed");
        Ok(())
    }
    
    async fn verify_downloaded_file(&self, filepath: &Path, update_info: &UpdateInfo) -> Result<()> {
        info!("Verifying downloaded file");
        
        // Check file size
        let metadata = fs::metadata(filepath)?;
        if metadata.len() != update_info.size_bytes {
            return Err(anyhow::anyhow!("File size mismatch: expected {}, got {}", 
                                      update_info.size_bytes, metadata.len()));
        }
        
        // Calculate SHA256 hash
        let calculated_hash = self.calculate_file_hash(filepath).await?;
        
        if calculated_hash != update_info.manifest.sha256_hash {
            return Err(anyhow::anyhow!("Hash mismatch: expected {}, got {}", 
                                      update_info.manifest.sha256_hash, calculated_hash));
        }
        
        info!("File verification successful");
        Ok(())
    }
    
    async fn calculate_file_hash(&self, filepath: &Path) -> Result<String> {
        use sha2::{Sha256, Digest};
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
    
    pub async fn download_manifest(&self, url: &str) -> Result<String> {
        info!("Downloading manifest from: {}", url);
        
        let response = self.http_client.get(url).send().await?;
        
        if !response.status().is_success() {
            return Err(anyhow::anyhow!("Failed to download manifest: HTTP {}", response.status()));
        }
        
        let manifest_text = response.text().await?;
        Ok(manifest_text)
    }
    
    pub async fn resume_download(&self, url: &str, filepath: &Path, progress: &mut f32) -> Result<()> {
        // Check if partial file exists
        if !filepath.exists() {
            return self.download_file_with_progress(url, filepath, progress).await;
        }
        
        let metadata = fs::metadata(filepath)?;
        let downloaded_size = metadata.len();
        
        info!("Resuming download from byte {}", downloaded_size);
        
        // Create range request
        let response = self.http_client.get(url)
            .header("Range", format!("bytes={}-", downloaded_size))
            .send()
            .await?;
        
        if !response.status().is_success() && response.status() != reqwest::StatusCode::PARTIAL_CONTENT {
            return Err(anyhow::anyhow!("Failed to resume download: HTTP {}", response.status()));
        }
        
        let total_size = response.content_length().unwrap_or(0) + downloaded_size;
        let mut downloaded = downloaded_size;
        
        // Create progress bar
        let pb = ProgressBar::new(total_size);
        pb.set_position(downloaded);
        
        // Append to existing file
        let mut file = fs::OpenOptions::new()
            .write(true)
            .append(true)
            .open(filepath)?;
        
        // Download remaining data
        let mut stream = response.bytes_stream();
        
        while let Some(chunk) = stream.next().await {
            let chunk = chunk?;
            file.write_all(&chunk)?;
            
            downloaded += chunk.len() as u64;
            
            // Update progress
            if total_size > 0 {
                *progress = (downloaded as f32 / total_size as f32) * 100.0;
                pb.set_position(downloaded);
            }
        }
        
        pb.finish_with_message("Resume completed");
        Ok(())
    }
}

use std::io::Write;
use futures::StreamExt; 