# @tau/core — Tau Core Services Foundation (M6)

Shared service interfaces and registry for **Desktop + Mobile**.

- **Not** Tau Runtime (public app API) — that wraps these services in M7+
- **Not** Android-specific — adapters live in `adapters/`

## Structure

```
src/
  platform/     Platform kind (aosp-beta | native | desktop | web)
  common/       TauError, TauServiceBase
  interfaces/   Service contracts (12 services)
  services/     Foundation stubs + registry
  adapters/     Platform stubs (aosp, future native)
```

## Verify

```bash
cd packages/tau-core && npm install && npm run typecheck
```
