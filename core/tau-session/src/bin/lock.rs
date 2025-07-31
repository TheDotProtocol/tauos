use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box as GtkBox, Entry, Label, Button, Orientation, CssProvider, StyleContext, STYLE_PROVIDER_PRIORITY_APPLICATION, gdk, gdk::Display, EventControllerKey, Revealer};
use gio::ApplicationFlags;
use std::io::{self, Write};
use std::process::exit;
use std::env;

mod auth;
mod config;
mod logging;

use auth::AuthManager;
use config::ConfigManager;
use logging::SessionLogger;

const USERS_FILE: &str = "/etc/tau/users.toml";
const SESSION_LOG: &str = "/var/log/tau/session.log";

struct LockScreen {
    window: ApplicationWindow,
    password_entry: Entry,
    unlock_button: Button,
    status_label: Label,
    auth_manager: AuthManager,
    logger: SessionLogger,
    session_id: String,
    username: String,
}

impl LockScreen {
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
            .title("Tau OS Lock Screen")
            .default_width(400)
            .default_height(300)
            .resizable(false)
            .decorated(false)
            .build();

        // Make window fullscreen and always on top
        window.fullscreen();
        window.set_keep_above(true);

        // Main container
        let main_box = GtkBox::new(Orientation::Vertical, 24);
        main_box.set_margin_start(32);
        main_box.set_margin_end(32);
        main_box.set_margin_top(32);
        main_box.set_margin_bottom(32);

        // Lock icon and title
        let lock_icon = Label::new(Some("🔒"));
        lock_icon.set_css_classes(&["lock-icon"]);
        lock_icon.set_margin_bottom(16);
        main_box.append(&lock_icon);

        let title_label = Label::new(Some("Session Locked"));
        title_label.set_css_classes(&["lock-title"]);
        title_label.set_margin_bottom(8);
        main_box.append(&title_label);

        // Get session info from environment
        let session_id = env::var("TAU_SESSION_ID").unwrap_or_else(|_| "unknown".to_string());
        let username = env::var("USER").unwrap_or_else(|_| "unknown".to_string());

        let user_label = Label::new(Some(&format!("User: {}", username)));
        user_label.set_css_classes(&["lock-user"]);
        user_label.set_margin_bottom(24);
        main_box.append(&user_label);

        // Password entry
        let password_label = Label::new(Some("Enter password to unlock:"));
        main_box.append(&password_label);

        let password_entry = Entry::builder()
            .placeholder_text("Password")
            .visibility(false)
            .build();
        password_entry.set_margin_top(8);
        main_box.append(&password_entry);

        // Unlock button
        let unlock_button = Button::with_label("Unlock");
        unlock_button.set_margin_top(16);
        main_box.append(&unlock_button);

        // Status label
        let status_label = Label::new(None);
        status_label.set_css_classes(&["lock-status"]);
        status_label.set_margin_top(16);
        main_box.append(&status_label);

        // Additional options
        let options_box = GtkBox::new(Orientation::Horizontal, 16);
        options_box.set_margin_top(24);

        let switch_user_button = Button::with_label("Switch User");
        options_box.append(&switch_user_button);

        let logout_button = Button::with_label("Logout");
        logout_button.set_css_classes(&["lock-logout"]);
        options_box.append(&logout_button);

        main_box.append(&options_box);

        window.set_child(Some(&main_box));

        // Initialize managers
        let auth_manager = AuthManager::new(USERS_FILE)?;
        let logger = SessionLogger::new(SESSION_LOG)?;

        let lock_screen = LockScreen {
            window,
            password_entry,
            unlock_button,
            status_label,
            auth_manager,
            logger,
            session_id,
            username,
        };

        Ok(lock_screen)
    }

    fn setup_events(&self) {
        let password_entry = self.password_entry.clone();
        let unlock_button = self.unlock_button.clone();
        let status_label = self.status_label.clone();
        let auth_manager = self.auth_manager.clone();
        let logger = self.logger.clone();
        let session_id = self.session_id.clone();
        let username = self.username.clone();

        // Enter key triggers unlock
        password_entry.connect_activate(move |_| {
            unlock_button.emit_clicked();
        });

        // Unlock button click
        unlock_button.connect_clicked(move |_| {
            let password = password_entry.text();

            if password.is_empty() {
                status_label.set_text("Please enter your password");
                return;
            }

            // Attempt authentication
            match auth_manager.authenticate(&username, &password) {
                Ok(_) => {
                    status_label.set_text("Unlocking...");
                    logger.log_unlock(&username, &session_id).ok();
                    
                    // Exit with success code
                    exit(0);
                }
                Err(e) => {
                    status_label.set_text(&format!("Incorrect password: {}", e));
                    logger.log_failed_login(&username, "incorrect password", None).ok();
                    
                    // Clear password field
                    password_entry.set_text("");
                    password_entry.grab_focus();
                }
            }
        });

        // Keyboard shortcuts
        let key_controller = EventControllerKey::new();
        key_controller.connect_key_pressed(move |_, key, _, _| {
            match key.keyval() {
                gdk::Key::Escape => {
                    // Don't allow escape to exit lock screen
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

        // Prevent window from being closed
        self.window.connect_close_request(move |_| {
            gtk4::Inhibit(true)
        });
    }

    fn show(&self) {
        self.window.present();
        
        // Focus password entry
        self.password_entry.grab_focus();
    }

    fn log_lock_event(&self) -> Result<(), Box<dyn std::error::Error>> {
        self.logger.log_lock(&self.username, &self.session_id)
    }
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.lock")
        .flags(ApplicationFlags::HANDLES_OPEN)
        .build();

    app.connect_activate(|app| {
        let lock_screen = LockScreen::new(app).expect("Failed to create lock screen");
        
        // Log lock event
        lock_screen.log_lock_event().ok();
        
        lock_screen.setup_events();
        lock_screen.show();
    });

    app.run();
}

// Additional CSS for lock screen styling
const LOCK_CSS: &str = r#"
.lock-icon {
    font-size: 64px;
    color: #FFD700;
}

.lock-title {
    font-size: 24px;
    font-weight: bold;
    color: #FFFFFF;
}

.lock-user {
    font-size: 16px;
    color: #CCCCCC;
}

.lock-status {
    color: #FF6B6B;
    font-size: 12px;
}

.lock-logout {
    background-color: #FF6B6B;
    color: white;
}

.lock-logout:hover {
    background-color: #FF5252;
}

/* Prevent interaction with background windows */
window {
    background-color: rgba(0, 0, 0, 0.9);
}
"#; 