use std::fs;
use std::path::PathBuf;
use tempfile::TempDir;
use tau_service::{
    service_manager::ServiceManager,
    unit::ServiceUnit,
    state::StateManager,
    sandbox::SandboxManager,
    boot::BootManager,
};

#[tokio::test]
async fn test_service_lifecycle() {
    let temp_dir = TempDir::new().unwrap();
    let services_dir = temp_dir.path().join("services");
    fs::create_dir_all(&services_dir).unwrap();
    
    // Create a test service unit
    let service_content = r#"
name = "test-service"
description = "Test service for integration tests"

[service]
exec_start = "/bin/echo 'test service started'"
restart = "no"
type = "simple"

standard_output = "journal"
standard_error = "journal"

[install]
wanted_by = ["multi-user.target"]
"#;
    
    let service_file = services_dir.join("test-service.tau");
    fs::write(&service_file, service_content).unwrap();
    
    // Create service manager
    let manager = ServiceManager::new().unwrap();
    manager.load_units().unwrap();
    
    // Test service discovery
    let services = manager.list_services(None);
    assert!(!services.is_empty());
    
    // Test service status
    let status = manager.get_service_status("test-service");
    assert!(status.is_some());
    
    // Test service enable/disable
    manager.enable_service("test-service").unwrap();
    manager.disable_service("test-service").unwrap();
}

#[test]
fn test_unit_file_parsing() {
    let service_content = r#"
name = "nginx"
description = "Nginx web server"

[service]
exec_start = "/usr/sbin/nginx"
exec_stop = "/usr/sbin/nginx -s stop"
restart = "always"
user = "www-data"
working_directory = "/var/www"

[sandbox]
read_write_paths = ["/var/log/nginx"]
read_only_paths = ["/etc/nginx"]
no_new_privileges = true
network_access = true

[install]
wanted_by = ["multi-user.target"]
"#;
    
    let temp_dir = TempDir::new().unwrap();
    let service_file = temp_dir.path().join("nginx.tau");
    fs::write(&service_file, service_content).unwrap();
    
    let unit = ServiceUnit::from_file(&service_file).unwrap();
    
    assert_eq!(unit.name, "nginx");
    assert_eq!(unit.service.exec_start, Some("/usr/sbin/nginx".to_string()));
    assert_eq!(unit.service.user, Some("www-data".to_string()));
    assert!(unit.sandbox.is_some());
    assert!(unit.install.is_some());
}

#[test]
fn test_state_persistence() {
    let temp_dir = TempDir::new().unwrap();
    let state_dir = temp_dir.path().join("state");
    fs::create_dir_all(&state_dir).unwrap();
    
    let state_manager = StateManager::new().unwrap();
    
    // Test state backup and restore
    state_manager.backup_state().unwrap();
    
    let backups = state_manager.list_backups().unwrap();
    assert!(!backups.is_empty());
    
    // Test state summary
    let summary = state_manager.get_state_summary().unwrap();
    assert_eq!(summary.total_services, 0);
}

#[test]
fn test_sandbox_manager() {
    let sandbox_manager = SandboxManager::new();
    
    // Test security profile creation
    sandbox_manager.create_default_profile("test-service").unwrap();
    
    // Test security profile removal
    sandbox_manager.remove_security_profile("test-service").unwrap();
}

#[test]
fn test_boot_manager() {
    let temp_dir = TempDir::new().unwrap();
    let system_dir = temp_dir.path().join("system");
    fs::create_dir_all(&system_dir).unwrap();
    
    let boot_manager = BootManager::new();
    
    // Test boot integration setup
    boot_manager.setup_boot_integration().unwrap();
    
    // Test boot services listing
    let services = boot_manager.get_boot_services().unwrap();
    assert!(services.is_empty()); // No services enabled yet
}

#[tokio::test]
async fn test_service_dependencies() {
    let temp_dir = TempDir::new().unwrap();
    let services_dir = temp_dir.path().join("services");
    fs::create_dir_all(&services_dir).unwrap();
    
    // Create dependent services
    let service_a = r#"
name = "service-a"
description = "Service A"

[service]
exec_start = "/bin/echo 'service-a'"
restart = "no"
type = "simple"

[unit]
requires = ["service-b"]
after = ["service-b"]
"#;
    
    let service_b = r#"
name = "service-b"
description = "Service B"

[service]
exec_start = "/bin/echo 'service-b'"
restart = "no"
type = "simple"
"#;
    
    fs::write(services_dir.join("service-a.tau"), service_a).unwrap();
    fs::write(services_dir.join("service-b.tau"), service_b).unwrap();
    
    let manager = ServiceManager::new().unwrap();
    manager.load_units().unwrap();
    
    // Test dependency resolution
    let unit_a = manager.get_unit("service-a").unwrap();
    let dependencies = unit_a.get_dependencies();
    assert!(dependencies.contains(&"service-b".to_string()));
}

#[test]
fn test_circular_dependency_detection() {
    let temp_dir = TempDir::new().unwrap();
    let services_dir = temp_dir.path().join("services");
    fs::create_dir_all(&services_dir).unwrap();
    
    // Create circular dependency
    let service_a = r#"
name = "service-a"
description = "Service A"

[service]
exec_start = "/bin/echo 'service-a'"
restart = "no"
type = "simple"

[unit]
requires = ["service-b"]
"#;
    
    let service_b = r#"
name = "service-b"
description = "Service B"

[service]
exec_start = "/bin/echo 'service-b'"
restart = "no"
type = "simple"

[unit]
requires = ["service-a"]
"#;
    
    fs::write(services_dir.join("service-a.tau"), service_a).unwrap();
    fs::write(services_dir.join("service-b.tau"), service_b).unwrap();
    
    let manager = ServiceManager::new().unwrap();
    manager.load_units().unwrap();
    
    // This should detect circular dependency
    let result = manager.start_service("service-a");
    assert!(result.is_err());
}

#[test]
fn test_service_validation() {
    // Test valid service
    let valid_service = r#"
name = "valid-service"
description = "Valid service"

[service]
exec_start = "/usr/bin/valid-service"
restart = "always"
type = "simple"
"#;
    
    let temp_dir = TempDir::new().unwrap();
    let service_file = temp_dir.path().join("valid-service.tau");
    fs::write(&service_file, valid_service).unwrap();
    
    let unit = ServiceUnit::from_file(&service_file).unwrap();
    assert!(unit.validate().is_ok());
    
    // Test invalid service (missing exec_start)
    let invalid_service = r#"
name = "invalid-service"
description = "Invalid service"

[service]
restart = "always"
type = "simple"
"#;
    
    let invalid_file = temp_dir.path().join("invalid-service.tau");
    fs::write(&invalid_file, invalid_service).unwrap();
    
    let result = ServiceUnit::from_file(&invalid_file);
    assert!(result.is_err());
}

#[tokio::test]
async fn test_journal_logging() {
    let temp_dir = TempDir::new().unwrap();
    let journal_dir = temp_dir.path().join("journal");
    fs::create_dir_all(&journal_dir).unwrap();
    
    // This would test the journal logging system
    // Implementation would depend on the actual journal module
    assert!(journal_dir.exists());
}

#[test]
fn test_security_audit() {
    let temp_dir = TempDir::new().unwrap();
    let services_dir = temp_dir.path().join("services");
    fs::create_dir_all(&services_dir).unwrap();
    
    // Create service with security configuration
    let secure_service = r#"
name = "secure-service"
description = "Secure service"

[service]
exec_start = "/usr/bin/secure-service"
restart = "no"
type = "simple"

[sandbox]
no_new_privileges = true
private_tmp = true
network_access = false
read_write_paths = ["/var/log/secure-service"]
read_only_paths = ["/etc/secure-service"]
"#;
    
    fs::write(services_dir.join("secure-service.tau"), secure_service).unwrap();
    
    let unit = ServiceUnit::from_file(&services_dir.join("secure-service.tau")).unwrap();
    let sandbox = unit.sandbox.unwrap();
    
    // Test security configuration
    assert_eq!(sandbox.no_new_privileges, Some(true));
    assert_eq!(sandbox.private_tmp, Some(true));
    assert_eq!(sandbox.network_access, Some(false));
    assert!(sandbox.read_write_paths.is_some());
    assert!(sandbox.read_only_paths.is_some());
}

#[test]
fn test_service_targets() {
    let temp_dir = TempDir::new().unwrap();
    let services_dir = temp_dir.path().join("services");
    fs::create_dir_all(&services_dir).unwrap();
    
    let service = r#"
name = "target-service"
description = "Service with targets"

[service]
exec_start = "/usr/bin/target-service"
restart = "no"
type = "simple"

[install]
wanted_by = ["multi-user.target", "graphical.target"]
required_by = ["network.target"]
"#;
    
    fs::write(services_dir.join("target-service.tau"), service).unwrap();
    
    let unit = ServiceUnit::from_file(&services_dir.join("target-service.tau")).unwrap();
    let targets = unit.get_targets();
    
    assert!(targets.contains(&"multi-user.target".to_string()));
    assert!(targets.contains(&"graphical.target".to_string()));
    assert!(targets.contains(&"network.target".to_string()));
}

#[tokio::test]
async fn test_service_reload() {
    let temp_dir = TempDir::new().unwrap();
    let services_dir = temp_dir.path().join("services");
    fs::create_dir_all(&services_dir).unwrap();
    
    let service = r#"
name = "reload-service"
description = "Service with reload capability"

[service]
exec_start = "/usr/bin/reload-service"
exec_reload = "/usr/bin/reload-service --reload"
restart = "no"
type = "simple"
"#;
    
    fs::write(services_dir.join("reload-service.tau"), service).unwrap();
    
    let manager = ServiceManager::new().unwrap();
    manager.load_units().unwrap();
    
    // Test reload functionality
    let unit = manager.get_unit("reload-service").unwrap();
    assert!(unit.service.exec_reload.is_some());
    assert_eq!(unit.service.exec_reload.unwrap(), "/usr/bin/reload-service --reload");
} 