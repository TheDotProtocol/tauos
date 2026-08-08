# TF-1 — Dataset License Policy

**Disclaimer:** Engineering policy, **not legal advice**. Counsel required before commercial model release.

---

## Status enum

| Status | Meaning | Action |
|--------|---------|--------|
| `CLEAR` | Engineering audit: permitted for train + commercial target | May enter gold/train with REVIEWED |
| `UNKNOWN` | Not audited | Block from train |
| `REQUIRES_LEGAL_REVIEW` | Uncertain ownership or terms | Hold until counsel |
| `RESTRICTED` | Limited use | Document constraints; may exclude |
| `NOT_PERMITTED` | Forbidden | Validator rejects |

---

## Provenance vs ownership

| Statement | Allowed |
|-----------|---------|
| "This record is TAU_CREATED" | Yes — if provenance supports it |
| "Tau owns all data in the dataset" | **No** — unless every record verified |
| "Tau owns dataset schema, validation, and curation" | Yes |
| "Synthetic data is automatically Tau-owned" | **No** |

---

## TAU_CREATED records (TF-1 gold)

- Authored by Tau engineering for training purposes
- SPDX: `LicenseRef-Tau-Dataset-Contribution-1.0` (internal ref — **REQUIRES LEGAL REVIEW** for formal SPDX registration)
- `legalStatus: VERIFIED` means engineering verification only — not counsel sign-off

---

## Third-party data (future TF-1+ / Phase B)

Before import:

1. Read primary LICENSE file from source
2. Record in provenance registry with date and URL
3. Confirm permitted_use includes `train` and `commercial` if deploying commercially
4. Preserve attribution requirements in model card plan

**Do not download bulk third-party datasets in TF-1.**

---

## Synthetic data

| Question | Policy |
|----------|--------|
| Can Qwen-generated examples be used? | Only with explicit generator terms review |
| Default legal status | `REQUIRES_LEGAL_REVIEW` |
| Train eligibility | Human reviewed + counsel clearance |
| Test set | Never generate synthetic from eval prompts |

Generator API terms (OpenAI, Anthropic, etc.) typically restrict using outputs to train competing models — **REQUIRES LEGAL REVIEW**.

---

## Base model relationship

Tau Dataset v0.1 does **not** change Qwen2.5-7B Apache 2.0 obligations for the eventual fine-tuned model.

Model card must inherit base license notices.

---

## PII and secrets

- No customer data, mailboxes, credentials, or API keys in dataset
- Validator scans for secret patterns
- PII in examples must be fictional or redacted

---

## Git / security

- No `.env`, keys, or mailbox exports in `datasets/`
- Large raw downloads go in `raw/` (gitignored) when Phase B begins

---

## Legal review queue (TF-1)

| Item | Status |
|------|--------|
| Formal `LicenseRef-Tau-Dataset-Contribution-1.0` definition | REQUIRES LEGAL REVIEW |
| Commercial use of Tau Dataset v0.1 for fine-tune | REQUIRES LEGAL REVIEW |
| Public release of fine-tuned weights | REQUIRES LEGAL REVIEW |
| Synthetic data policy | REQUIRES LEGAL REVIEW |
| Third-party dataset imports (Phase B) | REQUIRES LEGAL REVIEW per source |

---

## STOP

No claim that all data is Tau-owned. Provenance and license status are explicit on every record.
