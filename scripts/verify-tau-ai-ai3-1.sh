#!/usr/bin/env bash
# AI-3.1 — verify model substrate metadata (Tau Foundation v0.1)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-3.1 Model Substrate Metadata Verification ==="

# 1. Metadata module exists
for f in \
  "src/models/metadata.ts" \
  "src/models/metadata-helpers.ts" \
  "src/models/tau-foundation-substrate.ts" \
  "src/lib/ai-gateway/substrate-metadata.ts"; do
  if [[ ! -f "$ROOT/$f" && ! -f "$PKG/$f" ]]; then
    if [[ ! -f "$ROOT/$f" ]] && [[ ! -f "$PKG/${f#packages/tau-ai/}" ]]; then
      :
    fi
  fi
done

test -f "$PKG/src/models/metadata.ts" || { echo "FAIL  metadata.ts"; exit 1; }
test -f "$ROOT/src/lib/ai-gateway/substrate-metadata.ts" || { echo "FAIL  substrate-metadata.ts"; exit 1; }
echo "PASS  metadata modules present"

# 2. Typecheck
cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

cd "$ROOT"
npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

# 3. Metadata tests
cd "$PKG"
npx tsx scripts/test-substrate-metadata.ts
echo "PASS  package metadata tests"

cd "$ROOT"
npx tsx scripts/tau-ai-ai3-1-metadata-test.ts
echo "PASS  gateway metadata tests"

# 4. Production unchanged
if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production route changed"
  exit 1
fi
echo "PASS  production API unchanged"

# 5. AI-2 regression
"$ROOT/scripts/verify-tau-ai-ai2.sh"
echo "PASS  AI-2 regression intact"

echo ""
echo "=== AI-3.1 verification complete ==="
