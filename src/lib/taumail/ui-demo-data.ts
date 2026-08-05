/** Static UI demo data for screens without backend APIs (Figma content) */

import { tauMailAssets } from '@/lib/taumail/assets';

export const calendarWeekDays = [
  { label: 'Mon 26', active: false },
  { label: 'Tue 27', active: false },
  { label: 'Wed 28', active: true },
  { label: 'Thu 29', active: false },
  { label: 'Fri 30', active: false },
  { label: 'Sat 31', active: false },
  { label: 'Sun 01', active: false },
];

export const calendarEvents = [
  { title: 'Quantum Alignment', day: 2, top: '10:30 AM', color: 'gold', avatars: true },
  { title: 'Telemetry Sync', day: 3, top: '02:00 PM', color: 'blue' },
  { title: 'Cargo Dispatch', day: 4, top: '11:00 AM', color: 'purple' },
];

export const calendarAgenda = [
  { time: '10:30 AM', title: 'Quantum Computing Sync', location: 'Central Core Room' },
  { time: '02:00 PM', title: 'Epsilon Cargo Dispatch', location: 'Terminal Block D' },
  { time: '04:30 PM', title: 'Node Handshake Debug', location: 'Security Subsystem' },
];

export const calendarLegends = [
  { label: 'Primary Alignments', color: '#d4a843' },
  { label: 'Subsystem Telemetry', color: '#3b82f6' },
  { label: 'Grid Maintenance', color: '#ef4444' },
  { label: 'External Cargo', color: '#a855f7' },
];

export const contactsList = [
  { name: 'Sariel Tau', email: 'sariel@tau.org', role: 'Protocol Lead', avatar: tauMailAssets.avatars.sender1, verified: true },
  { name: 'Director Vance', email: 'vance@tau.engineering', role: 'Grid Operations', avatar: tauMailAssets.avatars.sender3, verified: true },
  { name: 'Aetheria Labs', email: 'team@aetheria.net', role: 'Performance Node', avatar: tauMailAssets.avatars.sender2, verified: false },
  { name: 'Epsilon Cargo', email: 'cargo@epsilon.net', role: 'Logistics', avatar: tauMailAssets.avatars.sender4, verified: true },
];

export const tasksList = [
  { title: 'Review protocol v4.3 specs', due: 'Today', priority: 'high', done: false },
  { title: 'Confirm Springfield hub telemetry', due: 'Tomorrow', priority: 'urgent', done: false },
  { title: 'Archive Q4 financial projections', due: 'Oct 30', priority: 'normal', done: true },
  { title: 'Schedule alignment with Sariel', due: 'Nov 1', priority: 'normal', done: false },
];

export const aiPrompts = [
  'Summarize all unread signals from the inner core network',
  'Draft a reply to Sariel about protocol v4.3',
  'Find optimal meeting slot with Director Vance',
  'Analyze attachment: tau_universe_protocol.pdf',
];

export const aiMessages = [
  { role: 'assistant' as const, text: 'I found 12 unread signals. The highest priority is the Springfield hub telemetry incident from Director Vance.' },
  { role: 'user' as const, text: 'Draft a concise reply acknowledging the failsafe trigger.' },
  { role: 'assistant' as const, text: 'Acknowledged. Draft ready: "Director Vance — Failsafe trigger noted. Maintenance squads dispatched. Awaiting telemetry report from Springfield hub."' },
];

export const storageBreakdown = [
  { label: 'Mail Attachments', used: 82, total: 250, color: '#d4a843' },
  { label: 'Cloud Artifacts', used: 42, total: 250, color: '#3b82f6' },
  { label: 'Encrypted Backups', used: 18, total: 250, color: '#10b981' },
];

export const notificationsList = [
  { title: 'Node security handshake successful', meta: '4m ago · Security', tone: 'success' as const },
  { title: 'Springfield hub failsafe triggered', meta: '12m ago · Grid', tone: 'danger' as const },
  { title: 'New message from Sariel Tau', meta: '28m ago · Inbox', tone: 'info' as const },
  { title: 'Storage at 57% capacity', meta: '1h ago · Storage', tone: 'warning' as const },
];
