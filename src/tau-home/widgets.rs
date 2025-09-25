use gtk4 as gtk;
use gtk::prelude::*;
use gtk::{Box, Button, Label, Orientation, Revealer, ScrolledWindow};
use gtk::glib;
use std::time::{SystemTime, UNIX_EPOCH};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

pub struct TimeDateWidget {
    widget: Box,
    time_label: Label,
    date_label: Label,
}

impl TimeDateWidget {
    pub fn new() -> Self {
        let main_box = Box::new(Orientation::Vertical, 4);
        main_box.add_css_class("time-date-widget");
        main_box.set_halign(gtk::Align::End);
        main_box.set_valign(gtk::Align::Start);
        main_box.set_margin_end(20);
        main_box.set_margin_top(20);

        // Time label
        let time_label = Label::new(Some("14:30"));
        time_label.add_css_class("time-label");
        main_box.append(&time_label);

        // Date label
        let date_label = Label::new(Some("July 31, 2025"));
        date_label.add_css_class("date-label");
        main_box.append(&date_label);

        // Start timer to update time
        Self::update_time(&time_label, &date_label);

        Self {
            widget: main_box,
            time_label,
            date_label,
        }
    }

    fn update_time(time_label: &Label, date_label: &Label) {
        let time_clone = time_label.clone();
        let date_clone = date_label.clone();

        glib::timeout_add_local_once(std::time::Duration::from_secs(1), move || {
            let now = SystemTime::now();
            let since_epoch = now.duration_since(UNIX_EPOCH).unwrap();
            let datetime = chrono::DateTime::from_timestamp(since_epoch.as_secs() as i64, 0).unwrap();

            time_clone.set_text(Some(&datetime.format("%H:%M").to_string()));
            date_clone.set_text(Some(&datetime.format("%B %d, %Y").to_string()));

            // Schedule next update
            Self::update_time(&time_clone, &date_clone);
        });
    }

    pub fn widget(&self) -> &Box {
        &self.widget
    }
}

pub struct LocationWidget {
    widget: Box,
    location_label: Label,
    coordinates_label: Label,
    location_data: Arc<Mutex<LocationData>>,
}

#[derive(Clone)]
struct LocationData {
    city: String,
    state: String,
    latitude: f64,
    longitude: f64,
}

impl LocationWidget {
    pub fn new() -> Self {
        let main_box = Box::new(Orientation::Vertical, 4);
        main_box.add_css_class("location-widget");
        main_box.set_halign(gtk::Align::End);
        main_box.set_valign(gtk::Align::Start);
        main_box.set_margin_end(20);
        main_box.set_margin_top(80);

        // Location icon and name
        let location_label = Label::new(Some("📍 San Francisco, CA"));
        location_label.add_css_class("location-label");
        main_box.append(&location_label);

        // Coordinates
        let coordinates_label = Label::new(Some("37.7749°N, 122.4194°W"));
        coordinates_label.add_css_class("coordinates-label");
        main_box.append(&coordinates_label);

        let location_data = Arc::new(Mutex::new(LocationData {
            city: "San Francisco".to_string(),
            state: "CA".to_string(),
            latitude: 37.7749,
            longitude: -122.4194,
        }));

        // Start location updates
        Self::update_location(&location_label, &coordinates_label, Arc::clone(&location_data));

        Self {
            widget: main_box,
            location_label,
            coordinates_label,
            location_data,
        }
    }

    fn update_location(location_label: &Label, coordinates_label: &Label, location_data: Arc<Mutex<LocationData>>) {
        let location_clone = location_label.clone();
        let coordinates_clone = coordinates_label.clone();
        let data_clone = Arc::clone(&location_data);

        // Simulate location updates every 5 minutes
        glib::timeout_add_local_once(std::time::Duration::from_secs(300), move || {
            // In a real implementation, this would call a geolocation API
            let cities = vec![
                ("San Francisco", "CA", 37.7749, -122.4194),
                ("New York", "NY", 40.7128, -74.0060),
                ("London", "UK", 51.5074, -0.1278),
                ("Tokyo", "JP", 35.6762, 139.6503),
                ("Sydney", "AU", -33.8688, 151.2093),
            ];

            let random_city = cities[rand::random::<usize>() % cities.len()];
            
            let mut data = data_clone.lock().unwrap();
            data.city = random_city.0.to_string();
            data.state = random_city.1.to_string();
            data.latitude = random_city.2;
            data.longitude = random_city.3;

            location_clone.set_text(Some(&format!("📍 {}, {}", data.city, data.state)));
            coordinates_clone.set_text(Some(&format!("{:.4}°N, {:.4}°W", data.latitude, data.longitude)));

            // Schedule next update
            Self::update_location(&location_clone, &coordinates_clone, data_clone);
        });
    }

    pub fn widget(&self) -> &Box {
        &self.widget
    }
}

pub struct WeatherWidget {
    widget: Box,
    temperature_label: Label,
    condition_label: Label,
    humidity_label: Label,
    weather_data: Arc<Mutex<WeatherData>>,
}

#[derive(Clone)]
struct WeatherData {
    temperature: i32,
    condition: String,
    humidity: i32,
    icon: String,
}

impl WeatherWidget {
    pub fn new() -> Self {
        let main_box = Box::new(Orientation::Vertical, 8);
        main_box.add_css_class("weather-widget");
        main_box.set_halign(gtk::Align::End);
        main_box.set_valign(gtk::Align::Start);
        main_box.set_margin_end(20);
        main_box.set_margin_top(140);

        // Temperature
        let temperature_label = Label::new(Some("🌤️ 72°F"));
        temperature_label.add_css_class("temperature-label");
        main_box.append(&temperature_label);

        // Weather condition
        let condition_label = Label::new(Some("Partly Cloudy"));
        condition_label.add_css_class("condition-label");
        main_box.append(&condition_label);

        // Humidity
        let humidity_label = Label::new(Some("💧 65% Humidity"));
        humidity_label.add_css_class("humidity-label");
        main_box.append(&humidity_label);

        let weather_data = Arc::new(Mutex::new(WeatherData {
            temperature: 22,
            condition: "Partly Cloudy".to_string(),
            humidity: 65,
            icon: "🌤️".to_string(),
        }));

        // Start weather updates
        Self::update_weather(&temperature_label, &condition_label, &humidity_label, Arc::clone(&weather_data));

        Self {
            widget: main_box,
            temperature_label,
            condition_label,
            humidity_label,
            weather_data,
        }
    }

    fn update_weather(
        temperature_label: &Label, 
        condition_label: &Label, 
        humidity_label: &Label, 
        weather_data: Arc<Mutex<WeatherData>>
    ) {
        let temp_clone = temperature_label.clone();
        let condition_clone = condition_label.clone();
        let humidity_clone = humidity_label.clone();
        let data_clone = Arc::clone(&weather_data);

        // Simulate weather updates every 10 minutes
        glib::timeout_add_local_once(std::time::Duration::from_secs(600), move || {
            let weather_conditions = vec![
                ("🌤️", "Partly Cloudy", 65),
                ("☀️", "Sunny", 55),
                ("🌧️", "Rainy", 80),
                ("🌅", "Clear", 70),
                ("☁️", "Cloudy", 75),
            ];

            let random_weather = weather_conditions[rand::random::<usize>() % weather_conditions.len()];
            let temperature = rand::random::<i32>() % 15 + 15; // 15-30°C

            let mut data = data_clone.lock().unwrap();
            data.icon = random_weather.0.to_string();
            data.condition = random_weather.1.to_string();
            data.humidity = random_weather.2;
            data.temperature = temperature;

            temp_clone.set_text(Some(&format!("{} {}°C", data.icon, data.temperature)));
            condition_clone.set_text(Some(&data.condition));
            humidity_clone.set_text(Some(&format!("💧 {}% Humidity", data.humidity)));

            // Schedule next update
            Self::update_weather(&temp_clone, &condition_clone, &humidity_clone, data_clone);
        });
    }

    pub fn widget(&self) -> &Box {
        &self.widget
    }
}

pub struct PrivacyStatusWidget {
    widget: Box,
    encryption_label: Label,
    tracking_label: Label,
    network_label: Label,
}

impl PrivacyStatusWidget {
    pub fn new() -> Self {
        let main_box = Box::new(Orientation::Vertical, 6);
        main_box.add_css_class("privacy-status-widget");
        main_box.set_halign(gtk::Align::Start);
        main_box.set_valign(gtk::Align::Start);
        main_box.set_margin_start(20);
        main_box.set_margin_top(20);

        // Encryption status
        let encryption_label = Label::new(Some("🔒 End-to-End Encryption Active"));
        encryption_label.add_css_class("privacy-status-label");
        main_box.append(&encryption_label);

        // Tracking protection
        let tracking_label = Label::new(Some("🛡️ No Tracking Detected"));
        tracking_label.add_css_class("privacy-status-label");
        main_box.append(&tracking_label);

        // Network security
        let network_label = Label::new(Some("🌐 Secure Network Connection"));
        network_label.add_css_class("privacy-status-label");
        main_box.append(&network_label);

        Self {
            widget: main_box,
            encryption_label,
            tracking_label,
            network_label,
        }
    }

    pub fn widget(&self) -> &Box {
        &self.widget
    }
}

pub struct SystemStatsWidget {
    widget: Box,
    cpu_label: Label,
    memory_label: Label,
    disk_label: Label,
    system_data: Arc<Mutex<SystemData>>,
}

#[derive(Clone)]
struct SystemData {
    cpu_usage: i32,
    memory_usage: i32,
    disk_usage: i32,
}

impl SystemStatsWidget {
    pub fn new() -> Self {
        let main_box = Box::new(Orientation::Vertical, 6);
        main_box.add_css_class("system-stats-widget");
        main_box.set_halign(gtk::Align::Start);
        main_box.set_valign(gtk::Align::End);
        main_box.set_margin_start(20);
        main_box.set_margin_bottom(100);

        // CPU usage
        let cpu_label = Label::new(Some("⚡ CPU: 23%"));
        cpu_label.add_css_class("system-stats-label");
        main_box.append(&cpu_label);

        // Memory usage
        let memory_label = Label::new(Some("🧠 RAM: 4.2GB / 16GB"));
        memory_label.add_css_class("system-stats-label");
        main_box.append(&memory_label);

        // Disk usage
        let disk_label = Label::new(Some("💾 Disk: 127GB / 512GB"));
        disk_label.add_css_class("system-stats-label");
        main_box.append(&disk_label);

        let system_data = Arc::new(Mutex::new(SystemData {
            cpu_usage: 23,
            memory_usage: 65,
            disk_usage: 75,
        }));

        // Start system stats updates
        Self::update_system_stats(&cpu_label, &memory_label, &disk_label, Arc::clone(&system_data));

        Self {
            widget: main_box,
            cpu_label,
            memory_label,
            disk_label,
            system_data,
        }
    }

    fn update_system_stats(
        cpu_label: &Label,
        memory_label: &Label,
        disk_label: &Label,
        system_data: Arc<Mutex<SystemData>>
    ) {
        let cpu_clone = cpu_label.clone();
        let memory_clone = memory_label.clone();
        let disk_clone = disk_label.clone();
        let data_clone = Arc::clone(&system_data);

        // Update system stats every 5 seconds
        glib::timeout_add_local_once(std::time::Duration::from_secs(5), move || {
            let mut data = data_clone.lock().unwrap();
            
            // Simulate realistic system usage patterns
            data.cpu_usage = (data.cpu_usage + rand::random::<i32>() % 10 - 5).clamp(15, 45);
            data.memory_usage = (data.memory_usage + rand::random::<i32>() % 8 - 4).clamp(55, 85);
            data.disk_usage = (data.disk_usage + rand::random::<i32>() % 4 - 2).clamp(70, 90);

            cpu_clone.set_text(Some(&format!("⚡ CPU: {}%", data.cpu_usage)));
            memory_clone.set_text(Some(&format!("🧠 RAM: {}%", data.memory_usage)));
            disk_clone.set_text(Some(&format!("💾 Disk: {}%", data.disk_usage)));

            // Schedule next update
            Self::update_system_stats(&cpu_clone, &memory_clone, &disk_clone, data_clone);
        });
    }

    pub fn widget(&self) -> &Box {
        &self.widget
    }
}

pub struct QuickActionsWidget {
    widget: Box,
}

impl QuickActionsWidget {
    pub fn new() -> Self {
        let main_box = Box::new(Orientation::Vertical, 8);
        main_box.add_css_class("quick-actions-widget");
        main_box.set_halign(gtk::Align::End);
        main_box.set_valign(gtk::Align::End);
        main_box.set_margin_end(20);
        main_box.set_margin_bottom(100);

        // Quick action buttons
        let actions = vec![
            ("🔒 Lock Screen", "lock"),
            ("⚙️ Settings", "settings"),
            ("📱 Notifications", "notifications"),
            ("🎵 Media Controls", "media"),
        ];

        for (label, action) in actions {
            let button = Self::create_action_button(label, action);
            main_box.append(&button);
        }

        Self {
            widget: main_box,
        }
    }

    fn create_action_button(label: &str, action: &str) -> Button {
        let button = Button::new();
        button.set_label(label);
        button.add_css_class("quick-action-btn");
        button.set_tooltip_text(Some(label));

        let action = action.to_string();
        button.connect_clicked(move |_| {
            println!("Quick action: {}", action);
            // TODO: Implement quick actions
        });

        button
    }

    pub fn widget(&self) -> &Box {
        &self.widget
    }
} 

pub struct WiFiWidget {
    widget: Box,
    wifi_icon: Label,
    wifi_strength: Label,
    wifi_name: Label,
    wifi_data: Arc<Mutex<WiFiData>>,
}

#[derive(Clone)]
struct WiFiData {
    strength: String,
    name: String,
    signal_level: i32,
}

impl WiFiWidget {
    pub fn new() -> Self {
        let main_box = Box::new(Orientation::Vertical, 6);
        main_box.add_css_class("wifi-widget");
        main_box.set_halign(gtk::Align::End);
        main_box.set_valign(gtk::Align::Start);
        main_box.set_margin_end(20);
        main_box.set_margin_top(220);

        // WiFi icon
        let wifi_icon = Label::new(Some("📶"));
        wifi_icon.add_css_class("wifi-icon");
        main_box.append(&wifi_icon);

        // WiFi strength
        let wifi_strength = Label::new(Some("Excellent"));
        wifi_strength.add_css_class("wifi-strength");
        main_box.append(&wifi_strength);

        // WiFi name
        let wifi_name = Label::new(Some("TauOS Network"));
        wifi_name.add_css_class("wifi-name");
        main_box.append(&wifi_name);

        let wifi_data = Arc::new(Mutex::new(WiFiData {
            strength: "Excellent".to_string(),
            name: "TauOS Network".to_string(),
            signal_level: 90,
        }));

        // Start WiFi updates
        Self::update_wifi(&wifi_icon, &wifi_strength, &wifi_name, Arc::clone(&wifi_data));

        Self {
            widget: main_box,
            wifi_icon,
            wifi_strength,
            wifi_name,
            wifi_data,
        }
    }

    fn update_wifi(
        wifi_icon: &Label,
        wifi_strength: &Label,
        wifi_name: &Label,
        wifi_data: Arc<Mutex<WiFiData>>
    ) {
        let icon_clone = wifi_icon.clone();
        let strength_clone = wifi_strength.clone();
        let name_clone = wifi_name.clone();
        let data_clone = Arc::clone(&wifi_data);

        // Update WiFi every 30 seconds
        glib::timeout_add_local_once(std::time::Duration::from_secs(30), move || {
            let mut data = data_clone.lock().unwrap();
            
            // Simulate realistic WiFi signal patterns
            data.signal_level = (data.signal_level + rand::random::<i32>() % 10 - 5).clamp(60, 100);
            
            if data.signal_level >= 90 {
                data.strength = "Excellent".to_string();
            } else if data.signal_level >= 75 {
                data.strength = "Good".to_string();
            } else if data.signal_level >= 60 {
                data.strength = "Fair".to_string();
            } else {
                data.strength = "Poor".to_string();
            }

            icon_clone.set_text(Some("📶"));
            strength_clone.set_text(Some(&data.strength));
            name_clone.set_text(Some(&data.name));

            // Schedule next update
            Self::update_wifi(&icon_clone, &strength_clone, &name_clone, data_clone);
        });
    }

    pub fn widget(&self) -> &Box {
        &self.widget
    }
} 