use gtk4::prelude::*;
use gtk4::{Box as GtkBox, Orientation, Switch, Label, ListBox, ListBoxRow, Notebook, Button, Entry, Frame, ScrolledWindow, Image, Separator, Popover, EventControllerKey, EventControllerMotion, GestureClick, gdk, AccessibleRole};

// DockBar widget with enhanced functionality
pub struct DockBar {
    pub container: GtkBox,
}

impl DockBar {
    pub fn new() -> Self {
        let hbox = GtkBox::new(Orientation::Horizontal, 16);
        hbox.set_margin_top(8);
        hbox.set_margin_bottom(8);
        hbox.set_margin_start(24);
        hbox.set_margin_end(24);
        
        Self { container: hbox }
    }
    
    pub fn add_app(&self, name: &str, icon_path: &str, running: bool) -> Button {
        let app_button = Button::new();
        
        let icon = Image::from_file(icon_path);
        let label = Label::new(Some(name));
        let app_box = GtkBox::new(Orientation::Vertical, 4);
        app_box.append(&icon);
        app_box.append(&label);
        
        if running {
            let dot = Label::new(Some("●"));
            dot.set_css_classes(&["running-dot"]);
            app_box.append(&dot);
        }
        
        app_button.set_child(Some(&app_box));
        app_button.set_accessible_role(AccessibleRole::Button);
        
        self.container.append(&app_button);
        app_button
    }
    
    pub fn add_separator(&self) {
        let separator = Separator::new(Orientation::Vertical);
        separator.set_margin_start(8);
        separator.set_margin_end(8);
        self.container.append(&separator);
    }
}

// Enhanced ToggleSwitch widget with better styling
pub fn toggle_switch(label: &str, active: bool) -> GtkBox {
    let hbox = GtkBox::new(Orientation::Horizontal, 8);
    let lbl = Label::new(Some(label));
    lbl.set_hexpand(true);
    let sw = Switch::builder().active(active).build();
    hbox.append(&lbl);
    hbox.append(&sw);
    hbox
}

// TabView widget with enhanced functionality
pub fn tab_view() -> Notebook {
    let notebook = Notebook::new();
    notebook.set_tab_pos(gtk4::PositionType::Top);
    notebook
}

// ListView widget with enhanced features
pub fn list_view(items: &[&str]) -> ListBox {
    let list = ListBox::new();
    for item in items {
        let row = ListBoxRow::new();
        let label = Label::new(Some(item));
        row.set_child(Some(&label));
        list.append(&row);
    }
    list
}

// SettingsPanel with comprehensive functionality
pub struct SettingsPanel {
    pub container: GtkBox,
}

impl SettingsPanel {
    pub fn new() -> Self {
        let vbox = GtkBox::new(Orientation::Vertical, 16);
        vbox.set_margin_start(16);
        vbox.set_margin_end(16);
        vbox.set_margin_top(16);
        vbox.set_margin_bottom(16);
        
        Self { container: vbox }
    }
    
    pub fn add_section(&self, title: &str) -> Frame {
        let frame = Frame::new(Some(title));
        let box_widget = GtkBox::new(Orientation::Vertical, 8);
        frame.set_child(Some(&box_widget));
        
        self.container.append(&frame);
        frame
    }
    
    pub fn add_toggle(&self, frame: &Frame, label: &str, active: bool) -> Switch {
        let toggle = toggle_switch(label, active);
        if let Some(child) = frame.child() {
            if let Some(box_widget) = child.downcast::<GtkBox>().ok() {
                box_widget.append(&toggle);
            }
        }
        
        // Find the switch in the toggle box
        if let Some(toggle_child) = toggle.last_child() {
            if let Some(switch) = toggle_child.downcast::<Switch>().ok() {
                return switch;
            }
        }
        
        // Fallback: create a new switch
        Switch::builder().active(active).build()
    }
}

// AppGrid widget for application grid layout
pub struct AppGrid {
    pub grid: gtk4::Grid,
}

impl AppGrid {
    pub fn new() -> Self {
        let grid = gtk4::Grid::new();
        grid.set_row_spacing(16);
        grid.set_column_spacing(16);
        grid.set_margin_start(16);
        grid.set_margin_end(16);
        grid.set_margin_top(16);
        grid.set_margin_bottom(16);
        
        Self { grid }
    }
    
    pub fn add_app(&self, name: &str, icon_path: &str, row: i32, col: i32) -> Button {
        let app_button = Button::new();
        
        let icon = Image::from_file(icon_path);
        let label = Label::new(Some(name));
        let app_box = GtkBox::new(Orientation::Vertical, 4);
        app_box.append(&icon);
        app_box.append(&label);
        
        app_button.set_child(Some(&app_box));
        app_button.set_accessible_role(AccessibleRole::Button);
        
        self.grid.attach(&app_button, col, row, 1, 1);
        app_button
    }
}

// SearchBar widget for search functionality
pub struct SearchBar {
    pub entry: Entry,
}

impl SearchBar {
    pub fn new(placeholder: &str) -> Self {
        let entry = Entry::new();
        entry.set_placeholder_text(Some(placeholder));
        entry.set_hexpand(true);
        
        Self { entry }
    }
    
    pub fn connect_changed<F>(&self, callback: F)
    where
        F: Fn(&str) + 'static,
    {
        self.entry.connect_changed(move |entry| {
            let text = entry.text();
            callback(&text);
        });
    }
}

// Notification widget for displaying notifications
pub struct Notification {
    pub container: GtkBox,
}

impl Notification {
    pub fn new(title: &str, message: &str, notification_type: NotificationType) -> Self {
        let container = GtkBox::new(Orientation::Vertical, 8);
        container.set_margin_start(16);
        container.set_margin_end(16);
        container.set_margin_top(8);
        container.set_margin_bottom(8);
        
        let title_label = Label::new(Some(title));
        title_label.set_css_classes(&["notification-title"]);
        
        let message_label = Label::new(Some(message));
        message_label.set_css_classes(&["notification-message"]);
        
        container.append(&title_label);
        container.append(&message_label);
        
        // Add notification type styling
        let css_class = match notification_type {
            NotificationType::Info => "notification-info",
            NotificationType::Success => "notification-success",
            NotificationType::Warning => "notification-warning",
            NotificationType::Error => "notification-error",
        };
        container.set_css_classes(&[css_class]);
        
        Self { container }
    }
}

pub enum NotificationType {
    Info,
    Success,
    Warning,
    Error,
}

impl ToString for NotificationType {
    fn to_string(&self) -> String {
        match self {
            NotificationType::Info => "Info".to_string(),
            NotificationType::Success => "Success".to_string(),
            NotificationType::Warning => "Warning".to_string(),
            NotificationType::Error => "Error".to_string(),
        }
    }
}

// ProgressBar widget for progress indication
pub struct ProgressBar {
    pub bar: gtk4::ProgressBar,
}

impl ProgressBar {
    pub fn new() -> Self {
        let bar = gtk4::ProgressBar::new();
        bar.set_show_text(true);
        
        Self { bar }
    }
    
    pub fn set_progress(&self, fraction: f64) {
        self.bar.set_fraction(fraction);
    }
    
    pub fn set_text(&self, text: &str) {
        self.bar.set_text(Some(text));
    }
}

// StatusBar widget for status information
pub struct StatusBar {
    pub container: GtkBox,
}

impl StatusBar {
    pub fn new() -> Self {
        let container = GtkBox::new(Orientation::Horizontal, 8);
        container.set_margin_start(16);
        container.set_margin_end(16);
        container.set_margin_top(4);
        container.set_margin_bottom(4);
        
        Self { container }
    }
    
    pub fn add_status(&self, text: &str) -> Label {
        let label = Label::new(Some(text));
        self.container.append(&label);
        label
    }
    
    pub fn add_separator(&self) {
        let separator = Separator::new(Orientation::Vertical);
        separator.set_margin_start(8);
        separator.set_margin_end(8);
        self.container.append(&separator);
    }
}

// Toolbar widget for application toolbars
pub struct Toolbar {
    pub container: GtkBox,
}

impl Toolbar {
    pub fn new() -> Self {
        let container = GtkBox::new(Orientation::Horizontal, 4);
        container.set_margin_start(8);
        container.set_margin_end(8);
        container.set_margin_top(4);
        container.set_margin_bottom(4);
        
        Self { container }
    }
    
    pub fn add_button(&self, label: &str, icon: Option<&str>) -> Button {
        let button = Button::new();
        
        if let Some(icon_path) = icon {
            let icon_widget = Image::from_file(icon_path);
            button.set_child(Some(&icon_widget));
        } else {
            button.set_label(label);
        }
        
        self.container.append(&button);
        button
    }
    
    pub fn add_separator(&self) {
        let separator = Separator::new(Orientation::Vertical);
        separator.set_margin_start(4);
        separator.set_margin_end(4);
        self.container.append(&separator);
    }
} 