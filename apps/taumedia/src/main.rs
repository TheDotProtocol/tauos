use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box as GtkBox, Label, Orientation, CssProvider, StyleContext, STYLE_PROVIDER_PRIORITY_APPLICATION, Button, Image, Scale, Adjustment, ListBox, ListBoxRow, Frame, ScrolledWindow, EventControllerKey, gdk, gdk::Display, FileChooserDialog, FileChooserAction, ResponseType, VideoWidget, ProgressBar, Revealer, Stack, Notebook, Separator, Entry, ComboBoxText};
use gio::ApplicationFlags;
use gstreamer as gst;
use gstreamer_video as gst_video;
use gstreamer_player as gst_player;
use std::cell::RefCell;
use std::rc::Rc;
use std::path::PathBuf;
use std::time::Duration;

#[derive(Clone)]
struct MediaFile {
    path: String,
    name: String,
    duration: Option<Duration>,
    format: String,
}

#[derive(Clone)]
struct Playlist {
    name: String,
    files: Vec<MediaFile>,
}

struct MediaPlayer {
    player: gst_player::Player,
    current_file: RefCell<Option<MediaFile>>,
    playlist: RefCell<Vec<MediaFile>>,
    current_index: RefCell<usize>,
    is_playing: RefCell<bool>,
    volume: RefCell<f64>,
    position: RefCell<f64>,
    duration: RefCell<f64>,
}

impl MediaPlayer {
    fn new() -> Self {
        gst::init().unwrap();
        
        let player = gst_player::Player::new(
            None::<gst_player::PlayerVideoRenderer>,
            None::<gst_player::PlayerSignalDispatcher>,
        );
        
        Self {
            player,
            current_file: RefCell::new(None),
            playlist: RefCell::new(Vec::new()),
            current_index: RefCell::new(0),
            is_playing: RefCell::new(false),
            volume: RefCell::new(1.0),
            position: RefCell::new(0.0),
            duration: RefCell::new(0.0),
        }
    }
    
    fn load_file(&self, path: &str) {
        let uri = format!("file://{}", path);
        self.player.set_uri(Some(&uri));
        self.current_file.replace(Some(MediaFile {
            path: path.to_string(),
            name: PathBuf::from(path).file_name().unwrap().to_string_lossy().to_string(),
            duration: None,
            format: "Unknown".to_string(),
        }));
    }
    
    fn play(&self) {
        self.player.play();
        self.is_playing.replace(true);
    }
    
    fn pause(&self) {
        self.player.pause();
        self.is_playing.replace(false);
    }
    
    fn stop(&self) {
        self.player.stop();
        self.is_playing.replace(false);
    }
    
    fn set_volume(&self, volume: f64) {
        self.player.set_volume(volume);
        self.volume.replace(volume);
    }
    
    fn seek(&self, position: f64) {
        self.player.seek(position);
        self.position.replace(position);
    }
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.taumedia")
        .flags(ApplicationFlags::HANDLES_OPEN)
        .build();

    app.connect_activate(|app| {
        // Load TauOS theme CSS
        let provider = CssProvider::new();
        provider.load_from_data(include_bytes!("../../gui/taukit/theme.css")).unwrap();
        StyleContext::add_provider_for_display(
            &gtk4::gdk::Display::default().unwrap(),
            &provider,
            STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        // Load media player specific CSS
        let media_provider = CssProvider::new();
        media_provider.load_from_data(include_bytes!("media_player.css")).unwrap();
        StyleContext::add_provider_for_display(
            &gtk4::gdk::Display::default().unwrap(),
            &media_provider,
            STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        let window = ApplicationWindow::builder()
            .application(app)
            .title("Tau Media Player")
            .default_width(1000)
            .default_height(700)
            .build();

        let media_player = Rc::new(MediaPlayer::new());
        
        let main_box = GtkBox::new(Orientation::Vertical, 0);
        
        // Title bar
        let titlebar = create_titlebar();
        main_box.append(&titlebar);
        
        // Main content
        let content_box = GtkBox::new(Orientation::Horizontal, 0);
        
        // Sidebar with playlist
        let sidebar = create_sidebar(&media_player);
        content_box.append(&sidebar);
        
        // Main player area
        let player_area = create_player_area(&media_player);
        content_box.append(&player_area);
        
        main_box.append(&content_box);
        
        // Control bar
        let control_bar = create_control_bar(&media_player);
        main_box.append(&control_bar);

        // Keyboard navigation
        let key_controller = EventControllerKey::new();
        key_controller.connect_key_pressed(move |_, key, _, _| {
            match key.keyval() {
                gdk::Key::Escape => {
                    window.close();
                    gtk4::Inhibit(true)
                }
                gdk::Key::space => {
                    // Toggle play/pause
                    gtk4::Inhibit(false)
                }
                _ => gtk4::Inhibit(false)
            }
        });
        window.add_controller(&key_controller);

        // Accessibility
        window.set_accessible_name(Some("Tau Media Player"));
        window.set_accessible_description(Some("Privacy-first media player for TauOS"));

        window.set_child(Some(&main_box));
        window.present();
    });

    app.run();
}

fn create_titlebar() -> GtkBox {
    let titlebar = GtkBox::new(Orientation::Horizontal, 0);
    titlebar.add_css_class("titlebar");
    
    let title_label = Label::new(Some("Tau Media Player"));
    title_label.add_css_class("titlebar-title");
    titlebar.append(&title_label);
    
    // Window controls
    let controls_box = GtkBox::new(Orientation::Horizontal, 8);
    controls_box.add_css_class("titlebar-controls");
    
    let minimize_btn = Button::new();
    minimize_btn.add_css_class("control-btn");
    minimize_btn.add_css_class("minimize");
    
    let maximize_btn = Button::new();
    maximize_btn.add_css_class("control-btn");
    maximize_btn.add_css_class("maximize");
    
    let close_btn = Button::new();
    close_btn.add_css_class("control-btn");
    close_btn.add_css_class("close");
    
    controls_box.append(&minimize_btn);
    controls_box.append(&maximize_btn);
    controls_box.append(&close_btn);
    titlebar.append(&controls_box);
    
    titlebar
}

fn create_sidebar(media_player: &Rc<MediaPlayer>) -> GtkBox {
    let sidebar = GtkBox::new(Orientation::Vertical, 0);
    sidebar.add_css_class("sidebar");
    sidebar.set_size_request(300, -1);
    
    // Header
    let header_box = GtkBox::new(Orientation::Vertical, 12);
    header_box.set_margin_start(16);
    header_box.set_margin_end(16);
    header_box.set_margin_top(16);
    header_box.set_margin_bottom(16);
    
    let header_label = Label::new(Some("Playlist"));
    header_label.add_css_class("title");
    header_box.append(&header_label);
    
    // Add file button
    let add_button = Button::with_label("Add Files");
    add_button.add_css_class("button");
    add_button.add_css_class("add-files-button");
    add_button.connect_clicked(move |_| {
        let dialog = FileChooserDialog::new(
            Some("Select Media Files"),
            None::<&gtk4::Window>,
            FileChooserAction::Open,
            &[
                ("Cancel", &ResponseType::Cancel),
                ("Open", &ResponseType::Accept),
            ],
        );
        
        dialog.set_select_multiple(true);
        dialog.set_filter(&create_media_filter());
        
        dialog.connect_response(move |dialog, response| {
            if response == ResponseType::Accept {
                if let Some(files) = dialog.files() {
                    for file in files {
                        if let Some(path) = file.path() {
                            let path_str = path.to_string_lossy().to_string();
                            media_player.load_file(&path_str);
                            // Add to playlist logic here
                        }
                    }
                }
            }
            dialog.close();
        });
        
        dialog.present();
    });
    
    header_box.append(&add_button);
    sidebar.append(&header_box);
    
    // Playlist
    let playlist_scroll = ScrolledWindow::new();
    let playlist_box = ListBox::new();
    playlist_box.add_css_class("playlist");
    
    // Sample playlist items
    let sample_files = vec![
        "Sample Music.mp3",
        "Sample Video.mp4",
        "Podcast Episode.mp3",
    ];
    
    for file in sample_files {
        let row = create_playlist_row(file);
        playlist_box.append(&row);
    }
    
    playlist_scroll.set_child(Some(&playlist_box));
    sidebar.append(&playlist_scroll);
    
    sidebar
}

fn create_player_area(media_player: &Rc<MediaPlayer>) -> GtkBox {
    let player_area = GtkBox::new(Orientation::Vertical, 0);
    player_area.add_css_class("player-area");
    
    // Video widget placeholder
    let video_frame = Frame::new(None);
    video_frame.add_css_class("video-frame");
    video_frame.set_size_request(-1, 400);
    
    let video_label = Label::new(Some("Video Player"));
    video_label.add_css_class("video-placeholder");
    video_frame.set_child(Some(&video_label));
    
    player_area.append(&video_frame);
    
    // Now playing info
    let info_box = GtkBox::new(Orientation::Vertical, 8);
    info_box.set_margin_start(16);
    info_box.set_margin_end(16);
    info_box.set_margin_top(16);
    info_box.set_margin_bottom(16);
    
    let now_playing_label = Label::new(Some("Now Playing"));
    now_playing_label.add_css_class("subtitle");
    
    let track_info_label = Label::new(Some("No track selected"));
    track_info_label.add_css_class("track-info");
    
    info_box.append(&now_playing_label);
    info_box.append(&track_info_label);
    
    player_area.append(&info_box);
    
    player_area
}

fn create_control_bar(media_player: &Rc<MediaPlayer>) -> GtkBox {
    let control_bar = GtkBox::new(Orientation::Vertical, 12);
    control_bar.add_css_class("control-bar");
    control_bar.set_margin_start(16);
    control_bar.set_margin_end(16);
    control_bar.set_margin_top(16);
    control_bar.set_margin_bottom(16);
    
    // Progress bar
    let progress_frame = Frame::new(None);
    let progress_box = GtkBox::new(Orientation::Vertical, 8);
    
    let progress_bar = ProgressBar::new();
    progress_bar.set_show_text(true);
    progress_bar.set_text(Some("0:00 / 0:00"));
    
    progress_box.append(&progress_bar);
    progress_frame.set_child(Some(&progress_box));
    control_bar.append(&progress_frame);
    
    // Control buttons
    let controls_box = GtkBox::new(Orientation::Horizontal, 16);
    controls_box.set_halign(gtk4::Align::Center);
    
    let prev_button = Button::new();
    prev_button.add_css_class("control-button");
    prev_button.set_label("⏮");
    
    let play_button = Button::new();
    play_button.add_css_class("control-button");
    play_button.set_label("▶");
    
    let next_button = Button::new();
    next_button.add_css_class("control-button");
    next_button.set_label("⏭");
    
    controls_box.append(&prev_button);
    controls_box.append(&play_button);
    controls_box.append(&next_button);
    
    // Volume control
    let volume_box = GtkBox::new(Orientation::Horizontal, 8);
    volume_box.add_css_class("volume-box");
    let volume_label = Label::new(Some("🔊"));
    let volume_scale = Scale::with_range(Orientation::Horizontal, 0.0, 100.0, 1.0);
    volume_scale.set_value(50.0);
    volume_scale.set_size_request(100, -1);
    
    volume_box.append(&volume_label);
    volume_box.append(&volume_scale);
    
    controls_box.append(&volume_box);
    
    control_bar.append(&controls_box);
    
    control_bar
}

fn create_playlist_row(filename: &str) -> ListBoxRow {
    let row = ListBoxRow::new();
    let box_widget = GtkBox::new(Orientation::Horizontal, 8);
    box_widget.set_margin_start(8);
    box_widget.set_margin_end(8);
    box_widget.set_margin_top(4);
    box_widget.set_margin_bottom(4);
    
    let icon_label = Label::new(Some("🎵"));
    icon_label.add_css_class("media-icon");
    let name_label = Label::new(Some(filename));
    name_label.set_hexpand(true);
    
    box_widget.append(&icon_label);
    box_widget.append(&name_label);
    
    row.set_child(Some(&box_widget));
    row
}

fn create_media_filter() -> gtk4::FileFilter {
    let filter = gtk4::FileFilter::new();
    filter.set_name(Some("Media Files"));
    filter.add_pattern("*.mp3");
    filter.add_pattern("*.mp4");
    filter.add_pattern("*.avi");
    filter.add_pattern("*.mkv");
    filter.add_pattern("*.wav");
    filter.add_pattern("*.flac");
    filter.add_pattern("*.ogg");
    filter
} 