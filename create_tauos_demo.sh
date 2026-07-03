#!/bin/bash
# TauOS Demo Build — DEPRECATED
# Redirects to the real OS build pipeline.
echo "NOTE: create_tauos_demo.sh is deprecated."
echo "Building real TauOS ISO instead..."
exec "$(dirname "$0")/scripts/build-tauos.sh" "$@"
