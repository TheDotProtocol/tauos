use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Box, Button, Label, Orientation};
use adw::ApplicationWindow as AdwApplicationWindow;
use anyhow::Result;
use log::{info, error};

mod app;
mod call;
mod contact;
mod ui;
mod config;
mod database;
mod crypto;
mod webrtc;

use app::TauConnectApp;

fn main() -> Result<()> {
    // Initialize logging
    env_logger::init();
    info!("Starting TauConnect client");

    // Initialize GTK
    gtk::init()?;

    // Initialize GStreamer for media handling
    gstreamer::init()?;

    // Create application
    let app = Application::builder()
        .application_id("org.tauos.tauconnect")
        .flags(gtk::gio::ApplicationFlags::FLAGS_NONE)
        .build();

    app.connect_activate(|app| {
        // Create main window
        let window = AdwApplicationWindow::builder()
            .application(app)
            .title("TauConnect")
            .default_width(1000)
            .default_height(700)
            .build();

        // Create main application
        let tauconnect_app = TauConnectApp::new(&window);
        tauconnect_app.setup_ui();

        window.present();
    });

    // Run application
    app.run();

    Ok(())
} 