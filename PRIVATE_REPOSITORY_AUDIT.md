# PRIVATE_REPOSITORY_AUDIT.md
## taucore-internal — Private Engineering Repository

**URL:** https://github.com/TheDotProtocol/taucore-internal
**Visibility:** Private
**Local snapshot:** 15,897 files (~5.7 GB)

---

## Top-Level Directories Migrated

| Directory | Category | Reason |
|-----------|----------|--------|
| `os/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `os-code/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `kernel-build/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `bootloader/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `hal/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `initrd-fix/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `release-files/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `audit/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `hardware-validation/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `qemu-vms/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `infrastructure/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `database/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `developerhub/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `website/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `website-replit/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `new-website/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `newebsite/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `mobileosui/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `TauTalkMobile/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `ci/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `build/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `output/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `images/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `macos_iso_build/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `marketing_iso_build/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `driver-integration/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `flatpak-integration/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `gui/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `core/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `pkgmgr/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `sandboxd/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `ota-system/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `monitoring/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `examples/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `export/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `finaldocumentation/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `design/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `apps/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `installer/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `supabase/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `docs/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `target/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `tauos-mobile/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `tauai-core/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `ui-mockups/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `tauos-redesign/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `tau-screens/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `taustore/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `simple_iso_build/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `system-monitoring/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `security-hardening/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `test-project/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `terraform/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `tauos_demo_build/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `tauconnect/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `tau-components/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `tools/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |
| `screenshots/` | Internal Engineering | Proprietary OS/infra/research — not for public distribution |

## Archive Contents

| Path | Contents |
|------|----------|
| `archive/root-md/` | Internal status reports, launch plans, test results |
| `archive/scripts-removed/` | ~120 internal build/deploy/infra scripts |
| `archive/public-internal/` | Investor xlsx, pdf, financial chart assets |
| `archive/public-docs-internal/` | PRODUCTION_SETUP, DEPLOYMENT, monitoring docs |
| `archive/src-investor/` | Investor page, financial APIs, pitch deck markdown |

## Removed from Public (not duplicated in top-level private dirs)

- Investor financial API routes (`src/app/api/investors/`)
- Production readiness audit, GTM strategy, project overview docs
- Financial forecast PNG charts
- Internal GitHub workflows (tau-ide-ci, taubrowser-build)
- Root ISOs, qcow2, env files with potential secrets

## Git History

Private repo initialized with fresh commit containing full disk snapshot.
Historical git history for internal paths remains in public repo history until BFG/git-filter-repo cleanup (recommended follow-up).
