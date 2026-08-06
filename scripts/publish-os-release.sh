#!/usr/bin/env bash
# Upload OS installers to GitHub Release (bypasses git 100MB push limit).
# Release assets support files up to 2GB each.
# Usage: ./scripts/publish-os-release.sh [tag]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TAG="${1:-tauos-v1.0.0}"
REPO="${GITHUB_REPO:-TheDotProtocol/tauos}"
DL="$ROOT/public/downloads"

ISO_SRC="$ROOT/public/TauOS-Desktop.iso"
EXE_SRC="$DL/TauOS Setup 1.0.0.exe"
DMG_X64="$DL/TauOS-1.0.0.dmg"
DMG_ARM64="$DL/TauOS-1.0.0-arm64.dmg"
DEB_X64="$DL/tauos-installer_1.0.0_amd64.deb"
APPIMAGE_X64="$DL/TauOS-1.0.0.AppImage"
APPIMAGE_ARM64="$DL/TauOS-1.0.0-arm64.AppImage"

REQUIRED=("$EXE_SRC" "$DMG_X64" "$DMG_ARM64" "$APPIMAGE_X64" "$APPIMAGE_ARM64")
for f in "${REQUIRED[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "Missing artifact: $f"
    exit 1
  fi
done

echo "=== Publish $TAG → $REPO ==="
echo "  (Installers uploaded as release assets — not committed to git)"
echo ""
printf "  %-40s %s\n" "TauOS-Setup-1.0.0.exe" "$(du -h "$EXE_SRC" | cut -f1)"
printf "  %-40s %s\n" "TauOS-1.0.0.dmg (Intel)" "$(du -h "$DMG_X64" | cut -f1)"
printf "  %-40s %s\n" "TauOS-1.0.0-arm64.dmg (Apple Silicon)" "$(du -h "$DMG_ARM64" | cut -f1)"
printf "  %-40s %s\n" "TauOS-1.0.0.AppImage (x64)" "$(du -h "$APPIMAGE_X64" | cut -f1)"
printf "  %-40s %s\n" "TauOS-1.0.0-arm64.AppImage" "$(du -h "$APPIMAGE_ARM64" | cut -f1)"
[[ -f "$DEB_X64" ]] && printf "  %-40s %s\n" "tauos-installer_1.0.0_amd64.deb" "$(du -h "$DEB_X64" | cut -f1)"
[[ -f "$ISO_SRC" ]] && printf "  %-40s %s\n" "TauOS-Desktop-v1.0.0.iso" "$(du -h "$ISO_SRC" | cut -f1)"
echo ""

if ! gh release view "$TAG" -R "$REPO" &>/dev/null; then
  echo "Creating draft release $TAG ..."
  gh release create "$TAG" -R "$REPO" --draft --title "TAU OS v1.0.0" \
    --notes "$(cat <<'NOTES'
## Tau Core Desktop OS — v1.0.0

Multi-platform installers with Figma-aligned setup wizard (EULA → Wi‑Fi → Tau ID → desktop).

### Downloads
| Platform | File |
|----------|------|
| Windows (x64 + ARM64) | TauOS-Setup-1.0.0.exe |
| macOS Intel | TauOS-1.0.0.dmg |
| macOS Apple Silicon | TauOS-1.0.0-arm64.dmg |
| Linux x64 AppImage | TauOS-1.0.0.AppImage |
| Linux ARM64 AppImage | TauOS-1.0.0-arm64.AppImage |
| Linux x64 .deb | tauos-installer_1.0.0_amd64.deb |
| Bootable ISO (x86_64) | TauOS-Desktop-v1.0.0.iso |

### macOS note
Installers are **unsigned** (no Apple Developer ID). On first launch: right-click → Open, or allow in System Settings → Privacy & Security.

### SHA256
See [manifest.json](https://www.tauos.org/downloads/manifest.json) on tauos.org for checksums.
NOTES
)"
fi

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

cp "$EXE_SRC" "$STAGE/TauOS-Setup-1.0.0.exe"
cp "$DMG_X64" "$STAGE/TauOS-1.0.0.dmg"
cp "$DMG_ARM64" "$STAGE/TauOS-1.0.0-arm64.dmg"
cp "$APPIMAGE_X64" "$STAGE/TauOS-1.0.0.AppImage"
cp "$APPIMAGE_ARM64" "$STAGE/TauOS-1.0.0-arm64.AppImage"
[[ -f "$DEB_X64" ]] && cp "$DEB_X64" "$STAGE/tauos-installer_1.0.0_amd64.deb"
[[ -f "$ISO_SRC" ]] && cp "$ISO_SRC" "$STAGE/TauOS-Desktop-v1.0.0.iso"

UPLOAD=("$STAGE/TauOS-Setup-1.0.0.exe" "$STAGE/TauOS-1.0.0.dmg" "$STAGE/TauOS-1.0.0-arm64.dmg" \
  "$STAGE/TauOS-1.0.0.AppImage" "$STAGE/TauOS-1.0.0-arm64.AppImage")
[[ -f "$STAGE/tauos-installer_1.0.0_amd64.deb" ]] && UPLOAD+=("$STAGE/tauos-installer_1.0.0_amd64.deb")
[[ -f "$STAGE/TauOS-Desktop-v1.0.0.iso" ]] && UPLOAD+=("$STAGE/TauOS-Desktop-v1.0.0.iso")

echo "Uploading ${#UPLOAD[@]} assets (may take several minutes)..."
gh release upload "$TAG" -R "$REPO" --clobber "${UPLOAD[@]}"

echo ""
echo "Publishing release..."
gh release edit "$TAG" -R "$REPO" --draft=false

BASE="https://github.com/$REPO/releases/download/$TAG"
echo ""
echo "✓ Release published: $BASE"
echo "  Update manifest.json URLs to use releaseBase: $BASE"
