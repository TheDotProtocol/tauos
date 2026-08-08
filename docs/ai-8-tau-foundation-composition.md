# AI-8 — Tau Foundation v0.1 Composition / Shadow Integration

**Milestone:** AI-8 (Tau Foundation v0.1)  
**Status:** Complete  
**Verification:** COMPOSITION + SHADOW VALIDATED

---

## Summary

Composed AI-1 through AI-7 into a single governed **TauFoundationPipeline** and **TauFoundationClient** shadow path. Production `/api/tauai/chat` → `runAiChat()` remains unchanged.

Tau Foundation v0.1 = intelligence architecture + orchestration above interchangeable model substrates — **not** Tau-owned weights.

---

## Complete pipeline

```
USER REQUEST
    ↓
CONTEXT (messages, options)
    ↓
CONSTITUTION (request evaluation)
    ↓
MEMORY (findRelevant / optional write)
    ↓
CAPABILITY DETECTION (deterministic)
    ↓
MODEL ROUTER (DeterministicModelRouter)
    ↓
MODEL SUBSTRATE (selected — shadow/metadata)
    ↓
TOOL GOVERNANCE (when toolRequest present)
    ↓
EXECUTION GOVERNANCE (when executionRequest present)
    ↓
CONSTITUTIONAL RESPONSE CHECK (optional)
    ↓
INTELLIGENCE (optional injected service)
    ↓
TAU RESPONSE + SHADOW LOG
```

---

## Component responsibilities

| Component | Role |
|-----------|------|
| `TauFoundationClient` | Public orchestration boundary (implements `TauAIClient`) |
| `TauFoundationPipeline` | Composes layers via dependency injection |
| `TauMemoryFoundation` | Governed memory read/write |
| `TauConstitutionV01` | Authoritative policy |
| `detectCapability()` | Deterministic capability from request |
| `DeterministicModelRouter` | Substrate selection |
| `GovernedToolExecutor` | Tool lifecycle (AI-6) |
| `GovernedExecutionExecutor` | Execution lifecycle (AI-7) |
| `ShadowPipelineLogEntry` | Metadata-only shadow audit |

---

## Shadow architecture

**Production (unchanged):**
```
POST /api/tauai/chat → runAiChat() → ai-gateway
```

**Foundation (shadow):**
```
TauFoundationClient → TauFoundationPipeline → governed layers
```

**Comparison:**
```
runFoundationShadowComparison() — legacy gateway routing vs foundation pipeline
```

Shadow logs include: requestId, capability, substrateId, privacyMode, constitutionResult, memory/tool/execution decisions, latency, routingAgreement — **never message content**.

---

## Boundaries preserved

| Boundary | Status |
|----------|--------|
| Constitution | Authoritative — not replaced by LLM judge |
| Memory | Subordinate to Constitution; no scope promotion |
| Tools | Model requests ≠ execution authority |
| Execution | Separate from tool authorization |
| tau-foundation substrate | NOT_CONFIGURED — no fake Tau weights |
| Third-party models | Substrates only — not "Tau models" |

---

## Key modules

| Path | Purpose |
|------|---------|
| `packages/tau-ai/src/foundation/pipeline.ts` | Composed pipeline |
| `packages/tau-ai/src/foundation/factory.ts` | Default pipeline factory |
| `packages/tau-ai/src/client/foundation-client.ts` | TauFoundationClient |
| `src/lib/tau-ai/foundation-shadow.ts` | Gateway shadow comparison |

---

## Known limitations

- Shadow path does not replace production API
- Inference optional via injected `IntelligenceService` (mock in tests)
- No automatic model downloads
- No Grayscale/ATHENA/mobile integration
- Capability detection is deterministic heuristic — not ML

---

## Production cutover requirements (future)

1. Explicit approval milestone (AI-8+ production gate)
2. End-to-end validation with live substrates
3. Shadow agreement metrics stable across scenarios
4. Privacy/Constitution audit in production logging
5. Rollback path to `runAiChat()` preserved

---

## Verification

```bash
./scripts/verify-tau-ai-ai8.sh
```

19 foundation scenarios + shadow matrix + full AI-3–AI-7 regression.

---

## AI-9 recommendation

**AI-9 — Tau AI product UI (Figma/spec)** or **production shadow hook** (optional engineering-only hook in gateway that logs shadow metadata without changing responses) — await explicit approval.

---

## Related

- `docs/tau-foundation-v0.1-architecture.md`
- `docs/tau-foundation-model-track.md`
- `docs/ai-7-tau-execution-foundation.md`
