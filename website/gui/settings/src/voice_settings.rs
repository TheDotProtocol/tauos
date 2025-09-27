use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{ApplicationWindow, Box, Label, Switch, Button, Entry, ComboBoxText, Grid, Adjustment, Scale, SpinButton};
use gtk::adw;

pub fn create_voice_tab(window: &ApplicationWindow) -> Box {
    let box_ = Box::new(gtk::Orientation::Vertical, 12);
    box_.set_margin_start(20);
    box_.set_margin_end(20);
    box_.set_margin_top(20);
    box_.set_margin_bottom(20);

    // Voice Assistant Status
    let status_group = create_group("Voice Assistant Status");
    box_.append(&status_group);

    let status_grid = Grid::new();
    status_grid.set_row_spacing(8);
    status_grid.set_column_spacing(12);

    let enabled_label = Label::new(Some("Voice Assistant:"));
    let enabled_switch = Switch::new();
    enabled_switch.set_active(true);

    let status_label = Label::new(Some("Status:"));
    let status_entry = Entry::new();
    status_entry.set_text("Active - Listening");
    status_entry.set_editable(false);

    let model_label = Label::new(Some("Model:"));
    let model_entry = Entry::new();
    model_entry.set_text("Local Vosk Model");
    model_entry.set_editable(false);

    status_grid.attach(&enabled_label, 0, 0, 1, 1);
    status_grid.attach(&enabled_switch, 1, 0, 1, 1);
    status_grid.attach(&status_label, 0, 1, 1, 1);
    status_grid.attach(&status_entry, 1, 1, 1, 1);
    status_grid.attach(&model_label, 0, 2, 1, 1);
    status_grid.attach(&model_entry, 1, 2, 1, 1);

    status_group.set_child(Some(&status_grid));

    // Hotkey Settings
    let hotkey_group = create_group("Hotkey Settings");
    box_.append(&hotkey_group);

    let hotkey_grid = Grid::new();
    hotkey_grid.set_row_spacing(8);
    hotkey_grid.set_column_spacing(12);

    let hotkey_label = Label::new(Some("Activation Hotkey:"));
    let hotkey_entry = Entry::new();
    hotkey_entry.set_text("Cmd+Shift+V");
    hotkey_entry.set_editable(false);

    let custom_hotkey_label = Label::new(Some("Custom Hotkey:"));
    let custom_hotkey_entry = Entry::new();
    custom_hotkey_entry.set_placeholder_text("Press keys...");

    let wake_word_label = Label::new(Some("Wake Word:"));
    let wake_word_entry = Entry::new();
    wake_word_entry.set_text("Hey Tau");

    hotkey_grid.attach(&hotkey_label, 0, 0, 1, 1);
    hotkey_grid.attach(&hotkey_entry, 1, 0, 1, 1);
    hotkey_grid.attach(&custom_hotkey_label, 0, 1, 1, 1);
    hotkey_grid.attach(&custom_hotkey_entry, 1, 1, 1, 1);
    hotkey_grid.attach(&wake_word_label, 0, 2, 1, 1);
    hotkey_grid.attach(&wake_word_entry, 1, 2, 1, 1);

    hotkey_group.set_child(Some(&hotkey_grid));

    // Audio Settings
    let audio_group = create_group("Audio Settings");
    box_.append(&audio_group);

    let audio_grid = Grid::new();
    audio_grid.set_row_spacing(8);
    audio_grid.set_column_spacing(12);

    let input_device_label = Label::new(Some("Input Device:"));
    let input_device_combo = ComboBoxText::new();
    input_device_combo.append_text("Built-in Microphone");
    input_device_combo.append_text("External Microphone");
    input_device_combo.append_text("Bluetooth Headset");
    input_device_combo.set_active(Some(0));

    let output_device_label = Label::new(Some("Output Device:"));
    let output_device_combo = ComboBoxText::new();
    output_device_combo.append_text("Built-in Speakers");
    output_device_combo.append_text("Headphones");
    output_device_combo.append_text("Bluetooth Speakers");
    output_device_combo.set_active(Some(0));

    let sensitivity_label = Label::new(Some("Microphone Sensitivity:"));
    let sensitivity_adj = Adjustment::new(75.0, 0.0, 100.0, 1.0, 10.0, 0.0);
    let sensitivity_scale = Scale::new(gtk::Orientation::Horizontal, Some(&sensitivity_adj));

    audio_grid.attach(&input_device_label, 0, 0, 1, 1);
    audio_grid.attach(&input_device_combo, 1, 0, 1, 1);
    audio_grid.attach(&output_device_label, 0, 1, 1, 1);
    audio_grid.attach(&output_device_combo, 1, 1, 1, 1);
    audio_grid.attach(&sensitivity_label, 0, 2, 1, 1);
    audio_grid.attach(&sensitivity_scale, 1, 2, 1, 1);

    audio_group.set_child(Some(&audio_grid));

    // Model Settings
    let model_group = create_group("Model Settings");
    box_.append(&model_group);

    let model_grid = Grid::new();
    model_grid.set_row_spacing(8);
    model_grid.set_column_spacing(12);

    let stt_model_label = Label::new(Some("Speech-to-Text Model:"));
    let stt_model_combo = ComboBoxText::new();
    stt_model_combo.append_text("Vosk (Offline)");
    stt_model_combo.append_text("Coqui (Offline)");
    stt_model_combo.append_text("OpenRouter (Online)");
    stt_model_combo.set_active(Some(0));

    let tts_model_label = Label::new(Some("Text-to-Speech Model:"));
    let tts_model_combo = ComboBoxText::new();
    tts_model_combo.append_text("Local TTS");
    tts_model_combo.append_text("OpenRouter TTS");
    tts_model_combo.set_active(Some(0));

    let llm_model_label = Label::new(Some("Language Model:"));
    let llm_model_combo = ComboBoxText::new();
    llm_model_combo.append_text("Local Model");
    llm_model_combo.append_text("OpenRouter GPT-4");
    llm_model_combo.append_text("OpenRouter Claude");
    llm_model_combo.set_active(Some(1));

    model_grid.attach(&stt_model_label, 0, 0, 1, 1);
    model_grid.attach(&stt_model_combo, 1, 0, 1, 1);
    model_grid.attach(&tts_model_label, 0, 1, 1, 1);
    model_grid.attach(&tts_model_combo, 1, 1, 1, 1);
    model_grid.attach(&llm_model_label, 0, 2, 1, 1);
    model_grid.attach(&llm_model_combo, 1, 2, 1, 1);

    model_group.set_child(Some(&model_grid));

    // Privacy Settings
    let privacy_group = create_group("Privacy Settings");
    box_.append(&privacy_group);

    let privacy_grid = Grid::new();
    privacy_grid.set_row_spacing(8);
    privacy_grid.set_column_spacing(12);

    let local_processing_label = Label::new(Some("Local Processing:"));
    let local_processing_switch = Switch::new();
    local_processing_switch.set_active(true);

    let voice_data_label = Label::new(Some("Store Voice Data:"));
    let voice_data_switch = Switch::new();
    voice_data_switch.set_active(false);

    let cloud_fallback_label = Label::new(Some("Cloud Fallback:"));
    let cloud_fallback_switch = Switch::new();
    cloud_fallback_switch.set_active(true);

    privacy_grid.attach(&local_processing_label, 0, 0, 1, 1);
    privacy_grid.attach(&local_processing_switch, 1, 0, 1, 1);
    privacy_grid.attach(&voice_data_label, 0, 1, 1, 1);
    privacy_grid.attach(&voice_data_switch, 1, 1, 1, 1);
    privacy_grid.attach(&cloud_fallback_label, 0, 2, 1, 1);
    privacy_grid.attach(&cloud_fallback_switch, 1, 2, 1, 1);

    privacy_group.set_child(Some(&privacy_grid));

    // Voice Commands
    let commands_group = create_group("Voice Commands");
    box_.append(&commands_group);

    let commands_grid = Grid::new();
    commands_grid.set_row_spacing(8);
    commands_grid.set_column_spacing(12);

    let system_commands_label = Label::new(Some("System Commands:"));
    let system_commands_switch = Switch::new();
    system_commands_switch.set_active(true);

    let app_launch_label = Label::new(Some("App Launching:"));
    let app_launch_switch = Switch::new();
    app_launch_switch.set_active(true);

    let web_search_label = Label::new(Some("Web Search:"));
    let web_search_switch = Switch::new();
    web_search_switch.set_active(true);

    commands_grid.attach(&system_commands_label, 0, 0, 1, 1);
    commands_grid.attach(&system_commands_switch, 1, 0, 1, 1);
    commands_grid.attach(&app_launch_label, 0, 1, 1, 1);
    commands_grid.attach(&app_launch_switch, 1, 1, 1, 1);
    commands_grid.attach(&web_search_label, 0, 2, 1, 1);
    commands_grid.attach(&web_search_switch, 1, 2, 1, 1);

    commands_group.set_child(Some(&commands_grid));

    // Actions
    let actions_group = create_group("Actions");
    box_.append(&actions_group);

    let actions_grid = Grid::new();
    actions_grid.set_row_spacing(8);
    actions_grid.set_column_spacing(12);

    let test_voice_button = Button::with_label("Test Voice");
    let train_model_button = Button::with_label("Train Model");
    let download_models_button = Button::with_label("Download Models");
    let reset_voice_button = Button::with_label("Reset Voice");

    actions_grid.attach(&test_voice_button, 0, 0, 1, 1);
    actions_grid.attach(&train_model_button, 1, 0, 1, 1);
    actions_grid.attach(&download_models_button, 0, 1, 1, 1);
    actions_grid.attach(&reset_voice_button, 1, 1, 1, 1);

    actions_group.set_child(Some(&actions_grid));

    box_
}

fn create_group(title: &str) -> adw::PreferencesGroup {
    let group = adw::PreferencesGroup::new();
    group.set_title(Some(title));
    group
} 