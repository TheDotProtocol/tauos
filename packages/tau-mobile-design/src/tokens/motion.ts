/**
 * Tau Mobile motion tokens — Figma interaction timing
 */
export const tauMotion = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    privacyPulse: 2000,
  },
  easing: {
    standard: 'ease-in-out' as const,
    spring: {
      damping: 15,
      stiffness: 150,
    },
  },
  scale: {
    fabPress: 0.95,
    fabHover: 1.1,
  },
} as const;

export type TauMotion = typeof tauMotion;
