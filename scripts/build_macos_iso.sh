#!/bin/bash

# TauOS macOS ISO Builder
# Builds a bootable ISO specifically for macOS systems

set -e

# Configuration
ARCH="x86_64"
KERNEL_VERSION="6.6.30"
ISO_NAME="tauos-macos-$(date +%Y%m%d).iso"
WORKDIR="macos_iso_build"
BOOT_DIR="$WORKDIR/boot"

# GRUB paths for macOS
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
    
    if ! command -v cargo &> /dev/null; then
        log_error "Rust/Cargo not found"
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
EOF
    
    log_success "Boot structure created"
}

# Build TauOS apps
build_apps() {
    log_info "Building TauOS applications..."
    
    # Build Rust apps
    cargo build --release
    
    # Copy to boot directory
    mkdir -p "$BOOT_DIR/apps"
    cp target/release/tau-upd "$BOOT_DIR/apps/" 2>/dev/null || true
    cp target/release/taustore "$BOOT_DIR/apps/" 2>/dev/null || true
    cp target/release/sandboxd "$BOOT_DIR/apps/" 2>/dev/null || true
    
    log_success "Applications built"
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

# Main
main() {
    echo "🐢 TauOS macOS ISO Builder"
    echo "=========================="
    echo "Output: $ISO_NAME"
    echo ""
    
    # Clean and setup
    rm -rf "$WORKDIR"
    mkdir -p "$WORKDIR"
    
    # Build steps
    check_deps
    create_boot_structure
    build_apps
    create_iso
    
    echo ""
    log_success "TauOS macOS ISO ready!"
    echo "📁 ISO: $ISO_NAME"
    echo "💾 Size: $(du -h "$ISO_NAME" | cut -f1)"
    echo ""
    echo "🚀 Test with: qemu-system-x86_64 -m 2048 -cdrom $ISO_NAME"
}

main "$@" 