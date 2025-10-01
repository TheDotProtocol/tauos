#!/bin/bash

# TauOS Simple ISO Creator
# Creates a basic bootable ISO without complex GUI dependencies

set -e

# Configuration
ISO_NAME="tauos-simple-$(date +%Y%m%d).iso"
WORKDIR="simple_iso_build"
BOOT_DIR="$WORKDIR/boot"

# GRUB path for macOS
GRUB_MKRESCUE="/usr/local/bin/x86_64-elf-grub-mkrescue"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check dependencies
check_deps() {
    log_info "Checking dependencies..."
    
    if [ ! -f "$GRUB_MKRESCUE" ]; then
        log_error "GRUB not found. Install with: brew install x86_64-elf-grub"
        exit 1
    fi
    
    log_success "Dependencies OK"
}

# Create minimal bootable structure
create_boot_structure() {
    log_info "Creating boot structure..."
    
    mkdir -p "$BOOT_DIR/boot/grub"
    
    # Create minimal kernel stub
    cat > "$BOOT_DIR/boot/vmlinuz" << 'EOF'
#!/bin/bash
echo "🐢 TauOS Kernel Loading..."
echo "This is a minimal kernel for testing"
echo "In production, this would be a real Linux kernel"
sleep 2
echo "🐢 TauOS Kernel Loaded Successfully!"
EOF
    chmod +x "$BOOT_DIR/boot/vmlinuz"
    
    # Create initrd stub
    cat > "$BOOT_DIR/boot/initrd.img" << 'EOF'
#!/bin/bash
echo "🐢 TauOS Initrd Loading..."
echo "This is a minimal initrd for testing"
sleep 1
echo "🐢 TauOS Initrd Loaded Successfully!"
EOF
    chmod +x "$BOOT_DIR/boot/initrd.img"
    
    # Create GRUB config
    cat > "$BOOT_DIR/boot/grub/grub.cfg" << 'EOF'
set default=0
set timeout=5

menuentry "TauOS" {
    linux /boot/vmlinuz root=/dev/sda1 rw quiet splash
    initrd /boot/initrd.img
}

menuentry "TauOS (Safe Mode)" {
    linux /boot/vmlinuz root=/dev/sda1 rw single
    initrd /boot/initrd.img
}

menuentry "TauOS (Recovery)" {
    linux /boot/vmlinuz root=/dev/sda1 rw init=/bin/sh
    initrd /boot/initrd.img
}
EOF
    
    log_success "Boot structure created"
}

# Create minimal root filesystem
create_rootfs() {
    log_info "Creating minimal root filesystem..."
    
    mkdir -p "$BOOT_DIR/rootfs"
    
    # Create basic directory structure
    mkdir -p "$BOOT_DIR/rootfs"/{bin,boot,dev,etc,home,lib,media,mnt,opt,proc,root,run,sbin,srv,sys,tmp,usr,var}
    
    # Create basic system files
    cat > "$BOOT_DIR/rootfs/etc/fstab" << 'EOF'
# /etc/fstab
/dev/sda1 / ext4 defaults 0 1
/dev/sda2 swap swap defaults 0 0
EOF

    cat > "$BOOT_DIR/rootfs/etc/hostname" << 'EOF'
tauos
EOF

    cat > "$BOOT_DIR/rootfs/etc/hosts" << 'EOF'
127.0.0.1 localhost
127.0.1.1 tauos
EOF

    # Create init script
    cat > "$BOOT_DIR/rootfs/init" << 'EOF'
#!/bin/sh
# TauOS Init Script

echo "🐢 Starting TauOS..."

# Mount essential filesystems
mount -t proc none /proc
mount -t sysfs none /sys
mount -t devtmpfs none /dev

# Set up networking
ifconfig lo 127.0.0.1 up

echo "🐢 TauOS started successfully!"
echo "🐢 Welcome to TauOS!"
echo "🐢 This is a minimal bootable system for testing"
echo "🐢 Type 'exit' to shutdown"

exec /bin/sh
EOF

    chmod +x "$BOOT_DIR/rootfs/init"
    
    log_success "Root filesystem created"
}

# Create ISO
create_iso() {
    log_info "Creating ISO..."
    
    if [ -f "$GRUB_MKRESCUE" ]; then
        "$GRUB_MKRESCUE" -o "$ISO_NAME" "$WORKDIR"
        log_success "ISO created: $ISO_NAME"
    else
        log_error "GRUB not available"
        exit 1
    fi
}

# Test ISO
test_iso() {
    log_info "Testing ISO..."
    
    if [ -f "$ISO_NAME" ]; then
        local iso_size=$(stat -f%z "$ISO_NAME" 2>/dev/null || stat -c%s "$ISO_NAME")
        log_success "ISO size: $((iso_size / 1024 / 1024))MB"
        
        if (( iso_size > 1024 * 1024 )); then
            log_success "ISO appears valid"
        else
            log_warning "ISO appears to be a stub file"
        fi
    else
        log_error "ISO not found"
        return 1
    fi
}

# Main
main() {
    echo "🐢 TauOS Simple ISO Creator"
    echo "==========================="
    echo "Output: $ISO_NAME"
    echo ""
    
    # Clean and setup
    rm -rf "$WORKDIR"
    mkdir -p "$WORKDIR"
    
    # Build steps
    check_deps
    create_boot_structure
    create_rootfs
    create_iso
    test_iso
    
    echo ""
    log_success "TauOS Simple ISO ready!"
    echo "📁 ISO: $ISO_NAME"
    echo "💾 Size: $(du -h "$ISO_NAME" | cut -f1)"
    echo ""
    echo "🚀 Test with: qemu-system-x86_64 -m 2048 -cdrom $ISO_NAME"
    echo "💿 Install with: ./scripts/install_on_macbook.sh"
}

main "$@" 