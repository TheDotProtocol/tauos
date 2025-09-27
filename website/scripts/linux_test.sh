#!/bin/bash

# TauOS Linux Testing Script
# Tests TauOS in various Linux virtualization environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🐢 TauOS Linux Testing"
echo "======================"

# Check if we're on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${RED}❌ This script should be run on Linux${NC}"
    exit 1
fi

# Function to test VM tool
test_vm_tool() {
    local tool_name="$1"
    local command="$2"
    local test_name="$3"
    
    echo -n "Testing $tool_name... "
    if command -v "$command" &> /dev/null; then
        echo -e "${GREEN}✅ Available${NC}"
        return 0
    else
        echo -e "${RED}❌ Not available${NC}"
        return 1
    fi
}

# Test various virtualization tools
echo ""
echo "=== Virtualization Tools ==="

VM_TOOLS=()
test_vm_tool "QEMU" "qemu-system-x86_64" "qemu" && VM_TOOLS+=("QEMU")
test_vm_tool "VirtualBox" "VBoxManage" "virtualbox" && VM_TOOLS+=("VirtualBox")
test_vm_tool "GNOME Boxes" "gnome-boxes" "gnome_boxes" && VM_TOOLS+=("GNOME Boxes")
test_vm_tool "VMware" "vmware" "vmware" && VM_TOOLS+=("VMware")
test_vm_tool "KVM" "kvm" "kvm" && VM_TOOLS+=("KVM")

echo ""
echo "Available VM tools: ${VM_TOOLS[*]}"

# Test ISO file
echo ""
echo "=== ISO Testing ==="

if [ -f "build/tauos.iso" ]; then
    echo -e "${GREEN}✅ TauOS ISO found${NC}"
    
    # Check ISO size
    ISO_SIZE=$(stat -c%s "build/tauos.iso")
    echo "ISO size: $ISO_SIZE bytes"
    
    if [ "$ISO_SIZE" -gt 1024 ]; then
        echo -e "${GREEN}✅ ISO appears to be valid${NC}"
    else
        echo -e "${YELLOW}⚠️  ISO appears to be a stub file${NC}"
    fi
    
    # Test ISO structure
    if command -v isoinfo &> /dev/null; then
        echo "Testing ISO structure..."
        if isoinfo -R -i build/tauos.iso | head -20; then
            echo -e "${GREEN}✅ ISO structure appears valid${NC}"
        else
            echo -e "${RED}❌ ISO structure test failed${NC}"
        fi
    fi
else
    echo -e "${RED}❌ TauOS ISO not found${NC}"
    echo "Please build the ISO first using: ./scripts/package_qemu_image.sh"
fi

# Test QEMU boot (if available)
if command -v qemu-system-x86_64 &> /dev/null && [ -f "build/tauos.iso" ]; then
    echo ""
    echo "=== QEMU Boot Test ==="
    echo "Testing QEMU boot (30 second timeout)..."
    
    # Test boot in QEMU with timeout
    timeout 30s qemu-system-x86_64 \
        -m 2048 \
        -smp 2 \
        -cdrom build/tauos.iso \
        -boot d \
        -nographic \
        -serial mon:stdio \
        -no-reboot \
        -no-shutdown || true
    
    echo "QEMU boot test completed"
fi

# Test VirtualBox (if available)
if command -v VBoxManage &> /dev/null; then
    echo ""
    echo "=== VirtualBox Test ==="
    echo "Creating VirtualBox VM for testing..."
    
    # Create a test VM
    VBoxManage createvm --name "TauOS-Test" --ostype "Linux_64" --register
    VBoxManage modifyvm "TauOS-Test" --memory 2048 --cpus 2
    VBoxManage modifyvm "TauOS-Test" --boot1 dvd --boot2 none --boot3 none --boot4 none
    
    if [ -f "build/tauos.iso" ]; then
        VBoxManage storagectl "TauOS-Test" --name "IDE Controller" --add ide
        VBoxManage storageattach "TauOS-Test" --storagectl "IDE Controller" --port 0 --device 0 --type dvddrive --medium "build/tauos.iso"
        echo -e "${GREEN}✅ VirtualBox VM created with TauOS ISO${NC}"
    else
        echo -e "${YELLOW}⚠️  VirtualBox VM created but no ISO available${NC}"
    fi
    
    # Clean up test VM
    VBoxManage unregistervm "TauOS-Test" --delete
fi

# Test bare metal boot preparation
echo ""
echo "=== Bare Metal Boot Test ==="

if command -v dd &> /dev/null; then
    echo -e "${GREEN}✅ dd available for USB flashing${NC}"
    
    # Show available USB devices
    echo "Available USB devices:"
    lsblk | grep -E "sd[a-z][0-9]*|nvme[0-9]+n[0-9]+p[0-9]+" || echo "No USB devices detected"
    
    # Create USB flashing script
    cat > "flash_tauos_usb.sh" << 'EOF'
#!/bin/bash

# TauOS USB Flashing Script
# Creates bootable USB from TauOS ISO

set -e

echo "🐢 TauOS USB Flashing Tool"
echo "=========================="

if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

if [ ! -f "build/tauos.iso" ]; then
    echo "❌ TauOS ISO not found. Please build the ISO first."
    exit 1
fi

echo "Available USB devices:"
lsblk | grep -E "sd[a-z][0-9]*|nvme[0-9]+n[0-9]+p[0-9]+"

echo ""
echo "⚠️  WARNING: This will ERASE ALL DATA on the selected USB device!"
echo ""

read -p "Enter USB device (e.g., /dev/sdb): " USB_DEVICE

if [ -z "$USB_DEVICE" ]; then
    echo "❌ No device specified"
    exit 1
fi

if [ ! -b "$USB_DEVICE" ]; then
    echo "❌ Device $USB_DEVICE not found"
    exit 1
fi

echo ""
echo "About to flash $USB_DEVICE with TauOS ISO"
echo "This will ERASE ALL DATA on $USB_DEVICE"
echo ""
read -p "Are you sure? Type 'YES' to continue: " CONFIRM

if [ "$CONFIRM" != "YES" ]; then
    echo "❌ Operation cancelled"
    exit 1
fi

echo "🔄 Flashing TauOS to $USB_DEVICE..."
echo "This may take several minutes..."

# Unmount any mounted partitions
umount ${USB_DEVICE}* 2>/dev/null || true

# Flash the ISO
dd if=build/tauos.iso of=$USB_DEVICE bs=4M status=progress conv=fdatasync

echo ""
echo "✅ TauOS flashed to $USB_DEVICE successfully!"
echo "You can now boot from this USB device."
echo ""
echo "Note: Some systems may require disabling Secure Boot to boot from USB."
EOF
    
    chmod +x "flash_tauos_usb.sh"
    echo -e "${GREEN}✅ USB flashing script created: flash_tauos_usb.sh${NC}"
else
    echo -e "${RED}❌ dd not available${NC}"
fi

# Test UEFI compatibility
echo ""
echo "=== UEFI Compatibility Test ==="

if [ -d "/sys/firmware/efi" ]; then
    echo -e "${GREEN}✅ System supports UEFI${NC}"
    
    # Check for secure boot
    if command -v mokutil &> /dev/null; then
        if mokutil --sb-state 2>/dev/null | grep -q "SecureBoot enabled"; then
            echo -e "${YELLOW}⚠️  Secure Boot is enabled${NC}"
            echo "   You may need to disable Secure Boot to boot TauOS"
        else
            echo -e "${GREEN}✅ Secure Boot is disabled${NC}"
        fi
    fi
    
    # Test ISO UEFI compatibility
    if [ -f "build/tauos.iso" ] && command -v isoinfo &> /dev/null; then
        echo "Testing ISO UEFI compatibility..."
        if isoinfo -R -i build/tauos.iso | grep -q "EFI"; then
            echo -e "${GREEN}✅ ISO contains UEFI boot files${NC}"
        else
            echo -e "${RED}❌ ISO does not contain UEFI boot files${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  System does not support UEFI (legacy BIOS)${NC}"
fi

# Test different Linux distributions
echo ""
echo "=== Linux Distribution Test ==="

if [ -f "/etc/os-release" ]; then
    source /etc/os-release
    echo "Distribution: $PRETTY_NAME"
    echo "Version: $VERSION"
    
    case $ID in
        "ubuntu"|"debian")
            echo -e "${GREEN}✅ Ubuntu/Debian detected${NC}"
            echo "Testing apt package manager..."
            if command -v apt &> /dev/null; then
                echo -e "${GREEN}✅ apt available${NC}"
            fi
            ;;
        "arch"|"manjaro")
            echo -e "${GREEN}✅ Arch Linux detected${NC}"
            echo "Testing pacman package manager..."
            if command -v pacman &> /dev/null; then
                echo -e "${GREEN}✅ pacman available${NC}"
            fi
            ;;
        "fedora"|"rhel"|"centos")
            echo -e "${GREEN}✅ Red Hat family detected${NC}"
            echo "Testing dnf/yum package manager..."
            if command -v dnf &> /dev/null || command -v yum &> /dev/null; then
                echo -e "${GREEN}✅ dnf/yum available${NC}"
            fi
            ;;
        *)
            echo -e "${YELLOW}⚠️  Unknown distribution: $ID${NC}"
            ;;
    esac
fi

# Test system requirements
echo ""
echo "=== System Requirements Test ==="

# Check CPU
CPU_CORES=$(nproc)
echo "CPU cores: $CPU_CORES"
if [ "$CPU_CORES" -ge 2 ]; then
    echo -e "${GREEN}✅ CPU requirements met${NC}"
else
    echo -e "${YELLOW}⚠️  CPU may be insufficient for optimal performance${NC}"
fi

# Check memory
MEMORY_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
MEMORY_MB=$((MEMORY_KB / 1024))
echo "Memory: ${MEMORY_MB}MB"
if [ "$MEMORY_MB" -ge 2048 ]; then
    echo -e "${GREEN}✅ Memory requirements met${NC}"
else
    echo -e "${YELLOW}⚠️  Memory may be insufficient for optimal performance${NC}"
fi

# Check disk space
DISK_SPACE=$(df . | awk 'NR==2 {print $4}')
DISK_SPACE_MB=$((DISK_SPACE / 1024))
echo "Available disk space: ${DISK_SPACE_MB}MB"
if [ "$DISK_SPACE_MB" -ge 1024 ]; then
    echo -e "${GREEN}✅ Disk space requirements met${NC}"
else
    echo -e "${YELLOW}⚠️  Disk space may be insufficient${NC}"
fi

# Generate test report
echo ""
echo "=== Test Report ==="

REPORT_FILE="linux_test_report.txt"
{
    echo "TauOS Linux Test Report"
    echo "======================"
    echo "Generated: $(date)"
    echo ""
    echo "System Information:"
    echo "- Distribution: ${PRETTY_NAME:-Unknown}"
    echo "- Kernel: $(uname -r)"
    echo "- Architecture: $(uname -m)"
    echo "- CPU cores: $CPU_CORES"
    echo "- Memory: ${MEMORY_MB}MB"
    echo "- Disk space: ${DISK_SPACE_MB}MB"
    echo ""
    echo "Virtualization Tools:"
    for tool in "${VM_TOOLS[@]}"; do
        echo "- ✅ $tool"
    done
    echo ""
    echo "ISO Status:"
    if [ -f "build/tauos.iso" ]; then
        echo "- ✅ ISO found (${ISO_SIZE} bytes)"
    else
        echo "- ❌ ISO not found"
    fi
    echo ""
    echo "UEFI Support:"
    if [ -d "/sys/firmware/efi" ]; then
        echo "- ✅ UEFI supported"
    else
        echo "- ⚠️  Legacy BIOS only"
    fi
} > "$REPORT_FILE"

echo -e "${GREEN}✅ Test report generated: $REPORT_FILE${NC}"

echo ""
echo "=== Summary ==="
echo "Linux testing completed!"
echo "Available VM tools: ${VM_TOOLS[*]}"
echo "Test report: $REPORT_FILE"
echo ""
echo "Next steps:"
echo "1. Test the ISO in your preferred VM tool"
echo "2. For bare metal testing, use: sudo ./flash_tauos_usb.sh"
echo "3. Check the test report for detailed results" 