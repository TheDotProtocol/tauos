# MIGRATION_SUMMARY.md
## Tau Core Repository Restructure — Execution Summary

**Date:** 2026-08-06  
**Public repo:** https://github.com/TheDotProtocol/tauos  
**Private repo:** https://github.com/TheDotProtocol/taucore-internal  

---

## Results

| Metric | Before | After |
|--------|--------|-------|
| Public tracked files | 3,691 | 1,103 |
| Files removed from public index | — | 2,588 |
| Private repo files (local) | — | 15,897 |
| Private repo size (local snapshot) | — | ~5.7 GB |

---

## Actions Completed

1. **REPOSITORY_MIGRATION_PLAN.md** — generated and committed to staging
2. **Public index cleaned** — removed OS code, kernel, infra, docs, target/, scripts, investor materials
3. **taucore-internal created** — private GitHub repo at `TheDotProtocol/taucore-internal`
4. **Community files added** — LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG
5. **Proprietary cleanup (phase 2)** — investor APIs, financial charts, internal audit docs removed from public index
6. **Investors page** — replaced with contact-only stub (no financial data)

---

## Build Verification

| Check | Status |
|-------|--------|
| `npm install` | ✅ Pass |
| `npm run build` | ✅ Pass (all routes compile) |
| `scripts/vercel-prebuild-check.mjs` | ✅ Pass |
| TypeScript / Next.js | ✅ Pass |
| Tailwind | ✅ Pass |

---

## Vercel Verification

| Requirement | Status |
|-------------|--------|
| `src/**` present | ✅ |
| `public/tau-core/**` | ✅ |
| `public/downloads/manifest.json` | ✅ |
| `scripts/vercel-prebuild-check.mjs` | ✅ |
| `.github/workflows/deploy-vercel.yml` | ✅ |
| `.vercelignore` unchanged | ✅ |

**Expected impact:** None — Vercel deploys only allowlisted paths; removed content was never deployed.

---

## GitHub Verification

| Item | Status |
|------|--------|
| Public workflows | `deploy-vercel.yml` retained |
| Internal workflows removed | `tau-ide-ci.yml`, `taubrowser-build.yml` |
| Download manifest | Retained at `public/downloads/manifest.json` |
| GitHub Releases | Unchanged (binaries hosted on Releases, not git) |

---

## Community Clone Verification

After push, a fresh clone should contain:

- Website + Tau Mail/Cloud/Talk/ID/Developer platform source
- Tau Core UI preview (`public/tau-core/`)
- Public SDK (`sdk/`)
- Download manifest (URLs point to GitHub Releases)
- 5 public scripts + Vercel deploy workflow

A clone will **not** contain: OS source, kernel, infra, internal docs, build tooling, investor financials.

---

## Private Push Status

Large private snapshot (~5.7 GB) push to `taucore-internal` may take extended time.  
If push fails, use lean push excluding `target/` and `*.iso` (see `scripts/push-tauos-core-lean.sh`).

**Note:** `TheDotProtocol/tauos-core` (earlier lean push) can be consolidated into `taucore-internal`.

---

## Pending (requires commit + push)

Public repo changes are **staged in working tree** but not yet committed/pushed to GitHub.  
Run when ready:

```bash
git add -A
git commit -m "Restructure: public community edition only (v1.0)"
git push origin main
```

---

## Files Deleted from Git (not from disk)

- `target/` — 1,889 Rust build artifacts (never should have been committed)
- Root ISOs/qcow2 — binaries belong on GitHub Releases only
- Internal scripts (~120 files)
- Investor xlsx/pdf, financial chart PNGs
- Internal documentation (270+ docs/, deployment guides, audit reports)

---

## Files Archived in taucore-internal

- `archive/root-md/` — internal status reports
- `archive/scripts-removed/` — internal build/deploy scripts
- `archive/public-internal/` — investor assets
- `archive/public-docs-internal/` — deployment/production docs
- `archive/src-investor/` — investor page, APIs, pitch deck

