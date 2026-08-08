# Tau Foundation v0.1 — Architecture

**Version:** v0.1  
**Milestone:** AI-3.1  
**Status:** Architecture established — model weights not trained

---

## What is Tau Foundation v0.1?

Tau Foundation v0.1 is **Tau's intelligence foundation** — the persistent architecture that surrounds interchangeable model substrates.

```
                         TAU FOUNDATION v0.1
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
   Constitution               Memory                    Tools
        │                         │                         │
        └─────────────────────────┬─────────────────────────┘
                                  │
                           Tau System Intelligence
                                  │
                             Tau Router (AI-3.2+)
                                  │
                       Capability Registry (AI-3.0)
                                  │
                         Model Substrate Layer (AI-3.1)
                                  │
          ┌──────────────┬──────────────┬──────────────┐
          │              │              │              │
   Open models      API providers    Ollama/vLLM    tau-foundation
   (Qwen, Llama,    (OpenAI,         (local)        (placeholder)
    DeepSeek, …)     Anthropic, …)
                                  │
                         Future Tau Foundation Model Weights
```

**Open models are substrates. They are not the identity of Tau.**

The user experiences **Tau** — not "OpenAI" or "Qwen" — unless they explicitly choose a provider.

---

## Layers

| Layer | Owns | Does NOT own |
|-------|------|--------------|
| **Tau Foundation v0.1** | Constitution, memory, routing, capabilities, orchestration | Model weights |
| **Model substrates** | Inference for declared capabilities | Product UX, executive workflows |
| **Open model substrates** | Third-party weights via Ollama/vLLM/API | Tau identity |
| **Tau Foundation Model** (future) | Tau-derived checkpoint | Training pipeline (separate track) |
| **Grayscale / ATHENA** | Executive OS | Tau AI internals |

---

## Integration boundary

```
GRAYSCALE → ATHENA → TauAIClient → TAU AI → TAU FOUNDATION → Substrates
```

No Grayscale, ATHENA, or OpenClaw code inside `packages/tau-ai/`.

---

## Future Tau Foundation Model track

Training is **not** part of AI-3.1. The future pipeline:

```
OPEN MODEL
      ↓
LICENSE AUDIT
      ↓
BASE MODEL SELECTION
      ↓
TAU DATASET
      ↓
TAU CONSTITUTION / BEHAVIOUR DATA
      ↓
TRAINING / FINE-TUNING
      ↓
TAU-DERIVED CHECKPOINT
      ↓
EVALUATION
      ↓
TAU FOUNDATION MODEL
      ↓
tau-foundation ModelSubstrate
      ↓
Deterministic ModelRouter (AI-3.2)
      ↓
TAU AI
```

**Current state (Tau Foundation v0.1):** Intelligence architecture + open model substrates. Router operates in **shadow mode** — production still uses `runAiChat()`.

When a Tau-derived checkpoint exists, it registers as `tau-foundation` without redesigning:

- CapabilityRegistry
- ModelSubstrate
- **DeterministicModelRouter** (AI-3.2)
- TauAIClient

The router treats `tau-foundation` identically to any other substrate — no special-case routing.

---

## AI-3.1 deliverables in this architecture

- `ModelSubstrate.metadata` — capabilities, privacy, cost, latency, availability, health, provenance
- Provider metadata bridge (`substrate-metadata.ts`)
- `tau-foundation` placeholder substrate
- vLLM metadata-ready stub
- Model catalog (verified information only)

---

## Production path (unchanged)

```
POST /api/tauai/chat → runAiChat() → ai-gateway → provider
```

Router cutover is a later milestone (AI-8).

---

## Related

- `docs/tau-ai-capability-registry.md`
- `docs/ai-3.1-model-substrate-metadata.md`
- `docs/tau-ai-model-catalog.md`
