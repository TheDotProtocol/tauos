/**
 * Tau Mobile shadow tokens — Figma glass + FAB elevation
 * React Native shadow* props; use via tauShadows.forPlatform()
 */
export const tauShadows = {
  widget: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fab: {
    shadowColor: 'rgba(102, 126, 234, 0.4)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  },
  nav: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export type TauShadows = typeof tauShadows;
