use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box as GtkBox, Label, Orientation, CssProvider, StyleContext, STYLE_PROVIDER_PRIORITY_APPLICATION, Button, Image, ListBox, ListBoxRow, Frame, ScrolledWindow, EventControllerKey, gdk, gdk::Display, Entry, ComboBoxText, ProgressBar, Revealer, Stack, Notebook, Separator, SearchEntry, FlowBox, FlowBoxChild, AspectFrame, Overlay, WindowControls, WindowTitle};
use gio::ApplicationFlags;
use std::cell::RefCell;
use std::rc::Rc;
use std::process::Command;
use std::thread;
use std::time::Duration;

#[derive(Clone)]
struct AppInfo {
    id: String,
    name: String,
    description: String,
    version: String,
    developer: String,
    category: String,
    size: String,
    rating: f32,
    downloads: u32,
    price: f32,
    installed: bool,
    icon: String,
}

struct TauStore {
    apps: RefCell<Vec<AppInfo>>,
    installed_apps: RefCell<Vec<String>>,
    search_query: RefCell<String>,
    selected_category: RefCell<String>,
}

impl TauStore {
    fn new() -> Self {
        let apps = vec![
            AppInfo {
                id: "tau-editor".to_string(),
                name: "Tau Editor".to_string(),
                description: "Advanced text editor with syntax highlighting".to_string(),
                version: "1.0.0".to_string(),
                developer: "TauOS Team".to_string(),
                category: "Development".to_string(),
                size: "15.2 MB".to_string(),
                rating: 4.9,
                downloads: 1250,
                price: 0.0,
                installed: false,
                icon: "📝".to_string(),
            },
            AppInfo {
                id: "tau-paint".to_string(),
                name: "Tau Paint".to_string(),
                description: "Digital painting and image editing".to_string(),
                version: "1.0.0".to_string(),
                developer: "TauOS Team".to_string(),
                category: "Graphics".to_string(),
                size: "28.7 MB".to_string(),
                rating: 4.2,
                downloads: 890,
                price: 0.0,
                installed: false,
                icon: "🎨".to_string(),
            },
            AppInfo {
                id: "tau-games".to_string(),
                name: "Tau Games".to_string(),
                description: "Collection of classic games".to_string(),
                version: "1.0.0".to_string(),
                developer: "TauOS Team".to_string(),
                category: "Games".to_string(),
                size: "45.3 MB".to_string(),
                rating: 4.8,
                downloads: 2100,
                price: 0.0,
                installed: false,
                icon: "🎮".to_string(),
            },
            AppInfo {
                id: "tau-calculator".to_string(),
                name: "Tau Calculator".to_string(),
                description: "Scientific calculator with advanced functions".to_string(),
                version: "1.0.0".to_string(),
                developer: "TauOS Team".to_string(),
                category: "Productivity".to_string(),
                size: "8.9 MB".to_string(),
                rating: 4.1,
                downloads: 567,
                price: 0.0,
                installed: false,
                icon: "📊".to_string(),
            },
            AppInfo {
                id: "tau-camera".to_string(),
                name: "Tau Camera".to_string(),
                description: "Camera application with filters and effects".to_string(),
                version: "1.0.0".to_string(),
                developer: "TauOS Team".to_string(),
                category: "Multimedia".to_string(),
                size: "32.1 MB".to_string(),
                rating: 4.7,
                downloads: 743,
                price: 0.0,
                installed: false,
                icon: "📷".to_string(),
            },
            AppInfo {
                id: "tau-terminal".to_string(),
                name: "Tau Terminal".to_string(),
                description: "Advanced terminal emulator".to_string(),
                version: "1.0.0".to_string(),
                developer: "TauOS Team".to_string(),
                category: "Development".to_string(),
                size: "12.4 MB".to_string(),
                rating: 4.9,
                downloads: 1890,
                price: 0.0,
                installed: false,
                icon: "🔧".to_string(),
            },
        ];

        Self {
            apps: RefCell::new(apps),
            installed_apps: RefCell::new(Vec::new()),
            search_query: RefCell::new(String::new()),
            selected_category: RefCell::new("All".to_string()),
        }
    }

    fn install_app(&self, app_id: &str) -> Result<(), String> {
        // Simulate installation process
        thread::sleep(Duration::from_millis(2000));
        
        let mut installed = self.installed_apps.borrow_mut();
        if !installed.contains(&app_id.to_string()) {
            installed.push(app_id.to_string());
        }
        
        Ok(())
    }

    fn uninstall_app(&self, app_id: &str) -> Result<(), String> {
        let mut installed = self.installed_apps.borrow_mut();
        installed.retain(|id| id != app_id);
        Ok(())
    }

    fn get_filtered_apps(&self) -> Vec<AppInfo> {
        let apps = self.apps.borrow();
        let search_query = self.search_query.borrow();
        let selected_category = self.selected_category.borrow();
        let installed = self.installed_apps.borrow();

        apps.iter()
            .filter(|app| {
                let matches_search = search_query.is_empty() || 
                    app.name.to_lowercase().contains(&search_query.to_lowercase()) ||
                    app.description.to_lowercase().contains(&search_query.to_lowercase());
                
                let matches_category = selected_category == "All" || app.category == *selected_category;
                
                matches_search && matches_category
            })
            .map(|app| {
                let mut app_clone = app.clone();
                app_clone.installed = installed.contains(&app.id);
                app_clone
            })
            .collect()
    }
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.taustore")
        .flags(ApplicationFlags::HANDLES_OPEN)
        .build();

    app.connect_activate(|app| {
        // Load TauOS theme CSS
        let provider = CssProvider::new();
        provider.load_from_data(include_bytes!("../../gui/taukit/theme.css")).unwrap();
        StyleContext::add_provider_for_display(
            &gtk4::gdk::Display::default().unwrap(),
            &provider,
            STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        let window = ApplicationWindow::builder()
            .application(app)
            .title("Tau Store")
            .default_width(1200)
            .default_height(800)
            .build();

        let store = Rc::new(TauStore::new());
        
        let main_box = GtkBox::new(Orientation::Vertical, 0);
        
        // Header
        let header = create_header(&store);
        main_box.append(&header);
        
        // Content
        let content = create_content(&store);
        main_box.append(&content);

        // Keyboard navigation
        let key_controller = EventControllerKey::new();
        key_controller.connect_key_pressed(move |_, key, _, _| {
            match key.keyval() {
                gdk::Key::Escape => {
                    window.close();
                    gtk4::Inhibit(true)
                }
                _ => gtk4::Inhibit(false)
            }
        });
        window.add_controller(&key_controller);

        // Accessibility
        window.set_accessible_name(Some("Tau Store"));
        window.set_accessible_description(Some("Application marketplace for TauOS"));

        window.set_child(Some(&main_box));
        window.present();
    });

    app.run();
}

fn create_header(store: &Rc<TauStore>) -> GtkBox {
    let header = GtkBox::new(Orientation::Horizontal, 0);
    header.add_css_class("header");
    header.set_margin_start(20);
    header.set_margin_end(20);
    header.set_margin_top(20);
    header.set_margin_bottom(20);

    // Title
    let title_box = GtkBox::new(Orientation::Horizontal, 10);
    let title_label = Label::new(Some("Tau Store"));
    title_label.add_css_class("title");
    title_box.append(&title_label);

    // Search bar
    let search_entry = SearchEntry::new();
    search_entry.set_placeholder_text(Some("Search applications..."));
    search_entry.set_size_request(300, -1);
    
    let store_clone = Rc::clone(store);
    search_entry.connect_search_changed(move |entry| {
        let query = entry.text().to_string();
        *store_clone.search_query.borrow_mut() = query;
        // Trigger UI update
    });

    // Category filter
    let category_combo = ComboBoxText::new();
    category_combo.append_text("All");
    category_combo.append_text("Development");
    category_combo.append_text("Graphics");
    category_combo.append_text("Games");
    category_combo.append_text("Productivity");
    category_combo.append_text("Multimedia");
    category_combo.set_active(Some(0));
    
    let store_clone = Rc::clone(store);
    category_combo.connect_changed(move |combo| {
        if let Some(active) = combo.active() {
            let categories = vec!["All", "Development", "Graphics", "Games", "Productivity", "Multimedia"];
            if active < categories.len() as u32 {
                *store_clone.selected_category.borrow_mut() = categories[active as usize].to_string();
                // Trigger UI update
            }
        }
    });

    header.append(&title_box);
    header.append(&search_entry);
    header.append(&category_combo);

    header
}

fn create_content(store: &Rc<TauStore>) -> GtkBox {
    let content = GtkBox::new(Orientation::Horizontal, 0);
    
    // Sidebar
    let sidebar = create_sidebar(store);
    content.append(&sidebar);
    
    // Main content
    let main_content = create_main_content(store);
    content.append(&main_content);
    
    content
}

fn create_sidebar(store: &Rc<TauStore>) -> GtkBox {
    let sidebar = GtkBox::new(Orientation::Vertical, 0);
    sidebar.add_css_class("sidebar");
    sidebar.set_size_request(250, -1);
    sidebar.set_margin_start(20);
    sidebar.set_margin_end(20);

    // Categories
    let categories_frame = Frame::new(Some("Categories"));
    let categories_box = GtkBox::new(Orientation::Vertical, 8);
    
    let categories = vec![
        ("🏠", "Featured"),
        ("🎮", "Games"),
        ("📱", "Productivity"),
        ("🎨", "Graphics"),
        ("🔧", "Development"),
        ("🎵", "Multimedia"),
    ];

    for (icon, name) in categories {
        let category_row = create_category_row(icon, name);
        categories_box.append(&category_row);
    }

    categories_frame.set_child(Some(&categories_box));
    sidebar.append(&categories_frame);

    // My Apps
    let my_apps_frame = Frame::new(Some("My Apps"));
    let my_apps_box = GtkBox::new(Orientation::Vertical, 8);
    
    let my_apps_items = vec![
        ("📥", "Installed"),
        ("⬇️", "Updates"),
        ("❤️", "Wishlist"),
    ];

    for (icon, name) in my_apps_items {
        let item_row = create_category_row(icon, name);
        my_apps_box.append(&item_row);
    }

    my_apps_frame.set_child(Some(&my_apps_box));
    sidebar.append(&my_apps_frame);

    sidebar
}

fn create_category_row(icon: &str, name: &str) -> ListBoxRow {
    let row = ListBoxRow::new();
    let box_widget = GtkBox::new(Orientation::Horizontal, 10);
    box_widget.set_margin_start(10);
    box_widget.set_margin_end(10);
    box_widget.set_margin_top(5);
    box_widget.set_margin_bottom(5);

    let icon_label = Label::new(Some(icon));
    let name_label = Label::new(Some(name));
    name_label.set_hexpand(true);

    box_widget.append(&icon_label);
    box_widget.append(&name_label);

    row.set_child(Some(&box_widget));
    row
}

fn create_main_content(store: &Rc<TauStore>) -> GtkBox {
    let main_content = GtkBox::new(Orientation::Vertical, 0);
    main_content.set_margin_start(20);
    main_content.set_margin_end(20);
    main_content.set_margin_bottom(20);

    // Featured section
    let featured_label = Label::new(Some("Featured Applications"));
    featured_label.add_css_class("section-title");
    main_content.append(&featured_label);

    // Apps grid
    let apps_scroll = ScrolledWindow::new();
    let apps_flow = FlowBox::new();
    apps_flow.set_selection_mode(gtk4::SelectionMode::None);
    apps_flow.set_max_children_per_line(4);
    apps_flow.set_min_children_per_line(2);

    let apps = store.get_filtered_apps();
    for app in apps {
        let app_card = create_app_card(&app, store);
        apps_flow.append(&app_card);
    }

    apps_scroll.set_child(Some(&apps_flow));
    main_content.append(&apps_scroll);

    main_content
}

fn create_app_card(app: &AppInfo, store: &Rc<TauStore>) -> FlowBoxChild {
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

    // App info
    let info_box = GtkBox::new(Orientation::Horizontal, 10);
    let size_label = Label::new(Some(&app.size));
    let rating_label = Label::new(Some(&format!("★ {:.1}", app.rating)));
    info_box.append(&size_label);
    info_box.append(&rating_label);
    card_content.append(&info_box);

    // Install/Uninstall button
    let button_text = if app.installed { "Uninstall" } else { "Install" };
    let install_button = Button::with_label(button_text);
    install_button.add_css_class("install-button");
    
    let app_id = app.id.clone();
    let store_clone = Rc::clone(store);
    install_button.connect_clicked(move |_| {
        if app.installed {
            if let Err(e) = store_clone.uninstall_app(&app_id) {
                eprintln!("Failed to uninstall: {}", e);
            }
        } else {
            if let Err(e) = store_clone.install_app(&app_id) {
                eprintln!("Failed to install: {}", e);
            }
        }
        // Update UI
    });

    card_content.append(&install_button);
    card.set_child(Some(&card_content));
    child.set_child(Some(&card));

    child
} 