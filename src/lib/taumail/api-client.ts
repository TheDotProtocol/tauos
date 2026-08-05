import {
  getDemoDrafts,
  getDemoInbox,
  getDemoSent,
  getDemoSpam,
  getDemoTrash,
  isDemoSession,
  type DemoInboxEmail,
} from '@/lib/taumail-demo';
import type { TauMailEmail, TauMailFolder } from '@/lib/taumail/types';
import {
  mapApiDraftEmail,
  mapApiInboxEmail,
  mapApiSentEmail,
  mapApiTrashEmail,
} from '@/lib/taumail/types';
import { tauMailAssets } from '@/lib/taumail/assets';

const avatars = [
  tauMailAssets.avatars.sender1,
  tauMailAssets.avatars.sender2,
  tauMailAssets.avatars.sender3,
  tauMailAssets.avatars.sender4,
];

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tauos_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonAuthHeaders(): HeadersInit {
  return { ...authHeaders(), 'Content-Type': 'application/json' };
}

function withAvatar(email: TauMailEmail, index: number): TauMailEmail {
  return { ...email, avatar: avatars[index % avatars.length] };
}

function mapDemoInbox(email: DemoInboxEmail, index: number): TauMailEmail {
  return withAvatar(
    {
      id: email.id,
      sender: email.from,
      senderEmail: email.fromEmail,
      subject: email.subject,
      preview: email.preview,
      body: email.body,
      time: email.time,
      unread: email.unread,
      starred: email.starred,
    },
    index,
  );
}

export type TauMailProfile = {
  fullName: string;
  displayName: string;
  email: string;
  organization: string;
  title: string;
  timezone: string;
};

export type TauMailContact = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  avatar?: string;
};

export type TauMailTask = {
  id: string;
  title: string;
  due: string;
  priority: string;
  done: boolean;
};

export type TauMailCalendarData = {
  monthLabel: string;
  weekDays: { label: string; active: boolean }[];
  events: { id: string; title: string; day: number; top: string; color: string; avatars?: boolean }[];
  agenda: { time: string; title: string; location: string }[];
  legends: { label: string; color: string }[];
};

export type TauMailNotification = {
  id: string;
  title: string;
  meta: string;
  tone: 'success' | 'danger' | 'info' | 'warning';
};

export type TauMailAiMessage = {
  id?: string;
  role: 'user' | 'assistant';
  text: string;
};

export type TauMailStorageData = {
  usedGb: number;
  totalGb: number;
  breakdown: { label: string; used: number; total: number; color: string }[];
};

export async function fetchTauMailEmails(folder: TauMailFolder): Promise<TauMailEmail[]> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tauos_token') : null;

  if (isDemoSession(token)) {
    if (folder === 'inbox') return getDemoInbox().map(mapDemoInbox);
    if (folder === 'sent') {
      return getDemoSent().map((e, i) =>
        withAvatar(
          {
            id: e.id,
            sender: 'You',
            senderEmail: e.recipient_email,
            subject: e.subject,
            preview: e.body.slice(0, 100) + '...',
            body: e.body,
            time: new Date(e.sent_at).toLocaleString(),
            unread: false,
            starred: false,
          },
          i,
        ),
      );
    }
    if (folder === 'drafts') {
      return getDemoDrafts().map((e, i) =>
        withAvatar(
          {
            id: e.id,
            sender: 'Draft',
            senderEmail: e.to,
            subject: e.subject,
            preview: e.body.slice(0, 100) + '...',
            body: e.body,
            time: new Date(e.updated_at).toLocaleString(),
            unread: true,
            starred: false,
          },
          i,
        ),
      );
    }
    if (folder === 'spam') {
      return getDemoSpam().map((e, i) =>
        withAvatar(
          {
            id: e.id,
            sender: e.from,
            senderEmail: e.from,
            subject: e.subject,
            preview: e.preview,
            body: e.preview,
            time: e.time,
            unread: e.unread,
            starred: e.starred,
          },
          i,
        ),
      );
    }
    if (folder === 'trash') {
      return getDemoTrash().map((e, i) =>
        withAvatar(
          {
            id: e.id,
            sender: e.from,
            senderEmail: e.from,
            subject: e.subject,
            preview: e.preview,
            body: e.preview,
            time: e.time,
            unread: false,
            starred: false,
          },
          i,
        ),
      );
    }
  }

  const headers = authHeaders();

  if (folder === 'inbox') {
    const res = await fetch('/api/taumail/emails/inbox', { headers });
    if (!res.ok) throw new Error('Failed to load inbox');
    const data = await res.json();
    return (data.emails || []).map((e: Record<string, unknown>, i: number) => withAvatar(mapApiInboxEmail(e), i));
  }

  if (folder === 'sent') {
    const res = await fetch('/api/taumail/emails/sent', { headers });
    if (!res.ok) throw new Error('Failed to load sent');
    const data = await res.json();
    return (data.emails || []).map((e: Record<string, unknown>, i: number) => withAvatar(mapApiSentEmail(e), i));
  }

  if (folder === 'spam') {
    const res = await fetch('/api/taumail/emails/spam', { headers });
    if (!res.ok) throw new Error('Failed to load spam');
    const data = await res.json();
    return (data.emails || []).map((e: Record<string, unknown>, i: number) => withAvatar(mapApiInboxEmail(e), i));
  }

  if (folder === 'drafts') {
    const res = await fetch('/api/taumail/emails/drafts', { headers });
    if (!res.ok) throw new Error('Failed to load drafts');
    const data = await res.json();
    return (data.drafts || []).map((e: Record<string, unknown>, i: number) => withAvatar(mapApiDraftEmail(e), i));
  }

  const res = await fetch('/api/taumail/emails/trash', { headers });
  if (!res.ok) throw new Error('Failed to load trash');
  const data = await res.json();
  return (data.emails || []).map((e: Record<string, unknown>, i: number) => withAvatar(mapApiTrashEmail(e), i));
}

export async function loginTauMail(email: string, password: string) {
  const { isDemoLogin, startDemoSession } = await import('@/lib/taumail-demo');
  if (isDemoLogin(email, password)) {
    startDemoSession();
    return { ok: true as const, demo: true };
  }

  const res = await fetch('/api/taumail/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Login failed' };

  localStorage.setItem('tauos_token', data.token);
  localStorage.setItem(
    'tauos_user',
    JSON.stringify({
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      fullName: data.user.fullName,
    }),
  );
  localStorage.removeItem('tauos_demo_mode');
  return { ok: true as const, demo: false };
}

export async function sendTauMail(payload: { to: string; subject: string; body: string }) {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) {
    return { ok: true, demo: true };
  }
  const res = await fetch('/api/taumail/emails/send', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Send failed' };
  return { ok: true, demo: false };
}

export async function saveTauMailDraft(payload: { to: string; subject: string; body: string; draftId?: string }) {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) return { ok: true, demo: true };

  if (payload.draftId) {
    const res = await fetch(`/api/taumail/emails/drafts/${payload.draftId}`, {
      method: 'PUT',
      headers: jsonAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Failed to update draft' };
    return { ok: true, draftId: data.draft?.id };
  }

  const res = await fetch('/api/taumail/emails/drafts', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Failed to save draft' };
  return { ok: true, draftId: data.draft?.id };
}

export async function moveEmailToTrash(emailId: string | number) {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) return { ok: true };

  const res = await fetch('/api/taumail/emails/trash', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ emailId, action: 'trash' }),
  });
  return { ok: res.ok };
}

export async function markEmailRead(emailId: string | number) {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) return { ok: true };
  const res = await fetch('/api/taumail/emails/mark-read', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ emailId }),
  });
  return { ok: res.ok };
}

export async function fetchTauMailProfile(): Promise<TauMailProfile | null> {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) return null;

  const res = await fetch('/api/taumail/profile', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load profile');
  const data = await res.json();
  return data.profile;
}

export async function saveTauMailProfile(profile: TauMailProfile) {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) return { ok: true, demo: true };

  const res = await fetch('/api/taumail/profile', {
    method: 'PUT',
    headers: jsonAuthHeaders(),
    body: JSON.stringify(profile),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Failed to save profile' };

  const storedUser = localStorage.getItem('tauos_user');
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    localStorage.setItem(
      'tauos_user',
      JSON.stringify({
        ...parsed,
        fullName: profile.fullName,
        email: profile.email,
        username: profile.displayName,
      }),
    );
  }
  return { ok: true, profile: data.profile };
}

export async function fetchTauMailContacts(): Promise<TauMailContact[]> {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) {
    const { contactsList } = await import('@/lib/taumail/ui-demo-data');
    return contactsList.map((c, i) => ({
      id: c.email,
      name: c.name,
      email: c.email,
      role: c.role,
      verified: c.verified,
      avatar: avatars[i % avatars.length],
    }));
  }

  const res = await fetch('/api/taumail/contacts', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load contacts');
  const data = await res.json();
  return (data.contacts || []).map((c: Record<string, unknown>, i: number) => ({
    id: String(c.id),
    name: String(c.name),
    email: String(c.email),
    role: String(c.role || ''),
    verified: Boolean(c.verified),
    avatar: avatars[i % avatars.length],
  }));
}

export async function fetchTauMailTasks(): Promise<TauMailTask[]> {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) {
    const { tasksList } = await import('@/lib/taumail/ui-demo-data');
    return tasksList.map((t, i) => ({ id: String(i), ...t }));
  }

  const res = await fetch('/api/taumail/tasks', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load tasks');
  const data = await res.json();
  return data.tasks || [];
}

export async function toggleTauMailTask(id: string, isDone: boolean) {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) return { ok: true };

  const res = await fetch('/api/taumail/tasks', {
    method: 'PATCH',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ id, isDone }),
  });
  return { ok: res.ok };
}

export async function fetchTauMailCalendar(): Promise<TauMailCalendarData> {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) {
    const demo = await import('@/lib/taumail/ui-demo-data');
    return {
      monthLabel: 'October 2026',
      weekDays: demo.calendarWeekDays,
      events: demo.calendarEvents.map((e, i) => ({ id: String(i), ...e })),
      agenda: demo.calendarAgenda,
      legends: demo.calendarLegends,
    };
  }

  const res = await fetch('/api/taumail/calendar', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load calendar');
  return res.json();
}

export async function fetchTauMailNotifications(): Promise<TauMailNotification[]> {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) {
    const { notificationsList } = await import('@/lib/taumail/ui-demo-data');
    return notificationsList.map((n, i) => ({ id: String(i), ...n }));
  }

  const res = await fetch('/api/taumail/notifications', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load notifications');
  const data = await res.json();
  return data.notifications || [];
}

export async function fetchTauMailStorage(): Promise<TauMailStorageData> {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) {
    const { storageBreakdown } = await import('@/lib/taumail/ui-demo-data');
    const usedGb = storageBreakdown.reduce((s, b) => s + b.used, 0);
    return { usedGb, totalGb: 250, breakdown: storageBreakdown };
  }

  const res = await fetch('/api/taumail/storage', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load storage');
  return res.json();
}

export async function fetchTauMailAi(): Promise<{ messages: TauMailAiMessage[]; prompts: string[] }> {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) {
    const demo = await import('@/lib/taumail/ui-demo-data');
    return { messages: demo.aiMessages, prompts: demo.aiPrompts };
  }

  const res = await fetch('/api/taumail/ai', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load AI chat');
  const data = await res.json();
  return { messages: data.messages || [], prompts: data.prompts || [] };
}

export async function sendTauMailAiMessage(message: string): Promise<TauMailAiMessage | null> {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) {
    return { role: 'assistant', text: 'Demo mode — connect with a real account to use Tau AI.' };
  }

  const res = await fetch('/api/taumail/ai', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'AI request failed');
  return data.message;
}
