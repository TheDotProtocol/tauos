use gtk4 as gtk;
use gtk::prelude::*;

pub fn apply_store_theme() {
    let css_provider = gtk::CssProvider::new();
    
    let css = r#"
        /* Tau Store Theme */
        .store-sidebar {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            min-width: 200px;
            max-width: 250px;
        }
        
        .category-icon {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            min-width: 24px;
        }
        
        .category-label {
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
        
        .store-header {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px;
        }
        
        .store-title {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header-button {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .header-button:hover {
            background: rgba(139, 92, 246, 0.2);
            border-color: #8b5cf6;
            transform: translateY(-1px);
        }
        
        .store-search-bar {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: white;
            padding: 12px 16px;
            font-size: 16px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 16px;
        }
        
        .store-search-bar:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }
        
        .store-search-bar::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
        
        .featured-section {
            padding: 16px;
        }
        
        .section-title {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 16px;
        }
        
        .featured-grid {
            background: transparent;
        }
        
        .featured-app-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
            margin: 8px;
            transition: all 0.3s ease;
            min-width: 200px;
            max-width: 250px;
        }
        
        .featured-app-card:hover {
            background: rgba(139, 92, 246, 0.1);
            border-color: #8b5cf6;
            transform: translateY(-4px);
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
        }
        
        .app-icon-large {
            font-size: 48px;
            margin-bottom: 12px;
            text-align: center;
        }
        
        .app-icon {
            font-size: 32px;
            margin-bottom: 8px;
            text-align: center;
        }
        
        .app-name {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
            margin-bottom: 4px;
        }
        
        .app-description {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            margin-bottom: 8px;
            line-height: 1.4;
        }
        
        .app-rating {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
            color: #fbbf24;
            text-align: center;
            margin-bottom: 8px;
        }
        
        .app-price {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #10b981;
            text-align: center;
            margin-bottom: 12px;
        }
        
        .install-button {
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            border: none;
            border-radius: 8px;
            color: white;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            width: 100%;
        }
        
        .install-button:hover {
            background: linear-gradient(135deg, #7c3aed 0%, #5855eb 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
        }
        
        .app-grid {
            background: transparent;
            padding: 16px;
        }
        
        .app-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            margin: 8px;
            transition: all 0.3s ease;
            min-width: 180px;
            max-width: 200px;
        }
        
        .app-card:hover {
            background: rgba(139, 92, 246, 0.1);
            border-color: #8b5cf6;
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
        }
        
        .download-section {
            padding: 16px;
            background: rgba(26, 26, 26, 0.5);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .download-list {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            max-height: 200px;
        }
        
        .download-list listboxrow {
            padding: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .download-list listboxrow:last-child {
            border-bottom: none;
        }
        
        .download-icon {
            font-size: 24px;
            color: rgba(255, 255, 255, 0.8);
            min-width: 32px;
        }
        
        .download-name {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
        }
        
        .download-status {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
            color: #10b981;
        }
        
        .download-progress {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .download-stat {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            background: rgba(255, 255, 255, 0.05);
            padding: 4px 8px;
            border-radius: 4px;
        }
        
        .download-action-button {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            color: white;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .download-action-button:hover {
            background: rgba(139, 92, 246, 0.2);
            border-color: #8b5cf6;
        }
        
        /* App details dialog */
        .app-detail-icon {
            font-size: 64px;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .app-detail-name {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
        }
        
        .app-detail-developer {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .app-detail-rating {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            color: #fbbf24;
        }
        
        .app-detail-description {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin: 16px 0;
        }
        
        .app-detail-info {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .cancel-button {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 6px;
            color: #ef4444;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .cancel-button:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: #ef4444;
        }
        
        /* Progress bars */
        .progress-bar {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            height: 6px;
            margin: 8px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .featured-app-card,
        .app-card {
            animation: fadeIn 0.5s ease-out;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .store-sidebar {
                min-width: 150px;
                max-width: 180px;
            }
            
            .featured-app-card,
            .app-card {
                min-width: 150px;
                max-width: 180px;
            }
        }
    "#;
    
    css_provider.load_from_data(css.as_bytes());
    gtk::style_context_add_provider_for_display(
        &gtk::gdk::Display::default().expect("Could not connect to a display."),
        &css_provider,
        gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
    );
} 