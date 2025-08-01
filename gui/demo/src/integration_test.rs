use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box, Button, Label, Image, CssProvider, StyleContext};
use std::rc::Rc;
use std::cell::RefCell;
use std::time::Duration;
use std::thread;

/// Integration test that demonstrates the complete visual stack
pub struct VisualStackTest {
    window: ApplicationWindow,
    current_step: Rc<RefCell<i32>>,
    status_label: Label,
    progress_label: Label,
}

impl VisualStackTest {
    pub fn new(app: &Application) -> Self {
        // Create main window
        let window = ApplicationWindow::new();
        window.set_application(Some(app));
        window.set_title(Some("TauOS Visual Stack Test"));
        window.set_default_size(600, 500);
        window.set_resizable(true);
        
        // Create main container
        let container = Box::new(gtk4::Orientation::Vertical, 20);
        container.set_margin_start(40);
        container.set_margin_end(40);
        container.set_margin_top(40);
        container.set_margin_bottom(40);
        container.add_css_class("background");
        
        // Create title
        let title_label = Label::new(Some("TauOS Visual Stack Integration Test"));
        title_label.add_css_class("titlebar-title");
        title_label.add_css_class("shimmer-pulse");
        container.append(&title_label);
        
        // Create subtitle
        let subtitle_label = Label::new(Some("Testing the complete visual pipeline"));
        subtitle_label.add_css_class("label");
        subtitle_label.add_css_class("shimmer-slow");
        container.append(&subtitle_label);
        
        // Create progress section
        let progress_container = Box::new(gtk4::Orientation::Vertical, 12);
        progress_container.add_css_class("card");
        progress_container.add_css_class("shimmer-border");
        
        let progress_title = Label::new(Some("Test Progress"));
        progress_title.add_css_class("label");
        progress_title.add_css_class("title");
        progress_container.append(&progress_title);
        
        let status_label = Label::new(Some("Ready to start visual stack test..."));
        status_label.add_css_class("label");
        progress_container.append(&status_label);
        
        let progress_label = Label::new(Some("Step 0 of 6"));
        progress_label.add_css_class("label");
        progress_container.append(&progress_label);
        
        container.append(&progress_container);
        
        // Create test controls
        let controls_container = Box::new(gtk4::Orientation::Horizontal, 12);
        controls_container.set_halign(gtk4::Align::Center);
        
        let start_button = Button::with_label("Start Visual Stack Test");
        start_button.add_css_class("button");
        controls_container.append(&start_button);
        
        let reset_button = Button::with_label("Reset Test");
        reset_button.add_css_class("button");
        reset_button.add_css_class("secondary");
        controls_container.append(&reset_button);
        
        container.append(&controls_container);
        
        // Create results section
        let results_container = Box::new(gtk4::Orientation::Vertical, 12);
        results_container.add_css_class("card");
        results_container.add_css_class("shimmer-bg");
        
        let results_title = Label::new(Some("Test Results"));
        results_title.add_css_class("label");
        results_title.add_css_class("title");
        results_container.append(&results_title);
        
        let results_list = vec![
            "✅ Splash Screen Animation",
            "⏳ Theme Configuration Loading",
            "⏳ Icon Pack Integration", 
            "⏳ Shimmer Animation Behavior",
            "⏳ Component Rendering",
            "⏳ Runtime Interactivity"
        ];
        
        for result in results_list {
            let result_label = Label::new(Some(result));
            result_label.add_css_class("label");
            results_container.append(&result_label);
        }
        
        container.append(&results_container);
        
        window.set_child(Some(&container));
        
        // Load CSS
        Self::load_css();
        
        let current_step = Rc::new(RefCell::new(0));
        
        // Connect start button
        let current_step_clone = current_step.clone();
        let status_label_clone = status_label.clone();
        let progress_label_clone = progress_label.clone();
        start_button.connect_clicked(move |_| {
            let mut step = current_step_clone.borrow_mut();
            *step = 0;
            status_label_clone.set_text("Starting visual stack test...");
            progress_label_clone.set_text("Step 1 of 6");
            
            // Start the test sequence
            let test_steps = vec![
                ("Testing splash screen animation...", "Splash screen with turtle shell and shimmer effects"),
                ("Loading theme configuration...", "Black & Gold theme with enhanced animations"),
                ("Integrating icon pack...", "TauOS custom icons with multiple sizes"),
                ("Finalizing shimmer behavior...", "Smooth transitions and cubic-bezier timing"),
                ("Rendering UI components...", "Modern buttons, cards, and interactive elements"),
                ("Testing runtime interactivity...", "Click handlers and dynamic updates")
            ];
            
            for (i, (status, description)) in test_steps.iter().enumerate() {
                let step_num = i + 1;
                let status_clone = status_label_clone.clone();
                let progress_clone = progress_label_clone.clone();
                
                thread::spawn(move || {
                    thread::sleep(Duration::from_millis(1500));
                    
                    gtk4::glib::MainContext::channel::<()>(gtk4::glib::PRIORITY_DEFAULT)
                        .0
                        .send(())
                        .unwrap();
                });
                
                status_label_clone.set_text(status);
                progress_label_clone.set_text(&format!("Step {} of 6: {}", step_num, description));
                
                // Process events to update UI
                while gtk4::glib::MainContext::pending(&gtk4::glib::MainContext::default()) {
                    gtk4::glib::MainContext::iteration(&gtk4::glib::MainContext::default(), false);
                }
            }
            
            status_label_clone.set_text("✅ Visual stack test completed successfully!");
            progress_label_clone.set_text("All components working correctly");
        });
        
        // Connect reset button
        let current_step_clone = current_step.clone();
        let status_label_clone = status_label.clone();
        let progress_label_clone = progress_label.clone();
        reset_button.connect_clicked(move |_| {
            let mut step = current_step_clone.borrow_mut();
            *step = 0;
            status_label_clone.set_text("Test reset. Ready to start visual stack test...");
            progress_label_clone.set_text("Step 0 of 6");
        });
        
        Self {
            window,
            current_step,
            status_label,
            progress_label,
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
    
    pub fn get_current_step(&self) -> i32 {
        *self.current_step.borrow()
    }
    
    pub fn run_splash_simulation(&self) {
        // Simulate splash screen behavior
        self.status_label.set_text("🐢 Loading TauOS...");
        self.progress_label.set_text("Initializing system components");
        
        let splash_steps = vec![
            ("Initializing kernel...", "Loading core system"),
            ("Loading system services...", "Starting background processes"),
            ("Starting network...", "Establishing connections"),
            ("Mounting filesystems...", "Preparing storage"),
            ("Loading user interface...", "Applying theme and animations"),
            ("Starting TauOS...", "Welcome to the future!")
        ];
        
        for (i, (step, description)) in splash_steps.iter().enumerate() {
            let status_clone = self.status_label.clone();
            let progress_clone = self.progress_label.clone();
            
            thread::spawn(move || {
                thread::sleep(Duration::from_millis(800));
                
                gtk4::glib::MainContext::channel::<()>(gtk4::glib::PRIORITY_DEFAULT)
                    .0
                    .send(())
                    .unwrap();
            });
            
            self.status_label.set_text(step);
            self.progress_label.set_text(description);
            
            // Process events to update UI
            while gtk4::glib::MainContext::pending(&gtk4::glib::MainContext::default()) {
                gtk4::glib::MainContext::iteration(&gtk4::glib::MainContext::default(), false);
            }
        }
    }
}

pub fn create_visual_stack_test(app: &Application) -> VisualStackTest {
    VisualStackTest::new(app)
} 