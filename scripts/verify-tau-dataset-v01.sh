#!/usr/bin/env bash
# TF-1 — Tau Dataset v0.1 verification
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"
DATASET="$ROOT/datasets/tau-foundation/v0.1"

echo "=== TF-1 Tau Dataset v0.1 Verification ==="

test -f "$ROOT/tools/tau-dataset/schema.ts" || { echo "FAIL  schema module"; exit 1; }
test -f "$ROOT/tools/tau-dataset/validate.ts" || { echo "FAIL  validate module"; exit 1; }
test -f "$ROOT/tools/tau-dataset/build.ts" || { echo "FAIL  build module"; exit 1; }
test -f "$DATASET/schema/tau-record.schema.json" || { echo "FAIL  JSON schema"; exit 1; }
test -f "$ROOT/scripts/build-tau-dataset-v01.ts" || { echo "FAIL  build script"; exit 1; }
test -f "$ROOT/scripts/test-tau-dataset-v01.ts" || { echo "FAIL  test script"; exit 1; }
echo "PASS  TF-1 modules present"

npx tsx "$ROOT/scripts/build-tau-dataset-v01.ts"
echo "PASS  dataset build"

npx tsx "$ROOT/scripts/test-tau-dataset-v01.ts"
echo "PASS  dataset tests"

test -f "$DATASET/manifests/tau-dataset-v0.1.json" || { echo "FAIL  manifest missing"; exit 1; }
test -f "$DATASET/reports/tau-dataset-v0.1-validation.json" || { echo "FAIL  validation report"; exit 1; }
test -f "$DATASET/train/tau-dataset-v0.1.jsonl" || { echo "FAIL  train split"; exit 1; }
test -f "$DATASET/validation/tau-dataset-v0.1.jsonl" || { echo "FAIL  validation split"; exit 1; }
test -f "$DATASET/test/tau-dataset-v0.1.jsonl" || { echo "FAIL  test split"; exit 1; }
echo "PASS  artifacts present"

cd "$PKG"
npm run typecheck
echo "PASS  @tau/ai typecheck"

cd "$ROOT"
npx tsx packages/tau-ai/scripts/test-model-track-ai9.ts
echo "PASS  model track regression"

if rg -q "sk-[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}|BEGIN PRIVATE KEY" "$DATASET" 2>/dev/null; then
  echo "FAIL  possible secrets in dataset"
  exit 1
fi
echo "PASS  no secrets in dataset tree"

if rg -q '"type": "UNKNOWN"' "$DATASET/train" "$DATASET/validation" "$DATASET/test" 2>/dev/null; then
  echo "FAIL  UNKNOWN provenance in splits"
  exit 1
fi
echo "PASS  no UNKNOWN provenance in splits"

echo ""
echo "=== TF-1 verification complete ==="
echo "Dataset: tau-dataset-v0.1"
echo "Manifest: datasets/tau-foundation/v0.1/manifests/tau-dataset-v0.1.json"
echo ""
echo "TF-1 COMPLETE — STOP (await approval for TF-2)"
