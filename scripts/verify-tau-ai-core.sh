#!/usr/bin/env bash
# AI-1 — verify @tau/ai core interface scaffold (no production wiring)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"
GATEWAY="$ROOT/src/lib/ai-gateway"

echo "=== AI-1 Tau AI Core Verification ==="

# 1. Package exists
if [[ ! -d "$PKG/src" ]]; then
  echo "FAIL  packages/tau-ai/ not found"
  exit 1
fi
echo "PASS  packages/tau-ai/ exists"

# 2. Required contract modules exist
REQUIRED=(
  "src/core/intelligence.ts"
  "src/memory/store.ts"
  "src/routing/router.ts"
  "src/constitution/constitution.ts"
  "src/tools/registry.ts"
  "src/execution/adapter.ts"
  "src/client/tau-ai-client.ts"
  "src/models/substrate.ts"
)
for f in "${REQUIRED[@]}"; do
  if [[ ! -f "$PKG/$f" ]]; then
    echo "FAIL  missing $f"
    exit 1
  fi
done
echo "PASS  seven core contracts present (+ model substrate)"

# 3. TypeScript compiles
cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck + export surface (verify-exports.ts)"

# 5. Circular dependency guard (layered imports within package)
# types → models/memory/routing/constitution/tools/execution → core → client
# Higher layers must not be imported by types/
if rg -q "from ['\"]\.\./(core|client)/" "$PKG/src/types" 2>/dev/null; then
  echo "FAIL  types/ imports from core/ or client/"
  exit 1
fi
if grep -rq "from ['\"]\.\./client/" "$PKG/src/models" "$PKG/src/memory" "$PKG/src/routing" \
  "$PKG/src/constitution" "$PKG/src/tools" "$PKG/src/execution" "$PKG/src/core" 2>/dev/null; then
  echo "FAIL  internal module imports client/ (would risk cycles)"
  exit 1
fi
echo "PASS  no circular dependency patterns detected"

# 6. Existing ai-gateway unchanged (still present, not deleted)
for gf in "index.ts" "types.ts" "registry.ts"; do
  if [[ ! -f "$GATEWAY/$gf" ]]; then
    echo "FAIL  ai-gateway/$gf missing"
    exit 1
  fi
done
echo "PASS  ai-gateway/ intact"

# 7. Canonical Tau AI API routes still present
for route in \
  "src/app/api/tauai/chat/route.ts" \
  "src/app/api/tauai/models/route.ts" \
  "src/app/api/tauai/voice/route.ts" \
  "src/app/api/taumail/ai/route.ts"; do
  if [[ ! -f "$ROOT/$route" ]]; then
    echo "FAIL  missing $route"
    exit 1
  fi
done
echo "PASS  Tau AI API routes present"

# 8. Root project typecheck (existing app — no @tau/ai wiring yet)
cd "$ROOT"
if command -v npx >/dev/null 2>&1; then
  npx tsc --noEmit -p tsconfig.json
  echo "PASS  root TypeScript (existing app)"
else
  echo "WARN  npx not available — skipped root typecheck"
fi

# 9. ai-gateway module still importable from app context
node --input-type=module -e "
  import { readFileSync } from 'fs';
  const chat = readFileSync('$ROOT/src/app/api/tauai/chat/route.ts', 'utf8');
  if (!chat.includes('ai-gateway')) {
    console.error('FAIL  /api/tauai/chat no longer references ai-gateway');
    process.exit(1);
  }
  console.log('PASS  /api/tauai/chat still uses ai-gateway');
"

echo ""
echo "=== AI-1 verification complete ==="
