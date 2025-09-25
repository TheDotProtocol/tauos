use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{CssProvider, StyleContext};
use gtk::glib;

pub struct TauTheme {
    css_provider: CssProvider,
}

impl TauTheme {
    pub fn new() -> Self {
        let css_provider = CssProvider::new();
        
        // TauOS Design System CSS
        let css = r#"
        /* TauOS Color Palette */
        :root {
            --tau-black: #0a0a0a;
            --tau-dark-gray: #1a1a1a;
            --tau-gray: #2a2a2a;
            --tau-light-gray: #3a3a3a;
            --tau-white: #ffffff;
            --tau-purple: #8b5cf6;
            --tau-blue: #3b82f6;
            --tau-green: #10b981;
            --tau-red: #ef4444;
            --tau-yellow: #f59e0b;
        }

        /* Main Window */
        window {
            background-color: var(--tau-black);
            color: var(--tau-white);
        }

        /* Desktop Background */
        .desktop {
            background: linear-gradient(135deg, var(--tau-black) 0%, var(--tau-dark-gray) 100%);
            background-size: 400% 400%;
            animation: gradient-shift 15s ease infinite;
        }

        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Privacy Indicators */
        .privacy-indicator {
            background: linear-gradient(45deg, var(--tau-green), var(--tau-blue));
            border-radius: 8px;
            padding: 4px 8px;
            color: var(--tau-white);
            font-weight: bold;
            font-size: 12px;
        }

        .encryption-badge {
            background: var(--tau-green);
            border-radius: 50%;
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }

        /* App Launcher */
        .app-launcher {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 20px;
        }

        .app-button {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            transition: all 0.2s ease;
        }

        .app-button:hover {
            background: rgba(139, 92, 246, 0.2);
            border-color: var(--tau-purple);
            transform: translateY(-2px);
        }

        /* Dock */
        .dock {
            background: rgba(26, 26, 26, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px;
        }

        .dock-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 12px;
            margin: 0 4px;
            transition: all 0.2s ease;
        }

        .dock-item:hover {
            background: rgba(139, 92, 246, 0.3);
            transform: scale(1.1);
        }

        /* Status Bar */
        .status-bar {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
            transition: all 0.3s ease;
        }

        .status-bar-button {
            background: transparent;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .status-bar-button:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        /* Status bar revealer animation */
        .status-bar-revealer {
            transition: all 0.3s ease;
        }

        /* Wallpaper Controls */
        .wallpaper-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .wallpaper-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            color: var(--tau-white);
            padding: 4px 8px;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .wallpaper-btn:hover {
            background: rgba(139, 92, 246, 0.3);
            border-color: var(--tau-purple);
            transform: scale(1.05);
        }

        .wallpaper-label {
            color: var(--tau-white);
            font-size: 12px;
            font-weight: 500;
            min-width: 120px;
            text-align: center;
        }

        /* Desktop Widgets */
        .time-date-widget {
            background: rgba(26, 26, 26, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .time-label {
            color: var(--tau-white);
            font-size: 24px;
            font-weight: bold;
            text-align: center;
        }

        .date-label {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            text-align: center;
        }

        .location-widget {
            background: rgba(26, 26, 26, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .location-label {
            color: var(--tau-white);
            font-size: 16px;
            font-weight: 600;
            text-align: center;
        }

        .coordinates-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            text-align: center;
        }

        .weather-widget {
            background: rgba(26, 26, 26, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .temperature-label {
            color: var(--tau-white);
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }

        .condition-label {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            text-align: center;
        }

        .humidity-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
            text-align: center;
        }

        .privacy-status-widget {
            background: rgba(26, 26, 26, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .privacy-status-label {
            color: var(--tau-white);
            font-size: 14px;
            font-weight: 500;
            text-align: left;
        }

        .system-stats-widget {
            background: rgba(26, 26, 26, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .system-stats-label {
            color: var(--tau-white);
            font-size: 14px;
            font-weight: 500;
            text-align: left;
        }

        .quick-actions-widget {
            background: rgba(26, 26, 26, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .quick-action-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--tau-white);
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            margin-bottom: 8px;
        }

        .quick-action-btn:hover {
            background: rgba(139, 92, 246, 0.2);
            border-color: var(--tau-purple);
            transform: translateY(-1px);
        }

        /* Widget animations */
        .time-date-widget,
        .location-widget,
        .weather-widget,
        .privacy-status-widget,
        .system-stats-widget,
        .quick-actions-widget {
            animation: widgetFadeIn 0.5s ease-out;
        }

        @keyframes widgetFadeIn {
            from { 
                opacity: 0; 
                transform: translateY(20px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }

        /* Widget hover effects */
        .time-date-widget:hover,
        .location-widget:hover,
        .weather-widget:hover,
        .privacy-status-widget:hover,
        .system-stats-widget:hover,
        .quick-actions-widget:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
            transition: all 0.3s ease;
        }

        /* Buttons */
        .tau-button {
            background: linear-gradient(45deg, var(--tau-purple), var(--tau-blue));
            border: none;
            border-radius: 8px;
            color: var(--tau-white);
            padding: 12px 24px;
            font-weight: bold;
            transition: all 0.2s ease;
        }

        .tau-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        /* Animations */
        .fade-in {
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .slide-up {
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        "#;

        css_provider.load_from_data(css.as_bytes());
        
        Self { css_provider }
    }

    pub fn apply(&self) {
        let display = gtk::gdk::Display::default().unwrap();
        let screen = display.default_screen();
        StyleContext::add_provider_for_screen(
            &screen,
            &self.css_provider,
            gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
        );
    }
} 