# TF-0 — Base Model Evaluation

**Status:** Research complete (TF-0)  
**Not implemented:** No weights downloaded, no benchmarks run on Tau infrastructure

All license summaries are **informational, not legal advice**. Verify against authoritative LICENSE files before TF-1.

Legend: **VERIFIED** = sourced from official license text · **UNKNOWN** = not confirmed · **REQUIRES LEGAL REVIEW** = counsel needed

---

## Evaluation criteria

| Criterion | Weight for Tau v0.1 |
|-----------|---------------------|
| License clarity (commercial, derivative, redistribution) | Critical |
| Modification / fine-tuning rights | Critical |
| Attribution / naming burden | High |
| Parameter efficiency (7B–8B sweet spot) | High |
| Coding + reasoning + tool use | High |
| Context length | Medium |
| Fine-tuning ecosystem maturity | High |
| Inference efficiency (quantization) | High |
| Multilingual | Medium |
| Long-term strategic fit | Medium |

---

## Candidate summary matrix

| Model | Params (evaluated) | License | Commercial | Fine-tune | Redistribute derivative | Attribution burden | TF-0 recommendation |
|-------|-------------------|---------|------------|-----------|-------------------------|-------------------|---------------------|
| **Qwen2.5-7B-Instruct** | 7B | Apache 2.0 | VERIFIED yes | VERIFIED yes | VERIFIED yes | Low (preserve notices) | **Primary candidate** |
| **Qwen2.5-14B/32B-Instruct** | 14B–32B | Apache 2.0 | VERIFIED yes | VERIFIED yes | VERIFIED yes | Low | Future Foundation tier |
| **Qwen2.5-72B** | 72B | Qwen License | Yes (<100M MAU) | Yes | Yes with conditions | Medium (“Built with Qwen” for model-training use) | Defer — license + compute |
| **Qwen2.5-3B** | 3B | Qwen License | Yes (<100M MAU) | Yes | Yes with conditions | Medium | Avoid for v0.1 — use 7B Apache |
| **Llama 3.1 8B Instruct** | 8B | Llama 3.1 Community | VERIFIED yes | VERIFIED yes | Yes with conditions | **High** (“Built with Llama”, “Llama” name prefix) | Strong alternate |
| **Llama 3.2 1B/3B** | 1–3B | Llama 3.2 Community | VERIFIED yes | VERIFIED yes | Yes with conditions | High | POC only; EU multimodal restrictions on some variants |
| **Mistral 7B v0.3** | 7.3B | Apache 2.0 | VERIFIED yes | VERIFIED yes | VERIFIED yes | Low | Viable; older architecture |
| **Mixtral 8x7B** | 47B total / ~13B active | Apache 2.0 | VERIFIED yes | VERIFIED yes | VERIFIED yes | Low | MoE — higher ops complexity |
| **Gemma 2 9B IT** | 9B | Gemma Terms of Use | Permitted with conditions | Yes | Yes with flow-down | **High** (PUP pass-through, remote restriction clause) | REQUIRES LEGAL REVIEW |
| **DeepSeek-R1** | 671B MoE | MIT (R1 weights) | VERIFIED yes | Yes | Yes | Low | Impractical for self-host v0.1 |
| **DeepSeek-R1-Distill-Qwen-7B** | 7B | Apache 2.0 (Qwen base) | VERIFIED yes | Yes | Yes | Low + DeepSeek notice | Interesting reasoning prior; still Qwen derivative |
| **DeepSeek-V3** | 671B | Custom Model License | Yes with use restrictions | Yes | Yes with restrictions | Medium | REQUIRES LEGAL REVIEW; compute prohibitive |

---

## Detailed candidate notes

### Qwen2.5 (recommended primary)

**Source:** Alibaba Cloud / Qwen team — Hugging Face `Qwen/Qwen2.5-*`  
**License (7B):** Apache 2.0 — VERIFIED per Qwen2.5 README and Hugging Face LICENSE files  
**License exceptions:** 3B and 72B use Qwen License (100M MAU threshold, attribution for model-training derivatives)

**Strengths:**

- Strong coding (Qwen2.5-Coder family), reasoning, multilingual, tool-use training
- 128K context on many variants (YaRN)
- Mature fine-tuning tooling (Axolotl, LLaMA-Factory, Unsloth, MS-Swift)
- Apache 2.0 on 7B simplifies commercial derivative distribution

**Weaknesses:**

- “Tau-owned” claim must acknowledge Qwen base — not a clean-slate IP story
- Larger Qwen3 variants — license per checkpoint REQUIRES VERIFICATION at TF-1 time

**Ownership honesty:** Tau owns **fine-tuned delta + Tau Dataset contributions**; base architecture and pretraining remain Alibaba/Qwen.

---

### Meta Llama 3.1 / 3.2 (strong alternate)

**License:** Llama Community License — VERIFIED from Meta developer site and Hugging Face LICENSE.txt

**Key obligations (VERIFIED):**

- Display **“Built with Llama”** on product documentation
- If distributing derivative AI model: name must **begin with “Llama”**
- 700M MAU threshold for separate Meta license (not binding for Tau today)

**Strengths:**

- Excellent community, Ollama/vLLM support, strong general instruction following
- Llama 3.1 8B well-proven for fine-tuning

**Weaknesses:**

- **Branding conflict:** “Tau Foundation Model” cannot be marketed without “Llama” prefix if distributing weights — complicates “Tau-owned” narrative
- Llama 3.2 multimodal: EU usage restrictions on some variants — REQUIRES LEGAL REVIEW if applicable

---

### Mistral 7B / Mixtral (Apache path)

**License:** Apache 2.0 for Mistral 7B and Mixtral 8x7B — VERIFIED

**Note:** Mistral Help Center states some newer open models use modified MIT with **$20M/month revenue** threshold — always verify per model card.

**Strengths:** Maximum license simplicity, no naming prefix  
**Weaknesses:** Mistral 7B is legacy (API deprecated 2025-03-30); lower capability vs Qwen2.5-7B on coding/reasoning benchmarks (public benchmarks — not Tau-verified)

---

### Google Gemma 2 (caution)

**License:** Gemma Terms of Use — custom, not OSI-approved — VERIFIED from ai.google.dev/gemma/terms

**Key risks:**

- Model Derivatives remain bound by Gemma Terms
- **Flow-down:** downstream users must accept Prohibited Use Policy
- **Remote restriction:** Google may restrict usage — business continuity risk
- Training-data restrictions for competing models — REQUIRES LEGAL REVIEW

**Recommendation:** Do not select as primary base for v0.1 without counsel.

---

### DeepSeek (substrate today, base model caution)

**DeepSeek-R1:** MIT License — VERIFIED (GitHub LICENSE)  
**DeepSeek-V3:** Custom Model License — use-based restrictions in Attachment A — VERIFIED (LICENSE-MODEL)

**Distill models:** Inherit Qwen or Llama base licenses — VERIFIED in DeepSeek-R1 README

**Recommendation:**

- Use DeepSeek as **third-party substrate** (current gateway) — unchanged
- Do **not** use 671B V3/R1 as v0.1 training base — compute impractical
- R1-Distill-Qwen-7B viable as **starting checkpoint** (reasoning-heavy) but still Qwen derivative

---

## Training approach fit

| Base | LoRA SFT | Full SFT | DPO | CPT | From-scratch pretrain |
|------|----------|----------|-----|-----|----------------------|
| Qwen2.5-7B | Excellent | Good | Good | Possible (TF-2+) | N/A |
| Llama 3.1 8B | Excellent | Good | Good | Possible | N/A |
| Mistral 7B | Excellent | Good | Good | Possible | N/A |
| Any 70B+ | QLoRA only | Expensive | Expensive | Very expensive | Not realistic |

---

## TF-0 recommendation

### Primary: **Qwen2.5-7B-Instruct** (Apache 2.0)

**Rationale:** Best balance of capability, fine-tuning ecosystem, license clarity, and deployability at 7B.

### POC alternate: **Qwen2.5-1.5B-Instruct** (Apache 2.0)

Fast iteration on dataset format and constitution encoding.

### Fallback if legal/branding prefers Meta ecosystem: **Llama 3.1 8B Instruct**

Accept “Llama-Tau Foundation Model v0.1” naming or internal-only deployment without public weight release.

### Do not select for v0.1 without review: Gemma 2, DeepSeek-V3 base, Qwen 72B

---

## Verification status

| Claim | Level |
|-------|-------|
| License text reviewed from official sources | METADATA_VERIFIED |
| Tau training run on candidate base | NOT STARTED |
| Tau benchmark comparison | NOT STARTED |
| Live substrate integration | NOT STARTED |

---

## Sources (verify before TF-1)

- Qwen2.5 README / Hugging Face LICENSE files
- Meta Llama 3.1/3.2 Community License (llama.com, Hugging Face)
- Mistral Help Center + model cards
- Google Gemma Terms of Use (ai.google.dev)
- DeepSeek-V3 LICENSE-MODEL, DeepSeek-R1 LICENSE (GitHub)

**REQUIRES LEGAL REVIEW** before public “Tau-owned model” release.
