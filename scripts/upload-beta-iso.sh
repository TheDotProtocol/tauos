#!/bin/bash
# Upload TauOS Beta ISO to object storage (S3-compatible / R2)
# Usage:
#   export TAUOS_ISO_URL_BASE="https://cdn.tauos.org/downloads"
#   export AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... AWS_ENDPOINT_URL=...
#   ./scripts/upload-beta-iso.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ISO="${TAUOS_ISO:-$ROOT/release-files/TauOS-Desktop-v1.0.0.iso}"
BUCKET="${TAUOS_ISO_BUCKET:-tauos-downloads}"
KEY="${TAUOS_ISO_KEY:-TauOS-Desktop-v1.0.0-beta.iso}"
URL_BASE="${TAUOS_ISO_URL_BASE:-}"

if [[ ! -f "$ISO" ]]; then
  echo "ISO not found: $ISO — run build first"
  exit 1
fi

echo "ISO: $ISO ($(du -h "$ISO" | cut -f1))"
echo "SHA256: $(shasum -a 256 "$ISO" | awk '{print $1}')"

if command -v aws >/dev/null 2>&1 && [[ -n "${AWS_ACCESS_KEY_ID:-}" ]]; then
  echo "Uploading to s3://$BUCKET/$KEY ..."
  aws s3 cp "$ISO" "s3://$BUCKET/$KEY" --acl public-read ${AWS_ENDPOINT_URL:+--endpoint-url "$AWS_ENDPOINT_URL"}
  if [[ -n "$URL_BASE" ]]; then
    echo "Public URL: ${URL_BASE%/}/$KEY"
  else
    echo "Set TAUOS_ISO_URL_BASE to print CDN URL"
  fi
elif command -v rclone >/dev/null 2>&1 && [[ -n "${TAUOS_RCLONE_REMOTE:-}" ]]; then
  echo "Uploading via rclone ..."
  rclone copy "$ISO" "${TAUOS_RCLONE_REMOTE}:${BUCKET}/"
else
  echo ""
  echo "No uploader configured. Options:"
  echo "  1) AWS CLI + credentials → s3/R2"
  echo "  2) rclone + TAUOS_RCLONE_REMOTE"
  echo "  3) Manual: GitHub Release → attach ISO → set manifest URL"
  echo ""
  echo "After upload, set in manifest or env:"
  echo "  TAUOS_ISO_URL_BASE=https://your-cdn/downloads"
  exit 0
fi

"$ROOT/scripts/generate-download-manifest.sh"
echo "Done. Run ./scripts/run-release-tests.sh before deploy."
