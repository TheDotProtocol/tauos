#!/usr/bin/env bash
# macOS dev host: repo tool + Android Studio path hints (M3)
set -euo pipefail

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Use setup-host-linux.sh on Linux."
  exit 1
fi

# repo
if ! command -v repo >/dev/null; then
  if command -v brew >/dev/null; then
    brew install repo || true
  fi
  if ! command -v repo >/dev/null; then
    mkdir -p "$HOME/bin"
    curl -fsSL -o "$HOME/bin/repo" https://storage.googleapis.com/git-repo-downloads/repo
    chmod +x "$HOME/bin/repo"
    grep -q 'HOME/bin' "$HOME/.zshrc" 2>/dev/null || echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.zshrc"
  fi
fi

# Android SDK default
SDK="$HOME/Library/Android/sdk"
if [[ -d "$SDK" ]]; then
  echo "ANDROID_HOME=$SDK"
  grep -q 'ANDROID_HOME' "$HOME/.zshrc" 2>/dev/null || {
    echo "export ANDROID_HOME=$SDK" >> "$HOME/.zshrc"
    echo 'export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"' >> "$HOME/.zshrc"
  }
else
  echo "Install Android Studio: https://developer.android.com/studio"
fi

echo "Done. Restart shell, then: mobile/aosp/scripts/validate-environment.sh"
echo "Note: Full AOSP compile requires Linux — macOS uses emulator path for M3."
