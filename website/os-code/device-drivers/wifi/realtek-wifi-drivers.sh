#!/bin/bash
# Realtek Wi-Fi Driver Installation
# Supports: RTL8188, RTL8192, RTL8821, RTL8822, RTL8852, RTL8852A, RTL8852B

echo "📡 Installing Realtek Wi-Fi drivers..."

# Download Realtek drivers
wget -q https://github.com/OpenIntelWireless/rtlwifi/archive/refs/heads/master.zip
unzip -q master.zip

# Build and install
cd rtlwifi-master
make
sudo make install

# Load module
sudo modprobe rtlwifi

echo "✅ Realtek Wi-Fi drivers installed successfully!"
