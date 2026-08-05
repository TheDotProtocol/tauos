import { websiteRoutes } from '@/lib/website/routes';

export type MegaMenuItem = {
  label: string;
  description: string;
  href: string;
  icon: string;
};

export type MegaMenuColumn = {
  title: string;
  items: MegaMenuItem[];
};

/** Figma 31:140 — Products mega menu columns */
export const productsMegaMenuColumns: MegaMenuColumn[] = [
  {
    title: 'Software',
    items: [
      { label: 'Tau Mail', description: 'End-to-end encrypted sovereign messaging', href: websiteRoutes.tauMail, icon: '/website/icons/mega-menu/mail.svg' },
      { label: 'Tau Cloud', description: 'Decentralized consensus computation', href: websiteRoutes.tauCloud, icon: '/website/icons/mega-menu/cloud.svg' },
      { label: 'Tau Talk', description: 'P2P voice and video streaming', href: websiteRoutes.tauTalk, icon: '/website/icons/mega-menu/talk.svg' },
      { label: 'Tau Browser', description: 'Privacy-focused dApp gatekeeper', href: websiteRoutes.tauBrowser, icon: '/website/icons/mega-menu/browser.svg' },
      { label: 'Tau AI', description: 'Localized zero-knowledge neural model', href: websiteRoutes.tauAi, icon: '/website/icons/mega-menu/ai.svg' },
      { label: 'Tau ID', description: 'Sovereign cryptographic fingerprint', href: websiteRoutes.tauId, icon: '/website/icons/mega-menu/id.svg' },
    ],
  },
  {
    title: 'Developer',
    items: [
      { label: 'Tau Developer', description: 'Native smart contract compiler suite', href: websiteRoutes.developer, icon: '/website/icons/mega-menu/developer.svg' },
      { label: 'Project Grayscale', description: 'High-throughput emulator shell', href: websiteRoutes.projectGrayscale, icon: '/website/icons/mega-menu/grayscale.svg' },
    ],
  },
  {
    title: 'Hardware',
    items: [
      { label: 'Tau Phone', description: 'Pure hardware consensus mobile node', href: websiteRoutes.tauPhone, icon: '/website/icons/mega-menu/phone.svg' },
      { label: 'Tau Book Pro', description: 'Asymmetric secure system workstation', href: websiteRoutes.tauBookPro, icon: '/website/icons/mega-menu/book.svg' },
      { label: 'Tau Tablet', description: 'Tablet optimized for decentralized design', href: '/products/tau-tablet', icon: '/website/icons/mega-menu/tablet.svg' },
      { label: 'Tau Watch', description: 'Biometric hardware signer', href: '/products/tau-watch', icon: '/website/icons/mega-menu/watch.svg' },
      { label: 'Tau Glass', description: 'Augmented dApp layer HUD glasses', href: '/products/tau-glass', icon: '/website/icons/mega-menu/glass.svg' },
    ],
  },
  {
    title: 'Marketplace',
    items: [
      { label: 'Tau Store', description: 'Curated dApps and verified hardware', href: websiteRoutes.tauStore, icon: '/website/icons/mega-menu/store.svg' },
    ],
  },
];
