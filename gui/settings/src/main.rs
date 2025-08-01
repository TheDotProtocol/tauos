use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Box, Button, Label, Notebook, Switch, Entry, ComboBoxText, SpinButton, Adjustment};
use gtk::glib;
use gtk::gio;
use gtk::adw;
use gtk::gdk;
use gtk::gdk_pixbuf;
use gtk::cairo;
use gtk::pango;

mod privacy_settings;
mod tauid_settings;
mod taumail_settings;
mod taucloud_settings;
mod voice_settings;

use privacy_settings::create_privacy_tab;
use tauid_settings::create_tauid_tab;
use taumail_settings::create_taumail_tab;
use taucloud_settings::create_taucloud_tab;
use voice_settings::create_voice_tab;

#[derive(Debug)]
struct AppInfo {
    name: String,
    version: String,
    description: String,
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.settings")
        .flags(gio::ApplicationFlags::HANDLES_OPEN)
        .build();

    app.connect_activate(|app| {
        // Load TauOS theme CSS
        let provider = gtk::CssProvider::new();
        provider.load_from_data(include_bytes!("../../taukit/theme.css")).unwrap();
        gtk::style_context_add_provider_for_display(
            &gdk::Display::default().unwrap(),
            &provider,
            gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        // Create main window
        let window = ApplicationWindow::builder()
            .application(app)
            .title("TauOS Settings")
            .default_width(800)
            .default_height(600)
            .resizable(true)
            .build();

        // Create main container
        let main_box = Box::new(gtk::Orientation::Vertical, 0);
        window.set_child(Some(&main_box));

        // Create header
        let header = create_header();
        main_box.append(&header);

        // Create notebook for tabs
        let notebook = Notebook::new();
        main_box.append(&notebook);

        // Add tabs
        let general_box = create_general_tab(&window);
        notebook.append_page(&general_box, Some(&Label::new(Some("General"))));

        let privacy_box = create_privacy_tab(&window);
        notebook.append_page(&privacy_box, Some(&Label::new(Some("Privacy"))));

        let tauid_box = create_tauid_tab(&window);
        notebook.append_page(&tauid_box, Some(&Label::new(Some("TauID"))));

        let taumail_box = create_taumail_tab(&window);
        notebook.append_page(&taumail_box, Some(&Label::new(Some("TauMail"))));

        let taucloud_box = create_taucloud_tab(&window);
        notebook.append_page(&taucloud_box, Some(&Label::new(Some("TauCloud"))));

        let voice_box = create_voice_tab(&window);
        notebook.append_page(&voice_box, Some(&Label::new(Some("Voice Assistant"))));

        // Sound tab with audio controls
        let sound_box = create_sound_tab(&window);
        notebook.append_page(&sound_box, Some(&Label::new(Some("Sound"))));

        // Notifications tab with notification settings
        let notifications_box = create_notifications_tab(&window);
        notebook.append_page(&notifications_box, Some(&Label::new(Some("Notifications"))));

        // Applications tab with app management
        let applications_box = create_applications_tab(&window);
        notebook.append_page(&applications_box, Some(&Label::new(Some("Applications"))));

        window.present();
    });

    app.run();
}

fn create_header() -> Box {
    let header_box = Box::new(gtk::Orientation::Horizontal, 12);
    header_box.add_css_class("header");

    // Logo and title
    let title_box = Box::new(gtk::Orientation::Horizontal, 8);
    let logo = Label::new(Some("τ"));
    logo.add_css_class("logo");
    let title = Label::new(Some("TauOS Settings"));
    title.add_css_class("title");
    title_box.append(&logo);
    title_box.append(&title);

    // Version info
    let version = Label::new(Some("v1.0.0"));
    version.add_css_class("version");

    header_box.append(&title_box);
    header_box.append(&version);

    header_box
}

fn create_general_tab(window: &ApplicationWindow) -> Box {
    let box_ = Box::new(gtk::Orientation::Vertical, 12);
    box_.set_margin_start(20);
    box_.set_margin_end(20);
    box_.set_margin_top(20);
    box_.set_margin_bottom(20);

    // System Information
    let info_group = create_group("System Information");
    box_.append(&info_group);

    let info_grid = gtk::Grid::new();
    info_grid.set_row_spacing(8);
    info_grid.set_column_spacing(12);

    let os_label = Label::new(Some("Operating System:"));
    let os_value = Label::new(Some("TauOS 1.0.0"));
    let kernel_label = Label::new(Some("Kernel:"));
    let kernel_value = Label::new(Some("Linux 6.6.30"));
    let arch_label = Label::new(Some("Architecture:"));
    let arch_value = Label::new(Some("x86_64"));

    info_grid.attach(&os_label, 0, 0, 1, 1);
    info_grid.attach(&os_value, 1, 0, 1, 1);
    info_grid.attach(&kernel_label, 0, 1, 1, 1);
    info_grid.attach(&kernel_value, 1, 1, 1, 1);
    info_grid.attach(&arch_label, 0, 2, 1, 1);
    info_grid.attach(&arch_value, 1, 2, 1, 1);

    info_group.set_child(Some(&info_grid));

    // Display Settings
    let display_group = create_group("Display");
    box_.append(&display_group);

    let display_grid = gtk::Grid::new();
    display_grid.set_row_spacing(8);
    display_grid.set_column_spacing(12);

    let resolution_label = Label::new(Some("Resolution:"));
    let resolution_combo = ComboBoxText::new();
    resolution_combo.append_text("1920x1080");
    resolution_combo.append_text("2560x1440");
    resolution_combo.append_text("3840x2160");
    resolution_combo.set_active(Some(0));

    let refresh_label = Label::new(Some("Refresh Rate:"));
    let refresh_combo = ComboBoxText::new();
    refresh_combo.append_text("60 Hz");
    refresh_combo.append_text("120 Hz");
    refresh_combo.append_text("144 Hz");
    refresh_combo.set_active(Some(0));

    let brightness_label = Label::new(Some("Brightness:"));
    let brightness_adj = Adjustment::new(50.0, 0.0, 100.0, 1.0, 10.0, 0.0);
    let brightness_scale = gtk::Scale::new(gtk::Orientation::Horizontal, Some(&brightness_adj));

    display_grid.attach(&resolution_label, 0, 0, 1, 1);
    display_grid.attach(&resolution_combo, 1, 0, 1, 1);
    display_grid.attach(&refresh_label, 0, 1, 1, 1);
    display_grid.attach(&refresh_combo, 1, 1, 1, 1);
    display_grid.attach(&brightness_label, 0, 2, 1, 1);
    display_grid.attach(&brightness_scale, 1, 2, 1, 1);

    display_group.set_child(Some(&display_grid));

    // Power Management
    let power_group = create_group("Power Management");
    box_.append(&power_group);

    let power_grid = gtk::Grid::new();
    power_grid.set_row_spacing(8);
    power_grid.set_column_spacing(12);

    let sleep_label = Label::new(Some("Sleep after:"));
    let sleep_combo = ComboBoxText::new();
    sleep_combo.append_text("Never");
    sleep_combo.append_text("5 minutes");
    sleep_combo.append_text("10 minutes");
    sleep_combo.append_text("30 minutes");
    sleep_combo.append_text("1 hour");
    sleep_combo.set_active(Some(2));

    let battery_label = Label::new(Some("Battery saver:"));
    let battery_switch = Switch::new();

    power_grid.attach(&sleep_label, 0, 0, 1, 1);
    power_grid.attach(&sleep_combo, 1, 0, 1, 1);
    power_grid.attach(&battery_label, 0, 1, 1, 1);
    power_grid.attach(&battery_switch, 1, 1, 1, 1);

    power_group.set_child(Some(&power_grid));

    box_
}

fn create_sound_tab(window: &ApplicationWindow) -> Box {
    let box_ = Box::new(gtk::Orientation::Vertical, 12);
    box_.set_margin_start(20);
    box_.set_margin_end(20);
    box_.set_margin_top(20);
    box_.set_margin_bottom(20);

    // Audio Output
    let output_group = create_group("Audio Output");
    box_.append(&output_group);

    let output_grid = gtk::Grid::new();
    output_grid.set_row_spacing(8);
    output_grid.set_column_spacing(12);

    let device_label = Label::new(Some("Output Device:"));
    let device_combo = ComboBoxText::new();
    device_combo.append_text("Built-in Speakers");
    device_combo.append_text("Headphones");
    device_combo.append_text("HDMI Audio");
    device_combo.set_active(Some(0));

    let volume_label = Label::new(Some("Master Volume:"));
    let volume_adj = Adjustment::new(75.0, 0.0, 100.0, 1.0, 10.0, 0.0);
    let volume_scale = gtk::Scale::new(gtk::Orientation::Horizontal, Some(&volume_adj));

    output_grid.attach(&device_label, 0, 0, 1, 1);
    output_grid.attach(&device_combo, 1, 0, 1, 1);
    output_grid.attach(&volume_label, 0, 1, 1, 1);
    output_grid.attach(&volume_scale, 1, 1, 1, 1);

    output_group.set_child(Some(&output_grid));

    // Sound Effects
    let effects_group = create_group("Sound Effects");
    box_.append(&effects_group);

    let effects_grid = gtk::Grid::new();
    effects_grid.set_row_spacing(8);
    effects_grid.set_column_spacing(12);

    let system_sounds_label = Label::new(Some("System Sounds:"));
    let system_sounds_switch = Switch::new();
    system_sounds_switch.set_active(true);

    let feedback_label = Label::new(Some("Audio Feedback:"));
    let feedback_switch = Switch::new();
    feedback_switch.set_active(true);

    effects_grid.attach(&system_sounds_label, 0, 0, 1, 1);
    effects_grid.attach(&system_sounds_switch, 1, 0, 1, 1);
    effects_grid.attach(&feedback_label, 0, 1, 1, 1);
    effects_grid.attach(&feedback_switch, 1, 1, 1, 1);

    effects_group.set_child(Some(&effects_grid));

    box_
}

fn create_notifications_tab(window: &ApplicationWindow) -> Box {
    let box_ = Box::new(gtk::Orientation::Vertical, 12);
    box_.set_margin_start(20);
    box_.set_margin_end(20);
    box_.set_margin_top(20);
    box_.set_margin_bottom(20);

    // Notification Settings
    let notif_group = create_group("Notification Settings");
    box_.append(&notif_group);

    let notif_grid = gtk::Grid::new();
    notif_grid.set_row_spacing(8);
    notif_grid.set_column_spacing(12);

    let show_notifications_label = Label::new(Some("Show Notifications:"));
    let show_notifications_switch = Switch::new();
    show_notifications_switch.set_active(true);

    let sound_label = Label::new(Some("Notification Sound:"));
    let sound_switch = Switch::new();
    sound_switch.set_active(true);

    let do_not_disturb_label = Label::new(Some("Do Not Disturb:"));
    let do_not_disturb_switch = Switch::new();

    notif_grid.attach(&show_notifications_label, 0, 0, 1, 1);
    notif_grid.attach(&show_notifications_switch, 1, 0, 1, 1);
    notif_grid.attach(&sound_label, 0, 1, 1, 1);
    notif_grid.attach(&sound_switch, 1, 1, 1, 1);
    notif_grid.attach(&do_not_disturb_label, 0, 2, 1, 1);
    notif_grid.attach(&do_not_disturb_switch, 1, 2, 1, 1);

    notif_group.set_child(Some(&notif_grid));

    box_
}

fn create_applications_tab(window: &ApplicationWindow) -> Box {
    let box_ = Box::new(gtk::Orientation::Vertical, 12);
    box_.set_margin_start(20);
    box_.set_margin_end(20);
    box_.set_margin_top(20);
    box_.set_margin_bottom(20);

    // Default Applications
    let default_group = create_group("Default Applications");
    box_.append(&default_group);

    let default_grid = gtk::Grid::new();
    default_grid.set_row_spacing(8);
    default_grid.set_column_spacing(12);

    let browser_label = Label::new(Some("Web Browser:"));
    let browser_combo = ComboBoxText::new();
    browser_combo.append_text("Tau Browser");
    browser_combo.append_text("Firefox");
    browser_combo.append_text("Chrome");
    browser_combo.set_active(Some(0));

    let email_label = Label::new(Some("Email Client:"));
    let email_combo = ComboBoxText::new();
    email_combo.append_text("TauMail");
    email_combo.append_text("Thunderbird");
    email_combo.set_active(Some(0));

    let media_label = Label::new(Some("Media Player:"));
    let media_combo = ComboBoxText::new();
    media_combo.append_text("Tau Media Player");
    media_combo.append_text("VLC");
    media_combo.set_active(Some(0));

    default_grid.attach(&browser_label, 0, 0, 1, 1);
    default_grid.attach(&browser_combo, 1, 0, 1, 1);
    default_grid.attach(&email_label, 0, 1, 1, 1);
    default_grid.attach(&email_combo, 1, 1, 1, 1);
    default_grid.attach(&media_label, 0, 2, 1, 1);
    default_grid.attach(&media_combo, 1, 2, 1, 1);

    default_group.set_child(Some(&default_grid));

    box_
}

fn create_group(title: &str) -> adw::PreferencesGroup {
    let group = adw::PreferencesGroup::new();
    group.set_title(Some(title));
    group
} 