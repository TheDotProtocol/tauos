/** Local Figma-exported assets for Tau AI product UI */

export const tauAiAssets = {
  brand: {
    /** Full Tau AI lockup from Figma (emblem + wordmark + tagline) */
    logoLockup: '/tau-ai-app/brand/logo-lockup.png',
    /** Circular emblem only — sidebar, chat avatar */
    logoEmblem: '/tau-ai-app/brand/logo-emblem.png',
    /** @deprecated use logoLockup — old export was a full-page screenshot */
    logo: '/tau-ai-app/brand/logo-lockup.png',
    logoMini: '/tau-ai-app/brand/logo-emblem.png',
  },
  avatars: {
    /** Fallback only when user has no Tau ID avatar */
    defaultUser: '/tau-ai-app/avatars/user-sidebar.png',
  },
  welcome: {
    glowBackdrop: '/tau-ai-app/welcome/glow-backdrop.png',
  },
  icons: {
    home: '/tau-ai-app/icons/home.svg',
    messageCircle: '/tau-ai-app/icons/message-circle.svg',
    grid: '/tau-ai-app/icons/grid.svg',
    folder: '/tau-ai-app/icons/folder.svg',
    cpu: '/tau-ai-app/icons/cpu.svg',
    layers: '/tau-ai-app/icons/layers.svg',
    database: '/tau-ai-app/icons/database.svg',
    settings: '/tau-ai-app/icons/settings.svg',
    search: '/tau-ai-app/icons/search.svg',
    bell: '/tau-ai-app/icons/bell.svg',
    file: '/tau-ai-app/icons/file.svg',
    pin: '/tau-ai-app/icons/pin.svg',
    research: '/tau-ai-app/icons/research.svg',
    analyse: '/tau-ai-app/icons/analyse.svg',
    write: '/tau-ai-app/icons/write.svg',
    brainstorm: '/tau-ai-app/icons/brainstorm.svg',
    pen: '/tau-ai-app/icons/pen.svg',
    terminal: '/tau-ai-app/icons/terminal.svg',
    chartColumn: '/tau-ai-app/icons/chart-column.svg',
    globe: '/tau-ai-app/icons/globe.svg',
    share: '/tau-ai-app/icons/share.svg',
    download: '/tau-ai-app/icons/download.svg',
    link: '/tau-ai-app/icons/link.svg',
    cpuReasoning: '/tau-ai-app/icons/cpu-reasoning.svg',
    chevronDown: '/tau-ai-app/icons/chevron-down.svg',
    paperclip: '/tau-ai-app/icons/paperclip.svg',
    mic: '/tau-ai-app/icons/mic.svg',
    arrowUp: '/tau-ai-app/icons/arrow-up.svg',
    sparkle: '/tau-ai-app/icons/sparkle.svg',
    shield: '/tau-ai-app/icons/shield.svg',
    statusOnline: '/tau-ai-app/icons/status-online.svg',
    toggleOn: '/tau-ai-app/icons/toggle-on.svg',
    toggleOff: '/tau-ai-app/icons/toggle-off.svg',
    arrowDown: '/tau-ai-app/icons/arrow-down.svg',
    dividerLine: '/tau-ai-app/icons/divider-line.svg',
    eye: '/tau-ai-app/icons/eye.svg',
    check: '/tau-ai-app/icons/check.svg',
    lock: '/tau-ai-app/icons/lock.svg',
    ringBg: '/tau-ai-app/icons/ring-bg.svg',
    ringActive: '/tau-ai-app/icons/ring-active.svg',
    ringActiveGpu: '/tau-ai-app/icons/ring-active-gpu.svg',
    globe2: '/tau-ai-app/icons/globe-2.svg',
    fileSearch: '/tau-ai-app/icons/file-search.svg',
    terminalSquare: '/tau-ai-app/icons/terminal-square.svg',
    code: '/tau-ai-app/icons/code.svg',
    plus: '/tau-ai-app/icons/plus.svg',
    developer: '/tau-ai-app/icons/developer.svg',
    zap: '/tau-ai-app/icons/zap.svg',
    radioSelected: '/tau-ai-app/icons/radio-selected.svg',
    brainCircuit: '/tau-ai-app/icons/brain-circuit.svg',
    microscope: '/tau-ai-app/icons/microscope.svg',
    micOff: '/tau-ai-app/icons/mic-off.svg',
    keyboard: '/tau-ai-app/icons/keyboard.svg',
    innerRing: '/tau-ai-app/icons/inner-ring.svg',
    copy: '/tau-ai-app/icons/copy.svg',
    emptyConv: '/tau-ai-app/icons/empty-conv.svg',
    emptyFiles: '/tau-ai-app/icons/empty-files.svg',
    emptyWorkspace: '/tau-ai-app/icons/empty-workspace.svg',
    clock: '/tau-ai-app/icons/clock.svg',
    dotsSequence: '/tau-ai-app/icons/dots-sequence.svg',
    spinner: '/tau-ai-app/icons/spinner.svg',
    triangleAlert: '/tau-ai-app/icons/triangle-alert.svg',
    alertCircle: '/tau-ai-app/icons/alert-circle.svg',
    fileX: '/tau-ai-app/icons/file-x.svg',
  },
} as const;

export type TauAiNavId =
  | 'home'
  | 'chat'
  | 'workspace'
  | 'files'
  | 'agents'
  | 'grayscale'
  | 'local-ai'
  | 'developer'
  | 'settings';

export const tauAiNavItems: Array<{
  id: TauAiNavId;
  label: string;
  href: string;
  icon: string;
  /** UI-only — no backend integration yet */
  uiOnly?: boolean;
}> = [
  { id: 'home', label: 'Home', href: '/tau-ai-app/home', icon: tauAiAssets.icons.home },
  { id: 'chat', label: 'Chat', href: '/tau-ai-app/chat', icon: tauAiAssets.icons.messageCircle },
  { id: 'workspace', label: 'Workspace', href: '/tau-ai-app/workspace', icon: tauAiAssets.icons.grid, uiOnly: true },
  { id: 'files', label: 'Files', href: '/tau-ai-app/files', icon: tauAiAssets.icons.folder, uiOnly: true },
  { id: 'agents', label: 'Agents', href: '/tau-ai-app/agents', icon: tauAiAssets.icons.cpu, uiOnly: true },
  {
    id: 'grayscale',
    label: 'Grayscale',
    href: '/tau-ai-app/grayscale',
    icon: tauAiAssets.icons.layers,
    uiOnly: true,
  },
  { id: 'local-ai', label: 'Local AI', href: '/tau-ai-app/local-ai', icon: tauAiAssets.icons.database },
  { id: 'developer', label: 'Developer', href: '/tau-ai-app/developer', icon: tauAiAssets.icons.developer, uiOnly: true },
  { id: 'settings', label: 'Settings', href: '/tau-ai-app/settings', icon: tauAiAssets.icons.settings },
];
