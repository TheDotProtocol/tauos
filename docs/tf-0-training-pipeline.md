# TF-0 — Training Pipeline Design

**Status:** Architecture design (TF-0)  
**Not implemented:** No tooling installed in production, no training runs

---

## Pipeline overview

```
┌─────────────┐
│  Raw Data   │  Third-party + Tau-created sources
└──────┬──────┘
       ▼
┌─────────────┐
│License Audit│  Block unverified sources
└──────┬──────┘
       ▼
┌─────────────┐
│ Provenance  │  Registry entry per source + version hash
└──────┬──────┘
       ▼
┌─────────────┐
│  Cleaning   │  PII scan, encoding, length bounds
└──────┬──────┘
       ▼
┌─────────────┐
│ Dedup       │  MinHash / exact hash
└──────┬──────┘
       ▼
┌─────────────┐
│ Filtering   │  Constitution lint, quality heuristics
└──────┬──────┘
       ▼
┌─────────────┐
│ Formatting  │  Chat template (Qwen/Llama format)
└──────┬──────┘
       ▼
┌─────────────┐
│ Split       │  Train / val / test (contamination-safe)
└──────┬──────┘
       ▼
┌─────────────┐
│Tokenization │  Base model tokenizer (frozen for SFT)
└──────┬──────┘
       ▼
┌─────────────┐
│ Training    │  LoRA SFT → optional DPO
└──────┬──────┘
       ▼
┌─────────────┐
│ Evaluation  │  Tau eval suite + constitution eval
└──────┬──────┘
       ▼
┌─────────────┐
│ Safety      │  Red-team prompts, refusal calibration
└──────┬──────┘
       ▼
┌─────────────┐
│ Checkpoint  │  Versioned artifact + manifest
└──────┬──────┘
       ▼
┌─────────────┐
│ Model Card  │  Provenance, limitations, license
└──────┬──────┘
       ▼
┌─────────────┐
│ Registry    │  Internal model registry (not public Hub yet)
└──────┬──────┘
       ▼
┌─────────────┐
│ Substrate   │  tau-foundation ModelSubstrate integration (TF-8)
└─────────────┘
```

---

## Recommended v0.1 training recipe

### Phase 1 — LoRA SFT (TF-3)

| Parameter | Recommendation |
|-----------|----------------|
| Base | Qwen2.5-7B-Instruct |
| Method | QLoRA (4-bit) or LoRA (16-bit) |
| Rank | 16–64 (start 32) |
| Epochs | 1–3 (early stop on val loss) |
| LR | 1e-4 – 2e-4 (typical LoRA range) |
| Batch | Effective 64–128 via grad accumulation |
| Seq length | 4096–8192 (match data) |
| Tools | PEFT + TRL SFTTrainer or Axolotl config |

### Phase 2 — Optional DPO (TF-3/4)

| Parameter | Recommendation |
|-----------|----------------|
| Data | tau-preference-v01 (500–2K pairs) |
| Beta | 0.1–0.5 |
| Purpose | Constitutional preference, tone, uncertainty |

### Phase 3 — NOT in v0.1

- Continued pretraining on large corpus
- Full-weight SFT without LoRA (unless eval shows LoRA insufficient)
- RLHF at scale

---

## Tooling evaluation

| Tool | Role | TF-0 assessment |
|------|------|-----------------|
| **PyTorch** | Core framework | Standard — use |
| **Hugging Face Transformers** | Model + tokenizer | Standard — use |
| **Datasets** | Data loading | Standard — use |
| **PEFT / LoRA** | Efficient fine-tuning | Recommended for v0.1 |
| **TRL** | SFT, DPO, PPO | Recommended |
| **Axolotl** | YAML-driven training orchestration | Recommended for reproducibility |
| **LLaMA-Factory** | Alternative orchestration | Viable alternative |
| **Unsloth** | Fast LoRA | Optional speed optimization |
| **DeepSpeed ZeRO** | Multi-GPU memory | Use at Tier 2+ |
| **FSDP** | PyTorch native sharding | Alternative to DeepSpeed |
| **Weights & Biases / MLflow** | Experiment tracking | Recommended |
| **vLLM** | Inference validation | Post-training eval |
| **Ollama** | Local deployment test | Developer tier |
| **llama.cpp / GGUF** | Edge quantization | Optional export path |

**Do not add to production repo in TF-0.** Training lives in separate `tau-ml/` or `tools/training/` repo/path in TF-2.

---

## Reproducibility requirements

Every training run must produce a **manifest**:

```yaml
run_id: uuid
dataset_version: tau-dataset-v0.1.0+<hash>
base_model: Qwen/Qwen2.5-7B-Instruct
base_model_revision: <hf commit sha>
method: qlora_sft
hyperparameters: { ... }
hardware: { gpu_type, count, provider }
software: { torch, transformers, peft, trl, commit_sha }
seed: 42
checkpoint_path: ...
eval_results: { suite_version, scores }
license_inherited: Apache-2.0
tau_contributions: [dataset hashes]
```

---

## Constitution in training (not replacement)

| Stage | Constitution integration |
|-------|-------------------------|
| Data | `tau-constitution-v01-sft` examples |
| SFT | System prompts include constitutional principles (subset) |
| DPO | Prefer constitution-compliant completions |
| Eval | Deterministic Constitution evaluator + model-judged scenarios |
| Inference | Full Constitution engine in Foundation pipeline — **always active** |

**Never** train the model to bypass Constitution checks.

---

## Checkpoint governance

| Rule | Policy |
|------|--------|
| Naming | `tau-foundation-v0.1-<phase>-<run_id>` |
| Storage | Encrypted at rest; access controlled |
| Promotion | TF-4 eval gates required before TF-5 label |
| Distribution | No public Hub until TF-7 without legal review |
| Merge | LoRA adapter merge optional for deployment |

---

## Integration with existing substrate

When TF-8 arrives, checkpoint plugs into:

```typescript
// packages/tau-ai/src/models/tau-foundation-substrate.ts
// isConfigured() → true when weights + inference endpoint available
// provenance.modelId → 'tau-foundation-v0.1'
// verificationLevel → MODEL_LIVE_VERIFIED (only after testing)
```

No special router bypass. Same capability metadata flow as Qwen/Llama substrates.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Overfitting small Tau dataset | Holdout eval, early stopping, diverse categories |
| Catastrophic forgetting | Mix 10–20% general instruction data (licensed) |
| License violation | Provenance registry gate |
| False capability claims | Eval suite before any LIVE verification |
| Non-reproducible runs | Manifest + pinned dependencies |

---

## TF-2 deliverables (next engineering milestone)

1. `tau-ml/` training repo or isolated directory
2. Axolotl (or LLaMA-Factory) config templates
3. CI smoke test (1-step train on tiny subset)
4. Manifest generator
5. Checkpoint upload to internal registry

---

## STOP

No training pipeline code in production. Await TF-2 approval.
