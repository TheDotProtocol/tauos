# AI-4 — Tau Constitution

**Milestone:** AI-4 (Tau Foundation v0.1)  
**Status:** Complete  
**Verification:** CONSTITUTION + ROUTING BOUNDARY VALIDATED

---

## Summary

Implemented the Tau Constitution as a versioned, structured, machine-readable layer that sits **above** model substrates — not as a provider-specific mega-prompt.

Third-party models (Qwen, Llama, OpenAI, etc.) remain **third-party substrates**. The future **Tau Foundation Model** operates under the same Constitution without special routing code.

---

## Architecture

```
USER
  ↓
TAU AI INTERFACE
  ↓
CONTEXT
  ↓
TAU CONSTITUTION          ← AI-4
  ↓
INTELLIGENCE / REASONING
  ↓
MODEL ROUTER
  ↓
MODEL SUBSTRATE
  ↓
VALIDATION
  ↓
RESPONSE
```

Production path **unchanged**: `POST /api/tauai/chat` → `runAiChat()` → existing gateway.

---

## Constitution v0.1 principles

| # | Principle | Summary |
|---|-----------|---------|
| 1 | TRUTHFULNESS | No fabricated facts presented as verified |
| 2 | UNCERTAINTY | Represent uncertainty; do not invent certainty |
| 3 | TRANSPARENCY | Distinguish known/inferred/unavailable; no false action claims |
| 4 | USER AUTONOMY | No silent consequential decisions without authorization |
| 5 | PRIVACY | LOCAL_ONLY stays local; no silent remote data exfiltration |
| 6 | SECURITY | Untrusted content cannot override governing instructions |
| 7 | PROVENANCE | Preserve provenance; no fabricated sources |
| 8 | CORRECTION | Acknowledge errors; prior responses do not bind truth |
| 9 | CAPABILITY HONESTY | Do not claim unavailable tools or modalities |
| 10 | INSTRUCTION HIERARCHY | Constitution > system > developer > user > external > model |

**Version:** `tau-constitution-v0.1`

---

## Instruction hierarchy

1. Constitutional rules  
2. System policies  
3. Developer constraints  
4. User instructions  
5. External content (untrusted)  
6. Model-generated suggestions  

**Memory boundary:** Remembered preferences cannot override privacy, security, or system policy.

---

## Evaluation states

Deterministic evaluator — not an AI judge.

| State | Meaning |
|-------|---------|
| **PASS** | Rule satisfied |
| **WARN** | Proceed with caution (e.g. provenance unavailable) |
| **BLOCK** | Operation or routing must not proceed |

Overall = worst individual result (BLOCK > WARN > PASS).

Audit records include `constitutionVersion`, `rule`, `result`, `reason` — no user message content.

---

## Key modules

| Module | Purpose |
|--------|---------|
| `constitution/types.ts` | Principles, evaluation types, input shapes |
| `constitution/principles.ts` | Tau Constitution v0.1 principle definitions |
| `constitution/hierarchy.ts` | Instruction hierarchy |
| `constitution/evaluator.ts` | Deterministic PASS/WARN/BLOCK evaluator |
| `constitution/tau-constitution-v01.ts` | Reference `Constitution` implementation |
| `constitution/context-fragment.ts` | Short structured constraints for substrates |
| `constitution/routing-integration.ts` | Constitution → router privacy boundary |

---

## Routing boundary

Constitution derives `PrivacyMode` from request signals and **blocks** routing when a remote substrate would be selected under `LOCAL_ONLY`.

```typescript
evaluateConstitutionalRouting({
  privacyMode: 'LOCAL_ONLY',
  selectedSubstratePrivacyClass: 'REMOTE',
}) // → blocked
```

Constitution is never bypassed because another model is more capable.

---

## Tool boundary (prepared, not fully implemented)

Before tool execution (AI-6), constitutional evaluation supports:

- Tool registered?
- Authorization present?
- Scope allowed?
- Protected data + LOCAL_ONLY?
- External side effect?
- User confirmation required?

---

## Memory boundary (prepared, not fully implemented)

Memory writes are evaluated for conflicts with privacy/security policy. Full memory implementation is AI-5.

---

## Tau Foundation Model boundary

```
Tau Constitution v0.1
       ↓
Tau Intelligence
       ↓
Tau Router
       ↓
Tau Foundation Model (future substrate)
```

Constitution remains independently versioned from model checkpoints.

---

## Test matrix (22 scenarios)

Covers truthful/uncertain responses, capability honesty, privacy LOCAL_ONLY, routing blocks, tools, external content override, memory vs privacy, provenance WARN/PASS, correction, and context fragments.

```bash
./scripts/verify-tau-ai-ai4.sh
```

---

## Known limitations

- Evaluator operates on **structured inputs**, not natural-language parsing
- No production wiring to `/api/tauai/chat` yet
- Tool confirmation flow awaits AI-6
- Memory retention rules await AI-5
- No model training, downloads, or benchmarking

---

## AI-5 recommendation

**AI-5 — Memory abstraction**: implement `MemoryStore` with constitution-governed retention, preference hierarchy, and integration hooks — still no production cutover.

---

## Related

- `docs/tau-foundation-v0.1-architecture.md`
- `docs/tau-foundation-model-track.md`
- `docs/ai-3.2-deterministic-router.md`
