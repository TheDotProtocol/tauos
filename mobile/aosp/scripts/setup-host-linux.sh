#!/usr/bin/env bash
# Ubuntu 22.04+ host packages for AOSP build (run once on Linux build machine)
set -euo pipefail

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "This script is for Ubuntu/Debian Linux only."
  exit 1
fi

sudo apt-get update
sudo apt-get install -y \
  git-core gnupg flex bison build-essential zip curl zlib1g-dev \
  libc6-dev libncurses-dev x11proto-core-dev libx11-dev libgl1-mesa-dev \
  libxml2-utils libxml2-dev libxslt1-dev python3 python3-pip \
  unzip fontconfig libssl-dev bc rsync

# repo tool
if ! command -v repo >/dev/null; then
  mkdir -p "$HOME/bin"
  curl -o "$HOME/bin/repo" https://storage.googleapis.com/git-repo-downloads/repo
  chmod +x "$HOME/bin/repo"
  echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.bashrc"
fi

echo "Done. Open a new shell, then: mobile/aosp/scripts/validate-environment.sh"
