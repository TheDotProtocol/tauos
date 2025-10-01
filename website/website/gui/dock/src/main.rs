use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box as GtkBox, Button, Image, Label, Orientation, CssProvider, StyleContext, STYLE_PROVIDER_PRIORITY_APPLICATION, EventControllerMotion, GestureClick, gdk, gdk::Display, EventControllerKey, GestureDrag, DropDown, Popover, ListBox, ListBoxRow, Separator};
use gio::ApplicationFlags;
use std::cell::RefCell;
use std::rc::Rc;
use std::process::Command;

#[derive(Clone)]
struct AppInfo {
    name: &'static str,
    icon_path: &'static str,
    exec_path: &'static str,
    running: bool,
    pinned: bool,
}

fn get_pinned_apps() -> Vec<AppInfo> {
    vec![
        AppInfo { name: "Terminal", icon_path: "/gui/launcher/assets/terminal.png", exec_path: "/usr/bin/gnome-terminal", running: true, pinned: true },
        AppInfo { name: "Editor", icon_path: "/gui/launcher/assets/editor.png", exec_path: "/usr/bin/gedit", running: false, pinned: true },
        AppInfo { name: "Browser", icon_path: "/gui/launcher/assets/browser.png", exec_path: "/usr/bin/firefox", running: true, pinned: true },
        AppInfo { name: "Settings", icon_path: "/gui/launcher/assets/settings.png", exec_path: "/usr/bin/gnome-control-center", running: false, pinned: true },
    ]
}

fn get_running_apps() -> Vec<AppInfo> {
    vec![
        AppInfo { name: "File Manager", icon_path: "/gui/launcher/assets/file-manager.png", exec_path: "/usr/bin/nautilus", running: true, pinned: false },
        AppInfo { name: "Calculator", icon_path: "/gui/launcher/assets/calculator.png", exec_path: "/usr/bin/gnome-calculator", running: true, pinned: false },
    ]
}

fn main() {
    let app = Application::builder()
        .application_id("org.tauos.dock")
        .flags(ApplicationFlags::HANDLES_OPEN)
        .build();

    app.connect_activate(|app| {
        // Load Black & Gold theme CSS
        let provider = CssProvider::new();
        provider.load_from_data(include_bytes!("../taukit/theme.css")).unwrap();
        StyleContext::add_provider_for_display(
            &Display::default().unwrap(),
            &provider,
            STYLE_PROVIDER_PRIORITY_APPLICATION,
        );

        // Main window (auto-hide: initially hidden, show on hover)
        let window = ApplicationWindow::builder()
            .application(app)
            .title("Tau Dock")
            .default_width(600)
            .default_height(80)
            .resizable(false)
            .build();

        let hbox = GtkBox::new(Orientation::Horizontal, 16);
        hbox.set_margin_top(8);
        hbox.set_margin_bottom(8);
        hbox.set_margin_start(24);
        hbox.set_margin_end(24);

        let pinned_apps = Rc::new(RefCell::new(get_pinned_apps()));
        let running_apps = Rc::new(RefCell::new(get_running_apps()));

        // Create app buttons with enhanced functionality
        for (i, appinfo) in pinned_apps.borrow().iter().enumerate() {
            let app_button = create_app_button(appinfo, &window);
            hbox.append(&app_button);
            
            // Add separator after pinned apps
            if i == pinned_apps.borrow().len() - 1 {
                let separator = Separator::new(Orientation::Vertical);
                separator.set_margin_start(8);
                separator.set_margin_end(8);
                hbox.append(&separator);
            }
        }

        // Add running apps
        for appinfo in running_apps.borrow().iter() {
            let app_button = create_app_button(appinfo, &window);
            hbox.append(&app_button);
        }

        // Quick launch menu
        let quick_menu_button = Button::with_label("⟪");
        quick_menu_button.set_accessible_name(Some("Quick Launch Menu"));
        quick_menu_button.set_accessible_description(Some("Click to open quick launch menu"));
        
        let popover = Popover::new();
        popover.set_relative_to(Some(&quick_menu_button));
        
        let quick_menu = ListBox::new();
        let quick_apps = vec!["Terminal", "File Manager", "Settings", "Calculator"];
        for app_name in quick_apps {
            let row = ListBoxRow::new();
            let label = Label::new(Some(app_name));
            row.set_child(Some(&label));
            quick_menu.append(&row);
        }
        popover.set_child(Some(&quick_menu));
        quick_menu_button.set_popover(Some(&popover));
        
        hbox.append(&quick_menu_button);

        // Auto-hide functionality with improved behavior
        let dock_visible = Rc::new(RefCell::new(true));
        let hbox_clone = hbox.clone();
        let window_clone = window.clone();
        let motion = EventControllerMotion::new(&hbox);
        motion.connect_enter(move |_, _, _| {
            if !*dock_visible.borrow() {
                window_clone.show();
                *dock_visible.borrow_mut() = true;
            }
        });
        let hbox_clone2 = hbox.clone();
        let window_clone2 = window.clone();
        let motion2 = EventControllerMotion::new(&hbox_clone2);
        motion2.connect_leave(move |_, _, _| {
            if *dock_visible.borrow() {
                window_clone2.hide();
                *dock_visible.borrow_mut() = false;
            }
        });

        // Keyboard navigation
        let key_controller = EventControllerKey::new();
        key_controller.connect_key_pressed(move |_, key, _, _| {
            match key.keyval() {
                gdk::Key::Escape => {
                    window.hide();
                    gtk4::Inhibit(true)
                }
                _ => gtk4::Inhibit(false)
            }
        });
        window.add_controller(&key_controller);

        // Accessibility
        window.set_accessible_name(Some("Tau Dock"));
        window.set_accessible_description(Some("Application dock for quick access"));

        window.set_child(Some(&hbox));
        window.present();
    });

    app.run();
}

fn create_app_button(appinfo: &AppInfo, window: &ApplicationWindow) -> Button {
    let app_button = Button::new();
    
    let icon = Image::from_file(appinfo.icon_path);
    let label = Label::new(Some(appinfo.name));
    let app_box = GtkBox::new(Orientation::Vertical, 4);
    app_box.append(&icon);
    app_box.append(&label);
    
    // Running indicator
    if appinfo.running {
        let dot = Label::new(Some("●"));
        dot.set_css_classes(&["running-dot"]);
        app_box.append(&dot);
    }
    
    app_button.set_child(Some(&app_box));
    app_button.set_accessible_name(Some(&format!("Launch {}", appinfo.name)));
    app_button.set_accessible_description(Some(&format!("Click to launch {}", appinfo.name)));
    
    // Add click handler
    let appinfo_clone = appinfo.clone();
    let window_clone = window.clone();
    app_button.connect_clicked(move |_| {
        launch_app(&appinfo_clone, &window_clone);
    });
    
    // Add drag-and-drop support
    let app_button_clone = app_button.clone();
    let gesture = GestureDrag::new();
    gesture.connect_drag_begin(move |_, _, _| {
        app_button_clone.add_css_class("dragging");
    });
    gesture.connect_drag_end(move |_, _, _, _| {
        app_button_clone.remove_css_class("dragging");
    });
    app_button.add_controller(&gesture);
    
    // Add hover effects
    let app_button_hover = app_button.clone();
    let motion_controller = EventControllerMotion::new(&app_button);
    motion_controller.connect_enter(move |_, _, _| {
        app_button_hover.add_css_class("hover");
    });
    motion_controller.connect_leave(move |_, _, _| {
        app_button_hover.remove_css_class("hover");
    });
    app_button.add_controller(&motion_controller);
    
    app_button
}

fn launch_app(appinfo: &AppInfo, window: &ApplicationWindow) {
    match Command::new(appinfo.exec_path).spawn() {
        Ok(_) => {
            println!("Launched: {}", appinfo.name);
            // Could show a brief success notification
        }
        Err(e) => {
            // Show error dialog
            let dialog = gtk4::MessageDialog::builder()
                .transient_for(window)
                .modal(true)
                .message_type(gtk4::MessageType::Error)
                .text("Failed to launch application")
                .secondary_text(&format!("Could not launch {}: {}", appinfo.name, e))
                .build();
            dialog.connect_response(move |dialog, _| {
                dialog.close();
            });
            dialog.present();
        }
    }
} 