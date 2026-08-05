# Cursor Implementation — Tau Website (from Figma Engineering Package)

Extracted from Figma page **24 — Engineering / Cursor Implementation** (`58:10`).

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS (design tokens in `tailwind.config.ts` + `src/lib/website/tokens.ts`)
- Framer Motion (motion tokens from Figma motion system)
- Deploy: Vercel

## Design tokens (Figma-approved)

| Token | Value |
|-------|-------|
| Background | `#0a0a0b` (homepage), `#0f0f0f` (nav solid) |
| Accent gold | `#d4af37` |
| Card | `#121214` |
| Border | `rgba(255,255,255,0.07)` |
| Muted text | `rgba(255,255,255,0.5)` |
| Font body | Geist |
| Font display | Instrument Serif (hero headlines) |
| Font brand (nav logo) | Outfit |

## Key rules

- Use design tokens for ALL values — never hardcode outside tokens file
- Server Components by default; `"use client"` only for interactivity
- Semantic HTML: header, nav, main, section, footer
- WCAG 2.1 AA; respect `prefers-reduced-motion`
- next/image for all raster images with width/height
- Do not render Figma **storyboard slate** bars in production (Scene badges)

## Build order

1. Tokens + fonts + layout primitives
2. Navigation (transparent / solid / mobile)
3. Footer
4. Homepage sections 01–11
5. Product pages (Figma pages 08–14)
6. Link verification against `routes.ts`

## Asset paths

See Figma page **23 — Engineering / Export & Assets** (`58:9`).

Local mirror: `public/website/logos/`, `public/website/images/`, `public/website/icons/`
