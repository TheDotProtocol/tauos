# AI-3.1 — Model Substrate Metadata

**Milestone:** AI-3.1 (Tau Foundation v0.1)  
**Status:** Complete  
**Verification level:** METADATA VERIFIED

---

## Summary

Extended `ModelSubstrate` with explicit metadata for capabilities, privacy, availability, health, cost, latency, and provenance. Existing gateway providers are bridged without changing inference behaviour or production routes.

---

## ModelSubstrate extensions

```typescript
interface ModelSubstrate {
  readonly metadata: SubstrateMetadata;
  getAvailability?(): AvailabilityState;
  // ... existing complete/stream/healthCheck unchanged
}
```

### SubstrateMetadata fields

| Field | Values |
|-------|--------|
| `capabilities[]` | Per-capability: SUPPORTED \| UNSUPPORTED \| UNKNOWN |
| `privacyClass` | LOCAL \| REMOTE \| HYBRID \| UNKNOWN |
| `costClass` | FREE \| LOW \| MEDIUM \| HIGH \| UNKNOWN |
| `latencyClass` | LOW \| MEDIUM \| HIGH \| UNKNOWN |
| `availability` | AVAILABLE \| UNAVAILABLE \| REMOTE \| LOCAL \| NOT_CONFIGURED \| UNKNOWN |
| `healthStatus` | HEALTHY \| DEGRADED \| UNAVAILABLE \| UNKNOWN |
| `provenance` | modelId, modelFamily, provider, license, source, version, weightsLocation, architecture, modalities |
| `verificationLevel` | METADATA_VERIFIED \| ADAPTER_VERIFIED \| MODEL_LIVE_VERIFIED \| PRODUCTION_READY |

---

## Capability ↔ substrate relationship

```
CapabilityRegistry (AI-3.0)
        ↓
SubstrateMetadata.capabilities[] (AI-3.1)
        ↓
ModelRouter (AI-3.2 — not implemented)
```

No substrate implicitly claims a capability. Unknown = `UNKNOWN`.

---

## Provider metadata status

All 9 gateway providers + vLLM stub + tau-foundation placeholder have declared metadata in `src/lib/ai-gateway/substrate-metadata.ts`.

See `docs/tau-ai-model-catalog.md` for the full table.

---

## Runtime vs declared

| Concept | Source |
|---------|--------|
| Declared capability | `metadata.capabilities[]` |
| Declared availability | `metadata.availability` |
| Runtime availability | `getAvailability()` = f(metadata, isConfigured()) |
| Live health | `healthCheck()` when implemented |

---

## Tau Foundation placeholder

`createTauFoundationSubstrateStub()` — id `tau-foundation`, provider `tau`, NOT_CONFIGURED.

Future Tau-derived weights register here without architectural redesign.

---

## What was NOT done (by design)

- No model downloads
- No training / fine-tuning
- No production routing (AI-3.2)
- No route migration
- No fake benchmarks or licensing claims
- No Grayscale / ATHENA / OpenClaw
- No mobile or AWS changes

---

## Verification

```bash
chmod +x scripts/verify-tau-ai-ai3-1.sh
./scripts/verify-tau-ai-ai3-1.sh
```

---

## AI-3.2 recommendation

Implement deterministic `ModelRouter` consuming:

- `CapabilityRegistry` (requested capability)
- `SubstrateMetadata` (declared support + privacy + availability)
- User preferences and privacy mode

Keep production on `runAiChat()` until shadow comparison passes.

---

## Related

- `docs/tau-foundation-v0.1-architecture.md`
- `docs/tau-ai-model-catalog.md`
- `docs/tau-ai-capability-registry.md`
