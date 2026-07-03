#!/bin/bash
# Native TauOS build (runs on Linux or inside Docker)
set -euo pipefail

ROOT="${TAUOS_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
ARCH="${TAUOS_ARCH:-x86_64}"
VERSION="1.0.0"
BUILD_DIR="$ROOT/build/tauos-$ARCH"
if [[ -f /.dockerenv ]]; then
  KERNEL_DIR="/var/tmp/linux-6.14"
  KERNEL_TARBALL="/var/tmp/linux-6.14.tar.xz"
  ROOTFS_DIR="/var/tmp/tauos-rootfs"
else
  KERNEL_DIR="$BUILD_DIR/linux-6.14"
  KERNEL_TARBALL="$BUILD_DIR/linux-6.14.tar.xz"
  ROOTFS_DIR="$BUILD_DIR/rootfs"
fi
OUTPUT_DIR="$ROOT/release-files"
ISO_NAME="TauOS-Desktop-v${VERSION}.iso"

log() { echo "[tauos-native] $*"; }
warn() { log "WARN: $*"; }

mount_chroot() {
  local rootfs="$1"
  mount --bind /dev "$rootfs/dev" 2>/dev/null || true
  mount --bind /proc "$rootfs/proc" 2>/dev/null || true
  mount --bind /sys "$rootfs/sys" 2>/dev/null || true
  mount --bind /dev/pts "$rootfs/dev/pts" 2>/dev/null || true
}

umount_chroot() {
  local rootfs="$1"
  umount "$rootfs/dev/pts" 2>/dev/null || true
  umount "$rootfs/dev" 2>/dev/null || true
  umount "$rootfs/proc" 2>/dev/null || true
  umount "$rootfs/sys" 2>/dev/null || true
}

mkdir -p "$BUILD_DIR"/{boot,iso,rootfs,squashfs}

ensure_kernel_source() {
  if [[ -f "$KERNEL_DIR/drivers/input/keyboard/Kconfig" ]]; then
    log "Kernel source OK at $KERNEL_DIR"
    return 0
  fi
  log "Fetching complete Linux 6.14 source..."
  rm -rf "$KERNEL_DIR"
  if [[ ! -f "$KERNEL_TARBALL" ]]; then
    if [[ -f "$BUILD_DIR/linux-6.14.tar.xz" && ! -f "$KERNEL_TARBALL" ]]; then
      cp "$BUILD_DIR/linux-6.14.tar.xz" "$KERNEL_TARBALL"
    fi
    if [[ ! -f "$KERNEL_TARBALL" ]]; then
      wget -q --show-progress -O "$KERNEL_TARBALL" "https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.14.tar.xz" \
        || curl -L -o "$KERNEL_TARBALL" "https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.14.tar.xz"
      cp "$KERNEL_TARBALL" "$BUILD_DIR/linux-6.14.tar.xz" 2>/dev/null || true
    fi
  fi
  local extract_dir
  extract_dir="$(dirname "$KERNEL_DIR")"
  mkdir -p "$extract_dir"
  tar -xf "$KERNEL_TARBALL" -C "$extract_dir"
  [[ -f "$KERNEL_DIR/drivers/input/keyboard/Kconfig" ]] || { log "ERROR: kernel extract failed"; exit 1; }
  log "Kernel source ready at $KERNEL_DIR"
}

enable_kernel_options() {
  local cfg="$1"
  shift
  for opt in "$@"; do
    ./scripts/config --enable "$opt" 2>/dev/null || true
  done
}

build_kernel() {
  if [[ -f "$BUILD_DIR/boot/vmlinuz" ]]; then
    local ksize
    ksize=$(stat -c%s "$BUILD_DIR/boot/vmlinuz" 2>/dev/null || stat -f%z "$BUILD_DIR/boot/vmlinuz")
    if (( ksize > 1000000 )) && [[ "${TAUOS_FORCE_KERNEL:-0}" != "1" ]]; then
      log "Kernel already built ($(( ksize / 1024 / 1024 ))MB) — skipping compile"
      mkdir -p "$ROOT/kernel-build"
      cp "$BUILD_DIR/boot/vmlinuz" "$ROOT/kernel-build/vmlinuz-production"
      return 0
    fi
  fi
  log "Building Linux kernel for $ARCH..."
  ensure_kernel_source
  cd "$KERNEL_DIR"
  if [[ ! -f .config ]]; then
    if [[ "$ARCH" == "arm64" ]]; then
      make ARCH=arm64 defconfig
    else
      make defconfig
      enable_kernel_options .config \
        CONFIG_DEVTMPFS CONFIG_DEVTMPFS_MOUNT CONFIG_EXT4_FS CONFIG_SQUASHFS CONFIG_OVERLAY_FS \
        CONFIG_BLK_DEV_SD CONFIG_ATA CONFIG_SATA_AHCI CONFIG_BLK_DEV_NVME \
        CONFIG_USB CONFIG_USB_STORAGE CONFIG_USB_XHCI_HCD CONFIG_USB_EHCI_HCD CONFIG_USB_OHCI_HCD \
        CONFIG_NET CONFIG_INET CONFIG_CFG80211 CONFIG_MAC80211 \
        CONFIG_IWLWIFI CONFIG_IWLMVM CONFIG_RTW88 CONFIG_RTW89 CONFIG_BRCMFMAC \
        CONFIG_INPUT CONFIG_VT CONFIG_FRAMEBUFFER_CONSOLE \
        CONFIG_DRM CONFIG_DRM_I915 CONFIG_DRM_AMDGPU CONFIG_DRM_NOUVEAU CONFIG_DRM_RADEON \
        CONFIG_E1000 CONFIG_E1000E CONFIG_R8169 CONFIG_IGB CONFIG_IXGBE \
        CONFIG_ISO9660_FS CONFIG_UDF_FS CONFIG_CDROM CONFIG_BLK_DEV_LOOP \
        CONFIG_FW_LOADER CONFIG_FW_LOADER_COMPRESS CONFIG_DMI CONFIG_EFI CONFIG_EFI_STUB \
        CONFIG_SMP CONFIG_HYPERVISOR_GUEST CONFIG_KVM_GUEST CONFIG_MODULE_UNLOAD
      ./scripts/config --set-val CONFIG_LOCALVERSION "\"-tauos\""
    fi
  fi
  local jobs
  jobs=$(nproc 2>/dev/null || echo 4)
  if [[ "$ARCH" == "arm64" ]]; then
    make -j"$jobs" ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- Image
    cp arch/arm64/boot/Image "$BUILD_DIR/boot/vmlinuz"
  else
    make -j"$jobs"
    cp arch/x86/boot/bzImage "$BUILD_DIR/boot/vmlinuz"
  fi
  cp "$BUILD_DIR/boot/vmlinuz" "$ROOT/kernel-build/vmlinuz-production"
  mkdir -p "$ROOT/kernel-build"
  log "Kernel built: $BUILD_DIR/boot/vmlinuz ($(du -h "$BUILD_DIR/boot/vmlinuz" | cut -f1))"
}

build_rootfs() {
  log "Building corporate desktop rootfs at $ROOTFS_DIR..."
  local deb_arch="amd64"
  [[ "$ARCH" == "arm64" ]] && deb_arch="arm64"

  if [[ "${TAUOS_REBUILD_ROOTFS:-0}" == "1" ]] || [[ ! -x "$ROOTFS_DIR/bin/bash" ]]; then
    rm -rf "$ROOTFS_DIR"
    debootstrap --arch="$deb_arch" --variant=minbase bookworm "$ROOTFS_DIR" http://deb.debian.org/debian
  else
    log "Reusing debootstrap base — refreshing desktop layer"
  fi

  chmod +x "$ROOT/scripts/configure-tauos-rootfs.sh"
  TAUOS_VERSION="$VERSION" "$ROOT/scripts/configure-tauos-rootfs.sh" "$ROOTFS_DIR"
}

build_userland() {
  log "Building TauOS Rust userland (optional native apps)..."
  cd "$ROOT"
  if command -v cargo >/dev/null 2>&1; then
    cargo build --release -p tau-pkg 2>/dev/null || warn "tau-pkg build skipped"
    cargo build --release -p tau-service 2>/dev/null || warn "tau-service build skipped"
    cargo build --release -p tauscript 2>/dev/null || warn "tauscript build skipped"
    for bin in tau-pkg tau-service tauscript; do
      [[ -f "target/release/$bin" ]] && install -m 755 "target/release/$bin" "$ROOTFS_DIR/opt/tauos/bin/$bin"
    done
  fi
  mkdir -p "$ROOTFS_DIR/usr/share/tauscript/examples"
  [[ -d "$ROOT/developerhub/tauscript/examples" ]] && \
    cp -r "$ROOT/developerhub/tauscript/examples/"* "$ROOTFS_DIR/usr/share/tauscript/examples/" 2>/dev/null || true
}

build_initramfs() {
  log "Creating initramfs..."
  local initrd_dir="$BUILD_DIR/initrd"
  rm -rf "$initrd_dir"
  mkdir -p "$initrd_dir"/{bin,sbin,dev,proc,sys,newroot,mnt,live}

  if [[ -f "$ROOTFS_DIR/bin/busybox" ]]; then
    cp "$ROOTFS_DIR/bin/busybox" "$initrd_dir/bin/"
    for cmd in sh mount umount mkdir sleep switch_root grep ls; do
      ln -sf busybox "$initrd_dir/bin/$cmd"
    done
  else
    cp "$ROOTFS_DIR/bin/bash" "$initrd_dir/bin/sh"
  fi

  cp "$ROOT/kernel-build/init/tauos-init" "$initrd_dir/init"
  chmod +x "$initrd_dir/init"
  cd "$initrd_dir"
  find . | cpio -o -H newc 2>/dev/null | gzip -9 > "$BUILD_DIR/boot/initrd.img"
  cp "$BUILD_DIR/boot/initrd.img" "$ROOT/kernel-build/initrd-production.img"
  log "Initramfs: $(du -h "$BUILD_DIR/boot/initrd.img" | cut -f1)"
}

build_squashfs() {
  log "Creating squashfs live filesystem..."
  mksquashfs "$ROOTFS_DIR" "$BUILD_DIR/squashfs/filesystem.squashfs" -comp xz -noappend
  log "Squashfs: $(du -h "$BUILD_DIR/squashfs/filesystem.squashfs" | cut -f1)"
}

build_iso() {
  log "Assembling bootable ISO..."
  local iso_root="$BUILD_DIR/iso"
  rm -rf "$iso_root"
  mkdir -p "$iso_root"/{boot/grub,live}

  cp "$BUILD_DIR/boot/vmlinuz" "$iso_root/boot/vmlinuz"
  cp "$BUILD_DIR/boot/initrd.img" "$iso_root/boot/initrd.img"
  cp "$BUILD_DIR/squashfs/filesystem.squashfs" "$iso_root/live/filesystem.squashfs"

  cat > "$iso_root/boot/grub/grub.cfg" << 'GRUBEOF'
set default=0
set timeout=8

menuentry "TauOS Live Desktop" {
    linux /boot/vmlinuz boot=live quiet splash
    initrd /boot/initrd.img
}

menuentry "TauOS Live (Safe Mode)" {
    linux /boot/vmlinuz boot=live single nomodeset
    initrd /boot/initrd.img
}

menuentry "TauOS Install to Disk" {
    linux /boot/vmlinuz boot=live tauos.install quiet
    initrd /boot/initrd.img
}
GRUBEOF

  mkdir -p "$OUTPUT_DIR"
  if ! grub-mkrescue -o "$OUTPUT_DIR/$ISO_NAME" "$iso_root" 2>/dev/null; then
    log "ERROR: grub-mkrescue failed — install grub-pc-bin grub-efi-amd64-bin xorriso"
    exit 1
  fi

  cp "$OUTPUT_DIR/$ISO_NAME" "$ROOT/tauos-desktop.iso"
  mkdir -p "$ROOT/public" "$ROOT/public/downloads"
  cp "$OUTPUT_DIR/$ISO_NAME" "$ROOT/public/TauOS-Desktop.iso"
  cp "$OUTPUT_DIR/$ISO_NAME" "$ROOT/public/downloads/TauOS-Desktop-v${VERSION}.iso" 2>/dev/null || true

  tar -czf "$OUTPUT_DIR/tauos-core-${ARCH}.tar.gz" -C "$ROOTFS_DIR" .
  cp "$BUILD_DIR/boot/vmlinuz" "$OUTPUT_DIR/tauos-kernel-${ARCH}"
  cp "$BUILD_DIR/boot/initrd.img" "$OUTPUT_DIR/tauos-initramfs-${ARCH}.img"

  log "ISO ready: $OUTPUT_DIR/$ISO_NAME ($(du -h "$OUTPUT_DIR/$ISO_NAME" | cut -f1))"
}

log "TauOS corporate desktop build — arch=$ARCH"
build_kernel
build_rootfs
build_userland
build_initramfs
build_squashfs
build_iso
log "Build complete."
