#!/usr/bin/env bash
# Upload OS installers to GitHub Release and publish.
# Usage: ./scripts/publish-os-release.sh [tag]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TAG="${1:-tauos-v1.0.0-beta.2}"
REPO="${GITHUB_REPO:-TheDotProtocol/tauos}"

ISO_SRC="$ROOT/public/TauOS-Desktop.iso"
EXE_SRC="$ROOT/public/downloads/TauOS Setup 1.0.0.exe"
DMG_SRC="$ROOT/public/downloads/TauOS-1.0.0.dmg"
DEB_SRC="$ROOT/public/downloads/tauos-installer_1.0.0_amd64.deb"

for f in "$ISO_SRC" "$EXE_SRC" "$DMG_SRC" "$DEB_SRC"; do
  if [[ ! -f "$f" ]]; then
    echo "Missing artifact: $f"
    exit 1
  fi
done

echo "=== Publish $TAG → $REPO ==="
echo "ISO  $(du -h "$ISO_SRC" | cut -f1)  → TauOS-Desktop-v1.0.0.iso"
echo "EXE  $(du -h "$EXE_SRC" | cut -f1)  → TauOS-Setup-1.0.0.exe"
echo "DMG  $(du -h "$DMG_SRC" | cut -f1)  → TauOS-1.0.0.dmg"
echo "DEB  $(du -h "$DEB_SRC" | cut -f1)  → tauos-installer_1.0.0_amd64.deb"
echo ""

gh release view "$TAG" -R "$REPO" --json isDraft,url -q '"Draft: \(.isDraft) — \(.url)"' || {
  echo "Release $TAG not found. Create with: gh release create $TAG --draft --title 'TAU OS Public Beta 1.0.0-beta.2'"
  exit 1
}

echo "Uploading assets (this may take several minutes)..."
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

if [[ "${1:-}" == "--iso-only" ]]; then
  cp "$ISO_SRC" "$STAGE/TauOS-Desktop-v1.0.0.iso"
  gh release upload "$TAG" -R "$REPO" --clobber "$STAGE/TauOS-Desktop-v1.0.0.iso"
  echo "✓ ISO uploaded."
  exit 0
fi

cp "$ISO_SRC" "$STAGE/TauOS-Desktop-v1.0.0.iso"
cp "$EXE_SRC" "$STAGE/TauOS-Setup-1.0.0.exe"
cp "$DMG_SRC" "$STAGE/TauOS-1.0.0.dmg"
cp "$DEB_SRC" "$STAGE/tauos-installer_1.0.0_amd64.deb"

gh release upload "$TAG" -R "$REPO" --clobber \
  "$STAGE/TauOS-Desktop-v1.0.0.iso" \
  "$STAGE/TauOS-Setup-1.0.0.exe" \
  "$STAGE/TauOS-1.0.0.dmg" \
  "$STAGE/tauos-installer_1.0.0_amd64.deb"

echo ""
echo "Publishing release..."
gh release edit "$TAG" -R "$REPO" --draft=false

echo ""
echo "✓ Release published. Verify with: npm run verify:downloads"
