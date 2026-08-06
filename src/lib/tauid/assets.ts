/** Tau ID UI assets and navigation */

export const tauIdAssets = {
  brand: {
    logo: '/tauid/brand/logo.png',
  },
} as const;

export type TauIdNavId = 'dashboard' | 'profiles' | 'security' | 'settings';

export const tauIdNavItems: {
  id: TauIdNavId;
  label: string;
  href: string;
  mobileLabel: string;
}[] = [
  { id: 'dashboard', label: 'Dashboard', mobileLabel: 'Home', href: '/tauid/dashboard' },
  { id: 'profiles', label: 'Profiles', mobileLabel: 'Profiles', href: '/tauid/profiles' },
  { id: 'security', label: 'Security', mobileLabel: 'Security', href: '/tauid/security' },
  { id: 'settings', label: 'Settings', mobileLabel: 'Settings', href: '/tauid/settings' },
];

export const tauIdPageMeta: Record<TauIdNavId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Identity Control',
    subtitle: 'Your sovereign account across the Tau ecosystem.',
  },
  profiles: {
    title: 'Identity Profiles',
    subtitle: 'Separate personas for work, personal, and developer contexts.',
  },
  security: {
    title: 'Security Center',
    subtitle: 'Protect your account with verification and two-factor auth.',
  },
  settings: {
    title: 'Account Settings',
    subtitle: 'Manage your profile, email, and preferences.',
  },
};

export const tauIdConnectedApps = [
  { name: 'Tau Mail', href: '/taumail', description: 'Private email' },
  { name: 'Tau Cloud', href: '/taucloud/dashboard', description: 'Encrypted storage' },
  { name: 'Tau Talk', href: '/tautalk/chat', description: 'Secure messaging' },
  { name: 'Tau IDE', href: '/developers/dashboard', description: 'Developer workspace' },
] as const;
