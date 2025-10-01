use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{ApplicationWindow, Box, Label, Switch, Button, Entry, ComboBoxText, Grid, Adjustment, Scale, TextView, ScrolledWindow};
use gtk::adw;

pub fn create_taumail_tab(window: &ApplicationWindow) -> Box {
    let box_ = Box::new(gtk::Orientation::Vertical, 12);
    box_.set_margin_start(20);
    box_.set_margin_end(20);
    box_.set_margin_top(20);
    box_.set_margin_bottom(20);

    // Account Information
    let account_group = create_group("Account Information");
    box_.append(&account_group);

    let account_grid = Grid::new();
    account_grid.set_row_spacing(8);
    account_grid.set_column_spacing(12);

    let email_label = Label::new(Some("Email Address:"));
    let email_entry = Entry::new();
    email_entry.set_text("alice@tauos.org");

    let display_name_label = Label::new(Some("Display Name:"));
    let display_name_entry = Entry::new();
    display_name_entry.set_text("Alice Johnson");

    let domain_label = Label::new(Some("Domain:"));
    let domain_entry = Entry::new();
    domain_entry.set_text("tauos.org");

    account_grid.attach(&email_label, 0, 0, 1, 1);
    account_grid.attach(&email_entry, 1, 0, 1, 1);
    account_grid.attach(&display_name_label, 0, 1, 1, 1);
    account_grid.attach(&display_name_entry, 1, 1, 1, 1);
    account_grid.attach(&domain_label, 0, 2, 1, 1);
    account_grid.attach(&domain_entry, 1, 2, 1, 1);

    account_group.set_child(Some(&account_grid));

    // Email Signature
    let signature_group = create_group("Email Signature");
    box_.append(&signature_group);

    let signature_scroll = ScrolledWindow::new();
    signature_scroll.set_min_content_height(100);

    let signature_text = TextView::new();
    signature_text.buffer().unwrap().set_text("Best regards,\nAlice Johnson\nTauOS User\n\nSent with TauMail - Privacy-First Email");
    
    signature_scroll.set_child(Some(&signature_text));

    signature_group.set_child(Some(&signature_scroll));

    // Encryption Settings
    let encryption_group = create_group("Encryption Settings");
    box_.append(&encryption_group);

    let encryption_grid = Grid::new();
    encryption_grid.set_row_spacing(8);
    encryption_grid.set_column_spacing(12);

    let pgp_encryption_label = Label::new(Some("PGP Encryption:"));
    let pgp_encryption_switch = Switch::new();
    pgp_encryption_switch.set_active(true);

    let auto_encrypt_label = Label::new(Some("Auto-encrypt Outgoing:"));
    let auto_encrypt_switch = Switch::new();
    auto_encrypt_switch.set_active(true);

    let key_size_label = Label::new(Some("Key Size:"));
    let key_size_combo = ComboBoxText::new();
    key_size_combo.append_text("2048 bits");
    key_size_combo.append_text("4096 bits");
    key_size_combo.set_active(Some(1));

    encryption_grid.attach(&pgp_encryption_label, 0, 0, 1, 1);
    encryption_grid.attach(&pgp_encryption_switch, 1, 0, 1, 1);
    encryption_grid.attach(&auto_encrypt_label, 0, 1, 1, 1);
    encryption_grid.attach(&auto_encrypt_switch, 1, 1, 1, 1);
    encryption_grid.attach(&key_size_label, 0, 2, 1, 1);
    encryption_grid.attach(&key_size_combo, 1, 2, 1, 1);

    encryption_group.set_child(Some(&encryption_grid));

    // Filtering & Rules
    let filtering_group = create_group("Filtering & Rules");
    box_.append(&filtering_group);

    let filtering_grid = Grid::new();
    filtering_grid.set_row_spacing(8);
    filtering_grid.set_column_spacing(12);

    let spam_filter_label = Label::new(Some("Spam Filtering:"));
    let spam_filter_switch = Switch::new();
    spam_filter_switch.set_active(true);

    let phishing_protection_label = Label::new(Some("Phishing Protection:"));
    let phishing_protection_switch = Switch::new();
    phishing_protection_switch.set_active(true);

    let auto_sort_label = Label::new(Some("Auto-sort Emails:"));
    let auto_sort_switch = Switch::new();
    auto_sort_switch.set_active(true);

    filtering_grid.attach(&spam_filter_label, 0, 0, 1, 1);
    filtering_grid.attach(&spam_filter_switch, 1, 0, 1, 1);
    filtering_grid.attach(&phishing_protection_label, 0, 1, 1, 1);
    filtering_grid.attach(&phishing_protection_switch, 1, 1, 1, 1);
    filtering_grid.attach(&auto_sort_label, 0, 2, 1, 1);
    filtering_grid.attach(&auto_sort_switch, 1, 2, 1, 1);

    filtering_group.set_child(Some(&filtering_grid));

    // Forwarding & Auto-reply
    let forwarding_group = create_group("Forwarding & Auto-reply");
    box_.append(&forwarding_group);

    let forwarding_grid = Grid::new();
    forwarding_grid.set_row_spacing(8);
    forwarding_grid.set_column_spacing(12);

    let auto_reply_label = Label::new(Some("Auto-reply:"));
    let auto_reply_switch = Switch::new();
    auto_reply_switch.set_active(false);

    let forward_to_label = Label::new(Some("Forward to:"));
    let forward_to_entry = Entry::new();
    forward_to_entry.set_placeholder_text("another@email.com");

    let vacation_mode_label = Label::new(Some("Vacation Mode:"));
    let vacation_mode_switch = Switch::new();
    vacation_mode_switch.set_active(false);

    forwarding_grid.attach(&auto_reply_label, 0, 0, 1, 1);
    forwarding_grid.attach(&auto_reply_switch, 1, 0, 1, 1);
    forwarding_grid.attach(&forward_to_label, 0, 1, 1, 1);
    forwarding_grid.attach(&forward_to_entry, 1, 1, 1, 1);
    forwarding_grid.attach(&vacation_mode_label, 0, 2, 1, 1);
    forwarding_grid.attach(&vacation_mode_switch, 1, 2, 1, 1);

    forwarding_group.set_child(Some(&forwarding_grid));

    // Storage & Quotas
    let storage_group = create_group("Storage & Quotas");
    box_.append(&storage_group);

    let storage_grid = Grid::new();
    storage_grid.set_row_spacing(8);
    storage_grid.set_column_spacing(12);

    let storage_used_label = Label::new(Some("Storage Used:"));
    let storage_used_entry = Entry::new();
    storage_used_entry.set_text("45 MB / 1 GB");
    storage_used_entry.set_editable(false);

    let auto_cleanup_label = Label::new(Some("Auto-cleanup:"));
    let auto_cleanup_switch = Switch::new();
    auto_cleanup_switch.set_active(true);

    let retention_label = Label::new(Some("Retention Period:"));
    let retention_combo = ComboBoxText::new();
    retention_combo.append_text("30 days");
    retention_combo.append_text("90 days");
    retention_combo.append_text("1 year");
    retention_combo.append_text("Forever");
    retention_combo.set_active(Some(2));

    storage_grid.attach(&storage_used_label, 0, 0, 1, 1);
    storage_grid.attach(&storage_used_entry, 1, 0, 1, 1);
    storage_grid.attach(&auto_cleanup_label, 0, 1, 1, 1);
    storage_grid.attach(&auto_cleanup_switch, 1, 1, 1, 1);
    storage_grid.attach(&retention_label, 0, 2, 1, 1);
    storage_grid.attach(&retention_combo, 1, 2, 1, 1);

    storage_group.set_child(Some(&storage_grid));

    // Actions
    let actions_group = create_group("Actions");
    box_.append(&actions_group);

    let actions_grid = Grid::new();
    actions_grid.set_row_spacing(8);
    actions_grid.set_column_spacing(12);

    let export_mail_button = Button::with_label("Export Mail");
    let import_mail_button = Button::with_label("Import Mail");
    let backup_account_button = Button::with_label("Backup Account");
    let reset_settings_button = Button::with_label("Reset Settings");

    actions_grid.attach(&export_mail_button, 0, 0, 1, 1);
    actions_grid.attach(&import_mail_button, 1, 0, 1, 1);
    actions_grid.attach(&backup_account_button, 0, 1, 1, 1);
    actions_grid.attach(&reset_settings_button, 1, 1, 1, 1);

    actions_group.set_child(Some(&actions_grid));

    box_
}

fn create_group(title: &str) -> adw::PreferencesGroup {
    let group = adw::PreferencesGroup::new();
    group.set_title(Some(title));
    group
} 