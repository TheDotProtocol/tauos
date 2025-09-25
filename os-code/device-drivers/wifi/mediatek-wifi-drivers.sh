#!/bin/bash
# MediaTek Wi-Fi Driver Installation
# Supports: MT7601, MT7603, MT7610, MT7612, MT7615, MT7620, MT7628, MT7915

echo "📡 Installing MediaTek Wi-Fi drivers..."

# Download MediaTek drivers
wget -q https://github.com/OpenIntelWireless/mt76/archive/refs/heads/master.zip
unzip -q master.zip

# Build and install
cd mt76-master
make
sudo make install

# Load modules
sudo modprobe mt7601u
sudo modprobe mt7603
sudo modprobe mt7610
sudo modprobe mt7612
sudo modprobe mt7615

echo "✅ MediaTek Wi-Fi drivers installed successfully!"
