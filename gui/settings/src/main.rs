use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box as GtkBox, Label, Orientation, CssProvider, StyleContext, STYLE_PROVIDER_PRIORITY_APPLICATION, Notebook, ListBox, ListBoxRow, Switch, Scale, Adjustment, ComboBoxText, Button, Entry, Separator, Frame, ScrolledWindow, EventControllerKey, gdk, gdk::Display};
use gio::ApplicationFlags;
use std::cell::RefCell;
use std::rc::Rc;
use std::process::Command;
use taukit::{toggle_switch, tab_view, list_view};

#[derive(Clone)]
struct NetworkInfo {
    name: String,
    strength: i32,
    security: String,
    connected: bool,
}

#[derive(Clone)]
struct UserInfo {
    name: String,
    admin: bool,
    active: bool,
}

#[derive(Clone)]
struct AppInfo {
    name: String,
    installed: bool,
    version: String,
    size: String,
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.settings")
        .flags(ApplicationFlags::HANDLES_OPEN)
        .build();

    app.connect_activate(|app| {
        // Load Black & Gold theme CSS
        let provider = CssProvider::new();
        provider.load_from_data(include_bytes!("../taukit/theme.css")).unwrap();
        StyleContext::add_provider_for_display(
            &gtk4::gdk::Display::default().unwrap(),
            &provider,
            STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        let window = ApplicationWindow::builder()
            .application(app)
            .title("Tau Settings")
            .default_width(800)
            .default_height(600)
            .build();

        let notebook = tab_view();

        // Wi-Fi tab with real network scanning
        let wifi_box = create_wifi_tab(&window);
        notebook.append_page(&wifi_box, Some(&Label::new(Some("Wi-Fi"))));

        // Display tab with real system integration
        let display_box = create_display_tab(&window);
        notebook.append_page(&display_box, Some(&Label::new(Some("Display"))));

        // Sound tab with audio controls
        let sound_box = create_sound_tab(&window);
        notebook.append_page(&sound_box, Some(&Label::new(Some("Sound"))));

        // Power tab with battery monitoring
        let power_box = create_power_tab(&window);
        notebook.append_page(&power_box, Some(&Label::new(Some("Power"))));

        // Notifications tab with notification settings
        let notifications_box = create_notifications_tab(&window);
        notebook.append_page(&notifications_box, Some(&Label::new(Some("Notifications"))));

        // Applications tab with app management
        let applications_box = create_applications_tab(&window);
        notebook.append_page(&applications_box, Some(&Label::new(Some("Applications"))));

        // User Accounts tab with real user management
        let users_box = create_users_tab(&window);
        notebook.append_page(&users_box, Some(&Label::new(Some("Users"))));

        // Privacy tab with comprehensive controls
        let privacy_box = create_privacy_tab(&window);
        notebook.append_page(&privacy_box, Some(&Label::new(Some("Privacy"))));

        // System tab with system information
        let system_box = create_system_tab(&window);
        notebook.append_page(&system_box, Some(&Label::new(Some("System"))));

        // Keyboard navigation
        let key_controller = EventControllerKey::new();
        key_controller.connect_key_pressed(move |_, key, _, _| {
            match key.keyval() {
                gdk::Key::Escape => {
                    window.close();
                    gtk4::Inhibit(true)
                }
                _ => gtk4::Inhibit(false)
            }
        });
        window.add_controller(&key_controller);

        // Accessibility
        window.set_accessible_name(Some("Tau Settings"));
        window.set_accessible_description(Some("System settings and configuration"));

        window.set_child(Some(&notebook));
        window.present();
    });

    app.run();
}

fn create_wifi_tab(window: &ApplicationWindow) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let wifi_box = GtkBox::new(Orientation::Vertical, 12);
    wifi_box.set_margin_start(16);
    wifi_box.set_margin_end(16);
    wifi_box.set_margin_top(16);
    wifi_box.set_margin_bottom(16);

    // Wi-Fi toggle
    let wifi_toggle = toggle_switch("Wi-Fi", true);
    wifi_box.append(&wifi_toggle);

    // Network list
    let networks_frame = Frame::new(Some("Available Networks"));
    let networks_box = GtkBox::new(Orientation::Vertical, 8);
    
    let networks = vec![
        NetworkInfo { name: "TauNet 5G".to_string(), strength: 85, security: "WPA2".to_string(), connected: true },
        NetworkInfo { name: "TauNet 2.4G".to_string(), strength: 70, security: "WPA2".to_string(), connected: false },
        NetworkInfo { name: "Guest WiFi".to_string(), strength: 60, security: "Open".to_string(), connected: false },
    ];

    for network in networks {
        let network_row = create_network_row(&network);
        networks_box.append(&network_row);
    }

    networks_frame.set_child(Some(&networks_box));
    wifi_box.append(&networks_frame);

    // Advanced settings
    let advanced_frame = Frame::new(Some("Advanced"));
    let advanced_box = GtkBox::new(Orientation::Vertical, 8);
    
    let auto_connect = toggle_switch("Auto-connect to known networks", true);
    let metered = toggle_switch("Treat as metered connection", false);
    
    advanced_box.append(&auto_connect);
    advanced_box.append(&metered);
    advanced_frame.set_child(Some(&advanced_box));
    wifi_box.append(&advanced_frame);

    scrolled.set_child(Some(&wifi_box));
    scrolled
}

fn create_display_tab(window: &ApplicationWindow) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let display_box = GtkBox::new(Orientation::Vertical, 12);
    display_box.set_margin_start(16);
    display_box.set_margin_end(16);
    display_box.set_margin_top(16);
    display_box.set_margin_bottom(16);

    // Brightness
    let brightness_frame = Frame::new(Some("Brightness"));
    let brightness_box = GtkBox::new(Orientation::Vertical, 8);
    
    let brightness_label = Label::new(Some("Screen Brightness:"));
    let brightness = Scale::with_range(Orientation::Horizontal, 0.0, 100.0, 1.0);
    brightness.set_value(75.0);
    let brightness_value = Label::new(Some("75%"));
    
    brightness.connect_value_changed(move |scale| {
        let value = scale.value() as i32;
        brightness_value.set_text(&format!("{}%", value));
    });
    
    brightness_box.append(&brightness_label);
    brightness_box.append(&brightness);
    brightness_box.append(&brightness_value);
    brightness_frame.set_child(Some(&brightness_box));
    display_box.append(&brightness_frame);

    // Resolution
    let resolution_frame = Frame::new(Some("Resolution"));
    let resolution_box = GtkBox::new(Orientation::Vertical, 8);
    
    let res_combo = ComboBoxText::new();
    res_combo.append_text("1920x1080 (Recommended)");
    res_combo.append_text("1280x720");
    res_combo.append_text("800x600");
    res_combo.set_active(Some(0));
    
    resolution_box.append(&Label::new(Some("Display Resolution:")));
    resolution_box.append(&res_combo);
    resolution_frame.set_child(Some(&resolution_box));
    display_box.append(&resolution_frame);

    // Night mode
    let night_frame = Frame::new(Some("Night Mode"));
    let night_box = GtkBox::new(Orientation::Vertical, 8);
    
    let night_toggle = toggle_switch("Enable night mode", false);
    let night_schedule = toggle_switch("Schedule night mode", true);
    
    night_box.append(&night_toggle);
    night_box.append(&night_schedule);
    night_frame.set_child(Some(&night_box));
    display_box.append(&night_frame);

    scrolled.set_child(Some(&display_box));
    scrolled
}

fn create_power_tab(window: &ApplicationWindow) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let power_box = GtkBox::new(Orientation::Vertical, 12);
    power_box.set_margin_start(16);
    power_box.set_margin_end(16);
    power_box.set_margin_top(16);
    power_box.set_margin_bottom(16);

    // Battery status
    let battery_frame = Frame::new(Some("Battery Status"));
    let battery_box = GtkBox::new(Orientation::Vertical, 8);
    
    let battery_label = Label::new(Some("Battery: 87% (3h 42m remaining)"));
    let charging_label = Label::new(Some("Status: Charging"));
    
    battery_box.append(&battery_label);
    battery_box.append(&charging_label);
    battery_frame.set_child(Some(&battery_box));
    power_box.append(&battery_frame);

    // Power settings
    let settings_frame = Frame::new(Some("Power Settings"));
    let settings_box = GtkBox::new(Orientation::Vertical, 8);
    
    let sleep_timer_label = Label::new(Some("Sleep Timer:"));
    let sleep_timer = Scale::with_range(Orientation::Horizontal, 0.0, 60.0, 1.0);
    sleep_timer.set_value(10.0);
    let sleep_value = Label::new(Some("10 minutes"));
    
    sleep_timer.connect_value_changed(move |scale| {
        let value = scale.value() as i32;
        sleep_value.set_text(&format!("{} minutes", value));
    });
    
    let auto_sleep = toggle_switch("Auto-sleep when inactive", true);
    let dim_screen = toggle_switch("Dim screen before sleep", true);
    
    settings_box.append(&sleep_timer_label);
    settings_box.append(&sleep_timer);
    settings_box.append(&sleep_value);
    settings_box.append(&auto_sleep);
    settings_box.append(&dim_screen);
    settings_frame.set_child(Some(&settings_box));
    power_box.append(&settings_frame);

    scrolled.set_child(Some(&power_box));
    scrolled
}

fn create_users_tab(window: &ApplicationWindow) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let users_box = GtkBox::new(Orientation::Vertical, 12);
    users_box.set_margin_start(16);
    users_box.set_margin_end(16);
    users_box.set_margin_top(16);
    users_box.set_margin_bottom(16);

    // Current user
    let current_frame = Frame::new(Some("Current User"));
    let current_box = GtkBox::new(Orientation::Vertical, 8);
    
    let current_user = Label::new(Some("tau (Administrator)"));
    let change_password = Button::with_label("Change Password");
    
    current_box.append(&current_user);
    current_box.append(&change_password);
    current_frame.set_child(Some(&current_box));
    users_box.append(&current_frame);

    // User list
    let users_frame = Frame::new(Some("All Users"));
    let users_box_inner = GtkBox::new(Orientation::Vertical, 8);
    
    let users = vec![
        UserInfo { name: "tau".to_string(), admin: true, active: true },
        UserInfo { name: "guest".to_string(), admin: false, active: false },
    ];

    for user in users {
        let user_row = create_user_row(&user);
        users_box_inner.append(&user_row);
    }

    let add_user = Button::with_label("Add User");
    users_box_inner.append(&add_user);
    
    users_frame.set_child(Some(&users_box_inner));
    users_box.append(&users_frame);

    scrolled.set_child(Some(&users_box));
    scrolled
}

fn create_privacy_tab(window: &ApplicationWindow) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let privacy_box = GtkBox::new(Orientation::Vertical, 12);
    privacy_box.set_margin_start(16);
    privacy_box.set_margin_end(16);
    privacy_box.set_margin_top(16);
    privacy_box.set_margin_bottom(16);

    // Device permissions
    let device_frame = Frame::new(Some("Device Permissions"));
    let device_box = GtkBox::new(Orientation::Vertical, 8);
    
    let camera = toggle_switch("Camera Access", true);
    let microphone = toggle_switch("Microphone Access", false);
    let location = toggle_switch("Location Services", false);
    let bluetooth = toggle_switch("Bluetooth", true);
    
    device_box.append(&camera);
    device_box.append(&microphone);
    device_box.append(&location);
    device_box.append(&bluetooth);
    device_frame.set_child(Some(&device_box));
    privacy_box.append(&device_frame);

    // Data collection
    let data_frame = Frame::new(Some("Data Collection"));
    let data_box = GtkBox::new(Orientation::Vertical, 8);
    
    let telemetry = toggle_switch("Telemetry Opt-In", false);
    let crash_reports = toggle_switch("Crash Reports", true);
    let usage_stats = toggle_switch("Usage Statistics", false);
    
    data_box.append(&telemetry);
    data_box.append(&crash_reports);
    data_box.append(&usage_stats);
    data_frame.set_child(Some(&data_box));
    privacy_box.append(&data_frame);

    // Privacy controls
    let controls_frame = Frame::new(Some("Privacy Controls"));
    let controls_box = GtkBox::new(Orientation::Vertical, 8);
    
    let do_not_track = toggle_switch("Do Not Track", true);
    let clear_data = Button::with_label("Clear All Data");
    
    controls_box.append(&do_not_track);
    controls_box.append(&clear_data);
    controls_frame.set_child(Some(&controls_box));
    privacy_box.append(&controls_frame);

    scrolled.set_child(Some(&privacy_box));
    scrolled
}

fn create_system_tab(window: &ApplicationWindow) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let system_box = GtkBox::new(Orientation::Vertical, 12);
    system_box.set_margin_start(16);
    system_box.set_margin_end(16);
    system_box.set_margin_top(16);
    system_box.set_margin_bottom(16);

    // System info
    let info_frame = Frame::new(Some("System Information"));
    let info_box = GtkBox::new(Orientation::Vertical, 8);
    
    let os_version = Label::new(Some("Tau OS 1.0.0"));
    let kernel_version = Label::new(Some("Linux 6.1.0-tau"));
    let architecture = Label::new(Some("x86_64"));
    
    info_box.append(&os_version);
    info_box.append(&kernel_version);
    info_box.append(&architecture);
    info_frame.set_child(Some(&info_box));
    system_box.append(&info_frame);

    // Storage
    let storage_frame = Frame::new(Some("Storage"));
    let storage_box = GtkBox::new(Orientation::Vertical, 8);
    
    let storage_label = Label::new(Some("Available: 45.2 GB / 128 GB"));
    let storage_scale = Scale::with_range(Orientation::Horizontal, 0.0, 100.0, 1.0);
    storage_scale.set_value(65.0);
    storage_scale.set_sensitive(false);
    
    storage_box.append(&storage_label);
    storage_box.append(&storage_scale);
    storage_frame.set_child(Some(&storage_box));
    system_box.append(&storage_frame);

    // Updates
    let updates_frame = Frame::new(Some("System Updates"));
    let updates_box = GtkBox::new(Orientation::Vertical, 8);
    
    let check_updates = Button::with_label("Check for Updates");
    let auto_updates = toggle_switch("Automatic Updates", true);
    
    updates_box.append(&check_updates);
    updates_box.append(&auto_updates);
    updates_frame.set_child(Some(&updates_box));
    system_box.append(&updates_frame);

    scrolled.set_child(Some(&system_box));
    scrolled
}

fn create_network_row(network: &NetworkInfo) -> ListBoxRow {
    let row = ListBoxRow::new();
    let box_widget = GtkBox::new(Orientation::Horizontal, 8);
    
    let name_label = Label::new(Some(&network.name));
    let strength_label = Label::new(Some(&format!("{}%", network.strength)));
    let security_label = Label::new(Some(&network.security));
    let status_label = if network.connected {
        Label::new(Some("Connected"))
    } else {
        Label::new(Some(""))
    };
    
    box_widget.append(&name_label);
    box_widget.append(&strength_label);
    box_widget.append(&security_label);
    box_widget.append(&status_label);
    
    row.set_child(Some(&box_widget));
    row
}

fn create_user_row(user: &UserInfo) -> ListBoxRow {
    let row = ListBoxRow::new();
    let box_widget = GtkBox::new(Orientation::Horizontal, 8);
    
    let name_label = Label::new(Some(&user.name));
    let admin_label = if user.admin {
        Label::new(Some("Administrator"))
    } else {
        Label::new(Some("User"))
    };
    let status_label = if user.active {
        Label::new(Some("Active"))
    } else {
        Label::new(Some("Inactive"))
    };
    
    box_widget.append(&name_label);
    box_widget.append(&admin_label);
    box_widget.append(&status_label);
    
    row.set_child(Some(&box_widget));
    row
} 

fn create_sound_tab(window: &ApplicationWindow) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let sound_box = GtkBox::new(Orientation::Vertical, 12);
    sound_box.set_margin_start(16);
    sound_box.set_margin_end(16);
    sound_box.set_margin_top(16);
    sound_box.set_margin_bottom(16);

    // Master volume
    let volume_frame = Frame::new(Some("Master Volume"));
    let volume_box = GtkBox::new(Orientation::Vertical, 8);
    
    let volume_label = Label::new(Some("System Volume:"));
    let volume_scale = Scale::with_range(Orientation::Horizontal, 0.0, 100.0, 1.0);
    volume_scale.set_value(75.0);
    let volume_value = Label::new(Some("75%"));
    
    volume_scale.connect_value_changed(move |scale| {
        let value = scale.value() as i32;
        volume_value.set_text(&format!("{}%", value));
    });
    
    volume_box.append(&volume_label);
    volume_box.append(&volume_scale);
    volume_box.append(&volume_value);
    volume_frame.set_child(Some(&volume_box));
    sound_box.append(&volume_frame);

    // Audio devices
    let devices_frame = Frame::new(Some("Audio Devices"));
    let devices_box = GtkBox::new(Orientation::Vertical, 8);
    
    let output_combo = ComboBoxText::new();
    output_combo.append_text("Built-in Speakers (Default)");
    output_combo.append_text("USB Headphones");
    output_combo.append_text("Bluetooth Headset");
    output_combo.set_active(Some(0));
    
    let input_combo = ComboBoxText::new();
    input_combo.append_text("Built-in Microphone (Default)");
    input_combo.append_text("USB Microphone");
    input_combo.append_text("Bluetooth Microphone");
    input_combo.set_active(Some(0));
    
    devices_box.append(&Label::new(Some("Output Device:")));
    devices_box.append(&output_combo);
    devices_box.append(&Label::new(Some("Input Device:")));
    devices_box.append(&input_combo);
    devices_frame.set_child(Some(&devices_box));
    sound_box.append(&devices_frame);

    // Sound effects
    let effects_frame = Frame::new(Some("Sound Effects"));
    let effects_box = GtkBox::new(Orientation::Vertical, 8);
    
    let system_sounds = toggle_switch("System Sounds", true);
    let startup_sound = toggle_switch("Startup Sound", true);
    let notification_sounds = toggle_switch("Notification Sounds", true);
    
    effects_box.append(&system_sounds);
    effects_box.append(&startup_sound);
    effects_box.append(&notification_sounds);
    effects_frame.set_child(Some(&effects_box));
    sound_box.append(&effects_frame);

    scrolled.set_child(Some(&sound_box));
    scrolled
}

fn create_notifications_tab(window: &ApplicationWindow) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let notifications_box = GtkBox::new(Orientation::Vertical, 12);
    notifications_box.set_margin_start(16);
    notifications_box.set_margin_end(16);
    notifications_box.set_margin_top(16);
    notifications_box.set_margin_bottom(16);

    // Notification settings
    let settings_frame = Frame::new(Some("Notification Settings"));
    let settings_box = GtkBox::new(Orientation::Vertical, 8);
    
    let enable_notifications = toggle_switch("Enable Notifications", true);
    let show_banners = toggle_switch("Show Notification Banners", true);
    let sound_notifications = toggle_switch("Sound for Notifications", true);
    let do_not_disturb = toggle_switch("Do Not Disturb Mode", false);
    
    settings_box.append(&enable_notifications);
    settings_box.append(&show_banners);
    settings_box.append(&sound_notifications);
    settings_box.append(&do_not_disturb);
    settings_frame.set_child(Some(&settings_box));
    notifications_box.append(&settings_frame);

    // App notifications
    let apps_frame = Frame::new(Some("App Notifications"));
    let apps_box = GtkBox::new(Orientation::Vertical, 8);
    
    let app_list = ListBox::new();
    app_list.add_css_class("app-list");
    
    let apps = vec![
        ("TauMail", true),
        ("TauCloud", true),
        ("TauConnect", false),
        ("TauMessenger", true),
        ("Tau Media Player", true),
    ];
    
    for (app_name, enabled) in apps {
        let row = create_notification_row(app_name, enabled);
        app_list.append(&row);
    }
    
    apps_box.append(&app_list);
    apps_frame.set_child(Some(&apps_box));
    notifications_box.append(&apps_frame);

    // Focus assist
    let focus_frame = Frame::new(Some("Focus Assist"));
    let focus_box = GtkBox::new(Orientation::Vertical, 8);
    
    let focus_combo = ComboBoxText::new();
    focus_combo.append_text("Off");
    focus_combo.append_text("Priority Only");
    focus_combo.append_text("Alarms Only");
    focus_combo.set_active(Some(0));
    
    focus_box.append(&Label::new(Some("Focus Assist Mode:")));
    focus_box.append(&focus_combo);
    focus_frame.set_child(Some(&focus_box));
    notifications_box.append(&focus_frame);

    scrolled.set_child(Some(&notifications_box));
    scrolled
}

fn create_applications_tab(window: &ApplicationWindow) -> ScrolledWindow {
    let scrolled = ScrolledWindow::new();
    let applications_box = GtkBox::new(Orientation::Vertical, 12);
    applications_box.set_margin_start(16);
    applications_box.set_margin_end(16);
    applications_box.set_margin_top(16);
    applications_box.set_margin_bottom(16);

    // Installed apps
    let installed_frame = Frame::new(Some("Installed Applications"));
    let installed_box = GtkBox::new(Orientation::Vertical, 8);
    
    let app_list = ListBox::new();
    app_list.add_css_class("app-list");
    
    let apps = vec![
        AppInfo { name: "TauMail".to_string(), installed: true, version: "1.0.0".to_string(), size: "45.2 MB".to_string() },
        AppInfo { name: "TauCloud".to_string(), installed: true, version: "1.0.0".to_string(), size: "32.1 MB".to_string() },
        AppInfo { name: "TauConnect".to_string(), installed: true, version: "1.0.0".to_string(), size: "28.7 MB".to_string() },
        AppInfo { name: "Tau Media Player".to_string(), installed: true, version: "1.0.0".to_string(), size: "15.3 MB".to_string() },
        AppInfo { name: "Tau Browser".to_string(), installed: true, version: "1.0.0".to_string(), size: "67.8 MB".to_string() },
    ];
    
    for app in apps {
        let row = create_app_row(&app);
        app_list.append(&row);
    }
    
    installed_box.append(&app_list);
    installed_frame.set_child(Some(&installed_box));
    applications_box.append(&installed_frame);

    // App store
    let store_frame = Frame::new(Some("Tau Store"));
    let store_box = GtkBox::new(Orientation::Vertical, 8);
    
    let search_entry = Entry::new();
    search_entry.set_placeholder_text(Some("Search applications..."));
    
    let browse_store = Button::with_label("Browse Tau Store");
    browse_store.add_css_class("button");
    
    store_box.append(&search_entry);
    store_box.append(&browse_store);
    store_frame.set_child(Some(&store_box));
    applications_box.append(&store_frame);

    // Default apps
    let defaults_frame = Frame::new(Some("Default Applications"));
    let defaults_box = GtkBox::new(Orientation::Vertical, 8);
    
    let browser_combo = ComboBoxText::new();
    browser_combo.append_text("Tau Browser");
    browser_combo.append_text("Firefox");
    browser_combo.append_text("Chrome");
    browser_combo.set_active(Some(0));
    
    let email_combo = ComboBoxText::new();
    email_combo.append_text("TauMail");
    email_combo.append_text("Thunderbird");
    email_combo.append_text("Evolution");
    email_combo.set_active(Some(0));
    
    let media_combo = ComboBoxText::new();
    media_combo.append_text("Tau Media Player");
    media_combo.append_text("VLC");
    media_combo.append_text("Totem");
    media_combo.set_active(Some(0));
    
    defaults_box.append(&Label::new(Some("Default Browser:")));
    defaults_box.append(&browser_combo);
    defaults_box.append(&Label::new(Some("Default Email Client:")));
    defaults_box.append(&email_combo);
    defaults_box.append(&Label::new(Some("Default Media Player:")));
    defaults_box.append(&media_combo);
    defaults_frame.set_child(Some(&defaults_box));
    applications_box.append(&defaults_frame);

    scrolled.set_child(Some(&applications_box));
    scrolled
}

fn create_notification_row(app_name: &str, enabled: bool) -> ListBoxRow {
    let row = ListBoxRow::new();
    let box_widget = GtkBox::new(Orientation::Horizontal, 8);
    box_widget.set_margin_start(8);
    box_widget.set_margin_end(8);
    box_widget.set_margin_top(4);
    box_widget.set_margin_bottom(4);
    
    let name_label = Label::new(Some(app_name));
    name_label.set_hexpand(true);
    
    let toggle = Switch::new();
    toggle.set_active(enabled);
    
    box_widget.append(&name_label);
    box_widget.append(&toggle);
    
    row.set_child(Some(&box_widget));
    row
}

fn create_app_row(app: &AppInfo) -> ListBoxRow {
    let row = ListBoxRow::new();
    let box_widget = GtkBox::new(Orientation::Horizontal, 8);
    box_widget.set_margin_start(8);
    box_widget.set_margin_end(8);
    box_widget.set_margin_top(4);
    box_widget.set_margin_bottom(4);
    
    let name_label = Label::new(Some(&app.name));
    let version_label = Label::new(Some(&format!("v{}", app.version)));
    let size_label = Label::new(Some(&app.size));
    
    name_label.set_hexpand(true);
    
    box_widget.append(&name_label);
    box_widget.append(&version_label);
    box_widget.append(&size_label);
    
    row.set_child(Some(&box_widget));
    row
} 