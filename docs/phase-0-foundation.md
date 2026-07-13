# Phase 0 — Platform Foundation

Completed foundation for the TAU CORE ecosystem (target: ~1 hour sprint).

## What's included

### 1. Tau ID SSO
- `src/lib/tau-auth.ts` — unified JWT issue/verify across all apps
- `src/hooks/useTauSession.ts` — shared client session hook
- `/api/auth/session` — validate token + load user
- `/api/auth/verify` — quick token check
- Tau ID login/register now issue **7-day SSO tokens**

### 2. Supabase Storage (Tau Cloud prep)
- `src/lib/supabase-storage.ts` — upload, delete, signed URLs
- `/api/storage/health` — bucket health check
- `npm run storage:setup` — create `taucloud-files` bucket

**Vercel env required:**
```
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=taucloud-files
```

### 3. Multi-model Tau AI gateway
- `src/lib/ai-gateway.ts` — OpenAI, Anthropic, Ollama, fallback
- `POST /api/tauai/chat` — authenticated chat
- `GET /api/tauai/models` — list available models
- Legacy `POST /api/tauai` delegates to gateway first

**Vercel env (at least one):**
```
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
OLLAMA_BASE_URL=...   # optional self-hosted
```

### 4. Developer portal (merged)
- `developer.tauos.org` → rewrites to `/developers/*` via middleware
- `/developers/ide` — TauStudio web IDE + TauScript REPL
- `POST /api/developers/tauscript/run`

**Vercel:** add domain alias `developer.tauos.org` → same project.

### 5. Platform health
- `GET /api/platform/status` — database, mail, storage, AI, developer checks

## Verify locally

```bash
npm run dev
curl http://localhost:3000/api/platform/status
curl http://localhost:3000/api/tauai/models
```

## Next: Phase 1 — Tau Cloud storage migration
