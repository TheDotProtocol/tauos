use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Box, Button, Label, Orientation};
use adw::ApplicationWindow as AdwApplicationWindow;
use anyhow::Result;
use log::{info, error};

mod app;
mod email;
mod ui;
mod config;
mod database;
mod crypto;

use app::TauMailApp;

fn main() -> Result<()> {
    // Initialize logging
    env_logger::init();
    info!("Starting TauMail client");

    // Initialize GTK
    gtk::init()?;

    // Create application
    let app = Application::builder()
        .application_id("org.tauos.taumail")
        .flags(gtk::gio::ApplicationFlags::FLAGS_NONE)
        .build();

    app.connect_activate(|app| {
        // Create main window
        let window = AdwApplicationWindow::builder()
            .application(app)
            .title("TauMail")
            .default_width(1200)
            .default_height(800)
            .build();

        // Create main application
        let taumail_app = TauMailApp::new(&window);
        taumail_app.setup_ui();

        window.present();
    });

    // Run application
    app.run();

    Ok(())
} 