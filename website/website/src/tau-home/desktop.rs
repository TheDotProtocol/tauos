use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Box, Button, Label, Orientation, Overlay, Revealer, Window};
use gtk::gdk;
use gtk::glib;

use crate::launcher::TauLauncher;
use crate::privacy_indicators::PrivacyIndicator;
use crate::theme::TauTheme;
use crate::wallpapers::WallpaperManager;
use crate::widgets::{
    TimeDateWidget, LocationWidget, WeatherWidget, 
    PrivacyStatusWidget, SystemStatsWidget, QuickActionsWidget
};

pub struct TauDesktop {
    main_box: Box,
    overlay: Overlay,
    launcher: TauLauncher,
    privacy_indicator: PrivacyIndicator,
    dock: Box,
    wallpaper_manager: WallpaperManager,
    time_date_widget: TimeDateWidget,
    location_widget: LocationWidget,
    weather_widget: WeatherWidget,
    privacy_status_widget: PrivacyStatusWidget,
    system_stats_widget: SystemStatsWidget,
    quick_actions_widget: QuickActionsWidget,
}

impl TauDesktop {
    pub fn new() -> Self {
        // Apply TauOS theme
        let theme = TauTheme::new();
        theme.apply();

        // Initialize wallpaper manager
        let mut wallpaper_manager = WallpaperManager::new();
        wallpaper_manager.apply_wallpaper(0); // Start with cosmic turtle

        // Create main container
        let main_box = Box::new(Orientation::Vertical, 0);
        main_box.add_css_class("desktop");

        // Create overlay for desktop elements
        let overlay = Overlay::new();
        main_box.append(&overlay);

        // Create privacy indicator
        let privacy_indicator = PrivacyIndicator::new();
        overlay.add_overlay(&privacy_indicator.widget());

        // Create app launcher
        let launcher = TauLauncher::new();
        overlay.add_overlay(&launcher.widget());

        // Create desktop widgets
        let time_date_widget = TimeDateWidget::new();
        overlay.add_overlay(&time_date_widget.widget());

        let location_widget = LocationWidget::new();
        overlay.add_overlay(&location_widget.widget());

        let weather_widget = WeatherWidget::new();
        overlay.add_overlay(&weather_widget.widget());

        let privacy_status_widget = PrivacyStatusWidget::new();
        overlay.add_overlay(&privacy_status_widget.widget());

        let system_stats_widget = SystemStatsWidget::new();
        overlay.add_overlay(&system_stats_widget.widget());

        let quick_actions_widget = QuickActionsWidget::new();
        overlay.add_overlay(&quick_actions_widget.widget());

        // Create dock
        let dock = Self::create_dock();
        main_box.append(&dock);

        // Create status bar
        let status_bar = Self::create_status_bar(&mut wallpaper_manager);
        main_box.append(&status_bar);

        Self {
            main_box,
            overlay,
            launcher,
            privacy_indicator,
            dock,
            wallpaper_manager,
            time_date_widget,
            location_widget,
            weather_widget,
            privacy_status_widget,
            system_stats_widget,
            quick_actions_widget,
        }
    }

    fn create_dock() -> Box {
        let dock = Box::new(Orientation::Horizontal, 8);
        dock.add_css_class("dock");
        dock.set_halign(gtk::Align::Center);
        dock.set_valign(gtk::Align::End);
        dock.set_margin_bottom(20);

        // Dock items
        let apps = vec![
            ("Tau Browser", "🌐", "browser"),
            ("Tau Mail", "📧", "mail"),
            ("Tau Cloud", "☁️", "cloud"),
            ("Tau Explorer", "📁", "explorer"),
            ("Tau Store", "🛒", "store"),
            ("Tau Settings", "⚙️", "settings"),
        ];

        for (name, icon, app_id) in apps {
            let dock_item = Self::create_dock_item(name, icon, app_id);
            dock.append(&dock_item);
        }

        dock
    }

    fn create_dock_item(name: &str, icon: &str, app_id: &str) -> Button {
        let button = Button::new();
        button.add_css_class("dock-item");
        
        let label = Label::new(Some(icon));
        label.set_css_classes(&["dock-icon"]);
        button.set_child(Some(&label));

        // Add tooltip
        button.set_tooltip_text(Some(name));

        // Connect click signal
        let app_id = app_id.to_string();
        button.connect_clicked(move |_| {
            println!("Launching {}", app_id);
            // TODO: Launch application
        });

        button
    }

    fn create_status_bar(wallpaper_manager: &mut WallpaperManager) -> Box {
        let status_bar = Box::new(Orientation::Horizontal, 0);
        status_bar.add_css_class("status-bar");

        // Left side - Privacy status
        let privacy_status = Label::new(Some("🔒 Privacy Protected"));
        privacy_status.add_css_class("privacy-indicator");
        status_bar.append(&privacy_status);

        // Center - System info and wallpaper controls
        let center_box = Box::new(Orientation::Horizontal, 16);
        
        let system_info = Label::new(Some("TauOS v1.0 • Privacy First"));
        system_info.add_css_class("system-info");
        center_box.append(&system_info);

        // Wallpaper controls
        let wallpaper_controls = Self::create_wallpaper_controls(wallpaper_manager);
        center_box.append(&wallpaper_controls);
        
        status_bar.append(&center_box);

        // Right side - Time and system status
        let time_label = Label::new(Some("14:30"));
        time_label.add_css_class("time-label");
        status_bar.append(&time_label);

        // Make status bar clickable to hide/show
        let status_button = Button::new();
        status_button.set_child(Some(&status_bar));
        status_button.add_css_class("status-bar-button");

        // Create revealer for hide/show functionality
        let revealer = Revealer::new();
        revealer.set_child(Some(&status_button));
        revealer.set_reveal_child(true);

        // Connect click to toggle visibility
        let revealer_clone = revealer.clone();
        status_button.connect_clicked(move |_| {
            let is_visible = revealer_clone.reveals_child();
            revealer_clone.set_reveal_child(!is_visible);
        });

        // Create container for the revealer
        let status_container = Box::new(Orientation::Vertical, 0);
        status_container.append(&revealer);

        status_container
    }

    fn create_wallpaper_controls(wallpaper_manager: &mut WallpaperManager) -> Box {
        let controls_box = Box::new(Orientation::Horizontal, 8);
        controls_box.add_css_class("wallpaper-controls");

        // Previous wallpaper button
        let prev_button = Button::new();
        prev_button.set_label("◀");
        prev_button.add_css_class("wallpaper-btn");
        prev_button.set_tooltip_text(Some("Previous Wallpaper"));
        
        prev_button.connect_clicked(move |_| {
            println!("Previous wallpaper clicked");
            // TODO: Implement wallpaper change
        });
        controls_box.append(&prev_button);

        // Current wallpaper label
        let wallpaper_label = Label::new(Some(wallpaper_manager.get_current_wallpaper_name()));
        wallpaper_label.add_css_class("wallpaper-label");
        controls_box.append(&wallpaper_label);

        // Next wallpaper button
        let next_button = Button::new();
        next_button.set_label("▶");
        next_button.add_css_class("wallpaper-btn");
        next_button.set_tooltip_text(Some("Next Wallpaper"));
        
        next_button.connect_clicked(move |_| {
            println!("Next wallpaper clicked");
            // TODO: Implement wallpaper change
        });
        controls_box.append(&next_button);

        controls_box
    }

    pub fn widget(&self) -> &Box {
        &self.main_box
    }
} 