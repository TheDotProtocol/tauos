/** Tau Mail design tokens — aligned with src/lib/taumail/tokens.ts (Figma v1.0) */

export const tauMailMobileTokens = {
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
    danger: '#EF4444',
    offlineBanner: '#3F3F46',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
  typography: {
    fontFamily: 'System',
    title: 20,
    body: 16,
    caption: 13,
  },
} as const;

export type TauMailMobileTokens = typeof tauMailMobileTokens;
