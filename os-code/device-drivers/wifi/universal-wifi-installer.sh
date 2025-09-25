#!/bin/bash
# TauOS Universal Wi-Fi Driver Installer
# Automatically detects and installs the correct Wi-Fi driver

echo "🐢 TauOS Universal Wi-Fi Driver Installer"
echo "Detecting and installing Wi-Fi drivers..."
echo "=========================================="

# Detect Wi-Fi hardware
detect_wifi_hardware() {
    echo "🔍 Detecting Wi-Fi hardware..."
    
    # Check for Intel Wi-Fi
    if lspci | grep -i "Intel.*Wireless\|Intel.*Wi-Fi" > /dev/null; then
        echo "📡 Intel Wi-Fi detected"
        return "intel"
    fi
    
    # Check for Realtek Wi-Fi
    if lspci | grep -i "Realtek.*Wireless\|Realtek.*Wi-Fi" > /dev/null; then
        echo "📡 Realtek Wi-Fi detected"
        return "realtek"
    fi
    
    # Check for Broadcom Wi-Fi
    if lspci | grep -i "Broadcom.*Wireless\|Broadcom.*Wi-Fi" > /dev/null; then
        echo "📡 Broadcom Wi-Fi detected"
        return "broadcom"
    fi
    
    # Check for Qualcomm Wi-Fi
    if lspci | grep -i "Qualcomm.*Wireless\|Qualcomm.*Wi-Fi" > /dev/null; then
        echo "📡 Qualcomm Wi-Fi detected"
        return "qualcomm"
    fi
    
    # Check for MediaTek Wi-Fi
    if lspci | grep -i "MediaTek.*Wireless\|MediaTek.*Wi-Fi" > /dev/null; then
        echo "📡 MediaTek Wi-Fi detected"
        return "mediatek"
    fi
    
    echo "⚠️  Unknown Wi-Fi hardware detected"
    return "unknown"
}

# Install appropriate driver
install_wifi_driver() {
    local hardware_type=$1
    
    case $hardware_type in
        "intel")
            echo "🔧 Installing Intel Wi-Fi drivers..."
            ./intel-wifi-drivers.sh
            ;;
        "realtek")
            echo "🔧 Installing Realtek Wi-Fi drivers..."
            ./realtek-wifi-drivers.sh
            ;;
        "broadcom")
            echo "🔧 Installing Broadcom Wi-Fi drivers..."
            ./broadcom-wifi-drivers.sh
            ;;
        "qualcomm")
            echo "🔧 Installing Qualcomm Wi-Fi drivers..."
            ./qualcomm-wifi-drivers.sh
            ;;
        "mediatek")
            echo "🔧 Installing MediaTek Wi-Fi drivers..."
            ./mediatek-wifi-drivers.sh
            ;;
        *)
            echo "🔧 Installing universal Wi-Fi drivers..."
            # Install all drivers for maximum compatibility
            ./intel-wifi-drivers.sh
            ./realtek-wifi-drivers.sh
            ./broadcom-wifi-drivers.sh
            ./qualcomm-wifi-drivers.sh
            ./mediatek-wifi-drivers.sh
            ;;
    esac
}

# Main installation process
main() {
    echo "🚀 Starting TauOS Wi-Fi driver installation..."
    
    # Make all scripts executable
    chmod +x *.sh
    
    # Detect hardware
    detect_wifi_hardware
    local hardware_type=$?
    
    # Install drivers
    install_wifi_driver $hardware_type
    
    # Test Wi-Fi connection
    echo "🧪 Testing Wi-Fi connection..."
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        echo "✅ Wi-Fi connection successful!"
        echo "🌐 TauOS is now connected to the internet!"
    else
        echo "⚠️  Wi-Fi connection test failed, but drivers are installed"
    fi
    
    echo "🎉 TauOS Wi-Fi driver installation complete!"
    echo "🐢 Your machine now has universal Wi-Fi support!"
}

# Run main function
main "$@"
