use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Box, Button, Entry, FlowBox, Label, Orientation, Revealer, ScrolledWindow};
use gtk::glib;

pub struct TauLauncher {
    widget: Revealer,
    search_entry: Entry,
    app_grid: FlowBox,
}

impl TauLauncher {
    pub fn new() -> Self {
        // Create main container
        let main_box = Box::new(Orientation::Vertical, 16);
        main_box.add_css_class("app-launcher");
        main_box.set_size_request(600, 400);

        // Create search entry
        let search_entry = Entry::new();
        search_entry.set_placeholder_text(Some("Search apps..."));
        search_entry.add_css_class("search-entry");
        main_box.append(&search_entry);

        // Create app grid
        let scrolled_window = ScrolledWindow::new();
        let app_grid = FlowBox::new();
        app_grid.set_selection_mode(gtk::SelectionMode::None);
        app_grid.set_max_children_per_line(4);
        app_grid.set_min_children_per_line(2);
        scrolled_window.set_child(Some(&app_grid));
        main_box.append(&scrolled_window);

        // Add apps to grid
        Self::populate_apps(&app_grid);

        // Create revealer for show/hide
        let revealer = Revealer::new();
        revealer.set_child(Some(&main_box));
        revealer.set_reveal_child(false);

        // Connect search
        let app_grid_clone = app_grid.clone();
        search_entry.connect_changed(move |entry| {
            let search_text = entry.text().to_lowercase();
            Self::filter_apps(&app_grid_clone, &search_text);
        });

        Self {
            widget: revealer,
            search_entry,
            app_grid,
        }
    }

    fn populate_apps(app_grid: &FlowBox) {
        let apps = vec![
            ("Tau Browser", "🌐", "browser", "High", "Privacy-focused web browser"),
            ("Tau Mail", "📧", "mail", "High", "Secure email client"),
            ("Tau Cloud", "☁️", "cloud", "High", "Encrypted cloud storage"),
            ("Tau Explorer", "📁", "explorer", "High", "File manager"),
            ("Tau Store", "🛒", "store", "Medium", "App store"),
            ("Tau Settings", "⚙️", "settings", "High", "System settings"),
            ("Tau Media", "🎵", "media", "Medium", "Media player"),
            ("Tau Office", "📄", "office", "Medium", "Document editor"),
        ];

        for (name, icon, app_id, privacy_level, description) in apps {
            let app_button = Self::create_app_button(name, icon, app_id, privacy_level, description);
            app_grid.append(&app_button);
        }
    }

    fn create_app_button(name: &str, icon: &str, app_id: &str, privacy_level: &str, description: &str) -> Button {
        let button = Button::new();
        button.add_css_class("app-button");

        let content_box = Box::new(Orientation::Vertical, 8);
        content_box.set_size_request(120, 100);

        // App icon
        let icon_label = Label::new(Some(icon));
        icon_label.add_css_class("app-icon");
        icon_label.set_css_classes(&["app-icon", "fade-in"]);
        content_box.append(&icon_label);

        // App name
        let name_label = Label::new(Some(name));
        name_label.add_css_class("app-name");
        content_box.append(&name_label);

        // Privacy level
        let privacy_label = Label::new(Some(format!("🔒 {}", privacy_level)));
        privacy_label.add_css_class("privacy-level");
        content_box.append(&privacy_label);

        button.set_child(Some(&content_box));

        // Add tooltip
        button.set_tooltip_text(Some(description));

        // Connect click signal
        let app_id = app_id.to_string();
        button.connect_clicked(move |_| {
            println!("Launching {}", app_id);
            // TODO: Launch application
        });

        button
    }

    fn filter_apps(app_grid: &FlowBox, search_text: &str) {
        // TODO: Implement app filtering based on search text
        println!("Filtering apps for: {}", search_text);
    }

    pub fn widget(&self) -> &Revealer {
        &self.widget
    }

    pub fn show(&self) {
        self.widget.set_reveal_child(true);
        self.search_entry.grab_focus();
    }

    pub fn hide(&self) {
        self.widget.set_reveal_child(false);
    }

    pub fn toggle(&self) {
        if self.widget.reveals_child() {
            self.hide();
        } else {
            self.show();
        }
    }
} 