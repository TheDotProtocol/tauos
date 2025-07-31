use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box as GtkBox, Label, Orientation, Button, Image, ListBox, ListBoxRow, Frame, ScrolledWindow, EventControllerKey, gdk, gdk::Display, Entry, ComboBoxText, ProgressBar, Revealer, Stack, Notebook, Separator, SearchEntry, FlowBox, FlowBoxChild, AspectFrame, Overlay, WindowControls, WindowTitle};
use gio::ApplicationFlags;
use std::cell::RefCell;
use std::rc::Rc;
use std::process::Command;
use std::thread;
use std::time::Duration;

#[derive(Clone)]
struct DesktopApp {
    id: String,
    name: String,
    description: String,
    icon: String,
    executable: String,
    category: String,
    installed: bool,
}

struct DesktopIntegration {
    apps: RefCell<Vec<DesktopApp>>,
    running_apps: RefCell<Vec<String>>,
    dock_apps: RefCell<Vec<String>>,
    file_associations: RefCell<std::collections::HashMap<String, String>>,
}

impl DesktopIntegration {
    fn new() -> Self {
        let apps = vec![
            DesktopApp {
                id: "tau-home".to_string(),
                name: "Tau Home".to_string(),
                description: "Desktop Environment".to_string(),
                icon: "🏠".to_string(),
                executable: "tauhome".to_string(),
                category: "System".to_string(),
                installed: true,
            },
            DesktopApp {
                id: "tau-browser".to_string(),
                name: "Tau Browser".to_string(),
                description: "Privacy-first Web Browser".to_string(),
                icon: "🌐".to_string(),
                executable: "taubrowser".to_string(),
                category: "Internet".to_string(),
                installed: true,
            },
            DesktopApp {
                id: "tau-mail".to_string(),
                name: "TauMail".to_string(),
                description: "Email Client".to_string(),
                icon: "📧".to_string(),
                executable: "taumail".to_string(),
                category: "Communication".to_string(),
                installed: true,
            },
            DesktopApp {
                id: "tau-cloud".to_string(),
                name: "TauCloud".to_string(),
                description: "Cloud Storage".to_string(),
                icon: "☁️".to_string(),
                executable: "taucloud".to_string(),
                category: "Storage".to_string(),
                installed: true,
            },
            DesktopApp {
                id: "tau-media".to_string(),
                name: "Tau Media Player".to_string(),
                description: "Media Player".to_string(),
                icon: "🎵".to_string(),
                executable: "taumedia".to_string(),
                category: "Multimedia".to_string(),
                installed: true,
            },
            DesktopApp {
                id: "tau-settings".to_string(),
                name: "Tau Settings".to_string(),
                description: "System Settings".to_string(),
                icon: "⚙️".to_string(),
                executable: "tausettings".to_string(),
                category: "System".to_string(),
                installed: true,
            },
            DesktopApp {
                id: "tau-store".to_string(),
                name: "Tau Store".to_string(),
                description: "Application Store".to_string(),
                icon: "🛒".to_string(),
                executable: "taustore".to_string(),
                category: "System".to_string(),
                installed: true,
            },
        ];

        let mut file_associations = std::collections::HashMap::new();
        file_associations.insert(".html".to_string(), "tau-browser".to_string());
        file_associations.insert(".htm".to_string(), "tau-browser".to_string());
        file_associations.insert(".pdf".to_string(), "tau-browser".to_string());
        file_associations.insert(".mp3".to_string(), "tau-media".to_string());
        file_associations.insert(".mp4".to_string(), "tau-media".to_string());
        file_associations.insert(".avi".to_string(), "tau-media".to_string());
        file_associations.insert(".mkv".to_string(), "tau-media".to_string());
        file_associations.insert(".jpg".to_string(), "tau-cloud".to_string());
        file_associations.insert(".png".to_string(), "tau-cloud".to_string());
        file_associations.insert(".txt".to_string(), "tau-editor".to_string());

        Self {
            apps: RefCell::new(apps),
            running_apps: RefCell::new(Vec::new()),
            dock_apps: RefCell::new(vec![
                "tau-home".to_string(),
                "tau-browser".to_string(),
                "tau-mail".to_string(),
                "tau-cloud".to_string(),
                "tau-media".to_string(),
                "tau-settings".to_string(),
                "tau-store".to_string(),
            ]),
            file_associations: RefCell::new(file_associations),
        }
    }

    fn launch_app(&self, app_id: &str) -> Result<(), String> {
        let apps = self.apps.borrow();
        if let Some(app) = apps.iter().find(|a| a.id == app_id) {
            // Launch the application
            let output = Command::new(&app.executable)
                .spawn()
                .map_err(|e| format!("Failed to launch {}: {}", app.name, e))?;

            // Add to running apps
            let mut running = self.running_apps.borrow_mut();
            if !running.contains(&app_id.to_string()) {
                running.push(app_id.to_string());
            }

            Ok(())
        } else {
            Err(format!("Application {} not found", app_id))
        }
    }

    fn close_app(&self, app_id: &str) -> Result<(), String> {
        // Kill the application process
        let output = Command::new("pkill")
            .arg("-f")
            .arg(app_id)
            .output()
            .map_err(|e| format!("Failed to close {}: {}", app_id, e))?;

        // Remove from running apps
        let mut running = self.running_apps.borrow_mut();
        running.retain(|id| id != app_id);

        Ok(())
    }

    fn get_running_apps(&self) -> Vec<String> {
        self.running_apps.borrow().clone()
    }

    fn get_dock_apps(&self) -> Vec<DesktopApp> {
        let apps = self.apps.borrow();
        let dock_ids = self.dock_apps.borrow();
        
        apps.iter()
            .filter(|app| dock_ids.contains(&app.id))
            .cloned()
            .collect()
    }

    fn open_file(&self, file_path: &str) -> Result<(), String> {
        let extension = std::path::Path::new(file_path)
            .extension()
            .and_then(|ext| ext.to_str())
            .unwrap_or("");

        let associations = self.file_associations.borrow();
        if let Some(app_id) = associations.get(&format!(".{}", extension)) {
            // Launch the associated app with the file
            let apps = self.apps.borrow();
            if let Some(app) = apps.iter().find(|a| a.id == *app_id) {
                let output = Command::new(&app.executable)
                    .arg(file_path)
                    .spawn()
                    .map_err(|e| format!("Failed to open file: {}", e))?;
                Ok(())
            } else {
                Err(format!("No app associated with .{} files", extension))
            }
        } else {
            // Default to file manager
            let output = Command::new("taucloud")
                .arg(file_path)
                .spawn()
                .map_err(|e| format!("Failed to open file: {}", e))?;
            Ok(())
        }
    }

    fn add_to_dock(&self, app_id: &str) -> Result<(), String> {
        let mut dock_apps = self.dock_apps.borrow_mut();
        if !dock_apps.contains(&app_id.to_string()) {
            dock_apps.push(app_id.to_string());
        }
        Ok(())
    }

    fn remove_from_dock(&self, app_id: &str) -> Result<(), String> {
        let mut dock_apps = self.dock_apps.borrow_mut();
        dock_apps.retain(|id| id != app_id);
        Ok(())
    }

    fn get_system_info(&self) -> SystemInfo {
        SystemInfo {
            cpu_usage: 23.5,
            memory_usage: 4.2,
            disk_usage: 45.2,
            network_status: "Connected".to_string(),
            privacy_status: "Secure".to_string(),
            battery_level: 87,
            battery_charging: true,
        }
    }
}

#[derive(Clone)]
struct SystemInfo {
    cpu_usage: f32,
    memory_usage: f32,
    disk_usage: f32,
    network_status: String,
    privacy_status: String,
    battery_level: u32,
    battery_charging: bool,
}

pub fn create_desktop_integration() -> Rc<DesktopIntegration> {
    Rc::new(DesktopIntegration::new())
}

pub fn create_app_launcher(integration: &Rc<DesktopIntegration>) -> GtkBox {
    let launcher = GtkBox::new(Orientation::Vertical, 0);
    launcher.add_css_class("app-launcher");

    // Search bar
    let search_entry = SearchEntry::new();
    search_entry.set_placeholder_text(Some("Search applications..."));
    launcher.append(&search_entry);

    // Apps grid
    let apps_scroll = ScrolledWindow::new();
    let apps_flow = FlowBox::new();
    apps_flow.set_selection_mode(gtk4::SelectionMode::None);
    apps_flow.set_max_children_per_line(4);
    apps_flow.set_min_children_per_line(2);

    let apps = integration.apps.borrow();
    for app in apps.iter() {
        let app_card = create_app_card(app, integration);
        apps_flow.append(&app_card);
    }

    apps_scroll.set_child(Some(&apps_flow));
    launcher.append(&apps_scroll);

    launcher
}

fn create_app_card(app: &DesktopApp, integration: &Rc<DesktopIntegration>) -> FlowBoxChild {
    let child = FlowBoxChild::new();
    let card = Frame::new(None);
    card.add_css_class("app-card");
    card.set_margin_start(10);
    card.set_margin_end(10);
    card.set_margin_top(10);
    card.set_margin_bottom(10);

    let card_content = GtkBox::new(Orientation::Vertical, 10);
    card_content.set_margin_start(15);
    card_content.set_margin_end(15);
    card_content.set_margin_top(15);
    card_content.set_margin_bottom(15);

    // App icon
    let icon_label = Label::new(Some(&app.icon));
    icon_label.add_css_class("app-icon");
    card_content.append(&icon_label);

    // App name
    let name_label = Label::new(Some(&app.name));
    name_label.add_css_class("app-name");
    card_content.append(&name_label);

    // App description
    let desc_label = Label::new(Some(&app.description));
    desc_label.add_css_class("app-description");
    desc_label.set_wrap(true);
    card_content.append(&desc_label);

    // Launch button
    let launch_button = Button::with_label("Launch");
    launch_button.add_css_class("launch-button");
    
    let app_id = app.id.clone();
    let integration_clone = Rc::clone(integration);
    launch_button.connect_clicked(move |_| {
        if let Err(e) = integration_clone.launch_app(&app_id) {
            eprintln!("Failed to launch app: {}", e);
        }
    });

    card_content.append(&launch_button);
    card.set_child(Some(&card_content));
    child.set_child(Some(&card));

    child
}

pub fn create_dock(integration: &Rc<DesktopIntegration>) -> GtkBox {
    let dock = GtkBox::new(Orientation::Horizontal, 8);
    dock.add_css_class("dock");
    dock.set_margin_start(20);
    dock.set_margin_end(20);
    dock.set_margin_bottom(20);

    let dock_apps = integration.get_dock_apps();
    for app in dock_apps {
        let dock_item = create_dock_item(&app, integration);
        dock.append(&dock_item);
    }

    dock
}

fn create_dock_item(app: &DesktopApp, integration: &Rc<DesktopIntegration>) -> Button {
    let dock_item = Button::new();
    dock_item.add_css_class("dock-item");
    dock_item.set_size_request(50, 50);

    let icon_label = Label::new(Some(&app.icon));
    icon_label.add_css_class("dock-icon");
    dock_item.set_child(Some(&icon_label));

    let app_id = app.id.clone();
    let integration_clone = Rc::clone(integration);
    dock_item.connect_clicked(move |_| {
        if let Err(e) = integration_clone.launch_app(&app_id) {
            eprintln!("Failed to launch app: {}", e);
        }
    });

    dock_item
}

pub fn create_system_tray(integration: &Rc<DesktopIntegration>) -> GtkBox {
    let tray = GtkBox::new(Orientation::Horizontal, 10);
    tray.add_css_class("system-tray");

    // System info
    let info = integration.get_system_info();
    
    // CPU usage
    let cpu_label = Label::new(Some(&format!("CPU: {:.1}%", info.cpu_usage)));
    tray.append(&cpu_label);

    // Memory usage
    let memory_label = Label::new(Some(&format!("RAM: {:.1}GB", info.memory_usage)));
    tray.append(&memory_label);

    // Network status
    let network_label = Label::new(Some(&info.network_status));
    tray.append(&network_label);

    // Privacy status
    let privacy_label = Label::new(Some(&info.privacy_status));
    tray.append(&privacy_label);

    // Battery
    let battery_icon = if info.battery_charging { "🔌" } else { "🔋" };
    let battery_label = Label::new(Some(&format!("{} {}%", battery_icon, info.battery_level)));
    tray.append(&battery_label);

    tray
}

pub fn create_file_associations() -> std::collections::HashMap<String, String> {
    let mut associations = std::collections::HashMap::new();
    
    // Web files
    associations.insert(".html".to_string(), "tau-browser".to_string());
    associations.insert(".htm".to_string(), "tau-browser".to_string());
    associations.insert(".pdf".to_string(), "tau-browser".to_string());
    
    // Media files
    associations.insert(".mp3".to_string(), "tau-media".to_string());
    associations.insert(".mp4".to_string(), "tau-media".to_string());
    associations.insert(".avi".to_string(), "tau-media".to_string());
    associations.insert(".mkv".to_string(), "tau-media".to_string());
    associations.insert(".wav".to_string(), "tau-media".to_string());
    associations.insert(".flac".to_string(), "tau-media".to_string());
    
    // Image files
    associations.insert(".jpg".to_string(), "tau-cloud".to_string());
    associations.insert(".jpeg".to_string(), "tau-cloud".to_string());
    associations.insert(".png".to_string(), "tau-cloud".to_string());
    associations.insert(".gif".to_string(), "tau-cloud".to_string());
    
    // Document files
    associations.insert(".txt".to_string(), "tau-editor".to_string());
    associations.insert(".md".to_string(), "tau-editor".to_string());
    associations.insert(".doc".to_string(), "tau-editor".to_string());
    associations.insert(".docx".to_string(), "tau-editor".to_string());
    
    associations
} 