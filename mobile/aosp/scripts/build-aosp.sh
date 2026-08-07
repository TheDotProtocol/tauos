#!/usr/bin/env bash
# Build clean AOSP image (Linux host only for M3)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT/config/aosp-version.env"

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "ERROR: Full AOSP platform build requires Linux (Ubuntu 22.04 recommended)."
  echo "On macOS use Android Studio AOSP emulator image (configure-emulator.sh)."
  exit 1
fi

[[ -d "$AOSP_WORKSPACE/build/make" ]] || { echo "Run sync-aosp.sh first."; exit 1; }

cd "$AOSP_WORKSPACE"
source build/envsetup.sh
lunch "${AOSP_LUNCH_TARGET}"

echo "[build] m -j${AOSP_BUILD_JOBS} (first build: 2–6 hours)"
m -j"${AOSP_BUILD_JOBS}"

echo "[build] Output: out/target/product/*/system.img etc."
echo "[build] Run emulator: emulator -verbose"
