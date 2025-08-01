use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::Once;
use gtk4::prelude::*;
use gtk4::{CssProvider, StyleContext, STYLE_PROVIDER_PRIORITY_APPLICATION, gdk::Display};

static INIT: Once = Once::new();

/// Theme configuration structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemeConfig {
    pub theme: String,
    pub accent_color: String,
    pub background_color: String,
    pub text_color: String,
    pub animations_enabled: bool,
    pub high_contrast: bool,
    pub custom_css: Option<String>,
}

impl Default for ThemeConfig {
    fn default() -> Self {
        Self {
            theme: "black-gold".to_string(),
            accent_color: "#FFD700".to_string(),
            background_color: "#0a0a0a".to_string(),
            text_color: "#F5F5F5".to_string(),
            animations_enabled: true,
            high_contrast: false,
            custom_css: None,
        }
    }
}

/// Theme manager for TauOS
pub struct ThemeManager {
    config: ThemeConfig,
    provider: CssProvider,
    themes: HashMap<String, String>,
}

impl ThemeManager {
    /// Initialize the theme manager
    pub fn new() -> Self {
        let config = Self::load_config();
        let provider = CssProvider::new();
        let themes = Self::load_themes();
        
        Self {
            config,
            provider,
            themes,
        }
    }
    
    /// Load theme configuration from file
    fn load_config() -> ThemeConfig {
        let config_path = Self::get_config_path();
        
        if let Ok(contents) = fs::read_to_string(&config_path) {
            if let Ok(config) = serde_json::from_str(&contents) {
                return config;
            }
        }
        
        // Return default config if file doesn't exist or is invalid
        let default_config = ThemeConfig::default();
        Self::save_config(&default_config);
        default_config
    }
    
    /// Save theme configuration to file
    fn save_config(config: &ThemeConfig) {
        let config_path = Self::get_config_path();
        
        // Ensure directory exists
        if let Some(parent) = config_path.parent() {
            let _ = fs::create_dir_all(parent);
        }
        
        if let Ok(json) = serde_json::to_string_pretty(config) {
            let _ = fs::write(&config_path, json);
        }
    }
    
    /// Get the configuration file path
    fn get_config_path() -> std::path::PathBuf {
        let home = std::env::var("HOME").unwrap_or_else(|_| "/home/user".to_string());
        std::path::PathBuf::from(&home)
            .join(".config")
            .join("tauos")
            .join("ui")
            .join("theme.json")
    }
    
    /// Load available themes
    fn load_themes() -> HashMap<String, String> {
        let mut themes = HashMap::new();
        
        // Add built-in themes
        themes.insert("black-gold".to_string(), Self::get_black_gold_theme());
        themes.insert("dark-blue".to_string(), Self::get_dark_blue_theme());
        themes.insert("dark-green".to_string(), Self::get_dark_green_theme());
        themes.insert("high-contrast".to_string(), Self::get_high_contrast_theme());
        
        themes
    }
    
    /// Get the black-gold theme CSS
    fn get_black_gold_theme() -> String {
        include_str!("theme.css").to_string()
    }
    
    /// Get the dark blue theme CSS
    fn get_dark_blue_theme() -> String {
        r#"
        /* Dark Blue Theme */
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #E8F4FD;
          background-color: transparent;
        }
        
        window, .background {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        }
        
        .titlebar {
          background: linear-gradient(90deg, #1a1a2e 0%, #16213e 100%);
          border-bottom: 1px solid #0f3460;
          padding: 12px 20px;
          border-radius: 16px 16px 0 0;
        }
        
        .titlebar-title {
          color: #4ECDC4;
          font-weight: 600;
          font-size: 16px;
          text-shadow: 0 0 10px rgba(78, 205, 196, 0.3);
        }
        
        button, .button {
          background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
          color: #000;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        }
        
        button:hover, .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
          background: linear-gradient(135deg, #44A08D 0%, #4ECDC4 100%);
        }
        
        .shimmer {
          background: linear-gradient(90deg, 
            transparent, 
            rgba(78, 205, 196, 0.1), 
            rgba(78, 205, 196, 0.3), 
            rgba(78, 205, 196, 0.5), 
            rgba(78, 205, 196, 0.3), 
            rgba(78, 205, 196, 0.1), 
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes shimmer {
          0% { 
            background-position: -200% 0;
            filter: drop-shadow(0 0 20px rgba(78, 205, 196, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(78, 205, 196, 0.6));
          }
          100% { 
            background-position: 200% 0;
            filter: drop-shadow(0 0 20px rgba(78, 205, 196, 0.3));
          }
        }
        "#.to_string()
    }
    
    /// Get the dark green theme CSS
    fn get_dark_green_theme() -> String {
        r#"
        /* Dark Green Theme */
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #E8F5E8;
          background-color: transparent;
        }
        
        window, .background {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a2e1a 100%);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        }
        
        .titlebar {
          background: linear-gradient(90deg, #1a2e1a 0%, #2e4a2e 100%);
          border-bottom: 1px solid #2d5a2d;
          padding: 12px 20px;
          border-radius: 16px 16px 0 0;
        }
        
        .titlebar-title {
          color: #50C878;
          font-weight: 600;
          font-size: 16px;
          text-shadow: 0 0 10px rgba(80, 200, 120, 0.3);
        }
        
        button, .button {
          background: linear-gradient(135deg, #50C878 0%, #3CB371 100%);
          color: #000;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(80, 200, 120, 0.3);
        }
        
        button:hover, .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(80, 200, 120, 0.4);
          background: linear-gradient(135deg, #3CB371 0%, #50C878 100%);
        }
        
        .shimmer {
          background: linear-gradient(90deg, 
            transparent, 
            rgba(80, 200, 120, 0.1), 
            rgba(80, 200, 120, 0.3), 
            rgba(80, 200, 120, 0.5), 
            rgba(80, 200, 120, 0.3), 
            rgba(80, 200, 120, 0.1), 
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes shimmer {
          0% { 
            background-position: -200% 0;
            filter: drop-shadow(0 0 20px rgba(80, 200, 120, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(80, 200, 120, 0.6));
          }
          100% { 
            background-position: 200% 0;
            filter: drop-shadow(0 0 20px rgba(80, 200, 120, 0.3));
          }
        }
        "#.to_string()
    }
    
    /// Get the high contrast theme CSS
    fn get_high_contrast_theme() -> String {
        r#"
        /* High Contrast Theme */
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #FFFFFF;
          background-color: transparent;
        }
        
        window, .background {
          background: #000000;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.8);
        }
        
        .titlebar {
          background: #111111;
          border-bottom: 2px solid #FFD700;
          padding: 12px 20px;
          border-radius: 16px 16px 0 0;
        }
        
        .titlebar-title {
          color: #FFD700;
          font-weight: 700;
          font-size: 16px;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        button, .button {
          background: #FFD700;
          color: #000000;
          border: 2px solid #FFD700;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
        }
        
        button:hover, .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
          background: #FFED4E;
        }
        
        .shimmer {
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 215, 0, 0.2), 
            rgba(255, 215, 0, 0.5), 
            rgba(255, 215, 0, 0.8), 
            rgba(255, 215, 0, 0.5), 
            rgba(255, 215, 0, 0.2), 
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes shimmer {
          0% { 
            background-position: -200% 0;
            filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 35px rgba(255, 215, 0, 0.8));
          }
          100% { 
            background-position: 200% 0;
            filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.5));
          }
        }
        "#.to_string()
    }
    
    /// Apply the current theme
    pub fn apply_theme(&self) {
        INIT.call_once(|| {
            let css = self.get_current_theme_css();
            self.provider.load_from_data(css.as_bytes()).unwrap();
            
            StyleContext::add_provider_for_display(
                &Display::default().unwrap(),
                &self.provider,
                STYLE_PROVIDER_PRIORITY_APPLICATION,
            );
        });
    }
    
    /// Get the current theme CSS
    fn get_current_theme_css(&self) -> String {
        let base_css = self.themes.get(&self.config.theme)
            .unwrap_or_else(|| self.themes.get("black-gold").unwrap())
            .clone();
        
        // Apply custom CSS if provided
        if let Some(custom_css) = &self.config.custom_css {
            format!("{}\n\n/* Custom CSS */\n{}", base_css, custom_css)
        } else {
            base_css
        }
    }
    
    /// Change theme
    pub fn change_theme(&mut self, theme_name: &str) {
        self.config.theme = theme_name.to_string();
        Self::save_config(&self.config);
        self.apply_theme();
    }
    
    /// Update configuration
    pub fn update_config(&mut self, config: ThemeConfig) {
        self.config = config;
        Self::save_config(&self.config);
        self.apply_theme();
    }
    
    /// Get current configuration
    pub fn get_config(&self) -> &ThemeConfig {
        &self.config
    }
    
    /// Get available themes
    pub fn get_available_themes(&self) -> Vec<String> {
        self.themes.keys().cloned().collect()
    }
    
    /// Reload configuration from file
    pub fn reload_config(&mut self) {
        self.config = Self::load_config();
        self.apply_theme();
    }
}

/// Helper functions for theme management
pub mod helpers {
    use super::*;
    
    static mut THEME_MANAGER: Option<ThemeManager> = None;
    
    /// Initialize theme manager
    pub fn init_theme() {
        unsafe {
            THEME_MANAGER = Some(ThemeManager::new());
            if let Some(manager) = &mut THEME_MANAGER {
                manager.apply_theme();
            }
        }
    }
    
    /// Change theme
    pub fn change_theme(theme_name: &str) {
        unsafe {
            if let Some(manager) = &mut THEME_MANAGER {
                manager.change_theme(theme_name);
            }
        }
    }
    
    /// Get current configuration
    pub fn get_config() -> Option<ThemeConfig> {
        unsafe {
            THEME_MANAGER.as_ref().map(|manager| manager.get_config().clone())
        }
    }
    
    /// Update configuration
    pub fn update_config(config: ThemeConfig) {
        unsafe {
            if let Some(manager) = &mut THEME_MANAGER {
                manager.update_config(config);
            }
        }
    }
    
    /// Get available themes
    pub fn get_available_themes() -> Vec<String> {
        unsafe {
            THEME_MANAGER.as_ref()
                .map(|manager| manager.get_available_themes())
                .unwrap_or_default()
        }
    }
} 