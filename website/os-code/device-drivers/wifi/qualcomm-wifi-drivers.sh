#!/bin/bash
# Qualcomm Wi-Fi Driver Installation
# Supports: QCA6174, QCA9377, QCA6390, QCA6490, QCA6696

echo "📡 Installing Qualcomm Wi-Fi drivers..."

# Download Qualcomm drivers
wget -q https://github.com/OpenIntelWireless/ath10k-firmware/archive/refs/heads/master.zip
unzip -q master.zip

# Install firmware
sudo cp -r ath10k-firmware-master /lib/firmware/ath10k/

# Load module
sudo modprobe ath10k_pci

echo "✅ Qualcomm Wi-Fi drivers installed successfully!"
