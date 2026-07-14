# TAU CORE Certification Readiness (Public Beta)

Honest assessment of compliance controls vs. formal certifications. **Badges are shown only after audits are completed.**

## Summary

| Framework | Public Beta status | Evidence |
|-----------|-------------------|----------|
| GDPR / DPA | **Aligned** — operational DSR controls | `/api/privacy/export`, `/api/privacy/account`, `/legal/dpa` |
| SOC 2 Type II | **In progress** (~35%) | `audit_log`, access controls — no badge |
| ISO 27001 | **In progress** (~30%) | ISMS docs in `SOC2_SOC3_AUDIT_CHECKLIST.md` |
| CCPA | Partial | Same DSR APIs as GDPR export/delete |

## Implemented controls (code evidence)

1. **Data export (Art. 15/20)** — `GET /api/privacy/export`
2. **Right to erasure (Art. 17)** — `DELETE /api/privacy/account`
3. **Audit trail** — `audit_log` table + `src/lib/audit-log.ts`
4. **Enterprise status API** — `GET /api/enterprise/compliance-status`
5. **Legal pages** — `/legal/data-protection`, `/legal/dpa`
6. **Tau Talk E2E** — client-side ECDH in `src/lib/tautalk-crypto.ts`
7. **Cloud at-rest** — Supabase storage via `src/lib/supabase-storage.ts`

## Not claimed tonight

- SOC 2 Type II certified badge
- ISO 27001 certified badge
- MDM / live SIEM integration
- Formal penetration test report

## Next steps (post-beta)

1. Engage SOC 2 auditor with evidence from this checklist
2. Wire enterprise security dashboard to live `audit_log` queries
3. Complete ISO 27001 ISMS documentation
4. Rotate any leaked secrets before production audit

See also: [`SOC2_SOC3_AUDIT_CHECKLIST.md`](../SOC2_SOC3_AUDIT_CHECKLIST.md)
