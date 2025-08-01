use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{CssProvider, StyleContext};
use gtk::glib;

pub struct WallpaperManager {
    css_provider: CssProvider,
    current_wallpaper: usize,
}

impl WallpaperManager {
    pub fn new() -> Self {
        let css_provider = CssProvider::new();
        Self {
            css_provider,
            current_wallpaper: 0,
        }
    }

    pub fn get_wallpapers() -> Vec<(&'static str, &'static str)> {
        vec![
            ("Tau Turtle - Cosmic", "cosmic-turtle"),
            ("Tau Turtle - Ocean", "ocean-turtle"),
            ("Tau Turtle - Forest", "forest-turtle"),
            ("Tau Turtle - Galaxy", "galaxy-turtle"),
            ("Tau Turtle - Neon", "neon-turtle"),
            ("Tau Turtle - Minimal", "minimal-turtle"),
            ("Tau Turtle - Abstract", "abstract-turtle"),
            ("Tau Turtle - Geometric", "geometric-turtle"),
            ("Tau Turtle - Sunset", "sunset-turtle"),
            ("Tau Turtle - Cyber", "cyber-turtle"),
        ]
    }

    pub fn apply_wallpaper(&mut self, index: usize) {
        let wallpapers = Self::get_wallpapers();
        if index >= wallpapers.len() {
            return;
        }

        self.current_wallpaper = index;
        let (name, id) = wallpapers[index];
        
        let css = match id {
            "cosmic-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d1b69 100%);
                    background-image: 
                        radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.1)" font-size="8">🐢</text></svg>');
                    background-size: 400% 400%, 400% 400%, 200px 200px;
                    animation: gradient-shift 15s ease infinite;
                }
            "#,
            "ocean-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #0f172a 50%, #1e3a8a 100%);
                    background-image: 
                        radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.08)" font-size="8">🐢</text></svg>');
                    background-size: 400% 400%, 400% 400%, 150px 150px;
                    animation: gradient-shift 20s ease infinite;
                }
            "#,
            "forest-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #166534 100%);
                    background-image: 
                        radial-gradient(circle at 25% 75%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.06)" font-size="8">🐢</text></svg>');
                    background-size: 400% 400%, 400% 400%, 180px 180px;
                    animation: gradient-shift 18s ease infinite;
                }
            "#,
            "galaxy-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #581c87 100%);
                    background-image: 
                        radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.1)" font-size="8">🐢</text></svg>');
                    background-size: 400% 400%, 400% 400%, 120px 120px;
                    animation: gradient-shift 25s ease infinite;
                }
            "#,
            "neon-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #dc2626 100%);
                    background-image: 
                        radial-gradient(circle at 30% 70%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.2) 0%, transparent 50%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.12)" font-size="8">🐢</text></svg>');
                    background-size: 400% 400%, 400% 400%, 160px 160px;
                    animation: gradient-shift 12s ease infinite;
                }
            "#,
            "minimal-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                    background-image: 
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.05)" font-size="6">🐢</text></svg>');
                    background-size: 300px 300px;
                    animation: gradient-shift 30s ease infinite;
                }
            "#,
            "abstract-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #7c3aed 100%);
                    background-image: 
                        radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 60% 40%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.08)" font-size="8">🐢</text></svg>');
                    background-size: 400% 400%, 400% 400%, 140px 140px;
                    animation: gradient-shift 22s ease infinite;
                }
            "#,
            "geometric-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #059669 100%);
                    background-image: 
                        radial-gradient(circle at 25% 75%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 75% 25%, rgba(5, 150, 105, 0.2) 0%, transparent 50%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.07)" font-size="8">🐢</text></svg>');
                    background-size: 400% 400%, 400% 400%, 170px 170px;
                    animation: gradient-shift 16s ease infinite;
                }
            "#,
            "sunset-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #ea580c 100%);
                    background-image: 
                        radial-gradient(circle at 35% 65%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 65% 35%, rgba(239, 68, 68, 0.2) 0%, transparent 50%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.09)" font-size="8">🐢</text></svg>');
                    background-size: 400% 400%, 400% 400%, 130px 130px;
                    animation: gradient-shift 19s ease infinite;
                }
            "#,
            "cyber-turtle" => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0891b2 100%);
                    background-image: 
                        radial-gradient(circle at 30% 70%, rgba(8, 145, 178, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
                        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dy=".35em" fill="rgba(255,255,255,0.11)" font-size="8">🐢</text></svg>');
                    background-size: 400% 400%, 400% 400%, 110px 110px;
                    animation: gradient-shift 14s ease infinite;
                }
            "#,
            _ => r#"
                .desktop {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                    background-size: 400% 400%;
                    animation: gradient-shift 15s ease infinite;
                }
            "#,
        };

        self.css_provider.load_from_data(css.as_bytes());
        self.apply();
    }

    pub fn next_wallpaper(&mut self) {
        let wallpapers = Self::get_wallpapers();
        let next_index = (self.current_wallpaper + 1) % wallpapers.len();
        self.apply_wallpaper(next_index);
    }

    pub fn previous_wallpaper(&mut self) {
        let wallpapers = Self::get_wallpapers();
        let prev_index = if self.current_wallpaper == 0 {
            wallpapers.len() - 1
        } else {
            self.current_wallpaper - 1
        };
        self.apply_wallpaper(prev_index);
    }

    pub fn get_current_wallpaper_name(&self) -> &'static str {
        let wallpapers = Self::get_wallpapers();
        if self.current_wallpaper < wallpapers.len() {
            wallpapers[self.current_wallpaper].0
        } else {
            "Default"
        }
    }

    fn apply(&self) {
        let display = gtk::gdk::Display::default().unwrap();
        let screen = display.default_screen();
        StyleContext::add_provider_for_screen(
            &screen,
            &self.css_provider,
            gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
        );
    }
} 