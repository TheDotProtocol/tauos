import { getPool } from '@/lib/db-pool';
import {
  createSignedDownloadUrl,
  deleteObject,
  getSupabaseStorageConfig,
  uploadObject,
} from '@/lib/supabase-storage';

function uid(userId: string | number): string {
  return String(userId);
}

export type TauMailProfileRow = {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  job_title: string | null;
  timezone: string | null;
  avatar_url: string | null;
  organization_name: string | null;
};

export async function getTauMailProfileRow(userId: string | number): Promise<TauMailProfileRow | null> {
  const result = await getPool().query(
    `SELECT u.id, u.username, u.email, u.full_name, u.display_name, u.job_title,
            u.timezone, u.avatar_url, o.name AS organization_name
     FROM users u
     LEFT JOIN organizations o ON u.organization_id = o.id
     WHERE u.id = $1`,
    [uid(userId)],
  );
  return result.rows[0] ?? null;
}

export function mapTauMailProfile(row: TauMailProfileRow) {
  return {
    fullName: row.full_name || '',
    displayName: row.display_name || row.username || '',
    email: row.email || '',
    organization: row.organization_name || '',
    title: row.job_title || '',
    timezone: row.timezone || '(UTC-05:00) Eastern Time (US & Canada)',
    avatarUrl: row.avatar_url || null,
  };
}

export async function uploadTauMailAvatar(userId: string | number, file: File) {
  const cfg = getSupabaseStorageConfig();
  if (!cfg) {
    throw new Error('Avatar storage is not configured on the server');
  }

  const id = uid(userId);
  const ext = file.type.includes('png') ? 'png' : file.type.includes('webp') ? 'webp' : 'jpg';
  const objectPath = `taumail/avatars/${id}.${ext}`;
  const data = await file.arrayBuffer();
  await uploadObject(cfg, objectPath, data, file.type || 'image/jpeg');

  await getPool().query('UPDATE users SET avatar_url = $2 WHERE id = $1', [id, objectPath]);
  const signed = await createSignedDownloadUrl(cfg, objectPath, 60 * 60 * 24 * 7);
  return { path: objectPath, avatarUrl: signed };
}

export async function resolveTauMailAvatarUrl(
  userId: string | number,
  avatarUrl: string | null,
): Promise<string | null> {
  if (!avatarUrl) return null;

  const cfg = getSupabaseStorageConfig();
  if (!cfg) return avatarUrl.startsWith('http') ? avatarUrl : null;

  if (avatarUrl.startsWith('http')) {
    const fromUrl = avatarUrl.match(/taumail\/avatars\/[^/?]+/);
    if (!fromUrl) return avatarUrl;
    try {
      return await createSignedDownloadUrl(cfg, fromUrl[0], 60 * 60 * 24 * 7);
    } catch {
      return avatarUrl;
    }
  }

  try {
    return await createSignedDownloadUrl(cfg, avatarUrl, 60 * 60 * 24 * 7);
  } catch {
    return null;
  }
}

export async function mapTauMailProfileAsync(row: TauMailProfileRow) {
  return {
    fullName: row.full_name || '',
    displayName: row.display_name || row.username || '',
    email: row.email || '',
    organization: row.organization_name || '',
    title: row.job_title || '',
    timezone: row.timezone || '(UTC-05:00) Eastern Time (US & Canada)',
    avatarUrl: await resolveTauMailAvatarUrl(row.id, row.avatar_url),
  };
}

export async function deleteTauMailAvatar(userId: string | number) {
  const id = uid(userId);
  const cfg = getSupabaseStorageConfig();
  if (cfg) {
    for (const ext of ['jpg', 'png', 'webp']) {
      try {
        await deleteObject(cfg, `taumail/avatars/${id}.${ext}`);
      } catch {
        /* ignore missing object */
      }
    }
  }
  await getPool().query('UPDATE users SET avatar_url = NULL WHERE id = $1', [id]);
}
