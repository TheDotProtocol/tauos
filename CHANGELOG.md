# Tau IDE Changelog

## [1.0.0-beta.1] — Public Beta RC1 (2026)

### Release Candidate Hardening
- Connection status bar with explicit storage mode (Connected, Local, Sync Pending, Cloud Unavailable)
- No silent localStorage fallback when authenticated — users see sync failures
- Authentication required for Tau Architect API
- Rate limiting on all TauScript compute APIs and Architect
- Production environment validation (`TAU_IDE_SECRETS_KEY`, `DATABASE_URL`, JWT)
- API metrics and enhanced `/api/tau-ide/status` health endpoint
- CI pipeline (typecheck, lint, unit tests, build, schema integration)
- E2E test suite for critical workflows
- Legal links (Privacy, Terms, AUP) in developer portal sidebar
- Accessibility: skip link, ARIA labels, connection status live region

### Sprint 4 — TauScript v1.0
- Compiler pipeline, CLI, taupm, LSP, formatter, debugger, testing, docgen
- 15 stdlib modules, 10 official examples

### Sprint 3 — Infrastructure
- PostgreSQL persistence, sync, secrets, teams, jobs, knowledge graph, search

### Sprint 2 — AI Platform
- Tau Architect 8 phases, AI Gateway v2

### Sprint 1 — Platform Foundation
- Unified developer platform at `/developers`

## Known Issues (Beta)
- taupm registry uses built-in mock packages
- Compiler JS output is skeletal (interpreter is production path)
- In-memory rate limits (Redis architecture ready)
- Team collaboration API exists without full UI
- Deployment automation page is stub
