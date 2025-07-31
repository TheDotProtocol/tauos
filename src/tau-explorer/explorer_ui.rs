use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Box, Button, Entry, HeaderBar, Orientation, ScrolledWindow, Label, ListBox, ListBoxRow, TreeView, TreeStore, TreeViewColumn, CellRendererText, CellRendererPixbuf};
use std::sync::{Arc, Mutex};
use std::path::PathBuf;

pub struct TauExplorer {
    pub widget: Box,
    sidebar: ListBox,
    file_list: TreeView,
    path_bar: Entry,
    toolbar: Box,
    cloud_status: Label,
    current_path: Arc<Mutex<PathBuf>>,
}

#[derive(Clone)]
struct FileItem {
    name: String,
    path: PathBuf,
    is_directory: bool,
    size: u64,
    modified: String,
    icon: String,
}

impl TauExplorer {
    pub fn new() -> Self {
        // Create main container
        let main_box = Box::new(Orientation::Horizontal, 0);
        
        // Create sidebar
        let sidebar = Self::create_sidebar();
        main_box.append(&sidebar);
        
        // Create main content area
        let content_area = Box::new(Orientation::Vertical, 0);
        
        // Create toolbar
        let toolbar = Self::create_toolbar();
        content_area.append(&toolbar);
        
        // Create path bar
        let path_bar = Self::create_path_bar();
        content_area.append(&path_bar);
        
        // Create file list
        let file_list = Self::create_file_list();
        content_area.append(&file_list);
        
        // Create status bar
        let status_bar = Self::create_status_bar();
        content_area.append(&status_bar);
        
        main_box.append(&content_area);
        
        // Initialize state
        let current_path = Arc::new(Mutex::new(PathBuf::from("/")));
        
        // Load initial directory
        Self::load_directory(&file_list, &current_path);
        
        Self {
            widget: main_box,
            sidebar,
            file_list,
            path_bar,
            toolbar,
            cloud_status: Label::new(Some("☁️ TauCloud Connected")),
            current_path,
        }
    }
    
    fn create_sidebar() -> ListBox {
        let sidebar = ListBox::new();
        sidebar.add_css_class("explorer-sidebar");
        
        // Add sidebar items
        let items = vec![
            ("🏠 Home", "/home"),
            ("📁 Documents", "/home/documents"),
            ("🖼️ Pictures", "/home/pictures"),
            ("🎵 Music", "/home/music"),
            ("📹 Videos", "/home/videos"),
            ("☁️ TauCloud", "/taucloud"),
            ("🗑️ Trash", "/trash"),
        ];
        
        for (name, path) in items {
            let row = Self::create_sidebar_item(name, path);
            sidebar.append(&row);
        }
        
        sidebar
    }
    
    fn create_sidebar_item(name: &str, path: &str) -> ListBoxRow {
        let row = ListBoxRow::new();
        let box_widget = Box::new(Orientation::Horizontal, 8);
        
        let icon = Label::new(Some(&name[..4])); // First 4 chars (emoji)
        icon.add_css_class("sidebar-icon");
        
        let label = Label::new(Some(&name[4..])); // Rest of the name
        label.add_css_class("sidebar-label");
        
        box_widget.append(&icon);
        box_widget.append(&label);
        row.set_child(Some(&box_widget));
        
        row
    }
    
    fn create_toolbar() -> Box {
        let toolbar = Box::new(Orientation::Horizontal, 8);
        toolbar.add_css_class("explorer-toolbar");
        
        // Navigation buttons
        let back_button = Button::new();
        back_button.set_icon_name(Some("go-previous-symbolic"));
        back_button.set_tooltip_text(Some("Go Back"));
        back_button.add_css_class("toolbar-button");
        toolbar.append(&back_button);
        
        let forward_button = Button::new();
        forward_button.set_icon_name(Some("go-next-symbolic"));
        forward_button.set_tooltip_text(Some("Go Forward"));
        forward_button.add_css_class("toolbar-button");
        toolbar.append(&forward_button);
        
        let up_button = Button::new();
        up_button.set_icon_name(Some("go-up-symbolic"));
        up_button.set_tooltip_text(Some("Go Up"));
        up_button.add_css_class("toolbar-button");
        toolbar.append(&up_button);
        
        // Separator
        let separator = gtk::Separator::new(gtk::Orientation::Vertical);
        toolbar.append(&separator);
        
        // Action buttons
        let new_folder_button = Button::new();
        new_folder_button.set_icon_name(Some("folder-new-symbolic"));
        new_folder_button.set_tooltip_text(Some("New Folder"));
        new_folder_button.add_css_class("toolbar-button");
        toolbar.append(&new_folder_button);
        
        let upload_button = Button::new();
        upload_button.set_icon_name(Some("upload-symbolic"));
        upload_button.set_tooltip_text(Some("Upload to TauCloud"));
        upload_button.add_css_class("toolbar-button");
        toolbar.append(&upload_button);
        
        let sync_button = Button::new();
        sync_button.set_icon_name(Some("sync-symbolic"));
        sync_button.set_tooltip_text(Some("Sync with TauCloud"));
        sync_button.add_css_class("toolbar-button");
        toolbar.append(&sync_button);
        
        // View mode buttons
        let list_view_button = Button::new();
        list_view_button.set_icon_name(Some("view-list-symbolic"));
        list_view_button.set_tooltip_text(Some("List View"));
        list_view_button.add_css_class("toolbar-button");
        toolbar.append(&list_view_button);
        
        let grid_view_button = Button::new();
        grid_view_button.set_icon_name(Some("view-grid-symbolic"));
        grid_view_button.set_tooltip_text(Some("Grid View"));
        grid_view_button.add_css_class("toolbar-button");
        toolbar.append(&grid_view_button);
        
        toolbar
    }
    
    fn create_path_bar() -> Entry {
        let path_bar = Entry::new();
        path_bar.set_placeholder_text(Some("Path..."));
        path_bar.add_css_class("explorer-path-bar");
        path_bar
    }
    
    fn create_file_list() -> TreeView {
        let tree_store = TreeStore::new(&[
            gtk::glib::Type::STRING, // Name
            gtk::glib::Type::STRING, // Size
            gtk::glib::Type::STRING, // Modified
            gtk::glib::Type::STRING, // Type
        ]);
        
        let tree_view = TreeView::new();
        tree_view.set_model(Some(&tree_store));
        tree_view.add_css_class("explorer-file-list");
        
        // Create columns
        let name_column = TreeViewColumn::new();
        name_column.set_title("Name");
        name_column.set_expand(true);
        
        let name_renderer = CellRendererText::new();
        name_column.pack_start(&name_renderer, true);
        name_column.add_attribute(&name_renderer, "text", 0);
        
        let size_column = TreeViewColumn::new();
        size_column.set_title("Size");
        size_column.set_fixed_width(100);
        
        let size_renderer = CellRendererText::new();
        size_column.pack_start(&size_renderer, false);
        size_column.add_attribute(&size_renderer, "text", 1);
        
        let modified_column = TreeViewColumn::new();
        modified_column.set_title("Modified");
        modified_column.set_fixed_width(150);
        
        let modified_renderer = CellRendererText::new();
        modified_column.pack_start(&modified_renderer, false);
        modified_column.add_attribute(&modified_renderer, "text", 2);
        
        let type_column = TreeViewColumn::new();
        type_column.set_title("Type");
        type_column.set_fixed_width(100);
        
        let type_renderer = CellRendererText::new();
        type_column.pack_start(&type_renderer, false);
        type_column.add_attribute(&type_renderer, "text", 3);
        
        tree_view.append_column(&name_column);
        tree_view.append_column(&size_column);
        tree_view.append_column(&modified_column);
        tree_view.append_column(&type_column);
        
        tree_view
    }
    
    fn create_status_bar() -> Box {
        let status_bar = Box::new(Orientation::Horizontal, 16);
        status_bar.add_css_class("explorer-status-bar");
        
        let items_label = Label::new(Some("0 items"));
        items_label.add_css_class("status-label");
        status_bar.append(&items_label);
        
        let size_label = Label::new(Some("0 bytes"));
        size_label.add_css_class("status-label");
        status_bar.append(&size_label);
        
        // Add cloud status
        let cloud_status = Label::new(Some("☁️ TauCloud Connected"));
        cloud_status.add_css_class("cloud-status");
        status_bar.append(&cloud_status);
        
        status_bar
    }
    
    fn load_directory(tree_view: &TreeView, current_path: &Arc<Mutex<PathBuf>>) {
        // Clear existing items
        if let Some(model) = tree_view.model() {
            model.clear();
            
            // Add sample files and folders
            let sample_items = vec![
                ("📁 Documents", "0", "Today", "Folder"),
                ("📄 report.pdf", "2.5 MB", "Yesterday", "PDF"),
                ("🖼️ photo.jpg", "1.2 MB", "2 days ago", "Image"),
                ("📁 Pictures", "0", "3 days ago", "Folder"),
                ("🎵 song.mp3", "5.8 MB", "1 week ago", "Audio"),
                ("📹 video.mp4", "15.2 MB", "2 weeks ago", "Video"),
                ("📄 document.txt", "1 KB", "1 month ago", "Text"),
            ];
            
            for (name, size, modified, file_type) in sample_items {
                let iter = model.append(None);
                model.set_value(&iter, 0, &name.to_value());
                model.set_value(&iter, 1, &size.to_value());
                model.set_value(&iter, 2, &modified.to_value());
                model.set_value(&iter, 3, &file_type.to_value());
            }
        }
    }
} 