#!/bin/bash
# Post-debootstrap configuration: desktop UI, systemd, corporate defaults
set -euo pipefail

ROOTFS="${1:?usage: configure-tauos-rootfs.sh <rootfs-path>}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="${TAUOS_VERSION:-1.0.0-beta.1}"
BETA_CODENAME="${TAUOS_CODENAME:-beta}"

log() { echo "[configure-rootfs] $*"; }

mount_chroot() {
  mount --bind /dev "$ROOTFS/dev" 2>/dev/null || true
  mount --bind /proc "$ROOTFS/proc" 2>/dev/null || true
  mount --bind /sys "$ROOTFS/sys" 2>/dev/null || true
  mount --bind /dev/pts "$ROOTFS/dev/pts" 2>/dev/null || true
}

umount_chroot() {
  umount "$ROOTFS/dev/pts" 2>/dev/null || true
  umount "$ROOTFS/dev" 2>/dev/null || true
  umount "$ROOTFS/proc" 2>/dev/null || true
  umount "$ROOTFS/sys" 2>/dev/null || true
}

log "Configuring TauOS rootfs at $ROOTFS"

# Non-free firmware for Wi-Fi / GPU on corporate laptops
cat > "$ROOTFS/etc/apt/sources.list" << 'APTSOURCES'
deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
deb http://deb.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
deb http://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
APTSOURCES
rm -f "$ROOTFS/etc/apt/sources.list.d/debian.sources" 2>/dev/null || true

mount_chroot "$ROOTFS"
chroot "$ROOTFS" apt-get update

chroot "$ROOTFS" apt-get install -y --no-install-recommends $(grep -v '^#' "$REPO_ROOT/scripts/rootfs/packages-desktop-amd64.txt" | grep -v '^[[:space:]]*$' | tr '\n' ' ')
chroot "$ROOTFS" apt-get clean
umount_chroot "$ROOTFS"

# Locales
mount_chroot "$ROOTFS"
grep -q 'en_US.UTF-8 UTF-8' "$ROOTFS/etc/locale.gen" || echo "en_US.UTF-8 UTF-8" >> "$ROOTFS/etc/locale.gen"
chroot "$ROOTFS" locale-gen en_US.UTF-8
echo 'LANG=en_US.UTF-8' > "$ROOTFS/etc/default/locale"
umount_chroot "$ROOTFS"

# TauOS identity
echo "tauos" > "$ROOTFS/etc/hostname"
cat > "$ROOTFS/etc/os-release" << EOF
NAME="TauOS"
PRETTY_NAME="TauOS Beta $VERSION"
VERSION_CODENAME="$BETA_CODENAME"
ID=tauos
ID_LIKE=debian
VERSION_ID="$VERSION"
VERSION="$VERSION"
HOME_URL="https://www.tauos.org"
SUPPORT_URL="https://www.tauos.org/beta"
BUG_REPORT_URL="https://www.tauos.org/beta"
EOF

# Default user (live session; installer prompts for production password on disk install)
mount_chroot "$ROOTFS"
chroot "$ROOTFS" useradd -m -s /bin/bash -G sudo,audio,video,plugdev,render,input tau 2>/dev/null || true
echo "tau:tauos" | chroot "$ROOTFS" chpasswd
cat > "$ROOTFS/etc/sudoers.d/tau" << 'SUDOERS'
tau ALL=(ALL) NOPASSWD:ALL
SUDOERS
chmod 440 "$ROOTFS/etc/sudoers.d/tau"
umount_chroot "$ROOTFS"

# TauOS directories
mkdir -p "$ROOTFS/etc/tau" "$ROOTFS/etc/tauos" "$ROOTFS/opt/tauos/bin" \
  "$ROOTFS/var/lib/tauos" "$ROOTFS/var/log/tau" "$ROOTFS/usr/lib/tauos" \
  "$ROOTFS/usr/share/tauos/desktop-ui"

# Stage Tau Core desktop UI (Figma-aligned shell + setup wizard)
if [[ -d "$REPO_ROOT/public/tau-core" ]]; then
  mkdir -p "$ROOTFS/usr/share/tauos/tau-core"
  rsync -a --delete "$REPO_ROOT/public/tau-core/" "$ROOTFS/usr/share/tauos/tau-core/"
fi
# Legacy desktop-ui redirect
if [[ -d "$REPO_ROOT/public/desktop-ui" ]]; then
  rsync -a "$REPO_ROOT/public/desktop-ui/" "$ROOTFS/usr/share/tauos/desktop-ui/" 2>/dev/null || true
fi

# Desktop launcher + API server
install -m 755 "$REPO_ROOT/os/usr/bin/tau-desktop" "$ROOTFS/usr/bin/tau-desktop"
install -m 755 "$REPO_ROOT/os/lib/tauos/desktop-server.py" "$ROOTFS/usr/lib/tauos/desktop-server.py"
install -m 755 "$REPO_ROOT/os/lib/tauos/qemu-partition.sh" "$ROOTFS/usr/lib/tauos/qemu-partition.sh"

# GTK theme for greeter / native apps
mkdir -p "$ROOTFS/usr/share/tauos/themes"
if [[ -f "$REPO_ROOT/gui/taukit/theme.css" ]]; then
  cp "$REPO_ROOT/gui/taukit/theme.css" "$ROOTFS/usr/share/tauos/themes/taukit.css"
fi

# Disk installer bundled in live image
mkdir -p "$ROOTFS/usr/lib/tauos/installer"
cp "$REPO_ROOT/installer/install.sh" "$ROOTFS/usr/lib/tauos/installer/install.sh"
chmod 755 "$ROOTFS/usr/lib/tauos/installer/install.sh"
cat > "$ROOTFS/usr/bin/tauos-install" << 'EOF'
#!/bin/bash
exec /usr/lib/tauos/installer/install.sh "$@"
EOF
chmod 755 "$ROOTFS/usr/bin/tauos-install"

# systemd units
install -m 644 "$REPO_ROOT/os/systemd/tauos-desktop.service" "$ROOTFS/etc/systemd/system/tauos-desktop.service"
install -m 644 "$REPO_ROOT/os/systemd/seatd.service" "$ROOTFS/etc/systemd/system/seatd.service"

# NetworkManager as primary network stack

mount_chroot "$ROOTFS"
chroot "$ROOTFS" systemctl enable NetworkManager.service 2>/dev/null || true
chroot "$ROOTFS" systemctl enable systemd-timesyncd.service 2>/dev/null || true
chroot "$ROOTFS" systemctl enable ssh.service 2>/dev/null || true
chroot "$ROOTFS" systemctl enable seatd.service 2>/dev/null || true
chroot "$ROOTFS" systemctl enable tauos-desktop.service 2>/dev/null || true
chroot "$ROOTFS" systemctl set-default graphical.target 2>/dev/null || true

# Release artifacts path for live installer
mkdir -p "$ROOTFS/usr/share/tauos/artifacts"
umount_chroot "$ROOTFS"

# Legal / first-run notice
cat > "$ROOTFS/etc/tauos/welcome.txt" << EOF
TauOS Beta $VERSION — Privacy-First Operating System
https://www.tauos.org/beta

LIVE SESSION (testing only):
  User: tau   Password: tauos
  Change this immediately if you connect to a network.

INSTALL TO DISK:
  Choose "Install to Disk" at boot, or run: sudo tauos-install
  You will be prompted to set a new password during install.

Report issues: support@tauos.org
EOF

log "Rootfs configuration complete ($(du -sh "$ROOTFS" | cut -f1))"
