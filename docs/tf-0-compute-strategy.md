# TF-0 — Compute Strategy

**Status:** Planning estimates (TF-0)  
**Not implemented:** No GPUs provisioned, no cloud accounts created

**All costs are estimates — REQUIRES VERIFICATION** at time of procurement. Prices change by region, spot availability, and date.

---

## Design principles

1. **Vendor portability** — no AWS lock-in; use portable containers + S3-compatible storage
2. **Start small** — POC before multi-GPU spend
3. **Spot/preemptible** for training; on-demand for debugging
4. **Local-first dev** — Mac/single GPU for pipeline validation
5. **Truth over specs** — mark inference/training times as estimates until measured

---

## Tier 1 — Developer / POC

**Purpose:** Dataset validation, 1-step training smoke tests, LoRA experiments on small base, eval harness development

| Resource | Specification |
|----------|---------------|
| **Option A — Mac** | Apple Silicon M2/M3/M4, 16–64 GB unified memory |
| **Option B — Workstation** | 1× RTX 4090 (24 GB) or RTX 5090 (32 GB) |
| **CPU** | 8+ cores |
| **RAM** | 32–64 GB |
| **Storage** | 1–2 TB NVMe (models ~15 GB per 7B checkpoint + datasets) |
| **Network** | Standard broadband |

**Training characteristics (estimates — REQUIRES VERIFICATION):**

| Task | 1.5B QLoRA | 7B QLoRA |
|------|------------|----------|
| 10K examples, 1 epoch | 1–4 hours | 4–12 hours |
| Hardware | Mac M3 36GB or 4090 | 4090 / M4 Max 64GB |

**Cost band:** $0 marginal (owned hardware) or **$0.50–$2/hr** cloud single GPU spot

**Limitations:** Slow for full 7B DPO; insufficient for full-weight SFT or CPT

---

## Tier 2 — Tau Foundation Model v0.1 beta training

**Purpose:** 7B LoRA/QLoRA SFT + DPO on full Tau Dataset v0.1, hyperparameter search, checkpoint promotion

| Resource | Specification |
|----------|---------------|
| **GPUs** | 4–8× A100 80GB **or** 4–8× H100 80GB |
| **Alternative** | 8× A6000 48GB (tighter memory) |
| **CPU** | 64+ cores |
| **RAM** | 256–512 GB |
| **Storage** | 2–5 TB NVMe + object storage for checkpoints |
| **Network** | 10–25 Gbps inter-node (if multi-node) |

**Training characteristics (estimates — REQUIRES VERIFICATION):**

| Task | 8× A100 80GB |
|------|--------------|
| 7B QLoRA SFT, 50K examples, 2 epochs | 4–12 hours |
| 7B DPO, 2K pairs | 2–6 hours |
| Full 7B SFT (16-bit, no LoRA) | 24–72 hours |
| Hyperparameter sweep (5 runs) | 1–3 days |

**Cost band (spot/preemptible — estimates):**

| Provider type | $/hr (8× A100) | 3-day project est. |
|---------------|----------------|-------------------|
| Spot cloud | $8–$20/hr | **$600–$1,500** |
| On-demand cloud | $20–$40/hr | **$1,500–$3,000** |
| Dedicated server rental | Varies | **$2,000–$8,000/month** |

**Recommended approach:** Spot instances with checkpoint resume; budget **$2K–$15K** total for v0.1 training cycle including failed runs — REQUIRES VERIFICATION.

---

## Tier 3 — Future large-scale training

**Purpose:** Continued pretraining, 14B–32B models, from-scratch research (future)

| Resource | Specification |
|----------|---------------|
| **GPUs** | 32–256× H100 80GB (or equivalent) |
| **Topology** | InfiniBand multi-node |
| **Storage** | 50–500 TB parallel filesystem + object store |
| **Duration** | Weeks to months |

**Cost band (estimates — REQUIRES VERIFICATION):**

| Workload | Estimate |
|----------|----------|
| 14B CPT (100B tokens) | $50K–$200K |
| 32B SFT full | $20K–$100K |
| 7B from-scratch pretrain | **Not recommended** — $1M+ |

**Conclusion:** Tier 3 is **post-v0.1** and requires funding decision separate from TF-0.

---

## Platform comparison

| Platform | Portability | Spot | Notes |
|----------|-------------|------|-------|
| **Local Mac** | High | N/A | MLX for inference; training limited |
| **Single GPU workstation** | High | N/A | Best POC ROI if purchased |
| **Lambda Labs** | Medium | Limited | Simple GPU cloud |
| **RunPod / Vast.ai** | Medium | Good | Low cost; variable reliability |
| **CoreWeave** | Medium | Yes | Strong for multi-GPU |
| **GCP / Azure** | Medium | Yes | Enterprise procurement |
| **AWS** | Medium | Yes | **Evaluate but do not lock in** |
| **Dedicated (Hetzner, etc.)** | High | N/A | Long-running inference |

**Recommendation:** Develop in **Tier 1 local**, train v0.1 on **spot cloud (vendor TBD at TF-2)** with containerized pipeline portable across providers.

---

## Inference deployment (post-training)

| Deployment | Hardware | Use case |
|------------|----------|----------|
| **Ollama local** | Mac / 4090 | Developer, private beta |
| **vLLM single GPU** | A100/H100 | Internal API |
| **vLLM multi-GPU** | 2× GPU for 14B+ | Future |
| **Quantized GGUF** | CPU / edge | Optional export |

**7B Q4 inference:** ~5–8 GB VRAM — feasible on single consumer GPU.

Inference cost for production routing: **REQUIRES VERIFICATION** against Tau traffic projections.

---

## Storage architecture

```
checkpoints/     # versioned, encrypted
datasets/        # immutable raw + processed
manifests/       # training run metadata
eval-results/    # JSON reports
model-cards/     # markdown + metadata
```

Use **S3-compatible** API (R2, MinIO, GCS, any vendor) — not AWS-specific services.

---

## Training from scratch — compute reality check

| Model size | From-scratch pretrain estimate | Realistic for Tau today? |
|------------|-------------------------------|--------------------------|
| 1B | $50K–$200K | Marginal — still poor ROI vs fine-tune |
| 7B | $500K–$5M | **No** |
| 70B | $10M–$100M+ | **No** |

**TF-0 conclusion:** From-scratch is **not realistic**. Fine-tune path only for v0.1.

---

## TF-2 compute deliverables

1. Provider comparison matrix (updated pricing)
2. Container image for training (CUDA + pinned deps)
3. Spot interruption + checkpoint resume tested
4. Cost tracking per run
5. Inference deployment recipe for promoted checkpoint

---

## STOP

No infrastructure provisioned. Await TF-2 approval.
