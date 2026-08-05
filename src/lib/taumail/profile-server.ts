import { getPool } from '@/lib/db-pool';
import {
  createSignedDownloadUrl,
  deleteObject,
  ensureStorageBucket,
  getSupabaseStorageConfig,
  uploadObject,
} from '@/lib/supabase-storage';

function resolveImageMime(file: File): string {
  if (file.type.startsWith('image/')) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.webp')) return 'image/webp';
  if (name.endsWith('.gif')) return 'image/gif';
  if (name.endsWith('.heic') || name.endsWith('.heif')) return 'image/heic';
  return 'image/jpeg';
}

function imageExtensionFromFile(file: File): 'png' | 'webp' | 'jpg' {
  const mime = resolveImageMime(file);
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  return 'jpg';
}

export function isAllowedAvatarImage(file: File): boolean {
  if (file.type.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name);
}

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
  if (!isAllowedAvatarImage(file)) {
    throw new Error('Avatar must be a PNG, JPG, WEBP, or HEIC image');
  }

  await ensureStorageBucket(cfg);

  const id = uid(userId);
  const ext = imageExtensionFromFile(file);
  const objectPath = `taumail/avatars/${id}.${ext}`;
  const data = await file.arrayBuffer();
  await uploadObject(cfg, objectPath, data, resolveImageMime(file));

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
