#!/bin/bash

# TauOS MacBook Pro Installation Script
# Handles installation on Apple hardware with specific considerations

set -e

# Configuration
ISO_FILE="tauos-x86_64-$(date +%Y%m%d).iso"
USB_DEVICE=""
MACBOOK_MODEL=""
MACBOOK_YEAR=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Detect MacBook model
detect_macbook() {
    log_info "Detecting MacBook model..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        MACBOOK_MODEL=$(system_profiler SPHardwareDataType | grep "Model Name" | cut -d: -f2 | xargs)
        MACBOOK_YEAR=$(system_profiler SPHardwareDataType | grep "Model Identifier" | cut -d: -f2 | xargs)
        
        log_success "Detected: $MACBOOK_MODEL ($MACBOOK_YEAR)"
        
        # Check if it's an Intel MacBook
        if [[ "$MACBOOK_YEAR" == *"MacBookPro"* ]] && [[ "$MACBOOK_YEAR" != *"Apple"* ]]; then
            log_success "Intel MacBook Pro detected - compatible with TauOS"
        else
            log_warning "Apple Silicon MacBook detected - may have compatibility issues"
            log_info "TauOS is primarily designed for x86_64 architecture"
        fi
    else
        log_warning "Not running on macOS - assuming Intel MacBook Pro"
    fi
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."
    
    # Check available memory
    if [[ "$OSTYPE" == "darwin"* ]]; then
        local mem_total=$(sysctl -n hw.memsize | awk '{print $0/1024/1024}')
        if (( $(echo "$mem_total < 2048" | bc -l) )); then
            log_warning "System has less than 2GB RAM (${mem_total%.*}MB)"
            log_warning "TauOS requires at least 2GB RAM for optimal performance"
        else
            log_success "Memory: ${mem_total%.*}MB - sufficient"
        fi
        
        # Check available disk space
        local disk_space=$(df / | tail -1 | awk '{print $4}')
        if (( disk_space < 8388608 )); then
            log_error "Insufficient disk space. Need at least 8GB free space"
            exit 1
        else
            log_success "Disk space: $((disk_space / 1024 / 1024))GB - sufficient"
        fi
    else
        log_warning "Cannot check system requirements on non-macOS system"
    fi
}

# List available USB devices
list_usb_devices() {
    log_info "Available USB devices:"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        diskutil list | grep -E "/dev/disk[0-9]+" | while read -r line; do
            local device=$(echo "$line" | awk '{print $NF}')
            local size=$(diskutil info "$device" | grep "Total Size" | awk '{print $3, $4}')
            local name=$(diskutil info "$device" | grep "Volume Name" | awk '{print $3}')
            echo "  $device ($size) - $name"
        done
    else
        lsblk -d -o NAME,SIZE,MODEL | grep -E "sd[a-z]$"
    fi
}

# Create bootable USB
create_bootable_usb() {
    log_info "Creating bootable USB drive..."
    
    if [ -z "$USB_DEVICE" ]; then
        log_error "No USB device specified"
        exit 1
    fi
    
    # Check if ISO exists
    if [ ! -f "$ISO_FILE" ]; then
        log_error "ISO file not found: $ISO_FILE"
        log_info "Please build the ISO first: ./scripts/build_real_iso.sh"
        exit 1
    fi
    
    # Confirm before writing
    log_warning "This will ERASE ALL DATA on $USB_DEVICE"
    read -p "Are you sure you want to continue? (y/N): " confirm
    
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        log_info "Installation cancelled"
        exit 0
    fi
    
    # Unmount USB if mounted
    if [[ "$OSTYPE" == "darwin"* ]]; then
        diskutil unmountDisk "$USB_DEVICE" 2>/dev/null || true
    fi
    
    # Write ISO to USB
    log_info "Writing ISO to USB drive (this may take several minutes)..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sudo dd if="$ISO_FILE" of="$USB_DEVICE" bs=4m status=progress
    else
        sudo dd if="$ISO_FILE" of="$USB_DEVICE" bs=4M status=progress
    fi
    
    # Sync to ensure write completion
    sync
    
    log_success "Bootable USB created successfully"
}

# Configure boot options
configure_boot() {
    log_info "Configuring boot options..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        log_info "To boot from USB on MacBook Pro:"
        echo "1. Insert the USB drive"
        echo "2. Restart your MacBook Pro"
        echo "3. Hold Option (⌥) key during startup"
        echo "4. Select 'EFI Boot' or 'TauOS' from the boot menu"
        echo ""
        echo "Alternative method (if Option key doesn't work):"
        echo "1. Restart and hold Command (⌘) + R"
        echo "2. Open Terminal from Recovery Mode"
        echo "3. Run: bless --device /dev/diskX --setBoot"
        echo "   (Replace diskX with your USB device)"
    else
        log_info "To boot from USB:"
        echo "1. Insert the USB drive"
        echo "2. Restart and enter BIOS/UEFI (usually F2, F12, or Del)"
        echo "3. Change boot order to prioritize USB"
        echo "4. Save and exit"
    fi
}

# Installation instructions
show_installation_instructions() {
    echo ""
    echo "🐢 TauOS Installation Instructions"
    echo "================================="
    echo ""
    echo "1. **Prepare USB Drive**:"
    echo "   - Use a USB 3.0 drive with at least 4GB capacity"
    echo "   - The drive will be completely erased"
    echo ""
    echo "2. **Boot from USB**:"
    echo "   - Insert USB drive"
    echo "   - Restart MacBook Pro"
    echo "   - Hold Option (⌥) key during startup"
    echo "   - Select 'EFI Boot' from boot menu"
    echo ""
    echo "3. **Install TauOS**:"
    echo "   - Choose 'Install TauOS' from GRUB menu"
    echo "   - Follow the installation wizard"
    echo "   - Recommended: 20GB+ for root partition"
    echo ""
    echo "4. **Post-Installation**:"
    echo "   - Remove USB drive when prompted"
    echo "   - Restart to boot into TauOS"
    echo ""
    echo "⚠️  **Important Notes**:"
    echo "   - Backup all important data before installation"
    echo "   - TauOS will replace your current operating system"
    echo "   - You can dual-boot by creating separate partitions"
    echo ""
    echo "🆘 **Troubleshooting**:"
    echo "   - If boot fails, try Safe Mode option"
    echo "   - For recovery, use Recovery Mode option"
    echo "   - Check hardware compatibility in TauOS documentation"
}

# Main installation process
main() {
    echo "🐢 TauOS MacBook Pro Installer"
    echo "==============================="
    echo ""
    
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        log_error "Do not run this script as root"
        exit 1
    fi
    
    # Detect MacBook
    detect_macbook
    
    # Check requirements
    check_requirements
    
    # List USB devices
    list_usb_devices
    
    # Get USB device from user
    echo ""
    read -p "Enter USB device (e.g., /dev/disk2): " USB_DEVICE
    
    if [ -z "$USB_DEVICE" ]; then
        log_error "No USB device specified"
        exit 1
    fi
    
    # Validate USB device
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! diskutil list | grep -q "$USB_DEVICE"; then
            log_error "Invalid USB device: $USB_DEVICE"
            exit 1
        fi
    else
        if [ ! -b "$USB_DEVICE" ]; then
            log_error "Invalid USB device: $USB_DEVICE"
            exit 1
        fi
    fi
    
    # Create bootable USB
    create_bootable_usb
    
    # Configure boot options
    configure_boot
    
    # Show installation instructions
    show_installation_instructions
    
    log_success "TauOS installation preparation complete!"
    echo ""
    echo "📁 USB drive: $USB_DEVICE"
    echo "💿 ISO file: $ISO_FILE"
    echo "🖥️  Target: $MACBOOK_MODEL"
    echo ""
    echo "🚀 Ready to install TauOS on your MacBook Pro!"
}

# Run main function
main "$@" 