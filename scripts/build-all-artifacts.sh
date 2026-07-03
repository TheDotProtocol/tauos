#!/bin/bash
# Build all TauOS release artifacts: ISO + platform installers
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INSTALLER_DIR="$ROOT/os-code/installer-scripts"
OUTPUT="$ROOT/public/downloads"

echo "=== TauOS Full Release Build ==="

# Step 1: Build bootable ISO
echo ""
echo "[1/4] Building bootable TauOS ISO..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  TAUOS_REBUILD_ROOTFS=1 "$ROOT/scripts/build-tauos.sh" --docker
else
  TAUOS_REBUILD_ROOTFS=1 "$ROOT/scripts/build-tauos.sh"
fi

VERSION="${TAUOS_VERSION:-1.0.0}"
ISO="$ROOT/release-files/TauOS-Desktop-v1.0.0.iso"
[[ -f "$ISO" ]] || { echo "ERROR: ISO build failed — $ISO not found"; exit 1; }

ISO_SIZE=$(stat -f%z "$ISO" 2>/dev/null || stat -c%s "$ISO")
if (( ISO_SIZE < 100000000 )); then
  echo "ERROR: ISO is too small ($ISO_SIZE bytes) — desktop stack may be missing"
  exit 1
fi

echo "ISO OK: $(du -h "$ISO" | cut -f1)"

# Step 2: Stage ISO for Electron installer
echo ""
echo "[2/4] Staging ISO for installer bundle..."
mkdir -p "$INSTALLER_DIR/resources"
cp "$ISO" "$INSTALLER_DIR/resources/TauOS-Desktop.iso"

# Step 3: Build Electron installers
echo ""
echo "[3/4] Building platform installers..."
cd "$INSTALLER_DIR"
npm install --no-fund --no-audit 2>/dev/null || npm install
npm run dist 2>/dev/null || npx electron-builder --win --mac --linux 2>/dev/null || {
  echo "Building for current platform only..."
  npx electron-builder
}

mkdir -p "$OUTPUT"
cp -f dist/*.{exe,dmg,deb,AppImage} "$OUTPUT/" 2>/dev/null || cp -f dist/* "$OUTPUT/" 2>/dev/null || true

# Copy real ISO to public (NOT mislabeled as .exe/.dmg)
cp "$ISO" "$ROOT/public/TauOS-Desktop.iso"
cp "$ISO" "$ROOT/tauos-desktop.iso"

# Remove legacy mislabeled stub files if ISO is valid
for stub in "$ROOT/TauOS.dmg" "$ROOT/TauOS-Setup.exe" "$ROOT/TauOS-Linux.AppImage"; do
  if [[ -f "$stub" ]]; then
    STUB_SIZE=$(stat -f%z "$stub" 2>/dev/null || stat -c%s "$stub")
    if (( STUB_SIZE < 50000000 )); then
      echo "Removing mislabeled stub: $stub"
      rm -f "$stub"
    fi
  fi
done

# Update release-files with honest names
cp "$ISO" "$ROOT/release-files/TauOS-Desktop-v1.0.0.iso"

echo ""
echo "[4/4] Regenerating download manifest..."
"$ROOT/scripts/generate-download-manifest.sh"

echo ""
echo "=== Release build complete ==="
echo "ISO:     $ISO"
echo "Manifest: $ROOT/public/downloads/manifest.json"
echo "Downloads: $OUTPUT/"
ls -lh "$OUTPUT/" 2>/dev/null || true
echo ""
echo "Users should download:"
echo "  - TauOS-Desktop.iso (bootable OS)"
echo "  - Platform installer from public/downloads/ (creates USB boot drive)"
echo "  - /download page reads manifest.json for auto-detection"
