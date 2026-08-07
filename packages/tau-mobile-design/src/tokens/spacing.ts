/**
 * Tau Mobile spacing tokens — Figma 4px base grid
 */
export const tauSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  screen: 20,
  widgetGap: 16,
  statusBarVertical: 10,
  navPaddingTop: 12,
  navPaddingBottom: 8,
  fabOffsetBottom: 100,
  fabOffsetRight: 20,
  fabSize: 56,
  searchHorizontal: 16,
  searchVertical: 12,
  privacyDotSize: 8,
  privacyGap: 6,
} as const;

export type TauSpacing = typeof tauSpacing;
