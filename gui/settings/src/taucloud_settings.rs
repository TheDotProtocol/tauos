use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{ApplicationWindow, Box, Label, Switch, Button, Entry, ComboBoxText, Grid, Adjustment, Scale, ProgressBar};
use gtk::adw;

pub fn create_taucloud_tab(window: &ApplicationWindow) -> Box {
    let box_ = Box::new(gtk::Orientation::Vertical, 12);
    box_.set_margin_start(20);
    box_.set_margin_end(20);
    box_.set_margin_top(20);
    box_.set_margin_bottom(20);

    // Storage Usage
    let storage_group = create_group("Storage Usage");
    box_.append(&storage_group);

    let storage_grid = Grid::new();
    storage_grid.set_row_spacing(8);
    storage_grid.set_column_spacing(12);

    let total_storage_label = Label::new(Some("Total Storage:"));
    let total_storage_entry = Entry::new();
    total_storage_entry.set_text("5 GB");
    total_storage_entry.set_editable(false);

    let used_storage_label = Label::new(Some("Used Storage:"));
    let used_storage_entry = Entry::new();
    used_storage_entry.set_text("2.1 GB");
    used_storage_entry.set_editable(false);

    let available_storage_label = Label::new(Some("Available:"));
    let available_storage_entry = Entry::new();
    available_storage_entry.set_text("2.9 GB");
    available_storage_entry.set_editable(false);

    let storage_progress = ProgressBar::new();
    storage_progress.set_fraction(0.42); // 2.1/5.0

    storage_grid.attach(&total_storage_label, 0, 0, 1, 1);
    storage_grid.attach(&total_storage_entry, 1, 0, 1, 1);
    storage_grid.attach(&used_storage_label, 0, 1, 1, 1);
    storage_grid.attach(&used_storage_entry, 1, 1, 1, 1);
    storage_grid.attach(&available_storage_label, 0, 2, 1, 1);
    storage_grid.attach(&available_storage_entry, 1, 2, 1, 1);
    storage_grid.attach(&storage_progress, 0, 3, 2, 1);

    storage_group.set_child(Some(&storage_grid));

    // Sync Settings
    let sync_group = create_group("Sync Settings");
    box_.append(&sync_group);

    let sync_grid = Grid::new();
    sync_grid.set_row_spacing(8);
    sync_grid.set_column_spacing(12);

    let auto_sync_label = Label::new(Some("Auto Sync:"));
    let auto_sync_switch = Switch::new();
    auto_sync_switch.set_active(true);

    let sync_frequency_label = Label::new(Some("Sync Frequency:"));
    let sync_frequency_combo = ComboBoxText::new();
    sync_frequency_combo.append_text("Real-time");
    sync_frequency_combo.append_text("Every 5 minutes");
    sync_frequency_combo.append_text("Every 15 minutes");
    sync_frequency_combo.append_text("Every hour");
    sync_frequency_combo.set_active(Some(0));

    let sync_wifi_label = Label::new(Some("Sync on WiFi only:"));
    let sync_wifi_switch = Switch::new();
    sync_wifi_switch.set_active(true);

    sync_grid.attach(&auto_sync_label, 0, 0, 1, 1);
    sync_grid.attach(&auto_sync_switch, 1, 0, 1, 1);
    sync_grid.attach(&sync_frequency_label, 0, 1, 1, 1);
    sync_grid.attach(&sync_frequency_combo, 1, 1, 1, 1);
    sync_grid.attach(&sync_wifi_label, 0, 2, 1, 1);
    sync_grid.attach(&sync_wifi_switch, 1, 2, 1, 1);

    sync_group.set_child(Some(&sync_grid));

    // Encryption Settings
    let encryption_group = create_group("Encryption Settings");
    box_.append(&encryption_group);

    let encryption_grid = Grid::new();
    encryption_grid.set_row_spacing(8);
    encryption_grid.set_column_spacing(12);

    let client_encryption_label = Label::new(Some("Client-Side Encryption:"));
    let client_encryption_switch = Switch::new();
    client_encryption_switch.set_active(true);

    let encryption_algorithm_label = Label::new(Some("Algorithm:"));
    let encryption_algorithm_combo = ComboBoxText::new();
    encryption_algorithm_combo.append_text("AES-256-GCM");
    encryption_algorithm_combo.append_text("ChaCha20-Poly1305");
    encryption_algorithm_combo.set_active(Some(0));

    let zero_knowledge_label = Label::new(Some("Zero-Knowledge:"));
    let zero_knowledge_switch = Switch::new();
    zero_knowledge_switch.set_active(true);

    encryption_grid.attach(&client_encryption_label, 0, 0, 1, 1);
    encryption_grid.attach(&client_encryption_switch, 1, 0, 1, 1);
    encryption_grid.attach(&encryption_algorithm_label, 0, 1, 1, 1);
    encryption_grid.attach(&encryption_algorithm_combo, 1, 1, 1, 1);
    encryption_grid.attach(&zero_knowledge_label, 0, 2, 1, 1);
    encryption_grid.attach(&zero_knowledge_switch, 1, 2, 1, 1);

    encryption_group.set_child(Some(&encryption_grid));

    // Sharing Settings
    let sharing_group = create_group("Sharing Settings");
    box_.append(&sharing_group);

    let sharing_grid = Grid::new();
    sharing_grid.set_row_spacing(8);
    sharing_grid.set_column_spacing(12);

    let public_sharing_label = Label::new(Some("Public Sharing:"));
    let public_sharing_switch = Switch::new();
    public_sharing_switch.set_active(false);

    let link_expiry_label = Label::new(Some("Link Expiry:"));
    let link_expiry_combo = ComboBoxText::new();
    link_expiry_combo.append_text("1 day");
    link_expiry_combo.append_text("7 days");
    link_expiry_combo.append_text("30 days");
    link_expiry_combo.append_text("Never");
    link_expiry_combo.set_active(Some(1));

    let password_protection_label = Label::new(Some("Password Protection:"));
    let password_protection_switch = Switch::new();
    password_protection_switch.set_active(true);

    sharing_grid.attach(&public_sharing_label, 0, 0, 1, 1);
    sharing_grid.attach(&public_sharing_switch, 1, 0, 1, 1);
    sharing_grid.attach(&link_expiry_label, 0, 1, 1, 1);
    sharing_grid.attach(&link_expiry_combo, 1, 1, 1, 1);
    sharing_grid.attach(&password_protection_label, 0, 2, 1, 1);
    sharing_grid.attach(&password_protection_switch, 1, 2, 1, 1);

    sharing_group.set_child(Some(&sharing_grid));

    // Backup Settings
    let backup_group = create_group("Backup Settings");
    box_.append(&backup_group);

    let backup_grid = Grid::new();
    backup_grid.set_row_spacing(8);
    backup_grid.set_column_spacing(12);

    let auto_backup_label = Label::new(Some("Auto Backup:"));
    let auto_backup_switch = Switch::new();
    auto_backup_switch.set_active(true);

    let backup_frequency_label = Label::new(Some("Backup Frequency:"));
    let backup_frequency_combo = ComboBoxText::new();
    backup_frequency_combo.append_text("Daily");
    backup_frequency_combo.append_text("Weekly");
    backup_frequency_combo.append_text("Monthly");
    backup_frequency_combo.set_active(Some(1));

    let backup_retention_label = Label::new(Some("Retention:"));
    let backup_retention_combo = ComboBoxText::new();
    backup_retention_combo.append_text("30 days");
    backup_retention_combo.append_text("90 days");
    backup_retention_combo.append_text("1 year");
    backup_retention_combo.set_active(Some(1));

    backup_grid.attach(&auto_backup_label, 0, 0, 1, 1);
    backup_grid.attach(&auto_backup_switch, 1, 0, 1, 1);
    backup_grid.attach(&backup_frequency_label, 0, 1, 1, 1);
    backup_grid.attach(&backup_frequency_combo, 1, 1, 1, 1);
    backup_grid.attach(&backup_retention_label, 0, 2, 1, 1);
    backup_grid.attach(&backup_retention_combo, 1, 2, 1, 1);

    backup_group.set_child(Some(&backup_grid));

    // Actions
    let actions_group = create_group("Actions");
    box_.append(&actions_group);

    let actions_grid = Grid::new();
    actions_grid.set_row_spacing(8);
    actions_grid.set_column_spacing(12);

    let upgrade_storage_button = Button::with_label("Upgrade Storage");
    let backup_now_button = Button::with_label("Backup Now");
    let restore_backup_button = Button::with_label("Restore Backup");
    let clear_cache_button = Button::with_label("Clear Cache");

    actions_grid.attach(&upgrade_storage_button, 0, 0, 1, 1);
    actions_grid.attach(&backup_now_button, 1, 0, 1, 1);
    actions_grid.attach(&restore_backup_button, 0, 1, 1, 1);
    actions_grid.attach(&clear_cache_button, 1, 1, 1, 1);

    actions_group.set_child(Some(&actions_grid));

    box_
}

fn create_group(title: &str) -> adw::PreferencesGroup {
    let group = adw::PreferencesGroup::new();
    group.set_title(Some(title));
    group
} 