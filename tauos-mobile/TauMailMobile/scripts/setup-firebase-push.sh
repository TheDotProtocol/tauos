#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DEST="$ROOT/android/app/google-services.json"
IOS_DEST="$ROOT/ios/TauMailMobile/GoogleService-Info.plist"

echo "TauMail Firebase push setup"
echo "Project: taumail-b82dc"
echo "Android package: com.taumail.mobile"
echo "iOS bundle ID: com.taumail.mobile"
echo

if [[ -n "${1:-}" ]]; then
  SRC="$1"
else
  read -r -p "Path to google-services.json or GoogleService-Info.plist from Firebase: " SRC
fi

if [[ ! -f "$SRC" ]]; then
  echo "File not found: $SRC" >&2
  exit 1
fi

case "$(basename "$SRC")" in
  google-services.json)
    cp "$SRC" "$ANDROID_DEST"
    echo "Installed Android config -> $ANDROID_DEST"
    ;;
  GoogleService-Info.plist)
    cp "$SRC" "$IOS_DEST"
    echo "Installed iOS config -> $IOS_DEST"
    ;;
  *)
    if grep -q '"project_info"' "$SRC" 2>/dev/null; then
      cp "$SRC" "$ANDROID_DEST"
      echo "Installed Android config -> $ANDROID_DEST"
    elif grep -q 'GOOGLE_APP_ID' "$SRC" 2>/dev/null; then
      cp "$SRC" "$IOS_DEST"
      echo "Installed iOS config -> $IOS_DEST"
    else
      echo "Unrecognized Firebase config file." >&2
      exit 1
    fi
    ;;
esac

echo
echo "Firebase console checklist (project taumail-b82dc):"
echo "1. Add Android app with package com.taumail.mobile -> download google-services.json"
echo "2. Add iOS app with bundle ID com.taumail.mobile -> download GoogleService-Info.plist"
echo "3. Upload APNs Auth Key (.p8) under Project settings -> Cloud Messaging -> Apple app configuration"
echo "4. Server .env: FCM_SERVICE_ACCOUNT_PATH=/path/to/your-firebase-adminsdk.json"
echo
echo "Next steps:"
echo "1. Run this script again for the other platform file if needed"
echo "2. Rebuild: npm run android   or   npm run ios"
