# TF-1 — Dataset Quality Control

**Validator:** `tools/tau-dataset/validate.ts`  
**Validation version:** `1.0.0`  
**No LLM judge in TF-1**

---

## Deterministic checks

| Code | Level | Description |
|------|-------|-------------|
| `INVALID_ID` | error | id must be UUID v4 |
| `INVALID_DATASET_VERSION` | error | wrong datasetVersion |
| `INVALID_SCHEMA_VERSION` | error | wrong schemaVersion |
| `INVALID_CATEGORY` | error | unknown category |
| `MISSING_TASK_TYPE` | error | empty taskType |
| `EMPTY_INPUT` / `EMPTY_OUTPUT` | error | required content |
| `MISSING_PROVENANCE` | error | provenance block required |
| `UNKNOWN_PROVENANCE` | error | UNKNOWN type blocked |
| `NOT_PERMITTED` | error | license forbids use |
| `REJECTED_RECORD` | error | reviewStatus REJECTED |
| `SYNTHETIC_MISMATCH` | error | synthetic flag inconsistent |
| `REVIEW_INCONSISTENT` | error | humanReviewed vs status |
| `DUPLICATE_ID` | error | duplicate id |
| `TRAIN_TEST_LEAKAGE` | error | train input matches test input |
| `SECRET_DETECTED` | error | API key / password patterns |
| `DUPLICATE_CONTENT` | warning | identical input/output hash |

---

## Human review priorities

1. Constitutional behavior examples
2. Tool use + execution boundary examples
3. Ecosystem task examples (TauMail, Developer)
4. Security / privacy refusals
5. Synthetic candidates (before any train promotion)

---

## Quality scoring

`metadata.qualityScore` (0–1) is optional in v0.1 gold seed.

Phase B promotion gate: prefer `qualityScore >= 0.8` or explicit REVIEWED status.

---

## Negative examples

`behaviorType: bad` records may exist for contrast (e.g. constitution training pairs).

They must still be `REVIEWED` and clearly labeled — never ship unreviewed bad examples.

---

## Reports

Build writes:

`datasets/tau-foundation/v0.1/reports/tau-dataset-v0.1-validation.json`

Contains full issue list, error/warning counts, and pass/fail.

---

## CI / verify integration

`scripts/verify-tau-dataset-v01.sh` runs build + test + typecheck regressions.

Any validation error **blocks** manifest promotion.
