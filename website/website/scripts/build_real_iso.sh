#!/bin/bash

# TauOS Real ISO Build Script
# Builds a complete bootable ISO for installation on real hardware

set -e

# Configuration
ARCH=${1:-x86_64}  # x86_64 or arm64
KERNEL_VERSION="6.6.30"
ISO_NAME="tauos-$ARCH-$(date +%Y%m%d).iso"
WORKDIR="iso_build"
ROOTFS_DIR="$WORKDIR/rootfs"
BOOT_DIR="$WORKDIR/boot"

# Detect OS and set GRUB path
if [[ "$OSTYPE" == "darwin"* ]]; then
    GRUB_MKRESCUE="/usr/local/bin/x86_64-elf-grub-mkrescue"
    GRUB_INSTALL="/usr/local/bin/x86_64-elf-grub-install"
else
    GRUB_MKRESCUE="grub-mkrescue"
    GRUB_INSTALL="grub-install"
fi

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

# Check dependencies
check_dependencies() {
    log_info "Checking build dependencies..."
    
    local deps=("cargo" "rustc" "wget" "tar")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    # Check GRUB
    if [ ! -f "$GRUB_MKRESCUE" ]; then
        missing+=("grub-mkrescue")
    fi
    
    if [ ${#missing[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing[*]}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            log_info "Install with: brew install x86_64-elf-grub xorriso wget"
        else
            log_info "Install with: sudo apt install grub-efi xorriso wget tar"
        fi
        exit 1
    fi
    
    log_success "All dependencies available"
}

# Build Linux kernel
build_kernel() {
    log_info "Building Linux kernel for $ARCH..."
    
    cd kernel
    
    if [ ! -d "linux-$KERNEL_VERSION" ]; then
        log_info "Downloading kernel source..."
        wget "https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-$KERNEL_VERSION.tar.xz"
        tar -xf "linux-$KERNEL_VERSION.tar.xz"
    fi
    
    cd "linux-$KERNEL_VERSION"
    
    if [ "$ARCH" = "arm64" ]; then
        make ARCH=arm64 defconfig
        make -j$(nproc) ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu-
        cp arch/arm64/boot/Image ../Image
    else
        make defconfig
        make -j$(nproc)
        cp arch/x86/boot/bzImage ../vmlinuz
    fi
    
    cd ..
    log_success "Kernel build complete"
}

# Create root filesystem
create_rootfs() {
    log_info "Creating root filesystem..."
    
    mkdir -p "$ROOTFS_DIR"
    
    # Create basic directory structure
    mkdir -p "$ROOTFS_DIR"/{bin,boot,dev,etc,home,lib,media,mnt,opt,proc,root,run,sbin,srv,sys,tmp,usr,var}
    
    # Create basic system files
    cat > "$ROOTFS_DIR/etc/fstab" << 'EOF'
# /etc/fstab
/dev/sda1 / ext4 defaults 0 1
/dev/sda2 swap swap defaults 0 0
EOF

    cat > "$ROOTFS_DIR/etc/hostname" << 'EOF'
tauos
EOF

    cat > "$ROOTFS_DIR/etc/hosts" << 'EOF'
127.0.0.1 localhost
127.0.1.1 tauos
EOF

    # Create init script
    cat > "$ROOTFS_DIR/init" << 'EOF'
#!/bin/sh
# TauOS Init Script

echo "🐢 Starting TauOS..."

# Mount essential filesystems
mount -t proc none /proc
mount -t sysfs none /sys
mount -t devtmpfs none /dev

# Set up networking
ifconfig lo 127.0.0.1 up

# Start TauOS services
echo "Starting TauOS services..."
/boot/tau-upd &
/boot/taustore &
/boot/sandboxd &

# Start GUI
echo "Starting TauOS GUI..."
export DISPLAY=:0
startx /boot/gui/tau-desktop &

echo "🐢 TauOS started successfully!"
exec /bin/sh
EOF

    chmod +x "$ROOTFS_DIR/init"
    
    log_success "Root filesystem created"
}

# Build TauOS applications
build_tauos_apps() {
    log_info "Building TauOS applications..."
    
    cd ..
    
    # Build Rust applications
    cargo build --release
    
    # Copy binaries to boot directory
    mkdir -p "$BOOT_DIR"
    cp target/release/tau-upd "$BOOT_DIR/"
    cp target/release/taustore "$BOOT_DIR/"
    cp target/release/sandboxd "$BOOT_DIR/"
    
    # Copy kernel files
    if [ "$ARCH" = "arm64" ]; then
        cp kernel/Image "$BOOT_DIR/"
    else
        cp kernel/vmlinuz "$BOOT_DIR/"
    fi
    
    log_success "TauOS applications built"
}

# Create initrd
create_initrd() {
    log_info "Creating initrd..."
    
    local initrd_dir="$WORKDIR/initrd"
    mkdir -p "$initrd_dir"
    
    # Copy essential files
    cp "$ROOTFS_DIR/init" "$initrd_dir/"
    mkdir -p "$initrd_dir"/{bin,lib,dev,proc,sys}
    
    # Create minimal initrd
    cd "$initrd_dir"
    find . | cpio -o -H newc | gzip > ../initrd.img
    cd ../..
    
    cp "$WORKDIR/initrd.img" "$BOOT_DIR/"
    
    log_success "Initrd created"
}

# Create GRUB configuration
create_grub_config() {
    log_info "Creating GRUB configuration..."
    
    mkdir -p "$BOOT_DIR/boot/grub"
    
    cat > "$BOOT_DIR/boot/grub/grub.cfg" << EOF
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

    log_success "GRUB configuration created"
}

# Create ISO
create_iso() {
    log_info "Creating bootable ISO..."
    
    # Create ISO using grub-mkrescue
    if [ "$ARCH" = "arm64" ]; then
        "$GRUB_MKRESCUE" -o "$ISO_NAME" "$WORKDIR" --modules="part_gpt part_msdos"
    else
        "$GRUB_MKRESCUE" -o "$ISO_NAME" "$WORKDIR"
    fi
    
    log_success "ISO created: $ISO_NAME"
}

# Main build process
main() {
    echo "🐢 TauOS Real ISO Builder"
    echo "========================="
    echo "Architecture: $ARCH"
    echo "Kernel: $KERNEL_VERSION"
    echo "Output: $ISO_NAME"
    echo "GRUB: $GRUB_MKRESCUE"
    echo ""
    
    # Clean previous builds
    rm -rf "$WORKDIR"
    mkdir -p "$WORKDIR"
    
    # Run build steps
    check_dependencies
    build_kernel
    create_rootfs
    build_tauos_apps
    create_initrd
    create_grub_config
    create_iso
    
    echo ""
    log_success "TauOS ISO build complete!"
    echo "📁 ISO file: $ISO_NAME"
    echo "💾 Size: $(du -h "$ISO_NAME" | cut -f1)"
    echo ""
    echo "🚀 To test on QEMU:"
    echo "   qemu-system-$ARCH -m 2048 -cdrom $ISO_NAME"
    echo ""
    echo "💿 To install on real hardware:"
    echo "   sudo dd if=$ISO_NAME of=/dev/sdX bs=4M status=progress"
    echo "   (Replace /dev/sdX with your USB drive)"
}

# Run main function
main "$@" 