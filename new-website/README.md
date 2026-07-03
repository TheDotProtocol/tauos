# TauOS New Website

**Canonical redesign:** [Website-Redesign-tau-replit](https://github.com/TheDotProtocol/Website-Redesign-tau-replit)

Working copy: [`../website-replit/`](../website-replit/)

## Policy

- **Use Replit only** — no Emergent merge, no legacy cyan/Kode Mono theme
- **Logo + copy** from the old tauos.org site (`src/content/site.ts`, `public/brand/`)
- Replit design = UI base for website, apps, and desktop shell

## Folders

| Path | Purpose |
|------|---------|
| `../website-replit/` | Standalone Vite site (primary) |
| `sources/replit/` | Upstream GitHub clone (reference) |
| `sources/emergent/` | Archived — not used |
| `design-system/` | Shared CSS tokens (gold TAU CORE) |
| `documents/` | Doc catalog + markdown/PDF staging |

## Documents (public)

Synced to repo root `public/`:

- `public/documents/legal/` — HTML policies
- `public/documents/guides/` — PDF / Excel downloads
- `public/docs/` — Markdown for doc viewer
- `public/documents/manifest.json` — index

See [DECISION.md](./DECISION.md) for the original comparison (Replit chosen).
