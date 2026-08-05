/** Tau website design tokens — from Figma Engineering / Design Tokens (page 05, 16) */

export const tauWebsite = {
  colors: {
    background: '#0a0a0b',
    backgroundNav: '#0f0f0f',
    card: '#121214',
    cardInner: '#060607',
    foreground: '#ffffff',
    muted: 'rgba(255,255,255,0.5)',
    mutedSoft: 'rgba(255,255,255,0.3)',
    border: 'rgba(255,255,255,0.07)',
    accent: '#d4af37',
    accentHover: '#e5c348',
    accentMuted: 'rgba(212,175,55,0.15)',
    accentBorder: 'rgba(212,175,55,0.25)',
    accentText: '#0a0a0b',
    success: '#22c55e',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '999px',
  },
  motion: {
    fast: 0.15,
    normal: 0.2,
    moderate: 0.3,
    cinematic: 0.8,
  },
} as const;
