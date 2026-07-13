# Phase 1 — Tau Cloud (Supabase Storage)

Production file storage for Tau Cloud using Supabase Storage + PostgreSQL metadata.

## What shipped

- **Supabase-backed uploads** — files stored in `taucloud-files` bucket
- **Database tables** — `taucloud_files`, `taucloud_shares`, user quota columns
- **API routes** — upload, list, delete, download, share, profile, public shared viewer
- **SSO auth** — Tau Cloud login/register issue 7-day SSO tokens (works across TAU CORE apps)
- **Dashboard** — real file list, upload, download, delete, share link creation

## Setup (one-time)

```bash
# Ensure .env.local has DATABASE_URL + Supabase vars
npm run storage:setup   # bucket (if not done in Phase 0)
npm run cloud:setup     # DB tables + quota columns
```

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL (Supabase pooler) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Storage admin access |
| `SUPABASE_STORAGE_BUCKET` | `taucloud-files` |
| `NEXT_PUBLIC_APP_URL` | Share link base URL |

## API

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/taucloud/files/upload` | Bearer |
| GET | `/api/taucloud/files/list?folder=root` | Bearer |
| DELETE | `/api/taucloud/files/delete` | Bearer |
| GET | `/api/taucloud/files/download?id=` | Bearer |
| POST | `/api/taucloud/files/share` | Bearer |
| GET | `/api/taucloud/profile` | Bearer |
| GET | `/api/taucloud/shared/[token]` | Public |
| POST | `/api/taucloud/shared/[token]` | Public (signed download URL) |

## Default quota

5 GB per user (`storage_quota` column, overridable per user).

## Test locally

1. Register at `/taucloud`
2. Open `/taucloud/dashboard`
3. Upload a file → appears in list
4. Download, share (copy link), delete
5. Open share link at `/taucloud/shared/[token]`
