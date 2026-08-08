# AI-7 — Tau Execution Abstraction Foundation

**Milestone:** AI-7 (Tau Foundation v0.1)  
**Status:** Complete  
**Verification:** EXECUTION GOVERNANCE VALIDATED

---

## Summary

Implemented the governed execution layer beneath tools — adapter registry, deterministic execution policy, constitution integration, confirmation gates, and safe test adapters. Tool authorization does **not** automatically grant side-effect execution authority.

No production wiring. No real external mutations. No Grayscale/ATHENA.

---

## Architecture

```
Tool Request
 ↓
Tool Governance (AI-6)
 ↓
Execution Policy (AI-7)
 ↓
ExecutionAdapterRegistry
 ↓
ExecutionAdapter
 ↓
Side Effect (simulated in tests)
 ↓
Validation + Audit
```

**AI-6** = whether a tool request is permitted  
**AI-7** = whether and how execution may occur in an authorized environment

---

## Execution classes (separate from tool risk)

| Class | Confirmation |
|-------|----------------|
| NO_SIDE_EFFECT | Not normally required |
| READ_ONLY | Not normally required when authorized |
| LOCAL_SIDE_EFFECT | May require confirmation |
| REVERSIBLE_SIDE_EFFECT | Confirmation normally required |
| EXTERNAL_SIDE_EFFECT | Explicit confirmation required |
| HIGH_IMPACT_SIDE_EFFECT | Confirmation + authorization required |

---

## Adapter contract (`ExecutionAdapterDefinition`)

Vendor-neutral fields: `id`, `name`, `version`, `supportedCapabilities`, `supportedEnvironments` (`AdapterRuntimeEnvironment`: LOCAL / CONTAINER / REMOTE / UNKNOWN), `privacyClass`, `availability`, `sideEffectClass`, `provenance`, optional `execute()` / `validate()` / `healthStatus`.

---

## Execution policy decisions

| Decision | Meaning |
|----------|---------|
| ALLOW | May execute |
| DENY | Blocked |
| REQUIRES_CONFIRMATION | Awaiting user confirmation |
| UNAVAILABLE | Adapter/environment unavailable |
| NOT_CONFIGURED | Adapter not configured |
| INVALID | Malformed or incompatible request |

No LLM judge. Deterministic only.

---

## Constitution integration

`evaluateExecutionPolicy()` checks capability, scope, privacy, tool+execution authorization, memory authority, confirmation, then `Constitution.evaluateExecution()`.

Memory cannot grant consequential execution authority. Models cannot waive confirmation.

---

## Tool → execution boundary

`executeToolWithExecutionLayer()` orchestrates AI-6 tool governance then AI-7 execution governance. `assertNoDirectAdapterInvocation()` blocks policy bypass.

---

## Safe test adapters

| Adapter | Purpose |
|---------|---------|
| exec.noop | NO_SIDE_EFFECT |
| exec.readonly | READ_ONLY |
| exec.local | LOCAL_SIDE_EFFECT |
| exec.confirmation | EXTERNAL_SIDE_EFFECT |
| exec.high-impact | HIGH_IMPACT |
| exec.unavailable | UNAVAILABLE |
| exec.disabled | DISABLED |
| exec.failing | FAILED result |
| exec.remote | LOCAL_ONLY privacy test |
| exec.container | CONTAINER environment |

---

## Audit

Metadata only: `requestId`, `executionId`, `toolId`, `adapterId`, `policyDecision`, `executionStatus`, versions, timestamps. No sensitive payloads.

---

## Future boundaries

| Future | Boundary |
|--------|----------|
| Docker/AWS adapters | Future `AdapterRuntimeEnvironment` implementations |
| Tau Foundation Model | Same execution layer |
| Grayscale/ATHENA | External via TauAIClient — not implemented |
| Real integrations | Future explicitly governed milestones |

---

## Known limitations

- No production integration with `/api/tauai/chat`
- No real banking, email, GitHub, filesystem deletion
- Health status is declared, not probed (except test HEALTHY markers)
- Input validation is minimal structural checks

---

## Verification

```bash
./scripts/verify-tau-ai-ai7.sh
```

31 execution scenarios + full AI-3/4/5/6 regression.

---

## AI-8 recommendation

**AI-8 — Tau AI API integration (shadow)**: wire Constitution → Memory → Tools → Execution → Router into `TauAIClient` shadow path — still no production cutover to `/api/tauai/chat`.

---

## Related

- `docs/ai-6-tau-tool-foundation.md`
- `docs/ai-4-tau-constitution.md`
- `docs/tau-foundation-v0.1-architecture.md`
