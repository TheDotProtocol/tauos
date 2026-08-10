import { authHeaders, getStoredUser, jsonAuthHeaders, persistSession } from '../session';
import { tauMobileFetch } from '../network';
import type { TauMailProfile, TauSessionUser } from '../types';

export async function fetchProfile(): Promise<TauMailProfile> {
  const res = await tauMobileFetch('/api/taumail/profile', {
    headers: await jsonAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load profile');
  const data = (await res.json()) as { profile: TauMailProfile };
  return data.profile;
}

export async function updateProfile(input: {
  fullName?: string;
  displayName?: string;
  organization?: string;
  title?: string;
  timezone?: string;
}): Promise<TauMailProfile> {
  const res = await tauMobileFetch('/api/taumail/profile', {
    method: 'PUT',
    headers: await jsonAuthHeaders(),
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as { profile?: TauMailProfile; error?: string };
  if (!res.ok || !data.profile) throw new Error(data.error || 'Failed to update profile');

  const stored = await getStoredUser();
  if (stored) {
    const updated: TauSessionUser = {
      ...stored,
      fullName: data.profile.fullName,
      avatarUrl: data.profile.avatarUrl ?? stored.avatarUrl,
    };
    await persistSession('', updated);
  }

  return data.profile;
}

export async function uploadProfileAvatar(input: {
  uri: string;
  name: string;
  type: string;
}): Promise<TauMailProfile> {
  const formData = new FormData();
  formData.append('file', {
    uri: input.uri,
    name: input.name,
    type: input.type || 'image/jpeg',
  } as unknown as Blob);

  const res = await tauMobileFetch('/api/taumail/profile/avatar', {
    method: 'POST',
    headers: await authHeaders(),
    body: formData,
  });
  const data = (await res.json()) as { profile?: TauMailProfile; error?: string };
  if (!res.ok || !data.profile) throw new Error(data.error || 'Failed to upload avatar');

  const stored = await getStoredUser();
  if (stored) {
    const updated: TauSessionUser = {
      ...stored,
      avatarUrl: data.profile.avatarUrl ?? null,
      fullName: data.profile.fullName || stored.fullName,
    };
    await persistSession('', updated);
  }

  return data.profile;
}

export async function removeProfileAvatar(): Promise<void> {
  const res = await tauMobileFetch('/api/taumail/profile/avatar', {
    method: 'DELETE',
    headers: await jsonAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to remove avatar');

  const stored = await getStoredUser();
  if (stored) {
    await persistSession('', { ...stored, avatarUrl: null });
  }
}
