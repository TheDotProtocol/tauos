use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box, Button, Label, Image, CssProvider, StyleContext};
use std::rc::Rc;
use std::cell::RefCell;

pub struct HelloTauApp {
    window: ApplicationWindow,
    click_count: Rc<RefCell<i32>>,
    status_label: Label,
}

impl HelloTauApp {
    pub fn new(app: &Application) -> Self {
        // Create main window
        let window = ApplicationWindow::new();
        window.set_application(Some(app));
        window.set_title(Some("Hello Tau"));
        window.set_default_size(500, 400);
        window.set_resizable(true);
        
        // Create main container
        let container = Box::new(gtk4::Orientation::Vertical, 20);
        container.set_margin_start(40);
        container.set_margin_end(40);
        container.set_margin_top(40);
        container.set_margin_bottom(40);
        container.add_css_class("background");
        
        // Create title
        let title_label = Label::new(Some("Hello TauOS!"));
        title_label.add_css_class("titlebar-title");
        title_label.add_css_class("shimmer");
        container.append(&title_label);
        
        // Create subtitle
        let subtitle_label = Label::new(Some("Welcome to the future of computing"));
        subtitle_label.add_css_class("label");
        subtitle_label.add_css_class("shimmer-slow");
        container.append(&subtitle_label);
        
        // Create button with icon
        let button_container = Box::new(gtk4::Orientation::Horizontal, 12);
        button_container.set_halign(gtk4::Align::Center);
        
        // Create icon
        let icon = Image::from_icon_name("tauos-play");
        icon.set_pixel_size(24);
        icon.add_css_class("icon");
        button_container.append(&icon);
        
        // Create button
        let button = Button::with_label("Click Me!");
        button.add_css_class("button");
        button_container.append(&button);
        
        container.append(&button_container);
        
        // Create status label
        let status_label = Label::new(Some("Click the button to see the magic!"));
        status_label.add_css_class("label");
        status_label.add_css_class("shimmer-bg");
        container.append(&status_label);
        
        // Create info panel
        let info_panel = Box::new(gtk4::Orientation::Vertical, 12);
        info_panel.add_css_class("card");
        info_panel.add_css_class("shimmer-border");
        
        let info_title = Label::new(Some("TauOS Features"));
        info_title.add_css_class("label");
        info_title.add_css_class("title");
        info_panel.append(&info_title);
        
        let features = vec![
            "✨ Modern Black & Gold Theme",
            "🎨 Enhanced Shimmer Animations", 
            "🔒 Secure Sandboxing System",
            "📦 TauPkg Package Manager",
            "🛍️ TauStore App Store",
            "🎯 Developer-Friendly SDK"
        ];
        
        for feature in features {
            let feature_label = Label::new(Some(feature));
            feature_label.add_css_class("label");
            info_panel.append(&feature_label);
        }
        
        container.append(&info_panel);
        
        window.set_child(Some(&container));
        
        // Load CSS
        Self::load_css();
        
        let click_count = Rc::new(RefCell::new(0));
        
        // Connect button click
        let click_count_clone = click_count.clone();
        let status_label_clone = status_label.clone();
        button.connect_clicked(move |_| {
            let mut count = click_count_clone.borrow_mut();
            *count += 1;
            
            let messages = vec![
                "Welcome to TauOS! 🐢",
                "Shimmer animations are working! ✨",
                "The theme system is beautiful! 🎨",
                "Security and performance combined! 🔒",
                "Developer experience matters! 🎯",
                "The future is here! 🚀"
            ];
            
            let message = if *count <= messages.len() {
                messages[*count - 1]
            } else {
                format!("Clicked {} times! Keep going! 🎉", count)
            };
            
            status_label_clone.set_text(message);
        });
        
        Self {
            window,
            click_count,
            status_label,
        }
    }
    
    fn load_css() {
        let provider = CssProvider::new();
        let css = include_str!("../../taukit/theme.css");
        provider.load_from_data(css.as_bytes());
        
        StyleContext::add_provider_for_display(
            &gtk4::gdk::Display::default().expect("Could not connect to a display."),
            &provider,
            gtk4::STYLE_PROVIDER_PRIORITY_APPLICATION,
        );
    }
    
    pub fn show(&self) {
        self.window.show();
    }
    
    pub fn get_click_count(&self) -> i32 {
        *self.click_count.borrow()
    }
}

pub fn create_hello_tau_app(app: &Application) -> HelloTauApp {
    HelloTauApp::new(app)
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.hello")
        .build();
    
    app.connect_activate(|app| {
        let hello_app = create_hello_tau_app(app);
        hello_app.show();
    });
    
    app.run();
} 