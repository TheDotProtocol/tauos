#!/bin/bash
# Partition a blank virtio/scsi disk for TauOS (QEMU / automated install)
set -euo pipefail
DISK="${1:-/dev/vda}"

if [[ ! -b "$DISK" ]]; then
  echo "Not a block device: $DISK"
  exit 1
fi

echo "Partitioning $DISK for TauOS (GPT: EFI 512MB + root ext4)..."
parted -s "$DISK" mklabel gpt
parted -s "$DISK" mkpart ESP fat32 1MiB 512MiB
parted -s "$DISK" set 1 esp on
parted -s "$DISK" mkpart root ext4 512MiB 100%

sleep 1
partprobe "$DISK" 2>/dev/null || true

EFI="${DISK}1"
ROOT="${DISK}2"
[[ -b "$EFI" ]] || EFI="${DISK}p1"
[[ -b "$ROOT" ]] || ROOT="${DISK}p2"

mkfs.vfat -F32 "$EFI"
mkfs.ext4 -F "$ROOT"

echo ""
echo "Done."
echo "  EFI:  $EFI"
echo "  Root: $ROOT"
echo ""
echo "Install with:"
echo "  export TAUOS_EFI_PARTITION=$EFI"
echo "  export TAUOS_ROOT_PARTITION=$ROOT"
echo "  sudo -E tauos-install"
