#!/usr/bin/env bash
# Copy Tau Compatibility Platform into AOSP vendor/tau (run when AOSP tree exists)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AOSP_WORKSPACE="${AOSP_WORKSPACE:-$HOME/tau-aosp-workspace}"
VENDOR="$AOSP_WORKSPACE/vendor/tau"

if [[ ! -d "$AOSP_WORKSPACE/build/make" ]]; then
  echo "ERROR: AOSP tree not found at $AOSP_WORKSPACE"
  echo "Sync first: mobile/aosp/scripts/sync-aosp.sh"
  exit 1
fi

"$ROOT/scripts/mobile/verify-compatibility-layer.sh"

echo "[apply] Installing vendor/tau into $VENDOR"
rm -rf "$VENDOR"
mkdir -p "$VENDOR"
rsync -a "$ROOT/mobile/compatibility/" "$VENDOR/" \
  --exclude README.md \
  --exclude bootanimation/README.md

# Product makefile entry point for lunch
cat > "$VENDOR/tau_compatibility.mk" <<'EOF'
# Tau vendor entry — included from device makefile
$(call inherit-product, vendor/tau/product/tau_compatibility.mk)
EOF

echo "[apply] Done. Next (on Linux with synced AOSP):"
echo "  source build/envsetup.sh && lunch tau_compatibility-userdebug && m -j\$(nproc)"
