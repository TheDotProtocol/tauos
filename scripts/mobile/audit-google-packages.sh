#!/usr/bin/env bash
# M5 — Audit Google/GMS packages on connected emulator or device
# Usage: ./scripts/mobile/audit-google-packages.sh [output.md]
set -euo pipefail

OUT="${1:-}"
ADB="${ADB:-adb}"

if ! "$ADB" devices | grep -qE 'device$'; then
  echo "ERROR: No device/emulator connected. Run: adb devices"
  exit 1
fi

report() {
  if [[ -n "$OUT" ]]; then
    echo "$1" >> "$OUT"
  else
    echo "$1"
  fi
}

[[ -n "$OUT" ]] && : > "$OUT"

report "# Google Package Audit"
report ""
report "**Device:** \`$("$ADB" shell getprop ro.product.model 2>/dev/null | tr -d '\r')\`"
report "**Build:** \`$("$ADB" shell getprop ro.build.display.id 2>/dev/null | tr -d '\r')\`"
report "**Date:** $(date -u +%Y-%m-%dT%H:%M:%SZ)"
report ""
report "## Google / GMS packages"
report ""
report '```'

"$ADB" shell pm list packages 2>/dev/null | tr -d '\r' | grep -iE 'google|gms|vending|gsf' | sort | while read -r line; do
  report "$line"
done

report '```'
report ""
report "## Play Services version (if present)"
report '```'
"$ADB" shell dumpsys package com.google.android.gms 2>/dev/null | grep versionName | head -1 | tr -d '\r' || report "(not installed)"
report '```'
report ""
report "## Count"
COUNT=$("$ADB" shell pm list packages 2>/dev/null | tr -d '\r' | grep -icE 'google|gms|vending|gsf' || true)
report "Google-related packages: **$COUNT**"
report ""
report "Target for Tau Compatibility Platform: **0** (after M5.2–B2)"

if [[ -n "$OUT" ]]; then
  echo "Wrote $OUT"
fi
