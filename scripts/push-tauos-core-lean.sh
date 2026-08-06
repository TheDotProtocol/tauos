#!/usr/bin/env bash
# Minimal tauos-core push — OS + installer source only (no legacy website trees).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORG="${GITHUB_ORG:-TheDotProtocol}"
CORE_REPO="$ORG/tauos-core"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

CORE="$WORK/tauos-core"
mkdir -p "$CORE/scripts/rootfs"

for p in os os-code release-files; do
  [[ -e "$ROOT/$p" ]] && rsync -a --exclude node_modules --exclude dist --exclude 'resources/*.iso' --exclude target "$ROOT/$p" "$CORE/"
done

for f in build-tauos.sh build-tauos-native.sh configure-tauos-rootfs.sh Dockerfile.tauos-build \
         build-all-artifacts.sh build-linux-deb-docker.sh validate-os-artifacts.sh run-release-tests.sh; do
  [[ -f "$ROOT/scripts/$f" ]] && cp "$ROOT/scripts/$f" "$CORE/scripts/"
done
cp -r "$ROOT/scripts/rootfs/"* "$CORE/scripts/rootfs/" 2>/dev/null || true

cat > "$CORE/README.md" <<'EOF'
# Tau OS Core (Private)

Kernel, rootfs, ISO builds, and Electron installer source. **Maintainers only.**

Public site: https://github.com/TheDotProtocol/tauos

## Build ARM64 ISO (Docker on Mac)
```bash
TAUOS_REBUILD_ROOTFS=1 ./scripts/build-tauos.sh --docker --arch arm64
```

## Build Linux .deb (Docker on Mac — no Linux machine needed)
```bash
./scripts/build-linux-deb-docker.sh arm64
```

## Bundle ISO in Electron installer
```bash
mkdir -p os-code/installer-scripts/resources
cp release-files/TauOS-Desktop-v1.0.0.iso os-code/installer-scripts/resources/TauOS-Desktop.iso
cd os-code/installer-scripts && npm run build-mac
```
EOF

cat > "$CORE/.gitignore" <<'EOF'
node_modules/
dist/
resources/*.iso
release-files/*.iso
*.iso
build/
target/
.env*
EOF

cd "$CORE"
git init -b main
git add -A
git commit -m "Initial tauos-core: OS build pipeline and installer source"
git remote add origin "https://github.com/$CORE_REPO.git"
git push -u origin main --force

echo "✓ Pushed lean $CORE_REPO"
