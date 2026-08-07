#!/usr/bin/env bash
# Pre-download Gradle distribution when gradlew wrapper times out (M7+ mobile builds)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROPS="$ROOT/mobile/apps/tau-launcher/android/gradle/wrapper/gradle-wrapper.properties"

if [[ ! -f "$PROPS" ]]; then
  echo "Missing gradle-wrapper.properties: $PROPS" >&2
  exit 1
fi

URL="$(grep '^distributionUrl=' "$PROPS" | cut -d= -f2- | tr -d '\r' | sed 's/\\://g')"
ZIP_NAME="$(basename "$URL")"
VERSION_DIR="${ZIP_NAME%.zip}"
HASH="$(echo -n "$URL" | shasum -a 256 | cut -c1-64)"
DEST="$HOME/.gradle/wrapper/dists/${VERSION_DIR}/${HASH}"
ZIP_PATH="$DEST/${ZIP_NAME}"

echo "=== Bootstrap Gradle ==="
echo "  URL:  $URL"
echo "  Dest: $DEST"

mkdir -p "$DEST"

if [[ -f "$ZIP_PATH" ]] && unzip -t "$ZIP_PATH" >/dev/null 2>&1; then
  echo "  OK   Gradle archive already present and valid"
  exit 0
fi

rm -f "$DEST/${ZIP_NAME}.part" "$DEST/${ZIP_NAME}.lck" "$ZIP_PATH"

echo "  Downloading (curl, retries, 10 min max) ..."
if ! curl -fL --retry 5 --retry-delay 3 --connect-timeout 30 --max-time 600 \
  -o "$ZIP_PATH.part" "$URL"; then
  rm -f "$ZIP_PATH.part"
  echo "  FAIL Could not download Gradle. Check network / VPN / firewall." >&2
  exit 1
fi

mv "$ZIP_PATH.part" "$ZIP_PATH"
unzip -t "$ZIP_PATH" >/dev/null
echo "  OK   Gradle ready — run: ./scripts/mobile/install-tau-launcher.sh"
