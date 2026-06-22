# Ship Tonight — Wave 1 Gate (June 2026)

**Choices locked:** Mail **A** (outbound now, inbound Wave 2) · Mobile **D** (Wave 2 label, no OS download)

## Completed in repo (this session)

- [x] OS artifacts validated (`validate-os-artifacts.sh` PASSED)
- [x] Hardcoded DB/JWT secrets removed from API routes → `src/lib/db-pool.ts`
- [x] Demo mail simulate disabled in production
- [x] Tau Store uses real curated catalog (`src/data/taustore-catalog.ts`)
- [x] `/download` page on `website-replit` with manifest + SHA256
- [x] Mobile section labeled **Wave 2**
- [x] Copyright 2026 footers

## Before Vercel / GitHub push (you run)

### 1. Environment (Vercel → tauos project)
```
DATABASE_URL=
JWT_SECRET=
JWT_SECRET_TAUMAIL=
JWT_SECRET_TAUCLOUD=
JWT_SECRET_TAUID=
SENDGRID_API_KEY=
UPSTASH_REDIS_REST_URL=   (if using sessions)
UPSTASH_REDIS_REST_TOKEN=
```

### 2. OS gate (15–30 min)
```bash
cd /Users/mac/Downloads/tauos
./scripts/validate-os-artifacts.sh
./scripts/run-release-tests.sh          # optional QEMU smoke
# Upload ISO to GitHub Release beta-1.0.0 if not already:
#   release-files/TauOS-Desktop-v1.0.0.iso
#   SHA256: 8f7f8c8ebf59b5ceabf34e06f7088200580a5d500fcbd7c852512db613d8bf2f
```

### 3. Mail (outbound only — A)
- [ ] SendGrid API key in Vercel
- [ ] Send test from Tau Mail → external inbox
- [ ] Inbound: Wave 2 (SendGrid parse or Vultr)

### 4. Website deploy
- **Marketing:** `website-replit` → Vercel (or merge into main deploy)
- **Apps/API:** root Next.js `src/app` → existing tauos Vercel project
- [ ] `/download` loads manifest
- [ ] `/api/health` returns healthy with env set

### 5. Smoke test (new user path)
1. Open tauos.org → Download ISO
2. Register at /tauid
3. Send mail from /taumail
4. Boot ISO in QEMU or USB (live session)

### 6. Explicitly NOT in Wave 1
- Mobile OS download
- Mail inbound
- Tau Messenger
- Forgejo / TauStudio binaries
- Hardware test matrix at scale

## After ship
- Wave 2: Replit-style uniform UI for all apps
- Wave 2: Mail inbound + Cloud Supabase Storage
- Wave 3: Developer platform binaries
