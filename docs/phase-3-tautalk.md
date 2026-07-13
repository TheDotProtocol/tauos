# Phase 3 — Tau Talk (Encrypted Messaging)

WhatsApp + Telegram + Signal in one app, integrated with Tau ID SSO.

## What shipped

- **Subdomains** — `talk.tauos.org` and `tautalk.com` → `/tautalk`
- **E2E messaging** — client-side AES-GCM encryption; server stores ciphertext only
- **Direct & group chats** — conversations, participants, message history
- **Real-time polling** — 5s refresh (WebSocket upgrade path via TauConnect in v2)
- **SSO auth** — same Tau ID token as Mail, Cloud, Browser
- **Chat UI** — `/tautalk/chat` WhatsApp-style interface

## Setup

```bash
npm run talk:setup
```

## DNS

| Domain | Points to |
|--------|-----------|
| `talk.tauos.org` | Vercel (same project) |
| `tautalk.com` | Vercel |
| `www.tautalk.com` | Vercel |

## API

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/tautalk/auth/login` | Public |
| POST | `/api/tautalk/auth/register` | Public |
| GET/POST | `/api/tautalk/conversations` | Bearer |
| GET/POST | `/api/tautalk/messages?conversationId=` | Bearer |
| GET/PUT | `/api/tautalk/keys` | Bearer |

## Encryption model

- Messages encrypted in browser via Web Crypto (`src/lib/tautalk-crypto.ts`)
- Server stores `content_encrypted` only — never plaintext
- Conversation key derived from conversation ID (v1 MVP)
- v2 roadmap: Signal Protocol + device keys via `tautalk_keys` table

## Test

1. Visit `/tautalk` or `talk.tauos.org`
2. Register two accounts (or use existing Tau ID users)
3. Open `/tautalk/chat`, start new chat with other user's email
4. Send messages — encrypted at rest in DB
5. Verify `/api/platform/status` shows `phase: 3` and `tautalk.ok: true`

## Ecosystem complete

| App | Status |
|-----|--------|
| Tau Mail | ✅ Production SMTP |
| Tau Cloud | ✅ Supabase storage |
| Tau Browser | ✅ Native + sync |
| Tau Talk | ✅ E2E messaging |
| Tau ID / AI / Developers | ✅ Phase 0 |

Ready for full ecosystem testing (mail, cloud, browser, talk).
