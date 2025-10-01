#!/bin/bash

# Tau OS Installer Script
# This script installs Tau OS on the target system

set -e

# Configuration
TAU_VERSION="1.0.0"
TAU_ARCH=$(uname -m)
TAU_INSTALL_ROOT="/"
TAU_BOOT_PARTITION=""
TAU_ROOT_PARTITION=""
TAU_SWAP_PARTITION=""
TAU_EFI_PARTITION=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."
    
    # Check architecture
    if [[ "$TAU_ARCH" != "x86_64" && "$TAU_ARCH" != "aarch64" ]]; then
        log_error "Unsupported architecture: $TAU_ARCH"
        log_error "Tau OS supports x86_64 and aarch64 only"
        exit 1
    fi
    
    # Check available memory
    local mem_total=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    if [[ $mem_total -lt 2048000 ]]; then
        log_warning "System has less than 2GB RAM ($((mem_total / 1024))MB)"
        log_warning "Tau OS requires at least 2GB RAM for optimal performance"
    fi
    
    # Check available disk space
    local disk_space=$(df / | tail -1 | awk '{print $4}')
    if [[ $disk_space -lt 8388608 ]]; then
        log_error "Insufficient disk space. Need at least 8GB free space"
        exit 1
    fi
    
    log_success "System requirements met"
}

# Detect and configure partitions
detect_partitions() {
    log_info "Detecting available partitions..."
    
    # List available disks
    echo "Available disks:"
    lsblk -d -o NAME,SIZE,MODEL
    
    echo ""
    echo "Available partitions:"
    lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
    
    # Prompt for partition selection
    echo ""
    read -p "Enter root partition (e.g., /dev/sda2): " TAU_ROOT_PARTITION
    read -p "Enter boot partition (e.g., /dev/sda1) [optional]: " TAU_BOOT_PARTITION
    read -p "Enter EFI partition (e.g., /dev/sda1) [optional]: " TAU_EFI_PARTITION
    read -p "Enter swap partition (e.g., /dev/sda3) [optional]: " TAU_SWAP_PARTITION
    
    # Validate partitions
    if [[ -z "$TAU_ROOT_PARTITION" ]]; then
        log_error "Root partition is required"
        exit 1
    fi
    
    if [[ ! -b "$TAU_ROOT_PARTITION" ]]; then
        log_error "Invalid root partition: $TAU_ROOT_PARTITION"
        exit 1
    fi
}

# Format partitions
format_partitions() {
    log_info "Formatting partitions..."
    
    # Format root partition
    log_info "Formatting root partition: $TAU_ROOT_PARTITION"
    mkfs.ext4 -F "$TAU_ROOT_PARTITION"
    
    # Format boot partition if specified
    if [[ -n "$TAU_BOOT_PARTITION" ]]; then
        log_info "Formatting boot partition: $TAU_BOOT_PARTITION"
        mkfs.ext4 -F "$TAU_BOOT_PARTITION"
    fi
    
    # Format EFI partition if specified
    if [[ -n "$TAU_EFI_PARTITION" ]]; then
        log_info "Formatting EFI partition: $TAU_EFI_PARTITION"
        mkfs.fat -F32 "$TAU_EFI_PARTITION"
    fi
    
    # Format swap partition if specified
    if [[ -n "$TAU_SWAP_PARTITION" ]]; then
        log_info "Formatting swap partition: $TAU_SWAP_PARTITION"
        mkswap "$TAU_SWAP_PARTITION"
    fi
    
    log_success "Partitions formatted successfully"
}

# Mount partitions
mount_partitions() {
    log_info "Mounting partitions..."
    
    # Create mount points
    mkdir -p /mnt/tau
    mkdir -p /mnt/tau/boot
    mkdir -p /mnt/tau/efi
    
    # Mount root partition
    mount "$TAU_ROOT_PARTITION" /mnt/tau
    
    # Mount boot partition if specified
    if [[ -n "$TAU_BOOT_PARTITION" ]]; then
        mount "$TAU_BOOT_PARTITION" /mnt/tau/boot
    fi
    
    # Mount EFI partition if specified
    if [[ -n "$TAU_EFI_PARTITION" ]]; then
        mount "$TAU_EFI_PARTITION" /mnt/tau/efi
    fi
    
    # Mount swap if specified
    if [[ -n "$TAU_SWAP_PARTITION" ]]; then
        swapon "$TAU_SWAP_PARTITION"
    fi
    
    log_success "Partitions mounted successfully"
}

# Install base system
install_base_system() {
    log_info "Installing base Tau OS system..."
    
    # Create necessary directories
    mkdir -p /mnt/tau/{bin,boot,dev,etc,home,lib,lib64,media,mnt,opt,proc,root,run,sbin,srv,sys,tmp,usr,var}
    
    # Copy kernel and initramfs
    if [[ -f "tauos-kernel-$TAU_ARCH" ]]; then
        cp "tauos-kernel-$TAU_ARCH" /mnt/tau/boot/vmlinuz-tauos
    fi
    
    if [[ -f "tauos-initramfs-$TAU_ARCH.img" ]]; then
        cp "tauos-initramfs-$TAU_ARCH.img" /mnt/tau/boot/initramfs-tauos.img
    fi
    
    # Install core system files
    tar -xzf "tauos-core-$TAU_ARCH.tar.gz" -C /mnt/tau/
    
    # Install Tau OS specific files
    mkdir -p /mnt/tau/etc/tau
    cp -r tauos/etc/tau/* /mnt/tau/etc/tau/
    
    # Install systemd units
    mkdir -p /mnt/tau/etc/systemd/system
    cp -r tauos/core/*.service /mnt/tau/etc/systemd/system/
    
    # Install GUI components
    mkdir -p /mnt/tau/usr/bin
    cp -r tauos/gui/*/target/release/* /mnt/tau/usr/bin/
    
    # Install package manager
    cp tauos/pkgmgr/target/release/tau-pkg /mnt/tau/usr/bin/
    
    # Install TauStore
    cp -r tauos/taustore/backend/target/release/taustore-backend /mnt/tau/usr/bin/
    cp -r tauos/taustore/frontend/target/release/taustore-frontend /mnt/tau/usr/bin/
    
    # Install sandboxd
    cp tauos/sandboxd/sandboxd /mnt/tau/usr/bin/
    
    # Install Flatpak integration
    cp tauos/flatpak-integration/flatpakd /mnt/tau/usr/bin/
    
    log_success "Base system installed successfully"
}

# Configure bootloader
configure_bootloader() {
    log_info "Configuring bootloader..."
    
    # Install GRUB
    grub-install --root-directory=/mnt/tau --target="$TAU_ARCH"-efi --efi-directory=/mnt/tau/efi --bootloader-id=tauos
    
    # Generate GRUB configuration
    cat > /mnt/tau/etc/default/grub << EOF
GRUB_DEFAULT=0
GRUB_TIMEOUT=5
GRUB_DISTRIBUTOR="Tau OS"
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_CMDLINE_LINUX=""
GRUB_TERMINAL_OUTPUT="console"
GRUB_DISABLE_OS_PROBE=true
EOF
    
    # Generate GRUB menu entries
    cat > /mnt/tau/etc/grub.d/10_tauos << EOF
#!/bin/sh
exec tail -n +3 \$0
menuentry 'Tau OS' --class tauos --class gnu-linux --class gnu --class os \$menuentry_id_option 'gnulinux-simple-\$boot_uuid' {
	load_video
	set gfxpayload=keep
	insmod gzio
	insmod part_gpt
	insmod ext2
	set root='hd0,gpt2'
	if [ x\$feature_platform_search_hint = xy ]; then
	  search --no-floppy --fs-uuid --set=root --hint-bios=hd0,gpt2 --hint-efi=hd0,gpt2 --hint-baremetal=ahci0,gpt2  \$boot_uuid
	else
	  search --no-floppy --fs-uuid --set=root \$boot_uuid
	fi
	linux	/boot/vmlinuz-tauos root=UUID=\$boot_uuid ro quiet splash
	initrd	/boot/initramfs-tauos.img
}
EOF
    
    chmod +x /mnt/tau/etc/grub.d/10_tauos
    
    # Generate GRUB configuration
    chroot /mnt/tau grub-mkconfig -o /boot/grub/grub.cfg
    
    log_success "Bootloader configured successfully"
}

# Configure system
configure_system() {
    log_info "Configuring system..."
    
    # Set hostname
    echo "tauos" > /mnt/tau/etc/hostname
    
    # Configure network
    cat > /mnt/tau/etc/systemd/network/20-wired.network << EOF
[Match]
Name=en*

[Network]
DHCP=yes
EOF
    
    # Configure locale
    echo "en_US.UTF-8 UTF-8" > /mnt/tau/etc/locale.gen
    echo "LANG=en_US.UTF-8" > /mnt/tau/etc/locale.conf
    
    # Configure timezone
    ln -sf /usr/share/zoneinfo/UTC /mnt/tau/etc/localtime
    
    # Configure fstab
    cat > /mnt/tau/etc/fstab << EOF
# /etc/fstab: static file system information
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
$(blkid "$TAU_ROOT_PARTITION" | awk '{print $2}' | sed 's/"/\/\t\t\t\t0\t1/')
EOF
    
    if [[ -n "$TAU_BOOT_PARTITION" ]]; then
        echo "$(blkid "$TAU_BOOT_PARTITION" | awk '{print $2}' | sed 's/"/\/boot\t\t\t\t0\t2/')" >> /mnt/tau/etc/fstab
    fi
    
    if [[ -n "$TAU_EFI_PARTITION" ]]; then
        echo "$(blkid "$TAU_EFI_PARTITION" | awk '{print $2}' | sed 's/"/\/efi\t\t\t\t0\t2/')" >> /mnt/tau/etc/fstab
    fi
    
    if [[ -n "$TAU_SWAP_PARTITION" ]]; then
        echo "$(blkid "$TAU_SWAP_PARTITION" | awk '{print $2}' | sed 's/"/swap\t\t\t\t0\t0/')" >> /mnt/tau/etc/fstab
    fi
    
    # Enable systemd services
    chroot /mnt/tau systemctl enable systemd-networkd
    chroot /mnt/tau systemctl enable systemd-resolved
    chroot /mnt/tau systemctl enable tau-session
    chroot /mnt/tau systemctl enable tau-service
    chroot /mnt/tau systemctl enable tau-upd
    chroot /mnt/tau systemctl enable sandboxd
    chroot /mnt/tau systemctl enable flatpakd
    
    # Create default user
    chroot /mnt/tau useradd -m -G wheel -s /bin/bash tau
    echo "tau:tauos" | chroot /mnt/tau chpasswd
    
    log_success "System configured successfully"
}

# Install additional packages
install_packages() {
    log_info "Installing additional packages..."
    
    # Install core applications
    chroot /mnt/tau tau-pkg install tau-editor
    chroot /mnt/tau tau-pkg install tau-terminal
    chroot /mnt/tau tau-pkg install tau-browser
    chroot /mnt/tau tau-pkg install tau-media-player
    
    # Install development tools
    chroot /mnt/tau tau-pkg install tau-sdk
    
    log_success "Additional packages installed successfully"
}

# Finalize installation
finalize_installation() {
    log_info "Finalizing installation..."
    
    # Set root password
    echo "root:tauos" | chroot /mnt/tau chpasswd
    
    # Configure sudo
    echo "tau ALL=(ALL) NOPASSWD: ALL" > /mnt/tau/etc/sudoers.d/tau
    
    # Set permissions
    chroot /mnt/tau chown -R root:root /
    chroot /mnt/tau chmod 755 /
    chroot /mnt/tau chmod 644 /etc/fstab
    chroot /mnt/tau chmod 600 /etc/sudoers.d/tau
    
    # Generate initramfs
    chroot /mnt/tau dracut -f /boot/initramfs-tauos.img
    
    log_success "Installation finalized successfully"
}

# Cleanup
cleanup() {
    log_info "Cleaning up..."
    
    # Unmount partitions
    umount -R /mnt/tau
    
    # Disable swap
    if [[ -n "$TAU_SWAP_PARTITION" ]]; then
        swapoff "$TAU_SWAP_PARTITION"
    fi
    
    log_success "Cleanup completed"
}

# Main installation function
main() {
    log_info "Starting Tau OS installation..."
    log_info "Version: $TAU_VERSION"
    log_info "Architecture: $TAU_ARCH"
    
    check_root
    check_requirements
    detect_partitions
    format_partitions
    mount_partitions
    install_base_system
    configure_bootloader
    configure_system
    install_packages
    finalize_installation
    cleanup
    
    log_success "Tau OS installation completed successfully!"
    log_info "You can now reboot your system to start using Tau OS"
    log_info "Default login: tau / tauos"
}

# Run main function
main "$@" 