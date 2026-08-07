/**
 * Reference device layout — Figma / Redmi Note 9 Pro baseline (1080×2400)
 * Scale UI with useResponsiveScale; do not redesign per device.
 */
export const tauLayout = {
  referenceWidth: 1080,
  referenceHeight: 2400,
  dockHeight: 60,
  launcher: {
    searchHeight: 44,
    iconSize: 56,
    iconColumns: 4,
    iconRowGap: 28,
    iconLabelGap: 8,
  },
  devices: {
    redmiNote9Pro: { width: 1080, height: 2400, label: 'Redmi Note 9 Pro' },
    vivoReference: { width: 1080, height: 2400, label: 'Vivo reference' },
    samsungMid: { width: 1080, height: 2340, label: 'Samsung mid-range' },
    samsungFlagship: { width: 1440, height: 3200, label: 'Samsung flagship' },
  },
} as const;

export type TauLayout = typeof tauLayout;
