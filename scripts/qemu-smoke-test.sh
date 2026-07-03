#!/bin/bash
# Interactive / headless QEMU boot test for TauOS ISO (macOS M1 or Linux)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ISO="${TAUOS_ISO:-$ROOT/release-files/TauOS-Desktop-v1.0.0.iso}"
MEMORY="${TAUOS_QEMU_MEM:-4096}"
HEADLESS="${TAUOS_QEMU_HEADLESS:-0}"

QEMU="$(command -v qemu-system-x86_64 2>/dev/null || true)"
[[ -x /opt/homebrew/bin/qemu-system-x86_64 ]] && QEMU=/opt/homebrew/bin/qemu-system-x86_64

if [[ -z "$QEMU" ]]; then
  echo "Install QEMU first: brew install qemu"
  exit 1
fi

if [[ ! -f "$ISO" ]]; then
  echo "ISO not found: $ISO"
  exit 1
fi

echo "TauOS QEMU smoke test"
echo "ISO: $ISO ($(du -h "$ISO" | cut -f1))"
echo "Memory: ${MEMORY}MB"
echo ""

ARGS=(
  -m "$MEMORY"
  -smp 2
  -cdrom "$ISO"
  -boot d
  -machine q35
  -cpu max
  -device virtio-net-pci,netdev=n0
  -netdev user,id=n0
  -no-reboot
)

if [[ "$HEADLESS" == "1" ]]; then
  LOG="$ROOT/build/test-logs/qemu-manual-$(date +%Y%m%d_%H%M%S).log"
  mkdir -p "$(dirname "$LOG")"
  echo "Headless mode — logging to $LOG (120s)"
  if command -v timeout >/dev/null 2>&1; then
    timeout 120 "$QEMU" "${ARGS[@]}" -display none -serial file:"$LOG" -monitor none 2>&1 || true
  else
    "$QEMU" "${ARGS[@]}" -display none -serial file:"$LOG" -monitor none 2>&1 &
    QEMU_PID=$!
    sleep 120
    kill "$QEMU_PID" 2>/dev/null || true
  fi
  if grep -qiE 'Linux version|systemd|TauOS|GRUB|vmlinuz' "$LOG"; then
    echo "PASS: boot signatures found"
    tail -30 "$LOG"
    exit 0
  fi
  echo "WARN: no boot signatures in 120s — open GUI mode for full test"
  tail -30 "$LOG" 2>/dev/null || true
  exit 1
fi

echo "Starting GUI VM — select 'TauOS Live Desktop' from GRUB menu"
exec "$QEMU" "${ARGS[@]}" -display default
