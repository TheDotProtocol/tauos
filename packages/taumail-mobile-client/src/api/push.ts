import { jsonAuthHeaders, authHeaders } from '../session';
import { tauMobileFetch, tauMobileJson } from '../network';
import {
  type TauMailAttachmentRef,
} from '../types';
import { TAUMAIL_INLINE_ATTACHMENT_BYTES } from '../constants';
import { resolveApiUrl } from '../config';

export async function uploadAttachment(input: {
  uri: string;
  name: string;
  type: string;
  size: number;
}): Promise<{ ok: true; ref: TauMailAttachmentRef } | { ok: false; error: string }> {
  if (input.size > TAUMAIL_INLINE_ATTACHMENT_BYTES) {
    return {
      ok: false,
      error: `File exceeds ${Math.round(TAUMAIL_INLINE_ATTACHMENT_BYTES / (1024 * 1024))} MB inline limit`,
    };
  }

  const formData = new FormData();
  formData.append('file', {
    uri: input.uri,
    name: input.name,
    type: input.type || 'application/octet-stream',
  } as unknown as Blob);

  const res = await tauMobileFetch('/api/taumail/emails/attachments/upload', {
    method: 'PUT',
    headers: await authHeaders(),
    body: formData,
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    return { ok: false, error: String(data.error || 'Upload failed') };
  }

  return {
    ok: true,
    ref: {
      attachmentId: String(data.attachmentId || ''),
      path: String(data.path || ''),
      filename: String(data.filename || input.name),
      contentType: String(data.contentType || input.type),
      size: Number(data.size || input.size),
    },
  };
}

export async function getAttachmentDownloadUrl(
  emailId: string | number,
  index: number,
): Promise<string> {
  return resolveApiUrl(`/api/taumail/emails/${emailId}/attachments?index=${index}`);
}

export async function downloadAttachment(
  emailId: string | number,
  index: number,
): Promise<{ ok: true; blob: Blob; filename: string; contentType: string } | { ok: false; error: string }> {
  const res = await tauMobileFetch(
    `/api/taumail/emails/${emailId}/attachments?index=${index}`,
    { headers: await authHeaders() },
  );
  if (!res.ok) {
    return { ok: false, error: 'Download failed' };
  }
  const disposition = res.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] || `attachment-${index}`;
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  const blob = await res.blob();
  return { ok: true, blob, filename, contentType };
}

export type TauMailNotification = {
  id: string;
  title: string;
  meta: string;
  tone: string;
  isRead: boolean;
};

export async function fetchNotifications(): Promise<TauMailNotification[]> {
  const result = await tauMobileJson<{ notifications?: TauMailNotification[] }>(
    '/api/taumail/notifications',
    { headers: await jsonAuthHeaders() },
  );
  if (!result.ok) throw new Error(result.error);
  return result.data.notifications || [];
}

export async function markNotificationsRead(options?: {
  id?: string;
  markAllRead?: boolean;
}): Promise<void> {
  await tauMobileFetch('/api/taumail/notifications', {
    method: 'PATCH',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify(options ?? { markAllRead: true }),
  });
}

export async function registerPushDevice(input: {
  deviceId: string;
  platform: 'ios' | 'android' | 'unknown';
  pushToken?: string | null;
}): Promise<{ remotePushConfigured: boolean }> {
  const result = await tauMobileJson<{ remotePushConfigured?: boolean }>(
    '/api/taumail/push/devices',
    {
      method: 'POST',
      headers: await jsonAuthHeaders(),
      body: JSON.stringify(input),
    },
  );
  if (!result.ok) throw new Error(result.error);
  return { remotePushConfigured: Boolean(result.data.remotePushConfigured) };
}

export async function unregisterPushDevice(deviceId: string): Promise<void> {
  await tauMobileFetch('/api/taumail/push/devices', {
    method: 'DELETE',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify({ deviceId }),
  });
}

export async function fetchPushPreference(): Promise<{
  enabled: boolean;
  remotePushConfigured: boolean;
}> {
  const result = await tauMobileJson<{ enabled?: boolean; remotePushConfigured?: boolean }>(
    '/api/taumail/push/preferences',
    { headers: await jsonAuthHeaders() },
  );
  if (!result.ok) throw new Error(result.error);
  return {
    enabled: Boolean(result.data.enabled),
    remotePushConfigured: Boolean(result.data.remotePushConfigured),
  };
}

export async function setPushPreference(enabled: boolean): Promise<void> {
  const result = await tauMobileJson('/api/taumail/push/preferences', {
    method: 'PATCH',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify({ enabled }),
  });
  if (!result.ok) throw new Error(result.error);
}
