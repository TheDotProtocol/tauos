#!/bin/bash
# Generate public/downloads/manifest.json from release artifacts
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="${TAUOS_VERSION:-1.0.0-beta.1}"
OUT="$ROOT/public/downloads/manifest.json"
DOWNLOADS="$ROOT/public/downloads"
RELEASE="$ROOT/release-files"
PUBLIC="$ROOT/public"

mkdir -p "$DOWNLOADS"

sha256_of() {
  shasum -a 256 "$1" 2>/dev/null | awk '{print $1}' || sha256sum "$1" | awk '{print $1}'
}

size_of() {
  stat -f%z "$1" 2>/dev/null || stat -c%s "$1"
}

add_artifact() {
  local id="$1" label="$2" platform="$3" arch="$4" kind="$5" path="$6" desc="$7"
  if [[ ! -f "$path" ]]; then
    echo "  skip (missing): $path"
    return
  fi
  local fn url size sha
  fn=$(basename "$path")
  url="/downloads/$fn"
  [[ "$kind" == "iso" ]] && url="/$(basename "$path")"
  if [[ "$kind" != "iso" ]]; then
    [[ -f "$DOWNLOADS/$fn" ]] || cp "$path" "$DOWNLOADS/$fn" 2>/dev/null || true
  fi
  if [[ -f "$DOWNLOADS/$fn" ]]; then
    url="/downloads/$fn"
    path="$DOWNLOADS/$fn"
  elif [[ -f "$PUBLIC/$(basename "$path")" ]]; then
    url="/$(basename "$path")"
    path="$PUBLIC/$(basename "$path")"
  fi
  size=$(size_of "$path")
  sha=$(sha256_of "$path")
  if [[ "$kind" == "iso" && -n "${TAUOS_ISO_URL:-}" ]]; then
    url="$TAUOS_ISO_URL"
  elif [[ "$kind" == "iso" ]]; then
    echo "  note: set TAUOS_ISO_URL for external ISO hosting (GitHub Releases)"
  fi
  ARTIFACTS_JSON+=$(cat <<EOF
{
  "id": "$id",
  "label": "$label",
  "platform": "$platform",
  "arch": "$arch",
  "kind": "$kind",
  "filename": "$(basename "$path")",
  "url": "$url",
  "size": $size,
  "sha256": "$sha",
  "available": true,
  "description": "$desc"
},
EOF
)
}

ARTIFACTS_JSON=""
echo "Generating download manifest v$VERSION ..."

# Bootable OS ISO (x86_64 — primary PC install)
for iso in "$RELEASE/TauOS-Desktop-v${VERSION}.iso" "$RELEASE/TauOS-Desktop-v1.0.0.iso"; do
  if [[ -f "$iso" ]]; then
    add_artifact "iso-desktop-x64" "TauOS Desktop ISO (x86_64)" "linux" "x64" "iso" \
      "$iso" "Bootable live/install ISO for Intel/AMD PCs"
    break
  fi
done

# Installers from public/downloads
add_artifact "installer-windows-x64" "TauOS Installer for Windows (x64)" "windows" "x64" "installer" \
  "$DOWNLOADS/TauOS Setup 1.0.0.exe" "USB boot drive creator + TauOS apps"

add_artifact "installer-macos-universal" "TauOS Installer for macOS" "macos" "universal" "installer" \
  "$DOWNLOADS/TauOS-1.0.0.dmg" "USB boot drive creator + TauOS apps (Electron)"

add_artifact "installer-linux-x64-deb" "TauOS Installer for Linux (amd64 .deb)" "linux" "x64" "package" \
  "$DOWNLOADS/tauos-installer_1.0.0_amd64.deb" "Debian/Ubuntu installer package"

# Placeholders — mark unavailable until built (manifest still lists them for UI)
placeholder() {
  local id="$1" label="$2" platform="$3" arch="$4" kind="$5" fn="$6" desc="$7"
  ARTIFACTS_JSON+=$(cat <<EOF
{
  "id": "$id",
  "label": "$label",
  "platform": "$platform",
  "arch": "$arch",
  "kind": "$kind",
  "filename": "$fn",
  "url": "/downloads/$fn",
  "size": 0,
  "sha256": "",
  "available": false,
  "description": "$desc"
},
EOF
)
}

placeholder "installer-macos-x64" "TauOS Installer for macOS (Intel)" "macos" "x64" "installer" \
  "TauOS-${VERSION}-x64.dmg" "Intel Mac installer — build with electron-builder --x64"
placeholder "installer-macos-arm64" "TauOS Installer for macOS (Apple Silicon)" "macos" "arm64" "installer" \
  "TauOS-${VERSION}-arm64.dmg" "Apple Silicon installer — build with electron-builder --arm64"
placeholder "installer-windows-arm64" "TauOS Installer for Windows (ARM)" "windows" "arm64" "installer" \
  "TauOS Setup ${VERSION}-arm64.exe" "Windows on ARM installer"
placeholder "installer-linux-x64-appimage" "TauOS AppImage (x64)" "linux" "x64" "installer" \
  "TauOS-${VERSION}-x86_64.AppImage" "Portable Linux AppImage"
placeholder "installer-linux-arm64-appimage" "TauOS AppImage (ARM64)" "linux" "arm64" "installer" \
  "TauOS-${VERSION}-aarch64.AppImage" "ARM64 Linux AppImage"
placeholder "iso-desktop-arm64" "TauOS Desktop ISO (ARM64)" "linux" "arm64" "iso" \
  "TauOS-Desktop-arm64-v${VERSION}.iso" "ARM64 bootable ISO — run build-tauos.sh --arch arm64"

# Trim trailing comma from last artifact
JSON_BODY="${ARTIFACTS_JSON%,}"

cat > "$OUT" <<EOF
{
  "version": "$VERSION",
  "updatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "artifacts": [
$JSON_BODY
  ]
}
EOF

echo "Wrote $OUT ($(wc -c < "$OUT" | tr -d ' ') bytes)"
