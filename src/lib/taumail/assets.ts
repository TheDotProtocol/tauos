/** Local Figma-exported assets for Tau Mail UI */

export const tauMailAssets = {
  brand: {
    logoIcon: '/taumail/brand/logo-icon.png',
  },
  auth: {
    glowBackdrop: '/taumail/auth/glow-backdrop.svg',
    checkmark: '/taumail/auth/checkmark.svg',
    nodesTl: '/taumail/auth/nodes-tl.svg',
    nodesBr: '/taumail/auth/nodes-br.svg',
  },
  shared: {
    line: '/taumail/shared/line.svg',
    dividerLine: '/taumail/shared/divider-line.svg',
  },
  avatars: {
    userSidebar: '/taumail/avatars/user-sidebar.png',
    userTopbar: '/taumail/avatars/user-topbar.png',
    sender1: '/taumail/avatars/sender-1.png',
    sender2: '/taumail/avatars/sender-2.png',
    sender3: '/taumail/avatars/sender-3.png',
    sender4: '/taumail/avatars/sender-4.png',
    senderLarge: '/taumail/avatars/sender-large.png',
  },
  icons: {
    chartColumn: '/taumail/icons/chart-column.svg',
    mail: '/taumail/icons/mail.svg',
    edit3: '/taumail/icons/edit-3.svg',
    calendar: '/taumail/icons/calendar.svg',
    usersRound: '/taumail/icons/users-round.svg',
    listChecks: '/taumail/icons/list-checks.svg',
    wandSparkles: '/taumail/icons/wand-sparkles.svg',
    database: '/taumail/icons/database.svg',
    settings: '/taumail/icons/settings.svg',
    bellRing: '/taumail/icons/bell-ring.svg',
    ellipseGold: '/taumail/icons/ellipse-gold.svg',
    search: '/taumail/icons/search.svg',
    ellipseStatus: '/taumail/icons/ellipse-status.svg',
    bellDot: '/taumail/icons/bell-dot.svg',
    star: '/taumail/icons/star.svg',
    paperclip: '/taumail/icons/paperclip.svg',
    arrowUpLeft: '/taumail/icons/arrow-up-left.svg',
    arrowUpRight: '/taumail/icons/arrow-up-right.svg',
    package: '/taumail/icons/package.svg',
    trash: '/taumail/icons/trash.svg',
    starOff: '/taumail/icons/star-off.svg',
    sparkles: '/taumail/icons/sparkles.svg',
    file: '/taumail/icons/file.svg',
    edit: '/taumail/icons/edit.svg',
    calendarPlus: '/taumail/icons/calendar-plus.svg',
    checkSquare: '/taumail/icons/check-square.svg',
    clock: '/taumail/icons/clock.svg',
    toggle: '/taumail/icons/toggle.svg',
    statusSuccess: '/taumail/icons/status-success.svg',
    statusDanger: '/taumail/icons/status-danger.svg',
    lock: '/taumail/icons/lock.svg',
    shieldAlert: '/taumail/icons/shield-alert.svg',
    badgeCheck: '/taumail/icons/badge-check.svg',
    send: '/taumail/icons/send.svg',
    chevronDown: '/taumail/icons/chevron-down.svg',
    xCircle: '/taumail/icons/x-circle.svg',
    bold: '/taumail/icons/bold.svg',
    italic: '/taumail/icons/italic.svg',
    underline: '/taumail/icons/underline.svg',
    strikethrough: '/taumail/icons/strikethrough.svg',
    alignLeft: '/taumail/icons/align-left.svg',
    alignCenter: '/taumail/icons/align-center.svg',
    alignRight: '/taumail/icons/align-right.svg',
    list: '/taumail/icons/list.svg',
    listOrdered: '/taumail/icons/list-ordered.svg',
    link: '/taumail/icons/link.svg',
    image: '/taumail/icons/image.svg',
    chevronLeft: '/taumail/icons/chevron-left.svg',
    chevronRight: '/taumail/icons/chevron-right.svg',
    plus: '/taumail/icons/plus.svg',
  },
} as const;

export type TauMailNavId =
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

export const tauMailNavItems: {
  id: TauMailNavId;
  label: string;
  href: string;
  icon: string;
}[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/taumail/dashboard', icon: tauMailAssets.icons.chartColumn },
  { id: 'inbox', label: 'Inbox', href: '/taumail/inbox', icon: tauMailAssets.icons.mail },
  { id: 'drafts', label: 'Drafts', href: '/taumail/drafts', icon: tauMailAssets.icons.file },
  { id: 'sent', label: 'Sent', href: '/taumail/sent', icon: tauMailAssets.icons.send },
  { id: 'spam', label: 'Spam', href: '/taumail/spam', icon: tauMailAssets.icons.shieldAlert },
  { id: 'trash', label: 'Trash', href: '/taumail/trash', icon: tauMailAssets.icons.trash },
  { id: 'compose', label: 'Compose', href: '/taumail/compose', icon: tauMailAssets.icons.edit3 },
  { id: 'calendar', label: 'Calendar', href: '/taumail/calendar', icon: tauMailAssets.icons.calendar },
  { id: 'contacts', label: 'Contacts', href: '/taumail/contacts', icon: tauMailAssets.icons.usersRound },
  { id: 'tasks', label: 'Tasks', href: '/taumail/tasks', icon: tauMailAssets.icons.listChecks },
  { id: 'ai', label: 'AI Assistant', href: '/taumail/ai', icon: tauMailAssets.icons.wandSparkles },
  { id: 'storage', label: 'Storage', href: '/taumail/storage', icon: tauMailAssets.icons.database },
  { id: 'settings', label: 'Settings', href: '/taumail/settings', icon: tauMailAssets.icons.settings },
  { id: 'notifications', label: 'Notifications', href: '/taumail/notifications', icon: tauMailAssets.icons.bellRing },
];
