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
import { persistTauSession, tauAuthHeaders, tauFetch, tauFetchCredentials } from '@/lib/tau-auth-client';
import { TAU_TOKEN_KEY, TAU_USER_KEY } from '@/lib/tau-auth-constants';
import {
  TAUMAIL_INLINE_ATTACHMENT_BYTES,
  type MailAttachmentRef,
} from '@/lib/taumail-attachments';

export type TauMailAttachmentRef = MailAttachmentRef;

function authHeaders(): HeadersInit {
  return tauAuthHeaders();
}

function jsonAuthHeaders(): HeadersInit {
  return { ...authHeaders(), 'Content-Type': 'application/json' };
}

function getStoredToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(TAU_TOKEN_KEY) : null;
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
  const token = typeof window !== 'undefined' ? localStorage.getItem(TAU_TOKEN_KEY) : null;

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
    const res = await tauFetch('/api/taumail/emails/inbox', { headers });
    if (!res.ok) throw new Error('Failed to load inbox');
    const data = await res.json();
    return (data.emails || []).map((e: Record<string, unknown>) => mapApiInboxEmail(e));
  }

  if (folder === 'sent') {
    const res = await tauFetch('/api/taumail/emails/sent', { headers });
    if (!res.ok) throw new Error('Failed to load sent');
    const data = await res.json();
    return (data.emails || []).map((e: Record<string, unknown>) => mapApiSentEmail(e));
  }

  if (folder === 'spam') {
    const res = await tauFetch('/api/taumail/emails/spam', { headers });
    if (!res.ok) throw new Error('Failed to load spam');
    const data = await res.json();
    return (data.emails || []).map((e: Record<string, unknown>) => mapApiInboxEmail(e));
  }

  if (folder === 'drafts') {
    const res = await tauFetch('/api/taumail/emails/drafts', { headers });
    if (!res.ok) throw new Error('Failed to load drafts');
    const data = await res.json();
    return (data.drafts || []).map((e: Record<string, unknown>) => mapApiDraftEmail(e));
  }

  const res = await tauFetch('/api/taumail/emails/trash', { headers });
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
    credentials: tauFetchCredentials,
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Login failed' };

  if (data.requires2fa && data.mfaToken) {
    return {
      ok: true as const,
      requires2fa: true as const,
      mfaToken: data.mfaToken as string,
    };
  }

  persistTauSession(data.token, {
    id: data.user.id,
    username: data.user.username,
    email: data.user.email,
    fullName: data.user.fullName,
    avatarUrl: data.user.avatarUrl ?? null,
  });
  localStorage.removeItem('tauos_demo_mode');
  return { ok: true as const, demo: false };
}

export async function verifyTauMail2fa(mfaToken: string, code: string) {
  const res = await fetch('/api/tauid/auth/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: tauFetchCredentials,
    body: JSON.stringify({ mfaToken, code }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Verification failed' };
  if (data.token && data.user) {
    persistTauSession(data.token, {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      fullName: data.user.fullName,
    });
  }
  return { ok: true as const };
}

export async function searchTauMailEmails(
  query: string,
  folder: 'inbox' | 'sent' | 'all' = 'all',
): Promise<TauMailEmail[]> {
  const token = getStoredToken();
  if (isDemoSession(token)) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getDemoInbox()
      .map(mapDemoInbox)
      .filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.body.toLowerCase().includes(q) ||
          e.sender.toLowerCase().includes(q),
      );
  }

  const params = new URLSearchParams({ q: query, folder });
  const res = await tauFetch(`/api/taumail/emails/search?${params.toString()}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return (data.emails || []).map((row: Record<string, unknown>) => {
    if (row.folder === 'sent') return mapApiSentEmail(row);
    return mapApiInboxEmail(row);
  });
}

export async function sendTauMail(payload: {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  attachments?: TauMailAttachmentRef[];
}) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) {
    return { ok: true, demo: true };
  }
  const res = await tauFetch('/api/taumail/emails/send', {
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
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (!token) return { ok: false, error: 'Not logged in' };

  if (file.size <= TAUMAIL_INLINE_ATTACHMENT_BYTES) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await tauFetch('/api/taumail/emails/attachments/upload', {
      method: 'PUT',
      headers: authHeaders(),
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

  const prepRes = await tauFetch('/api/taumail/emails/attachments', {
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
  const token = localStorage.getItem(TAU_TOKEN_KEY);
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

  const res = await tauFetch('/api/taumail/emails/drafts', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data.error || 'Failed to save draft' };
  return { ok: true, draftId: data.draft?.id };
}

export async function moveEmailToTrash(emailId: string | number) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: true };

  const res = await tauFetch('/api/taumail/emails/trash', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ emailId, action: 'trash' }),
  });
  return { ok: res.ok };
}

export async function toggleEmailStar(emailId: string | number, starred: boolean) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: true, starred: !starred };

  const res = await tauFetch('/api/taumail/emails/actions', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ emailId, action: starred ? 'unstar' : 'star' }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Failed to update star' };
  return { ok: true as const, starred: !starred };
}

export async function archiveEmail(emailId: string | number) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: true };

  const res = await tauFetch('/api/taumail/emails/actions', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ emailId, action: 'archive' }),
  });
  return { ok: res.ok };
}

export async function summarizeTauMailEmail(email: {
  sender: string;
  subject: string;
  body: string;
}): Promise<{ ok: true; summary: string } | { ok: false; error: string }> {
  const prompt = `Summarize this email in 2-4 concise bullet points:\nFrom: ${email.sender}\nSubject: ${email.subject}\n\n${email.body}`;
  try {
    const message = await sendTauMailAiMessage(prompt);
    if (!message?.text) return { ok: false, error: 'No summary returned' };
    return { ok: true, summary: message.text };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'AI summarize failed' };
  }
}

export async function markEmailRead(emailId: string | number) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: true };
  const res = await tauFetch('/api/taumail/emails/mark-read', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ emailId }),
  });
  return { ok: res.ok };
}

export async function fetchTauMailProfile(): Promise<TauMailProfile | null> {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return null;

  const res = await tauFetch('/api/taumail/profile', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load profile');
  const data = await res.json();
  return data.profile;
}

export async function saveTauMailProfile(profile: TauMailProfile) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: true, demo: true };

  const res = await tauFetch('/api/taumail/profile', {
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

export async function downloadTauMailAttachment(
  emailId: string | number,
  index: number,
  filename: string,
  options?: { inline?: boolean },
) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: false, error: 'Not available in demo mode' };

  const inline = options?.inline ? '&inline=1' : '';
  const res = await fetch(
    `/api/taumail/emails/${emailId}/attachments?index=${index}${inline}`,
    { headers: authHeaders() },
  );

  if (!res.ok) {
    let error = 'Failed to download attachment';
    try {
      const data = await res.json();
      error = data.error || error;
    } catch {
      /* binary error body */
    }
    return { ok: false, error };
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { ok: true };
}

export async function openTauMailAttachment(
  emailId: string | number,
  index: number,
) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: false, error: 'Not available in demo mode' };

  const res = await fetch(
    `/api/taumail/emails/${emailId}/attachments?index=${index}&inline=1`,
    { headers: authHeaders() },
  );

  if (!res.ok) {
    return { ok: false, error: 'Failed to open attachment' };
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return { ok: true };
}

export async function uploadTauMailAvatar(file: File) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: true, demo: true, avatarUrl: null };

  const formData = new FormData();
  formData.append('file', file);
  const res = await tauFetch('/api/taumail/profile/avatar', {
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
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: true, demo: true };

  const res = await tauFetch('/api/taumail/profile/avatar', {
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
  const token = localStorage.getItem(TAU_TOKEN_KEY);
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

  const res = await tauFetch('/api/taumail/contacts', { headers: authHeaders() });
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
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) {
    const { tasksList } = await import('@/lib/taumail/ui-demo-data');
    return tasksList.map((t, i) => ({ id: String(i), ...t }));
  }

  const res = await tauFetch('/api/taumail/tasks', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load tasks');
  const data = await res.json();
  return data.tasks || [];
}

export async function toggleTauMailTask(id: string, isDone: boolean) {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) return { ok: true };

  const res = await tauFetch('/api/taumail/tasks', {
    method: 'PATCH',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ id, isDone }),
  });
  return { ok: res.ok };
}

export async function fetchTauMailCalendar(): Promise<TauMailCalendarData> {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
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

  const res = await tauFetch('/api/taumail/calendar', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load calendar');
  return res.json();
}

export async function fetchTauMailNotifications(): Promise<TauMailNotification[]> {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) {
    const { notificationsList } = await import('@/lib/taumail/ui-demo-data');
    return notificationsList.map((n, i) => ({ id: String(i), ...n }));
  }

  const res = await tauFetch('/api/taumail/notifications', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load notifications');
  const data = await res.json();
  return data.notifications || [];
}

export async function fetchTauMailStorage(): Promise<TauMailStorageData> {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) {
    const { storageBreakdown } = await import('@/lib/taumail/ui-demo-data');
    const usedGb = storageBreakdown.reduce((s, b) => s + b.used, 0);
    return { usedGb, totalGb: 250, breakdown: storageBreakdown };
  }

  const res = await tauFetch('/api/taumail/storage', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load storage');
  return res.json();
}

export async function fetchTauMailAi(): Promise<{ messages: TauMailAiMessage[]; prompts: string[] }> {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) {
    const demo = await import('@/lib/taumail/ui-demo-data');
    return { messages: demo.aiMessages, prompts: demo.aiPrompts };
  }

  const res = await tauFetch('/api/taumail/ai', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load AI chat');
  const data = await res.json();
  return { messages: data.messages || [], prompts: data.prompts || [] };
}

export async function sendTauMailAiMessage(message: string): Promise<TauMailAiMessage | null> {
  const token = localStorage.getItem(TAU_TOKEN_KEY);
  if (isDemoSession(token)) {
    return { role: 'assistant', text: 'Demo mode — connect with a real account to use Tau AI.' };
  }

  const res = await tauFetch('/api/taumail/ai', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'AI request failed');
  return data.message;
}
