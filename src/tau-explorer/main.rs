use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Box, Button, Entry, HeaderBar, Orientation, ScrolledWindow};

mod explorer_ui;
mod file_operations;
mod cloud_integration;
mod theme;

fn main() {
    // Initialize GTK
    gtk::init().unwrap();

    // Apply explorer theme
    theme::apply_explorer_theme();

    // Create application
    let app = Application::builder()
        .application_id("org.tauos.tauexplorer")
        .build();

    app.connect_activate(|app| {
        // Create main window
        let window = ApplicationWindow::builder()
            .application(app)
            .title("τ Explorer")
            .default_width(1200)
            .default_height(800)
            .build();

        // Set up explorer environment
        let explorer = explorer_ui::TauExplorer::new();
        window.set_child(Some(&explorer.widget));

        // Show window
        window.present();
    });

    // Run application
    app.run();
} 