use gtk4 as gtk;
use gtk::prelude::*;

pub fn apply_browser_theme() {
    let css_provider = gtk::CssProvider::new();
    
    let css = r#"
        /* Tau Browser Theme */
        .browser-title {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: #ffffff;
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            padding: 8px 16px;
            border-radius: 8px;
            margin: 4px;
        }
        
        .privacy-indicator {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
            font-weight: 500;
            color: #10b981;
            background: rgba(16, 185, 129, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .browser-toolbar {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
        }
        
        .nav-button {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: white;
            padding: 8px;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        
        .nav-button:hover {
            background: rgba(139, 92, 246, 0.2);
            border-color: #8b5cf6;
            transform: translateY(-1px);
        }
        
        .nav-button:active {
            transform: translateY(0);
        }
        
        .address-bar {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            padding: 8px 12px;
            font-size: 14px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .address-bar:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }
        
        .address-bar::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
        
        .privacy-button {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 6px;
            color: #10b981;
            padding: 8px 12px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.2s ease;
        }
        
        .privacy-button:hover {
            background: rgba(16, 185, 129, 0.2);
            border-color: #10b981;
            transform: translateY(-1px);
        }
        
        /* WebView styling */
        webview {
            background: #ffffff;
        }
        
        /* Header bar styling */
        headerbar {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        headerbar.titlebar {
            background: transparent;
        }
        
        /* Privacy features */
        .privacy-mode {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            color: #ef4444;
        }
        
        .privacy-mode .privacy-indicator {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
        }
        
        /* Loading indicator */
        .loading-indicator {
            background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 50%, #8b5cf6 100%);
            background-size: 200% 100%;
            animation: loading-shift 2s ease-in-out infinite;
        }
        
        @keyframes loading-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Security indicators */
        .secure-site {
            color: #10b981;
        }
        
        .insecure-site {
            color: #ef4444;
        }
        
        .mixed-content {
            color: #f59e0b;
        }
        
        /* Tab styling */
        .browser-tab {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px 6px 0 0;
            padding: 8px 16px;
            margin-right: 2px;
            color: white;
            font-size: 12px;
            transition: all 0.2s ease;
        }
        
        .browser-tab.active {
            background: rgba(139, 92, 246, 0.2);
            border-color: #8b5cf6;
        }
        
        .browser-tab:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        /* Bookmark bar */
        .bookmark-bar {
            background: rgba(26, 26, 26, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 4px 8px;
        }
        
        .bookmark-item {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            padding: 4px 8px;
            margin: 0 2px;
            color: white;
            font-size: 11px;
            transition: all 0.2s ease;
        }
        
        .bookmark-item:hover {
            background: rgba(139, 92, 246, 0.2);
            border-color: #8b5cf6;
        }
    "#;
    
    css_provider.load_from_data(css.as_bytes());
    gtk::style_context_add_provider_for_display(
        &gtk::gdk::Display::default().expect("Could not connect to a display."),
        &css_provider,
        gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
    );
} 