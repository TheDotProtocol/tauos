# TF-1 — Dataset Schema

**Schema version:** `1.0.0`  
**Dataset version:** `tau-dataset-v0.1`  
**Machine-readable:** `datasets/tau-foundation/v0.1/schema/tau-record.schema.json`  
**TypeScript:** `tools/tau-dataset/schema.ts`

---

## Design principles

1. Every field has a purpose — no decorative metadata
2. Provenance and license are mandatory
3. `UNKNOWN` provenance cannot enter training splits
4. Plain `input`/`output` for simplicity; optional `messages` for chat export

---

## Record fields

| Field | Required | Purpose |
|-------|----------|---------|
| `id` | yes | UUID v4 stable identifier |
| `datasetVersion` | yes | Dataset release (`tau-dataset-v0.1`) |
| `schemaVersion` | yes | Schema migration version |
| `category` | yes | Taxonomy bucket (18 categories) |
| `taskType` | yes | Fine-grained task label |
| `input` | yes | User/task prompt |
| `output` | yes | Target assistant response |
| `systemContext` | no | Optional system preamble for SFT |
| `messages` | no | Multi-turn chat form |
| `metadata` | yes | Language, difficulty, constitution tags, product context |
| `provenance` | yes | Origin, review, legal classification |
| `license` | yes | Permitted-use status |
| `split` | no | Assigned at build (`train` / `validation` / `test`) |
| `createdAt` | yes | ISO8601 |
| `updatedAt` | yes | ISO8601 |

---

## Metadata subfields

| Field | Purpose |
|-------|---------|
| `language` | ISO language code (e.g. `en`) |
| `modality` | `text` only in v0.1 |
| `difficulty` | `low` / `medium` / `high` |
| `qualityScore` | 0–1 human or review estimate |
| `safetyTags` | Optional safety labels |
| `constitutionalTags` | Tau Constitution v0.1 principle IDs |
| `behaviorType` | `good` / `bad` / `corrected` / `uncertain` |
| `productContext` | `taumail` / `tau-developer` / `tau-ai` / `general` |
| `taskSubtype` | Finer task classification |

---

## Provenance subfields

| Field | Purpose |
|-------|---------|
| `type` | `TAU_CREATED`, `THIRD_PARTY_LICENSED`, etc. |
| `source` | Named origin (e.g. `TAU_AUTHORED`) |
| `transformation` | `NONE` or described transform |
| `synthetic` | Boolean — must align with `type` |
| `creationMethod` | e.g. `HUMAN_AUTHORED`, `SYNTHETIC_MODEL_GENERATION` |
| `generatorModel` | Required for synthetic (e.g. `qwen2.5-7b`) |
| `humanReviewed` | Boolean |
| `reviewStatus` | `UNREVIEWED` / `REVIEWED` / `REJECTED` |
| `reviewer` | Reviewer id or null |
| `licenseStatus` | `CLEAR`, `UNKNOWN`, `REQUIRES_LEGAL_REVIEW`, etc. |
| `legalStatus` | `VERIFIED`, `UNKNOWN`, `REQUIRES_LEGAL_REVIEW` |

---

## License subfields

| Field | Purpose |
|-------|---------|
| `spdx` | SPDX or `LicenseRef-*` identifier |
| `status` | Same enum as `provenance.licenseStatus` |
| `notes` | Human-readable license notes |

---

## Categories

See `tools/tau-dataset/constants.ts` — `DATASET_CATEGORIES`.

Recommended weights in `RECOMMENDED_CATEGORY_WEIGHTS` for Phase B/C expansion.

---

## Example (abbreviated)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "datasetVersion": "tau-dataset-v0.1",
  "schemaVersion": "1.0.0",
  "category": "CONSTITUTIONAL_BEHAVIOR",
  "taskType": "principle_example",
  "input": "Did you send that email?",
  "output": "I did not send an email. I can draft text for your review.",
  "metadata": {
    "language": "en",
    "modality": "text",
    "difficulty": "medium",
    "constitutionalTags": ["TRANSPARENCY", "USER_AUTONOMY"],
    "behaviorType": "good",
    "productContext": "taumail"
  },
  "provenance": {
    "type": "TAU_CREATED",
    "source": "TAU_AUTHORED",
    "transformation": "NONE",
    "synthetic": false,
    "creationMethod": "HUMAN_AUTHORED",
    "humanReviewed": true,
    "reviewStatus": "REVIEWED",
    "reviewer": "tau-dataset-v01-seed",
    "licenseStatus": "CLEAR",
    "legalStatus": "VERIFIED"
  },
  "license": {
    "spdx": "LicenseRef-Tau-Dataset-Contribution-1.0",
    "status": "CLEAR"
  },
  "createdAt": "2026-08-08T00:00:00.000Z",
  "updatedAt": "2026-08-08T00:00:00.000Z"
}
```

---

## Migrations

Future schema versions bump `schemaVersion` with a migration script. Never silently rewrite provenance fields.
