use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box, Label, CssProvider, StyleContext};

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.tau-upd")
        .build();
    
    app.connect_activate(|app| {
        let window = ApplicationWindow::new();
        window.set_application(Some(app));
        window.set_title(Some("TauOS Update Manager"));
        window.set_default_size(400, 300);
        
        let container = Box::new(gtk4::Orientation::Vertical, 20);
        container.set_margin_start(40);
        container.set_margin_end(40);
        container.set_margin_top(40);
        container.set_margin_bottom(40);
        container.add_css_class("background");
        
        let label = Label::new(Some("TauOS Update Manager"));
        label.add_css_class("titlebar-title");
        container.append(&label);
        
        window.set_child(Some(&container));
        window.show();
    });
    
    app.run();
} 