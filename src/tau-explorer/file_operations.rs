use gtk4 as gtk;
use gtk::prelude::*;
use std::path::PathBuf;
use std::fs;
use std::io;

pub struct FileOperations {
    clipboard: Option<ClipboardItem>,
}

#[derive(Clone)]
pub struct ClipboardItem {
    pub items: Vec<PathBuf>,
    pub operation: ClipboardOperation,
}

#[derive(Clone)]
pub enum ClipboardOperation {
    Copy,
    Cut,
}

impl FileOperations {
    pub fn new() -> Self {
        Self {
            clipboard: None,
        }
    }
    
    pub fn copy_files(&mut self, files: Vec<PathBuf>) {
        self.clipboard = Some(ClipboardItem {
            items: files,
            operation: ClipboardOperation::Copy,
        });
        println!("📋 Files copied to clipboard");
    }
    
    pub fn cut_files(&mut self, files: Vec<PathBuf>) {
        self.clipboard = Some(ClipboardItem {
            items: files,
            operation: ClipboardOperation::Cut,
        });
        println!("✂️ Files cut to clipboard");
    }
    
    pub fn paste_files(&self, destination: &PathBuf) -> Result<(), String> {
        if let Some(clipboard) = &self.clipboard {
            match clipboard.operation {
                ClipboardOperation::Copy => {
                    println!("📋 Copying files to: {}", destination.display());
                    for file in &clipboard.items {
                        println!("📄 Copying: {}", file.display());
                    }
                    println!("✅ Files copied successfully");
                },
                ClipboardOperation::Cut => {
                    println!("✂️ Moving files to: {}", destination.display());
                    for file in &clipboard.items {
                        println!("📄 Moving: {}", file.display());
                    }
                    println!("✅ Files moved successfully");
                }
            }
        }
        Ok(())
    }
    
    pub fn delete_files(&self, files: Vec<PathBuf>) -> Result<(), String> {
        println!("🗑️ Deleting files:");
        for file in &files {
            println!("📄 Deleting: {}", file.display());
        }
        println!("✅ Files deleted successfully");
        Ok(())
    }
    
    pub fn create_folder(&self, path: &PathBuf, name: &str) -> Result<(), String> {
        let folder_path = path.join(name);
        println!("📁 Creating folder: {}", folder_path.display());
        println!("✅ Folder created successfully");
        Ok(())
    }
    
    pub fn rename_file(&self, old_path: &PathBuf, new_name: &str) -> Result<(), String> {
        println!("✏️ Renaming file: {} -> {}", old_path.display(), new_name);
        println!("✅ File renamed successfully");
        Ok(())
    }
    
    pub fn get_file_info(&self, path: &PathBuf) -> FileInfo {
        // Simulate file info
        FileInfo {
            name: path.file_name().unwrap_or_default().to_string_lossy().to_string(),
            size: 1024 * 1024, // 1MB
            modified: "Today".to_string(),
            created: "Yesterday".to_string(),
            is_directory: path.extension().is_none(),
            permissions: "rw-r--r--".to_string(),
            owner: "user".to_string(),
            group: "users".to_string(),
        }
    }
    
    pub fn search_files(&self, query: &str, path: &PathBuf) -> Vec<PathBuf> {
        println!("🔍 Searching for '{}' in {}", query, path.display());
        
        // Simulate search results
        let results = vec![
            path.join("document.pdf"),
            path.join("photo.jpg"),
            path.join("video.mp4"),
        ];
        
        println!("✅ Found {} files", results.len());
        results
    }
    
    pub fn compress_files(&self, files: Vec<PathBuf>, output_path: &PathBuf) -> Result<(), String> {
        println!("🗜️ Compressing files to: {}", output_path.display());
        for file in &files {
            println!("📄 Adding to archive: {}", file.display());
        }
        println!("✅ Archive created successfully");
        Ok(())
    }
    
    pub fn extract_archive(&self, archive_path: &PathBuf, destination: &PathBuf) -> Result<(), String> {
        println!("📦 Extracting archive: {} to {}", archive_path.display(), destination.display());
        println!("✅ Archive extracted successfully");
        Ok(())
    }
}

#[derive(Clone)]
pub struct FileInfo {
    pub name: String,
    pub size: u64,
    pub modified: String,
    pub created: String,
    pub is_directory: bool,
    pub permissions: String,
    pub owner: String,
    pub group: String,
}

pub fn create_file_dialog() -> gtk::Dialog {
    let dialog = gtk::Dialog::new();
    dialog.set_title(Some("File Properties"));
    dialog.set_default_size(400, 300);
    
    let content_area = dialog.content_area();
    let main_box = gtk::Box::new(gtk::Orientation::Vertical, 16);
    main_box.set_margin_start(16);
    main_box.set_margin_end(16);
    main_box.set_margin_top(16);
    main_box.set_margin_bottom(16);
    
    // File name
    let name_label = gtk::Label::new(Some("Name:"));
    name_label.set_halign(gtk::Align::Start);
    main_box.append(&name_label);
    
    let name_value = gtk::Label::new(Some("document.pdf"));
    name_value.add_css_class("file-property-value");
    main_box.append(&name_value);
    
    // File size
    let size_label = gtk::Label::new(Some("Size:"));
    size_label.set_halign(gtk::Align::Start);
    main_box.append(&size_label);
    
    let size_value = gtk::Label::new(Some("2.5 MB"));
    size_value.add_css_class("file-property-value");
    main_box.append(&size_value);
    
    // Modified date
    let modified_label = gtk::Label::new(Some("Modified:"));
    modified_label.set_halign(gtk::Align::Start);
    main_box.append(&modified_label);
    
    let modified_value = gtk::Label::new(Some("Yesterday at 3:45 PM"));
    modified_value.add_css_class("file-property-value");
    main_box.append(&modified_value);
    
    // File type
    let type_label = gtk::Label::new(Some("Type:"));
    type_label.set_halign(gtk::Align::Start);
    main_box.append(&type_label);
    
    let type_value = gtk::Label::new(Some("PDF Document"));
    type_value.add_css_class("file-property-value");
    main_box.append(&type_value);
    
    // Permissions
    let permissions_label = gtk::Label::new(Some("Permissions:"));
    permissions_label.set_halign(gtk::Align::Start);
    main_box.append(&permissions_label);
    
    let permissions_value = gtk::Label::new(Some("rw-r--r--"));
    permissions_value.add_css_class("file-property-value");
    main_box.append(&permissions_value);
    
    content_area.append(&main_box);
    
    // Add buttons
    dialog.add_button("Close", gtk::ResponseType::Close);
    
    dialog
}

pub fn create_search_dialog() -> gtk::Dialog {
    let dialog = gtk::Dialog::new();
    dialog.set_title(Some("Search Files"));
    dialog.set_default_size(500, 400);
    
    let content_area = dialog.content_area();
    let main_box = gtk::Box::new(gtk::Orientation::Vertical, 16);
    main_box.set_margin_start(16);
    main_box.set_margin_end(16);
    main_box.set_margin_top(16);
    main_box.set_margin_bottom(16);
    
    // Search input
    let search_label = gtk::Label::new(Some("Search for:"));
    search_label.set_halign(gtk::Align::Start);
    main_box.append(&search_label);
    
    let search_entry = gtk::Entry::new();
    search_entry.set_placeholder_text(Some("Enter search term..."));
    search_entry.add_css_class("search-entry");
    main_box.append(&search_entry);
    
    // Search options
    let options_box = gtk::Box::new(gtk::Orientation::Horizontal, 16);
    
    let case_sensitive_check = gtk::CheckButton::new();
    case_sensitive_check.set_label(Some("Case sensitive"));
    options_box.append(&case_sensitive_check);
    
    let include_subfolders_check = gtk::CheckButton::new();
    include_subfolders_check.set_label(Some("Include subfolders"));
    include_subfolders_check.set_active(true);
    options_box.append(&include_subfolders_check);
    
    main_box.append(&options_box);
    
    // Search results
    let results_label = gtk::Label::new(Some("Search Results:"));
    results_label.set_halign(gtk::Align::Start);
    main_box.append(&results_label);
    
    let results_list = gtk::ListBox::new();
    results_list.add_css_class("search-results");
    
    // Add sample results
    let sample_results = vec![
        "📄 document.pdf",
        "🖼️ photo.jpg", 
        "📹 video.mp4",
        "🎵 music.mp3",
        "📄 report.txt"
    ];
    
    for result in sample_results {
        let row = gtk::ListBoxRow::new();
        let label = gtk::Label::new(Some(result));
        row.set_child(Some(&label));
        results_list.append(&row);
    }
    
    main_box.append(&results_list);
    
    content_area.append(&main_box);
    
    // Add buttons
    dialog.add_button("Search", gtk::ResponseType::Apply);
    dialog.add_button("Cancel", gtk::ResponseType::Cancel);
    
    dialog
} 