/** Tau AI product screen registry — Figma handoff index */

export type TauAiScreenEntry = {
  name: string;
  figmaNode: string;
  route: string;
  batch: 1 | 2 | 3;
  status: 'implemented' | 'ui-only' | 'deferred';
  note?: string;
};

export const TAU_AI_SCREENS: TauAiScreenEntry[] = [
  { name: 'Welcome', figmaNode: '2:6', route: '/tau-ai-app/welcome', batch: 1, status: 'implemented' },
  { name: 'Authentication', figmaNode: '2:1621', route: '/tau-ai-app/auth', batch: 2, status: 'implemented', note: 'Tau ID login + OAuth wired' },
  { name: 'Home', figmaNode: '2:45', route: '/tau-ai-app/home', batch: 1, status: 'implemented' },
  { name: 'New Conversation', figmaNode: '11:6', route: '/tau-ai-app/chat/new', batch: 2, status: 'implemented' },
  { name: 'Chat', figmaNode: '2:217', route: '/tau-ai-app/chat', batch: 1, status: 'implemented' },
  { name: 'Conversation History', figmaNode: '11:120', route: '/tau-ai-app/chat/history', batch: 3, status: 'implemented', note: 'Demo data — persistence pending' },
  { name: 'Model Selection', figmaNode: '11:298', route: '/tau-ai-app/chat/models', batch: 3, status: 'implemented', note: 'Substrate labels — not Tau-owned weights' },
  { name: 'Voice', figmaNode: '11:464', route: '/tau-ai-app/chat/voice', batch: 3, status: 'implemented', note: 'AI-10 — STT → Foundation → client TTS' },
  { name: 'Search & Knowledge', figmaNode: '11:542', route: '/tau-ai-app/search', batch: 3, status: 'implemented', note: 'Demo results — memory retrieval pending' },
  { name: 'Workspace', figmaNode: '2:480', route: '/tau-ai-app/workspace', batch: 2, status: 'implemented' },
  { name: 'Files', figmaNode: '2:666', route: '/tau-ai-app/files', batch: 2, status: 'implemented' },
  { name: 'Agents', figmaNode: '2:851', route: '/tau-ai-app/agents', batch: 2, status: 'implemented' },
  { name: 'Project Grayscale', figmaNode: '2:1668', route: '/tau-ai-app/grayscale', batch: 3, status: 'ui-only', note: 'Separate product — no ATHENA integration' },
  { name: 'Local AI', figmaNode: '2:1273', route: '/tau-ai-app/local-ai', batch: 2, status: 'implemented' },
  { name: 'Developer', figmaNode: '2:1439', route: '/tau-ai-app/developer', batch: 3, status: 'implemented', note: 'API keys UI-only' },
  { name: 'Settings', figmaNode: '2:1122', route: '/tau-ai-app/settings', batch: 2, status: 'implemented' },
  { name: 'Empty States', figmaNode: '11:664', route: '/tau-ai-app/states/empty', batch: 3, status: 'implemented' },
  { name: 'Loading States', figmaNode: '11:693', route: '/tau-ai-app/states/loading', batch: 3, status: 'implemented' },
  { name: 'Error States', figmaNode: '11:741', route: '/tau-ai-app/states/error', batch: 3, status: 'implemented' },
  { name: 'Screen Index', figmaNode: '—', route: '/tau-ai-app/screens', batch: 3, status: 'implemented' },
];
