use gtk::prelude::*;
use gtk::{Box, Button, Label, Orientation, ListBox, ScrolledWindow};
use adw::ApplicationWindow;
use anyhow::Result;
use log::{info, error};

use crate::ui::{EmailList, EmailViewer, ComposeDialog};
use crate::email::{EmailClient, EmailAccount};
use crate::config::Config;
use crate::database::Database;

pub struct TauMailApp {
    window: ApplicationWindow,
    email_client: EmailClient,
    database: Database,
    config: Config,
    
    // UI Components
    email_list: EmailList,
    email_viewer: EmailViewer,
    compose_dialog: Option<ComposeDialog>,
}

impl TauMailApp {
    pub fn new(window: &ApplicationWindow) -> Self {
        let config = Config::load().unwrap_or_default();
        let database = Database::new(&config.database_path).unwrap_or_else(|_| {
            error!("Failed to initialize database");
            Database::new(":memory:").unwrap()
        });
        
        let email_client = EmailClient::new(&config);
        
        Self {
            window: window.clone(),
            email_client,
            database,
            config,
            email_list: EmailList::new(),
            email_viewer: EmailViewer::new(),
            compose_dialog: None,
        }
    }

    pub fn setup_ui(&self) {
        // Create main layout
        let main_box = Box::new(Orientation::Horizontal, 0);
        
        // Create sidebar
        let sidebar = self.create_sidebar();
        main_box.append(&sidebar);
        
        // Create email list
        let email_list_container = ScrolledWindow::new();
        email_list_container.set_child(Some(&self.email_list.widget()));
        main_box.append(&email_list_container);
        
        // Create email viewer
        let email_viewer_container = ScrolledWindow::new();
        email_viewer_container.set_child(Some(&self.email_viewer.widget()));
        main_box.append(&email_viewer_container);
        
        // Set up main window
        self.window.set_child(Some(&main_box));
        
        // Connect signals
        self.connect_signals();
        
        // Load initial emails
        self.load_emails();
    }

    fn create_sidebar(&self) -> Box {
        let sidebar = Box::new(Orientation::Vertical, 0);
        sidebar.add_css_class("sidebar");
        
        // Compose button
        let compose_button = Button::with_label("Compose");
        compose_button.add_css_class("suggested-action");
        compose_button.connect_clicked(clone!(@weak self as app => move |_| {
            app.show_compose_dialog();
        }));
        sidebar.append(&compose_button);
        
        // Folder list
        let folder_list = ListBox::new();
        folder_list.add_css_class("navigation-sidebar");
        
        let folders = vec!["Inbox", "Sent", "Drafts", "Spam", "Trash"];
        for folder in folders {
            let row = gtk::ListBoxRow::new();
            let label = Label::new(Some(folder));
            row.set_child(Some(&label));
            folder_list.append(&row);
        }
        
        sidebar.append(&folder_list);
        
        sidebar
    }

    fn connect_signals(&self) {
        // Connect email selection
        self.email_list.connect_email_selected(clone!(@weak self as app => move |email| {
            app.show_email(email);
        }));
        
        // Connect compose dialog
        self.email_viewer.connect_reply(clone!(@weak self as app => move |email| {
            app.show_compose_dialog_with_reply(email);
        }));
    }

    fn load_emails(&self) {
        // Load emails from database and IMAP
        match self.email_client.fetch_emails("INBOX") {
            Ok(emails) => {
                self.email_list.set_emails(emails);
                info!("Loaded {} emails", emails.len());
            }
            Err(e) => {
                error!("Failed to load emails: {}", e);
            }
        }
    }

    fn show_email(&self, email: crate::email::Email) {
        self.email_viewer.set_email(email);
    }

    fn show_compose_dialog(&self) {
        let dialog = ComposeDialog::new(&self.window);
        dialog.connect_send(clone!(@weak self as app => move |email_data| {
            app.send_email(email_data);
        }));
        
        dialog.present();
    }

    fn show_compose_dialog_with_reply(&self, email: crate::email::Email) {
        let dialog = ComposeDialog::new_with_reply(&self.window, email);
        dialog.connect_send(clone!(@weak self as app => move |email_data| {
            app.send_email(email_data);
        }));
        
        dialog.present();
    }

    fn send_email(&self, email_data: crate::email::EmailData) {
        match self.email_client.send_email(email_data) {
            Ok(_) => {
                info!("Email sent successfully");
                // Refresh email list
                self.load_emails();
            }
            Err(e) => {
                error!("Failed to send email: {}", e);
            }
        }
    }
}

impl Clone for TauMailApp {
    fn clone(&self) -> Self {
        Self {
            window: self.window.clone(),
            email_client: self.email_client.clone(),
            database: self.database.clone(),
            config: self.config.clone(),
            email_list: self.email_list.clone(),
            email_viewer: self.email_viewer.clone(),
            compose_dialog: self.compose_dialog.clone(),
        }
    }
} 