#!/usr/bin/env bash
# Build a standalone Android APK (JS bundle embedded — no Metro required on device).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/android"
./gradlew assembleRelease
OUT="$ROOT/android/app/build/outputs/apk/release/app-release.apk"
DEST="$ROOT/../public/downloads/TauTalk-1.0.0-beta.apk"
if [[ ! -f "$OUT" ]]; then
  echo "Release APK not found at $OUT" >&2
  exit 1
fi
if ! unzip -l "$OUT" | grep -q 'assets/index.android.bundle'; then
  echo "ERROR: APK is missing assets/index.android.bundle — do not publish." >&2
  exit 1
fi
cp "$OUT" "$DEST"
echo "OK: $DEST ($(du -h "$DEST" | awk '{print $1}'))"
