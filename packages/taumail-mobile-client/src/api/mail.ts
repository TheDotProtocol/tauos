import { jsonAuthHeaders } from '../session';
import { tauMobileFetch } from '../network';
import {
  mapApiDraftEmail,
  mapApiInboxEmail,
  mapApiSentEmail,
  mapApiTrashEmail,
  type TauMailEmail,
  type TauMailFolder,
} from '../types';

export async function fetchEmails(folder: TauMailFolder): Promise<TauMailEmail[]> {
  const headers = await jsonAuthHeaders();

  if (folder === 'inbox') {
    const res = await tauMobileFetch('/api/taumail/emails/inbox', { headers });
    if (!res.ok) throw new Error('Failed to load inbox');
    const data = (await res.json()) as { emails?: Record<string, unknown>[] };
    return (data.emails || []).map(mapApiInboxEmail);
  }

  if (folder === 'sent') {
    const res = await tauMobileFetch('/api/taumail/emails/sent', { headers });
    if (!res.ok) throw new Error('Failed to load sent');
    const data = (await res.json()) as { emails?: Record<string, unknown>[] };
    return (data.emails || []).map(mapApiSentEmail);
  }

  if (folder === 'drafts') {
    const res = await tauMobileFetch('/api/taumail/emails/drafts', { headers });
    if (!res.ok) throw new Error('Failed to load drafts');
    const data = (await res.json()) as { drafts?: Record<string, unknown>[] };
    return (data.drafts || []).map(mapApiDraftEmail);
  }

  if (folder === 'spam') {
    const res = await tauMobileFetch('/api/taumail/emails/spam', { headers });
    if (!res.ok) throw new Error('Failed to load spam');
    const data = (await res.json()) as { emails?: Record<string, unknown>[] };
    return (data.emails || []).map(mapApiInboxEmail);
  }

  const res = await tauMobileFetch('/api/taumail/emails/trash', { headers });
  if (!res.ok) throw new Error('Failed to load trash');
  const data = (await res.json()) as { emails?: Record<string, unknown>[] };
  return (data.emails || []).map(mapApiTrashEmail);
}

export async function sendEmail(payload: {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  inReplyTo?: string;
  references?: string;
  attachments?: import('../types').TauMailAttachmentRef[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await tauMobileFetch('/api/taumail/emails/send', {
    method: 'POST',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { error?: string };
  if (!res.ok) return { ok: false, error: data.error || 'Send failed' };
  return { ok: true };
}

export async function markEmailRead(emailId: string | number): Promise<void> {
  await tauMobileFetch('/api/taumail/emails/mark-read', {
    method: 'POST',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify({ emailId }),
  });
}

export async function starEmail(emailId: string | number, starred: boolean): Promise<void> {
  await tauMobileFetch('/api/taumail/emails/actions', {
    method: 'POST',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify({ emailId, action: starred ? 'star' : 'unstar' }),
  });
}

export async function searchEmails(
  query: string,
  folder: 'inbox' | 'sent' | 'all' = 'all',
): Promise<TauMailEmail[]> {
  const q = query.trim();
  if (!q) return [];

  const params = new URLSearchParams({ q, folder });
  const res = await tauMobileFetch(`/api/taumail/emails/search?${params.toString()}`, {
    headers: await jsonAuthHeaders(),
  });
  if (!res.ok) throw new Error('Search failed');

  const data = (await res.json()) as { emails?: Record<string, unknown>[] };
  return (data.emails || []).map((row) => {
    if (row.folder === 'sent') return mapApiSentEmail(row);
    return mapApiInboxEmail(row);
  });
}
