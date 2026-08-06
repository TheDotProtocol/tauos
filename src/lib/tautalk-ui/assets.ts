/** Figma / brand assets for Tau Talk web UI */

export const tauTalkAssets = {
  brand: {
    logo: '/tautalk/brand/logo.png',
    logoPrimary: '/tautalk/brand/logo-primary.png',
    icon: '/tautalk/brand/icon.png',
  },
  sounds: {
    incoming: '/sounds/tautalk-incoming.wav',
    ringback: '/sounds/tautalk-ringback.wav',
  },
} as const;

export const tauTalkRoutes = {
  home: '/tautalk',
  chat: '/tautalk/chat',
  login: '/tautalk/login?redirect=/tautalk/chat',
  download: '/download',
} as const;
