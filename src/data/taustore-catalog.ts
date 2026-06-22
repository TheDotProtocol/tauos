/** Curated Tau Store catalog — real TauOS apps with live routes */
export type StoreApp = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  download_count: number;
  developer: string;
  version: string;
  privacy_score: number;
  icon_url: string;
  href: string;
  is_featured: boolean;
  featured_order: number;
  status: 'live' | 'wave2';
};

export const TAUSTORE_CATALOG: StoreApp[] = [
  {
    id: 'taumail',
    name: 'TauMail',
    description: 'Privacy-first encrypted email — web app for all platforms',
    price: 0,
    category: 'Productivity',
    rating: 4.8,
    download_count: 0,
    developer: 'Tau Foundation and Tau LLC',
    version: '1.0.0',
    privacy_score: 95,
    icon_url: '/icons/taumail-icon.svg',
    href: '/taumail',
    is_featured: true,
    featured_order: 1,
    status: 'live',
  },
  {
    id: 'taucloud',
    name: 'TauCloud',
    description: 'Encrypted cloud storage with quota controls',
    price: 0,
    category: 'Storage',
    rating: 4.7,
    download_count: 0,
    developer: 'Tau Foundation and Tau LLC',
    version: '1.0.0',
    privacy_score: 98,
    icon_url: '/icons/taucloud-icon.svg',
    href: '/taucloud',
    is_featured: true,
    featured_order: 2,
    status: 'live',
  },
  {
    id: 'tauid',
    name: 'TauID',
    description: 'Unified identity and credentials for the Tau ecosystem',
    price: 0,
    category: 'Security',
    rating: 4.9,
    download_count: 0,
    developer: 'Tau Foundation and Tau LLC',
    version: '1.0.0',
    privacy_score: 99,
    icon_url: '/icons/tauid-icon.svg',
    href: '/tauid',
    is_featured: true,
    featured_order: 3,
    status: 'live',
  },
  {
    id: 'tauscript',
    name: 'TauScript',
    description: 'Privacy-first programming language and tooling',
    price: 0,
    category: 'Developer',
    rating: 4.6,
    download_count: 0,
    developer: 'Tau Foundation and Tau LLC',
    version: '1.0.0',
    privacy_score: 97,
    icon_url: '/icons/tauscript-icon.svg',
    href: '/tauscript',
    is_featured: true,
    featured_order: 4,
    status: 'live',
  },
  {
    id: 'tau-mobile-os',
    name: 'Tau Mobile OS',
    description: 'Mobile operating system — Wave 2 release',
    price: 0,
    category: 'System',
    rating: 0,
    download_count: 0,
    developer: 'Tau Foundation and Tau LLC',
    version: '0.0.0',
    privacy_score: 99,
    icon_url: '/icons/mobile-icon.svg',
    href: '/beta',
    is_featured: false,
    featured_order: 99,
    status: 'wave2',
  },
  {
    id: 'tau-messenger',
    name: 'Tau Messenger',
    description: 'End-to-end encrypted messaging — Wave 2 release',
    price: 0,
    category: 'Communication',
    rating: 0,
    download_count: 0,
    developer: 'Tau Foundation and Tau LLC',
    version: '0.0.0',
    privacy_score: 99,
    icon_url: '/icons/messages-icon.svg',
    href: '/beta',
    is_featured: false,
    featured_order: 100,
    status: 'wave2',
  },
];
