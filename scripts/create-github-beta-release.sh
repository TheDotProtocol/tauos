#!/bin/bash
# Create GitHub Release for TauOS Beta ISO (requires gh auth login)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TAG="${1:-beta-1.0.0}"
ISO="$ROOT/release-files/TauOS-Desktop-v1.0.0.iso"

command -v gh >/dev/null || { echo "Install GitHub CLI: brew install gh && gh auth login"; exit 1; }
[[ -f "$ISO" ]] || { echo "Build ISO first"; exit 1; }

SHA=$(shasum -a 256 "$ISO" | awk '{print $1}')
SIZE=$(stat -f%z "$ISO" 2>/dev/null || stat -c%s "$ISO")

echo "Creating release $TAG ..."
gh release create "$TAG" "$ISO" \
  --title "TauOS Beta 1.0" \
  --notes "$(cat <<EOF
TauOS Beta 1.0 — bootable x86_64 desktop ISO.

- Size: $SIZE bytes
- SHA256: \`$SHA\`

See https://www.tauos.org/beta for install steps.
EOF
)" 2>/dev/null || gh release upload "$TAG" "$ISO" --clobber

URL=$(gh release view "$TAG" --json url -q .url)
echo ""
echo "Release: $URL"
echo ""
echo "Set manifest CDN URL (optional):"
echo "  export TAUOS_ISO_URL=https://github.com/TheDotProtocol/tauos/releases/download/$TAG/TauOS-Desktop-v1.0.0.iso"
echo "  ./scripts/generate-download-manifest.sh"
