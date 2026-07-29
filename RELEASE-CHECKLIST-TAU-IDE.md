# Tau IDE Public Beta — Release Checklist

## Pre-release
- [ ] `npm run build` passes
- [ ] `npm run tau-ide:test:unit` passes
- [ ] `npm run tau-ide:test:e2e` passes (with dev server running)
- [ ] `npm run tau-ide:setup` run against production database
- [ ] All env vars set per `.env.tau-ide.example`
- [ ] `TAU_IDE_SECRETS_KEY` set (production)
- [ ] AI provider key configured
- [ ] Legal pages linked and reviewed

## Git
- [ ] Tag: `tau-ide-v1.0.0-beta.1`
- [ ] Branch: `release/tau-ide-1.0` merged to `main`
- [ ] CHANGELOG-TAU-IDE.md updated

## Deploy
- [ ] Deploy to production (Vercel/host)
- [ ] Verify `/api/tau-ide/status` shows `database: connected`
- [ ] Verify login → create project → workspace save
- [ ] Verify Tau Architect with auth
- [ ] Verify TauScript REPL

## Post-release
- [ ] Monitor error rates via status endpoint
- [ ] Collect beta feedback
- [ ] Document known issues

## Branches
| Branch | Purpose |
|--------|---------|
| `main` | Stable production |
| `beta/tau-ide` | Beta integration |
| `release/tau-ide-1.0` | Release candidate |
