use anyhow::{Result, anyhow};
use log::{info, warn, error};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use std::fs;
use std::collections::HashMap;

/// SDK configuration
#[derive(Debug, Serialize, Deserialize)]
pub struct SdkConfig {
    /// SDK version
    pub version: String,
    
    /// Default TauStore endpoint
    pub taustore_endpoint: String,
    
    /// Default API key (optional)
    pub api_key: Option<String>,
    
    /// Default build target
    pub default_target: String,
    
    /// Default template
    pub default_template: String,
    
    /// QEMU configuration
    pub qemu: QemuSdkConfig,
    
    /// Build configuration
    pub build: BuildSdkConfig,
    
    /// Test configuration
    pub test: TestSdkConfig,
    
    /// Publish configuration
    pub publish: PublishSdkConfig,
    
    /// Developer information
    pub developer: DeveloperConfig,
}

/// QEMU SDK configuration
#[derive(Debug, Serialize, Deserialize)]
pub struct QemuSdkConfig {
    /// QEMU binary path
    pub binary_path: Option<String>,
    
    /// Default architecture
    pub default_arch: String,
    
    /// Default machine type
    pub default_machine: String,
    
    /// Default memory size (MB)
    pub default_memory: u64,
    
    /// Default CPU cores
    pub default_cores: u32,
    
    /// Default disk image path
    pub default_disk_image: Option<String>,
}

/// Build SDK configuration
#[derive(Debug, Serialize, Deserialize)]
pub struct BuildSdkConfig {
    /// Default build type (debug/release)
    pub default_build_type: String,
    
    /// Default optimization level
    pub default_optimization: String,
    
    /// Parallel build jobs
    pub parallel_jobs: Option<u32>,
    
    /// Build timeout (seconds)
    pub build_timeout: u64,
    
    /// Auto-clean build artifacts
    pub auto_clean: bool,
}

/// Test SDK configuration
#[derive(Debug, Serialize, Deserialize)]
pub struct TestSdkConfig {
    /// Default test environment
    pub default_environment: String,
    
    /// Test timeout (seconds)
    pub test_timeout: u64,
    
    /// Auto-generate test scenarios
    pub auto_generate_tests: bool,
    
    /// Test coverage reporting
    pub coverage_reporting: bool,
}

/// Publish SDK configuration
#[derive(Debug, Serialize, Deserialize)]
pub struct PublishSdkConfig {
    /// Auto-sign packages
    pub auto_sign: bool,
    
    /// Require API key for publishing
    pub require_api_key: bool,
    
    /// Auto-validate before publishing
    pub auto_validate: bool,
    
    /// Publish timeout (seconds)
    pub publish_timeout: u64,
}

/// Developer configuration
#[derive(Debug, Serialize, Deserialize)]
pub struct DeveloperConfig {
    /// Developer name
    pub name: Option<String>,
    
    /// Developer email
    pub email: Option<String>,
    
    /// Developer website
    pub website: Option<String>,
    
    /// Developer organization
    pub organization: Option<String>,
    
    /// Default license
    pub default_license: String,
    
    /// Default app category
    pub default_category: String,
}

/// Configuration manager
pub struct ConfigManager {
    config_path: PathBuf,
    config: SdkConfig,
}

impl ConfigManager {
    /// Create new configuration manager
    pub fn new() -> Result<Self> {
        let config_path = Self::get_config_path()?;
        let config = Self::load_or_create_config(&config_path)?;
        
        Ok(Self {
            config_path,
            config,
        })
    }
    
    /// Get configuration path
    fn get_config_path() -> Result<PathBuf> {
        let home = std::env::var("HOME")
            .or_else(|_| std::env::var("USERPROFILE"))
            .map_err(|_| anyhow!("Could not determine home directory"))?;
        
        let config_dir = PathBuf::from(home).join(".tau").join("sdk");
        fs::create_dir_all(&config_dir)?;
        
        Ok(config_dir.join("config.toml"))
    }
    
    /// Load or create configuration
    fn load_or_create_config(config_path: &Path) -> Result<SdkConfig> {
        if config_path.exists() {
            let content = fs::read_to_string(config_path)?;
            let config: SdkConfig = toml::from_str(&content)?;
            Ok(config)
        } else {
            let config = Self::get_default_config();
            config.save(config_path)?;
            Ok(config)
        }
    }
    
    /// Get default configuration
    fn get_default_config() -> SdkConfig {
        SdkConfig {
            version: "0.1.0".to_string(),
            taustore_endpoint: "https://taustore.tauos.com".to_string(),
            api_key: None,
            default_target: "x86_64-unknown-linux-gnu".to_string(),
            default_template: "rust-basic".to_string(),
            qemu: QemuSdkConfig {
                binary_path: None,
                default_arch: "x86_64".to_string(),
                default_machine: "q35".to_string(),
                default_memory: 2048,
                default_cores: 2,
                default_disk_image: None,
            },
            build: BuildSdkConfig {
                default_build_type: "debug".to_string(),
                default_optimization: "0".to_string(),
                parallel_jobs: Some(num_cpus::get() as u32),
                build_timeout: 600,
                auto_clean: false,
            },
            test: TestSdkConfig {
                default_environment: "local".to_string(),
                test_timeout: 300,
                auto_generate_tests: true,
                coverage_reporting: false,
            },
            publish: PublishSdkConfig {
                auto_sign: true,
                require_api_key: true,
                auto_validate: true,
                publish_timeout: 300,
            },
            developer: DeveloperConfig {
                name: None,
                email: None,
                website: None,
                organization: None,
                default_license: "MIT".to_string(),
                default_category: "other".to_string(),
            },
        }
    }
    
    /// Get configuration
    pub fn get_config(&self) -> &SdkConfig {
        &self.config
    }
    
    /// Get mutable configuration
    pub fn get_config_mut(&mut self) -> &mut SdkConfig {
        &mut self.config
    }
    
    /// Save configuration
    pub fn save(&self) -> Result<()> {
        self.config.save(&self.config_path)
    }
    
    /// Get TauStore endpoint
    pub fn get_taustore_endpoint(&self) -> &str {
        &self.config.taustore_endpoint
    }
    
    /// Get API key
    pub fn get_api_key(&self) -> Option<&str> {
        self.config.api_key.as_deref()
    }
    
    /// Set API key
    pub fn set_api_key(&mut self, api_key: String) -> Result<()> {
        self.config.api_key = Some(api_key);
        self.save()
    }
    
    /// Get default target
    pub fn get_default_target(&self) -> &str {
        &self.config.default_target
    }
    
    /// Get default template
    pub fn get_default_template(&self) -> &str {
        &self.config.default_template
    }
    
    /// Get developer name
    pub fn get_developer_name(&self) -> Option<&str> {
        self.config.developer.name.as_deref()
    }
    
    /// Set developer name
    pub fn set_developer_name(&mut self, name: String) -> Result<()> {
        self.config.developer.name = Some(name);
        self.save()
    }
    
    /// Get developer email
    pub fn get_developer_email(&self) -> Option<&str> {
        self.config.developer.email.as_deref()
    }
    
    /// Set developer email
    pub fn set_developer_email(&mut self, email: String) -> Result<()> {
        self.config.developer.email = Some(email);
        self.save()
    }
    
    /// Get default license
    pub fn get_default_license(&self) -> &str {
        &self.config.developer.default_license
    }
    
    /// Get default category
    pub fn get_default_category(&self) -> &str {
        &self.config.developer.default_category
    }
    
    /// Validate configuration
    pub fn validate(&self) -> Result<()> {
        // Check required fields
        if self.config.taustore_endpoint.is_empty() {
            return Err(anyhow!("TauStore endpoint is required"));
        }
        
        if self.config.default_target.is_empty() {
            return Err(anyhow!("Default target is required"));
        }
        
        if self.config.default_template.is_empty() {
            return Err(anyhow!("Default template is required"));
        }
        
        // Validate QEMU configuration
        if self.config.qemu.default_memory == 0 {
            return Err(anyhow!("QEMU default memory must be greater than 0"));
        }
        
        if self.config.qemu.default_cores == 0 {
            return Err(anyhow!("QEMU default cores must be greater than 0"));
        }
        
        // Validate build configuration
        if self.config.build.build_timeout == 0 {
            return Err(anyhow!("Build timeout must be greater than 0"));
        }
        
        // Validate test configuration
        if self.config.test.test_timeout == 0 {
            return Err(anyhow!("Test timeout must be greater than 0"));
        }
        
        // Validate publish configuration
        if self.config.publish.publish_timeout == 0 {
            return Err(anyhow!("Publish timeout must be greater than 0"));
        }
        
        Ok(())
    }
    
    /// Initialize configuration
    pub fn initialize(&mut self) -> Result<()> {
        info!("Initializing Tau SDK configuration");
        
        // Validate configuration
        self.validate()?;
        
        // Create necessary directories
        self.create_directories()?;
        
        // Save configuration
        self.save()?;
        
        info!("Configuration initialized successfully");
        Ok(())
    }
    
    /// Create necessary directories
    fn create_directories(&self) -> Result<()> {
        let home = std::env::var("HOME")
            .or_else(|_| std::env::var("USERPROFILE"))
            .map_err(|_| anyhow!("Could not determine home directory"))?;
        
        let base_dir = PathBuf::from(home).join(".tau");
        
        // Create SDK directories
        let sdk_dir = base_dir.join("sdk");
        fs::create_dir_all(&sdk_dir)?;
        
        // Create cache directory
        let cache_dir = sdk_dir.join("cache");
        fs::create_dir_all(&cache_dir)?;
        
        // Create templates directory
        let templates_dir = sdk_dir.join("templates");
        fs::create_dir_all(&templates_dir)?;
        
        // Create logs directory
        let logs_dir = sdk_dir.join("logs");
        fs::create_dir_all(&logs_dir)?;
        
        Ok(())
    }
    
    /// Get cache directory
    pub fn get_cache_dir(&self) -> Result<PathBuf> {
        let home = std::env::var("HOME")
            .or_else(|_| std::env::var("USERPROFILE"))
            .map_err(|_| anyhow!("Could not determine home directory"))?;
        
        Ok(PathBuf::from(home).join(".tau").join("sdk").join("cache"))
    }
    
    /// Get templates directory
    pub fn get_templates_dir(&self) -> Result<PathBuf> {
        let home = std::env::var("HOME")
            .or_else(|_| std::env::var("USERPROFILE"))
            .map_err(|_| anyhow!("Could not determine home directory"))?;
        
        Ok(PathBuf::from(home).join(".tau").join("sdk").join("templates"))
    }
    
    /// Get logs directory
    pub fn get_logs_dir(&self) -> Result<PathBuf> {
        let home = std::env::var("HOME")
            .or_else(|_| std::env::var("USERPROFILE"))
            .map_err(|_| anyhow!("Could not determine home directory"))?;
        
        Ok(PathBuf::from(home).join(".tau").join("sdk").join("logs"))
    }
}

impl SdkConfig {
    /// Save configuration to file
    pub fn save(&self, path: &Path) -> Result<()> {
        let content = toml::to_string_pretty(self)?;
        fs::write(path, content)?;
        Ok(())
    }
    
    /// Load configuration from file
    pub fn load(path: &Path) -> Result<Self> {
        let content = fs::read_to_string(path)?;
        let config: SdkConfig = toml::from_str(&content)?;
        Ok(config)
    }
} 