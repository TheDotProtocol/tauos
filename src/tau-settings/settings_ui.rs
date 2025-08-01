use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Box, Button, Entry, HeaderBar, Orientation, ScrolledWindow, Label, ListBox, ListBoxRow, Stack, StackSwitcher, Switch, Scale, ComboBoxText};
use std::sync::{Arc, Mutex};

pub struct TauSettings {
    pub widget: Box,
    sidebar: ListBox,
    content_stack: Stack,
    current_section: Arc<Mutex<String>>,
}

impl TauSettings {
    pub fn new() -> Self {
        // Create main container
        let main_box = Box::new(Orientation::Horizontal, 0);
        
        // Create sidebar
        let sidebar = Self::create_sidebar();
        main_box.append(&sidebar);
        
        // Create content area
        let content_area = Box::new(Orientation::Vertical, 0);
        
        // Create header
        let header = Self::create_header();
        content_area.append(&header);
        
        // Create content stack
        let content_stack = Self::create_content_stack();
        content_area.append(&content_stack);
        
        main_box.append(&content_area);
        
        // Initialize state
        let current_section = Arc::new(Mutex::new("General".to_string()));
        
        Self {
            widget: main_box,
            sidebar,
            content_stack,
            current_section,
        }
    }
    
    fn create_sidebar() -> ListBox {
        let sidebar = ListBox::new();
        sidebar.add_css_class("settings-sidebar");
        
        // Add sidebar items
        let sections = vec![
            ("⚙️ General", "general"),
            ("🎨 Appearance", "appearance"),
            ("🔒 Privacy & Security", "privacy"),
            ("🌐 Network", "network"),
            ("💾 Storage", "storage"),
            ("🔊 Sound", "sound"),
            ("📱 Notifications", "notifications"),
            ("♿ Accessibility", "accessibility"),
            ("🔄 Updates", "updates"),
            ("🔧 Advanced", "advanced"),
        ];
        
        for (name, id) in sections {
            let row = Self::create_sidebar_item(name, id);
            sidebar.append(&row);
        }
        
        sidebar
    }
    
    fn create_sidebar_item(name: &str, id: &str) -> ListBoxRow {
        let row = ListBoxRow::new();
        let box_widget = Box::new(Orientation::Horizontal, 8);
        
        let icon = Label::new(Some(&name[..4])); // First 4 chars (emoji)
        icon.add_css_class("sidebar-icon");
        
        let label = Label::new(Some(&name[4..])); // Rest of the name
        label.add_css_class("sidebar-label");
        
        box_widget.append(&icon);
        box_widget.append(&label);
        row.set_child(Some(&box_widget));
        
        row
    }
    
    fn create_header() -> Box {
        let header = Box::new(Orientation::Horizontal, 16);
        header.add_css_class("settings-header");
        
        // Settings title
        let title = Label::new(Some("τ Settings"));
        title.add_css_class("settings-title");
        header.append(&title);
        
        // Search button
        let search_button = Button::new();
        search_button.set_label(Some("🔍 Search"));
        search_button.add_css_class("header-button");
        header.append(&search_button);
        
        // Help button
        let help_button = Button::new();
        help_button.set_label(Some("❓ Help"));
        help_button.add_css_class("header-button");
        header.append(&help_button);
        
        header
    }
    
    fn create_content_stack() -> Stack {
        let stack = Stack::new();
        stack.add_css_class("settings-content");
        
        // General settings
        let general_page = Self::create_general_page();
        stack.add_titled(&general_page, Some("general"), "General");
        
        // Appearance settings
        let appearance_page = Self::create_appearance_page();
        stack.add_titled(&appearance_page, Some("appearance"), "Appearance");
        
        // Privacy settings
        let privacy_page = Self::create_privacy_page();
        stack.add_titled(&privacy_page, Some("privacy"), "Privacy & Security");
        
        // Network settings
        let network_page = Self::create_network_page();
        stack.add_titled(&network_page, Some("network"), "Network");
        
        // Storage settings
        let storage_page = Self::create_storage_page();
        stack.add_titled(&storage_page, Some("storage"), "Storage");
        
        // Sound settings
        let sound_page = Self::create_sound_page();
        stack.add_titled(&sound_page, Some("sound"), "Sound");
        
        // Notifications settings
        let notifications_page = Self::create_notifications_page();
        stack.add_titled(&notifications_page, Some("notifications"), "Notifications");
        
        // Accessibility settings
        let accessibility_page = Self::create_accessibility_page();
        stack.add_titled(&accessibility_page, Some("accessibility"), "Accessibility");
        
        // Updates settings
        let updates_page = Self::create_updates_page();
        stack.add_titled(&updates_page, Some("updates"), "Updates");
        
        // Advanced settings
        let advanced_page = Self::create_advanced_page();
        stack.add_titled(&advanced_page, Some("advanced"), "Advanced");
        
        stack
    }
    
    fn create_general_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // System information
        let system_info = Self::create_section("System Information");
        page.append(&system_info);
        
        let info_items = vec![
            ("OS Version", "TauOS 1.0.0"),
            ("Kernel", "Linux 6.6.30"),
            ("Architecture", "x86_64"),
            ("Memory", "16 GB"),
            ("Storage", "512 GB SSD"),
        ];
        
        for (label, value) in info_items {
            let item = Self::create_info_item(label, value);
            page.append(&item);
        }
        
        // Language and region
        let language_section = Self::create_section("Language & Region");
        page.append(&language_section);
        
        let language_combo = ComboBoxText::new();
        language_combo.append_text("English (US)");
        language_combo.append_text("English (UK)");
        language_combo.append_text("Español");
        language_combo.append_text("Français");
        language_combo.append_text("Deutsch");
        language_combo.set_active(Some(0));
        language_combo.add_css_class("settings-combo");
        page.append(&language_combo);
        
        // Date and time
        let datetime_section = Self::create_section("Date & Time");
        page.append(&datetime_section);
        
        let auto_time_switch = Switch::new();
        auto_time_switch.set_active(true);
        let auto_time_item = Self::create_switch_item("Set time automatically", auto_time_switch);
        page.append(&auto_time_item);
        
        let timezone_combo = ComboBoxText::new();
        timezone_combo.append_text("UTC");
        timezone_combo.append_text("America/New_York");
        timezone_combo.append_text("Europe/London");
        timezone_combo.append_text("Asia/Tokyo");
        timezone_combo.set_active(Some(0));
        timezone_combo.add_css_class("settings-combo");
        page.append(&timezone_combo);
        
        page
    }
    
    fn create_appearance_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // Theme settings
        let theme_section = Self::create_section("Theme");
        page.append(&theme_section);
        
        let theme_combo = ComboBoxText::new();
        theme_combo.append_text("Dark");
        theme_combo.append_text("Light");
        theme_combo.append_text("Auto");
        theme_combo.set_active(Some(0));
        theme_combo.add_css_class("settings-combo");
        page.append(&theme_combo);
        
        // Wallpaper
        let wallpaper_section = Self::create_section("Wallpaper");
        page.append(&wallpaper_section);
        
        let wallpaper_button = Button::new();
        wallpaper_button.set_label(Some("Choose Wallpaper"));
        wallpaper_button.add_css_class("settings-button");
        page.append(&wallpaper_button);
        
        // Desktop effects
        let effects_section = Self::create_section("Desktop Effects");
        page.append(&effects_section);
        
        let animations_switch = Switch::new();
        animations_switch.set_active(true);
        let animations_item = Self::create_switch_item("Enable animations", animations_switch);
        page.append(&animations_item);
        
        let transparency_switch = Switch::new();
        transparency_switch.set_active(true);
        let transparency_item = Self::create_switch_item("Enable transparency", transparency_switch);
        page.append(&transparency_item);
        
        page
    }
    
    fn create_privacy_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // Privacy settings
        let privacy_section = Self::create_section("Privacy");
        page.append(&privacy_section);
        
        let telemetry_switch = Switch::new();
        telemetry_switch.set_active(false);
        let telemetry_item = Self::create_switch_item("Allow telemetry", telemetry_switch);
        page.append(&telemetry_item);
        
        let location_switch = Switch::new();
        location_switch.set_active(false);
        let location_item = Self::create_switch_item("Allow location access", location_switch);
        page.append(&location_item);
        
        let camera_switch = Switch::new();
        camera_switch.set_active(false);
        let camera_item = Self::create_switch_item("Allow camera access", camera_switch);
        page.append(&camera_item);
        
        let microphone_switch = Switch::new();
        microphone_switch.set_active(false);
        let microphone_item = Self::create_switch_item("Allow microphone access", microphone_switch);
        page.append(&microphone_item);
        
        // Security settings
        let security_section = Self::create_section("Security");
        page.append(&security_section);
        
        let firewall_switch = Switch::new();
        firewall_switch.set_active(true);
        let firewall_item = Self::create_switch_item("Enable firewall", firewall_switch);
        page.append(&firewall_item);
        
        let updates_switch = Switch::new();
        updates_switch.set_active(true);
        let updates_item = Self::create_switch_item("Automatic security updates", updates_switch);
        page.append(&updates_item);
        
        page
    }
    
    fn create_network_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // Network connections
        let network_section = Self::create_section("Network Connections");
        page.append(&network_section);
        
        let wifi_switch = Switch::new();
        wifi_switch.set_active(true);
        let wifi_item = Self::create_switch_item("Wi-Fi", wifi_switch);
        page.append(&wifi_item);
        
        let bluetooth_switch = Switch::new();
        bluetooth_switch.set_active(false);
        let bluetooth_item = Self::create_switch_item("Bluetooth", bluetooth_switch);
        page.append(&bluetooth_item);
        
        // VPN
        let vpn_section = Self::create_section("VPN");
        page.append(&vpn_section);
        
        let vpn_switch = Switch::new();
        vpn_switch.set_active(false);
        let vpn_item = Self::create_switch_item("Enable VPN", vpn_switch);
        page.append(&vpn_item);
        
        page
    }
    
    fn create_storage_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // Storage information
        let storage_section = Self::create_section("Storage Information");
        page.append(&storage_section);
        
        let storage_items = vec![
            ("Total Space", "512 GB"),
            ("Used Space", "128 GB"),
            ("Available Space", "384 GB"),
        ];
        
        for (label, value) in storage_items {
            let item = Self::create_info_item(label, value);
            page.append(&item);
        }
        
        // Storage management
        let management_section = Self::create_section("Storage Management");
        page.append(&management_section);
        
        let cleanup_button = Button::new();
        cleanup_button.set_label(Some("Clean Up Storage"));
        cleanup_button.add_css_class("settings-button");
        page.append(&cleanup_button);
        
        page
    }
    
    fn create_sound_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // Volume settings
        let volume_section = Self::create_section("Volume");
        page.append(&volume_section);
        
        let system_volume = Scale::new(gtk::Orientation::Horizontal, None);
        system_volume.set_range(0.0, 100.0);
        system_volume.set_value(75.0);
        system_volume.add_css_class("settings-scale");
        page.append(&system_volume);
        
        // Sound effects
        let effects_section = Self::create_section("Sound Effects");
        page.append(&effects_section);
        
        let sound_effects_switch = Switch::new();
        sound_effects_switch.set_active(true);
        let sound_effects_item = Self::create_switch_item("Enable sound effects", sound_effects_switch);
        page.append(&sound_effects_item);
        
        page
    }
    
    fn create_notifications_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // Notification settings
        let notifications_section = Self::create_section("Notifications");
        page.append(&notifications_section);
        
        let notifications_switch = Switch::new();
        notifications_switch.set_active(true);
        let notifications_item = Self::create_switch_item("Enable notifications", notifications_switch);
        page.append(&notifications_item);
        
        let do_not_disturb_switch = Switch::new();
        do_not_disturb_switch.set_active(false);
        let do_not_disturb_item = Self::create_switch_item("Do not disturb", do_not_disturb_switch);
        page.append(&do_not_disturb_item);
        
        page
    }
    
    fn create_accessibility_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // Accessibility features
        let accessibility_section = Self::create_section("Accessibility Features");
        page.append(&accessibility_section);
        
        let screen_reader_switch = Switch::new();
        screen_reader_switch.set_active(false);
        let screen_reader_item = Self::create_switch_item("Screen reader", screen_reader_switch);
        page.append(&screen_reader_item);
        
        let high_contrast_switch = Switch::new();
        high_contrast_switch.set_active(false);
        let high_contrast_item = Self::create_switch_item("High contrast", high_contrast_switch);
        page.append(&high_contrast_item);
        
        let large_text_switch = Switch::new();
        large_text_switch.set_active(false);
        let large_text_item = Self::create_switch_item("Large text", large_text_switch);
        page.append(&large_text_item);
        
        page
    }
    
    fn create_updates_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // Update settings
        let updates_section = Self::create_section("System Updates");
        page.append(&updates_section);
        
        let auto_updates_switch = Switch::new();
        auto_updates_switch.set_active(true);
        let auto_updates_item = Self::create_switch_item("Automatic updates", auto_updates_switch);
        page.append(&auto_updates_item);
        
        let check_updates_button = Button::new();
        check_updates_button.set_label(Some("Check for Updates"));
        check_updates_button.add_css_class("settings-button");
        page.append(&check_updates_button);
        
        // Update information
        let update_info_section = Self::create_section("Update Information");
        page.append(&update_info_section);
        
        let update_info_items = vec![
            ("Current Version", "TauOS 1.0.0"),
            ("Last Check", "Today"),
            ("Available Updates", "0"),
        ];
        
        for (label, value) in update_info_items {
            let item = Self::create_info_item(label, value);
            page.append(&item);
        }
        
        page
    }
    
    fn create_advanced_page() -> Box {
        let page = Box::new(Orientation::Vertical, 16);
        page.add_css_class("settings-page");
        
        // Advanced settings
        let advanced_section = Self::create_section("Advanced Options");
        page.append(&advanced_section);
        
        let developer_mode_switch = Switch::new();
        developer_mode_switch.set_active(false);
        let developer_mode_item = Self::create_switch_item("Developer mode", developer_mode_switch);
        page.append(&developer_mode_item);
        
        let debug_mode_switch = Switch::new();
        debug_mode_switch.set_active(false);
        let debug_mode_item = Self::create_switch_item("Debug mode", debug_mode_switch);
        page.append(&debug_mode_item);
        
        // System tools
        let tools_section = Self::create_section("System Tools");
        page.append(&tools_section);
        
        let system_info_button = Button::new();
        system_info_button.set_label(Some("System Information"));
        system_info_button.add_css_class("settings-button");
        page.append(&system_info_button);
        
        let log_viewer_button = Button::new();
        log_viewer_button.set_label(Some("Log Viewer"));
        log_viewer_button.add_css_class("settings-button");
        page.append(&log_viewer_button);
        
        page
    }
    
    fn create_section(title: &str) -> Label {
        let section = Label::new(Some(title));
        section.add_css_class("settings-section-title");
        section
    }
    
    fn create_info_item(label: &str, value: &str) -> Box {
        let item = Box::new(Orientation::Horizontal, 16);
        item.add_css_class("settings-info-item");
        
        let label_widget = Label::new(Some(label));
        label_widget.add_css_class("settings-info-label");
        
        let value_widget = Label::new(Some(value));
        value_widget.add_css_class("settings-info-value");
        
        item.append(&label_widget);
        item.append(&value_widget);
        
        item
    }
    
    fn create_switch_item(label: &str, switch: Switch) -> Box {
        let item = Box::new(Orientation::Horizontal, 16);
        item.add_css_class("settings-switch-item");
        
        let label_widget = Label::new(Some(label));
        label_widget.add_css_class("settings-switch-label");
        
        item.append(&label_widget);
        item.append(&switch);
        
        item
    }
} 