# TF-1 — Tau Dataset v0.1

**Milestone:** TF-1 — Dataset foundation  
**Status:** COMPLETE · **STOP** (await approval for TF-2)  
**Dataset version:** `tau-dataset-v0.1`  
**Schema version:** `1.0.0`

---

## Purpose

Tau Dataset v0.1 is the first **provenance-aware, versioned training corpus** for Tau Foundation Model v0.1.

This is **not** the model. It is **not** Tau Foundation software. It is a governed data asset.

```
Tau Dataset v0.1  →  (TF-2 pipeline)  →  Tau Foundation Model v0.1
                                              ↓
                                        tau-foundation substrate
```

---

## Phase A delivery (this milestone)

| Phase | Target | Delivered |
|-------|--------|-----------|
| **A — Gold seed** | 100–250 high-quality examples | ✅ 106 TAU_CREATED records |
| **B — Curated 1K** | 1,000 reviewed | ⏸ Future |
| **C — Full v0.1** | 5,000+ | ⏸ Future |

Quality over quantity. All seed records are **human-authored**, `TAU_CREATED`, `REVIEWED`.

---

## Repository layout

```
datasets/tau-foundation/v0.1/
  schema/tau-record.schema.json
  curated/gold/seed-authors.jsonl
  train/tau-dataset-v0.1.jsonl
  validation/tau-dataset-v0.1.jsonl
  test/tau-dataset-v0.1.jsonl
  manifests/tau-dataset-v0.1.json
  reports/tau-dataset-v0.1-validation.json
  provenance/registry.yaml

tools/tau-dataset/
  constants.ts
  schema.ts
  validate.ts
  build.ts
  seed/gold-records.ts

scripts/
  build-tau-dataset-v01.ts
  test-tau-dataset-v01.ts
  verify-tau-dataset-v01.sh
```

---

## Build & verify

```bash
npx tsx scripts/build-tau-dataset-v01.ts
./scripts/verify-tau-dataset-v01.sh
```

---

## Split policy

Deterministic split from record `id` hash:

- **test:** buckets 0–4 (5%)
- **validation:** buckets 5–9 (5%)
- **train:** buckets 10–99 (90%)

Test inputs must not appear in train/validation (enforced by validator).

---

## Category distribution (initial gold)

Prioritized for Tau differentiation — see manifest for live counts after build.

| Category | Priority |
|----------|----------|
| CONSTITUTIONAL_BEHAVIOR | P0 |
| TOOL_USE | P0 |
| TAU_ECOSYSTEM | P0 |
| PRIVACY / SECURITY | P0 |
| CODING / REASONING | P1 |
| CONVERSATIONAL / MULTILINGUAL | P2 |
| FUTURE_MULTIMODAL | Deferred |

---

## Constitution coverage

All 10 Tau Constitution v0.1 principles have dedicated examples:

TRUTHFULNESS, UNCERTAINTY, TRANSPARENCY, USER_AUTONOMY, PRIVACY, SECURITY, PROVENANCE, CORRECTION, CAPABILITY_HONESTY, INSTRUCTION_HIERARCHY

Architecture remains:

```
Constitution Engine (deterministic) + Tau Foundation Model (learned prior)
```

---

## Synthetic data policy

No synthetic records ship in the gold training set for TF-1.

Future synthetic records must:

- Use `provenance.type: TAU_SYNTHETIC`
- Set `synthetic: true` and `generatorModel`
- Mark `legalStatus: REQUIRES_LEGAL_REVIEW` until counsel approves
- Never enter **test** split if generated from benchmark prompts

---

## Related docs

- [tf-1-dataset-schema.md](./tf-1-dataset-schema.md)
- [tf-1-dataset-provenance.md](./tf-1-dataset-provenance.md)
- [tf-1-dataset-quality.md](./tf-1-dataset-quality.md)
- [tf-1-dataset-generation.md](./tf-1-dataset-generation.md)
- [tf-1-dataset-license-policy.md](./tf-1-dataset-license-policy.md)

---

## STOP

TF-1 complete. No training. No TF-2. Await approval.
