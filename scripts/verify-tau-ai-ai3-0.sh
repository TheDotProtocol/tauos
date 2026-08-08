#!/usr/bin/env bash
# AI-3.0 — verify capability registry (no production routing changes)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-3.0 Capability Registry Verification ==="

# 1. Capability module exists
for f in \
  "src/capabilities/types.ts" \
  "src/capabilities/registry.ts" \
  "src/capabilities/defaults.ts" \
  "src/capabilities/index.ts"; do
  if [[ ! -f "$PKG/$f" ]]; then
    echo "FAIL  missing $f"
    exit 1
  fi
done
echo "PASS  capability module present"

# 2. Typecheck @tau/ai
cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

# 3. Capability registry tests
npx tsx scripts/test-capability-registry.ts
echo "PASS  capability registry tests"

# 4. Root typecheck (no production changes)
cd "$ROOT"
npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

# 5. Production path unchanged
if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  /api/tauai/chat no longer uses runAiChat"
  exit 1
fi
if grep -q "lib/tau-ai" "$ROOT/src/app/api/tauai/chat/route.ts" 2>/dev/null; then
  echo "FAIL  /api/tauai/chat prematurely wired to tau-ai router"
  exit 1
fi
echo "PASS  production API path unchanged"

# 6. AI-2 regression still passes (substrate bridge intact)
if [[ -x "$ROOT/scripts/verify-tau-ai-ai2.sh" ]]; then
  "$ROOT/scripts/verify-tau-ai-ai2.sh"
  echo "PASS  AI-2 regression intact"
fi

echo ""
echo "=== AI-3.0 verification complete ==="
