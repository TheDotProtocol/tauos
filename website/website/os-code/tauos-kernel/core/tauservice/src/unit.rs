use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use thiserror::Error;
use anyhow::{Result, Context};

#[derive(Error, Debug)]
pub enum UnitError {
    #[error("Invalid unit file: {0}")]
    InvalidUnit(String),
    #[error("Missing required field: {0}")]
    MissingField(String),
    #[error("Invalid value for field {0}: {1}")]
    InvalidValue(String, String),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("TOML parse error: {0}")]
    TomlError(#[from] toml::de::Error),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ServiceUnit {
    pub name: String,
    pub description: Option<String>,
    pub service: ServiceSection,
    pub install: Option<InstallSection>,
    pub unit: Option<UnitSection>,
    pub sandbox: Option<SandboxSection>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ServiceSection {
    pub exec_start: Option<String>,
    pub exec_start_pre: Option<Vec<String>>,
    pub exec_start_post: Option<Vec<String>>,
    pub exec_stop: Option<String>,
    pub exec_stop_post: Option<Vec<String>>,
    pub exec_reload: Option<String>,
    pub restart: Option<RestartPolicy>,
    pub restart_sec: Option<u64>,
    pub user: Option<String>,
    pub group: Option<String>,
    pub working_directory: Option<String>,
    pub environment: Option<HashMap<String, String>>,
    pub environment_file: Option<Vec<String>>,
    pub nice: Option<i32>,
    pub limit_nofile: Option<u64>,
    pub timeout_start_sec: Option<u64>,
    pub timeout_stop_sec: Option<u64>,
    pub kill_mode: Option<KillMode>,
    pub kill_signal: Option<String>,
    pub type_: Option<ServiceType>,
    pub remain_after_exit: Option<bool>,
    pub standard_output: Option<StandardOutput>,
    pub standard_error: Option<StandardOutput>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InstallSection {
    pub wanted_by: Option<Vec<String>>,
    pub required_by: Option<Vec<String>>,
    pub also: Option<Vec<String>>,
    pub alias: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UnitSection {
    pub description: Option<String>,
    pub documentation: Option<Vec<String>>,
    pub requires: Option<Vec<String>>,
    pub wants: Option<Vec<String>>,
    pub after: Option<Vec<String>>,
    pub before: Option<Vec<String>>,
    pub conflicts: Option<Vec<String>>,
    pub part_of: Option<Vec<String>>,
    pub binds_to: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SandboxSection {
    pub read_write_paths: Option<Vec<String>>,
    pub read_only_paths: Option<Vec<String>>,
    pub no_new_privileges: Option<bool>,
    pub private_tmp: Option<bool>,
    pub private_devices: Option<bool>,
    pub protect_system: Option<bool>,
    pub protect_home: Option<bool>,
    pub network_access: Option<bool>,
    pub capabilities: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum RestartPolicy {
    #[serde(rename = "no")]
    No,
    #[serde(rename = "always")]
    Always,
    #[serde(rename = "on-success")]
    OnSuccess,
    #[serde(rename = "on-failure")]
    OnFailure,
    #[serde(rename = "on-abnormal")]
    OnAbnormal,
    #[serde(rename = "on-abort")]
    OnAbort,
    #[serde(rename = "on-watchdog")]
    OnWatchdog,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum KillMode {
    #[serde(rename = "control-group")]
    ControlGroup,
    #[serde(rename = "mixed")]
    Mixed,
    #[serde(rename = "process")]
    Process,
    #[serde(rename = "none")]
    None,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ServiceType {
    #[serde(rename = "simple")]
    Simple,
    #[serde(rename = "forking")]
    Forking,
    #[serde(rename = "oneshot")]
    OneShot,
    #[serde(rename = "notify")]
    Notify,
    #[serde(rename = "dbus")]
    Dbus,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum StandardOutput {
    #[serde(rename = "inherit")]
    Inherit,
    #[serde(rename = "null")]
    Null,
    #[serde(rename = "tty")]
    Tty,
    #[serde(rename = "journal")]
    Journal,
    #[serde(rename = "kmsg")]
    Kmsg,
    #[serde(rename = "journal+console")]
    JournalConsole,
    #[serde(rename = "kmsg+console")]
    KmsgConsole,
    #[serde(rename = "socket")]
    Socket,
}

impl ServiceUnit {
    pub fn from_file(path: &Path) -> Result<Self> {
        let content = fs::read_to_string(path)
            .context("Failed to read unit file")?;
        
        Self::from_str(&content, path)
    }
    
    pub fn from_str(content: &str, path: &Path) -> Result<Self> {
        let mut unit: ServiceUnit = toml::from_str(content)
            .context("Failed to parse unit file")?;
        
        // Set name from filename
        if let Some(file_name) = path.file_stem() {
            unit.name = file_name.to_string_lossy().to_string();
        }
        
        // Validate unit
        unit.validate()?;
        
        Ok(unit)
    }
    
    pub fn validate(&self) -> Result<()> {
        // Check required fields
        if self.service.exec_start.is_none() {
            return Err(UnitError::MissingField("ExecStart".into()).into());
        }
        
        // Validate restart policy
        if let Some(restart) = &self.service.restart {
            match restart {
                RestartPolicy::No | RestartPolicy::Always | 
                RestartPolicy::OnSuccess | RestartPolicy::OnFailure |
                RestartPolicy::OnAbnormal | RestartPolicy::OnAbort |
                RestartPolicy::OnWatchdog => {}
            }
        }
        
        // Validate service type
        if let Some(service_type) = &self.service.type_ {
            match service_type {
                ServiceType::Simple | ServiceType::Forking | 
                ServiceType::OneShot | ServiceType::Notify |
                ServiceType::Dbus => {}
            }
        }
        
        Ok(())
    }
    
    pub fn get_dependencies(&self) -> Vec<String> {
        let mut deps = Vec::new();
        
        if let Some(unit) = &self.unit {
            if let Some(requires) = &unit.requires {
                deps.extend(requires.clone());
            }
            if let Some(wants) = &unit.wants {
                deps.extend(wants.clone());
            }
            if let Some(after) = &unit.after {
                deps.extend(after.clone());
            }
        }
        
        deps
    }
    
    pub fn get_targets(&self) -> Vec<String> {
        let mut targets = Vec::new();
        
        if let Some(install) = &self.install {
            if let Some(wanted_by) = &install.wanted_by {
                targets.extend(wanted_by.clone());
            }
            if let Some(required_by) = &install.required_by {
                targets.extend(required_by.clone());
            }
        }
        
        targets
    }
    
    pub fn is_enabled(&self) -> bool {
        // Check if service is enabled by looking for symlinks in target directories
        let targets = self.get_targets();
        !targets.is_empty()
    }
}

pub struct UnitLoader {
    pub system_units_dir: PathBuf,
    pub user_units_dir: PathBuf,
}

impl UnitLoader {
    pub fn new() -> Self {
        Self {
            system_units_dir: PathBuf::from("/etc/tau/services"),
            user_units_dir: PathBuf::from(format!("{}/.config/tau/services", 
                std::env::var("HOME").unwrap_or_else(|_| "/home/user".to_string()))),
        }
    }
    
    pub fn load_all_units(&self) -> Result<HashMap<String, ServiceUnit>> {
        let mut units = HashMap::new();
        
        // Load system units
        if self.system_units_dir.exists() {
            self.load_units_from_dir(&self.system_units_dir, &mut units)?;
        }
        
        // Load user units
        if self.user_units_dir.exists() {
            self.load_units_from_dir(&self.user_units_dir, &mut units)?;
        }
        
        Ok(units)
    }
    
    fn load_units_from_dir(&self, dir: &Path, units: &mut HashMap<String, ServiceUnit>) -> Result<()> {
        for entry in walkdir::WalkDir::new(dir)
            .follow_links(true)
            .into_iter()
            .filter_map(|e| e.ok()) {
            
            let path = entry.path();
            if path.is_file() && path.extension().map_or(false, |ext| ext == "tau") {
                match ServiceUnit::from_file(path) {
                    Ok(unit) => {
                        units.insert(unit.name.clone(), unit);
                    }
                    Err(e) => {
                        log::warn!("Failed to load unit file {}: {}", path.display(), e);
                    }
                }
            }
        }
        
        Ok(())
    }
    
    pub fn reload_unit(&self, unit_name: &str) -> Result<ServiceUnit> {
        // Try system units first, then user units
        let system_path = self.system_units_dir.join(format!("{}.tau", unit_name));
        let user_path = self.user_units_dir.join(format!("{}.tau", unit_name));
        
        if system_path.exists() {
            ServiceUnit::from_file(&system_path)
        } else if user_path.exists() {
            ServiceUnit::from_file(&user_path)
        } else {
            Err(anyhow::anyhow!("Unit file not found for service: {}", unit_name))
        }
    }
} 