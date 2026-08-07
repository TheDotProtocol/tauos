#!/usr/bin/env bash
# Configure Android Studio AVD for clean AOSP-style testing (M3)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT/config/aosp-version.env"

SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"
EMULATOR="$SDK/emulator/emulator"
AVDMAN="$SDK/cmdline-tools/latest/bin/avdmanager"
SDKMAN="$SDK/cmdline-tools/latest/bin/sdkmanager"

echo "=== Emulator configuration (Milestone 3) ==="
echo "SDK: $SDK"
echo "AVD name: $EMULATOR_AVD_NAME"
echo ""

if [[ ! -x "$SDKMAN" ]]; then
  echo "Install Android Studio + SDK Command-line Tools."
  echo "https://developer.android.com/studio"
  exit 1
fi

echo "[1] Install system image (AOSP, no Google Play)"
"$SDKMAN" --install "system-images;android-${EMULATOR_API_LEVEL};default;${EMULATOR_ABI}"

echo "[2] Create AVD"
echo no | "$AVDMAN" create avd \
  -n "$EMULATOR_AVD_NAME" \
  -k "system-images;android-${EMULATOR_API_LEVEL};default;${EMULATOR_ABI}" \
  -d "pixel_7" \
  --force 2>/dev/null || true

echo "[3] Launch"
echo "  export ANDROID_HOME=$SDK"
echo "  export PATH=\$PATH:$SDK/emulator:$SDK/platform-tools"
echo "  emulator -avd $EMULATOR_AVD_NAME -no-snapshot-load"

if [[ -x "$EMULATOR" ]]; then
  echo "[4] Boot test (background — close window to stop)"
  "$EMULATOR" -avd "$EMULATOR_AVD_NAME" -no-snapshot-load -no-audio &
fi
