#!/usr/bin/env bash
# RN 0.72: default boost jfrog mirror is broken — use archives.boost.io
set -euo pipefail
PODSPEC="node_modules/react-native/third-party-podspecs/boost.podspec"
if [[ ! -f "$PODSPEC" ]]; then
  exit 0
fi
python3 - <<'PY'
from pathlib import Path
path = Path("node_modules/react-native/third-party-podspecs/boost.podspec")
text = path.read_text()
old = "https://boostorg.jfrog.io/artifactory/main/release/1.76.0/source/boost_1_76_0.tar.bz2"
new = "https://archives.boost.io/release/1.76.0/source/boost_1_76_0.tar.bz2"
if old in text:
    path.write_text(text.replace(old, new))
PY
