use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Box, Button, Label, Orientation, Revealer};
use gtk::glib;

pub struct PrivacyIndicator {
    widget: Box,
    status_label: Label,
    encryption_badge: Label,
    tracking_protection: Label,
}

impl PrivacyIndicator {
    pub fn new() -> Self {
        let main_box = Box::new(Orientation::Horizontal, 8);
        main_box.add_css_class("privacy-indicator");
        main_box.set_halign(gtk::Align::Start);
        main_box.set_valign(gtk::Align::Start);
        main_box.set_margin_start(20);
        main_box.set_margin_top(20);

        // Encryption status
        let encryption_badge = Label::new(Some("🔒"));
        encryption_badge.add_css_class("encryption-badge");
        main_box.append(&encryption_badge);

        // Privacy status
        let status_label = Label::new(Some("Privacy Protected"));
        status_label.add_css_class("privacy-status");
        main_box.append(&status_label);

        // Tracking protection
        let tracking_protection = Label::new(Some("🛡️ No Tracking"));
        tracking_protection.add_css_class("tracking-protection");
        main_box.append(&tracking_protection);

        // Make it clickable for details
        let clickable_box = Button::new();
        clickable_box.set_child(Some(&main_box));
        clickable_box.add_css_class("privacy-button");

        // Connect click to show privacy details
        let status_clone = status_label.clone();
        clickable_box.connect_clicked(move |_| {
            Self::show_privacy_details(&status_clone);
        });

        let final_box = Box::new(Orientation::Vertical, 0);
        final_box.append(&clickable_box);

        Self {
            widget: final_box,
            status_label,
            encryption_badge,
            tracking_protection,
        }
    }

    fn show_privacy_details(status_label: &Label) {
        // TODO: Show detailed privacy information window
        println!("Showing privacy details");
        
        // Update status temporarily
        status_label.set_text(Some("🔒 All Systems Secure"));
        
        // Reset after 3 seconds
        let status_clone = status_label.clone();
        glib::timeout_add_local_once(std::time::Duration::from_secs(3), move || {
            status_clone.set_text(Some("Privacy Protected"));
        });
    }

    pub fn widget(&self) -> &Box {
        &self.widget
    }

    pub fn update_status(&self, status: &str) {
        self.status_label.set_text(Some(status));
    }

    pub fn set_encryption_status(&self, encrypted: bool) {
        if encrypted {
            self.encryption_badge.set_text(Some("🔒"));
        } else {
            self.encryption_badge.set_text(Some("⚠️"));
        }
    }

    pub fn set_tracking_protection(&self, protected: bool) {
        if protected {
            self.tracking_protection.set_text(Some("🛡️ No Tracking"));
        } else {
            self.tracking_protection.set_text(Some("⚠️ Tracking Detected"));
        }
    }
} 