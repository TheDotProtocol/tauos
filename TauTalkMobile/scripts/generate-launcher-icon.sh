#!/usr/bin/env bash
# TauTalk launcher icon — official mark, inset for circular launcher masks.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MASTER="${ROOT}/src/assets/launcher-icon.png"
OUT="${ROOT}/android/app/src/main/res"
TMP="${ROOT}/scripts/.icon-build"

# Inset so circular/squircle launcher masks don't clip the gold border & logo.
INSET_PERCENT=70

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick (magick) required. Install: brew install imagemagick"
  exit 1
fi

if [[ ! -f "$MASTER" ]]; then
  echo "Missing master icon: $MASTER"
  exit 1
fi

mkdir -p "$TMP" "${OUT}/mipmap-anydpi-v26" "${OUT}/drawable"

make_inset() {
  local SIZE=$1
  local OUTFILE=$2
  local INNER=$((SIZE * INSET_PERCENT / 100))
  magick -size "${SIZE}x${SIZE}" xc:'#000000' \
    \( "$TMP/icon-master.png" -filter Lanczos -resize "${INNER}x${INNER}" \) \
    -gravity center -compose Over -composite \
    "$OUTFILE"
}

# Normalize master to 1024 PNG (full art — login screen uses this file directly)
magick "$MASTER" -filter Lanczos -resize 1024x1024 "$TMP/icon-master.png"

for SIZE in 48 72 96 144 192 512; do
  case $SIZE in
    48)  FOLDER=mipmap-mdpi ;;
    72)  FOLDER=mipmap-hdpi ;;
    96)  FOLDER=mipmap-xhdpi ;;
    144) FOLDER=mipmap-xxhdpi ;;
    192) FOLDER=mipmap-xxxhdpi ;;
    512) FOLDER=playstore ;;
  esac

  make_inset "$SIZE" "${TMP}/icon-${SIZE}.png"

  if [[ "$FOLDER" == "playstore" ]]; then
    cp "${TMP}/icon-${SIZE}.png" "${ROOT}/src/assets/launcher-playstore.png"
  else
    mkdir -p "${OUT}/${FOLDER}"
    cp "${TMP}/icon-${SIZE}.png" "${OUT}/${FOLDER}/ic_launcher.png"
    cp "${TMP}/icon-${SIZE}.png" "${OUT}/${FOLDER}/ic_launcher_round.png"
  fi
done

magick -size 1024x1024 xc:'#000000' "${OUT}/drawable/ic_launcher_background.png"
make_inset 1024 "${OUT}/drawable/ic_launcher_foreground.png"

cat > "${OUT}/mipmap-anydpi-v26/ic_launcher.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
XML

cp "${OUT}/mipmap-anydpi-v26/ic_launcher.xml" "${OUT}/mipmap-anydpi-v26/ic_launcher_round.xml"

echo "Done: launcher icons at ${INSET_PERCENT}% inset (full brand visible inside circle mask)."
