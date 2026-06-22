# TauOS Website — Replit Redesign (Canonical UI Base)

This folder is the **official TauOS marketing site** based on:

[TheDotProtocol/Website-Redesign-tau-replit](https://github.com/TheDotProtocol/Website-Redesign-tau-replit)

No Emergent or legacy design merge — Replit is the single source of truth for UI.

## What’s included

- Full TAU CORE™ landing page (11 sections)
- Gold-on-black design system (Space Grotesk / Space Mono)
- **Logo** from legacy site: `public/brand/tauos-logo.svg`
- **Content** from legacy site: `src/content/site.ts` (mission, ecosystem, footer links)

## Run locally

```bash
cd website-replit
npm install
npm run dev
```

Open http://localhost:5173

## Project role

This redesign is the **UI foundation for the entire TauOS suite**:

1. Marketing site (this folder → eventually root Next.js or Vercel deploy)
2. App dashboards (TauMail, TauCloud, etc.) — apply same tokens & components
3. Desktop UI in the OS — align colors/fonts with `src/index.css` variables

## Documents

Legal HTML, PDF guides, and markdown docs live in repo `public/documents/` and `public/docs/`. Footer links point to those paths on tauos.org.

## Next steps

- [ ] Add routing for `/download`, `/beta`, `/docs` (or proxy to Next.js app)
- [ ] Apply design tokens to `public/desktop-ui/` and app pages
- [ ] Single production deploy when integration is complete
