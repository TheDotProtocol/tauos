# REPOSITORY_MIGRATION_PLAN.md
## Tau Core Repository Restructure v1.0

**Date:** 2026-08-06  
**Public repo:** `TheDotProtocol/tauos`  
**Private repo:** `TheDotProtocol/taucore-internal` (new)  
**Supersedes:** `TheDotProtocol/tauos-core` (lean push — merge into taucore-internal)

---

## 1. Objective

Split the monorepo into:

| Repository | Visibility | Purpose |
|------------|------------|---------|
| **tauos** | Public | Community edition: website, product apps, Tau Core UI preview, public docs, SDK examples, download manifest |
| **taucore-internal** | Private | All proprietary engineering, OS/kernel, infra, internal docs, investor materials, build tooling |

---

## 2. Vercel deployment analysis

**Build command:** `node scripts/vercel-prebuild-check.mjs && npm run build`  
**Deploy allowlist (`.vercelignore`):** `src/**`, `public/**`, `scripts/**`, root config files only.

| Dependency | Required? | Action |
|------------|-----------|--------|
| `src/**` | **A — Vercel + Build + Runtime** | **KEEP public** |
| `public/tau-core/**` | **Runtime** (static UI) | **KEEP public** |
| `public/website/**` | **Runtime** (assets) | **KEEP public** |
| `public/downloads/manifest.json` | **Runtime** | **KEEP public** |
| `scripts/vercel-prebuild-check.mjs` | **B — Build** | **KEEP public** |
| `package.json`, `next.config.js`, `vercel.json`, tsconfig, tailwind | **B — Build** | **KEEP public** |
| `os/`, `os-code/`, `target/`, `docs/`, `website/` (legacy) | Not deployed | **MOVE private** — no Vercel impact |
| `supabase/migrations` | Not in build | **MOVE private** |
| Investor xlsx/pdf in `public/` | Excluded or static | **MOVE private** — not needed for site |

**Conclusion:** Removing all internal paths from public git **does not break Vercel** if `src/`, curated `public/`, and 5 whitelisted scripts remain.

---

## 3. Migration matrix (top-level)

| Current location | Category | Destination | Reason | Risk | Vercel |
|------------------|----------|-------------|--------|------|--------|
| `src/` | Public Source Code | **tauos** | Next.js app + all products | Low | **Required** |
| `public/tau-core/` | Public Source Code | **tauos** | Desktop UI preview | Low | **Required** |
| `public/website/` | Public Assets | **tauos** | Marketing assets | Low | **Required** |
| `public/downloads/manifest.json` | Public Documentation | **tauos** | Download Center | Low | **Required** |
| `public/docs/` (curated) | Public Documentation | **tauos** | User/contributor docs | Low | Optional static |
| `public/docs/` (internal) | Internal Engineering | **taucore-internal** | PRODUCTION_SETUP, DEPLOYMENT, etc. | None | None |
| `public/TauOS_*.xlsx`, Investor PDFs | Internal Engineering | **taucore-internal** | Financial/investor confidential | None | None |
| `sdk/` | Public Source Code | **tauos** | Contributor SDK + hello-world | Low | Not deployed |
| `scripts/vercel-prebuild-check.mjs` | Public Source Code | **tauos** | Vercel build gate | **High if moved** | **Required** |
| `scripts/generate-download-manifest.sh` | Public Source Code | **tauos** | Release manifest | Low | None |
| `scripts/publish-os-release.sh` | Public Source Code | **tauos** | GitHub Releases upload | Low | None |
| `scripts/verify-downloads.mjs` | Public Source Code | **tauos** | Download verification | Low | None |
| `scripts/e2e-smoke.mjs` | Public Source Code | **tauos** | CI smoke tests | Low | None |
| `scripts/` (all others, ~120) | Internal Engineering | **taucore-internal** | Deploy, ISO, infra scripts | None | None |
| `.github/workflows/deploy-vercel.yml` | Public Source Code | **tauos** | Production deploy | Medium | CI |
| `.github/workflows/tau-ide-ci.yml` | Internal Engineering | **taucore-internal** | Internal IDE CI | None | None |
| `.github/workflows/taubrowser-build.yml` | Internal Engineering | **taucore-internal** | Browser build | None | None |
| `os/`, `os-code/` | Internal Engineering | **taucore-internal** | OS kernel, installer source | None | None |
| `kernel-build/`, `bootloader/`, `hal/` | Internal Engineering | **taucore-internal** | Kernel/boot | None | None |
| `release-files/` | Build Artifact | **taucore-internal** + **GitHub Releases** | ISOs/binaries not in git | None | None |
| `target/` (1889 files) | Build Artifact | **DELETE from git** | Rust build output — never should be committed | None | None |
| `docs/` (root, 270 files) | Internal Engineering | **taucore-internal** | Internal deployment/status reports | None | None |
| `supabase/` | Internal Engineering | **taucore-internal** | DB schemas/migrations | None | None |
| `website/`, `new-website/`, `newebsite/`, `website-replit/` | Internal Engineering | **taucore-internal** | Legacy duplicate trees | None | None |
| `TauTalkMobile/` | Internal Engineering | **taucore-internal** | Mobile app source (pre-release) | None | None |
| `developerhub/`, `infrastructure/`, `database/` | Internal Engineering | **taucore-internal** | Infra + IDE backend | None | None |
| `tauos-mobile/`, `tauai-core/`, `ui-mockups/` | Internal Engineering | **taucore-internal** | Prototypes/research | None | None |
| Root `*.md` status reports | Internal Engineering | **taucore-internal** | TAUOS-PROJECT-STATUS, TEST_RESULTS, etc. | None | None |
| `Cargo.toml`, `Cargo.lock` | Internal Engineering | **taucore-internal** | Rust userland (with OS build) | None | None |
| `*.iso`, `*.qcow2`, `initrd*.img` in git | Build Artifact | **DELETE from git** → **GitHub Releases** | Too large; already on Releases | None | None |
| `env.production`, `dns-*.json`, `*-env.txt` | Internal Engineering | **taucore-internal** + **DELETE from git** | May contain secrets | **High** | None |
| `README.md` | Public Documentation | **tauos** | Community entry point | Low | None |
| `LICENSE`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, `CHANGELOG` | Public Documentation | **tauos** (root) | Community standards | Low | None |

---

## 4. Safe action legend

| Action | Meaning |
|--------|---------|
| **KEEP public** | Remains in `tauos` git |
| **MOVE private** | Copied to `taucore-internal`; removed from public git index |
| **GitHub Releases** | Binaries hosted on Releases, referenced in manifest |
| **DELETE from git** | Remove from tracking; add to `.gitignore` |
| **Archive** | Preserved in `taucore-internal/archive/` |

---

## 5. Public repository target structure

```
tauos/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── package.json
├── next.config.js
├── vercel.json
├── tsconfig.json
├── tailwind.config.ts
├── src/                    # Website + Tau Mail/Cloud/Talk/ID/Developer
├── public/
│   ├── tau-core/           # Desktop UI (setup + desktop)
│   ├── website/            # Marketing assets
│   ├── downloads/manifest.json
│   └── docs/               # Curated public docs only
├── sdk/                    # Public contributor SDK
├── scripts/                # 5 whitelisted scripts only
└── .github/workflows/deploy-vercel.yml
```

**Estimated public file count:** ~1,200 (down from ~3,691)

---

## 6. Private repository target structure

```
taucore-internal/
├── README.md
├── os/                       # Kernel integration, systemd, desktop-server
├── os-code/                  # Electron installer, drivers, enterprise
├── scripts/                  # build-tauos*, configure-rootfs, deploy-*
├── release-files/            # ISO build metadata (ISOs on GitHub Releases)
├── kernel-build/
├── docs/                     # All internal documentation
├── supabase/                 # Database schemas
├── website/                  # Legacy site copies
├── TauTalkMobile/
├── developerhub/
├── infrastructure/
└── archive/                  # root-md, scripts-removed, public-internal
```

---

## 7. Execution steps

1. ✅ Generate this plan  
2. Run `scripts/execute-repo-migration.sh`  
3. Run `npm install && npm run build`  
4. Commit public changes  
5. Push `tauos` + verify Vercel  
6. Generate audit reports  

---

## 8. Rollback

Public trim uses `git rm --cached` — local files preserved.  
Private repo is additive.  
Rollback public: `git revert` migration commit.

---

## 9. Post-migration verification checklist

- [ ] `npm install`
- [ ] `npm run build`
- [ ] `scripts/vercel-prebuild-check.mjs` passes
- [ ] `/download` manifest loads
- [ ] `/tau-core/setup/` loads
- [ ] GitHub Actions deploy-vercel.yml valid
- [ ] No investor xlsx in public git
- [ ] No `target/` in public git
- [ ] taucore-internal accessible to org members only
