# AI-6 — Tau Tool Registry Foundation

**Milestone:** AI-6 (Tau Foundation v0.1)  
**Status:** Complete  
**Verification:** TOOL GOVERNANCE VALIDATED

---

## Summary

Implemented the governed Tau Tool Registry — discovery, authorization, confirmation gates, constitution integration, and safe test tools. Models may **request** tools; they do not automatically **receive** execution authority.

No production wiring. No real external mutations. No Grayscale/ATHENA.

---

## Architecture

```
User
 ↓
Tau AI
 ↓
Memory / Context
 ↓
Constitution          ← authoritative
 ↓
Capability
 ↓
Tool Registry         ← AI-6
 ↓
Model Router
 ↓
Model Substrate
```

**Lifecycle:** DISCOVER → DESCRIBE → REQUEST → AUTHORIZE → CONFIRM → EXECUTE → VALIDATE → AUDIT

---

## Tool contract (`TauToolDefinition`)

| Field | Purpose |
|-------|---------|
| id, name, version | Identity |
| capability | Links to AI-3 `CapabilityId` |
| inputSchema / outputSchema | Structured validation |
| permissions, requiredScopes | Authorization |
| privacyClass | LOCAL vs REMOTE_ALLOWED |
| riskClass | Deterministic risk tier |
| sideEffectClass | NONE / LOCAL / EXTERNAL / IRREVERSIBLE |
| confirmationPolicy | When user confirmation required |
| availability | AVAILABLE / UNAVAILABLE / NOT_CONFIGURED / DISABLED |
| provenance | Provider, version, source |
| executable + execute() | Optional execution |

---

## Risk model

| Class | Confirmation |
|-------|----------------|
| READ_ONLY | Not normally required |
| LOW_IMPACT | Auto when explicitly authorized |
| REVERSIBLE_ACTION | User confirmation may be required |
| EXTERNAL_SIDE_EFFECT | User confirmation required |
| HIGH_IMPACT | Confirmation + authorization required |

Model output **cannot** silently waive confirmation.

---

## Tool scopes

USER → PROJECT → PRODUCT → SYSTEM

No automatic scope escalation. SYSTEM scope requires explicit SYSTEM authorization.

---

## Constitution integration

Every `ToolRequest` passes `evaluateToolRequestGovernance()` then `Constitution.evaluateToolUse()`.

Blocked when:

- Capability mismatch
- Unauthorized scope / escalation
- LOCAL_ONLY + remote tool
- Memory-granted authority for consequential actions
- Missing confirmation
- Constitution rejection

---

## Registry operations

`register()`, `unregister()`, `get()`, `list()`, `findByCapability()`, `findByScope()`, `findAvailable()`, `validate()`

Malformed definitions and duplicate IDs are rejected.

---

## Safe test tools

| Tool | Purpose |
|------|---------|
| test.echo | READ_ONLY echo |
| test.calculator | LOW_IMPACT deterministic calc |
| test.unavailable | UNAVAILABLE state |
| test.disabled | DISABLED state |
| test.confirmation | EXTERNAL_SIDE_EFFECT + confirmation |
| test.high-impact | HIGH_IMPACT protection |
| test.remote | LOCAL_ONLY privacy block |
| test.system-scope | Scope escalation test |

---

## Audit

Metadata only: `toolId`, `requestId`, `policyResult`, `executionStatus`, `toolVersion`, `constitutionVersion`.

Never logs tool inputs, secrets, or sensitive content.

---

## Future boundaries

| Future | Boundary |
|--------|----------|
| Semantic tool discovery | Extend registry — no change to TauAIClient contract |
| Tau Foundation Model | Same governed tool infrastructure |
| Grayscale/ATHENA | External consumers via TauAIClient — not implemented |
| Real tools (email, GitHub, …) | Future milestones with production cutover |

---

## Known limitations

- No production integration with `/api/tauai/chat`
- No real tool execution (email, banking, etc.)
- No vector DB, Redis, Mem0, cloud infrastructure
- Input validation is structural (required fields), not full JSON Schema validation

---

## Verification

```bash
./scripts/verify-tau-ai-ai6.sh
```

25 deterministic scenarios + full AI-3/4/5 regression.

---

## AI-7 recommendation

**AI-7 — Execution abstraction foundation**: implement governed `ExecutionAdapter` registry with constitution-aware execution requests, side-effect classification, and confirmation gates — parallel to tools, still no production cutover.

---

## Related

- `docs/ai-4-tau-constitution.md`
- `docs/ai-5-tau-memory-foundation.md`
- `docs/tau-foundation-v0.1-architecture.md`
