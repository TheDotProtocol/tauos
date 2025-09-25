use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Box, Button, Label, Orientation};
use gtk::gdk::Display;
use gtk::gdk_pixbuf::Pixbuf;
use gtk::glib;
use gtk::cairo;
use gtk::gdk;

mod desktop;
mod launcher;
mod privacy_indicators;
mod theme;
mod wallpapers;
mod widgets;

fn main() {
    // Initialize GTK
    gtk::init().unwrap();

    // Create application
    let app = Application::builder()
        .application_id("org.tauos.tauhome")
        .build();

    app.connect_activate(|app| {
        // Create main window
        let window = ApplicationWindow::builder()
            .application(app)
            .title("Tau Home")
            .default_width(1920)
            .default_height(1080)
            .build();

        // Set up desktop environment
        let desktop = desktop::TauDesktop::new();
        window.set_child(Some(&desktop));

        // Show window
        window.present();
    });

    // Run application
    app.run();
} 