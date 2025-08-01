use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box as GtkBox, Button, Label, Orientation};
use gio::ApplicationFlags;
use tauos::{gui, network, storage, security};

struct AppData {
    window: ApplicationWindow,
    label: Label,
    button: Button,
}

impl AppData {
    fn new(app: &Application) -> Self {
        // Create main window
        let window = ApplicationWindow::builder()
            .application(app)
            .title("Tau OS Rust App")
            .default_width(400)
            .default_height(300)
            .build();

        // Create main container
        let main_box = GtkBox::new(Orientation::Vertical, 20);
        main_box.set_margin_start(20);
        main_box.set_margin_end(20);
        main_box.set_margin_top(20);
        main_box.set_margin_bottom(20);

        // Create label
        let label = Label::new(Some("Welcome to Tau OS!"));
        label.set_xalign(0.5);
        label.set_yalign(0.5);
        main_box.append(&label);

        // Create button
        let button = Button::with_label("Click Me!");
        let label_clone = label.clone();
        button.connect_clicked(move |_| {
            label_clone.set_text("Hello from Tau OS Rust App!");
            
            // Example of Tau OS API usage
            gui::notification::show("Button Clicked", "You clicked the button!", "info");
        });
        main_box.append(&button);

        // Set up window
        window.set_child(Some(&main_box));

        Self {
            window,
            label,
            button,
        }
    }
}

fn main() {
    // Initialize Tau OS
    tauos::init();

    let app = Application::builder()
        .application_id("org.tauos.rust-app")
        .flags(ApplicationFlags::HANDLES_OPEN)
        .build();

    app.connect_activate(|app| {
        let app_data = AppData::new(app);
        app_data.window.show();
    });

    // Run the application
    let status = app.run();

    // Cleanup
    tauos::cleanup();

    std::process::exit(status);
} 