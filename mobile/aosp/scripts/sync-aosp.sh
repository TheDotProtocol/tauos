#!/usr/bin/env bash
# Sync clean AOSP source (no Tau modifications)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT/config/aosp-version.env"

"$ROOT/scripts/validate-environment.sh" || { echo "Fix validation failures first."; exit 1; }

mkdir -p "$AOSP_WORKSPACE"
cd "$AOSP_WORKSPACE"

if [[ ! -d .repo ]]; then
  echo "[sync] repo init -b $AOSP_BRANCH"
  repo init -u "$AOSP_MANIFEST" -b "$AOSP_BRANCH" --depth=1
fi

echo "[sync] repo sync -j${AOSP_BUILD_JOBS} (this takes 1–3 hours, ~100+ GB)"
repo sync -c -j"${AOSP_BUILD_JOBS}" --force-sync --no-clone-bundle --no-tags

echo "[sync] Done. Tree at $AOSP_WORKSPACE"
