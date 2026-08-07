/**
 * Tau Mobile typography tokens — Figma Home / Launcher
 */
export const tauTypography = {
  statusTime: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: '300' as const,
    lineHeight: 56,
  },
  dateDisplay: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  widgetContent: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  widgetSubtitle: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  privacyLabel: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 14,
  },
  searchPlaceholder: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  appIconLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
  appIconGlyph: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  navIcon: {
    fontSize: 20,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  fabSymbol: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  scaffoldTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  scaffoldCaption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
} as const;

export type TauTypography = typeof tauTypography;
