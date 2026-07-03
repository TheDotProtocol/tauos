# TauOS Website — Design Decision (GitHub repos)

Compared on **2026-06-17** from:

- **Replit:** [TheDotProtocol/Website-Redesign-tau-replit](https://github.com/TheDotProtocol/Website-Redesign-tau-replit)
- **Emergent:** [TheDotProtocol/tauos-emergent](https://github.com/TheDotProtocol/tauos-emergent)

---

## Verdict: **Use Replit as the base**

Both repos implement the **same** luxury gold “TAU CORE™” landing page (11 sections). They are not two different designs — they are two builds of the same brief.

| | Replit | Emergent |
|--|--------|----------|
| **Stack** | Vite + React + **TypeScript** + pnpm monorepo | CRA + craco + JavaScript |
| **Landing sections** | ✅ All 11 (Hero → Open Letter) | ✅ All 11 (same structure) |
| **Legal pages** | ❌ None yet | ✅ Privacy, Terms, Security |
| **Brand** | Gold `#FFD700`, Space Grotesk | Gold `#FFD700`, Cabinet Grotesk |
| **Effects** | Canvas particles, custom cursor | CursorGlow, ParticleField, grain |
| **Backend** | API workspace (extensible) | Python waitlist API + tests |
| **Third-party deps** | Replit Vite plugins (dev only) | Emergent badge, visual-edits SDK, emergent.sh scripts |
| **Merge to Next.js** | ✅ Easier (TS, modern Tailwind v4) | ⚠️ Harder (CRA, Emergent lock-in) |
| **Branding cleanup** | Meta tags + 3 vite plugins | Badge in HTML, craco visual-edits, sitemap URLs |

**Replit wins on engineering.** Emergent wins on legal pages and has slightly richer motion polish.

---

## Integration plan

1. **Base:** `sources/replit/artifacts/tau-website/` → migrate into root Next.js `src/app/`
2. **Port from Emergent:**
   - `pages/Privacy.jsx`, `Terms.jsx`, `Security.jsx`, `LegalLayout.jsx`
   - `design_guidelines.json` → update `design-system/tauos-tokens.css` (gold palette)
   - `components/effects/CursorGlow.jsx`, `ParticleField.jsx` if preferred over Replit canvas
3. **Keep from existing TauOS repo:**
   - `/download`, `/beta`, manifest, docs viewer (`public/docs/`)
   - App dashboards (TauMail, TauCloud, etc.)
4. **Strip branding:**
   - Replit: remove `@replit/*` vite plugins, fix `index.html` meta
   - Emergent: remove badge, `emergent-main.js`, `@emergentbase/visual-edits`
5. **One design system:** gold `#FFD700` on black — apply to desktop-ui + apps

---

## Note on local `newebsite/`

The older folder in the repo root uses **cyan `#00FFD1` + Kode Mono** — a *different* design from both GitHub repos. Do **not** mix it with the new TAU CORE gold theme unless you explicitly choose that look instead.

---

## Sources in this folder

```
sources/replit/     ← primary (Website-Redesign-tau-replit)
sources/emergent/   ← port legal pages + effects from here
design-system/      ← unified tokens (update to gold theme)
documents/          ← docs catalog + markdown + PDFs
```
