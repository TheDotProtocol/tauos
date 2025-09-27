use anyhow::{Result, anyhow};
use log::info;
use std::path::{Path, PathBuf};
use std::fs;
use std::collections::HashMap;
use std::os::unix::fs::PermissionsExt;

/// Initialize a new Tau application
pub async fn init_command(
    name: String,
    _lang: String,
    template: String,
    output: PathBuf,
) -> Result<()> {
    info!("Initializing new Tau application: {}", name);
    
    let project_path = output.join(&name);
    
    // Create project directory
    fs::create_dir_all(&project_path)?;
    
    // Create basic project structure
    create_basic_project(&project_path, &name)?;
    
    info!("Project initialized successfully at: {:?}", project_path);
    println!("✅ Project '{}' created successfully!", name);
    println!("📁 Location: {:?}", project_path);
    println!("🚀 Next steps:");
    println!("   cd {}", name);
    println!("   tau-sdk build");
    println!("   tau-sdk run");
    
    Ok(())
}

/// Build the application
pub async fn build_command(target: String) -> Result<()> {
    info!("Building application with target: {}", target);
    
    // Check if we're in a project directory
    if !Path::new("Cargo.toml").exists() {
        return Err(anyhow!("Not in a Rust project directory. Run 'tau-sdk init' first."));
    }
    
    // Run cargo build
    let status = std::process::Command::new("cargo")
        .arg("build")
        .arg("--release")
        .status()?;
    
    if status.success() {
        println!("✅ Build completed successfully!");
    } else {
        return Err(anyhow!("Build failed with exit code: {}", status));
    }
    
    Ok(())
}

/// Package the application
pub async fn package_command(output: Option<PathBuf>) -> Result<()> {
    info!("Packaging application");
    
    let output_path = output.unwrap_or_else(|| PathBuf::from("dist"));
    fs::create_dir_all(&output_path)?;
    
    // For now, just copy the binary
    let binary_path = PathBuf::from("target/release");
    if binary_path.exists() {
        // Find the binary
        for entry in fs::read_dir(&binary_path)? {
            let entry = entry?;
            if entry.file_type()?.is_file() {
                let dest = output_path.join(entry.file_name());
                fs::copy(entry.path(), dest)?;
                println!("✅ Package created: {:?}", output_path);
                break;
            }
        }
    }
    
    Ok(())
}

/// Run the application
pub async fn run_command(args: Vec<String>) -> Result<()> {
    info!("Running application with args: {:?}", args);
    
    // Check if we're in a project directory
    if !Path::new("Cargo.toml").exists() {
        return Err(anyhow!("Not in a Rust project directory. Run 'tau-sdk init' first."));
    }
    
    // Read Cargo.toml to get the project name
    let cargo_content = fs::read_to_string("Cargo.toml")?;
    let project_name = extract_project_name(&cargo_content)?;
    
    let binary_path = PathBuf::from("target/release").join(&project_name);
    if !binary_path.exists() {
        return Err(anyhow!("No binary found. Run 'tau-sdk build' first."));
    }
    
    // FORCE QEMU EXECUTION - Comment out direct binary execution for demo
    /*
    // Run the binary directly (for testing only)
    let status = std::process::Command::new(&binary_path)
        .args(&args)
        .status()?;
    
    if !status.success() {
        return Err(anyhow!("Application exited with code: {}", status));
    }
    
    Ok(())
    */
    
    // Check if TauOS ISO exists - try multiple possible paths
    let possible_iso_paths = vec![
        PathBuf::from("build/tauos.iso"),
        PathBuf::from("../../build/tauos.iso"),
        PathBuf::from("../build/tauos.iso"),
    ];
    
    let mut iso_path = None;
    for path in &possible_iso_paths {
        if path.exists() {
            iso_path = Some(path.clone());
            break;
        }
    }
    
    let iso_path = iso_path.ok_or_else(|| {
        anyhow!("TauOS ISO not found. Tried paths: {:?}. Please build the ISO first using: ./scripts/package_qemu_image.sh", possible_iso_paths)
    })?;
    
    // Check ISO file size to ensure it's not just a stub
    let metadata = fs::metadata(&iso_path)?;
    if metadata.len() < 1024 {
        println!("⚠️  Warning: TauOS ISO appears to be a stub file ({} bytes)", metadata.len());
        println!("   This is expected for the demo build. Proceeding with QEMU launch...");
    }
    
    println!("🐢 TauOS SDK - Running Application in VM");
    println!("==========================================");
    println!("App: {}", project_name);
    println!("Binary: {:?}", binary_path);
    println!("ISO: {:?}", iso_path);
    println!("Args: {:?}", args);
    println!("Current directory: {:?}", std::env::current_dir()?);
    println!("");
    
    // Create a temporary directory for mounting the app
    let mount_dir = PathBuf::from("target/tauos-mount");
    fs::create_dir_all(&mount_dir)?;
    
    // Copy the binary to the mount directory
    let mounted_binary = mount_dir.join(&project_name);
    fs::copy(&binary_path, &mounted_binary)?;
    fs::set_permissions(&mounted_binary, fs::Permissions::from_mode(0o755))?;
    
    println!("✅ App binary mounted at: {:?}", mounted_binary);
    
    // Check if QEMU is available
    let qemu_path = std::process::Command::new("which")
        .arg("qemu-system-x86_64")
        .output();
    
    match qemu_path {
        Ok(output) if output.status.success() => {
            println!("✅ QEMU found: {}", String::from_utf8_lossy(&output.stdout).trim());
        }
        _ => {
            return Err(anyhow!("QEMU not found. Please install QEMU to run TauOS applications."));
        }
    }
    
    // Build QEMU command with app mounting
    let iso_path_str = iso_path.to_string_lossy();
    let mut qemu_args = vec![
        "qemu-system-x86_64",
        "-m", "2048",
        "-smp", "2",
        "-cdrom", &iso_path_str,
        "-boot", "d",
        "-enable-kvm",
        "-vga", "virtio",
        "-cpu", "host",
        "-machine", "type=q35,accel=kvm:tcg",
        "-display", "gtk",
        "-usb",
        "-device", "usb-tablet",
        "-net", "user",
        "-net", "nic,model=virtio"
    ];
    
    // Add the mounted app as a virtio-fs share
    let virtfs_arg = format!("local,path={},mount_tag=tauapp,security_model=mapped", mount_dir.display());
    qemu_args.extend_from_slice(&["-virtfs", &virtfs_arg]);
    
    println!("🚀 Launching TauOS VM with app mounted...");
    println!("Command: {}", qemu_args.join(" "));
    println!("");
    println!("📋 Note: This will launch QEMU with the TauOS VM.");
    println!("   The app '{}' will be mounted and available inside the VM.", project_name);
    println!("   Press Ctrl+C to exit the VM when done.");
    println!("");
    
    // Run QEMU
    let status = std::process::Command::new("qemu-system-x86_64")
        .args(&qemu_args[1..]) // Skip the first "qemu-system-x86_64" since we're using Command::new
        .status()?;
    
    // Clean up mount directory
    let _ = fs::remove_dir_all(&mount_dir);
    
    if !status.success() {
        return Err(anyhow!("QEMU VM exited with code: {}", status));
    }
    
    println!("✅ Application run completed successfully!");
    println!("📋 VM session ended");
    
    Ok(())
}

/// Extract project name from Cargo.toml content
fn extract_project_name(cargo_content: &str) -> Result<String> {
    for line in cargo_content.lines() {
        if line.trim().starts_with("name = ") {
            let name = line.split('=').nth(1)
                .ok_or_else(|| anyhow!("Invalid Cargo.toml format"))?
                .trim()
                .trim_matches('"');
            return Ok(name.to_string());
        }
    }
    Err(anyhow!("Could not find project name in Cargo.toml"))
}

/// Test the application
pub async fn test_command(_config: Option<PathBuf>) -> Result<()> {
    info!("Testing application");
    
    // Run cargo test
    let status = std::process::Command::new("cargo")
        .arg("test")
        .status()?;
    
    if status.success() {
        println!("✅ Tests passed!");
    } else {
        return Err(anyhow!("Tests failed with exit code: {}", status));
    }
    
    Ok(())
}

/// Publish to TauStore
pub async fn publish_command(_api_key: Option<String>) -> Result<()> {
    info!("Publishing application");
    
    println!("⚠️  Publishing not implemented yet");
    println!("This would upload the application to TauStore");
    
    Ok(())
}

/// Generate documentation
pub async fn docs_command(output: PathBuf) -> Result<()> {
    info!("Generating documentation");
    
    fs::create_dir_all(&output)?;
    
    // Generate basic documentation
    let docs_content = r#"# Application Documentation

This is auto-generated documentation for your Tau OS application.

## Usage

Run the application with:
```bash
tau-sdk run
```

## Building

Build the application with:
```bash
tau-sdk build
```

## Testing

Run tests with:
```bash
tau-sdk test
```
"#;
    
    fs::write(output.join("README.md"), docs_content)?;
    println!("✅ Documentation generated in: {:?}", output);
    
    Ok(())
}

/// Validate application
pub async fn validate_command() -> Result<()> {
    info!("Validating application");
    
    // Check for required files
    let required_files = ["Cargo.toml", "src/main.rs"];
    for file in &required_files {
        if !Path::new(file).exists() {
            return Err(anyhow!("Required file not found: {}", file));
        }
    }
    
    println!("✅ Application validation passed!");
    
    Ok(())
}

/// Create a basic project structure
fn create_basic_project(project_path: &Path, name: &str) -> Result<()> {
    // Create src directory
    let src_path = project_path.join("src");
    fs::create_dir_all(&src_path)?;
    
    // Create Cargo.toml
    let cargo_content = format!(r#"[package]
name = "{}"
version = "0.1.0"
edition = "2021"
authors = ["Tau OS Developer"]
description = "A Tau OS application"

[dependencies]
anyhow = "1.0"
log = "0.4"
env_logger = "0.10"

[[bin]]
name = "{}"
path = "src/main.rs"
"#, name, name);
    
    fs::write(project_path.join("Cargo.toml"), cargo_content)?;
    
    // Create main.rs
    let main_content = format!(r#"use anyhow::Result;
use log::info;

fn main() -> Result<()> {{
    env_logger::init();
    
    info!("{} starting up...");
    
    // Your application logic here
    println!("Hello from {}!");
    println!("This is a Tau OS application.");
    println!("Application ID: com.example.{}");
    println!("Version: 0.1.0");
    println!("");
    println!("Note: GUI support will be added in a future update.");
    println!("For now, this is a console application.");
    
    info!("{} shutting down...");
    Ok(())
}}
"#, name, name, name, name);
    
    fs::write(src_path.join("main.rs"), main_content)?;
    
    // Create .gitignore
    let gitignore_content = r#"target/
Cargo.lock
*.tauapp
dist/
"#;
    
    fs::write(project_path.join(".gitignore"), gitignore_content)?;
    
    Ok(())
} 