#!/bin/bash

# TauOS QEMU Testing Setup
# Supports both Intel and ARM architectures
# Includes UEFI support and persistent state

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ISO_PATH="./tauos-simple-20250730.iso"
VM_NAME="tauos-test"
RAM_SIZE="4G"
CPU_CORES="2"
DISK_SIZE="20G"
UEFI_ENABLED=true
PERSISTENT_STORAGE=true

# Detect architecture
ARCH=$(uname -m)
echo -e "${BLUE}🐢 Detected architecture: $ARCH${NC}"

# Function to check dependencies
check_dependencies() {
    echo -e "${YELLOW}🔍 Checking QEMU dependencies...${NC}"
    
    local missing_deps=()
    
    if ! command -v qemu-system-x86_64 &> /dev/null; then
        missing_deps+=("qemu-system-x86_64")
    fi
    
    if ! command -v qemu-system-aarch64 &> /dev/null; then
        missing_deps+=("qemu-system-aarch64")
    fi
    
    # Note: OVMF/UEFI firmware is optional and not available on macOS via Homebrew
    # The script will work fine without it using legacy BIOS mode
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing dependencies: ${missing_deps[*]}${NC}"
        echo -e "${YELLOW}📦 Installing dependencies...${NC}"
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install qemu
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            if command -v apt-get &> /dev/null; then
                sudo apt-get update
                sudo apt-get install -y qemu-system-x86 qemu-system-arm ovmf
            elif command -v dnf &> /dev/null; then
                sudo dnf install -y qemu-kvm qemu-system-x86 qemu-system-aarch64 edk2-ovmf
            elif command -v pacman &> /dev/null; then
                sudo pacman -S qemu ovmf
            fi
        fi
    else
        echo -e "${GREEN}✅ All dependencies found${NC}"
        echo -e "${YELLOW}ℹ️  Note: UEFI firmware not installed - will use legacy BIOS mode${NC}"
    fi
}

# Function to create VM directory structure
setup_vm_directory() {
    echo -e "${YELLOW}📁 Setting up VM directory structure...${NC}"
    
    mkdir -p "./qemu-vms/$VM_NAME"
    mkdir -p "./qemu-vms/$VM_NAME/disks"
    mkdir -p "./qemu-vms/$VM_NAME/efi"
    
    echo -e "${GREEN}✅ VM directory structure created${NC}"
}

# Function to create virtual disk
create_virtual_disk() {
    local disk_path="./qemu-vms/$VM_NAME/disks/tauos-disk.qcow2"
    
    if [ ! -f "$disk_path" ]; then
        echo -e "${YELLOW}💾 Creating virtual disk ($DISK_SIZE)...${NC}"
        qemu-img create -f qcow2 "$disk_path" "$DISK_SIZE"
        echo -e "${GREEN}✅ Virtual disk created: $disk_path${NC}"
    else
        echo -e "${GREEN}✅ Virtual disk already exists: $disk_path${NC}"
    fi
}

# Function to get QEMU binary based on architecture
get_qemu_binary() {
    if [ "$ARCH" = "x86_64" ] || [ "$ARCH" = "amd64" ]; then
        echo "qemu-system-x86_64"
    elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
        echo "qemu-system-aarch64"
    else
        echo -e "${RED}❌ Unsupported architecture: $ARCH${NC}"
        exit 1
    fi
}

# Function to get UEFI firmware path
get_uefi_firmware() {
    if [ "$ARCH" = "x86_64" ] || [ "$ARCH" = "amd64" ]; then
        # Look for OVMF firmware
        local ovmf_paths=(
            "/usr/share/ovmf/OVMF.fd"
            "/usr/share/edk2/ovmf/OVMF.fd"
            "/opt/homebrew/share/qemu/edk2-x86_64-code.fd"
            "/usr/local/share/qemu/edk2-x86_64-code.fd"
        )
        
        for path in "${ovmf_paths[@]}"; do
            if [ -f "$path" ]; then
                echo "$path"
                return 0
            fi
        done
        
        echo -e "${YELLOW}⚠️  OVMF firmware not found, using legacy BIOS${NC}"
        echo ""
    elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
        # Look for ARM UEFI firmware
        local arm_firmware_paths=(
            "/usr/share/qemu-efi-aarch64/QEMU_EFI.fd"
            "/opt/homebrew/share/qemu/edk2-aarch64-code.fd"
            "/usr/local/share/qemu/edk2-aarch64-code.fd"
        )
        
        for path in "${arm_firmware_paths[@]}"; do
            if [ -f "$path" ]; then
                echo "$path"
                return 0
            fi
        done
        
        echo -e "${YELLOW}⚠️  ARM UEFI firmware not found, using legacy BIOS${NC}"
        echo ""
    fi
}

# Function to build QEMU command
build_qemu_command() {
    local qemu_bin=$(get_qemu_binary)
    local disk_path="./qemu-vms/$VM_NAME/disks/tauos-disk.qcow2"
    local efi_firmware=$(get_uefi_firmware)
    
    local cmd="$qemu_bin"
    
    # Basic VM configuration
    cmd="$cmd -m $RAM_SIZE"
    cmd="$cmd -smp $CPU_CORES"
    cmd="$cmd -enable-kvm"
    cmd="$cmd -cpu host"
    
    # UEFI configuration
    if [ "$UEFI_ENABLED" = true ] && [ -n "$efi_firmware" ]; then
        cmd="$cmd -bios $efi_firmware"
        echo -e "${GREEN}✅ UEFI enabled with firmware: $efi_firmware${NC}"
    else
        echo -e "${YELLOW}⚠️  Using legacy BIOS mode${NC}"
    fi
    
    # Storage configuration
    cmd="$cmd -drive file=$disk_path,if=virtio,cache=writeback"
    cmd="$cmd -drive file=$ISO_PATH,if=virtio,media=cdrom,readonly=on"
    
    # Network configuration
    cmd="$cmd -net nic,model=virtio"
    cmd="$cmd -net user"
    
    # Display configuration
    cmd="$cmd -display gtk"
    cmd="$cmd -vga virtio"
    
    # Audio configuration
    cmd="$cmd -soundhw ac97"
    
    # USB support
    cmd="$cmd -usb"
    cmd="$cmd -device usb-tablet"
    
    # Performance optimizations
    cmd="$cmd -cpu host"
    cmd="$cmd -enable-kvm"
    cmd="$cmd -machine type=q35,accel=kvm"
    
    echo "$cmd"
}

# Function to start VM
start_vm() {
    echo -e "${BLUE}🚀 Starting TauOS in QEMU...${NC}"
    echo -e "${YELLOW}📋 VM Configuration:${NC}"
    echo -e "   Architecture: $ARCH"
    echo -e "   RAM: $RAM_SIZE"
    echo -e "   CPU Cores: $CPU_CORES"
    echo -e "   Disk Size: $DISK_SIZE"
    echo -e "   UEFI: $UEFI_ENABLED"
    echo -e "   Persistent Storage: $PERSISTENT_STORAGE"
    echo ""
    
    local qemu_cmd=$(build_qemu_command)
    
    echo -e "${GREEN}✅ Starting VM with command:${NC}"
    echo "$qemu_cmd"
    echo ""
    
    # Start the VM
    eval "$qemu_cmd"
}

# Function to create headless VM for testing
create_headless_vm() {
    echo -e "${YELLOW}🖥️  Creating headless VM for automated testing...${NC}"
    
    local qemu_bin=$(get_qemu_binary)
    local disk_path="./qemu-vms/$VM_NAME/disks/tauos-disk.qcow2"
    local efi_firmware=$(get_uefi_firmware)
    
    local cmd="$qemu_bin"
    cmd="$cmd -m $RAM_SIZE"
    cmd="$cmd -smp $CPU_CORES"
    cmd="$cmd -enable-kvm"
    cmd="$cmd -cpu host"
    
    if [ -n "$efi_firmware" ]; then
        cmd="$cmd -bios $efi_firmware"
    fi
    
    cmd="$cmd -drive file=$disk_path,if=virtio,cache=writeback"
    cmd="$cmd -drive file=$ISO_PATH,if=virtio,media=cdrom,readonly=on"
    cmd="$cmd -net nic,model=virtio"
    cmd="$cmd -net user"
    cmd="$cmd -display none"
    cmd="$cmd -serial stdio"
    cmd="$cmd -machine type=q35,accel=kvm"
    
    echo -e "${GREEN}✅ Headless VM command:${NC}"
    echo "$cmd"
    echo ""
    echo -e "${YELLOW}💡 To run headless VM:${NC}"
    echo "eval \"$cmd\""
}

# Function to show VM management options
show_management_options() {
    echo -e "${BLUE}🔧 VM Management Options:${NC}"
    echo ""
    echo -e "${YELLOW}📁 VM Location:${NC}"
    echo "   ./qemu-vms/$VM_NAME/"
    echo ""
    echo -e "${YELLOW}💾 Disk Image:${NC}"
    echo "   ./qemu-vms/$VM_NAME/disks/tauos-disk.qcow2"
    echo ""
    echo -e "${YELLOW}🛠️  Useful Commands:${NC}"
    echo "   # Resize disk:"
    echo "   qemu-img resize ./qemu-vms/$VM_NAME/disks/tauos-disk.qcow2 +10G"
    echo ""
    echo "   # Create snapshot:"
    echo "   qemu-img snapshot -c snapshot1 ./qemu-vms/$VM_NAME/disks/tauos-disk.qcow2"
    echo ""
    echo "   # Restore snapshot:"
    echo "   qemu-img snapshot -a snapshot1 ./qemu-vms/$VM_NAME/disks/tauos-disk.qcow2"
    echo ""
    echo "   # Convert to other formats:"
    echo "   qemu-img convert -f qcow2 -O raw ./qemu-vms/$VM_NAME/disks/tauos-disk.qcow2 tauos-disk.raw"
}

# Main execution
main() {
    echo -e "${BLUE}🐢 TauOS QEMU Testing Setup${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    # Check if ISO exists
    if [ ! -f "$ISO_PATH" ]; then
        echo -e "${RED}❌ ISO file not found: $ISO_PATH${NC}"
        echo -e "${YELLOW}💡 Please run the ISO build script first:${NC}"
        echo "   ./scripts/create_simple_iso.sh"
        exit 1
    fi
    
    echo -e "${GREEN}✅ ISO found: $ISO_PATH${NC}"
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Setup VM directory
    setup_vm_directory
    
    # Create virtual disk
    create_virtual_disk
    
    echo ""
    echo -e "${GREEN}✅ QEMU setup complete!${NC}"
    echo ""
    
    # Show management options
    show_management_options
    
    echo ""
    echo -e "${BLUE}🎯 Ready to start TauOS VM!${NC}"
    echo ""
    
    # Ask user what to do
    echo -e "${YELLOW}What would you like to do?${NC}"
    echo "1) Start GUI VM (recommended for testing)"
    echo "2) Start headless VM (for automated testing)"
    echo "3) Show VM management options"
    echo "4) Exit"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            start_vm
            ;;
        2)
            create_headless_vm
            ;;
        3)
            show_management_options
            ;;
        4)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid choice${NC}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 