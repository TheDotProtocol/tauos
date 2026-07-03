#!/bin/bash
# TauOS — install to virtual disk in QEMU (no USB / second PC needed)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ISO="${TAUOS_ISO:-$ROOT/release-files/TauOS-Desktop-v1.0.0.iso}"
DISK_DIR="$ROOT/build/qemu"
DISK="$DISK_DIR/tauos-install.qcow2"
DISK_SIZE="${TAUOS_QEMU_DISK:-32G}"
MEMORY="${TAUOS_QEMU_MEM:-4096}"

QEMU="$(command -v qemu-system-x86_64 2>/dev/null || true)"
QEMU_IMG="$(command -v qemu-img 2>/dev/null || true)"
[[ -x /opt/homebrew/bin/qemu-system-x86_64 ]] && QEMU=/opt/homebrew/bin/qemu-system-x86_64
[[ -x /opt/homebrew/bin/qemu-img ]] && QEMU_IMG=/opt/homebrew/bin/qemu-img

if [[ -z "$QEMU" ]]; then
  echo "Install QEMU: brew install qemu"
  exit 1
fi
if [[ -z "$QEMU_IMG" ]]; then
  echo "Install QEMU: brew install qemu"
  exit 1
fi
[[ -f "$ISO" ]] || { echo "ISO missing: $ISO"; exit 1; }

mkdir -p "$DISK_DIR"
if [[ ! -f "$DISK" ]]; then
  echo "Creating virtual disk ($DISK_SIZE): $DISK"
  "$QEMU_IMG" create -f qcow2 "$DISK" "$DISK_SIZE"
else
  echo "Using existing disk: $DISK ($(du -h "$DISK" | cut -f1))"
fi

cat <<EOF

╔══════════════════════════════════════════════════════════════╗
║  TauOS QEMU — Install to virtual disk                        ║
╚══════════════════════════════════════════════════════════════╝

STEP 1 — In GRUB, choose:  "TauOS Install to Disk"

STEP 2 — If installer asks for partitions, open a terminal and run:

  sudo /usr/lib/tauos/qemu-partition.sh /dev/vda

  (Creates EFI + root on the virtual disk, then re-run install)

STEP 3 — Or manual install with env vars:

  sudo /usr/lib/tauos/qemu-partition.sh /dev/vda
  export TAUOS_ROOT_PARTITION=/dev/vda2
  export TAUOS_EFI_PARTITION=/dev/vda1
  export TAUOS_INSTALL_PASSWORD='YourSecurePass8'
  sudo -E tauos-install

STEP 4 — After install, shut down VM. Re-run with:

  TAUOS_QEMU_BOOT_DISK=1 ./scripts/qemu-install-disk.sh

Starting VM with ISO + disk...

EOF

ARGS=(
  -m "$MEMORY"
  -smp 2
  -machine q35
  -cpu max
  -drive "file=$DISK,format=qcow2,if=virtio"
  -device virtio-net-pci,netdev=n0
  -netdev user,id=n0
)

if [[ "${TAUOS_QEMU_BOOT_DISK:-0}" == "1" ]]; then
  echo "Booting from installed disk (no ISO)..."
  exec "$QEMU" "${ARGS[@]}" -boot c -display default
fi

exec "$QEMU" "${ARGS[@]}" -cdrom "$ISO" -boot d -display default
