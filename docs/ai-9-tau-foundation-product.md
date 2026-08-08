# AI-9 — Tau Foundation v0.1 Product Assembly + Figma Implementation

**Milestone:** AI-9 — Complete  
**Status:** Figma UI + Tau ID SSO + product tests  
**Verification:** `./scripts/verify-tau-ai-ai9.sh`

---

## Summary

All desktop Figma screens imported, Tau ID login/SSO wired, real user profile in sidebar, marketing **Try Tau AI** → product app, and product tests added.

**Entry flow:** `/tauai` → Try Tau AI → `/tau-ai-app/welcome` → `/tau-ai-app/auth` → `/tau-ai-app/home`

**Dev preview:** [http://localhost:3000/tau-ai-app/welcome](http://localhost:3000/tau-ai-app/welcome)

Production path **unchanged:** `/api/tauai/chat` → `runAiChat()`.

---

## Product flow (implemented)

```
MARKETING (/tauai)
  ↓ Try Tau AI
/tau-ai-app/welcome  (public)
  ↓ Get Started
/tau-ai-app/auth     (Tau ID login, OAuth, 2FA)
  ↓ session cookies + profile
/tau-ai-app/home     (protected — all app routes)
  ↓
POST /api/tau-foundation/chat  (requires Tau ID session)
  ↓
TauFoundationClient → TauFoundationPipeline → substrates
```

Third-party models remain **substrates** — not renamed as Tau-owned models.

---

## Batch 1 deliverables

| Area | Files |
|------|-------|
| Design tokens | `src/lib/tau-ai-app/tokens.ts`, `assets.ts` |
| Figma assets | `public/tau-ai-app/` |
| App shell | `src/components/tau-ai-app/shared/` |
| Screens | welcome, home, chat + placeholder routes |
| Product API | `src/app/api/tau-foundation/chat/route.ts` |
| Server wiring | `src/lib/tau-ai-app/foundation-service.ts` |
| Browser client | `src/lib/tau-ai-app/api-client.ts` |
| TF track interfaces | `packages/tau-ai/src/model-track/` |
| Verify | `scripts/verify-tau-ai-ai9.sh` |

---

## Integration boundaries (UI-only)

| Feature | Status |
|---------|--------|
| Chat composer → Foundation API | **Wired** (auth required) |
| Tau ID login / SSO | **Wired** — email, OAuth, 2FA, session cookies |
| User profile (name, avatar) | **Live** from `/api/tauid/user/profile` |
| Share / Export PDF | UI only |
| Attachments / Voice input buttons | UI only |
| Reasoning accordion (demo) | UI only — hidden after live chat |
| Workspace / Files / Agents | UI screens — demo data |
| Grayscale project | UI only — separate product, no ATHENA |
| Voice / Search / History | UI + demo data — backend pending |
| Developer API keys | UI only |
| Model selection | Substrate-aware labels — not Tau-owned weights |
| Local AI / Settings | Implemented (batch 2) |
| Pinned knowledge / ecosystem nodes | Demo data |
| `tau-foundation` substrate | `NOT_CONFIGURED` — no fake weights |

---

## Tau Foundation Model track

Interfaces only (`packages/tau-ai/src/model-track/`). TF-0 through TF-10 defined; **none executed**. See `docs/tau-foundation-model-track.md`.

---

## Batch 3 deliverables

| Screen | Figma | Route |
|--------|-------|-------|
| Conversation History | `11:120` | `/tau-ai-app/chat/history` |
| Model Selection | `11:298` | `/tau-ai-app/chat/models` + modal |
| Voice | `11:464` | `/tau-ai-app/chat/voice` + overlay |
| Search & Knowledge | `11:542` | `/tau-ai-app/search` |
| Developer | `2:1439` | `/tau-ai-app/developer` |
| Project Grayscale | `2:1668` | `/tau-ai-app/grayscale` |
| Empty / Loading / Error | `11:664`–`741` | `/tau-ai-app/states/*` |
| Screen Index | — | `/tau-ai-app/screens` |

**Complete:** Tau ID SSO + product tests.

## SSO + auth (complete)

| Item | Implementation |
|------|----------------|
| Login screen | `/tau-ai-app/auth` |
| Session provider | `src/lib/tau-ai-app/session-context.tsx` |
| Route protection | Public: welcome, auth. All other routes require session |
| Profile | Name + avatar from Tau ID profile API |
| Sign out | Sidebar button → clears session |
| OAuth | Google + GitHub via `TauIdOAuthButtons` |
| API auth | `tauFetch` on chat/substrate clients; foundation chat 401 without session |

## Product tests

```bash
npx tsx scripts/test-tau-ai-product.ts   # 20+ structural checks
./scripts/verify-tau-ai-ai9.sh           # full AI-9 + AI-8 regression
```

---

## Batch 2 (complete)

- Auth screen (`2:1621`)
- Settings (`2:1122`) pixel implementation
- Local AI (`2:1273`) + substrate status from gateway registry
- Workspace, Files, Agents full Figma screens
- New conversation (`11:6`)

---
