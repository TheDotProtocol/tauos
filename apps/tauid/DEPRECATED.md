# Deprecated — Tau ID Express backend

The legacy Express backend that previously lived here has been **retired**.

All Tau ID authentication, registration, 2FA, OAuth, and session management now runs in the main Next.js app:

- `src/app/api/tauid/**`
- `src/app/api/auth/**`
- `src/lib/tau-session.ts`
- `src/lib/oauth/**`

Do not deploy or run the old Vercel Express bundle. Use `npm run dev` / Vercel deployment of the root Next.js project instead.
