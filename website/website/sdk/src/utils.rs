use anyhow::{Result, anyhow};
use log::{info, warn, error};
use std::path::{Path, PathBuf};
use std::fs;
use std::process::{Command, Stdio};
use std::collections::HashMap;
use sha2::{Sha256, Digest};
use serde::{Deserialize, Serialize};
use std::io::Read;

/// Utility functions for the Tau SDK

/// Check if a command is available
pub fn is_command_available(command: &str) -> bool {
    Command::new("which")
        .arg(command)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .map(|status| status.success())
        .unwrap_or(false)
}

/// Get system information
pub fn get_system_info() -> Result<SystemInfo> {
    Ok(SystemInfo {
        kernel_version: get_kernel_version()?,
        cpu_info: get_cpu_info()?,
        memory_info: get_memory_info()?,
    })
}

/// Get kernel version
fn get_kernel_version() -> Result<String> {
    let output = Command::new("uname")
        .arg("-r")
        .output()?;
    
    Ok(String::from_utf8(output.stdout)?.trim().to_string())
}

/// Get CPU information
fn get_cpu_info() -> Result<CpuInfo> {
    let output = Command::new("sysctl")
        .arg("-n")
        .arg("machdep.cpu.brand_string")
        .output()?;
    
    let brand = String::from_utf8(output.stdout)?.trim().to_string();
    
    let cores_output = Command::new("sysctl")
        .arg("-n")
        .arg("hw.ncpu")
        .output()?;
    
    let cores = String::from_utf8(cores_output.stdout)?.trim().parse().unwrap_or(0);
    
    Ok(CpuInfo {
        brand,
        cores,
    })
}

/// Get memory information
fn get_memory_info() -> Result<MemoryInfo> {
    let output = Command::new("sysctl")
        .arg("-n")
        .arg("hw.memsize")
        .output()?;
    
    let total_bytes = String::from_utf8(output.stdout)?.trim().parse().unwrap_or(0);
    
    Ok(MemoryInfo {
        total_mb: total_bytes / (1024 * 1024),
        available_mb: total_bytes / (1024 * 1024), // Simplified
    })
}

/// Calculate file hash
pub fn calculate_file_hash(path: &Path) -> Result<String> {
    let mut file = fs::File::open(path)?;
    let mut hasher = Sha256::new();
    let mut buffer = [0; 1024];
    
    loop {
        let n = file.read(&mut buffer)?;
        if n == 0 {
            break;
        }
        hasher.update(&buffer[..n]);
    }
    
    Ok(format!("{:x}", hasher.finalize()))
}

/// Ensure directory exists
pub fn ensure_directory(path: &Path) -> Result<()> {
    if !path.exists() {
        fs::create_dir_all(path)?;
    }
    Ok(())
}

/// Copy directory
pub fn copy_directory(src: &Path, dst: &Path) -> Result<()> {
    if !src.is_dir() {
        return Err(anyhow!("Source is not a directory"));
    }
    
    fs::create_dir_all(dst)?;
    
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());
        
        if src_path.is_file() {
            fs::copy(&src_path, &dst_path)?;
        } else if src_path.is_dir() {
            copy_directory(&src_path, &dst_path)?;
        }
    }
    
    Ok(())
}

/// Remove directory
pub fn remove_directory(path: &Path) -> Result<()> {
    if path.exists() {
        fs::remove_dir_all(path)?;
    }
    Ok(())
}

/// Get file size
pub fn get_file_size(path: &Path) -> Result<u64> {
    Ok(fs::metadata(path)?.len())
}

/// Format file size
pub fn format_file_size(size: u64) -> String {
    const KB: u64 = 1024;
    const MB: u64 = 1024 * 1024;
    const GB: u64 = 1024 * 1024 * 1024;
    
    match size {
        0..KB => format!("{} B", size),
        KB..MB => format!("{:.1} KB", size as f64 / KB as f64),
        MB..GB => format!("{:.1} MB", size as f64 / MB as f64),
        _ => format!("{:.1} GB", size as f64 / GB as f64),
    }
}

/// Check if path is absolute
pub fn is_absolute_path(path: &Path) -> bool {
    path.is_absolute()
}

/// Normalize path
pub fn normalize_path(path: &Path) -> PathBuf {
    path.canonicalize().unwrap_or_else(|_| path.to_path_buf())
}

/// Get file extension
pub fn get_file_extension(path: &Path) -> Option<String> {
    path.extension()
        .and_then(|ext| ext.to_str())
        .map(|s| s.to_string())
}

/// Check if file has extension
pub fn has_extension(path: &Path, extension: &str) -> bool {
    get_file_extension(path)
        .map(|ext| ext == extension)
        .unwrap_or(false)
}

/// Create temporary directory
pub fn create_temp_dir() -> Result<PathBuf> {
    Ok(tempfile::tempdir()?.path().to_path_buf())
}

/// Create temporary file
pub fn create_temp_file() -> Result<PathBuf> {
    Ok(tempfile::NamedTempFile::new()?.path().to_path_buf())
}

/// Read file content
pub fn read_file_content(path: &Path) -> Result<String> {
    Ok(fs::read_to_string(path)?)
}

/// Write file content
pub fn write_file_content(path: &Path, content: &str) -> Result<()> {
    Ok(fs::write(path, content)?)
}

/// Check if file is readable
pub fn is_file_readable(path: &Path) -> bool {
    fs::File::open(path).is_ok()
}

/// Check if directory is readable
pub fn is_directory_readable(path: &Path) -> bool {
    fs::read_dir(path).is_ok()
}

/// Get environment variable
pub fn get_env_var(key: &str) -> Option<String> {
    std::env::var(key).ok()
}

/// Set environment variable
pub fn set_env_var(key: &str, value: &str) {
    std::env::set_var(key, value);
}

/// Get current directory
pub fn get_current_dir() -> Result<PathBuf> {
    Ok(std::env::current_dir()?)
}

/// Change directory
pub fn change_dir(path: &Path) -> Result<()> {
    Ok(std::env::set_current_dir(path)?)
}

/// Execute command
pub fn execute_command(command: &str, args: &[&str]) -> Result<CommandOutput> {
    let output = Command::new(command)
        .args(args)
        .output()?;
    
    Ok(CommandOutput {
        stdout: String::from_utf8(output.stdout)?,
        stderr: String::from_utf8(output.stderr)?,
        exit_code: output.status.code().unwrap_or(-1),
    })
}

/// Execute command and check success
pub fn execute_command_success(command: &str, args: &[&str]) -> Result<bool> {
    let output = Command::new(command)
        .args(args)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()?;
    
    Ok(output.success())
}

/// Parse JSON
pub fn parse_json<T: serde::de::DeserializeOwned>(content: &str) -> Result<T> {
    Ok(serde_json::from_str(content)?)
}

/// Convert to JSON
pub fn to_json<T: serde::ser::Serialize>(value: &T) -> Result<String> {
    Ok(serde_json::to_string_pretty(value)?)
}

/// Parse TOML
pub fn parse_toml<T: serde::de::DeserializeOwned>(content: &str) -> Result<T> {
    Ok(toml::from_str(content)?)
}

/// Convert to TOML
pub fn to_toml<T: serde::ser::Serialize>(value: &T) -> Result<String> {
    Ok(toml::to_string_pretty(value)?)
}

/// Generate random string
pub fn generate_random_string(length: usize) -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let chars: Vec<char> = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".chars().collect();
    
    (0..length)
        .map(|_| chars[rng.gen_range(0..chars.len())])
        .collect()
}

/// Generate UUID
pub fn generate_uuid() -> String {
    uuid::Uuid::new_v4().to_string()
}

/// Validate email
pub fn is_valid_email(email: &str) -> bool {
    use regex::Regex;
    let email_regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
    email_regex.is_match(email)
}

/// Validate URL
pub fn is_valid_url(url: &str) -> bool {
    use regex::Regex;
    let url_regex = Regex::new(r"^https?://[^\s/$.?#].[^\s]*$").unwrap();
    url_regex.is_match(url)
}

/// System information
#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    pub kernel_version: String,
    pub cpu_info: CpuInfo,
    pub memory_info: MemoryInfo,
}

/// CPU information
#[derive(Debug, Serialize, Deserialize)]
pub struct CpuInfo {
    pub brand: String,
    pub cores: u32,
}

/// Memory information
#[derive(Debug, Serialize, Deserialize)]
pub struct MemoryInfo {
    pub total_mb: u64,
    pub available_mb: u64,
}

/// Command output
#[derive(Debug)]
pub struct CommandOutput {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: i32,
} 