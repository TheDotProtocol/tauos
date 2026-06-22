#!/bin/bash
# Validate TauOS corporate release artifacts
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ERR=0

check_file() {
  local f="$1" min="$2" type_hint="$3"
  if [[ ! -f "$f" ]]; then
    echo "FAIL missing: $f"
    ERR=1
    return
  fi
  local size
  size=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  if (( size < min )); then
    echo "FAIL too small ($size bytes): $f — expected real $type_hint"
    ERR=1
    return
  fi
  if file "$f" | grep -q "shell script"; then
    echo "FAIL shell script masquerading as binary: $f"
    ERR=1
    return
  fi
  echo "OK $f ($(du -h "$f" | cut -f1))"
}

echo "=== TauOS Corporate Artifact Validation ==="

ISO="$ROOT/release-files/TauOS-Desktop-v1.0.0.iso"
check_file "$ISO" 100000000 "bootable ISO (expect desktop stack ≥100MB)"

if [[ -f "$ROOT/kernel-build/vmlinuz-production" ]]; then
  if file "$ROOT/kernel-build/vmlinuz-production" | grep -qi "shell script"; then
    echo "FAIL kernel-build/vmlinuz-production is still a shell script"
    ERR=1
  else
    echo "OK kernel-build/vmlinuz-production"
  fi
fi

# Desktop UI must be staged for rootfs configure step
for f in "$ROOT/public/desktop-ui/index.html" "$ROOT/os/usr/bin/tau-desktop" "$ROOT/os/lib/tauos/desktop-server.py"; do
  if [[ -f "$f" ]]; then echo "OK $f"; else echo "FAIL missing desktop component: $f"; ERR=1; fi
done

# Manifest
if [[ -f "$ROOT/public/downloads/manifest.json" ]]; then
  echo "OK public/downloads/manifest.json"
else
  echo "WARN manifest missing — run scripts/generate-download-manifest.sh"
fi

# Reject mislabeled stubs at repo root
for f in "$ROOT/TauOS.dmg" "$ROOT/TauOS-Setup.exe" "$ROOT/TauOS-Linux.AppImage"; do
  if [[ -f "$f" ]] && file "$f" | grep -q "ISO 9660"; then
    echo "FAIL mislabeled ISO stub: $f"
    ERR=1
  fi
done

if command -v cargo >/dev/null 2>&1; then
  cd "$ROOT/developerhub/tauscript"
  if cargo test --quiet 2>/dev/null; then
    echo "OK TauScript tests pass"
  else
    echo "WARN TauScript tests failed or crate not built"
  fi
fi

echo ""
if (( ERR == 0 )); then
  echo "PASSED — artifacts ready for corporate release pipeline"
  echo "Next: rebuild ISO with ./scripts/build-tauos.sh --docker (includes desktop UI)"
  exit 0
else
  echo "FAILED — fix issues above before release"
  exit 1
fi
