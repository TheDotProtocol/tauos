import type { TauMailFolder } from '@tau/taumail-mobile-client';
import type { TauMailIconName } from '../components/iconSources';

export type TauMailMobileNavId =
  | 'dashboard'
  | 'inbox'
  | 'drafts'
  | 'sent'
  | 'spam'
  | 'trash'
  | 'compose'
  | 'calendar'
  | 'contacts'
  | 'tasks'
  | 'ai'
  | 'storage'
  | 'settings'
  | 'notifications';

type MailFolderNav = {
  kind: 'folder';
  folder: TauMailFolder;
  title: string;
};

type ScreenNav = {
  kind: 'screen';
  screen:
    | 'Dashboard'
    | 'Settings'
    | 'AiAssistant'
    | 'Compose'
    | 'Calendar'
    | 'Contacts'
    | 'Tasks'
    | 'Notifications'
    | 'Storage';
  title?: string;
};

export type TauMailMobileNavItem = {
  id: TauMailMobileNavId;
  label: string;
  icon: TauMailIconName;
  target: MailFolderNav | ScreenNav;
};

/** Sidebar order and labels aligned with web `tauMailNavItems` (Figma v1.0). */
export const tauMailMobileNavItems: TauMailMobileNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'chartColumn', target: { kind: 'screen', screen: 'Dashboard' } },
  { id: 'inbox', label: 'Inbox', icon: 'mail', target: { kind: 'folder', folder: 'inbox', title: 'Inbox' } },
  { id: 'drafts', label: 'Drafts', icon: 'file', target: { kind: 'folder', folder: 'drafts', title: 'Drafts' } },
  { id: 'sent', label: 'Sent', icon: 'send', target: { kind: 'folder', folder: 'sent', title: 'Sent' } },
  { id: 'spam', label: 'Spam', icon: 'shieldAlert', target: { kind: 'folder', folder: 'spam', title: 'Spam' } },
  { id: 'trash', label: 'Trash', icon: 'trash', target: { kind: 'folder', folder: 'trash', title: 'Trash' } },
  { id: 'compose', label: 'Compose', icon: 'edit', target: { kind: 'screen', screen: 'Compose' } },
  { id: 'calendar', label: 'Calendar', icon: 'calendar', target: { kind: 'screen', screen: 'Calendar' } },
  { id: 'contacts', label: 'Contacts', icon: 'usersRound', target: { kind: 'screen', screen: 'Contacts' } },
  { id: 'tasks', label: 'Tasks', icon: 'listChecks', target: { kind: 'screen', screen: 'Tasks' } },
  { id: 'ai', label: 'AI Assistant', icon: 'wandSparkles', target: { kind: 'screen', screen: 'AiAssistant' } },
  { id: 'storage', label: 'Storage', icon: 'database', target: { kind: 'screen', screen: 'Storage' } },
  { id: 'settings', label: 'Settings', icon: 'settings', target: { kind: 'screen', screen: 'Settings' } },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'bellRing',
    target: { kind: 'screen', screen: 'Notifications' },
  },
];

export const folderTitles: Record<TauMailFolder, string> = {
  inbox: 'Inbox',
  drafts: 'Drafts',
  sent: 'Sent',
  spam: 'Spam',
  trash: 'Trash',
};
