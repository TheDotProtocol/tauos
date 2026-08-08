# TF-1 — Dataset Generation

**TF-1 scope:** Schema + gold seed + validation — **not bulk generation**

---

## Phased targets

| Phase | Size | Status |
|-------|------|--------|
| **A — Gold** | 100–250 | ✅ TF-1 seed (~100+) |
| **B — Curated** | 1,000 | Future |
| **C — Full v0.1** | 5,000+ | Future |

Quality > quantity. Expand only with review capacity.

---

## Generation methods (TF-1)

| Method | provenance.type | TF-1 usage |
|--------|-----------------|------------|
| Human-authored seed | `TAU_CREATED` | ✅ Primary |
| Template expansion (authored) | `TAU_CREATED` | ✅ Used in seed generator |
| Third-party import | `THIRD_PARTY_LICENSED` | ⏸ TF-1 audit only |
| Synthetic model output | `TAU_SYNTHETIC` | ⏸ Not in gold set |

---

## Tooling

| Tool | Role |
|------|------|
| TypeScript | Schema, validation, seed factory |
| JSONL | Portable record storage |
| `scripts/build-tau-dataset-v01.ts` | Build splits + manifest |
| `scripts/test-tau-dataset-v01.ts` | Verification tests |

**Not introduced in TF-1:** Hugging Face Datasets dependency, Parquet, cloud storage, LLM batch generators.

**TF-2+ may add:** Python export, HF Datasets loader, Axolotl formatter — after pipeline approval.

---

## Seed factory

`tools/tau-dataset/seed/gold-records.ts`

- Exports `buildGoldSeedRecords()`
- All records `HUMAN_AUTHORED` / `TAU_CREATED`
- Reviewer: `tau-dataset-v01-seed`

---

## Build pipeline

```
buildGoldSeedRecords()
    → write curated/gold/seed-authors.jsonl
    → validateDataset(assignSplits)
    → write train / validation / test JSONL
    → write manifest + validation report + provenance registry
```

---

## Synthetic generation (future — not TF-1)

When enabled:

1. Generate with explicit `generatorModel`
2. Store raw + reviewed versions
3. Default `legalStatus: REQUIRES_LEGAL_REVIEW`
4. Never auto-promote to train
5. Keep synthetic out of test split

---

## Coding data boundary

Tau Developer code in the repo is **not** auto-imported.

Coding examples are authored as isolated instructional pairs — no product code copy-paste.

---

## Constitution data strategy

For each of 10 principles, seed includes:

- Good behavior
- Bad behavior (where useful for contrast)
- Corrected behavior
- Uncertainty / privacy / tool scenarios where relevant

Deterministic Constitution engine remains authoritative at inference.

---

## STOP

No bulk synthetic generation in TF-1.
