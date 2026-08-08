# AI-11 — Tau Ecosystem Integration

**Batch:** AI-11  
**Status:** Complete · **STOP** (await approval before AI-12)  
**Date:** 2026-08-08

---

## Objective

Make Tau Foundation v0.1 consumable by Tau ecosystem products through clean, stable integration boundaries — without moving product business logic into `packages/tau-ai/`.

## Architecture

```
                    TAU FOUNDATION (packages/tau-ai/)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
      TauMail          TauTalk       Tau Developer
        │                 │                 │
        └──────────── TauFoundationClient ──────────┘
                          ↑
              Product-specific bridges (src/lib/*)
```

**Principle:** Product → Tau Foundation. Never Tau Foundation → Product.

### Integration contract

Generic types live in `packages/tau-ai/src/ecosystem/`:

| Type | Purpose |
|------|---------|
| `EcosystemProductContext` | appId, memory scope, system preamble |
| `EcosystemChatRequest` / `EcosystemChatResult` | Chat boundary |
| `EcosystemIntegrationLevel` | Honest verification reporting |
| `EcosystemProductRegistration` | Product readiness metadata |

Server-side wiring:

| Layer | Location | Role |
|-------|----------|------|
| Foundation core | `packages/tau-ai/` | Constitution, memory, router, tools, execution |
| Ecosystem clients | `src/lib/tau-ai/ecosystem-foundation-service.ts` | Per-appId `TauFoundationClient` factory |
| Product bridges | `src/lib/taumail/foundation-bridge.ts` | Product context + system preamble |
| Registry | `src/lib/tau-ai/ecosystem-registry.ts` | Readiness + route documentation |

**Status endpoint:** `GET /api/tau-foundation/ecosystem`

---

## Product integration status

| Product | Readiness | Integration level | Route |
|---------|-----------|-------------------|-------|
| **Tau AI App** | READY | END_TO_END_VERIFIED | `/api/tau-foundation/chat` |
| **TauMail** | READY | LIVE_MODEL_VERIFIED (adapter) | `/api/taumail/ai` |
| **Tau Developer** | PARTIALLY_READY | ADAPTER_VERIFIED | `/api/tau-ide/architect` → `runAiChat` |
| **TauTalk** | NOT_READY | CONTRACT_VERIFIED | — |
| **TauCloud** | NOT_READY | CONTRACT_VERIFIED | — |
| **Tau Browser** | NOT_READY | CONTRACT_VERIFIED | — |

### TauMail (first integration)

**Existing UI preserved:** `src/components/taumail/ai/TauMailAiPage.tsx` — no duplicate AI system.

**Flow:**

```
TauMail UI → /api/taumail/ai (Tau ID auth)
         → runTauMailFoundationChat()
         → createEcosystemFoundationClient('taumail')
         → Tau Foundation pipeline
         → (fallback) runAiChat() on failure
```

**Product responsibilities (TauMail):**

- Email UI, compose/reply UX, mailbox context
- User confirmation before send
- Mail-specific system preamble (`TAUMAIL_SYSTEM_PREAMBLE`)
- Message persistence in `taumail_ai_messages`

**Foundation responsibilities:**

- Intelligence, routing, constitution, memory governance, model selection

**Verification:** `INTEGRATION_VERIFIED` / `LIVE_MODEL_VERIFIED` via `scripts/test-ecosystem-ai11.ts`  
**End-to-end with live TauMail UI:** Not verified in this batch (requires authenticated browser session + DB).

### Tau Developer

Architect route (`/api/tau-ide/architect`) continues using `runAiChat()` with project-scoped memory and phase orchestration. No rebuild required.

**Future path:** Replace `runAiChat` with `createEcosystemFoundationClient('tau-developer')` when ready — same contract, product context stays in `src/lib/tau-ide/`.

### TauTalk

Messaging product exists (`/tautalk`, `/api/tautalk/*`) but **no AI chat integration**. Contract is ready; integration deferred.

---

## Boundaries

### Authentication

- Reuse Tau ID session (`withTauMailAuth`, Tau AI App `tauFetch`)
- No second auth system for ecosystem AI
- Provider API keys never exposed to clients

### Memory

- Product memory scoped by `appId` / `productId`
- Example: *"Use concise language in my emails"* → TauMail scope
- Promotion to global Tau memory requires governed memory authority (AI-5)
- Constitution remains authoritative — memory cannot override privacy, security, or instruction hierarchy

### Tools

- TauMail may eventually expose: summarize, draft reply, search mailbox, categorize
- AI-11 does **not** authorize external side effects automatically
- Draft email ≠ send email (AI-6 / AI-7)

### Execution

- External side effects require confirmation (AI-7)
- Mail preamble explicitly states: cannot send/delete/modify emails

---

## Legacy routes (preserved)

| Route | Status |
|-------|--------|
| `/api/tauai/chat` | Unchanged — production gateway |
| `/api/tauai/voice` | Unchanged — legacy voice |
| `/api/taumail/ai` | Foundation primary + `runAiChat` fallback |
| `/api/tau-ide/architect` | Unchanged — gateway path |

No destructive migration. No deletion of legacy implementations.

---

## Future ecosystem pattern

For any new product (Grayscale, The Brain, BIIS, etc. — **not implemented in AI-11**):

1. Add product bridge in `src/lib/<product>/foundation-bridge.ts`
2. Register in `ecosystem-registry.ts`
3. Use `createEcosystemFoundationClient('<appId>')`
4. Keep product UI/workflows in product layer
5. Route through existing or product-specific authenticated API

---

## Verification

```bash
./scripts/verify-tau-ai-ai11.sh
```

Includes:

- AI-11 ecosystem tests
- AI-10 / AI-9 regression
- AI-7 through AI-3.4 regression
- `@tau/ai` typecheck
- Root TypeScript
- Production boundary checks
- Product isolation in `packages/tau-ai/`

### Verification levels (honest reporting)

| Level | Meaning |
|-------|---------|
| CONTRACT_VERIFIED | Types and registry defined |
| ADAPTER_VERIFIED | Client factory + bridge compile and wire |
| INTEGRATION_VERIFIED | Foundation pipeline returns response |
| LIVE_MODEL_VERIFIED | Gateway substrate responded |
| END_TO_END_VERIFIED | Full product UI + auth + DB tested |

---

## Files added / changed

- `packages/tau-ai/src/ecosystem/` — integration contract types
- `src/lib/tau-ai/ecosystem-foundation-service.ts`
- `src/lib/tau-ai/ecosystem-registry.ts`
- `src/lib/taumail/foundation-bridge.ts`
- `src/app/api/taumail/ai/route.ts` — Foundation + legacy fallback
- `src/app/api/tau-foundation/ecosystem/route.ts`
- `scripts/test-ecosystem-ai11.ts`
- `scripts/verify-tau-ai-ai11.sh`

---

## STOP

AI-11 complete. Do not proceed to AI-12, AI-13, or TF-0 without approval.
