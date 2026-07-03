#!/bin/bash
# TauOS Master Build Script
# Builds a real bootable TauOS ISO with Linux kernel, initramfs, and rootfs.
#
# Usage:
#   ./scripts/build-tauos.sh              # native build (Linux)
#   ./scripts/build-tauos.sh --docker     # build inside Docker (macOS/Windows/Linux)
#   ./scripts/build-tauos.sh --arch arm64 # ARM64 build

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARCH="${TAUOS_ARCH:-x86_64}"
USE_DOCKER=false
VERSION="1.0.0"
BUILD_DIR="$ROOT/build/tauos-$ARCH"
OUTPUT_DIR="$ROOT/release-files"
ISO_NAME="TauOS-Desktop-v${VERSION}.iso"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${BLUE}[tauos-build]${NC} $*"; }
ok()   { echo -e "${GREEN}[tauos-build]${NC} $*"; }
warn() { echo -e "${YELLOW}[tauos-build]${NC} $*"; }
fail() { echo -e "${RED}[tauos-build]${NC} $*" >&2; exit 1; }

for arg in "$@"; do
  case "$arg" in
    --docker) USE_DOCKER=true ;;
    --arch=*) ARCH="${arg#*=}" ;;
    arm64) ARCH=arm64 ;;
  esac
done

export TAUOS_ARCH="$ARCH"
export TAUOS_ROOT="$ROOT"

if $USE_DOCKER; then
  log "Building TauOS ($ARCH) inside Docker..."
  DOCKER="${DOCKER:-docker}"
  if ! command -v "$DOCKER" >/dev/null 2>&1; then
    if [[ -x "/Applications/Docker.app/Contents/Resources/bin/docker" ]]; then
      DOCKER="/Applications/Docker.app/Contents/Resources/bin/docker"
    else
      fail "Docker required. Install Docker Desktop: https://docker.com/products/docker-desktop"
    fi
  fi
  PLATFORM="linux/amd64"
  [[ "$ARCH" == "arm64" ]] && PLATFORM="linux/arm64"
  "$DOCKER" build --platform "$PLATFORM" -f "$ROOT/scripts/Dockerfile.tauos-build" -t tauos-builder "$ROOT"
  "$DOCKER" run --rm --platform "$PLATFORM" --privileged \
    -e TAUOS_ARCH="$ARCH" \
    -e TAUOS_ROOT=/tauos \
    -e TAUOS_REBUILD_ROOTFS="${TAUOS_REBUILD_ROOTFS:-0}" \
    -e TAUOS_FORCE_KERNEL="${TAUOS_FORCE_KERNEL:-0}" \
    -v "$ROOT:/tauos" \
    tauos-builder \
    /tauos/scripts/build-tauos-native.sh
  exit 0
fi

# Native path delegates to inner script
exec "$ROOT/scripts/build-tauos-native.sh"
