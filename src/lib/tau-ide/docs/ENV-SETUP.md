# Tau IDE — Environment Setup Guide

## Quick start (local development)

```bash
cd /Users/mac/Downloads/tauos
cp .env.tau-ide.example .env.local
# Edit .env.local with your DATABASE_URL and JWT_SECRET
npm install
npm run tau-ide:setup
npm run dev
```

Visit: http://localhost:3000/developers

## Required variables

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Production + cloud sync | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Min 32 chars for token signing |
| `TAU_IDE_SECRETS_KEY` | Production | Min 32 chars for secret encryption |

## Generate production secrets key

```bash
openssl rand -hex 32
```

Add to `.env.local` or production environment:

```
TAU_IDE_SECRETS_KEY=<output>
```

## Verify setup

```bash
npm run tau-ide:setup
curl -s http://localhost:3000/api/tau-ide/status | python3 -m json.tool
```

Expected: `"database": "connected"`, `"envValid": true`

## Cross-browser support

| Browser | Status |
|---------|--------|
| Chrome 120+ | ✅ Supported |
| Edge 120+ | ✅ Supported |
| Firefox 120+ | ✅ Supported |
| Safari 17+ | ✅ Supported (Monaco may need refresh on first load) |

## AI disclaimer

Tau Architect uses third-party AI providers when configured. AI-generated code should be reviewed before use. See `/legal/acceptable-use`.
