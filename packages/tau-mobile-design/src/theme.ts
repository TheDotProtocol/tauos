import { tauBlur } from './tokens/blur';
import { tauColors } from './tokens/colors';
import { tauLayout } from './tokens/layout';
import { tauMotion } from './tokens/motion';
import { tauRadii } from './tokens/radii';
import { tauShadows } from './tokens/shadows';
import { tauSpacing } from './tokens/spacing';
import { tauTypography } from './tokens/typography';

/** Unified Tau Mobile design system — consume via tauTheme, never hardcode values */
export const tauTheme = {
  colors: tauColors,
  typography: tauTypography,
  spacing: tauSpacing,
  radii: tauRadii,
  shadows: tauShadows,
  motion: tauMotion,
  blur: tauBlur,
  layout: tauLayout,
} as const;

export type TauTheme = typeof tauTheme;
