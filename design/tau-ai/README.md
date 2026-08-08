# Tau AI — Design Handoff

**Source:** [Figma — TAU AI Complete Product Design v1.0](https://www.figma.com/design/W9cEVw20QlSGkzLBUkZNL1/TAU-AI-%E2%80%94-Complete-Product-Design---Engineering-Handoff-v1.0)

**File key:** `W9cEVw20QlSGkzLBUkZNL1`

## Implemented (AI-9 Batch 1–3 — desktop)

| Screen | Figma node | Route |
|--------|------------|-------|
| Welcome | `2:6` | `/tau-ai-app/welcome` |
| Auth | `2:1621` | `/tau-ai-app/auth` |
| Home | `2:45` | `/tau-ai-app/home` |
| New Chat | `11:6` | `/tau-ai-app/chat/new` |
| Chat | `2:217` | `/tau-ai-app/chat` |
| Conversation History | `11:120` | `/tau-ai-app/chat/history` |
| Model Selection | `11:298` | `/tau-ai-app/chat/models` |
| Voice | `11:464` | `/tau-ai-app/chat/voice` |
| Search & Knowledge | `11:542` | `/tau-ai-app/search` |
| Workspace | `2:480` | `/tau-ai-app/workspace` |
| Files | `2:666` | `/tau-ai-app/files` |
| Agents | `2:851` | `/tau-ai-app/agents` |
| Project Grayscale | `2:1668` | `/tau-ai-app/grayscale` |
| Local AI | `2:1273` | `/tau-ai-app/local-ai` |
| Developer | `2:1439` | `/tau-ai-app/developer` |
| Settings | `2:1122` | `/tau-ai-app/settings` |
| Empty States | `11:664` | `/tau-ai-app/states/empty` |
| Loading States | `11:693` | `/tau-ai-app/states/loading` |
| Error States | `11:741` | `/tau-ai-app/states/error` |
| Screen Index | — | `/tau-ai-app/screens` |

## Deferred (mobile/tablet shelved)

- Mobile `tau-mobile-*` (390×844)
- Tablet `tau-tablet-*`
- Component library (`11:849`), engineering package (`11:1410`)

## Design tokens

See `src/lib/tau-ai-app/tokens.ts` — extracted from Figma (Outfit, gold `#d4a843`, sidebar `#0a0a0a`, etc.).

## Assets

Exported to `public/tau-ai-app/` from Figma MCP. Re-export before URLs expire if refreshing assets.

## Product API

- **New:** `POST /api/tau-foundation/chat` → `TauFoundationClient` → `TauFoundationPipeline`
- **Unchanged:** `POST /api/tauai/chat` → `runAiChat()`
