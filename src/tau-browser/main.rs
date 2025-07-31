use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Box, Button, Entry, HeaderBar, Orientation, ScrolledWindow};
use webkit2gtk::{WebView, WebViewExt, SettingsExt};

mod browser_ui;
mod privacy_features;
mod theme;

fn main() {
    // Initialize GTK
    gtk::init().unwrap();

    // Apply browser theme
    theme::apply_browser_theme();

    // Create application
    let app = Application::builder()
        .application_id("org.tauos.taubrowser")
        .build();

    app.connect_activate(|app| {
        // Create main window
        let window = ApplicationWindow::builder()
            .application(app)
            .title("τ Browser")
            .default_width(1200)
            .default_height(800)
            .build();

        // Set up browser environment
        let browser = browser_ui::TauBrowser::new();
        window.set_child(Some(&browser.widget));

        // Show window
        window.present();
    });

    // Run application
    app.run();
} 