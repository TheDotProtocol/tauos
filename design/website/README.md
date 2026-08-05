# Tau Website — Engineering Package

**Figma source:** [The Tau Experience v1.0 — Master Creative Brief](https://www.figma.com/design/xGrzKSgFpllEhUNOAnB8CT/The-Tau-Experience-v1.0-%E2%80%93-Master-Creative-Brief)

**Scope:** Website implementation only (`/design/website/` in Figma file structure).

## Figma page map

| Page | Figma ID | Purpose |
|------|----------|---------|
| 02 — Homepage | `21:2` | 11 approved homepage sections |
| 07 — Global Navigation | `31:2` | Nav states + products mega menu |
| 08–14 — Product pages | `31:3`–`31:9` | Individual product marketing pages |
| 16–24 — Engineering | `58:2`–`58:10` | Tokens, typography, motion, Cursor handoff |

## Implementation target

Canonical codebase: `src/app/` (Next.js 14 on Vercel).

Website components: `src/components/website/`  
Assets: `public/website/`  
Route map: `src/lib/website/routes.ts`

## Rules

1. Implement approved Figma designs exactly — do not redesign.
2. Do not substitute assets — use exported Figma assets in `public/website/`.
3. Do not invent components — use Figma component library (page 15).
4. If a spec or asset is missing, stop and report.

See `CURSOR_IMPLEMENTATION.md` for stack, tokens, and build order.
