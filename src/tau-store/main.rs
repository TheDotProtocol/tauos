use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Box, Button, Entry, HeaderBar, Orientation, ScrolledWindow};

mod store_ui;
mod app_catalog;
mod download_manager;
mod theme;

fn main() {
    // Initialize GTK
    gtk::init().unwrap();

    // Apply store theme
    theme::apply_store_theme();

    // Create application
    let app = Application::builder()
        .application_id("org.tauos.taustore")
        .build();

    app.connect_activate(|app| {
        // Create main window
        let window = ApplicationWindow::builder()
            .application(app)
            .title("τ Store")
            .default_width(1200)
            .default_height(800)
            .build();

        // Set up store environment
        let store = store_ui::TauStore::new();
        window.set_child(Some(&store.widget));

        // Show window
        window.present();
    });

    // Run application
    app.run();
} 