use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box, Button, Label, CssProvider, StyleContext};

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.taukit")
        .build();
    
    app.connect_activate(|app| {
        // Create main window
        let window = ApplicationWindow::new();
        window.set_application(Some(app));
        window.set_title(Some("TauKit Demo"));
        window.set_default_size(400, 300);
        
        // Create main container
        let container = Box::new(gtk4::Orientation::Vertical, 20);
        container.set_margin_start(40);
        container.set_margin_end(40);
        container.set_margin_top(40);
        container.set_margin_bottom(40);
        container.add_css_class("background");
        
        // Create title
        let title_label = Label::new(Some("TauKit Framework"));
        title_label.add_css_class("titlebar-title");
        title_label.add_css_class("shimmer");
        container.append(&title_label);
        
        // Create button
        let button = Button::with_label("TauKit Button");
        button.add_css_class("button");
        container.append(&button);
        
        window.set_child(Some(&container));
        
        // Load CSS
        let provider = CssProvider::new();
        let css = include_str!("../theme.css");
        provider.load_from_data(css.as_bytes());
        
        StyleContext::add_provider_for_display(
            &gtk4::gdk::Display::default().expect("Could not connect to a display."),
            &provider,
            gtk4::STYLE_PROVIDER_PRIORITY_APPLICATION,
        );
        
        window.show();
    });
    
    app.run();
} 