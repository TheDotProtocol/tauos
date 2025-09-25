use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{ApplicationWindow, Box, Label, Switch, Button, Entry, ComboBoxText, Grid, Adjustment, Scale, TextView, ScrolledWindow};
use gtk::adw;

pub fn create_tauid_tab(window: &ApplicationWindow) -> Box {
    let box_ = Box::new(gtk::Orientation::Vertical, 12);
    box_.set_margin_start(20);
    box_.set_margin_end(20);
    box_.set_margin_top(20);
    box_.set_margin_bottom(20);

    // Identity Information
    let identity_group = create_group("Identity Information");
    box_.append(&identity_group);

    let identity_grid = Grid::new();
    identity_grid.set_row_spacing(8);
    identity_grid.set_column_spacing(12);

    let did_label = Label::new(Some("DID:"));
    let did_entry = Entry::new();
    did_entry.set_text("did:web:tauos.org:user:alice");
    did_entry.set_editable(false);

    let name_label = Label::new(Some("Display Name:"));
    let name_entry = Entry::new();
    name_entry.set_text("Alice Johnson");

    let email_label = Label::new(Some("Email:"));
    let email_entry = Entry::new();
    email_entry.set_text("alice@tauos.org");

    identity_grid.attach(&did_label, 0, 0, 1, 1);
    identity_grid.attach(&did_entry, 1, 0, 1, 1);
    identity_grid.attach(&name_label, 0, 1, 1, 1);
    identity_grid.attach(&name_entry, 1, 1, 1, 1);
    identity_grid.attach(&email_label, 0, 2, 1, 1);
    identity_grid.attach(&email_entry, 1, 2, 1, 1);

    identity_group.set_child(Some(&identity_grid));

    // Key Management
    let keys_group = create_group("Key Management");
    box_.append(&keys_group);

    let keys_grid = Grid::new();
    keys_grid.set_row_spacing(8);
    keys_grid.set_column_spacing(12);

    let key_type_label = Label::new(Some("Key Type:"));
    let key_type_combo = ComboBoxText::new();
    key_type_combo.append_text("Ed25519");
    key_type_combo.append_text("RSA-2048");
    key_type_combo.append_text("RSA-4096");
    key_type_combo.set_active(Some(0));

    let key_rotation_label = Label::new(Some("Auto Key Rotation:"));
    let key_rotation_switch = Switch::new();
    key_rotation_switch.set_active(true);

    let rotation_period_label = Label::new(Some("Rotation Period:"));
    let rotation_period_combo = ComboBoxText::new();
    rotation_period_combo.append_text("30 days");
    rotation_period_combo.append_text("90 days");
    rotation_period_combo.append_text("180 days");
    rotation_period_combo.set_active(Some(1));

    keys_grid.attach(&key_type_label, 0, 0, 1, 1);
    keys_grid.attach(&key_type_combo, 1, 0, 1, 1);
    keys_grid.attach(&key_rotation_label, 0, 1, 1, 1);
    keys_grid.attach(&key_rotation_switch, 1, 1, 1, 1);
    keys_grid.attach(&rotation_period_label, 0, 2, 1, 1);
    keys_grid.attach(&rotation_period_combo, 1, 2, 1, 1);

    keys_group.set_child(Some(&keys_grid));

    // Device Management
    let devices_group = create_group("Device Management");
    box_.append(&devices_group);

    let devices_grid = Grid::new();
    devices_grid.set_row_spacing(8);
    devices_grid.set_column_spacing(12);

    let current_device_label = Label::new(Some("Current Device:"));
    let current_device_entry = Entry::new();
    current_device_entry.set_text("MacBook Pro (Alice's Laptop)");
    current_device_entry.set_editable(false);

    let device_auth_label = Label::new(Some("Device Authentication:"));
    let device_auth_switch = Switch::new();
    device_auth_switch.set_active(true);

    let biometric_label = Label::new(Some("Biometric Authentication:"));
    let biometric_switch = Switch::new();
    biometric_switch.set_active(true);

    devices_grid.attach(&current_device_label, 0, 0, 1, 1);
    devices_grid.attach(&current_device_entry, 1, 0, 1, 1);
    devices_grid.attach(&device_auth_label, 0, 1, 1, 1);
    devices_grid.attach(&device_auth_switch, 1, 1, 1, 1);
    devices_grid.attach(&biometric_label, 0, 2, 1, 1);
    devices_grid.attach(&biometric_switch, 1, 2, 1, 1);

    devices_group.set_child(Some(&devices_grid));

    // Actions
    let actions_group = create_group("Actions");
    box_.append(&actions_group);

    let actions_grid = Grid::new();
    actions_grid.set_row_spacing(8);
    actions_grid.set_column_spacing(12);

    let export_keys_button = Button::with_label("Export Keys");
    let rotate_keys_button = Button::with_label("Rotate Keys Now");
    let revoke_device_button = Button::with_label("Revoke Device");
    let backup_identity_button = Button::with_label("Backup Identity");

    actions_grid.attach(&export_keys_button, 0, 0, 1, 1);
    actions_grid.attach(&rotate_keys_button, 1, 0, 1, 1);
    actions_grid.attach(&revoke_device_button, 0, 1, 1, 1);
    actions_grid.attach(&backup_identity_button, 1, 1, 1, 1);

    actions_group.set_child(Some(&actions_grid));

    // DID Document
    let document_group = create_group("DID Document");
    box_.append(&document_group);

    let document_scroll = ScrolledWindow::new();
    document_scroll.set_min_content_height(150);

    let document_text = TextView::new();
    document_text.set_monospace(true);
    document_text.set_editable(false);
    
    let did_document = r#"{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:tauos.org:user:alice",
  "verificationMethod": [{
    "id": "did:web:tauos.org:user:alice#key-1",
    "type": "Ed25519VerificationKey2018",
    "controller": "did:web:tauos.org:user:alice",
    "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
  }],
  "authentication": ["did:web:tauos.org:user:alice#key-1"],
  "assertionMethod": ["did:web:tauos.org:user:alice#key-1"]
}"#;
    
    document_text.buffer().unwrap().set_text(did_document);
    document_scroll.set_child(Some(&document_text));

    document_group.set_child(Some(&document_scroll));

    box_
}

fn create_group(title: &str) -> adw::PreferencesGroup {
    let group = adw::PreferencesGroup::new();
    group.set_title(Some(title));
    group
} 