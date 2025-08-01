use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box, Label, CssProvider, StyleContext};
use std::time::Duration;
use std::thread;

pub struct SplashScreen {
    window: ApplicationWindow,
    loading_label: Label,
    progress_label: Label,
}

impl SplashScreen {
    pub fn new(app: &Application) -> Self {
        // Create main window
        let window = ApplicationWindow::new();
        window.set_application(Some(app));
        window.set_title(Some("TauOS"));
        window.set_default_size(400, 300);
        window.set_resizable(false);
        window.set_decorated(false);
        window.set_skip_taskbar_hint(true);
        window.set_skip_pager_hint(true);
        window.set_keep_above(true);
        
        // Center window on screen
        if let Some(display) = gtk4::gdk::Display::default() {
            if let Some(monitor) = display.monitor_at_surface(&window.surface()) {
                let geometry = monitor.geometry();
                let window_width = 400;
                let window_height = 300;
                let x = geometry.x() + (geometry.width() - window_width) / 2;
                let y = geometry.y() + (geometry.height() - window_height) / 2;
                window.move_(x, y);
            }
        }
        
        // Create main container
        let container = Box::new(gtk4::Orientation::Vertical, 20);
        container.set_margin_start(40);
        container.set_margin_end(40);
        container.set_margin_top(60);
        container.set_margin_bottom(40);
        container.add_css_class("splash-container");
        
        // Create turtle shell icon
        let shell_label = Label::new(Some("🐢"));
        shell_label.add_css_class("turtle-shell");
        shell_label.add_css_class("shimmer-pulse");
        container.append(&shell_label);
        
        // Create loading text
        let loading_label = Label::new(Some("Starting TauOS..."));
        loading_label.add_css_class("loading-text");
        loading_label.add_css_class("shimmer");
        container.append(&loading_label);
        
        // Create progress text
        let progress_label = Label::new(Some("Initializing system..."));
        progress_label.add_css_class("progress-text");
        container.append(&progress_label);
        
        // Create loading dots
        let dots_container = Box::new(gtk4::Orientation::Horizontal, 8);
        dots_container.set_halign(gtk4::Align::Center);
        
        for i in 0..3 {
            let dot = Label::new(Some("•"));
            dot.add_css_class("loading-dot");
            dot.set_css_classes(&[format!("dot-{}", i + 1)]);
            dots_container.append(&dot);
        }
        
        container.append(&dots_container);
        
        window.set_child(Some(&container));
        
        // Load CSS
        Self::load_css();
        
        Self {
            window,
            loading_label,
            progress_label,
        }
    }
    
    fn load_css() {
        let provider = CssProvider::new();
        let css = include_str!("../splash.css");
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
    
    pub fn hide(&self) {
        self.window.close();
    }
    
    pub fn update_loading_text(&self, text: &str) {
        self.loading_label.set_text(text);
    }
    
    pub fn update_progress(&self, text: &str) {
        self.progress_label.set_text(text);
    }
    
    pub fn simulate_boot_sequence(&self) {
        let loading_steps = vec![
            "Initializing kernel...",
            "Loading system services...",
            "Starting network...",
            "Mounting filesystems...",
            "Loading user interface...",
            "Starting TauOS...",
        ];
        
        for (i, step) in loading_steps.iter().enumerate() {
            let window = self.window.clone();
            let loading_label = self.loading_label.clone();
            let progress_label = self.progress_label.clone();
            
            thread::spawn(move || {
                thread::sleep(Duration::from_millis(800));
                
                gtk4::glib::MainContext::channel::<()>(gtk4::glib::PRIORITY_DEFAULT)
                    .0
                    .send(())
                    .unwrap();
            });
            
            self.update_loading_text(step);
            self.update_progress(&format!("Step {} of {}", i + 1, loading_steps.len()));
            
            // Process events to update UI
            while gtk4::glib::MainContext::pending(&gtk4::glib::MainContext::default()) {
                gtk4::glib::MainContext::iteration(&gtk4::glib::MainContext::default(), false);
            }
        }
    }
}

pub fn create_splash_screen(app: &Application) -> SplashScreen {
    SplashScreen::new(app)
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.splash")
        .build();
    
    app.connect_activate(|app| {
        let splash = create_splash_screen(app);
        splash.show();
        splash.simulate_boot_sequence();
    });
    
    app.run();
} 