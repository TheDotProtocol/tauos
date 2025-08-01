use std::fs;
use std::path::Path;
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct AppManifest {
    pub id: String,
    pub name: String,
    pub category: Option<String>,
    pub icon: Option<String>,
    pub exec: String,
    pub favorite: Option<bool>,
}

pub fn discover_apps(apps_dir: &str) -> Vec<AppManifest> {
    let mut apps = Vec::new();
    if let Ok(entries) = fs::read_dir(apps_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                let manifest_path = path.join("tau-app.json");
                if manifest_path.exists() {
                    if let Ok(data) = fs::read_to_string(&manifest_path) {
                        if let Ok(manifest) = serde_json::from_str::<AppManifest>(&data) {
                            apps.push(manifest);
                        }
                    }
                }
            }
        }
    }
    apps
} 