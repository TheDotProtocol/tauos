/**
 * Tau Mobile color tokens — Figma: Tau Core Mobile OS UI (SyttNz970dAe4MSnkrCxdw)
 * Launcher Home uses black + gold palette (aligned with public/tau-core/shared/tokens.css)
 */
export const tauColors = {
  /** Legacy M7.0 gradient — not used on Figma launcher home */
  background: {
    gradientStart: '#1a1a1a',
    gradientEnd: '#2a2a2a',
  },
  /** Figma Section 2 — Launcher Home */
  launcher: {
    screen: '#000000',
    searchField: '#0a0a0a',
    searchBorder: 'rgba(201, 168, 76, 0.35)',
    searchPlaceholder: '#6e6a63',
    iconCircle: '#c9a84c',
    iconGlyph: '#1c1a17',
    iconLabel: '#ffffff',
  },
  primary: {
    start: '#c9a84c',
    end: '#c9a84c',
  },
  text: {
    primary: '#ffffff',
    secondary: '#9c978f',
    muted: '#6e6a63',
  },
  surface: {
    glass: 'rgba(255, 255, 255, 0.1)',
    glassStrong: 'rgba(42, 42, 42, 0.95)',
    weatherGradientStart: 'rgba(102, 126, 234, 0.2)',
    weatherGradientEnd: 'rgba(139, 92, 246, 0.2)',
  },
  border: {
    glass: 'rgba(255, 255, 255, 0.2)',
    nav: 'rgba(255, 255, 255, 0.1)',
  },
  privacy: {
    active: '#4ade80',
  },
  semantic: {
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
  },
  shadow: {
    base: '#000000',
    fabGlow: 'rgba(201, 168, 76, 0.4)',
  },
  brand: {
    gold: '#c9a84c',
    ink: '#1c1a17',
  },
} as const;

export type TauColors = typeof tauColors;
