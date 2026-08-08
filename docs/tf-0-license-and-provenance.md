# TF-0 — License and Provenance

**Status:** Research audit (TF-0)  
**Disclaimer:** This document is **informational engineering research, not legal advice**. All license summaries must be verified against authoritative LICENSE files before TF-1. Items marked **REQUIRES LEGAL REVIEW** need qualified counsel before commercial release.

Legend:

- **VERIFIED** — Confirmed from official license text (TF-0 research date: 2026-08-08)
- **UNKNOWN** — Not confirmed; verify at use time
- **REQUIRES LEGAL REVIEW** — Counsel required before reliance

---

## Tau branding rule

| Statement | Allowed? |
|-----------|----------|
| "Qwen is Qwen" | Yes — always |
| "Tau Foundation Model v0.1 is a fine-tuned derivative of Qwen2.5-7B" | Yes — if accurate |
| "Tau Foundation Model v0.1 is wholly Tau-owned IP with no third-party base" | **No** — false for fine-tune path |
| "Tau owns the training pipeline, dataset curation, and derivative weights" | Yes — subject to base license |
| Mark third-party substrates as Tau-owned | **Never** |

---

## Candidate base models — license matrix

### Qwen2.5-7B-Instruct (primary candidate)

| Field | Status |
|-------|--------|
| **License** | Apache License 2.0 — **VERIFIED** (Qwen2.5 README: 7B is Apache 2.0) |
| **Commercial use** | Permitted — **VERIFIED** |
| **Modification / fine-tune** | Permitted — **VERIFIED** |
| **Redistribution of derivatives** | Permitted with license notice — **VERIFIED** |
| **Derivative requirements** | Preserve copyright, license, NOTICE; patent grant — **VERIFIED** |
| **Attribution** | Standard Apache notices in distributions — **VERIFIED** |
| **Model card obligations** | Document base model + Apache 2.0 inheritance — engineering policy |
| **Training data restrictions** | UNKNOWN for base pretraining corpus — not Tau's concern for fine-tune |
| **MAU threshold** | None for 7B — **VERIFIED** (72B has 100M MAU — not applicable) |
| **Trademark** | Cannot imply Alibaba endorsement — **VERIFIED** |
| **Tau "owned" claim** | **REQUIRES LEGAL REVIEW** — derivative, not clean-slate |

**Source:** https://github.com/QwenLM/Qwen2.5 , Hugging Face LICENSE files

---

### Qwen2.5-72B / Qwen2.5-3B (Qwen License)

| Field | Status |
|-------|--------|
| **License** | Qwen License Agreement — **VERIFIED** |
| **Commercial use** | Permitted below 100M MAU — **VERIFIED** |
| **Modification** | Permitted — **VERIFIED** |
| **Redistribution** | Permitted with license — **VERIFIED** |
| **Derivative model training use** | Must display "Built with Qwen" or "Improved using Qwen" — **VERIFIED** |
| **Ownership of derivatives** | Licensee owns modifications they create — **VERIFIED**; base IP retained by Alibaba — **VERIFIED** |
| **Recommendation** | Avoid for v0.1; prefer Apache 2.0 sizes |

**Source:** https://huggingface.co/Qwen/Qwen2.5-72B-Instruct/blob/main/LICENSE

---

### Meta Llama 3.1 8B Instruct

| Field | Status |
|-------|--------|
| **License** | Llama 3.1 Community License — **VERIFIED** |
| **Commercial use** | Permitted — **VERIFIED** |
| **Modification / fine-tune** | Permitted — **VERIFIED** |
| **Redistribution** | Permitted with license copy — **VERIFIED** |
| **Derivative AI model naming** | Must include **"Llama" at beginning of model name** — **VERIFIED** |
| **Attribution** | Display **"Built with Llama"** — **VERIFIED** |
| **MAU threshold** | 700M MAU requires Meta license — **VERIFIED** |
| **Acceptable Use Policy** | Incorporated by reference — **VERIFIED** |
| **Tau branding** | **REQUIRES LEGAL REVIEW** — "Tau Foundation Model" public name may conflict |

**Source:** https://llama.meta.com/llama-downloads , Hugging Face LICENSE.txt

---

### Meta Llama 3.2 (text / multimodal variants)

| Field | Status |
|-------|--------|
| **License** | Llama 3.2 Community License — **VERIFIED** |
| **Obligations** | Same pattern as 3.1 — **VERIFIED** |
| **EU restrictions** | Multimodal variants: usage restrictions for EU — **REQUIRES LEGAL REVIEW** |
| **Recommendation** | Llama 3.1 8B preferred over 3.2 for clarity unless capability requires 3.2 |

---

### Mistral 7B v0.3 / Mixtral 8x7B

| Field | Status |
|-------|--------|
| **License** | Apache 2.0 — **VERIFIED** (Mixtral README, Mistral Help Center) |
| **Commercial use** | Unrestricted — **VERIFIED** |
| **Modification / redistribution** | Permitted — **VERIFIED** |
| **Revenue threshold** | None for Apache 2.0 open releases — **VERIFIED** |
| **Note** | Some newer Mistral open models: modified MIT with $20M/month revenue threshold — verify per model card |

**Source:** https://help.mistral.ai/en/articles/347393 , Hugging Face model cards

---

### Google Gemma 2

| Field | Status |
|-------|--------|
| **License** | Gemma Terms of Use — **VERIFIED** (not OSI-approved) |
| **Commercial use** | Permitted with conditions — **VERIFIED** |
| **Model Derivatives** | Remain subject to Gemma Terms — **VERIFIED** |
| **Flow-down** | Downstream users must accept use restrictions — **VERIFIED** |
| **Remote restriction** | Google may restrict usage — **VERIFIED** |
| **Training competing models** | Restrictions on use of outputs — **REQUIRES LEGAL REVIEW** |
| **Recommendation** | Do not select without counsel |

**Source:** https://ai.google.dev/gemma/terms

---

### DeepSeek-R1

| Field | Status |
|-------|--------|
| **License** | MIT License (weights) — **VERIFIED** |
| **Commercial use** | Permitted including distillation — **VERIFIED** |
| **Distill variants** | Qwen/Llama bases inherit their licenses — **VERIFIED** |

**Source:** https://github.com/deepseek-ai/DeepSeek-R1

---

### DeepSeek-V3

| Field | Status |
|-------|--------|
| **License** | Custom Model License (OpenRAIL-inspired) — **VERIFIED** |
| **Commercial use** | Permitted for lawful purposes — **VERIFIED** |
| **Use-based restrictions** | Attachment A restrictions apply — **VERIFIED** |
| **Derivative training** | **REQUIRES LEGAL REVIEW** for competing model clauses |
| **Compute** | 671B — impractical for Tau self-host v0.1 |

**Source:** https://github.com/deepseek-ai/DeepSeek-V3/blob/main/LICENSE-MODEL

---

## Third-party API substrates (not training bases)

| Provider | Relationship | Training use of outputs |
|----------|--------------|-------------------------|
| OpenAI | API Terms of Service | **REQUIRES LEGAL REVIEW** — typically restricted for model training |
| Anthropic | API Terms of Service | **REQUIRES LEGAL REVIEW** |
| DeepSeek API | Commercial API terms | **REQUIRES LEGAL REVIEW** for output use in training |
| OpenRouter | Aggregator terms | Per-upstream model |

**Policy:** Do not use API outputs for Tau Dataset without explicit terms review.

---

## Synthetic data ownership

| Data type | Ownership status |
|-----------|------------------|
| Human-authored Tau prompts/responses | TAU-CREATED — clearest ownership |
| Human-edited synthetic drafts | TAU-TRANSFORMED — **REQUIRES LEGAL REVIEW** |
| Raw LLM output used without review | Not approved for training |
| LLM output under paid API terms | **REQUIRES LEGAL REVIEW** |

**Do not assume** synthetic data automatically becomes Tau-owned.

---

## Dataset provenance requirements (TF-1 gate)

Before any record enters training:

1. `source.license` verified against original LICENSE file
2. `permitted_use` includes `train` and `commercial` (if commercial deployment intended)
3. `provenance_class` assigned
4. `ownership_status` not `REQUIRES_LEGAL_REVIEW` unless approved
5. Attribution requirements documented in model card

---

## Model card obligations (TF-5)

Must include:

- Base model name, version, license
- Tau Dataset version + provenance summary
- Training method (LoRA SFT, DPO, etc.)
- Known limitations
- Constitution governance note (runtime engine active)
- Evaluation summary (tau-eval-v0.1)
- Inherited license files
- **Honest statement:** derivative of [base], not from-scratch Tau pretrain

---

## Unresolved legal questions (REQUIRES LEGAL REVIEW)

1. Maximum "Tau-owned" marketing claim for Apache 2.0 fine-tune
2. Whether to publicly release weights vs API-only deployment
3. Synthetic data copyright and commercial use across generators
4. Customer pass-through if Tau Foundation Model powers B2B products
5. GDPR/privacy implications if any user data ever enters training (policy: **prohibit** for v0.1)
6. Gemma/Llama naming if those bases used instead of Qwen
7. Export control / trade compliance for weight distribution — **UNKNOWN**

---

## Provenance registry (planned TF-1)

```
registry/
  sources.yaml      # third-party dataset licenses
  models.yaml       # base model license snapshots
  runs.yaml         # training run → dataset + base linkage
  audits/           # dated license verification records
```

---

## STOP

No legal conclusions. Counsel review required before TF-5 public release. Await TF-1 approval.
