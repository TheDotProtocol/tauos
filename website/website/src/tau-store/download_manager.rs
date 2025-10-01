use gtk4 as gtk;
use gtk::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::collections::VecDeque;

#[derive(Clone, Serialize, Deserialize)]
pub struct DownloadTask {
    pub id: String,
    pub app_name: String,
    pub app_id: String,
    pub status: DownloadStatus,
    pub progress: f32,
    pub size: String,
    pub speed: String,
    pub eta: String,
    pub priority: DownloadPriority,
}

#[derive(Clone, Serialize, Deserialize)]
pub enum DownloadStatus {
    Queued,
    Downloading,
    Installing,
    Completed,
    Failed,
    Cancelled,
}

#[derive(Clone, Serialize, Deserialize)]
pub enum DownloadPriority {
    Low,
    Normal,
    High,
}

pub struct DownloadManager {
    download_queue: Arc<Mutex<VecDeque<DownloadTask>>>,
    active_downloads: Arc<Mutex<Vec<DownloadTask>>>,
    completed_downloads: Arc<Mutex<Vec<DownloadTask>>>,
    max_concurrent_downloads: usize,
}

impl DownloadManager {
    pub fn new() -> Self {
        Self {
            download_queue: Arc::new(Mutex::new(VecDeque::new())),
            active_downloads: Arc::new(Mutex::new(Vec::new())),
            completed_downloads: Arc::new(Mutex::new(Vec::new())),
            max_concurrent_downloads: 3,
        }
    }
    
    pub fn add_download(&self, app_id: &str, app_name: &str, priority: DownloadPriority) -> Result<(), String> {
        let task = DownloadTask {
            id: format!("download_{}", chrono::Utc::now().timestamp()),
            app_name: app_name.to_string(),
            app_id: app_id.to_string(),
            status: DownloadStatus::Queued,
            progress: 0.0,
            size: "25.4 MB".to_string(),
            speed: "0 KB/s".to_string(),
            eta: "Calculating...".to_string(),
            priority,
        };
        
        if let Ok(mut queue) = self.download_queue.lock() {
            queue.push_back(task);
            println!("📥 Added download to queue: {}", app_name);
        }
        
        self.process_queue();
        Ok(())
    }
    
    pub fn process_queue(&self) {
        if let (Ok(mut queue), Ok(mut active)) = (self.download_queue.lock(), self.active_downloads.lock()) {
            while active.len() < self.max_concurrent_downloads && !queue.is_empty() {
                if let Some(mut task) = queue.pop_front() {
                    task.status = DownloadStatus::Downloading;
                    active.push(task.clone());
                    
                    // Start download simulation
                    self.simulate_download(task);
                }
            }
        }
    }
    
    fn simulate_download(&self, mut task: DownloadTask) {
        // Simulate download progress
        let task_id = task.id.clone();
        
        std::thread::spawn(move || {
            for i in 0..=100 {
                task.progress = i as f32 / 100.0;
                task.speed = format!("{} KB/s", rand::random::<u32>() % 1000 + 100);
                task.eta = format!("{}s", (100 - i) / 10);
                
                println!("📥 Downloading {}: {:.1}%", task.app_name, task.progress * 100.0);
                
                if i == 100 {
                    task.status = DownloadStatus::Installing;
                    println!("🔧 Installing {}...", task.app_name);
                    
                    // Simulate installation
                    for j in 0..=100 {
                        task.progress = j as f32 / 100.0;
                        println!("🔧 Installing {}: {:.1}%", task.app_name, task.progress * 100.0);
                        std::thread::sleep(std::time::Duration::from_millis(100));
                    }
                    
                    task.status = DownloadStatus::Completed;
                    println!("✅ Installation completed: {}", task.app_name);
                }
                
                std::thread::sleep(std::time::Duration::from_millis(200));
            }
        });
    }
    
    pub fn cancel_download(&self, task_id: &str) -> Result<(), String> {
        if let Ok(mut queue) = self.download_queue.lock() {
            queue.retain(|task| task.id != task_id);
        }
        
        if let Ok(mut active) = self.active_downloads.lock() {
            if let Some(index) = active.iter().position(|task| task.id == task_id) {
                active.remove(index);
            }
        }
        
        println!("❌ Cancelled download: {}", task_id);
        Ok(())
    }
    
    pub fn pause_download(&self, task_id: &str) -> Result<(), String> {
        if let Ok(mut active) = self.active_downloads.lock() {
            if let Some(task) = active.iter_mut().find(|t| t.id == task_id) {
                task.status = DownloadStatus::Queued;
                println!("⏸️ Paused download: {}", task.app_name);
            }
        }
        Ok(())
    }
    
    pub fn resume_download(&self, task_id: &str) -> Result<(), String> {
        if let Ok(mut active) = self.active_downloads.lock() {
            if let Some(task) = active.iter_mut().find(|t| t.id == task_id) {
                task.status = DownloadStatus::Downloading;
                println!("▶️ Resumed download: {}", task.app_name);
            }
        }
        Ok(())
    }
    
    pub fn get_download_queue(&self) -> Vec<DownloadTask> {
        if let Ok(queue) = self.download_queue.lock() {
            queue.iter().cloned().collect()
        } else {
            Vec::new()
        }
    }
    
    pub fn get_active_downloads(&self) -> Vec<DownloadTask> {
        if let Ok(active) = self.active_downloads.lock() {
            active.clone()
        } else {
            Vec::new()
        }
    }
    
    pub fn get_completed_downloads(&self) -> Vec<DownloadTask> {
        if let Ok(completed) = self.completed_downloads.lock() {
            completed.clone()
        } else {
            Vec::new()
        }
    }
    
    pub fn get_download_progress(&self, task_id: &str) -> Option<f32> {
        if let Ok(active) = self.active_downloads.lock() {
            active.iter().find(|task| task.id == task_id).map(|task| task.progress)
        } else {
            None
        }
    }
    
    pub fn clear_completed_downloads(&self) {
        if let Ok(mut completed) = self.completed_downloads.lock() {
            completed.clear();
            println!("🗑️ Cleared completed downloads");
        }
    }
    
    pub fn get_download_stats(&self) -> DownloadStats {
        let queue_count = if let Ok(queue) = self.download_queue.lock() {
            queue.len()
        } else {
            0
        };
        
        let active_count = if let Ok(active) = self.active_downloads.lock() {
            active.len()
        } else {
            0
        };
        
        let completed_count = if let Ok(completed) = self.completed_downloads.lock() {
            completed.len()
        } else {
            0
        };
        
        DownloadStats {
            queued: queue_count,
            active: active_count,
            completed: completed_count,
            total_downloads: queue_count + active_count + completed_count,
        }
    }
}

#[derive(Clone)]
pub struct DownloadStats {
    pub queued: usize,
    pub active: usize,
    pub completed: usize,
    pub total_downloads: usize,
}

pub fn create_download_dialog() -> gtk::Dialog {
    let dialog = gtk::Dialog::new();
    dialog.set_title(Some("Download Manager"));
    dialog.set_default_size(500, 400);
    
    let content_area = dialog.content_area();
    let main_box = gtk::Box::new(gtk::Orientation::Vertical, 16);
    main_box.set_margin_start(16);
    main_box.set_margin_end(16);
    main_box.set_margin_top(16);
    main_box.set_margin_bottom(16);
    
    // Download stats
    let stats_box = gtk::Box::new(gtk::Orientation::Horizontal, 16);
    
    let queued_label = gtk::Label::new(Some("Queued: 2"));
    queued_label.add_css_class("download-stat");
    stats_box.append(&queued_label);
    
    let active_label = gtk::Label::new(Some("Active: 1"));
    active_label.add_css_class("download-stat");
    stats_box.append(&active_label);
    
    let completed_label = gtk::Label::new(Some("Completed: 5"));
    completed_label.add_css_class("download-stat");
    stats_box.append(&completed_label);
    
    main_box.append(&stats_box);
    
    // Download list
    let download_list = gtk::ListBox::new();
    download_list.add_css_class("download-list");
    
    // Add sample downloads
    let downloads = vec![
        ("🌐 Tau Browser", "Downloading...", "75%", "2.1 MB/s", "30s"),
        ("📧 TauMail", "Queued", "0%", "0 KB/s", "--"),
        ("☁️ TauCloud", "Installing...", "45%", "0 KB/s", "Installing"),
    ];
    
    for (name, status, progress, speed, eta) in downloads {
        let download_item = create_download_list_item(name, status, progress, speed, eta);
        download_list.append(&download_item);
    }
    
    main_box.append(&download_list);
    
    // Action buttons
    let action_box = gtk::Box::new(gtk::Orientation::Horizontal, 8);
    
    let pause_button = gtk::Button::new();
    pause_button.set_label(Some("⏸️ Pause All"));
    pause_button.add_css_class("download-action-button");
    action_box.append(&pause_button);
    
    let resume_button = gtk::Button::new();
    resume_button.set_label(Some("▶️ Resume All"));
    resume_button.add_css_class("download-action-button");
    action_box.append(&resume_button);
    
    let clear_button = gtk::Button::new();
    clear_button.set_label(Some("🗑️ Clear Completed"));
    clear_button.add_css_class("download-action-button");
    action_box.append(&clear_button);
    
    main_box.append(&action_box);
    
    content_area.append(&main_box);
    
    // Add buttons
    dialog.add_button("Close", gtk::ResponseType::Close);
    
    dialog
}

fn create_download_list_item(name: &str, status: &str, progress: &str, speed: &str, eta: &str) -> gtk::ListBoxRow {
    let row = gtk::ListBoxRow::new();
    let box_widget = gtk::Box::new(gtk::Orientation::Horizontal, 12);
    
    let icon = gtk::Label::new(Some(&name[..4])); // First 4 chars (emoji)
    icon.add_css_class("download-icon");
    
    let info_box = gtk::Box::new(gtk::Orientation::Vertical, 4);
    
    let name_label = gtk::Label::new(Some(name));
    name_label.add_css_class("download-name");
    info_box.append(&name_label);
    
    let status_label = gtk::Label::new(Some(status));
    status_label.add_css_class("download-status");
    info_box.append(&status_label);
    
    let progress_label = gtk::Label::new(Some(&format!("{} - {} - {}", progress, speed, eta)));
    progress_label.add_css_class("download-progress");
    info_box.append(&progress_label);
    
    box_widget.append(&icon);
    box_widget.append(&info_box);
    
    row.set_child(Some(&box_widget));
    row
} 