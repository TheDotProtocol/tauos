use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box as GtkBox, Entry, Label, Button, Orientation, CssProvider, StyleContext, STYLE_PROVIDER_PRIORITY_APPLICATION, gdk, gdk::Display, Image, Frame, Revealer, EventControllerKey};
use gio::ApplicationFlags;
use std::io::{self, Write};
use std::process::exit;

mod auth;
mod config;
mod logging;

use auth::AuthManager;
use config::ConfigManager;
use logging::SessionLogger;

const USERS_FILE: &str = "/etc/tau/users.toml";
const SESSION_LOG: &str = "/var/log/tau/session.log";

struct GreeterApp {
    window: ApplicationWindow,
    username_entry: Entry,
    password_entry: Entry,
    login_button: Button,
    status_label: Label,
    auth_manager: AuthManager,
    logger: SessionLogger,
}

impl GreeterApp {
    fn new(app: &Application) -> Result<Self, Box<dyn std::error::Error>> {
        // Load Black & Gold theme CSS
        let provider = CssProvider::new();
        provider.load_from_data(include_bytes!("../../../gui/taukit/theme.css")).unwrap();
        StyleContext::add_provider_for_display(
            &Display::default().unwrap(),
            &provider,
            STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        let window = ApplicationWindow::builder()
            .application(app)
            .title("Tau OS Login")
            .default_width(400)
            .default_height(500)
            .resizable(false)
            .decorated(false)
            .build();

        // Main container
        let main_box = GtkBox::new(Orientation::Vertical, 24);
        main_box.set_margin_start(32);
        main_box.set_margin_end(32);
        main_box.set_margin_top(32);
        main_box.set_margin_bottom(32);

        // Logo/Branding
        let logo_label = Label::new(Some("τ"));
        logo_label.set_css_classes(&["greeter-logo"]);
        logo_label.set_margin_bottom(24);
        main_box.append(&logo_label);

        let title_label = Label::new(Some("Tau OS"));
        title_label.set_css_classes(&["greeter-title"]);
        title_label.set_margin_bottom(8);
        main_box.append(&title_label);

        let subtitle_label = Label::new(Some("Welcome back"));
        subtitle_label.set_css_classes(&["greeter-subtitle"]);
        subtitle_label.set_margin_bottom(32);
        main_box.append(&subtitle_label);

        // Login form
        let form_frame = Frame::new(Some("Login"));
        let form_box = GtkBox::new(Orientation::Vertical, 16);
        form_box.set_margin_start(16);
        form_box.set_margin_end(16);
        form_box.set_margin_top(16);
        form_box.set_margin_bottom(16);

        // Username field
        let username_label = Label::new(Some("Username:"));
        form_box.append(&username_label);

        let username_entry = Entry::builder()
            .placeholder_text("Enter username")
            .build();
        form_box.append(&username_entry);

        // Password field
        let password_label = Label::new(Some("Password:"));
        password_label.set_margin_top(16);
        form_box.append(&password_label);

        let password_entry = Entry::builder()
            .placeholder_text("Enter password")
            .visibility(false)
            .build();
        form_box.append(&password_entry);

        // Login button
        let login_button = Button::with_label("Login");
        login_button.set_margin_top(24);
        form_box.append(&login_button);

        // Status label
        let status_label = Label::new(None);
        status_label.set_css_classes(&["greeter-status"]);
        status_label.set_margin_top(16);
        form_box.append(&status_label);

        form_frame.set_child(Some(&form_box));
        main_box.append(&form_frame);

        // Session type selector
        let session_frame = Frame::new(Some("Session Type"));
        let session_box = GtkBox::new(Orientation::Vertical, 8);
        session_box.set_margin_start(16);
        session_box.set_margin_end(16);
        session_box.set_margin_top(16);
        session_box.set_margin_bottom(16);

        let session_label = Label::new(Some("Select session type:"));
        session_box.append(&session_label);

        let session_combo = gtk4::ComboBoxText::new();
        session_combo.append_text("Tau Desktop");
        session_combo.append_text("Terminal");
        session_combo.set_active(Some(0));
        session_box.append(&session_combo);

        session_frame.set_child(Some(&session_box));
        main_box.append(&session_frame);

        // Additional options
        let options_frame = Frame::new(Some("Options"));
        let options_box = GtkBox::new(Orientation::Vertical, 8);
        options_box.set_margin_start(16);
        options_box.set_margin_end(16);
        options_box.set_margin_top(16);
        options_box.set_margin_bottom(16);

        let guest_button = Button::with_label("Guest Session");
        options_box.append(&guest_button);

        let shutdown_button = Button::with_label("Shutdown");
        shutdown_button.set_css_classes(&["greeter-shutdown"]);
        options_box.append(&shutdown_button);

        options_frame.set_child(Some(&options_box));
        main_box.append(&options_frame);

        window.set_child(Some(&main_box));

        // Initialize managers
        let auth_manager = AuthManager::new(USERS_FILE)?;
        let logger = SessionLogger::new(SESSION_LOG)?;

        let greeter = GreeterApp {
            window,
            username_entry,
            password_entry,
            login_button,
            status_label,
            auth_manager,
            logger,
        };

        Ok(greeter)
    }

    fn setup_events(&self) {
        let username_entry = self.username_entry.clone();
        let password_entry = self.password_entry.clone();
        let login_button = self.login_button.clone();
        let status_label = self.status_label.clone();
        let auth_manager = self.auth_manager.clone();
        let logger = self.logger.clone();

        // Enter key in username field moves to password
        username_entry.connect_activate(move |entry| {
            password_entry.grab_focus();
        });

        // Enter key in password field triggers login
        password_entry.connect_activate(move |_| {
            login_button.emit_clicked();
        });

        // Login button click
        login_button.connect_clicked(move |_| {
            let username = username_entry.text();
            let password = password_entry.text();

            if username.is_empty() || password.is_empty() {
                status_label.set_text("Please enter both username and password");
                return;
            }

            // Attempt authentication
            match auth_manager.authenticate(&username, &password) {
                Ok(user) => {
                    if !user.enabled {
                        status_label.set_text("Account is disabled");
                        logger.log_failed_login(&username, "account disabled", None).ok();
                        return;
                    }

                    status_label.set_text("Login successful!");
                    logger.log_login(&username, "gui-session", None, true).ok();

                    // Output login info for parent process
                    println!("{}", username);
                    println!("gui"); // Session type
                    exit(0);
                }
                Err(e) => {
                    status_label.set_text(&format!("Login failed: {}", e));
                    logger.log_failed_login(&username, &e.to_string(), None).ok();
                }
            }
        });

        // Keyboard shortcuts
        let key_controller = EventControllerKey::new();
        key_controller.connect_key_pressed(move |_, key, _, _| {
            match key.keyval() {
                gdk::Key::Escape => {
                    exit(1);
                    gtk4::Inhibit(true)
                }
                gdk::Key::F1 => {
                    // Show help
                    gtk4::Inhibit(true)
                }
                gdk::Key::F2 => {
                    // Switch to TTY
                    gtk4::Inhibit(true)
                }
                _ => gtk4::Inhibit(false)
            }
        });
        self.window.add_controller(&key_controller);
    }

    fn show(&self) {
        self.window.present();
    }
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.greeter")
        .flags(ApplicationFlags::HANDLES_OPEN)
        .build();

    app.connect_activate(|app| {
        let greeter = GreeterApp::new(app).expect("Failed to create greeter");
        greeter.setup_events();
        greeter.show();
    });

    app.run();
}

// Additional CSS for greeter styling
const GREETER_CSS: &str = r#"
.greeter-logo {
    font-size: 48px;
    font-weight: bold;
    color: #FFD700;
}

.greeter-title {
    font-size: 24px;
    font-weight: bold;
    color: #FFFFFF;
}

.greeter-subtitle {
    font-size: 14px;
    color: #CCCCCC;
}

.greeter-status {
    color: #FF6B6B;
    font-size: 12px;
}

.greeter-shutdown {
    background-color: #FF6B6B;
    color: white;
}

.greeter-shutdown:hover {
    background-color: #FF5252;
}
"#; 