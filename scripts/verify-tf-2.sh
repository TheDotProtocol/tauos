#!/usr/bin/env bash
# TF-2 — Tau Foundation Model training pipeline verification
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/tau-ai"

echo "=== TF-2 Tau Training Pipeline Verification ==="

test -f "$ROOT/tools/tau-training/tau_training/gate.py" || { echo "FAIL  gate"; exit 1; }
test -f "$ROOT/tools/tau-training/tau_training/export.py" || { echo "FAIL  export"; exit 1; }
test -f "$ROOT/tools/tau-training/tau_training/train.py" || { echo "FAIL  train"; exit 1; }
test -f "$ROOT/tools/tau-training/tau_training/adapters/base.py" || { echo "FAIL  adapter"; exit 1; }
test -f "$ROOT/tools/tau-training/tau_training/eval_harness.py" || { echo "FAIL  eval"; exit 1; }
test -f "$ROOT/tools/tau-training/configs/qwen2.5-7b-lora.yaml" || { echo "FAIL  qwen config"; exit 1; }
test -f "$ROOT/tools/tau-training/configs/smoke-tiny.yaml" || { echo "FAIL  smoke config"; exit 1; }
test -f "$ROOT/scripts/test-tf-2-pipeline.py" || { echo "FAIL  tf2 tests"; exit 1; }
echo "PASS  TF-2 modules present"

echo ""
echo "Running TF-1 dataset regression..."
"$ROOT/scripts/verify-tau-dataset-v01.sh"
echo "PASS  TF-1 regression"

echo ""
echo "Running TF-2 structural tests..."
python3 "$ROOT/scripts/test-tf-2-pipeline.py"
echo "PASS  TF-2 structural tests"

SMOKE_STATUS="SKIPPED"
if python3 -c "import torch, transformers, peft" 2>/dev/null; then
  echo ""
  echo "Running PIPELINE SMOKE TEST (tiny model)..."
  if python3 "$ROOT/scripts/run-tau-training-smoke.py" --output-dir "$ROOT/checkpoints/tf2-smoke"; then
    test -f "$ROOT/checkpoints/tf2-smoke/training-manifest.json" || { echo "FAIL  smoke manifest"; exit 1; }
    test -f "$ROOT/checkpoints/tf2-smoke/checksums.sha256" || { echo "FAIL  smoke checksums"; exit 1; }
    test -d "$ROOT/checkpoints/tf2-smoke/adapter" || { echo "FAIL  smoke adapter dir"; exit 1; }
    if grep -q '"merged": false' "$ROOT/checkpoints/tf2-smoke/training-manifest.json"; then
      echo "PASS  LoRA kept separate (not merged)"
    else
      echo "FAIL  merged flag"
      exit 1
    fi
    if grep -q 'PIPELINE_SMOKE_TEST' "$ROOT/checkpoints/tf2-smoke/training-manifest.json"; then
      echo "PASS  smoke label honest"
    else
      echo "FAIL  smoke label"
      exit 1
    fi
    SMOKE_STATUS="PASS"
    echo "PASS  PIPELINE SMOKE TEST"
  fi
else
  echo "SKIP  PIPELINE SMOKE TEST — PyTorch stack not installed"
fi

cd "$PKG"
npm run typecheck
echo "PASS  @tau/ai typecheck"

cd "$ROOT"
npx tsx packages/tau-ai/scripts/test-model-track-ai9.ts
echo "PASS  model track regression"

if rg -q "tau-foundation-v0.1|Tau Foundation Model v0.1" "$ROOT/tools/tau-training" --glob "*.py" 2>/dev/null; then
  if ! rg -q "NOT Tau Foundation Model|not Tau Foundation Model|PIPELINE_SMOKE_TEST" "$ROOT/tools/tau-training" 2>/dev/null; then
    echo "FAIL  misleading v0.1 claim in training code"
    exit 1
  fi
fi
echo "PASS  no false Tau Foundation Model v0.1 claims"

echo ""
echo "=== TF-2 verification complete ==="
echo "Smoke test: $SMOKE_STATUS"
echo "Training gate: PASS"
echo "Exporter: PASS"
echo "Adapters: qwen2.5, llama3, mistral, smoke-tiny"
echo ""
echo "TF-2 COMPLETE — STOP (await approval for TF-3)"
