use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Box, Button, Label, Notebook, Switch, Entry, ComboBoxText, SpinButton, Adjustment, ListBox, ListBoxRow, FlowBox, FlowBoxChild, Image, Revealer, SearchEntry, ScrolledWindow, ProgressBar};
use gtk::glib;
use gtk::gio;
use gtk::adw;
use gtk::gdk;
use gtk::gdk_pixbuf;
use gtk::cairo;
use gtk::pango;
use std::collections::HashMap;

#[derive(Debug, Clone)]
struct App {
    id: String,
    name: String,
    description: String,
    category: String,
    version: String,
    size: String,
    rating: f32,
    privacy_score: u8,
    is_installed: bool,
    icon_path: Option<String>,
    developer: String,
    price: String,
    open_source: bool,
    telemetry: bool,
    permissions: Vec<String>,
}

#[derive(Debug)]
struct TauStore {
    apps: Vec<App>,
    installed_apps: Vec<String>,
    search_query: String,
    selected_category: String,
    sort_by: String,
    show_installed_only: bool,
    show_open_source_only: bool,
}

impl TauStore {
    fn new() -> Self {
        let mut apps = vec![
            App {
                id: "tau-browser".to_string(),
                name: "Tau Browser".to_string(),
                description: "Privacy-first web browser with built-in ad blocking and tracking protection".to_string(),
                category: "Internet".to_string(),
                version: "1.0.0".to_string(),
                size: "45 MB".to_string(),
                rating: 4.8,
                privacy_score: 95,
                is_installed: true,
                icon_path: Some("icons/tau-browser.png".to_string()),
                developer: "TauOS Team".to_string(),
                price: "Free".to_string(),
                open_source: true,
                telemetry: false,
                permissions: vec!["Network Access".to_string(), "File System".to_string()],
            },
            App {
                id: "tau-mail".to_string(),
                name: "TauMail".to_string(),
                description: "Encrypted email client with end-to-end encryption and zero tracking".to_string(),
                category: "Communication".to_string(),
                version: "1.0.0".to_string(),
                size: "32 MB".to_string(),
                rating: 4.9,
                privacy_score: 98,
                is_installed: true,
                icon_path: Some("icons/tau-mail.png".to_string()),
                developer: "TauOS Team".to_string(),
                price: "Free".to_string(),
                open_source: true,
                telemetry: false,
                permissions: vec!["Network Access".to_string(), "Email".to_string()],
            },
            App {
                id: "tau-cloud".to_string(),
                name: "TauCloud".to_string(),
                description: "Secure cloud storage with client-side encryption and zero-knowledge architecture".to_string(),
                category: "Productivity".to_string(),
                version: "1.0.0".to_string(),
                size: "28 MB".to_string(),
                rating: 4.7,
                privacy_score: 96,
                is_installed: true,
                icon_path: Some("icons/tau-cloud.png".to_string()),
                developer: "TauOS Team".to_string(),
                price: "Free".to_string(),
                open_source: true,
                telemetry: false,
                permissions: vec!["Network Access".to_string(), "File System".to_string()],
            },
            App {
                id: "tau-media".to_string(),
                name: "Tau Media Player".to_string(),
                description: "Privacy-first media player supporting all major audio and video formats".to_string(),
                category: "Multimedia".to_string(),
                version: "1.0.0".to_string(),
                size: "65 MB".to_string(),
                rating: 4.6,
                privacy_score: 92,
                is_installed: true,
                icon_path: Some("icons/tau-media.png".to_string()),
                developer: "TauOS Team".to_string(),
                price: "Free".to_string(),
                open_source: true,
                telemetry: false,
                permissions: vec!["Audio".to_string(), "Video".to_string(), "File System".to_string()],
            },
            App {
                id: "firefox".to_string(),
                name: "Firefox".to_string(),
                description: "Open source web browser with privacy features and customization options".to_string(),
                category: "Internet".to_string(),
                version: "120.0".to_string(),
                size: "85 MB".to_string(),
                rating: 4.5,
                privacy_score: 85,
                is_installed: false,
                icon_path: Some("icons/firefox.png".to_string()),
                developer: "Mozilla".to_string(),
                price: "Free".to_string(),
                open_source: true,
                telemetry: true,
                permissions: vec!["Network Access".to_string(), "File System".to_string()],
            },
            App {
                id: "libreoffice".to_string(),
                name: "LibreOffice".to_string(),
                description: "Complete office suite with word processor, spreadsheet, and presentation tools".to_string(),
                category: "Productivity".to_string(),
                version: "7.6.0".to_string(),
                size: "320 MB".to_string(),
                rating: 4.4,
                privacy_score: 88,
                is_installed: false,
                icon_path: Some("icons/libreoffice.png".to_string()),
                developer: "The Document Foundation".to_string(),
                price: "Free".to_string(),
                open_source: true,
                telemetry: false,
                permissions: vec!["File System".to_string(), "Printing".to_string()],
            },
            App {
                id: "gimp".to_string(),
                name: "GIMP".to_string(),
                description: "Professional image editing software with advanced tools and filters".to_string(),
                category: "Graphics".to_string(),
                version: "2.10.36".to_string(),
                size: "45 MB".to_string(),
                rating: 4.3,
                privacy_score: 90,
                is_installed: false,
                icon_path: Some("icons/gimp.png".to_string()),
                developer: "GIMP Team".to_string(),
                price: "Free".to_string(),
                open_source: true,
                telemetry: false,
                permissions: vec!["File System".to_string(), "Camera".to_string()],
            },
            App {
                id: "vlc".to_string(),
                name: "VLC Media Player".to_string(),
                description: "Versatile media player supporting virtually all audio and video formats".to_string(),
                category: "Multimedia".to_string(),
                version: "3.0.18".to_string(),
                size: "28 MB".to_string(),
                rating: 4.7,
                privacy_score: 87,
                is_installed: false,
                icon_path: Some("icons/vlc.png".to_string()),
                developer: "VideoLAN".to_string(),
                price: "Free".to_string(),
                open_source: true,
                telemetry: false,
                permissions: vec!["Audio".to_string(), "Video".to_string(), "File System".to_string()],
            },
        ];

        let installed_apps = vec![
            "tau-browser".to_string(),
            "tau-mail".to_string(),
            "tau-cloud".to_string(),
            "tau-media".to_string(),
        ];

        for app in &mut apps {
            app.is_installed = installed_apps.contains(&app.id);
        }

        TauStore {
            apps,
            installed_apps,
            search_query: String::new(),
            selected_category: "All".to_string(),
            sort_by: "Name".to_string(),
            show_installed_only: false,
            show_open_source_only: false,
        }
    }

    fn get_filtered_apps(&self) -> Vec<App> {
        let mut filtered = self.apps.clone();

        // Filter by search query
        if !self.search_query.is_empty() {
            filtered.retain(|app| {
                app.name.to_lowercase().contains(&self.search_query.to_lowercase()) ||
                app.description.to_lowercase().contains(&self.search_query.to_lowercase()) ||
                app.category.to_lowercase().contains(&self.search_query.to_lowercase())
            });
        }

        // Filter by category
        if self.selected_category != "All" {
            filtered.retain(|app| app.category == self.selected_category);
        }

        // Filter by installed status
        if self.show_installed_only {
            filtered.retain(|app| app.is_installed);
        }

        // Filter by open source
        if self.show_open_source_only {
            filtered.retain(|app| app.open_source);
        }

        // Sort apps
        match self.sort_by.as_str() {
            "Name" => filtered.sort_by(|a, b| a.name.cmp(&b.name)),
            "Rating" => filtered.sort_by(|a, b| b.rating.partial_cmp(&a.rating).unwrap()),
            "Privacy" => filtered.sort_by(|a, b| b.privacy_score.cmp(&a.privacy_score)),
            "Size" => filtered.sort_by(|a, b| a.size.cmp(&b.size)),
            _ => filtered.sort_by(|a, b| a.name.cmp(&b.name)),
        }

        filtered
    }

    fn get_categories(&self) -> Vec<String> {
        let mut categories = vec!["All".to_string()];
        for app in &self.apps {
            if !categories.contains(&app.category) {
                categories.push(app.category.clone());
            }
        }
        categories
    }

    fn install_app(&mut self, app_id: &str) {
        if let Some(app) = self.apps.iter_mut().find(|a| a.id == app_id) {
            app.is_installed = true;
            if !self.installed_apps.contains(&app_id.to_string()) {
                self.installed_apps.push(app_id.to_string());
            }
        }
    }

    fn uninstall_app(&mut self, app_id: &str) {
        if let Some(app) = self.apps.iter_mut().find(|a| a.id == app_id) {
            app.is_installed = false;
            self.installed_apps.retain(|id| id != app_id);
        }
    }
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.taustore")
        .flags(gio::ApplicationFlags::HANDLES_OPEN)
        .build();

    app.connect_activate(|app| {
        // Load TauOS theme CSS
        let provider = gtk::CssProvider::new();
        provider.load_from_data(include_bytes!("../../taukit/theme.css")).unwrap();
        gtk::style_context_add_provider_for_display(
            &gdk::Display::default().unwrap(),
            &provider,
            gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        // Load Tau Store specific CSS
        let store_provider = gtk::CssProvider::new();
        store_provider.load_from_data(include_bytes!("taustore.css")).unwrap();
        gtk::style_context_add_provider_for_display(
            &gdk::Display::default().unwrap(),
            &store_provider,
            gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        // Create main window
        let window = ApplicationWindow::builder()
            .application(app)
            .title("Tau Store")
            .default_width(1200)
            .default_height(800)
            .resizable(true)
            .build();

        // Create main container
        let main_box = Box::new(gtk::Orientation::Horizontal, 0);
        window.set_child(Some(&main_box));

        // Create store instance
        let store = TauStore::new();

        // Create sidebar
        let sidebar = create_sidebar(&store);
        main_box.append(&sidebar);

        // Create main content
        let content = create_main_content(&store);
        main_box.append(&content);

        window.present();
    });

    app.run();
}

fn create_sidebar(store: &TauStore) -> Box {
    let sidebar = Box::new(gtk::Orientation::Vertical, 0);
    sidebar.set_size_request(250, -1);
    sidebar.add_css_class("sidebar");

    // Header
    let header = Box::new(gtk::Orientation::Horizontal, 8);
    header.add_css_class("sidebar-header");
    
    let logo = Label::new(Some("τ"));
    logo.add_css_class("logo");
    let title = Label::new(Some("Tau Store"));
    title.add_css_class("title");
    
    header.append(&logo);
    header.append(&title);
    sidebar.append(&header);

    // Search
    let search_entry = SearchEntry::new();
    search_entry.set_placeholder_text("Search apps...");
    search_entry.add_css_class("search-entry");
    sidebar.append(&search_entry);

    // Categories
    let categories_label = Label::new(Some("Categories"));
    categories_label.add_css_class("section-title");
    sidebar.append(&categories_label);

    let categories_list = ListBox::new();
    categories_list.add_css_class("categories-list");

    for category in store.get_categories() {
        let row = ListBoxRow::new();
        let label = Label::new(Some(&category));
        row.set_child(Some(&label));
        categories_list.append(&row);
    }

    sidebar.append(&categories_list);

    // Filters
    let filters_label = Label::new(Some("Filters"));
    filters_label.add_css_class("section-title");
    sidebar.append(&filters_label);

    let filters_box = Box::new(gtk::Orientation::Vertical, 8);

    let installed_only = Switch::new();
    installed_only.set_active(false);
    let installed_label = Label::new(Some("Installed Only"));
    let installed_row = Box::new(gtk::Orientation::Horizontal, 8);
    installed_row.append(&installed_label);
    installed_row.append(&installed_only);
    filters_box.append(&installed_row);

    let open_source_only = Switch::new();
    open_source_only.set_active(false);
    let open_source_label = Label::new(Some("Open Source Only"));
    let open_source_row = Box::new(gtk::Orientation::Horizontal, 8);
    open_source_row.append(&open_source_label);
    open_source_row.append(&open_source_only);
    filters_box.append(&open_source_row);

    sidebar.append(&filters_box);

    sidebar
}

fn create_main_content(store: &TauStore) -> Box {
    let content = Box::new(gtk::Orientation::Vertical, 0);

    // Header
    let header = Box::new(gtk::Orientation::Horizontal, 12);
    header.add_css_class("content-header");

    let title = Label::new(Some("Featured Apps"));
    title.add_css_class("content-title");

    let sort_combo = ComboBoxText::new();
    sort_combo.append_text("Name");
    sort_combo.append_text("Rating");
    sort_combo.append_text("Privacy");
    sort_combo.append_text("Size");
    sort_combo.set_active(Some(0));

    header.append(&title);
    header.append(&sort_combo);
    content.append(&header);

    // Apps grid
    let scrolled = ScrolledWindow::new();
    let apps_grid = FlowBox::new();
    apps_grid.set_selection_mode(gtk::SelectionMode::None);
    apps_grid.set_homogeneous(false);
    apps_grid.set_min_children_per_line(3);
    apps_grid.set_max_children_per_line(5);

    for app in &store.get_filtered_apps() {
        let app_card = create_app_card(app);
        apps_grid.append(&app_card);
    }

    scrolled.set_child(Some(&apps_grid));
    content.append(&scrolled);

    content
}

fn create_app_card(app: &App) -> FlowBoxChild {
    let card = Box::new(gtk::Orientation::Vertical, 12);
    card.add_css_class("app-card");

    // App icon
    let icon_box = Box::new(gtk::Orientation::Horizontal, 8);
    let icon = Image::new();
    if let Some(icon_path) = &app.icon_path {
        // In a real app, load the actual icon
        icon.set_from_icon_name(Some("application-x-executable"));
    } else {
        icon.set_from_icon_name(Some("application-x-executable"));
    }
    icon.set_pixel_size(64);
    icon_box.append(&icon);

    // App info
    let info_box = Box::new(gtk::Orientation::Vertical, 4);
    
    let name_label = Label::new(Some(&app.name));
    name_label.add_css_class("app-name");
    info_box.append(&name_label);

    let developer_label = Label::new(Some(&app.developer));
    developer_label.add_css_class("app-developer");
    info_box.append(&developer_label);

    let description_label = Label::new(Some(&app.description));
    description_label.add_css_class("app-description");
    description_label.set_wrap(true);
    description_label.set_max_width_chars(40);
    info_box.append(&description_label);

    icon_box.append(&info_box);
    card.append(&icon_box);

    // App details
    let details_box = Box::new(gtk::Orientation::Horizontal, 8);

    let rating_label = Label::new(Some(&format!("★ {:.1}", app.rating)));
    rating_label.add_css_class("app-rating");
    details_box.append(&rating_label);

    let privacy_badge = create_privacy_badge(app.privacy_score);
    details_box.append(&privacy_badge);

    let size_label = Label::new(Some(&app.size));
    size_label.add_css_class("app-size");
    details_box.append(&size_label);

    card.append(&details_box);

    // Action buttons
    let actions_box = Box::new(gtk::Orientation::Horizontal, 8);

    if app.is_installed {
        let remove_button = Button::with_label("Remove");
        remove_button.add_css_class("remove-button");
        actions_box.append(&remove_button);
    } else {
        let install_button = Button::with_label("Install");
        install_button.add_css_class("install-button");
        actions_box.append(&install_button);
    }

    let details_button = Button::with_label("Details");
    details_button.add_css_class("details-button");
    actions_box.append(&details_button);

    card.append(&actions_box);

    let child = FlowBoxChild::new();
    child.set_child(Some(&card));
    child
}

fn create_privacy_badge(score: u8) -> Box {
    let badge = Box::new(gtk::Orientation::Horizontal, 4);
    badge.add_css_class("privacy-badge");

    // Add dynamic class based on score
    if score >= 90 {
        badge.add_css_class("high");
    } else if score >= 70 {
        badge.add_css_class("medium");
    } else {
        badge.add_css_class("low");
    }

    let icon = Label::new(Some("🛡️"));
    badge.append(&icon);

    let score_label = Label::new(Some(&score.to_string()));
    badge.append(&score_label);

    badge
} 