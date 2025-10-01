use std::fs;
use std::path::PathBuf;
use tempfile::TempDir;
use tau_pkg::package_manager::PackageManager;
use tau_pkg::metadata::{TauPkgManifest, Dependency};
use tau_pkg::signature::{SignatureVerifier, generate_keypair, sign_package_data};

#[test]
fn test_package_installation_with_dependencies() {
    let temp_dir = TempDir::new().unwrap();
    let install_root = temp_dir.path().to_path_buf();
    
    // Create package manager
    let mut pm = PackageManager::new(install_root).unwrap();
    
    // Test manifest validation
    let manifest = TauPkgManifest {
        name: "test-app".to_string(),
        version: "1.0.0".to_string(),
        description: Some("Test application".to_string()),
        author: Some("Test Author".to_string()),
        license: Some("MIT".to_string()),
        dependencies: Some(vec![
            Dependency {
                name: "gtk4".to_string(),
                version: "4.0.0".to_string(),
                optional: Some(false),
            }
        ]),
        optional_dependencies: None,
        permissions: Some(vec!["network".to_string()]),
        signature: None,
        files: None,
        scripts: None,
        architecture: Some("x86_64".to_string()),
        size: Some(1024),
        checksum: Some("test_checksum".to_string()),
    };
    
    // Validate manifest
    assert!(manifest.validate().is_ok());
    
    // Test dependency resolution
    let dependencies = pm.resolve_dependencies(&manifest).unwrap();
    assert_eq!(dependencies.len(), 1);
    assert_eq!(dependencies[0], "gtk4");
}

#[test]
fn test_signature_verification() {
    let mut verifier = SignatureVerifier::new();
    
    // Generate test keypair
    let (public_key, private_key) = generate_keypair().unwrap();
    
    // Add public key to trusted keys
    verifier.add_trusted_key(&public_key);
    
    // Test data
    let test_data = b"Hello, Tau OS!";
    
    // Sign the data
    let signature_data = sign_package_data(&private_key, test_data).unwrap();
    
    // Create package signature
    let package_signature = tau_pkg::metadata::PackageSignature {
        algorithm: "ed25519".to_string(),
        signature: base64::encode(&signature_data),
        public_key: base64::encode(&public_key),
    };
    
    // Verify signature
    let is_valid = verifier.verify_package_signature(&package_signature, test_data).unwrap();
    assert!(is_valid);
}

#[test]
fn test_dependency_graph() {
    let mut graph = tau_pkg::metadata::DependencyGraph::new();
    
    // Add packages
    let manifest1 = TauPkgManifest {
        name: "app-a".to_string(),
        version: "1.0.0".to_string(),
        description: None,
        author: None,
        license: None,
        dependencies: Some(vec![
            Dependency {
                name: "lib-b".to_string(),
                version: "1.0.0".to_string(),
                optional: Some(false),
            }
        ]),
        optional_dependencies: None,
        permissions: None,
        signature: None,
        files: None,
        scripts: None,
        architecture: None,
        size: None,
        checksum: None,
    };
    
    let package_info1 = tau_pkg::metadata::PackageInfo {
        manifest: manifest1,
        installed: true,
        install_path: Some("/usr/local/packages/app-a".to_string()),
        install_date: Some("1234567890".to_string()),
    };
    
    graph.add_package(package_info1);
    graph.add_dependency("app-a", "lib-b");
    
    // Test dependency resolution
    let resolved = graph.resolve_dependencies("app-a").unwrap();
    assert_eq!(resolved.len(), 2);
    assert_eq!(resolved[0], "lib-b");
    assert_eq!(resolved[1], "app-a");
}

#[test]
fn test_circular_dependency_detection() {
    let mut graph = tau_pkg::metadata::DependencyGraph::new();
    
    // Create circular dependency: A -> B -> C -> A
    graph.add_dependency("app-a", "lib-b");
    graph.add_dependency("lib-b", "lib-c");
    graph.add_dependency("lib-c", "app-a");
    
    // This should fail with circular dependency error
    let result = graph.resolve_dependencies("app-a");
    assert!(result.is_err());
    
    match result.unwrap_err() {
        tau_pkg::metadata::MetadataError::CircularDependency => {
            // Expected error
        }
        _ => panic!("Expected CircularDependency error"),
    }
}

#[test]
fn test_manifest_validation() {
    // Test valid manifest
    let valid_manifest = TauPkgManifest {
        name: "test-app".to_string(),
        version: "1.0.0".to_string(),
        description: None,
        author: None,
        license: None,
        dependencies: None,
        optional_dependencies: None,
        permissions: None,
        signature: None,
        files: None,
        scripts: None,
        architecture: None,
        size: None,
        checksum: None,
    };
    
    assert!(valid_manifest.validate().is_ok());
    
    // Test invalid manifest (empty name)
    let invalid_manifest = TauPkgManifest {
        name: "".to_string(),
        version: "1.0.0".to_string(),
        description: None,
        author: None,
        license: None,
        dependencies: None,
        optional_dependencies: None,
        permissions: None,
        signature: None,
        files: None,
        scripts: None,
        architecture: None,
        size: None,
        checksum: None,
    };
    
    assert!(invalid_manifest.validate().is_err());
    
    // Test invalid version format
    let invalid_version_manifest = TauPkgManifest {
        name: "test-app".to_string(),
        version: "invalid-version".to_string(),
        description: None,
        author: None,
        license: None,
        dependencies: None,
        optional_dependencies: None,
        permissions: None,
        signature: None,
        files: None,
        scripts: None,
        architecture: None,
        size: None,
        checksum: None,
    };
    
    assert!(invalid_version_manifest.validate().is_err());
} 