#!/bin/bash
# TauOS Simple ISO Creator — delegates to real build pipeline.
# Stub ISO generation has been removed. A real kernel and rootfs are required.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ISO="$ROOT/release-files/TauOS-Desktop-v1.0.0.iso"

echo "TauOS ISO Builder"
echo "================="
echo "This script builds a REAL bootable TauOS ISO (no stubs)."
echo ""

if [[ -f "$ISO" ]] && [[ $(stat -f%z "$ISO" 2>/dev/null || stat -c%s "$ISO") -gt 50000000 ]]; then
  echo "Valid ISO already exists: $ISO"
  echo "Size: $(du -h "$ISO" | cut -f1)"
  exit 0
fi

if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "win32"* ]]; then
  echo "Host OS requires Docker for kernel/rootfs build."
  exec "$ROOT/scripts/build-tauos.sh" --docker
else
  exec "$ROOT/scripts/build-tauos.sh"
fi
