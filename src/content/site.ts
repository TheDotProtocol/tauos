/**
 * TAU CORE™ site copy — canonical Replit redesign + Tau Core Inc. branding.
 * Logo assets: /public/brand/tauos-logo.svg and tauos-logo.png
 */
export const site = {
  name: 'TAU CORE',
  brand: 'TAU CORE™',
  tagline: 'Privacy First. AI Native. Built For Humanity.',
  description:
    'The next generation operating system designed for people who want power, privacy, intelligence and freedom.',
  mission:
    'Tau Core powers an interconnected ecosystem designed to work flawlessly while keeping your data strictly yours.',
  company: 'Tau Core Inc.',
  copyright: `© ${new Date().getFullYear()} Tau Core Inc. All rights reserved.`,
  siteUrl: 'https://www.tauos.org',
  supportEmail: 'support@tauos.org',

  nav: [
    { label: 'OS', href: '#os' },
    { label: 'Mobile', href: '#mobile' },
    { label: 'AI', href: '#ai' },
    { label: 'Developers', href: '#developers' },
    { label: 'Enterprise', href: '#enterprise' },
  ],

  cta: {
    primary: { label: 'Explore Tau OS', href: '#os' },
    secondary: { label: 'Download Developer Preview', href: '/download' },
    nav: { label: 'Download Preview', href: '/download' },
  },

  footer: {
    blurb: 'Privacy-first, AI-native operating system ecosystem built for humanity.',
    products: [
      { label: 'Tau OS', href: '/download' },
      { label: 'TauTalk', href: '/tautalk' },
      { label: 'Tau Mail', href: '/taumail' },
      { label: 'Tau Cloud', href: '/taucloud' },
      { label: 'Tau AI', href: '/tauai' },
    ],
    developers: [
      { label: 'Documentation', href: '/docs' },
      { label: 'SDK', href: '/developers' },
      { label: 'CLI', href: '/developers' },
      { label: 'APIs', href: '/docs' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy', href: '/legal/privacy' },
    ],
  },
} as const;

export type SiteContent = typeof site;
