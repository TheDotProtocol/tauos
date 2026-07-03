#!/bin/bash
# Remove legacy mislabeled stub install artifacts (ISO files named .dmg/.exe/.AppImage)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

removed=0
for f in "$ROOT/TauOS.dmg" "$ROOT/TauOS-Setup.exe" "$ROOT/TauOS-Linux.AppImage" \
         "$ROOT/tauos-simple-20250730.iso" \
         "$ROOT/public/TauOS.dmg" "$ROOT/public/TauOS-Setup.exe" "$ROOT/public/TauOS-Linux.AppImage"; do
  if [[ -f "$f" ]] && file "$f" 2>/dev/null | grep -q "ISO 9660"; then
    echo "Removing mislabeled stub: $f"
    rm -f "$f"
    removed=$((removed + 1))
  fi
done

echo "Removed $removed stub file(s)."
echo "Run ./scripts/build-all-artifacts.sh to produce real installers."
