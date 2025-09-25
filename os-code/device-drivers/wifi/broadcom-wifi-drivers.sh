#!/bin/bash
# Broadcom Wi-Fi Driver Installation
# Supports: BCM4311, BCM4312, BCM4313, BCM4321, BCM4322, BCM4331, BCM4352, BCM4360

echo "📡 Installing Broadcom Wi-Fi drivers..."

# Download Broadcom drivers
wget -q https://github.com/OpenIntelWireless/broadcom-wl/archive/refs/heads/master.zip
unzip -q master.zip

# Build and install
cd broadcom-wl-master
make
sudo make install

# Load module
sudo modprobe wl

echo "✅ Broadcom Wi-Fi drivers installed successfully!"
