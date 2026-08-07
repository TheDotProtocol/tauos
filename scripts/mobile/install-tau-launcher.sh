#!/usr/bin/env bash
# Bundle JS + build debug APK — runs on emulator WITHOUT Metro (M7+ standalone install)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LAUNCHER="$ROOT/mobile/apps/tau-launcher"
ASSETS="$LAUNCHER/android/app/src/main/assets"
APK="$LAUNCHER/android/app/build/outputs/apk/debug/app-debug.apk"

INSTALL_ONLY=0
SKIP_BUNDLE=0

for arg in "$@"; do
  case "$arg" in
    --install-only) INSTALL_ONLY=1 ;;
    --skip-bundle) SKIP_BUNDLE=1 ;;
    -h|--help)
      echo "Usage: $0 [--install-only] [--skip-bundle]"
      echo "  --install-only  Skip bundle/build; install existing APK (offline fallback)"
      echo "  --skip-bundle   Build APK only; skip JS bundle step"
      exit 0
      ;;
  esac
done

install_apk() {
  if [[ ! -f "$APK" ]]; then
    echo "[error] No APK at $APK" >&2
    echo "  Run when network works: ./scripts/mobile/bootstrap-gradle.sh && $0" >&2
    exit 1
  fi
  if [[ -n "${ANDROID_HOME:-}" ]] && adb devices 2>/dev/null | grep -q 'device$'; then
    echo "[install] $APK"
    adb install -r "$APK"
    adb shell am force-stop com.tau.launcher
    adb shell am start -n com.tau.launcher/.MainActivity
    echo "[done] Tau Launcher started (no Metro required)"
  else
    echo "[done] APK ready: $APK"
    echo "  Start emulator, then: adb install -r $APK"
  fi
}

if [[ "$INSTALL_ONLY" -eq 1 ]]; then
  echo "=== Tau Launcher — install only ==="
  install_apk
  exit 0
fi

echo "=== Tau Launcher — bundle + install ==="

cd "$LAUNCHER"
npm install --silent 2>/dev/null || npm install

if [[ "$SKIP_BUNDLE" -eq 0 ]]; then
  mkdir -p "$ASSETS"
  echo "[bundle] Creating index.android.bundle ..."
  npx react-native bundle \
    --platform android \
    --dev false \
    --entry-file index.js \
    --bundle-output "$ASSETS/index.android.bundle" \
    --assets-dest "$LAUNCHER/android/app/src/main/res"
fi

echo "[build] assembleDebug ..."
cd "$LAUNCHER/android"
if ! ./gradlew assembleDebug -q; then
  echo "[build] retry (Gradle may need to finish downloading) ..."
  if ! ./gradlew assembleDebug -q; then
    echo "" >&2
    echo "[error] Gradle build failed (often network — cannot reach services.gradle.org)." >&2
    echo "  1. Test: curl -I https://services.gradle.org/distributions/gradle-8.6-all.zip" >&2
    echo "  2. Fix network / VPN, then: ./scripts/mobile/bootstrap-gradle.sh" >&2
    echo "  3. Retry: $0" >&2
    if [[ -f "$APK" ]]; then
      echo "  4. Offline fallback (older APK): $0 --install-only" >&2
    fi
    exit 1
  fi
fi

install_apk
