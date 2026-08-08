# AI-3.2 — Deterministic Model Router

**Milestone:** AI-3.2 (Tau Foundation v0.1)  
**Status:** Complete  
**Verification level:** ROUTING VERIFIED

---

## Summary

Implemented the first **deterministic ModelRouter** in `@tau/ai`. The router selects substrates by capability, privacy, availability, and explicit preferences — with stable tie-breaking and explainable decisions.

**Production path unchanged.** Shadow mode logs routing decisions without altering user responses.

---

## Routing pipeline

```
USER REQUEST
     ↓
CAPABILITY
     ↓
SYSTEM POLICY FILTER
     ↓
PRIVACY FILTER (hard constraint)
     ↓
AVAILABILITY FILTER
     ↓
CAPABILITY FILTER (SUPPORTED only — fail closed on UNKNOWN)
     ↓
USER PREFERENCES
     ↓
COST / LATENCY PREFERENCE
     ↓
STABLE PRIORITY + ID TIEBREAK
     ↓
ROUTING DECISION
```

---

## Deterministic priority algorithm

1. Privacy compliance (hard filter — not a score)
2. Capability compatibility (`SUPPORTED` only)
3. Availability (`AVAILABLE`, `LOCAL`, `REMOTE` — not `UNKNOWN`/`NOT_CONFIGURED`)
4. Explicit user preferred substrate
5. Local preference (`PREFER_LOCAL` or `userPreferences.preferLocal`)
6. Cost preference (`FREE` < `LOW` < `MEDIUM` < `HIGH` < `UNKNOWN`)
7. Latency preference (`LOW` < `MEDIUM` < `HIGH` < `UNKNOWN`)
8. Stable substrate priority (lower number wins)
9. Lexicographic substrate ID tie-break

**No randomness. No ML scoring.**

---

## Privacy modes

| Mode | Behaviour |
|------|-----------|
| `LOCAL_ONLY` | Only `privacyClass: LOCAL` substrates. **Fail closed** — never falls back to remote. |
| `PREFER_LOCAL` | Local substrates ranked first; remote allowed if no suitable local match. |
| `REMOTE_ALLOWED` | Local and remote participate in normal ranking. |
| `ANY` | Normal deterministic selection. |

System policy `privacyMode` **overrides** user preference.

---

## Public API

```typescript
import {
  createDeterministicModelRouter,
  shadowRoute,
  TAU_CAPABILITIES,
} from '@tau/ai';

const router = createDeterministicModelRouter();
const result = router.route({
  capability: TAU_CAPABILITIES.CODE,
  privacyMode: 'LOCAL_ONLY',
  substrates: routableSubstrates,
  userPreferences: { preferLocal: true },
  systemPolicy: { privacyMode: 'LOCAL_ONLY' },
});

// Shadow mode (log only)
const shadow = shadowRoute({ ...request });
```

Gateway shadow helper (does not touch production):

```typescript
import { shadowRouteFromGateway } from '@/lib/tau-ai/shadow-routing';

shadowRouteFromGateway({
  capability: TAU_CAPABILITIES.TEXT_REASONING,
  privacyMode: 'REMOTE_ALLOWED',
}, true /* log */);
```

---

## Shadow mode

```
User request
      │
      ├────────→ POST /api/tauai/chat → runAiChat()  (production — unchanged)
      │
      └────────→ shadowRouteFromGateway() → log decision only
```

Shadow log fields: `requestId`, `capability`, `privacyMode`, `eligibleSubstrateIds`, `rejectedSubstrates`, `selectionSummary` / `failureSummary`, `routingPolicyVersion`, `timestamp`. **No message content logged.**

---

## Tau Foundation Model

`tau-foundation` routes through the **same router** as every other substrate — no special-case code. When configured with `SUPPORTED` capabilities and eligible availability, it can be selected deterministically (TEST 13 verified).

---

## Verification levels

| Level | AI-3.2 status |
|-------|---------------|
| METADATA VERIFIED | ✅ (from AI-3.1) |
| ADAPTER VERIFIED | ✅ (from AI-2) |
| **ROUTING VERIFIED** | ✅ (15 deterministic tests) |
| MODEL LIVE VERIFIED | ⏸ Not in scope |
| PRODUCTION READY | ⏸ AI-8 cutover |

---

## What was NOT done

- No production route cutover
- No model downloads or training
- No Grayscale / ATHENA / OpenClaw
- No mobile or AWS changes

---

## Verification

```bash
chmod +x scripts/verify-tau-ai-ai3-2.sh
./scripts/verify-tau-ai-ai3-2.sh
```

---

## AI-3.3 recommendation

Implement **hardware-aware routing hooks** — simple environment abstraction (CPU/GPU/VRAM availability flags) consumed by the router as additional filters. Keep shadow mode until production cutover approval.

---

## Related

- `docs/tau-foundation-v0.1-architecture.md`
- `docs/tau-ai-capability-registry.md`
- `docs/ai-3.1-model-substrate-metadata.md`
