import type { TauCloudActivityItem, TauCloudFile, TauCloudFolder, TauCloudProfile, TauCloudShareLink, TauCloudStorageBreakdown } from '@/lib/taucloud/types';
import { mapApiActivity, mapApiCloudFile, mapApiFolder, mapApiShare, mapApiStorage, mapApiStorageBreakdown } from '@/lib/taucloud/types';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tauos_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonAuthHeaders(): HeadersInit {
  return { ...authHeaders(), 'Content-Type': 'application/json' };
}

export async function loginTauCloud(email: string, password: string) {
  const res = await fetch('/api/taucloud/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Sign in failed' };
  if (data.requires2fa && data.mfaToken) {
    return { ok: true as const, requires2fa: true as const, mfaToken: data.mfaToken as string };
  }
  localStorage.setItem('tauos_token', data.token);
  localStorage.setItem('tauos_user', JSON.stringify(data.user));
  return { ok: true as const, requires2fa: false as const };
}

export async function verifyTauCloud2fa(mfaToken: string, code: string) {
  const res = await fetch('/api/taucloud/auth/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mfaToken, code }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Verification failed' };
  localStorage.setItem('tauos_token', data.token);
  localStorage.setItem('tauos_user', JSON.stringify(data.user));
  return { ok: true as const };
}

export async function fetchTauCloudProfile(): Promise<TauCloudProfile | null> {
  const res = await fetch('/api/taucloud/profile', { headers: authHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  const user = data.user || {};
  return {
    id: String(user.id || ''),
    email: String(user.email || ''),
    username: String(user.username || ''),
    fullName: String(user.full_name || user.fullName || user.username || 'Account'),
    avatarUrl: user.avatarUrl ?? user.avatar_url ?? null,
    storage: mapApiStorage(data.storage || {}),
  };
}

export type TauCloudFileView = 'files' | 'recent' | 'starred' | 'shared' | 'trash';

export async function fetchTauCloudFiles(options?: { folder?: string; view?: TauCloudFileView }): Promise<TauCloudFile[]> {
  const params = new URLSearchParams();
  if (options?.view && options.view !== 'files') {
    params.set('view', options.view);
  } else if (options?.folder) {
    params.set('folder', options.folder);
  }
  const query = params.toString();
  const res = await fetch(`/api/taucloud/files/list${query ? `?${query}` : ''}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load files');
  const data = await res.json();
  return (data.files || []).map((f: Record<string, unknown>) => mapApiCloudFile(f));
}

export async function fetchTauCloudFileDetail(fileId: string) {
  const res = await fetch(`/api/taucloud/files/detail?id=${encodeURIComponent(fileId)}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Failed to load file' };
  return {
    ok: true as const,
    file: mapApiCloudFile(data.file || {}),
    previewUrl: String(data.previewUrl || ''),
  };
}

export async function uploadTauCloudFile(file: File, folder = 'root') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const res = await fetch('/api/taucloud/files/upload', {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Upload failed' };
  return { ok: true as const, file: data.file };
}

export async function deleteTauCloudFile(fileId: string, permanent = false) {
  const params = new URLSearchParams({ id: fileId });
  if (permanent) params.set('permanent', 'true');
  const res = await fetch(`/api/taucloud/files/delete?${params.toString()}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Delete failed' };
  return { ok: true as const, permanent: Boolean(data.permanent) };
}

export async function restoreTauCloudFile(fileId: string) {
  const res = await fetch('/api/taucloud/files/restore', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ fileId }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Restore failed' };
  return { ok: true as const };
}

export async function toggleTauCloudStar(fileId: string, starred?: boolean) {
  const res = await fetch('/api/taucloud/files/star', {
    method: 'PATCH',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ fileId, starred }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Update failed' };
  return { ok: true as const, file: mapApiCloudFile(data.file || {}) };
}

export async function shareTauCloudFile(fileId: string) {
  const res = await fetch('/api/taucloud/files/share', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ fileId }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Share failed' };
  const shareUrl = data.share?.fullUrl || data.share?.url;
  return { ok: true as const, shareUrl: shareUrl as string };
}

export async function fetchTauCloudShares(): Promise<TauCloudShareLink[]> {
  const res = await fetch('/api/taucloud/shares', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load shares');
  const data = await res.json();
  return (data.shares || []).map((row: Record<string, unknown>) => mapApiShare(row));
}

export async function revokeTauCloudShare(shareId: string) {
  const res = await fetch(`/api/taucloud/shares?id=${encodeURIComponent(shareId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Revoke failed' };
  return { ok: true as const };
}

export async function fetchTauCloudActivity(limit = 50): Promise<TauCloudActivityItem[]> {
  const res = await fetch(`/api/taucloud/activity?limit=${limit}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load activity');
  const data = await res.json();
  return (data.activity || []).map((row: Record<string, unknown>) => mapApiActivity(row));
}

export async function createTauCloudFolder(name: string) {
  const res = await fetch('/api/taucloud/folders', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Folder creation failed' };
  return { ok: true as const, folder: mapApiFolder(data.folder || {}) };
}

export async function fetchTauCloudFolders(): Promise<TauCloudFolder[]> {
  const res = await fetch('/api/taucloud/folders', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load folders');
  const data = await res.json();
  return (data.folders || []).map((row: Record<string, unknown>) => mapApiFolder(row));
}

export async function fetchTauCloudStorageStats() {
  const res = await fetch('/api/taucloud/storage', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load storage stats');
  const data = await res.json();
  const storage = mapApiStorage(data.storage || {});
  return {
    storage,
    breakdown: (data.breakdown || []).map((row: Record<string, unknown>) =>
      mapApiStorageBreakdown(row, storage.used)
    ),
  };
}

export async function fetchTauCloud2faStatus() {
  const res = await fetch('/api/taucloud/profile/2fa', { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load 2FA status');
  const data = await res.json();
  return { enabled: Boolean(data.enabled), email: String(data.email || '') };
}

export async function setupTauCloud2fa() {
  const res = await fetch('/api/taucloud/profile/2fa', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ action: 'setup' }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Setup failed' };
  return {
    ok: true as const,
    secret: data.secret as string,
    otpauthUrl: data.otpauthUrl as string,
  };
}

export async function enableTauCloud2fa(code: string) {
  const res = await fetch('/api/taucloud/profile/2fa', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ action: 'enable', code }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Enable failed' };
  return { ok: true as const };
}

export async function disableTauCloud2fa(code: string) {
  const res = await fetch('/api/taucloud/profile/2fa', {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ action: 'disable', code }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Disable failed' };
  return { ok: true as const };
}

export async function searchTauCloudFiles(query: string): Promise<TauCloudFile[]> {
  const res = await fetch(`/api/taucloud/search?q=${encodeURIComponent(query)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return (data.results || []).map((f: Record<string, unknown>) => mapApiCloudFile(f));
}

export async function downloadTauCloudFile(fileId: string) {
  const res = await fetch(`/api/taucloud/files/download?id=${encodeURIComponent(fileId)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) return { ok: false as const, error: 'Download failed' };
  const data = await res.json();
  const url = data.url || data.downloadUrl;
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return { ok: true as const };
}

export async function saveTauCloudProfile(input: { fullName?: string; username?: string }) {
  const res = await fetch('/api/taucloud/profile', {
    method: 'PUT',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({
      full_name: input.fullName,
      username: input.username,
    }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Save failed' };
  return { ok: true as const, user: data.user };
}

export async function changeTauCloudPassword(currentPassword: string, newPassword: string) {
  const res = await fetch('/api/taucloud/profile/password', {
    method: 'PUT',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Password update failed' };
  return { ok: true as const };
}

function syncStoredUserAvatar(avatarUrl: string | null) {
  if (typeof window === 'undefined') return;
  const storedUser = localStorage.getItem('tauos_user');
  if (!storedUser) return;
  try {
    const parsed = JSON.parse(storedUser);
    localStorage.setItem('tauos_user', JSON.stringify({ ...parsed, avatarUrl }));
    window.dispatchEvent(new CustomEvent('taucloud-profile-updated'));
  } catch {
    /* ignore */
  }
}

export async function uploadTauCloudAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/taucloud/profile/avatar', {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, error: data.error || 'Failed to upload avatar' };
  syncStoredUserAvatar(data.avatarUrl ?? null);
  return { ok: true as const, avatarUrl: data.avatarUrl as string };
}

export async function removeTauCloudAvatar() {
  const res = await fetch('/api/taucloud/profile/avatar', {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    return { ok: false as const, error: data.error || 'Failed to remove avatar' };
  }
  syncStoredUserAvatar(null);
  return { ok: true as const };
}
