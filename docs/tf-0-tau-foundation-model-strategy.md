# TF-0 — Tau Foundation Model v0.1 Strategy

**Milestone:** TF-0 — Research + Engineering Planning  
**Status:** COMPLETE · **STOP** (await approval for TF-1)  
**Date:** 2026-08-08  
**Scope:** Planning only — no training, no weights, no infrastructure provisioned

---

## Executive summary

Tau Foundation Model v0.1 should be built as a **governed derivative open-weight model** — not as a from-scratch foundation model and not as a rebranded third-party checkpoint.

**Recommended path (fastest credible Tau-owned model):**

| Decision | Recommendation | Confidence |
|----------|----------------|------------|
| **Base model** | **Qwen2.5-7B-Instruct** (Apache 2.0 variant) | VERIFIED license for 7B; REQUIRES LEGAL REVIEW for “Tau-owned” branding |
| **Parameter size (v0.1)** | **7B** (POC experiments at 1.5B optional) | Engineering judgment |
| **Training method** | **Supervised fine-tuning (LoRA/QLoRA) + optional DPO** on open-weight base | Industry standard; lowest risk |
| **Dataset strategy** | **Tau-created + Tau-transformed + audited third-party** — no rename-and-republish | Policy |
| **Compute (beta)** | **Single-GPU POC → 4–8× cloud GPU SFT** | Cost bands are estimates |
| **Timeline to v0.1 beta** | **~3–5 months** after TF-1 approval (small team) | Estimate — REQUIRES VERIFICATION |
| **Training from scratch** | **Not realistic today** | Technical + economic |

**What “Tau-owned” honestly means for v0.1:**

- Tau owns: training pipeline, dataset curation, evaluation, checkpoints, model card, deployment integration, and **derivative weight adaptations** created by Tau’s training work (subject to base license).
- Tau does **not** own: the original Qwen/Llama/Mistral architecture or pretraining corpus.
- Public description must state: **“Tau Foundation Model v0.1 — fine-tuned derivative of [base model], trained on Tau Dataset v0.1.”**

Third-party substrates (Qwen, DeepSeek, Llama, etc.) remain third-party. They are not renamed as Tau models.

---

## Strategic separation (mandatory)

```
TAU FOUNDATION          = intelligence architecture (Constitution, Memory, Router, Tools, Execution)
TAU FOUNDATION MODEL    = Tau-trained/derived weights plugged in as ModelSubstrate
THIRD-PARTY SUBSTRATES  = Qwen, Llama, Mistral, etc. — never misrepresented as Tau-owned
```

Target integration (unchanged from AI-8/AI-11):

```
Tau Foundation Model weights
        ↓
tau-foundation ModelSubstrate (id: tau-foundation)
        ↓
Deterministic ModelRouter
        ↓
Tau Foundation pipeline
        ↓
Tau AI / TauMail / Tau Developer / ecosystem
```

The model does **not** bypass Constitution, Memory, Tools, or Execution.

---

## Model strategy comparison

| Approach | Difficulty | Compute | Dataset | Cost band (est.) | Time | Ownership/control | Suitability for v0.1 |
|----------|------------|---------|---------|------------------|------|-------------------|----------------------|
| **A. Fine-tune open-weight** | Low–Medium | 1–8 GPUs | 10K–500K examples | $500–$20K | 2–8 weeks | Derivative weights + Tau data; base license applies | **Recommended** |
| **B. Continued pretrain + SFT** | Medium–High | 8–64+ GPUs | 10B–100B+ tokens | $50K–$500K+ | 2–6 months | Stronger differentiation; still derivative | Phase 2 (post-v0.1) |
| **C. Train from scratch** | Very High | 100–1000+ GPUs | Proprietary corpus at scale | $5M–$100M+ | 12–36+ months | Full weight ownership | **Not realistic today** |

**Conclusion:** Approach **A** for v0.1. Approach **B** as v0.2+ if dataset and compute justify. Approach **C** deferred indefinitely.

See: [tf-0-base-model-evaluation.md](./tf-0-base-model-evaluation.md)

---

## Parameter strategy

| Stage | Size | Purpose | Notes |
|-------|------|---------|-------|
| **POC** | 1.5B–3B | Pipeline smoke tests, constitution SFT format validation | Prefer Apache-licensed sizes (e.g. Qwen2.5-1.5B) |
| **Beta (v0.1)** | **7B–8B** | First deployable Tau Foundation Model | Best capability / cost / deployability balance |
| **Future Foundation** | 14B–32B | Higher capability after v0.1 proves pipeline | Requires proportionally more compute |

**Do not target 70B+ for v0.1.** Inference and training costs dominate; Tau’s goal is a **real, reproducible, deployable** model — not benchmark theater.

---

## Tau Constitution in model strategy

Constitution v0.1 (`packages/tau-ai/src/constitution/`) remains the **deterministic governance layer**.

```
Constitution Engine (authoritative)  +  Tau Foundation Model (behavioral prior)
```

Encoding Constitution into the model:

| Layer | Method |
|-------|--------|
| Training data | Tau Constitution exemplars, refusal/correction pairs, privacy/security scenarios |
| SFT | Instruction following aligned to constitutional principles |
| DPO / preference | Prefer constitution-compliant responses |
| Evaluation | `tau-constitution-eval` suite (deterministic + model-judged) |
| Inference | Constitution context fragment injected by Foundation — **not replaced by model** |

The model must **never** override Constitution at runtime.

---

## Tau Dataset (summary)

Four provenance classes:

1. **THIRD-PARTY DATA** — permissively licensed, audited, attributed
2. **TAU-CREATED DATA** — human-authored, highest ownership clarity
3. **TAU-TRANSFORMED DATA** — derived from permitted sources with documented transforms
4. **TAU-SYNTHETIC DATA** — generated via third-party models; **ownership REQUIRES LEGAL REVIEW**

Synthetic data generated by Qwen/GPT/etc. is **not automatically Tau-owned**.

See: [tf-0-dataset-architecture.md](./tf-0-dataset-architecture.md)

---

## Training pipeline (summary)

```
Raw Data → License Audit → Provenance → Cleaning → Dedup → Filter → Format
    → Train/Val/Test Split → Tokenization → Training → Evaluation
    → Safety/Constitution Eval → Checkpoint → Model Card → Registry → Substrate
```

Tooling (evaluate in TF-2; do not add to production yet):

- Hugging Face Transformers + Datasets + Hub
- PyTorch, PEFT/LoRA, TRL (SFT/DPO)
- Axolotl or LLaMA-Factory (orchestration)
- Unsloth (efficient LoRA — optional)
- DeepSpeed / FSDP (multi-GPU)
- vLLM / Ollama (inference validation)

See: [tf-0-training-pipeline.md](./tf-0-training-pipeline.md)

---

## Compute strategy (summary)

| Tier | Use | GPUs | Est. cost band |
|------|-----|------|----------------|
| **T1 — Developer/POC** | LoRA experiments, eval harness | 1× consumer GPU or Mac | $0–$5K (owned) |
| **T2 — v0.1 beta training** | 7B SFT + DPO | 4–8× A100/H100 spot | $2K–$25K (estimate) |
| **T3 — Future scale** | CPT, 14B+, from-scratch research | Multi-node cluster | $100K–$1M+ (estimate) |

Vendor portability required — **no AWS lock-in**. Cloud options: Lambda, RunPod, Vast.ai, CoreWeave, GCP, Azure (evaluate per job).

See: [tf-0-compute-strategy.md](./tf-0-compute-strategy.md)

---

## Evaluation (summary)

Custom **Tau Evaluation Suite** — not public benchmarks alone.

Categories: reasoning, coding, instruction following, tool use, planning, memory/context, truthfulness, uncertainty, privacy, security, provenance, correction, constitutional compliance, ecosystem tasks.

Comparison axes:

- **Baseline** — base model zero-shot
- **Third-party substrate** — routed gateway models
- **Tau Foundation Model** — after SFT/DPO

See: [tf-0-evaluation-framework.md](./tf-0-evaluation-framework.md)

---

## Model identity (substrate representation)

Conceptual substrate metadata for future integration ( **not live** ):

```yaml
id: tau-foundation
modelId: tau-foundation-v0.1
provider: tau
family: TAU_FOUNDATION_MODEL
baseModel: qwen2.5-7b-instruct  # example — confirm at TF-3
license: Apache-2.0-derivative  # REQUIRES LEGAL REVIEW
verificationLevel: NOT_CONFIGURED  # → METADATA_VERIFIED → MODEL_LIVE_VERIFIED after testing
availability: NOT_CONFIGURED
capabilities: UNKNOWN until evaluated
weightsLocation: UNKNOWN
```

Existing stub: `packages/tau-ai/src/models/tau-foundation-substrate.ts` — unchanged in TF-0.

---

## Public release roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **TF-0** | Research + architecture | ✅ COMPLETE |
| **TF-1** | Dataset v0.1 (schema + first corpus) | NOT STARTED |
| **TF-2** | Training pipeline (reproducible) | NOT STARTED |
| **TF-3** | First checkpoint | NOT STARTED |
| **TF-4** | Internal evaluation | NOT STARTED |
| **TF-5** | Tau Foundation Model v0.1 | NOT STARTED |
| **TF-6** | Private beta (Tau ecosystem) | NOT STARTED |
| **TF-7** | Public beta | NOT STARTED |
| **TF-8** | Production routing | NOT STARTED |

Skip none of TF-1 through TF-5. TF-6/7/8 depend on evaluation results.

---

## Blockers

### Legal (REQUIRES LEGAL REVIEW)

- Accurate “Tau-owned” / “Tau Foundation Model” marketing claims for fine-tuned derivatives
- Synthetic data ownership and commercial use of third-party-generated training examples
- Downstream license pass-through if weights are distributed to customers
- Gemma/Llama attribution and naming requirements if those bases are used instead of Qwen

### Technical

- No dataset pipeline or provenance registry implemented
- No training environment or reproducible CI for ML
- No evaluation harness
- `weightsAvailable: false` in model track
- Inference requirements for tau-foundation substrate: UNKNOWN

---

## Exact next milestone

**TF-1 — Tau Dataset v0.1**

Deliverables (upon approval):

1. Dataset schema + provenance registry (code)
2. License audit of first third-party sources
3. Initial Tau-created constitution + ecosystem task examples (target: 5K–20K high-quality pairs)
4. Train/val/test split policy
5. No training until TF-2 pipeline is approved

---

## Related documents

- [tf-0-base-model-evaluation.md](./tf-0-base-model-evaluation.md)
- [tf-0-dataset-architecture.md](./tf-0-dataset-architecture.md)
- [tf-0-training-pipeline.md](./tf-0-training-pipeline.md)
- [tf-0-compute-strategy.md](./tf-0-compute-strategy.md)
- [tf-0-evaluation-framework.md](./tf-0-evaluation-framework.md)
- [tf-0-license-and-provenance.md](./tf-0-license-and-provenance.md)
- [tau-foundation-model-track.md](./tau-foundation-model-track.md)

---

## STOP

TF-0 is complete. No training. No downloads. No AWS. Await explicit approval for TF-1.
