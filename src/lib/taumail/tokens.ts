/** Tau Mail design tokens — Figma Design Tokens Reference v1.0 */

export const tauMailTokens = {
  colors: {
    pageBase: '#070708',
    pagePrimary: '#121214',
    pageSecondary: '#1A1A1A',
    gold: '#D4A843',
    goldMuted: '#C5A028',
    goldAccent: '#A78B2A',
    goldSurface: 'rgba(212,168,67,0.08)',
    goldBorder: 'rgba(212,168,67,0.15)',
    border: 'rgba(255,255,255,0.05)',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    success: '#10B981',
  },
  layout: {
    sidebarWidth: 240,
    emailListWidth: 400,
    topBarHeight: 72,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
} as const;
