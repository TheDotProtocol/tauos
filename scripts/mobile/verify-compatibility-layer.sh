#!/usr/bin/env bash
# Verify Tau Compatibility Platform skeleton (M5.1)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPAT="$ROOT/mobile/compatibility"
pass=0 fail=0

ok() { echo "  PASS  $*"; pass=$((pass+1)); }
no() { echo "  FAIL  $*"; fail=$((fail+1)); }

echo "=== M5.1 Compatibility Layer Verification ==="

[[ -f "$COMPAT/product/tau_compatibility.mk" ]] && ok "product/tau_compatibility.mk" || no "product makefile"
[[ -f "$COMPAT/product/BoardConfig.mk" ]] && ok "product/BoardConfig.mk" || no "BoardConfig.mk"
[[ -f "$COMPAT/config/tau.prop" ]] && ok "config/tau.prop" || no "tau.prop"
[[ -f "$COMPAT/overlay/frameworks/base/core/res/res/values/tau_strings.xml" ]] && ok "overlay strings" || no "overlay"
[[ -f "$ROOT/scripts/mobile/apply-compatibility-to-aosp.sh" ]] && ok "apply script" || no "apply script"
grep -q 'ro.tau.platform' "$COMPAT/config/tau.prop" && ok "ro.tau.platform defined" || no "ro.tau props"

echo ""
echo "Result: $pass pass, $fail fail"
[[ "$fail" -eq 0 ]]
