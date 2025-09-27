use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Box, Button, Entry, HeaderBar, Orientation, ScrolledWindow};

mod settings_ui;
mod system_config;
mod privacy_settings;
mod theme;

fn main() {
    // Initialize GTK
    gtk::init().unwrap();

    // Apply settings theme
    theme::apply_settings_theme();

    // Create application
    let app = Application::builder()
        .application_id("org.tauos.tausettings")
        .build();

    app.connect_activate(|app| {
        // Create main window
        let window = ApplicationWindow::builder()
            .application(app)
            .title("τ Settings")
            .default_width(1000)
            .default_height(700)
            .build();

        // Set up settings environment
        let settings = settings_ui::TauSettings::new();
        window.set_child(Some(&settings.widget));

        // Show window
        window.present();
    });

    // Run application
    app.run();
} 