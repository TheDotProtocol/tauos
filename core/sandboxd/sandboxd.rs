use std::env;
use std::fs;
use std::process::{Command, exit};
use serde::Deserialize;
use std::collections::HashMap;
use std::os::unix::process::CommandExt;
use std::io::Write;

#[derive(Debug, Deserialize)]
struct Manifest {
    id: String,
    exec: String,
    permissions: HashMap<String, serde_json::Value>,
}

fn read_manifest(path: &str) -> Option<Manifest> {
    let data = fs::read_to_string(path).ok()?;
    serde_json::from_str(&data).ok()
}

fn generate_apparmor_profile(app_id: &str, permissions: &HashMap<String, serde_json::Value>) -> String {
    // Generate a minimal AppArmor profile string based on permissions
    let mut profile = format!("profile {} {{\n  #include <tunables/global>\n", app_id);
    if permissions.get("network").and_then(|v| v.as_bool()).unwrap_or(false) {
        profile.push_str("  network,\n");
    }
    if let Some(fs_perm) = permissions.get("filesystem") {
        if fs_perm == "ro" {
            profile.push_str("  / r,\n");
        } else if fs_perm == "rw" {
            profile.push_str("  / rw,\n");
        }
    }
    // Add more permission mappings as needed
    profile.push_str("  deny /dev/camera*,\n");
    profile.push_str("  deny /dev/microphone*,\n");
    profile.push_str("  # ... more rules ...\n  }}\n");
    profile
}

fn apply_apparmor_profile(app_id: &str, profile: &str) {
    let profile_path = format!("/etc/apparmor.d/{}.profile", app_id);
    if let Ok(mut file) = fs::File::create(&profile_path) {
        let _ = file.write_all(profile.as_bytes());
    }
    // Load profile (stub)
    println!("[sandboxd] AppArmor profile for {} applied.", app_id);
    // In real use: Command::new("apparmor_parser").arg(&profile_path).status()
}

fn apply_namespaces(app_id: &str) {
    println!("[sandboxd] Applying namespaces for {} (user, mount, net)", app_id);
    // In real use: unshare(2) syscall or similar
}

fn drop_privileges() {
    // In real use: setuid/setgid to non-root user
    println!("[sandboxd] Dropping privileges to non-root user");
}

fn log_violation(app_id: &str, msg: &str) {
    println!("[sandboxd][VIOLATION] {}: {}", app_id, msg);
    // In real use: append to audit log file
}

fn runtime_permission_prompt(_app_id: &str, _perm: &str) -> bool {
    // Stub: always deny for now
    println!("[sandboxd] Runtime permission prompt for {}: {} (stub, denied)", _app_id, _perm);
    false
}

fn launch_app(app_id: &str, manifest_path: &str, use_apparmor: bool) {
    if let Some(manifest) = read_manifest(manifest_path) {
        println!("[sandboxd] Launching {} with manifest {}", app_id, manifest_path);
        let profile = generate_apparmor_profile(&manifest.id, &manifest.permissions);
        if use_apparmor {
            apply_apparmor_profile(&manifest.id, &profile);
        }
        apply_namespaces(&manifest.id);
        drop_privileges();
        println!("[sandboxd] Launching app {} as non-root: {}", manifest.id, manifest.exec);
        let status = Command::new(&manifest.exec).status();
        match status {
            Ok(s) if s.success() => println!("[sandboxd] App {} exited successfully.", manifest.id),
            Ok(s) => {
                log_violation(&manifest.id, &format!("App exited with status {}", s));
                println!("[sandboxd] App {} exited with status {}.", manifest.id, s);
            },
            Err(e) => {
                log_violation(&manifest.id, &format!("Failed to launch: {}", e));
                println!("[sandboxd] Failed to launch {}: {}", manifest.id, e);
            },
        }
    } else {
        log_violation(app_id, "Failed to read manifest");
        println!("[sandboxd] Failed to read manifest for {}", app_id);
        exit(1);
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 3 {
        eprintln!("Usage: sandboxd <app_id> <manifest_path>");
        exit(1);
    }
    let app_id = &args[1];
    let manifest_path = &args[2];
    // For now, default to AppArmor
    launch_app(app_id, manifest_path, true);
} 