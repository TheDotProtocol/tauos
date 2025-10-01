#!/bin/bash
# Intel Wi-Fi Driver Installation
# Supports: AX200, AX201, AX210, 8265, 9260, 9560, 9462, 9461, 9460, 8260, 7265, 7260, 3165, 3160

echo "📡 Installing Intel Wi-Fi drivers..."

# Download Intel Wi-Fi drivers
wget -q https://github.com/OpenIntelWireless/itlwm/releases/latest/download/itlwm.kext.zip
wget -q https://github.com/OpenIntelWireless/IntelBluetoothFirmware/releases/latest/download/IntelBluetoothFirmware.kext.zip

# Extract and install
unzip -q itlwm.kext.zip
unzip -q IntelBluetoothFirmware.kext.zip

# Install drivers
sudo cp -r itlwm.kext /System/Library/Extensions/
sudo cp -r IntelBluetoothFirmware.kext /System/Library/Extensions/

# Load drivers
sudo kextload /System/Library/Extensions/itlwm.kext
sudo kextload /System/Library/Extensions/IntelBluetoothFirmware.kext

echo "✅ Intel Wi-Fi drivers installed successfully!"
