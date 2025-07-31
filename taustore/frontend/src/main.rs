use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box as GtkBox, Entry, Label, Orientation, ScrolledWindow, Button, ListBox, ListBoxRow, CssProvider, StyleContext, STYLE_PROVIDER_PRIORITY_APPLICATION, Spinner, Notebook, Frame, Image, Scale, ComboBoxText, Separator, EventControllerKey, gdk, gdk::Display};
use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use taukit::{animated_grid::AnimatedGrid, SearchBar, Notification, NotificationType, ProgressBar, StatusBar};
use std::rc::Rc;
use std::cell::RefCell;
use std::process::Command;

const API_URL: &str = "http://localhost:8000";

#[derive(Debug, Deserialize, Clone)]
struct App {
    id: i32,
    name: String,
    description: String,
    version: String,
    icon: Option<String>,
    category: String,
    downloads: i32,
    rating: f64,
    status: String,
}

#[derive(Debug, Deserialize, Clone)]
struct Review {
    id: i32,
    app_id: i32,
    user_id: i32,
    rating: i32,
    comment: String,
    created_at: String,
}

#[derive(Debug, Serialize)]
struct AuthRequest {
    username: String,
    password: String,
}

#[derive(Debug, Deserialize)]
struct AuthResponse {
    token: String,
    user: UserInfo,
}

#[derive(Debug, Deserialize)]
struct UserInfo {
    id: i32,
    username: String,
    is_admin: bool,
}

#[derive(Debug, Serialize)]
struct ReviewPost {
    app_id: i32,
    user_id: i32,
    rating: i32,
    comment: String,
}

#[derive(Debug, Serialize)]
struct SearchRequest {
    query: Option<String>,
    category: Option<String>,
    min_rating: Option<f64>,
    sort_by: Option<String>,
    sort_order: Option<String>,
}

fn fetch_apps(client: &Client, search: Option<SearchRequest>) -> Result<Vec<App>, String> {
    let mut url = format!("{}/apps", API_URL);
    if let Some(search_req) = search {
        let mut params = Vec::new();
        if let Some(query) = search_req.query {
            params.push(format!("query={}", urlencoding::encode(&query)));
        }
        if let Some(category) = search_req.category {
            params.push(format!("category={}", urlencoding::encode(&category)));
        }
        if let Some(min_rating) = search_req.min_rating {
            params.push(format!("min_rating={}", min_rating));
        }
        if let Some(sort_by) = search_req.sort_by {
            params.push(format!("sort_by={}", sort_by));
        }
        if let Some(sort_order) = search_req.sort_order {
            params.push(format!("sort_order={}", sort_order));
        }
        if !params.is_empty() {
            url.push_str(&format!("?{}", params.join("&")));
        }
    }
    
    client.get(&url)
        .send().map_err(|e| e.to_string())?
        .json::<Vec<App>>().map_err(|e| e.to_string())
}

fn fetch_app(client: &Client, app_id: i32) -> Result<App, String> {
    client.get(&format!("{}/apps/{}", API_URL, app_id))
        .send().map_err(|e| e.to_string())?
        .json::<App>().map_err(|e| e.to_string())
}

fn fetch_reviews(client: &Client, app_id: i32) -> Result<Vec<Review>, String> {
    client.get(&format!("{}/apps/{}/reviews", API_URL, app_id))
        .send().map_err(|e| e.to_string())?
        .json::<Vec<Review>>().map_err(|e| e.to_string())
}

fn login(client: &Client, username: &str, password: &str) -> Result<(String, UserInfo), String> {
    let req = AuthRequest { username: username.to_string(), password: password.to_string() };
    let resp = client.post(&format!("{}/auth", API_URL))
        .json(&req)
        .send().map_err(|e| e.to_string())?;
    if resp.status().is_success() {
        let auth: AuthResponse = resp.json().map_err(|e| e.to_string())?;
        Ok((auth.token, auth.user))
    } else {
        Err("Login failed".to_string())
    }
}

fn download_app(client: &Client, jwt: &str, app_id: i32) -> Result<(), String> {
    let resp = client.post(&format!("{}/apps/{}/download", API_URL, app_id))
        .bearer_auth(jwt)
        .send().map_err(|e| e.to_string())?;
    if resp.status().is_success() {
        Ok(())
    } else {
        Err("Failed to download app".to_string())
    }
}

fn post_review(client: &Client, jwt: &str, app_id: i32, user_id: i32, rating: i32, comment: &str) -> Result<(), String> {
    let review = ReviewPost { app_id, user_id, rating, comment: comment.to_string() };
    let resp = client.post(&format!("{}/apps/{}/reviews", API_URL, app_id))
        .bearer_auth(jwt)
        .json(&review)
        .send().map_err(|e| e.to_string())?;
    if resp.status().is_success() {
        Ok(())
    } else {
        Err("Failed to post review".to_string())
    }
}

// When launching an app (e.g., on app selection or install):
fn launch_app_with_sandboxd(app_id: &str, manifest_path: &str) {
    println!("[taustore-frontend] Launching {} via sandboxd...", app_id);
    let status = Command::new("/core/sandboxd/sandboxd")
        .arg(app_id)
        .arg(manifest_path)
        .status();
    match status {
        Ok(s) if s.success() => println!("[taustore-frontend] App {} launched successfully via sandboxd.", app_id),
        Ok(s) => println!("[taustore-frontend] App {} exited with status {}.", app_id, s),
        Err(e) => println!("[taustore-frontend] Failed to launch {} via sandboxd: {}", app_id, e),
    }
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.taustore")
        .build();

    app.connect_activate(|app| {
        // Load Black & Gold theme CSS
        let provider = CssProvider::new();
        provider.load_from_data(include_bytes!("../../gui/taukit/theme.css")).unwrap();
        StyleContext::add_provider_for_display(
            &Display::default().unwrap(),
            &provider,
            STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        let client = Rc::new(Client::new());
        let jwt = Rc::new(RefCell::new(None::<String>));
        let user_info = Rc::new(RefCell::new(None::<UserInfo>));

        let window = ApplicationWindow::builder()
            .application(app)
            .title("TauStore App Store")
            .default_width(1000)
            .default_height(800)
            .build();

        let main_box = GtkBox::new(Orientation::Vertical, 16);

        // Login panel
        let login_frame = Frame::new(Some("Login"));
        let login_box = GtkBox::new(Orientation::Vertical, 12);
        login_box.set_margin_start(16);
        login_box.set_margin_end(16);
        login_box.set_margin_top(16);
        login_box.set_margin_bottom(16);
        
        let login_row = GtkBox::new(Orientation::Horizontal, 8);
        let username_entry = Entry::builder().placeholder_text("Username").build();
        let password_entry = Entry::builder().placeholder_text("Password").visibility(false).build();
        let login_btn = Button::with_label("Login");
        let register_btn = Button::with_label("Register");
        let login_status = Label::new(None);
        
        login_row.append(&username_entry);
        login_row.append(&password_entry);
        login_row.append(&login_btn);
        login_row.append(&register_btn);
        login_row.append(&login_status);
        
        login_box.append(&login_row);
        login_frame.set_child(Some(&login_box));
        main_box.append(&login_frame);

        // Main content area
        let notebook = gtk4::Notebook::new();
        
        // Catalog tab
        let catalog_box = create_catalog_tab(&client, &jwt, &user_info);
        notebook.append_page(&catalog_box, Some(&Label::new(Some("Catalog"))));
        
        // My Apps tab
        let my_apps_box = create_my_apps_tab(&client, &jwt, &user_info);
        notebook.append_page(&my_apps_box, Some(&Label::new(Some("My Apps"))));
        
        // Upload tab
        let upload_box = create_upload_tab(&client, &jwt, &user_info);
        notebook.append_page(&upload_box, Some(&Label::new(Some("Upload"))));
        
        // Admin tab (only for admins)
        let admin_box = create_admin_tab(&client, &jwt, &user_info);
        notebook.append_page(&admin_box, Some(&Label::new(Some("Admin"))));
        
        main_box.append(&notebook);

        // Status bar
        let status_bar = StatusBar::new();
        let status_label = status_bar.add_status("Ready");
        main_box.append(&status_bar.container);

        // Login functionality
        let client_clone = client.clone();
        let jwt_clone = jwt.clone();
        let user_info_clone = user_info.clone();
        let login_frame_clone = login_frame.clone();
        let status_label_clone = status_label.clone();
        
        login_btn.connect_clicked(move |_| {
            let username = username_entry.text();
            let password = password_entry.text();
            
            match login(&client_clone, &username, &password) {
                Ok((token, user)) => {
                    *jwt_clone.borrow_mut() = Some(token);
                    *user_info_clone.borrow_mut() = Some(user);
                    login_frame_clone.hide();
                    status_label_clone.set_text("Logged in successfully");
                }
                Err(e) => {
                    login_status.set_text(&format!("Login failed: {}", e));
                }
            }
        });

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
        window.set_accessible_name(Some("TauStore App Store"));
        window.set_accessible_description(Some("Application store for Tau OS"));

        window.set_child(Some(&main_box));
        window.present();
    });

    app.run();
}

fn create_catalog_tab(client: &Rc<Client>, jwt: &Rc<RefCell<Option<String>>>, user_info: &Rc<RefCell<Option<UserInfo>>>) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let catalog_box = GtkBox::new(Orientation::Vertical, 16);
    catalog_box.set_margin_start(16);
    catalog_box.set_margin_end(16);
    catalog_box.set_margin_top(16);
    catalog_box.set_margin_bottom(16);

    // Search and filter controls
    let controls_box = GtkBox::new(Orientation::Horizontal, 8);
    
    let search_entry = Entry::builder().placeholder_text("Search apps...").build();
    let category_combo = ComboBoxText::new();
    category_combo.append_text("All Categories");
    category_combo.append_text("Games");
    category_combo.append_text("Productivity");
    category_combo.append_text("Utilities");
    category_combo.set_active(Some(0));
    
    let sort_combo = ComboBoxText::new();
    sort_combo.append_text("Newest");
    sort_combo.append_text("Rating");
    sort_combo.append_text("Downloads");
    sort_combo.append_text("Name");
    sort_combo.set_active(Some(0));
    
    controls_box.append(&search_entry);
    controls_box.append(&category_combo);
    controls_box.append(&sort_combo);
    catalog_box.append(&controls_box);

    // App grid
    let animated_grid = AnimatedGrid::new();
    let apps = Rc::new(RefCell::new(Vec::<App>::new()));
    let selected_app = Rc::new(RefCell::new(None::<App>));

    // Load initial apps
    let client_clone = client.clone();
    let apps_clone = apps.clone();
    let animated_grid_clone = animated_grid.grid.clone();
    
    gtk4::glib::MainContext::default().spawn_local(async move {
        match fetch_apps(&client_clone, None) {
            Ok(app_list) => {
                *apps_clone.borrow_mut() = app_list;
                update_app_grid(&apps_clone, &animated_grid_clone);
            }
            Err(e) => {
                println!("Error loading apps: {}", e);
            }
        }
    });

    let scrolled_grid = ScrolledWindow::builder()
        .child(&animated_grid.grid)
        .vexpand(true)
        .hexpand(true)
        .build();
    catalog_box.append(&scrolled_grid);

    // App details panel
    let details_frame = Frame::new(Some("App Details"));
    let details_box = GtkBox::new(Orientation::Vertical, 12);
    details_box.set_margin_start(16);
    details_box.set_margin_end(16);
    details_box.set_margin_top(16);
    details_box.set_margin_bottom(16);
    
    let details_label = Label::new(Some("Select an app to view details"));
    details_box.append(&details_label);
    
    // Download button
    let download_btn = Button::with_label("Download");
    download_btn.set_sensitive(false);
    details_box.append(&download_btn);
    
    // Reviews section
    let reviews_label = Label::new(Some("Reviews"));
    details_box.append(&reviews_label);
    
    let reviews_box = GtkBox::new(Orientation::Vertical, 8);
    details_box.append(&reviews_box);
    
    details_frame.set_child(Some(&details_box));
    catalog_box.append(&details_frame);

    scrolled.set_child(Some(&catalog_box));
    scrolled
}

fn create_my_apps_tab(client: &Rc<Client>, jwt: &Rc<RefCell<Option<String>>>, user_info: &Rc<RefCell<Option<UserInfo>>>) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let my_apps_box = GtkBox::new(Orientation::Vertical, 16);
    my_apps_box.set_margin_start(16);
    my_apps_box.set_margin_end(16);
    my_apps_box.set_margin_top(16);
    my_apps_box.set_margin_bottom(16);

    let title_label = Label::new(Some("My Downloaded Apps"));
    title_label.set_css_classes(&["title"]);
    my_apps_box.append(&title_label);

    let apps_list = ListBox::new();
    my_apps_box.append(&apps_list);

    scrolled.set_child(Some(&my_apps_box));
    scrolled
}

fn create_upload_tab(client: &Rc<Client>, jwt: &Rc<RefCell<Option<String>>>, user_info: &Rc<RefCell<Option<UserInfo>>>) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let upload_box = GtkBox::new(Orientation::Vertical, 16);
    upload_box.set_margin_start(16);
    upload_box.set_margin_end(16);
    upload_box.set_margin_top(16);
    upload_box.set_margin_bottom(16);

    let title_label = Label::new(Some("Upload App"));
    title_label.set_css_classes(&["title"]);
    upload_box.append(&title_label);

    // Upload form
    let form_box = GtkBox::new(Orientation::Vertical, 12);
    
    let name_entry = Entry::builder().placeholder_text("App Name").build();
    let version_entry = Entry::builder().placeholder_text("Version").build();
    let description_entry = Entry::builder().placeholder_text("Description").build();
    let category_combo = ComboBoxText::new();
    category_combo.append_text("Games");
    category_combo.append_text("Productivity");
    category_combo.append_text("Utilities");
    category_combo.set_active(Some(0));
    
    let upload_btn = Button::with_label("Upload App");
    
    form_box.append(&Label::new(Some("App Name:")));
    form_box.append(&name_entry);
    form_box.append(&Label::new(Some("Version:")));
    form_box.append(&version_entry);
    form_box.append(&Label::new(Some("Description:")));
    form_box.append(&description_entry);
    form_box.append(&Label::new(Some("Category:")));
    form_box.append(&category_combo);
    form_box.append(&upload_btn);
    
    upload_box.append(&form_box);

    scrolled.set_child(Some(&upload_box));
    scrolled
}

fn create_admin_tab(client: &Rc<Client>, jwt: &Rc<RefCell<Option<String>>>, user_info: &Rc<RefCell<Option<UserInfo>>>) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let admin_box = GtkBox::new(Orientation::Vertical, 16);
    admin_box.set_margin_start(16);
    admin_box.set_margin_end(16);
    admin_box.set_margin_top(16);
    admin_box.set_margin_bottom(16);

    let title_label = Label::new(Some("Admin Panel"));
    title_label.set_css_classes(&["title"]);
    admin_box.append(&title_label);

    let pending_label = Label::new(Some("Pending Approvals"));
    admin_box.append(&pending_label);

    let pending_list = ListBox::new();
    admin_box.append(&pending_list);

    scrolled.set_child(Some(&admin_box));
    scrolled
}

fn update_app_grid(apps: &Rc<RefCell<Vec<App>>>, grid: &gtk4::Grid) {
    // Clear existing grid
    for child in grid.children() {
        grid.remove(&child);
    }
    
    // Add apps to grid
    for (i, app) in apps.borrow().iter().enumerate() {
        let app_button = create_app_button(app);
        grid.attach(&app_button, (i % 3) as i32, (i / 3) as i32, 1, 1);
    }
}

fn create_app_button(app: &App) -> Button {
    let app_button = Button::new();
    
    let app_box = GtkBox::new(Orientation::Vertical, 8);
    
    // App icon
    let icon = if let Some(icon_path) = &app.icon {
        Image::from_file(icon_path)
    } else {
        Image::from_file("/gui/launcher/assets/default.png")
    };
    app_box.append(&icon);
    
    // App name
    let name_label = Label::new(Some(&app.name));
    name_label.set_css_classes(&["app-name"]);
    app_box.append(&name_label);
    
    // App rating
    let rating_label = Label::new(Some(&format!("★ {:.1}", app.rating)));
    rating_label.set_css_classes(&["app-rating"]);
    app_box.append(&rating_label);
    
    app_button.set_child(Some(&app_box));
    app_button.set_accessible_name(Some(&format!("View {}", app.name)));
    app_button.set_accessible_description(Some(&format!("Click to view details for {}", app.name)));
    
    app_button
} 