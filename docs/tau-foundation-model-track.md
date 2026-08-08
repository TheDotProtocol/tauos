# Tau Foundation Model Track

**Status:** TF-2 complete · **STOP** (await approval for TF-3)  
**Not implemented:** No training, no dataset collection, no weights

---

## Relationship to Tau Foundation v0.1

| Track | Scope |
|-------|-------|
| **Tau Foundation v0.1** (AI-8–AI-11) | Intelligence architecture + third-party substrates |
| **Tau Foundation Model Track** (TF-0+) | Tau-trained/derived model weights |

Third-party models (Qwen, DeepSeek, Llama, etc.) are **not** Tau Foundation Models.

---

## Tau Foundation Model Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **TF-0** | Model research, licensing, dataset & training plan | ✅ COMPLETE |
| **TF-1** | Dataset v0.1 (schema + gold seed + validation) | ✅ COMPLETE |
| **TF-2** | Reproducible training pipeline | ✅ COMPLETE |
| **TF-3** | First checkpoint | NOT STARTED |
| **TF-4** | Internal evaluation (tau-eval-v0.1) | NOT STARTED |
| **TF-5** | Tau Foundation Model v0.1 | NOT STARTED |
| **TF-6** | Private beta (Tau ecosystem) | NOT STARTED |
| **TF-7** | Public beta | NOT STARTED |
| **TF-8** | Production substrate integration | NOT STARTED |

**TF-0 recommendation:** Qwen2.5-7B-Instruct (Apache 2.0) + LoRA SFT/DPO + Tau Dataset v0.1

See: [tf-0-tau-foundation-model-strategy.md](./tf-0-tau-foundation-model-strategy.md)

---

## TF-0 deliverables

- [tf-0-tau-foundation-model-strategy.md](./tf-0-tau-foundation-model-strategy.md)
- [tf-0-base-model-evaluation.md](./tf-0-base-model-evaluation.md)
- [tf-0-dataset-architecture.md](./tf-0-dataset-architecture.md)
- [tf-0-training-pipeline.md](./tf-0-training-pipeline.md)
- [tf-0-compute-strategy.md](./tf-0-compute-strategy.md)
- [tf-0-evaluation-framework.md](./tf-0-evaluation-framework.md)
- [tf-0-license-and-provenance.md](./tf-0-license-and-provenance.md)

---

## Integration boundary (unchanged)

```
Tau Foundation Model (future weights)
        ↓
tau-foundation ModelSubstrate
        ↓
Capability metadata + inference requirements
        ↓
Deterministic ModelRouter
        ↓
Tau Foundation pipeline
        ↓
Tau ecosystem products
```

Constitution engine remains authoritative at inference time.

Existing stub: `packages/tau-ai/src/models/tau-foundation-substrate.ts`  
Planning interfaces: `packages/tau-ai/src/model-track/types.ts`

---

## Related

- `docs/tau-foundation-v0.1-architecture.md` (if present)
- `docs/ai-11-tau-ecosystem-integration.md`
- `docs/ai-8-tau-foundation-composition.md`

---

## STOP

Do not proceed to TF-1 without explicit approval.
