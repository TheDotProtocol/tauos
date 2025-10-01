use gtk4 as gtk;
use gtk::prelude::*;

pub fn apply_explorer_theme() {
    let css_provider = gtk::CssProvider::new();
    
    let css = r#"
        /* Tau Explorer Theme */
        .explorer-sidebar {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            min-width: 200px;
            max-width: 250px;
        }
        
        .sidebar-icon {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            min-width: 24px;
        }
        
        .sidebar-label {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
        }
        
        listboxrow:hover {
            background: rgba(139, 92, 246, 0.2);
        }
        
        listboxrow:selected {
            background: rgba(139, 92, 246, 0.3);
        }
        
        .explorer-toolbar {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
        }
        
        .toolbar-button {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: white;
            padding: 8px;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        
        .toolbar-button:hover {
            background: rgba(139, 92, 246, 0.2);
            border-color: #8b5cf6;
            transform: translateY(-1px);
        }
        
        .toolbar-button:active {
            transform: translateY(0);
        }
        
        .explorer-path-bar {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            padding: 8px 12px;
            font-size: 14px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 8px 16px;
        }
        
        .explorer-path-bar:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }
        
        .explorer-path-bar::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
        
        .explorer-file-list {
            background: rgba(255, 255, 255, 0.02);
        }
        
        .explorer-file-list treeview {
            background: transparent;
            color: white;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .explorer-file-list treeview:selected {
            background: rgba(139, 92, 246, 0.3);
        }
        
        .explorer-file-list treeview:hover {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .explorer-status-bar {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
        }
        
        .status-label {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .cloud-status {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
            font-weight: 500;
            color: #10b981;
            background: rgba(16, 185, 129, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        /* Cloud integration styles */
        .cloud-status-connected {
            color: #10b981;
            font-weight: 600;
        }
        
        .cloud-sync-status {
            color: #10b981;
            font-weight: 500;
        }
        
        .cloud-storage-status {
            color: #8b5cf6;
            font-weight: 500;
        }
        
        .cloud-action-button {
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 6px;
            color: #8b5cf6;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .cloud-action-button:hover {
            background: rgba(139, 92, 246, 0.2);
            border-color: #8b5cf6;
            transform: translateY(-1px);
        }
        
        /* File property styles */
        .file-property-value {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
        }
        
        /* Search styles */
        .search-entry {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            padding: 8px 12px;
            font-size: 14px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .search-entry:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }
        
        .search-results {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            max-height: 200px;
        }
        
        .search-results listboxrow {
            padding: 8px 12px;
            color: white;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .search-results listboxrow:hover {
            background: rgba(139, 92, 246, 0.2);
        }
        
        .search-results listboxrow:selected {
            background: rgba(139, 92, 246, 0.3);
        }
        
        /* Context menu styles */
        .context-menu {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 4px 0;
        }
        
        .context-menu menuitem {
            padding: 8px 16px;
            color: white;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
        }
        
        .context-menu menuitem:hover {
            background: rgba(139, 92, 246, 0.2);
        }
        
        /* Progress bar for operations */
        .progress-bar {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-bar progress {
            background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
            border-radius: 4px;
        }
        
        /* Drag and drop styles */
        .drag-over {
            background: rgba(139, 92, 246, 0.2);
            border: 2px dashed #8b5cf6;
        }
        
        /* File type icons */
        .file-icon {
            font-size: 16px;
            margin-right: 8px;
        }
        
        .folder-icon {
            color: #8b5cf6;
        }
        
        .document-icon {
            color: #ef4444;
        }
        
        .image-icon {
            color: #10b981;
        }
        
        .video-icon {
            color: #f59e0b;
        }
        
        .audio-icon {
            color: #8b5cf6;
        }
        
        .archive-icon {
            color: #6366f1;
        }
    "#;
    
    css_provider.load_from_data(css.as_bytes());
    gtk::style_context_add_provider_for_display(
        &gtk::gdk::Display::default().expect("Could not connect to a display."),
        &css_provider,
        gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
    );
} 