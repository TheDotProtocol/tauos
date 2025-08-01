use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Box, Button, Entry, HeaderBar, Orientation, ScrolledWindow, Label, ListBox, ListBoxRow, FlowBox, FlowBoxChild, Image, Revealer};
use std::sync::{Arc, Mutex};

pub struct TauStore {
    pub widget: Box,
    search_bar: Entry,
    category_list: ListBox,
    app_grid: FlowBox,
    featured_section: Box,
    download_section: Box,
    current_category: Arc<Mutex<String>>,
}

#[derive(Clone)]
struct AppItem {
    name: String,
    description: String,
    version: String,
    size: String,
    rating: f32,
    downloads: u32,
    category: String,
    icon: String,
    price: String,
    developer: String,
}

impl TauStore {
    pub fn new() -> Self {
        // Create main container
        let main_box = Box::new(Orientation::Horizontal, 0);
        
        // Create sidebar
        let sidebar = Self::create_sidebar();
        main_box.append(&sidebar);
        
        // Create main content area
        let content_area = Box::new(Orientation::Vertical, 0);
        
        // Create header
        let header = Self::create_header();
        content_area.append(&header);
        
        // Create search bar
        let search_bar = Self::create_search_bar();
        content_area.append(&search_bar);
        
        // Create featured section
        let featured_section = Self::create_featured_section();
        content_area.append(&featured_section);
        
        // Create app grid
        let app_grid = Self::create_app_grid();
        content_area.append(&app_grid);
        
        // Create download section
        let download_section = Self::create_download_section();
        content_area.append(&download_section);
        
        main_box.append(&content_area);
        
        // Initialize state
        let current_category = Arc::new(Mutex::new("All".to_string()));
        
        // Load initial apps
        Self::load_apps(&app_grid, &current_category);
        
        Self {
            widget: main_box,
            search_bar,
            category_list: ListBox::new(),
            app_grid,
            featured_section,
            download_section,
            current_category,
        }
    }
    
    fn create_sidebar() -> ListBox {
        let sidebar = ListBox::new();
        sidebar.add_css_class("store-sidebar");
        
        // Add category items
        let categories = vec![
            ("🛒 All", "all"),
            ("🎮 Games", "games"),
            ("📱 Productivity", "productivity"),
            ("🎵 Music", "music"),
            ("📹 Video", "video"),
            ("📚 Education", "education"),
            ("🎨 Graphics", "graphics"),
            ("🔧 Developer", "developer"),
            ("🛡️ Security", "security"),
            ("🌐 Internet", "internet"),
        ];
        
        for (name, id) in categories {
            let row = Self::create_category_item(name, id);
            sidebar.append(&row);
        }
        
        sidebar
    }
    
    fn create_category_item(name: &str, id: &str) -> ListBoxRow {
        let row = ListBoxRow::new();
        let box_widget = Box::new(Orientation::Horizontal, 8);
        
        let icon = Label::new(Some(&name[..4])); // First 4 chars (emoji)
        icon.add_css_class("category-icon");
        
        let label = Label::new(Some(&name[4..])); // Rest of the name
        label.add_css_class("category-label");
        
        box_widget.append(&icon);
        box_widget.append(&label);
        row.set_child(Some(&box_widget));
        
        row
    }
    
    fn create_header() -> Box {
        let header = Box::new(Orientation::Horizontal, 16);
        header.add_css_class("store-header");
        
        // Store title
        let title = Label::new(Some("τ Store"));
        title.add_css_class("store-title");
        header.append(&title);
        
        // Account button
        let account_button = Button::new();
        account_button.set_label(Some("👤 Account"));
        account_button.add_css_class("header-button");
        header.append(&account_button);
        
        // Updates button
        let updates_button = Button::new();
        updates_button.set_label(Some("🔄 Updates"));
        updates_button.add_css_class("header-button");
        header.append(&updates_button);
        
        // Downloads button
        let downloads_button = Button::new();
        downloads_button.set_label(Some("📥 Downloads"));
        downloads_button.add_css_class("header-button");
        header.append(&downloads_button);
        
        header
    }
    
    fn create_search_bar() -> Entry {
        let search_bar = Entry::new();
        search_bar.set_placeholder_text(Some("Search apps..."));
        search_bar.add_css_class("store-search-bar");
        search_bar
    }
    
    fn create_featured_section() -> Box {
        let featured_section = Box::new(Orientation::Vertical, 16);
        featured_section.add_css_class("featured-section");
        
        // Featured title
        let title = Label::new(Some("Featured Apps"));
        title.add_css_class("section-title");
        featured_section.append(&title);
        
        // Featured apps grid
        let featured_grid = FlowBox::new();
        featured_grid.add_css_class("featured-grid");
        
        // Add featured apps
        let featured_apps = vec![
            ("🌐 Tau Browser", "Privacy-first web browser", "Free", "4.8"),
            ("📧 TauMail", "Secure email client", "Free", "4.9"),
            ("☁️ TauCloud", "Private cloud storage", "Free", "4.7"),
            ("📁 Tau Explorer", "File manager", "Free", "4.6"),
        ];
        
        for (name, description, price, rating) in featured_apps {
            let app_card = Self::create_featured_app_card(name, description, price, rating);
            featured_grid.append(&app_card);
        }
        
        featured_section.append(&featured_grid);
        featured_section
    }
    
    fn create_featured_app_card(name: &str, description: &str, price: &str, rating: &str) -> FlowBoxChild {
        let child = FlowBoxChild::new();
        let card = Box::new(Orientation::Vertical, 12);
        card.add_css_class("featured-app-card");
        
        // App icon
        let icon = Label::new(Some(&name[..4])); // First 4 chars (emoji)
        icon.add_css_class("app-icon-large");
        card.append(&icon);
        
        // App name
        let name_label = Label::new(Some(name));
        name_label.add_css_class("app-name");
        card.append(&name_label);
        
        // App description
        let desc_label = Label::new(Some(description));
        desc_label.add_css_class("app-description");
        card.append(&desc_label);
        
        // App rating
        let rating_label = Label::new(Some(&format!("⭐ {}", rating)));
        rating_label.add_css_class("app-rating");
        card.append(&rating_label);
        
        // App price
        let price_label = Label::new(Some(price));
        price_label.add_css_class("app-price");
        card.append(&price_label);
        
        // Install button
        let install_button = Button::new();
        install_button.set_label(Some("Install"));
        install_button.add_css_class("install-button");
        card.append(&install_button);
        
        child.set_child(Some(&card));
        child
    }
    
    fn create_app_grid() -> FlowBox {
        let app_grid = FlowBox::new();
        app_grid.add_css_class("app-grid");
        app_grid
    }
    
    fn create_download_section() -> Box {
        let download_section = Box::new(Orientation::Vertical, 16);
        download_section.add_css_class("download-section");
        
        // Downloads title
        let title = Label::new(Some("Downloads"));
        title.add_css_class("section-title");
        download_section.append(&title);
        
        // Download list
        let download_list = ListBox::new();
        download_list.add_css_class("download-list");
        
        // Add sample downloads
        let downloads = vec![
            ("🌐 Tau Browser", "Installing...", "75%"),
            ("📧 TauMail", "Queued", "0%"),
            ("☁️ TauCloud", "Completed", "100%"),
        ];
        
        for (name, status, progress) in downloads {
            let download_item = Self::create_download_item(name, status, progress);
            download_list.append(&download_item);
        }
        
        download_section.append(&download_list);
        download_section
    }
    
    fn create_download_item(name: &str, status: &str, progress: &str) -> ListBoxRow {
        let row = ListBoxRow::new();
        let box_widget = Box::new(Orientation::Horizontal, 12);
        
        let icon = Label::new(Some(&name[..4])); // First 4 chars (emoji)
        icon.add_css_class("download-icon");
        
        let info_box = Box::new(Orientation::Vertical, 4);
        
        let name_label = Label::new(Some(name));
        name_label.add_css_class("download-name");
        info_box.append(&name_label);
        
        let status_label = Label::new(Some(status));
        status_label.add_css_class("download-status");
        info_box.append(&status_label);
        
        let progress_label = Label::new(Some(progress));
        progress_label.add_css_class("download-progress");
        info_box.append(&progress_label);
        
        box_widget.append(&icon);
        box_widget.append(&info_box);
        
        row.set_child(Some(&box_widget));
        row
    }
    
    fn load_apps(app_grid: &FlowBox, current_category: &Arc<Mutex<String>>) {
        // Clear existing apps
        app_grid.remove_all();
        
        // Add sample apps
        let apps = vec![
            ("🌐 Tau Browser", "Privacy-first web browser", "Free", "4.8", "Internet"),
            ("📧 TauMail", "Secure email client", "Free", "4.9", "Productivity"),
            ("☁️ TauCloud", "Private cloud storage", "Free", "4.7", "Productivity"),
            ("📁 Tau Explorer", "File manager", "Free", "4.6", "Productivity"),
            ("🎵 Tau Media", "Music and video player", "Free", "4.5", "Music"),
            ("📄 Tau Office", "Document suite", "Free", "4.4", "Productivity"),
            ("🎮 Tau Games", "Game collection", "Free", "4.3", "Games"),
            ("🔧 Tau Dev", "Development tools", "Free", "4.2", "Developer"),
            ("🛡️ Tau Security", "Security suite", "Free", "4.1", "Security"),
            ("🎨 Tau Graphics", "Graphics editor", "Free", "4.0", "Graphics"),
        ];
        
        for (name, description, price, rating, category) in apps {
            let app_card = Self::create_app_card(name, description, price, rating, category);
            app_grid.append(&app_card);
        }
    }
    
    fn create_app_card(name: &str, description: &str, price: &str, rating: &str, category: &str) -> FlowBoxChild {
        let child = FlowBoxChild::new();
        let card = Box::new(Orientation::Vertical, 8);
        card.add_css_class("app-card");
        
        // App icon
        let icon = Label::new(Some(&name[..4])); // First 4 chars (emoji)
        icon.add_css_class("app-icon");
        card.append(&icon);
        
        // App name
        let name_label = Label::new(Some(name));
        name_label.add_css_class("app-name");
        card.append(&name_label);
        
        // App description
        let desc_label = Label::new(Some(description));
        desc_label.add_css_class("app-description");
        card.append(&desc_label);
        
        // App rating
        let rating_label = Label::new(Some(&format!("⭐ {}", rating)));
        rating_label.add_css_class("app-rating");
        card.append(&rating_label);
        
        // App price
        let price_label = Label::new(Some(price));
        price_label.add_css_class("app-price");
        card.append(&price_label);
        
        // Install button
        let install_button = Button::new();
        install_button.set_label(Some("Install"));
        install_button.add_css_class("install-button");
        card.append(&install_button);
        
        child.set_child(Some(&card));
        child
    }
} 