use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{ApplicationWindow, Box, Label, Switch, Button, Entry, ComboBoxText, Grid, Adjustment, Scale};
use gtk::adw;

pub fn create_privacy_tab(window: &ApplicationWindow) -> Box {
    let box_ = Box::new(gtk::Orientation::Vertical, 12);
    box_.set_margin_start(20);
    box_.set_margin_end(20);
    box_.set_margin_top(20);
    box_.set_margin_bottom(20);

    // Telemetry Settings
    let telemetry_group = create_group("Telemetry & Analytics");
    box_.append(&telemetry_group);

    let telemetry_grid = Grid::new();
    telemetry_grid.set_row_spacing(8);
    telemetry_grid.set_column_spacing(12);

    let telemetry_label = Label::new(Some("Enable Telemetry:"));
    let telemetry_switch = Switch::new();
    telemetry_switch.set_active(false);

    let crash_reports_label = Label::new(Some("Crash Reports:"));
    let crash_reports_switch = Switch::new();
    crash_reports_switch.set_active(false);

    let usage_stats_label = Label::new(Some("Usage Statistics:"));
    let usage_stats_switch = Switch::new();
    usage_stats_switch.set_active(false);

    telemetry_grid.attach(&telemetry_label, 0, 0, 1, 1);
    telemetry_grid.attach(&telemetry_switch, 1, 0, 1, 1);
    telemetry_grid.attach(&crash_reports_label, 0, 1, 1, 1);
    telemetry_grid.attach(&crash_reports_switch, 1, 1, 1, 1);
    telemetry_grid.attach(&usage_stats_label, 0, 2, 1, 1);
    telemetry_grid.attach(&usage_stats_switch, 1, 2, 1, 1);

    telemetry_group.set_child(Some(&telemetry_grid));

    // Voice Data Settings
    let voice_group = create_group("Voice Assistant Privacy");
    box_.append(&voice_group);

    let voice_grid = Grid::new();
    voice_grid.set_row_spacing(8);
    voice_grid.set_column_spacing(12);

    let voice_data_label = Label::new(Some("Store Voice Data:"));
    let voice_data_switch = Switch::new();
    voice_data_switch.set_active(false);

    let voice_processing_label = Label::new(Some("Local Processing:"));
    let voice_processing_switch = Switch::new();
    voice_processing_switch.set_active(true);

    let voice_cloud_label = Label::new(Some("Cloud Processing:"));
    let voice_cloud_switch = Switch::new();
    voice_cloud_switch.set_active(false);

    voice_grid.attach(&voice_data_label, 0, 0, 1, 1);
    voice_grid.attach(&voice_data_switch, 1, 0, 1, 1);
    voice_grid.attach(&voice_processing_label, 0, 1, 1, 1);
    voice_grid.attach(&voice_processing_switch, 1, 1, 1, 1);
    voice_grid.attach(&voice_cloud_label, 0, 2, 1, 1);
    voice_grid.attach(&voice_cloud_switch, 1, 2, 1, 1);

    voice_group.set_child(Some(&voice_grid));

    // Consent Management
    let consent_group = create_group("Consent Management");
    box_.append(&consent_group);

    let consent_grid = Grid::new();
    consent_grid.set_row_spacing(8);
    consent_grid.set_column_spacing(12);

    let gdpr_blocking_label = Label::new(Some("GDPR Tracking Blocking:"));
    let gdpr_blocking_switch = Switch::new();
    gdpr_blocking_switch.set_active(true);

    let anonymous_metrics_label = Label::new(Some("Anonymous Metrics:"));
    let anonymous_metrics_switch = Switch::new();
    anonymous_metrics_switch.set_active(false);

    let data_processing_label = Label::new(Some("Data Processing Consent:"));
    let data_processing_switch = Switch::new();
    data_processing_switch.set_active(false);

    consent_grid.attach(&gdpr_blocking_label, 0, 0, 1, 1);
    consent_grid.attach(&gdpr_blocking_switch, 1, 0, 1, 1);
    consent_grid.attach(&anonymous_metrics_label, 0, 1, 1, 1);
    consent_grid.attach(&anonymous_metrics_switch, 1, 1, 1, 1);
    consent_grid.attach(&data_processing_label, 0, 2, 1, 1);
    consent_grid.attach(&data_processing_switch, 1, 2, 1, 1);

    consent_group.set_child(Some(&consent_grid));

    // Data Rights
    let rights_group = create_group("Data Rights");
    box_.append(&rights_group);

    let rights_grid = Grid::new();
    rights_grid.set_row_spacing(8);
    rights_grid.set_column_spacing(12);

    let export_data_button = Button::with_label("Export My Data");
    let delete_data_button = Button::with_label("Delete My Data");
    let access_data_button = Button::with_label("Access My Data");

    rights_grid.attach(&export_data_button, 0, 0, 1, 1);
    rights_grid.attach(&delete_data_button, 1, 0, 1, 1);
    rights_grid.attach(&access_data_button, 2, 0, 1, 1);

    rights_group.set_child(Some(&rights_grid));

    // Privacy Level
    let level_group = create_group("Privacy Level");
    box_.append(&level_group);

    let level_grid = Grid::new();
    level_grid.set_row_spacing(8);
    level_grid.set_column_spacing(12);

    let privacy_level_label = Label::new(Some("Privacy Level:"));
    let privacy_level_combo = ComboBoxText::new();
    privacy_level_combo.append_text("Maximum Privacy");
    privacy_level_combo.append_text("Balanced");
    privacy_level_combo.append_text("Performance");
    privacy_level_combo.set_active(Some(0));

    level_grid.attach(&privacy_level_label, 0, 0, 1, 1);
    level_grid.attach(&privacy_level_combo, 1, 0, 1, 1);

    level_group.set_child(Some(&level_grid));

    box_
}

fn create_group(title: &str) -> adw::PreferencesGroup {
    let group = adw::PreferencesGroup::new();
    group.set_title(Some(title));
    group
} 