/** Figma-exported assets for Tau Cloud UI */

export const tauCloudAssets = {
  brand: {
    logo: '/taucloud/brand/logo.png',
  },
  avatars: {
    defaultUser: '/taucloud/avatars/default-user.png',
  },
  images: {
    heroBanner: '/taucloud/images/hero-banner.png',
    sampleRender: '/taucloud/images/sample-render.jpg',
  },
  icons: {
    layoutDashboard: '/taucloud/icons/layout-dashboard.svg',
    folderOpen: '/taucloud/icons/folder-open.svg',
    history: '/taucloud/icons/history.svg',
    chartNetwork: '/taucloud/icons/chart-network.svg',
    trash2: '/taucloud/icons/trash-2.svg',
    settings: '/taucloud/icons/settings.svg',
    logOut: '/taucloud/icons/log-out.svg',
    syncIndicator: '/taucloud/icons/sync-indicator.svg',
    bell: '/taucloud/icons/bell.svg',
    search: '/taucloud/icons/search.svg',
    upload: '/taucloud/icons/upload.svg',
    folderPlus: '/taucloud/icons/folder-plus.svg',
    file: '/taucloud/icons/file.svg',
    fileDoc: '/taucloud/icons/file-doc.svg',
    fileArchive: '/taucloud/icons/file-archive.svg',
    fileVideo: '/taucloud/icons/file-video.svg',
    star: '/taucloud/icons/star.svg',
    starOff: '/taucloud/icons/star-off.svg',
  },
} as const;

export type TauCloudNavId =
  | 'dashboard'
  | 'files'
  | 'recent'
  | 'shared'
  | 'trash'
  | 'settings'
  | 'search'
  | 'upload'
  | 'storage'
  | 'activity'
  | 'sharing';

export const tauCloudNavItems: {
  id: TauCloudNavId;
  label: string;
  href: string;
  icon: string;
}[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/taucloud/dashboard', icon: tauCloudAssets.icons.layoutDashboard },
  { id: 'files', label: 'Files', href: '/taucloud/files', icon: tauCloudAssets.icons.folderOpen },
  { id: 'recent', label: 'Recent', href: '/taucloud/recent', icon: tauCloudAssets.icons.history },
  { id: 'shared', label: 'Shared', href: '/taucloud/shares', icon: tauCloudAssets.icons.chartNetwork },
  { id: 'trash', label: 'Trash', href: '/taucloud/trash', icon: tauCloudAssets.icons.trash2 },
  { id: 'settings', label: 'Settings', href: '/taucloud/settings', icon: tauCloudAssets.icons.settings },
];

export const tauCloudPageMeta: Record<
  TauCloudNavId | 'preview',
  { title: string; subtitle: string }
> = {
  dashboard: { title: 'Secure Space Control', subtitle: 'Secure. Sync. Empower.' },
  files: { title: 'File Repository', subtitle: 'Browse, search and filter raw storage items.' },
  recent: { title: 'Recent Activity', subtitle: 'View and search quantum-synced files that you recently opened or modified.' },
  shared: { title: 'Shared Vaults', subtitle: 'Collaborative folders and secure share links.' },
  trash: { title: 'Trash Bin', subtitle: 'Recover or permanently delete removed vault items.' },
  settings: { title: 'System Settings', subtitle: 'Manage profile, security, and storage preferences.' },
  search: { title: 'AI Search', subtitle: 'Semantic search across your encrypted vault.' },
  upload: { title: 'Upload Center', subtitle: 'Ingest files into your secure vault.' },
  storage: { title: 'Storage Usage', subtitle: 'Monitor allocation across your quantum vault.' },
  activity: { title: 'Activity Log', subtitle: 'Real-time sync and authorization events.' },
  sharing: { title: 'Sharing Controls', subtitle: 'Manage links, permissions, and workspace invites.' },
  preview: { title: 'File Preview', subtitle: 'Inspect vault item metadata and contents.' },
};
