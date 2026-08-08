# AI-3.3 — Hardware-Aware + Environment-Aware Routing

**Milestone:** AI-3.3 (Tau Foundation v0.1)  
**Status:** Complete  
**Verification:** ROUTING VERIFIED (hardware layer)

---

## Summary

Added vendor-neutral **HardwareProfile** and **HardwareDetector** abstractions. The deterministic router applies hardware compatibility as a filter after availability and before capability ranking — without overriding privacy constraints.

Production path unchanged. Shadow mode extended with local comparison metrics.

---

## Updated routing pipeline

```
CAPABILITY → SYSTEM POLICY → PRIVACY → AVAILABILITY → HARDWARE → CAPABILITY (SUPPORTED)
→ USER PREFERENCES → COST → LATENCY → STABLE PRIORITY → ID TIEBREAK
```

Privacy remains a **hard filter** — hardware never overrides `LOCAL_ONLY`.

---

## HardwareProfile fields

| Field | Values |
|-------|--------|
| CPU architecture | ARM64, X86_64, UNKNOWN |
| CPU cores | number or UNKNOWN |
| GPU availability | NONE, AVAILABLE, UNKNOWN |
| GPU vendor | NVIDIA, AMD, INTEL, APPLE, QUALCOMM, MEDIATEK, OTHER, UNKNOWN |
| GPU memory | bytes or UNKNOWN |
| System memory | total/available bytes or UNKNOWN |
| Storage | availableBytes or UNKNOWN |
| Execution environments | MACOS, LINUX, DOCKER, … (multi-layer allowed) |

Default detector returns **UNKNOWN** for all unverified fields.

---

## Compatibility rules (conservative)

| Condition | Action |
|-----------|--------|
| Requirement UNKNOWN | Do not reject on that field |
| Hardware UNKNOWN | Do not auto-reject (allow with `hardwareCompatibility: UNKNOWN`) |
| Known insufficient RAM/VRAM | Reject with typed reason |
| GPU required + GPU NONE | Reject |
| Architecture mismatch (both known) | Reject |

---

## Public API

```typescript
import {
  createDefaultHardwareDetector,
  createUnknownHardwareProfile,
  evaluateHardwareCompatibility,
} from '@tau/ai';

const hardware = createDefaultHardwareDetector().detect();
router.route({ capability, privacyMode, substrates, hardwareProfile: hardware });
```

Substrates may declare optional `metadata.inferenceRequirements`.

---

## Shadow metrics

```typescript
metrics: {
  legacySubstrateId: 'fallback',      // from pickAutoProvider()
  tauSubstrateId: 'fallback',
  routingAgreement: true,
  hardwareRejected: 0,
  privacyRejected: 2,
  capabilityRejected: 1,
}
```

No external telemetry. Local structured records only.

---

## Verification

```bash
./scripts/verify-tau-ai-ai3-3.sh
```

13 hardware scenarios + AI-3.2 15-test regression green.

---

## AI-3.4 recommendation

Open-model substrate metadata enrichment (Qwen/Llama coding variants via Ollama catalog entries) and shadow agreement analysis over time — still no production cutover.

---

## Related

- `docs/tau-foundation-v0.1-architecture.md`
- `docs/ai-3.2-deterministic-router.md`
