use anyhow::{Result, Context};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use log::{info, warn, error, debug};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WirelessNetwork {
    pub ssid: String,
    pub signal_strength: i32,
    pub frequency: u32,
    pub security: String,
    pub connected: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnownNetwork {
    pub ssid: String,
    pub password: Option<String>, // Will be encrypted
    pub security: String,
    pub auto_connect: bool,
    pub last_connected: Option<chrono::DateTime<chrono::Utc>>,
}

pub struct WirelessManager {
    known_networks: HashMap<String, KnownNetwork>,
    known_networks_file: PathBuf,
}

impl WirelessManager {
    pub fn new() -> Result<Self> {
        let known_networks_file = PathBuf::from("/etc/tau/network/known.toml");
        
        // Ensure directory exists
        if let Some(parent) = known_networks_file.parent() {
            fs::create_dir_all(parent)?;
        }
        
        let known_networks = if known_networks_file.exists() {
            Self::load_known_networks(&known_networks_file)?
        } else {
            HashMap::new()
        };
        
        Ok(Self {
            known_networks,
            known_networks_file,
        })
    }
    
    pub fn scan_networks(&self, interface: &str) -> Result<Vec<WirelessNetwork>> {
        info!("Scanning for wireless networks on interface: {}", interface);
        
        // Use iw to scan for networks
        let output = Command::new("iw")
            .args(["dev", interface, "scan"])
            .output()
            .context("Failed to scan wireless networks")?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to scan networks: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        // Parse scan results
        let networks = self.parse_scan_results(&output.stdout)?;
        
        info!("Found {} wireless networks", networks.len());
        Ok(networks)
    }
    
    fn parse_scan_results(&self, output: &[u8]) -> Result<Vec<WirelessNetwork>> {
        let output_str = String::from_utf8_lossy(output);
        let mut networks = Vec::new();
        
        // Parse iw scan output
        let lines: Vec<&str> = output_str.lines().collect();
        let mut current_ssid = None;
        let mut current_signal = None;
        let mut current_freq = None;
        let mut current_security = "open".to_string();
        
        for line in lines {
            let line = line.trim();
            
            if line.starts_with("SSID:") {
                if let Some(ssid) = line.strip_prefix("SSID:") {
                    current_ssid = Some(ssid.trim().to_string());
                }
            } else if line.starts_with("signal:") {
                if let Some(signal_str) = line.strip_prefix("signal:") {
                    if let Ok(signal) = signal_str.trim().parse::<i32>() {
                        current_signal = Some(signal);
                    }
                }
            } else if line.starts_with("freq:") {
                if let Some(freq_str) = line.strip_prefix("freq:") {
                    if let Ok(freq) = freq_str.trim().parse::<u32>() {
                        current_freq = Some(freq);
                    }
                }
            } else if line.contains("WPA") || line.contains("WEP") {
                current_security = "wpa".to_string();
            }
            
            // When we have all info for a network, add it
            if let (Some(ssid), Some(signal), Some(freq)) = (current_ssid.clone(), current_signal, current_freq) {
                let network = WirelessNetwork {
                    ssid,
                    signal_strength: signal,
                    frequency: freq,
                    security: current_security.clone(),
                    connected: false,
                };
                
                // Check if this network is already in our list
                if !networks.iter().any(|n| n.ssid == network.ssid) {
                    networks.push(network);
                }
                
                // Reset for next network
                current_ssid = None;
                current_signal = None;
                current_freq = None;
                current_security = "open".to_string();
            }
        }
        
        Ok(networks)
    }
    
    pub fn connect_to_network(&self, interface: &str, ssid: &str, password: Option<&str>) -> Result<()> {
        info!("Connecting to wireless network: {}", ssid);
        
        // Check if we have this network in known networks
        let known_network = self.known_networks.get(ssid);
        let network_password = password.or_else(|| known_network.and_then(|n| n.password.as_deref()));
        
        if network_password.is_none() && known_network.is_some() {
            return Err(anyhow::anyhow!("Password required for network: {}", ssid));
        }
        
        // Configure wpa_supplicant
        self.configure_wpa_supplicant(interface, ssid, network_password)?;
        
        // Start wpa_supplicant
        self.start_wpa_supplicant(interface)?;
        
        // Configure DHCP
        self.configure_dhcp(interface)?;
        
        // Update known networks
        if let Some(password) = password {
            self.add_known_network(ssid, password, "wpa")?;
        }
        
        info!("Successfully connected to network: {}", ssid);
        Ok(())
    }
    
    fn configure_wpa_supplicant(&self, interface: &str, ssid: &str, password: Option<&str>) -> Result<()> {
        let wpa_conf_path = PathBuf::from("/etc/wpa_supplicant/wpa_supplicant.conf");
        
        // Create wpa_supplicant configuration
        let mut config = String::new();
        config.push_str("ctrl_interface=/var/run/wpa_supplicant\n");
        config.push_str("update_config=1\n\n");
        config.push_str("network={\n");
        config.push_str(&format!("    ssid=\"{}\"\n", ssid));
        
        if let Some(pass) = password {
            config.push_str(&format!("    psk=\"{}\"\n", pass));
        } else {
            config.push_str("    key_mgmt=NONE\n");
        }
        
        config.push_str("}\n");
        
        // Write configuration
        fs::write(&wpa_conf_path, config)
            .context("Failed to write wpa_supplicant configuration")?;
        
        Ok(())
    }
    
    fn start_wpa_supplicant(&self, interface: &str) -> Result<()> {
        // Kill existing wpa_supplicant processes
        Command::new("pkill")
            .args(["-f", "wpa_supplicant"])
            .output()
            .ok();
        
        // Start wpa_supplicant
        let output = Command::new("wpa_supplicant")
            .args(["-B", "-i", interface, "-c", "/etc/wpa_supplicant/wpa_supplicant.conf"])
            .output()
            .context("Failed to start wpa_supplicant")?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to start wpa_supplicant: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        Ok(())
    }
    
    fn configure_dhcp(&self, interface: &str) -> Result<()> {
        // Wait a moment for wpa_supplicant to connect
        std::thread::sleep(std::time::Duration::from_secs(2));
        
        // Start dhclient
        let output = Command::new("dhclient")
            .args(["-v", interface])
            .output()
            .context("Failed to start dhclient")?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to configure DHCP: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        Ok(())
    }
    
    pub fn disconnect(&self, interface: &str) -> Result<()> {
        info!("Disconnecting from wireless network on interface: {}", interface);
        
        // Kill wpa_supplicant
        Command::new("pkill")
            .args(["-f", "wpa_supplicant"])
            .output()
            .ok();
        
        // Kill dhclient
        Command::new("pkill")
            .args(["-f", "dhclient"])
            .output()
            .ok();
        
        // Bring interface down
        Command::new("ip")
            .args(["link", "set", interface, "down"])
            .output()
            .ok();
        
        info!("Disconnected from wireless network");
        Ok(())
    }
    
    pub fn add_known_network(&mut self, ssid: &str, password: &str, security: &str) -> Result<()> {
        let encrypted_password = self.encrypt_password(password)?;
        
        let known_network = KnownNetwork {
            ssid: ssid.to_string(),
            password: Some(encrypted_password),
            security: security.to_string(),
            auto_connect: true,
            last_connected: Some(chrono::Utc::now()),
        };
        
        self.known_networks.insert(ssid.to_string(), known_network);
        self.save_known_networks()?;
        
        info!("Added network to known networks: {}", ssid);
        Ok(())
    }
    
    pub fn remove_known_network(&mut self, ssid: &str) -> Result<()> {
        if self.known_networks.remove(ssid).is_some() {
            self.save_known_networks()?;
            info!("Removed network from known networks: {}", ssid);
        }
        
        Ok(())
    }
    
    pub fn list_known_networks(&self) -> Vec<&KnownNetwork> {
        self.known_networks.values().collect()
    }
    
    pub fn get_known_network(&self, ssid: &str) -> Option<&KnownNetwork> {
        self.known_networks.get(ssid)
    }
    
    fn encrypt_password(&self, password: &str) -> Result<String> {
        // In a real implementation, you'd use proper encryption
        // For now, we'll use base64 encoding as a placeholder
        let encoded = base64::engine::general_purpose::STANDARD.encode(password.as_bytes());
        Ok(encoded)
    }
    
    fn decrypt_password(&self, encrypted: &str) -> Result<String> {
        // In a real implementation, you'd use proper decryption
        let decoded = base64::engine::general_purpose::STANDARD.decode(encrypted)
            .context("Failed to decode password")?;
        Ok(String::from_utf8(decoded)?)
    }
    
    fn load_known_networks(file_path: &PathBuf) -> Result<HashMap<String, KnownNetwork>> {
        if file_path.exists() {
            let content = fs::read_to_string(file_path)
                .context("Failed to read known networks file")?;
            
            let networks: HashMap<String, KnownNetwork> = toml::from_str(&content)
                .context("Failed to parse known networks file")?;
            
            Ok(networks)
        } else {
            Ok(HashMap::new())
        }
    }
    
    fn save_known_networks(&self) -> Result<()> {
        let content = toml::to_string_pretty(&self.known_networks)
            .context("Failed to serialize known networks")?;
        
        fs::write(&self.known_networks_file, content)
            .context("Failed to write known networks file")?;
        
        Ok(())
    }
    
    pub fn auto_connect(&self, interface: &str) -> Result<()> {
        info!("Attempting auto-connect on interface: {}", interface);
        
        // Scan for networks
        let networks = self.scan_networks(interface)?;
        
        // Find the best known network
        for network in networks {
            if let Some(known_network) = self.known_networks.get(&network.ssid) {
                if known_network.auto_connect {
                    info!("Auto-connecting to known network: {}", network.ssid);
                    return self.connect_to_network(interface, &network.ssid, None);
                }
            }
        }
        
        warn!("No known networks found for auto-connect");
        Ok(())
    }
    
    pub fn get_connection_status(&self, interface: &str) -> Result<Option<WirelessNetwork>> {
        // Check if interface is connected to a network
        let output = Command::new("iw")
            .args(["dev", interface, "info"])
            .output();
        
        if let Ok(output) = output {
            let output_str = String::from_utf8_lossy(&output.stdout);
            
            // Extract SSID
            let ssid_re = regex::Regex::new(r"ssid ([^\n]+)")?;
            if let Some(cap) = ssid_re.captures(&output_str) {
                let ssid = cap[1].trim().to_string();
                
                // Get signal strength
                let signal_re = regex::Regex::new(r"signal: ([-\d]+)")?;
                let signal_strength = if let Some(cap) = signal_re.captures(&output_str) {
                    cap[1].parse().unwrap_or(0)
                } else {
                    0
                };
                
                // Get frequency
                let freq_re = regex::Regex::new(r"freq ([0-9]+)")?;
                let frequency = if let Some(cap) = freq_re.captures(&output_str) {
                    cap[1].parse().unwrap_or(0)
                } else {
                    0
                };
                
                return Ok(Some(WirelessNetwork {
                    ssid,
                    signal_strength,
                    frequency,
                    security: "wpa".to_string(), // Assume WPA for connected networks
                    connected: true,
                }));
            }
        }
        
        Ok(None)
    }
}

impl std::fmt::Display for WirelessNetwork {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "SSID: {}", self.ssid)?;
        write!(f, "\n  Signal: {} dBm", self.signal_strength)?;
        write!(f, "\n  Frequency: {} MHz", self.frequency)?;
        write!(f, "\n  Security: {}", self.security)?;
        write!(f, "\n  Connected: {}", self.connected)?;
        Ok(())
    }
}

impl std::fmt::Display for KnownNetwork {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "SSID: {}", self.ssid)?;
        write!(f, "\n  Security: {}", self.security)?;
        write!(f, "\n  Auto-connect: {}", self.auto_connect)?;
        if let Some(last_connected) = self.last_connected {
            write!(f, "\n  Last connected: {}", last_connected.format("%Y-%m-%d %H:%M:%S"))?;
        }
        Ok(())
    }
} 