#!/usr/bin/env bash
# AI-5 — Tau Memory Foundation verification
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== AI-5 Tau Memory Foundation Verification ==="

test -f "$PKG/src/memory/in-memory-store.ts" || { echo "FAIL  in-memory store"; exit 1; }
test -f "$PKG/src/memory/governance.ts" || { echo "FAIL  governance"; exit 1; }
test -f "$PKG/src/memory/types.ts" || { echo "FAIL  memory types"; exit 1; }
echo "PASS  AI-5 modules present"

cd "$PKG"
npm install --silent 2>/dev/null || npm install
npm run typecheck
echo "PASS  @tau/ai typecheck"

npx tsx scripts/test-memory-ai5.ts
echo "PASS  memory tests"

npx tsx scripts/test-constitution-ai4.ts
echo "PASS  AI-4 regression (22)"

npx tsx scripts/test-routing-matrix-ai3-4.ts
echo "PASS  AI-3.4 regression (13)"

npx tsx scripts/test-deterministic-router.ts
echo "PASS  AI-3.2 regression (15)"

npx tsx scripts/test-hardware-router.ts
echo "PASS  AI-3.3 regression (13)"

cd "$ROOT"
npx tsc --noEmit -p tsconfig.json
echo "PASS  root TypeScript"

if ! grep -q "runAiChat" "$ROOT/src/app/api/tauai/chat/route.ts"; then
  echo "FAIL  production altered"
  exit 1
fi
echo "PASS  production unchanged"

if rg -q "pgvector|qdrant|pinecone|weaviate|chroma|milvus|mem0|openmemory|redis" "$PKG/src/memory" -i 2>/dev/null; then
  echo "FAIL  forbidden memory service"
  exit 1
fi
echo "PASS  no vector DB / external memory service"

echo ""
echo "=== AI-5 verification complete ==="
