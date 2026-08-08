# AI-3.4 — Substrate Enrichment + Routing Validation

**Milestone:** AI-3.4 (Tau Foundation v0.1)  
**Status:** Complete  
**Verification:** METADATA + ROUTING VALIDATED

---

## Summary

Enriched substrate metadata with verified inference requirements, expanded the open model catalog (family ≠ runtime ≠ substrate), added truthful macOS hardware detection, and validated routing across an expanded scenario matrix — all in shadow mode.

No model downloads. No training. No benchmarking.

---

## Metadata enrichment

| Substrate type | Inference requirements |
|----------------|------------------------|
| Remote API providers | `gpuRequired: false` (client-side — inference remote) |
| Ollama runtime | OS/arch support verified; per-model RAM/VRAM UNKNOWN |
| Fallback | `gpuRequired: false`, `minimumCpuCores: 1` |
| vLLM stub | All UNKNOWN |
| Tau Foundation placeholder | All UNKNOWN |

---

## Catalog distinctions

```
MODEL FAMILY (Qwen, Llama, …)
        ↓ served via
INFERENCE RUNTIME (Ollama, vLLM, API)
        ↓ configured as
CONCRETE SUBSTRATE (gateway:ollama, gateway:deepseek, …)
```

See `packages/tau-ai/src/catalog/open-models.ts` and updated `docs/tau-ai-model-catalog.md`.

---

## macOS hardware detection

`MacOSHardwareDetector` uses Node.js `os` module when `process.platform === 'darwin'`:

- CPU architecture (ARM64 / X86_64)
- Logical core count
- Total / available memory
- GPU: **UNKNOWN** (not fabricated)

Other platforms use `UnknownHardwareDetector`.

---

## Verification levels

| Level | AI-3.4 |
|-------|--------|
| METADATA VERIFIED | ✅ Catalog + inference requirements |
| ROUTING VERIFIED | ✅ Expanded matrix + regressions |
| PERFORMANCE VERIFIED | ⏸ Not in scope |
| MODEL LIVE VERIFIED | ⏸ Not in scope |

---

## Production

Unchanged: `POST /api/tauai/chat` → `runAiChat()` → existing gateway.

---

## Verification

```bash
./scripts/verify-tau-ai-ai3-4.sh
```

---

## AI-3.5 recommendation

Begin **AI-4 Constitution** hooks or multimodal adapter stubs (speech/vision) per master plan — still no production cutover.

---

## Related

- `docs/tau-foundation-model-track.md`
- `docs/tau-dataset-provenance-principle.md`
- `docs/tau-ai-model-catalog.md`
