use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Box, Button, Entry, HeaderBar, Orientation, ScrolledWindow, Label, Image};
use webkit2gtk::{WebView, WebViewExt, SettingsExt};
use std::sync::{Arc, Mutex};

pub struct TauBrowser {
    pub widget: Box,
    webview: WebView,
    address_bar: Entry,
    back_button: Button,
    forward_button: Button,
    refresh_button: Button,
    home_button: Button,
    privacy_button: Button,
    browser_state: Arc<Mutex<BrowserState>>,
}

#[derive(Clone)]
struct BrowserState {
    current_url: String,
    is_private_mode: bool,
    privacy_level: String,
}

impl TauBrowser {
    pub fn new() -> Self {
        // Create main container
        let main_box = Box::new(Orientation::Vertical, 0);
        
        // Create header bar with τ symbol
        let header_bar = Self::create_header_bar();
        main_box.append(&header_bar);
        
        // Create WebView
        let webview = Self::create_webview();
        let webview_clone = webview.clone();
        
        // Create address bar
        let address_bar = Self::create_address_bar();
        let address_bar_clone = address_bar.clone();
        
        // Create navigation buttons
        let (back_button, forward_button, refresh_button, home_button, privacy_button) = 
            Self::create_navigation_buttons();
        
        // Create toolbar
        let toolbar = Self::create_toolbar(
            &back_button, 
            &forward_button, 
            &refresh_button, 
            &home_button, 
            &privacy_button, 
            &address_bar
        );
        main_box.append(&toolbar);
        
        // Add WebView to main container
        main_box.append(&webview);
        
        // Initialize browser state
        let browser_state = Arc::new(Mutex::new(BrowserState {
            current_url: "https://www.google.com".to_string(),
            is_private_mode: false,
            privacy_level: "High".to_string(),
        }));
        
        // Connect signals
        Self::connect_signals(
            &webview_clone,
            &address_bar_clone,
            &back_button,
            &forward_button,
            &refresh_button,
            &home_button,
            &privacy_button,
            Arc::clone(&browser_state)
        );
        
        // Load initial page
        webview.load_uri(Some("https://www.google.com"));
        
        Self {
            widget: main_box,
            webview,
            address_bar,
            back_button,
            forward_button,
            refresh_button,
            home_button,
            privacy_button,
            browser_state,
        }
    }
    
    fn create_header_bar() -> HeaderBar {
        let header_bar = HeaderBar::new();
        
        // Create τ symbol for title
        let title_label = Label::new(Some("τ Browser"));
        title_label.add_css_class("browser-title");
        header_bar.set_title_widget(Some(&title_label));
        
        // Add privacy indicator
        let privacy_indicator = Label::new(Some("🔒 Privacy Protected"));
        privacy_indicator.add_css_class("privacy-indicator");
        header_bar.pack_end(&privacy_indicator);
        
        header_bar
    }
    
    fn create_webview() -> WebView {
        let webview = WebView::new();
        
        // Configure WebView settings for privacy
        if let Some(settings) = webview.settings() {
            settings.set_javascript_can_access_clipboard(false);
            settings.set_enable_developer_extras(false);
            settings.set_enable_offline_web_application_cache(false);
            settings.set_enable_html5_local_storage(false);
            settings.set_enable_html5_database(false);
            settings.set_enable_xss_auditor(true);
            settings.set_enable_write_console_messages_to_stdout(false);
            settings.set_enable_webgl(false);
            settings.set_enable_plugins(false);
        }
        
        webview
    }
    
    fn create_address_bar() -> Entry {
        let address_bar = Entry::new();
        address_bar.set_placeholder_text(Some("Enter URL or search..."));
        address_bar.add_css_class("address-bar");
        address_bar
    }
    
    fn create_navigation_buttons() -> (Button, Button, Button, Button, Button) {
        // Back button
        let back_button = Button::new();
        back_button.set_icon_name(Some("go-previous-symbolic"));
        back_button.set_tooltip_text(Some("Go Back"));
        back_button.add_css_class("nav-button");
        
        // Forward button
        let forward_button = Button::new();
        forward_button.set_icon_name(Some("go-next-symbolic"));
        forward_button.set_tooltip_text(Some("Go Forward"));
        forward_button.add_css_class("nav-button");
        
        // Refresh button
        let refresh_button = Button::new();
        refresh_button.set_icon_name(Some("view-refresh-symbolic"));
        refresh_button.set_tooltip_text(Some("Refresh"));
        refresh_button.add_css_class("nav-button");
        
        // Home button
        let home_button = Button::new();
        home_button.set_icon_name(Some("go-home-symbolic"));
        home_button.set_tooltip_text(Some("Home"));
        home_button.add_css_class("nav-button");
        
        // Privacy button
        let privacy_button = Button::new();
        privacy_button.set_label(Some("🔒"));
        privacy_button.set_tooltip_text(Some("Privacy Settings"));
        privacy_button.add_css_class("privacy-button");
        
        (back_button, forward_button, refresh_button, home_button, privacy_button)
    }
    
    fn create_toolbar(
        back_button: &Button,
        forward_button: &Button,
        refresh_button: &Button,
        home_button: &Button,
        privacy_button: &Button,
        address_bar: &Entry
    ) -> Box {
        let toolbar = Box::new(Orientation::Horizontal, 8);
        toolbar.add_css_class("browser-toolbar");
        
        // Navigation buttons
        toolbar.append(back_button);
        toolbar.append(forward_button);
        toolbar.append(refresh_button);
        toolbar.append(home_button);
        
        // Separator
        let separator = gtk::Separator::new(gtk::Orientation::Vertical);
        toolbar.append(&separator);
        
        // Address bar (expands to fill space)
        toolbar.append(address_bar);
        address_bar.set_hexpand(true);
        
        // Privacy button
        toolbar.append(privacy_button);
        
        toolbar
    }
    
    fn connect_signals(
        webview: &WebView,
        address_bar: &Entry,
        back_button: &Button,
        forward_button: &Button,
        refresh_button: &Button,
        home_button: &Button,
        privacy_button: &Button,
        browser_state: Arc<Mutex<BrowserState>>
    ) {
        let webview_clone = webview.clone();
        let address_bar_clone = address_bar.clone();
        let state_clone = Arc::clone(&browser_state);
        
        // Address bar enter key
        address_bar.connect_activate(move |entry| {
            let url = entry.text();
            if !url.is_empty() {
                let formatted_url = if url.starts_with("http://") || url.starts_with("https://") {
                    url.to_string()
                } else {
                    format!("https://www.google.com/search?q={}", url)
                };
                
                webview_clone.load_uri(Some(&formatted_url));
                
                // Update state
                if let Ok(mut state) = state_clone.lock() {
                    state.current_url = formatted_url;
                }
            }
        });
        
        // Navigation buttons
        let webview_back = webview.clone();
        back_button.connect_clicked(move |_| {
            webview_back.go_back();
        });
        
        let webview_forward = webview.clone();
        forward_button.connect_clicked(move |_| {
            webview_forward.go_forward();
        });
        
        let webview_refresh = webview.clone();
        refresh_button.connect_clicked(move |_| {
            webview_refresh.reload();
        });
        
        let webview_home = webview.clone();
        home_button.connect_clicked(move |_| {
            webview_home.load_uri(Some("https://www.google.com"));
        });
        
        // Privacy button
        privacy_button.connect_clicked(move |_| {
            println!("Privacy settings clicked");
            // TODO: Open privacy settings dialog
        });
        
        // WebView load changed
        let address_bar_update = address_bar_clone.clone();
        let state_update = Arc::clone(&browser_state);
        webview.connect_load_changed(move |_, _| {
            if let Some(uri) = webview.uri() {
                address_bar_update.set_text(&uri);
                
                // Update state
                if let Ok(mut state) = state_update.lock() {
                    state.current_url = uri.to_string();
                }
            }
        });
    }
} 