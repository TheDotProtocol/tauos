use anyhow::{Result, Context};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use log::{info, warn, error, debug};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkInterface {
    pub name: String,
    pub interface_type: InterfaceType,
    pub mac_address: Option<String>,
    pub ip_address: Option<String>,
    pub netmask: Option<String>,
    pub gateway: Option<String>,
    pub dns_servers: Vec<String>,
    pub status: InterfaceStatus,
    pub wireless_info: Option<WirelessInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum InterfaceType {
    Ethernet,
    Wireless,
    Loopback,
    Virtual,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum InterfaceStatus {
    Up,
    Down,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WirelessInfo {
    pub ssid: Option<String>,
    pub frequency: Option<u32>,
    pub signal_strength: Option<i32>,
    pub security: Option<String>,
    pub connected: bool,
}

pub struct InterfaceManager {
    interfaces: HashMap<String, NetworkInterface>,
}

impl InterfaceManager {
    pub fn new() -> Self {
        Self {
            interfaces: HashMap::new(),
        }
    }
    
    pub fn discover_interfaces(&mut self) -> Result<()> {
        info!("Discovering network interfaces");
        
        // Read /proc/net/dev to get interface names
        let proc_net_dev = fs::read_to_string("/proc/net/dev")
            .context("Failed to read /proc/net/dev")?;
        
        for line in proc_net_dev.lines().skip(2) {
            if let Some(interface_name) = line.split(':').next() {
                let interface_name = interface_name.trim();
                
                if interface_name != "lo" { // Skip loopback for now
                    let interface = self.get_interface_info(interface_name)?;
                    self.interfaces.insert(interface_name.to_string(), interface);
                }
            }
        }
        
        info!("Discovered {} interfaces", self.interfaces.len());
        Ok(())
    }
    
    fn get_interface_info(&self, name: &str) -> Result<NetworkInterface> {
        let interface_type = self.detect_interface_type(name)?;
        let status = self.get_interface_status(name)?;
        let mac_address = self.get_mac_address(name)?;
        let ip_info = self.get_ip_info(name)?;
        let wireless_info = if interface_type == InterfaceType::Wireless {
            self.get_wireless_info(name)?
        } else {
            None
        };
        
        Ok(NetworkInterface {
            name: name.to_string(),
            interface_type,
            mac_address,
            ip_address: ip_info.ip_address,
            netmask: ip_info.netmask,
            gateway: ip_info.gateway,
            dns_servers: ip_info.dns_servers,
            status,
            wireless_info,
        })
    }
    
    fn detect_interface_type(&self, name: &str) -> Result<InterfaceType> {
        // Check if it's a wireless interface
        if name.starts_with("wlan") || name.starts_with("wifi") || name.starts_with("wl") {
            return Ok(InterfaceType::Wireless);
        }
        
        // Check if it's a virtual interface
        if name.starts_with("veth") || name.starts_with("docker") || name.starts_with("br-") {
            return Ok(InterfaceType::Virtual);
        }
        
        // Check if it's loopback
        if name == "lo" {
            return Ok(InterfaceType::Loopback);
        }
        
        // Default to Ethernet
        Ok(InterfaceType::Ethernet)
    }
    
    fn get_interface_status(&self, name: &str) -> Result<InterfaceStatus> {
        let output = Command::new("ip")
            .args(["link", "show", name])
            .output()
            .context("Failed to run ip link show")?;
        
        let output_str = String::from_utf8_lossy(&output.stdout);
        
        if output_str.contains("UP") {
            Ok(InterfaceStatus::Up)
        } else if output_str.contains("DOWN") {
            Ok(InterfaceStatus::Down)
        } else {
            Ok(InterfaceStatus::Unknown)
        }
    }
    
    fn get_mac_address(&self, name: &str) -> Result<Option<String>> {
        let output = Command::new("ip")
            .args(["link", "show", name])
            .output()
            .context("Failed to run ip link show")?;
        
        let output_str = String::from_utf8_lossy(&output.stdout);
        
        // Extract MAC address using regex
        let re = regex::Regex::new(r"link/ether ([0-9a-fA-F:]{17})")?;
        if let Some(cap) = re.captures(&output_str) {
            Ok(Some(cap[1].to_string()))
        } else {
            Ok(None)
        }
    }
    
    fn get_ip_info(&self, name: &str) -> Result<IpInfo> {
        let output = Command::new("ip")
            .args(["addr", "show", name])
            .output()
            .context("Failed to run ip addr show")?;
        
        let output_str = String::from_utf8_lossy(&output.stdout);
        
        let mut ip_info = IpInfo {
            ip_address: None,
            netmask: None,
            gateway: None,
            dns_servers: Vec::new(),
        };
        
        // Extract IP address and netmask
        let ip_re = regex::Regex::new(r"inet ([0-9.]+)/([0-9]+)")?;
        if let Some(cap) = ip_re.captures(&output_str) {
            ip_info.ip_address = Some(cap[1].to_string());
            ip_info.netmask = Some(format!("{}/{}", cap[1], cap[2]));
        }
        
        // Get gateway
        let route_output = Command::new("ip")
            .args(["route", "show", "default"])
            .output()
            .context("Failed to run ip route show")?;
        
        let route_str = String::from_utf8_lossy(&route_output.stdout);
        let gateway_re = regex::Regex::new(r"default via ([0-9.]+)")?;
        if let Some(cap) = gateway_re.captures(&route_str) {
            ip_info.gateway = Some(cap[1].to_string());
        }
        
        // Get DNS servers from /etc/resolv.conf
        if let Ok(resolv_conf) = fs::read_to_string("/etc/resolv.conf") {
            let dns_re = regex::Regex::new(r"nameserver ([0-9.]+)")?;
            for cap in dns_re.captures_iter(&resolv_conf) {
                ip_info.dns_servers.push(cap[1].to_string());
            }
        }
        
        Ok(ip_info)
    }
    
    fn get_wireless_info(&self, name: &str) -> Result<Option<WirelessInfo>> {
        // Try to get wireless info using iw
        let output = Command::new("iw")
            .args(["dev", name, "info"])
            .output();
        
        if let Ok(output) = output {
            let output_str = String::from_utf8_lossy(&output.stdout);
            
            let mut wireless_info = WirelessInfo {
                ssid: None,
                frequency: None,
                signal_strength: None,
                security: None,
                connected: false,
            };
            
            // Extract SSID
            let ssid_re = regex::Regex::new(r"ssid ([^\n]+)")?;
            if let Some(cap) = ssid_re.captures(&output_str) {
                wireless_info.ssid = Some(cap[1].trim().to_string());
                wireless_info.connected = true;
            }
            
            // Extract frequency
            let freq_re = regex::Regex::new(r"freq ([0-9]+)")?;
            if let Some(cap) = freq_re.captures(&output_str) {
                wireless_info.frequency = Some(cap[1].parse()?);
            }
            
            // Extract signal strength
            let signal_re = regex::Regex::new(r"signal: ([-\d]+)")?;
            if let Some(cap) = signal_re.captures(&output_str) {
                wireless_info.signal_strength = Some(cap[1].parse()?);
            }
            
            Ok(Some(wireless_info))
        } else {
            Ok(None)
        }
    }
    
    pub fn list_interfaces(&self) -> Vec<&NetworkInterface> {
        self.interfaces.values().collect()
    }
    
    pub fn get_interface(&self, name: &str) -> Option<&NetworkInterface> {
        self.interfaces.get(name)
    }
    
    pub fn enable_interface(&self, name: &str) -> Result<()> {
        info!("Enabling interface: {}", name);
        
        let output = Command::new("ip")
            .args(["link", "set", name, "up"])
            .output()
            .context("Failed to enable interface")?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to enable interface: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        info!("Interface {} enabled", name);
        Ok(())
    }
    
    pub fn disable_interface(&self, name: &str) -> Result<()> {
        info!("Disabling interface: {}", name);
        
        let output = Command::new("ip")
            .args(["link", "set", name, "down"])
            .output()
            .context("Failed to disable interface")?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to disable interface: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        info!("Interface {} disabled", name);
        Ok(())
    }
    
    pub fn configure_dhcp(&self, name: &str) -> Result<()> {
        info!("Configuring DHCP for interface: {}", name);
        
        // Kill any existing dhclient processes for this interface
        Command::new("pkill")
            .args(["-f", &format!("dhclient.*{}", name)])
            .output()
            .ok();
        
        // Start dhclient
        let output = Command::new("dhclient")
            .args(["-v", name])
            .output()
            .context("Failed to start dhclient")?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to configure DHCP: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        info!("DHCP configured for interface {}", name);
        Ok(())
    }
    
    pub fn configure_static_ip(&self, name: &str, ip: &str, netmask: &str, gateway: &str) -> Result<()> {
        info!("Configuring static IP for interface: {}", name);
        
        // Configure IP address
        let output = Command::new("ip")
            .args(["addr", "add", &format!("{}/{}", ip, netmask), "dev", name])
            .output()
            .context("Failed to configure static IP")?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to configure static IP: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        // Configure gateway
        let output = Command::new("ip")
            .args(["route", "add", "default", "via", gateway, "dev", name])
            .output()
            .context("Failed to configure gateway")?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to configure gateway: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        info!("Static IP configured for interface {}", name);
        Ok(())
    }
}

#[derive(Debug)]
struct IpInfo {
    ip_address: Option<String>,
    netmask: Option<String>,
    gateway: Option<String>,
    dns_servers: Vec<String>,
}

impl std::fmt::Display for NetworkInterface {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Interface: {}", self.name)?;
        write!(f, "\n  Type: {:?}", self.interface_type)?;
        write!(f, "\n  Status: {:?}", self.status)?;
        
        if let Some(mac) = &self.mac_address {
            write!(f, "\n  MAC: {}", mac)?;
        }
        
        if let Some(ip) = &self.ip_address {
            write!(f, "\n  IP: {}", ip)?;
        }
        
        if let Some(gateway) = &self.gateway {
            write!(f, "\n  Gateway: {}", gateway)?;
        }
        
        if !self.dns_servers.is_empty() {
            write!(f, "\n  DNS: {}", self.dns_servers.join(", "))?;
        }
        
        if let Some(wireless) = &self.wireless_info {
            write!(f, "\n  Wireless:")?;
            if let Some(ssid) = &wireless.ssid {
                write!(f, "\n    SSID: {}", ssid)?;
            }
            if let Some(freq) = wireless.frequency {
                write!(f, "\n    Frequency: {} MHz", freq)?;
            }
            if let Some(signal) = wireless.signal_strength {
                write!(f, "\n    Signal: {} dBm", signal)?;
            }
            write!(f, "\n    Connected: {}", wireless.connected)?;
        }
        
        Ok(())
    }
} 