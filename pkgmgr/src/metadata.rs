use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum MetadataError {
    #[error("Invalid manifest: {0}")]
    InvalidManifest(String),
    #[error("Missing required field: {0}")]
    MissingField(String),
    #[error("Invalid version format: {0}")]
    InvalidVersion(String),
    #[error("Invalid dependency format: {0}")]
    InvalidDependency(String),
    #[error("Circular dependency detected")]
    CircularDependency,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Dependency {
    pub name: String,
    pub version: String,
    pub optional: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PackageSignature {
    pub algorithm: String, // "ed25519", "rsa", etc.
    pub signature: String, // base64 encoded signature
    pub public_key: String, // base64 encoded public key
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TauPkgManifest {
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub author: Option<String>,
    pub license: Option<String>,
    pub dependencies: Option<Vec<Dependency>>,
    pub optional_dependencies: Option<Vec<Dependency>>,
    pub permissions: Option<Vec<String>>,
    pub signature: Option<PackageSignature>,
    pub files: Option<Vec<String>>,
    pub scripts: Option<HashMap<String, String>>,
    pub architecture: Option<String>,
    pub size: Option<u64>,
    pub checksum: Option<String>,
}

impl TauPkgManifest {
    pub fn from_toml(toml_str: &str) -> Result<Self, toml::de::Error> {
        toml::from_str(toml_str)
    }
    
    pub fn from_json(json_str: &str) -> Result<Self, serde_json::Error> {
        serde_json::from_str(json_str)
    }
    
    pub fn validate(&self) -> Result<(), MetadataError> {
        if self.name.is_empty() { 
            return Err(MetadataError::MissingField("name".into())); 
        }
        if self.version.is_empty() { 
            return Err(MetadataError::MissingField("version".into())); 
        }
        
        // Validate version format (semantic versioning)
        if !self.is_valid_version(&self.version) {
            return Err(MetadataError::InvalidVersion(self.version.clone()));
        }
        
        // Validate dependencies
        if let Some(deps) = &self.dependencies {
            for dep in deps {
                if dep.name.is_empty() {
                    return Err(MetadataError::InvalidDependency("empty dependency name".into()));
                }
                if !self.is_valid_version(&dep.version) {
                    return Err(MetadataError::InvalidVersion(dep.version.clone()));
                }
            }
        }
        
        Ok(())
    }
    
    fn is_valid_version(&self, version: &str) -> bool {
        // Simple semantic version validation
        let parts: Vec<&str> = version.split('.').collect();
        if parts.len() != 3 {
            return false;
        }
        
        for part in parts {
            if part.parse::<u32>().is_err() {
                return false;
            }
        }
        true
    }
    
    pub fn get_all_dependencies(&self) -> Vec<Dependency> {
        let mut deps = Vec::new();
        
        if let Some(dependencies) = &self.dependencies {
            deps.extend(dependencies.clone());
        }
        
        if let Some(optional_deps) = &self.optional_dependencies {
            deps.extend(optional_deps.clone());
        }
        
        deps
    }
    
    pub fn has_dependency(&self, dep_name: &str) -> bool {
        self.get_all_dependencies()
            .iter()
            .any(|dep| dep.name == dep_name)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PackageInfo {
    pub manifest: TauPkgManifest,
    pub installed: bool,
    pub install_path: Option<String>,
    pub install_date: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DependencyGraph {
    pub packages: HashMap<String, PackageInfo>,
    pub dependencies: HashMap<String, Vec<String>>,
}

impl DependencyGraph {
    pub fn new() -> Self {
        Self {
            packages: HashMap::new(),
            dependencies: HashMap::new(),
        }
    }
    
    pub fn add_package(&mut self, package: PackageInfo) {
        let name = package.manifest.name.clone();
        self.packages.insert(name.clone(), package);
    }
    
    pub fn add_dependency(&mut self, package: &str, dependency: &str) {
        self.dependencies
            .entry(package.to_string())
            .or_insert_with(Vec::new)
            .push(dependency.to_string());
    }
    
    pub fn resolve_dependencies(&self, package_name: &str) -> Result<Vec<String>, MetadataError> {
        let mut resolved = Vec::new();
        let mut visited = std::collections::HashSet::new();
        let mut visiting = std::collections::HashSet::new();
        
        self.dfs_resolve(package_name, &mut resolved, &mut visited, &mut visiting)?;
        
        Ok(resolved)
    }
    
    fn dfs_resolve(
        &self,
        package: &str,
        resolved: &mut Vec<String>,
        visited: &mut std::collections::HashSet<String>,
        visiting: &mut std::collections::HashSet<String>,
    ) -> Result<(), MetadataError> {
        if visited.contains(package) {
            return Ok(());
        }
        
        if visiting.contains(package) {
            return Err(MetadataError::CircularDependency);
        }
        
        visiting.insert(package.to_string());
        
        if let Some(deps) = self.dependencies.get(package) {
            for dep in deps {
                self.dfs_resolve(dep, resolved, visited, visiting)?;
            }
        }
        
        visiting.remove(package);
        visited.insert(package.to_string());
        resolved.push(package.to_string());
        
        Ok(())
    }
} 