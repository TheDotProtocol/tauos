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
import {
  TAUMAIL_INLINE_ATTACHMENT_BYTES,
  type MailAttachmentRef,
} from '@/lib/taumail-attachments';

export type TauMailAttachmentRef = MailAttachmentRef;

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tauos_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonAuthHeaders(): HeadersInit {
  return { ...authHeaders(), 'Content-Type': 'application/json' };
}

function mapDemoInbox(email: DemoInboxEmail): TauMailEmail {
  return {
    id: email.id,
    sender: email.from,
    senderEmail: email.fromEmail,
    subject: email.subject,
    preview: email.preview,
    body: email.body,
    time: email.time,
    unread: email.unread,
    starred: email.starred,
  };
}

export type TauMailProfile = {
  fullName: string;
  displayName: string;
  email: string;
  organization: string;
  title: string;
  timezone: string;
  avatarUrl?: string | null;
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
      return getDemoSent().map((e) => ({
        id: e.id,
        sender: 'You',
        senderEmail: e.recipient_email,
        subject: e.subject,
        preview: e.body.slice(0, 100) + '...',
        body: e.body,
        time: new Date(e.sent_at).toLocaleString(),
        unread: false,
        starred: false,
      }));
    }
    if (folder === 'drafts') {
      return getDemoDrafts().map((e) => ({
        id: e.id,
        sender: 'Draft',
        senderEmail: e.to,
        subject: e.subject,
        preview: e.body.slice(0, 100) + '...',
        body: e.body,
        time: new Date(e.updated_at).toLocaleString(),
        unread: true,
        starred: false,
      }));
    }
    if (folder === 'spam') {
      return getDemoSpam().map((e) => ({
        id: e.id,
        sender: e.from,
        senderEmail: e.from,
        subject: e.subject,
        preview: e.preview,
        body: e.preview,
        time: e.time,
        unread: e.unread,
        starred: e.starred,
      }));
    }
    if (folder === 'trash') {
      return getDemoTrash().map((e) => ({
        id: e.id,
        sender: e.from,
        senderEmail: e.from,
        subject: e.subject,
        preview: e.preview,
        body: e.preview,
        time: e.time,
        unread: false,
        starred: false,
      }));
    }
  }

  const headers = authHeaders();

  if (folder === 'inbox') {
    const res = await fetch('/api/taumail/emails/inbox', { headers });
    if (!res.ok) throw new Error('Failed to load inbox');
    const data = await res.json();
    return (data.emails || []).map((e: Record<string, unknown>) => mapApiInboxEmail(e));
  }

  if (folder === 'sent') {
    const res = await fetch('/api/taumail/emails/sent', { headers });
    if (!res.ok) throw new Error('Failed to load sent');
    const data = await res.json();
    return (data.emails || []).map((e: Record<string, unknown>) => mapApiSentEmail(e));
  }

  if (folder === 'spam') {
    const res = await fetch('/api/taumail/emails/spam', { headers });
    if (!res.ok) throw new Error('Failed to load spam');
    const data = await res.json();
    return (data.emails || []).map((e: Record<string, unknown>) => mapApiInboxEmail(e));
  }

  if (folder === 'drafts') {
    const res = await fetch('/api/taumail/emails/drafts', { headers });
    if (!res.ok) throw new Error('Failed to load drafts');
    const data = await res.json();
    return (data.drafts || []).map((e: Record<string, unknown>) => mapApiDraftEmail(e));
  }

  const res = await fetch('/api/taumail/emails/trash', { headers });
  if (!res.ok) throw new Error('Failed to load trash');
  const data = await res.json();
  return (data.emails || []).map((e: Record<string, unknown>) => mapApiTrashEmail(e));
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
      avatarUrl: data.user.avatarUrl ?? null,
    }),
  );
  localStorage.removeItem('tauos_demo_mode');
  return { ok: true as const, demo: false };
}

export async function sendTauMail(payload: {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  attachments?: TauMailAttachmentRef[];
}) {
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

export async function uploadTauMailAttachment(
  file: File,
): Promise<{ ok: true; ref: TauMailAttachmentRef } | { ok: false; error: string }> {
  const token = localStorage.getItem('tauos_token');
  if (!token) return { ok: false, error: 'Not logged in' };

  if (file.size <= TAUMAIL_INLINE_ATTACHMENT_BYTES) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/taumail/emails/attachments/upload', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Upload failed' };
    return {
      ok: true,
      ref: {
        attachmentId: data.attachmentId,
        path: data.path,
        filename: data.filename,
        contentType: data.contentType,
        size: data.size,
      },
    };
  }

  const prepRes = await fetch('/api/taumail/emails/attachments', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
    }),
  });
  const prep = await prepRes.json();
  if (!prepRes.ok) return { ok: false, error: prep.error || 'Failed to prepare upload' };

  const uploadRes = await fetch(prep.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      ...(prep.token ? { 'x-upsert': 'true' } : {}),
    },
    body: file,
  });
  if (!uploadRes.ok) {
    return { ok: false, error: 'Failed to upload file to storage' };
  }

  return {
    ok: true,
    ref: {
      attachmentId: prep.attachmentId,
      path: prep.path,
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
    },
  };
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
        avatarUrl: profile.avatarUrl ?? parsed.avatarUrl ?? null,
      }),
    );
  }
  return { ok: true, profile: data.profile };
}

export async function uploadTauMailAvatar(file: File) {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) return { ok: true, demo: true, avatarUrl: null };

  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/taumail/profile/avatar', {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Failed to upload avatar' };

  const storedUser = localStorage.getItem('tauos_user');
  if (storedUser && data.avatarUrl) {
    const parsed = JSON.parse(storedUser);
    localStorage.setItem('tauos_user', JSON.stringify({ ...parsed, avatarUrl: data.avatarUrl }));
  }

  return { ok: true, avatarUrl: data.avatarUrl as string };
}

export async function removeTauMailAvatar() {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) return { ok: true, demo: true };

  const res = await fetch('/api/taumail/profile/avatar', {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) return { ok: false };

  const storedUser = localStorage.getItem('tauos_user');
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    localStorage.setItem('tauos_user', JSON.stringify({ ...parsed, avatarUrl: null }));
  }
  return { ok: true };
}

export async function fetchTauMailContacts(): Promise<TauMailContact[]> {
  const token = localStorage.getItem('tauos_token');
  if (isDemoSession(token)) {
    const { contactsList } = await import('@/lib/taumail/ui-demo-data');
    return contactsList.map((c) => ({
      id: c.email,
      name: c.name,
      email: c.email,
      role: c.role,
      verified: c.verified,
    }));
  }

  const res = await fetch('/api/taumail/contacts', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load contacts');
  const data = await res.json();
  return (data.contacts || []).map((c: Record<string, unknown>) => ({
    id: String(c.id),
    name: String(c.name),
    email: String(c.email),
    role: String(c.role || ''),
    verified: Boolean(c.verified),
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
