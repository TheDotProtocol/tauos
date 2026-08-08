# TF-2 — Tau Foundation Model Training Pipeline v0.1

**Milestone:** TF-2 — Reproducible training pipeline  
**Status:** COMPLETE · **STOP** (await approval for TF-3)  
**Pipeline version:** `0.1.0`

---

## Objective

Build a **production-quality, reproducible training pipeline** that consumes **Tau Dataset v0.1** (Gold Set — unchanged) and produces **Tau checkpoints** (LoRA adapters) — without claiming **Tau Foundation Model v0.1** (reserved for TF-5).

```
Tau Dataset v0.1 (Gold — 106 records)
        ↓
Training Gate (fail closed)
        ↓
Exporter → training JSONL + export manifest
        ↓
BaseModelAdapter (Qwen initial; swappable)
        ↓
LoRA / QLoRA SFT
        ↓
Tau Checkpoint (adapter separate from base)
        ↓
Evaluation harness (structural in TF-2)
```

---

## Terminology

| Term | Meaning |
|------|---------|
| Third-party model | Qwen, Llama, Mistral, etc. |
| Base model | Starting checkpoint (initial: Qwen2.5-7B-Instruct) |
| Tau Dataset | Governed corpus (`tau-dataset-v0.1`) |
| Tau training pipeline | This infrastructure |
| Tau checkpoint | Output of our pipeline (LoRA adapter + manifest) |
| Tau Foundation Model v0.1 | **TF-5 only** — not TF-2 |

---

## Architecture

```
tools/tau-training/
  tau_training/
    gate.py              Training gate
    export.py            Dataset → JSONL exporter
    manifest.py          Training manifest + config hash
    checkpoint.py        Adapter bundle + SHA256
    train.py             prepare + PIPELINE SMOKE TEST
    eval_harness.py      Eval interface (structural only)
    adapters/
      base.py            BaseModelAdapter
      qwen.py            Initial base (third-party)
      llama.py           Future
      mistral.py         Future
      smoke.py           Tiny HF test model
  configs/
    qwen2.5-7b-lora.yaml Production-intent (DO NOT RUN in TF-2)
    smoke-tiny.yaml      PIPELINE SMOKE TEST
  requirements.txt
```

---

## Prerequisites

**Structural tests (always):**

- Python 3.10+
- TF-1 dataset at `datasets/tau-foundation/v0.1/`

**PIPELINE SMOKE TEST (optional):**

```bash
pip install -r tools/tau-training/requirements.txt
```

Downloads **only** `hf-internal-testing/tiny-random-LlamaForCausalLM` (~KB scale) — not Qwen 7B.

---

## Training gate

Training **refuses to start** if:

- Dataset `validationStatus != PASS`
- Validation report has errors
- `UNKNOWN` or `NOT_PERMITTED` provenance
- Test split leakage (id or input overlap)
- Export of `test` split requested
- Missing manifest hash / validation report

```python
from tau_training.gate import run_training_gate
result = run_training_gate(dataset_root)
result.raise_if_blocked()
```

---

## Dataset split (preserved — not altered)

| Split | Count | TF-2 usage |
|-------|-------|------------|
| Train | 96 | Export + smoke |
| Validation | 1 | Export only |
| Test | 9 | **Protected** — eval harness only |

### Validation split limitation

**1 validation example is insufficient** for reliable model selection or early stopping conclusions.

- TF-2 does **not** change the split
- Recommend **future dataset revision** (Phase B) with ≥50–100 validation examples before serious TF-3 7B training

---

## Exporter

```bash
python3 scripts/export-tau-training-data.py --split train --adapter-id qwen2.5
```

Each export artifact retains:

- `datasetVersion`, `datasetManifestHash`
- `sourceRecordIds`
- `baseModelId`, `templateId`, `adapterId`
- `exportHash`, `pipelineVersion`
- `trainingConfigHash` (when provided)

---

## Base model adapter

`BaseModelAdapter` boundary supports:

| adapter_id | Base model | Provider |
|------------|------------|----------|
| `qwen2.5` | Qwen/Qwen2.5-7B-Instruct | qwen (third-party) |
| `llama3` | meta-llama/Meta-Llama-3-8B-Instruct | meta |
| `mistral` | mistralai/Mistral-7B-Instruct-v0.3 | mistral |
| `smoke-tiny` | hf-internal-testing/tiny-random-LlamaForCausalLM | HF test |

Pipeline code does not hard-code Qwen outside the adapter.

---

## Commands

**Verify TF-2:**

```bash
chmod +x scripts/verify-tf-2.sh
./scripts/verify-tf-2.sh
```

**Prepare exports (no training):**

```bash
python3 scripts/test-tf-2-pipeline.py
```

**PIPELINE SMOKE TEST:**

```bash
python3 scripts/run-tau-training-smoke.py
```

**Production-intent config (TF-3+ — not TF-2):**

`tools/tau-training/configs/qwen2.5-7b-lora.yaml`

---

## Checkpoint format

```
checkpoints/tf2-smoke/
  adapter/                 LoRA weights (separate from base)
  training-manifest.json   Full provenance + hyperparameters
  checkpoint-meta.json     Type, merged=false, label
  checksums.sha256         File hashes
  smoke-result.json        Smoke outcome
  README.txt               Honest labeling
```

- **LoRA not merged** into base weights
- Label: `PIPELINE_SMOKE_TEST` or `TAU_CHECKPOINT` — never `Tau Foundation Model v0.1` in TF-2

---

## Evaluation harness

`tau_training/eval_harness.py` — TF-2 runs **structural checks only**:

- Loads 9 protected test records
- Verifies categories and fields
- **No quality scores**, no model inference claims

Future TF-4: constitution, tool use, ecosystem eval with checkpoint inference.

---

## Provider independence

- No AWS/Azure/GCP/Lambda/RunPod dependency
- Runs on any Linux/macOS with Python (+ optional GPU)
- Configs are portable YAML
- Checkpoints are filesystem artifacts

---

## Limitations (TF-2)

- No serious 7B training run
- No Qwen weight download in default verify path
- No dataset expansion (106 Gold Set unchanged)
- No LoRA merge
- No production routing changes
- Validation split too small for model selection

---

## Estimated requirements — first real training (TF-3)

| Item | Estimate |
|------|----------|
| Base model | Qwen2.5-7B-Instruct (~15 GB download) |
| Method | QLoRA SFT on 96 examples |
| GPU | 1× 24 GB+ (4090) or 1× A100 40GB+ |
| Time | ~1–4 hours (hardware dependent) |
| Cost | $0 local or ~$2–$20 cloud spot |
| Prerequisite | Expand validation split recommended |

---

## Verification

`scripts/verify-tf-2.sh` checks:

- TF-1 dataset regression
- Training gate, exporter, adapters, config hash
- Test split protection
- Prepare path (no weights)
- Eval harness structural
- Optional PIPELINE SMOKE TEST
- `@tau/ai` typecheck + model track

---

## STOP

TF-2 complete. Do not begin TF-3 without approval. Do not call smoke output Tau Foundation Model v0.1.
