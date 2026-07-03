#!/bin/bash

# Tau OS Installer Script
# This script installs Tau OS on the target system

set -e

# Configuration
TAU_VERSION="1.0.0"
TAU_ARCH=$(uname -m)
[[ "$TAU_ARCH" == "aarch64" ]] && TAU_ARCH="arm64"
[[ "$TAU_ARCH" == "x86_64" ]] && TAU_ARCH="x86_64"
TAU_INSTALL_ROOT="/"
TAU_BOOT_PARTITION=""
TAU_ROOT_PARTITION=""
TAU_SWAP_PARTITION=""
TAU_EFI_PARTITION=""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TAUOS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ARTIFACTS_DIR="${TAUOS_ARTIFACTS:-$TAUOS_ROOT/release-files}"
# When running from live ISO, artifacts are staged in the image
if [[ -d /usr/share/tauos/artifacts ]] && [[ -z "${TAUOS_ARTIFACTS:-}" ]]; then
  ARTIFACTS_DIR="/usr/share/tauos/artifacts"
fi
BUILD_DIR="$TAUOS_ROOT/build/tauos-$TAU_ARCH"

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

# Prompt for production password on disk install (beta)
prompt_install_password() {
    if [[ -n "${TAUOS_INSTALL_PASSWORD:-}" ]]; then
        return 0
    fi
    log_info "TauOS Beta — create password for user 'tau'"
    while true; do
        read -s -p "Enter new password: " TAUOS_INSTALL_PASSWORD
        echo
        read -s -p "Confirm password: " TAUOS_INSTALL_PASSWORD_CONFIRM
        echo
        if [[ ${#TAUOS_INSTALL_PASSWORD} -lt 8 ]]; then
            log_warning "Password must be at least 8 characters"
            continue
        fi
        if [[ "$TAUOS_INSTALL_PASSWORD" == "$TAUOS_INSTALL_PASSWORD_CONFIRM" ]]; then
            break
        fi
        log_warning "Passwords do not match — try again"
    done
    export TAUOS_INSTALL_PASSWORD
}

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
    if [[ -n "${TAUOS_ROOT_PARTITION:-}" ]]; then
        log_info "Using preset root partition: $TAUOS_ROOT_PARTITION"
        [[ -b "$TAUOS_ROOT_PARTITION" ]] || { log_error "Invalid: $TAUOS_ROOT_PARTITION"; exit 1; }
        return 0
    fi

    log_info "Detecting available partitions..."
    
    # List available disks
    echo "Available disks:"
    lsblk -d -o NAME,SIZE,MODEL 2>/dev/null || ls /dev/sd* /dev/vd* 2>/dev/null || true
    
    echo ""
    echo "Available partitions:"
    lsblk -o NAME,SIZE,TYPE,MOUNTPOINT 2>/dev/null || true
    
    # Prompt for partition selection
    echo ""
    read -p "Enter root partition (e.g., /dev/vda2): " TAU_ROOT_PARTITION
    read -p "Enter boot partition (e.g., /dev/vda1) [optional]: " TAU_BOOT_PARTITION
    read -p "Enter EFI partition (e.g., /dev/vda1) [optional]: " TAU_EFI_PARTITION
    read -p "Enter swap partition (e.g., /dev/vda3) [optional]: " TAU_SWAP_PARTITION
    
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
    
    # Copy kernel and initramfs (from release-files or build output)
    local kernel_src=""
    local initrd_src=""
    local rootfs_tar=""

    for k in "$ARTIFACTS_DIR/tauos-kernel-$TAU_ARCH" "$BUILD_DIR/boot/vmlinuz" "$TAUOS_ROOT/kernel-build/vmlinuz-production"; do
        if [[ -f "$k" ]] && ! file "$k" | grep -qi "shell script"; then kernel_src="$k"; break; fi
    done
    for i in "$ARTIFACTS_DIR/tauos-initramfs-$TAU_ARCH.img" "$BUILD_DIR/boot/initrd.img" "$TAUOS_ROOT/kernel-build/initrd-production.img"; do
        if [[ -f "$i" ]]; then initrd_src="$i"; break; fi
    done
    for t in "$ARTIFACTS_DIR/tauos-core-$TAU_ARCH.tar.gz" "$TAUOS_ROOT/release-files/tauos-core-$TAU_ARCH.tar.gz"; do
        if [[ -f "$t" ]]; then rootfs_tar="$t"; break; fi
    done

    if [[ -z "$kernel_src" ]]; then
        log_error "Kernel not found. Run: $TAUOS_ROOT/scripts/build-tauos.sh"
        exit 1
    fi

    mkdir -p /mnt/tau/boot
    cp "$kernel_src" /mnt/tau/boot/vmlinuz-tauos
    if [[ -n "$initrd_src" ]]; then
        cp "$initrd_src" /mnt/tau/boot/initramfs-tauos.img
    fi

    if [[ -n "$rootfs_tar" ]]; then
        log_info "Extracting rootfs from $rootfs_tar"
        tar -xzf "$rootfs_tar" -C /mnt/tau/
    elif [[ -f "$ARTIFACTS_DIR/filesystem.squashfs" ]]; then
        log_info "Extracting rootfs from squashfs (live ISO)"
        unsquashfs -f -d /mnt/tau "$ARTIFACTS_DIR/filesystem.squashfs"
    elif [[ -f /usr/share/tauos/artifacts/filesystem.squashfs ]]; then
        log_info "Extracting rootfs from live artifacts"
        unsquashfs -f -d /mnt/tau /usr/share/tauos/artifacts/filesystem.squashfs
    else
        log_error "Rootfs not found. Run: $TAUOS_ROOT/scripts/build-tauos.sh"
        exit 1
    fi
    
    # Install Tau OS binaries from cargo build output
    mkdir -p /mnt/tau/usr/bin /mnt/tau/opt/tauos/bin
    for bin in tau-pkg tau-service tauscript; do
        if [[ -f "$TAUOS_ROOT/target/release/$bin" ]]; then
            cp "$TAUOS_ROOT/target/release/$bin" /mnt/tau/opt/tauos/bin/
            ln -sf /opt/tauos/bin/$bin /mnt/tau/usr/bin/$bin 2>/dev/null || true
        fi
    done

    # Optional legacy paths (skip if missing)
    if [[ -d "$TAUOS_ROOT/tauos/etc/tau" ]]; then
        mkdir -p /mnt/tau/etc/tau
        cp -r "$TAUOS_ROOT/tauos/etc/tau/"* /mnt/tau/etc/tau/ 2>/dev/null || true
    fi
    
    log_success "Base system installed successfully"
}

# Configure bootloader
configure_bootloader() {
    log_info "Configuring bootloader..."

    mkdir -p /mnt/tau/boot/grub /mnt/tau/efi/EFI/tauos 2>/dev/null || true

    if [[ -d /mnt/tau/efi ]] || [[ -d /sys/firmware/efi ]]; then
        grub-install --root-directory=/mnt/tau --target=x86_64-efi --efi-directory=/mnt/tau/efi --bootloader-id=TauOS --recheck 2>/dev/null || \
        grub-install --root-directory=/mnt/tau --target=x86_64-efi --efi-directory=/mnt/tau/efi --bootloader-id=TauOS || true
    fi
    grub-install --root-directory=/mnt/tau --target=i386-pc "$TAU_ROOT_PARTITION" 2>/dev/null || true
    
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
    
    # Configure fstab
    local root_uuid boot_uuid efi_uuid swap_uuid
    root_uuid=$(blkid -s UUID -o value "$TAU_ROOT_PARTITION")
    cat > /mnt/tau/etc/fstab << EOF
# TauOS — generated by installer
UUID=$root_uuid  /       ext4  defaults,noatime  0 1
EOF
    if [[ -n "$TAU_BOOT_PARTITION" ]]; then
        boot_uuid=$(blkid -s UUID -o value "$TAU_BOOT_PARTITION")
        echo "UUID=$boot_uuid  /boot  ext4  defaults  0 2" >> /mnt/tau/etc/fstab
    fi
    if [[ -n "$TAU_EFI_PARTITION" ]]; then
        efi_uuid=$(blkid -s UUID -o value "$TAU_EFI_PARTITION")
        echo "UUID=$efi_uuid  /efi   vfat  umask=0077  0 2" >> /mnt/tau/etc/fstab
    fi
    if [[ -n "$TAU_SWAP_PARTITION" ]]; then
        swap_uuid=$(blkid -s UUID -o value "$TAU_SWAP_PARTITION")
        echo "UUID=$swap_uuid  none   swap  sw  0 0" >> /mnt/tau/etc/fstab
    fi

    # Enable corporate desktop services (NetworkManager + TauOS UI)
    chroot /mnt/tau systemctl enable NetworkManager.service 2>/dev/null || true
    chroot /mnt/tau systemctl enable systemd-timesyncd.service 2>/dev/null || true
    chroot /mnt/tau systemctl enable ssh.service 2>/dev/null || true
    chroot /mnt/tau systemctl enable seatd.service 2>/dev/null || true
    chroot /mnt/tau systemctl enable tauos-desktop.service 2>/dev/null || true
    chroot /mnt/tau systemctl set-default graphical.target 2>/dev/null || true

    # Create default user if missing
    chroot /mnt/tau id tau &>/dev/null || chroot /mnt/tau useradd -m -G sudo,audio,video,plugdev,render,input -s /bin/bash tau
    echo "tau:${TAUOS_INSTALL_PASSWORD}" | chroot /mnt/tau chpasswd
    
    log_success "System configured successfully"
}

# Install additional packages
install_packages() {
    log_info "Installing additional packages..."
    if chroot /mnt/tau command -v tau-pkg >/dev/null 2>&1; then
        chroot /mnt/tau tau-pkg install tau-editor 2>/dev/null || log_warning "tau-pkg offline — skipping app bundles"
    else
        log_warning "tau-pkg not present — desktop UI already included in base image"
    fi
    log_success "Package step completed"
}

# Finalize installation
finalize_installation() {
    log_info "Finalizing installation..."
    
    # Live ISO uses password tau/tauos — force change on first boot after disk install
    chroot /mnt/tau chage -d 0 tau 2>/dev/null || true
    
    # Configure sudo
    echo "tau ALL=(ALL) NOPASSWD: ALL" > /mnt/tau/etc/sudoers.d/tau
    
    # Set permissions
    chroot /mnt/tau chown -R root:root /
    chroot /mnt/tau chmod 755 /
    chroot /mnt/tau chmod 644 /etc/fstab
    chroot /mnt/tau chmod 600 /etc/sudoers.d/tau
    
    # Generate initramfs for installed system
    if chroot /mnt/tau command -v update-initramfs >/dev/null 2>&1; then
        chroot /mnt/tau update-initramfs -c -k all 2>/dev/null || \
        chroot /mnt/tau update-initramfs -u -k all 2>/dev/null || log_warning "initramfs update skipped"
    fi
    
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
    prompt_install_password
    detect_partitions
    format_partitions
    mount_partitions
    install_base_system
    configure_bootloader
    configure_system
    install_packages
    finalize_installation
    cleanup
    
    log_success "TauOS Beta installation completed successfully!"
    log_info "Reboot and log in as user: tau (with the password you set)"
}

# Run main function
main "$@" 