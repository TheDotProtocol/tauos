use gtk4 as gtk;
use gtk::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Clone, Serialize, Deserialize)]
pub struct App {
    pub id: String,
    pub name: String,
    pub description: String,
    pub version: String,
    pub size: String,
    pub rating: f32,
    pub downloads: u32,
    pub category: String,
    pub icon: String,
    pub price: String,
    pub developer: String,
    pub screenshots: Vec<String>,
    pub requirements: String,
    pub changelog: String,
    pub is_installed: bool,
    pub is_updating: bool,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub icon: String,
    pub app_count: u32,
}

pub struct AppCatalog {
    apps: Arc<Mutex<Vec<App>>>,
    categories: Arc<Mutex<Vec<Category>>>,
    search_results: Arc<Mutex<Vec<App>>>,
}

impl AppCatalog {
    pub fn new() -> Self {
        let apps = vec![
            App {
                id: "tau-browser".to_string(),
                name: "🌐 Tau Browser".to_string(),
                description: "Privacy-first web browser with built-in ad blocking and tracking protection".to_string(),
                version: "1.0.0".to_string(),
                size: "25.4 MB".to_string(),
                rating: 4.8,
                downloads: 1250,
                category: "Internet".to_string(),
                icon: "🌐".to_string(),
                price: "Free".to_string(),
                developer: "TauOS Team".to_string(),
                screenshots: vec!["screenshot1.png".to_string(), "screenshot2.png".to_string()],
                requirements: "TauOS 1.0 or later".to_string(),
                changelog: "Initial release with privacy features".to_string(),
                is_installed: false,
                is_updating: false,
            },
            App {
                id: "tau-mail".to_string(),
                name: "📧 TauMail".to_string(),
                description: "Secure email client with end-to-end encryption".to_string(),
                version: "1.0.0".to_string(),
                size: "18.7 MB".to_string(),
                rating: 4.9,
                downloads: 980,
                category: "Productivity".to_string(),
                icon: "📧".to_string(),
                price: "Free".to_string(),
                developer: "TauOS Team".to_string(),
                screenshots: vec!["screenshot1.png".to_string(), "screenshot2.png".to_string()],
                requirements: "TauOS 1.0 or later".to_string(),
                changelog: "Initial release with encryption".to_string(),
                is_installed: false,
                is_updating: false,
            },
            App {
                id: "tau-cloud".to_string(),
                name: "☁️ TauCloud".to_string(),
                description: "Private cloud storage with zero-knowledge encryption".to_string(),
                version: "1.0.0".to_string(),
                size: "32.1 MB".to_string(),
                rating: 4.7,
                downloads: 756,
                category: "Productivity".to_string(),
                icon: "☁️".to_string(),
                price: "Free".to_string(),
                developer: "TauOS Team".to_string(),
                screenshots: vec!["screenshot1.png".to_string(), "screenshot2.png".to_string()],
                requirements: "TauOS 1.0 or later".to_string(),
                changelog: "Initial release with cloud sync".to_string(),
                is_installed: false,
                is_updating: false,
            },
            App {
                id: "tau-explorer".to_string(),
                name: "📁 Tau Explorer".to_string(),
                description: "File manager with TauCloud integration".to_string(),
                version: "1.0.0".to_string(),
                size: "15.3 MB".to_string(),
                rating: 4.6,
                downloads: 623,
                category: "Productivity".to_string(),
                icon: "📁".to_string(),
                price: "Free".to_string(),
                developer: "TauOS Team".to_string(),
                screenshots: vec!["screenshot1.png".to_string(), "screenshot2.png".to_string()],
                requirements: "TauOS 1.0 or later".to_string(),
                changelog: "Initial release with cloud integration".to_string(),
                is_installed: false,
                is_updating: false,
            },
        ];
        
        let categories = vec![
            Category {
                id: "all".to_string(),
                name: "All".to_string(),
                icon: "🛒".to_string(),
                app_count: apps.len() as u32,
            },
            Category {
                id: "games".to_string(),
                name: "Games".to_string(),
                icon: "🎮".to_string(),
                app_count: 12,
            },
            Category {
                id: "productivity".to_string(),
                name: "Productivity".to_string(),
                icon: "📱".to_string(),
                app_count: 8,
            },
            Category {
                id: "music".to_string(),
                name: "Music".to_string(),
                icon: "🎵".to_string(),
                app_count: 6,
            },
            Category {
                id: "video".to_string(),
                name: "Video".to_string(),
                icon: "📹".to_string(),
                app_count: 4,
            },
            Category {
                id: "education".to_string(),
                name: "Education".to_string(),
                icon: "📚".to_string(),
                app_count: 9,
            },
            Category {
                id: "graphics".to_string(),
                name: "Graphics".to_string(),
                icon: "🎨".to_string(),
                app_count: 7,
            },
            Category {
                id: "developer".to_string(),
                name: "Developer".to_string(),
                icon: "🔧".to_string(),
                app_count: 15,
            },
            Category {
                id: "security".to_string(),
                name: "Security".to_string(),
                icon: "🛡️".to_string(),
                app_count: 5,
            },
            Category {
                id: "internet".to_string(),
                name: "Internet".to_string(),
                icon: "🌐".to_string(),
                app_count: 3,
            },
        ];
        
        Self {
            apps: Arc::new(Mutex::new(apps)),
            categories: Arc::new(Mutex::new(categories)),
            search_results: Arc::new(Mutex::new(Vec::new())),
        }
    }
    
    pub fn get_all_apps(&self) -> Vec<App> {
        if let Ok(apps) = self.apps.lock() {
            apps.clone()
        } else {
            Vec::new()
        }
    }
    
    pub fn get_apps_by_category(&self, category: &str) -> Vec<App> {
        if let Ok(apps) = self.apps.lock() {
            if category == "all" {
                apps.clone()
            } else {
                apps.iter()
                    .filter(|app| app.category.to_lowercase() == category.to_lowercase())
                    .cloned()
                    .collect()
            }
        } else {
            Vec::new()
        }
    }
    
    pub fn search_apps(&self, query: &str) -> Vec<App> {
        if let Ok(apps) = self.apps.lock() {
            apps.iter()
                .filter(|app| {
                    app.name.to_lowercase().contains(&query.to_lowercase()) ||
                    app.description.to_lowercase().contains(&query.to_lowercase()) ||
                    app.developer.to_lowercase().contains(&query.to_lowercase())
                })
                .cloned()
                .collect()
        } else {
            Vec::new()
        }
    }
    
    pub fn get_featured_apps(&self) -> Vec<App> {
        if let Ok(apps) = self.apps.lock() {
            apps.iter()
                .filter(|app| app.rating >= 4.5)
                .take(4)
                .cloned()
                .collect()
        } else {
            Vec::new()
        }
    }
    
    pub fn get_categories(&self) -> Vec<Category> {
        if let Ok(categories) = self.categories.lock() {
            categories.clone()
        } else {
            Vec::new()
        }
    }
    
    pub fn get_app_by_id(&self, id: &str) -> Option<App> {
        if let Ok(apps) = self.apps.lock() {
            apps.iter().find(|app| app.id == id).cloned()
        } else {
            None
        }
    }
    
    pub fn install_app(&self, app_id: &str) -> Result<(), String> {
        println!("📦 Installing app: {}", app_id);
        
        // Simulate installation process
        for i in 0..=100 {
            println!("📥 Installation progress: {}%", i);
            std::thread::sleep(std::time::Duration::from_millis(50));
        }
        
        println!("✅ App installed successfully: {}", app_id);
        Ok(())
    }
    
    pub fn uninstall_app(&self, app_id: &str) -> Result<(), String> {
        println!("🗑️ Uninstalling app: {}", app_id);
        
        // Simulate uninstallation process
        for i in 0..=100 {
            println!("🗑️ Uninstallation progress: {}%", i);
            std::thread::sleep(std::time::Duration::from_millis(30));
        }
        
        println!("✅ App uninstalled successfully: {}", app_id);
        Ok(())
    }
    
    pub fn update_app(&self, app_id: &str) -> Result<(), String> {
        println!("🔄 Updating app: {}", app_id);
        
        // Simulate update process
        for i in 0..=100 {
            println!("📥 Update progress: {}%", i);
            std::thread::sleep(std::time::Duration::from_millis(40));
        }
        
        println!("✅ App updated successfully: {}", app_id);
        Ok(())
    }
    
    pub fn get_installed_apps(&self) -> Vec<App> {
        if let Ok(apps) = self.apps.lock() {
            apps.iter()
                .filter(|app| app.is_installed)
                .cloned()
                .collect()
        } else {
            Vec::new()
        }
    }
    
    pub fn get_updates_available(&self) -> Vec<App> {
        if let Ok(apps) = self.apps.lock() {
            apps.iter()
                .filter(|app| app.is_installed && !app.is_updating)
                .cloned()
                .collect()
        } else {
            Vec::new()
        }
    }
}

pub fn create_app_details_dialog(app: &App) -> gtk::Dialog {
    let dialog = gtk::Dialog::new();
    dialog.set_title(Some(&format!("{} - App Details", app.name)));
    dialog.set_default_size(600, 500);
    
    let content_area = dialog.content_area();
    let main_box = gtk::Box::new(gtk::Orientation::Vertical, 16);
    main_box.set_margin_start(16);
    main_box.set_margin_end(16);
    main_box.set_margin_top(16);
    main_box.set_margin_bottom(16);
    
    // App header
    let header_box = gtk::Box::new(gtk::Orientation::Horizontal, 16);
    
    let icon = gtk::Label::new(Some(&app.icon));
    icon.add_css_class("app-detail-icon");
    header_box.append(&icon);
    
    let info_box = gtk::Box::new(gtk::Orientation::Vertical, 8);
    
    let name_label = gtk::Label::new(Some(&app.name));
    name_label.add_css_class("app-detail-name");
    info_box.append(&name_label);
    
    let developer_label = gtk::Label::new(Some(&app.developer));
    developer_label.add_css_class("app-detail-developer");
    info_box.append(&developer_label);
    
    let rating_label = gtk::Label::new(Some(&format!("⭐ {} ({})", app.rating, app.downloads)));
    rating_label.add_css_class("app-detail-rating");
    info_box.append(&rating_label);
    
    header_box.append(&info_box);
    main_box.append(&header_box);
    
    // App description
    let desc_label = gtk::Label::new(Some(&app.description));
    desc_label.add_css_class("app-detail-description");
    main_box.append(&desc_label);
    
    // App details
    let details_box = gtk::Box::new(gtk::Orientation::Horizontal, 16);
    
    let size_label = gtk::Label::new(Some(&format!("Size: {}", app.size)));
    size_label.add_css_class("app-detail-info");
    details_box.append(&size_label);
    
    let version_label = gtk::Label::new(Some(&format!("Version: {}", app.version)));
    version_label.add_css_class("app-detail-info");
    details_box.append(&version_label);
    
    let category_label = gtk::Label::new(Some(&format!("Category: {}", app.category)));
    category_label.add_css_class("app-detail-info");
    details_box.append(&category_label);
    
    main_box.append(&details_box);
    
    // Action buttons
    let action_box = gtk::Box::new(gtk::Orientation::Horizontal, 8);
    
    let install_button = gtk::Button::new();
    install_button.set_label(Some("Install"));
    install_button.add_css_class("install-button");
    action_box.append(&install_button);
    
    let cancel_button = gtk::Button::new();
    cancel_button.set_label(Some("Cancel"));
    cancel_button.add_css_class("cancel-button");
    action_box.append(&cancel_button);
    
    main_box.append(&action_box);
    
    content_area.append(&main_box);
    
    dialog
} 