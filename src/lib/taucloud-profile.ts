import { getPool } from '@/lib/db-pool';
import {
  createSignedDownloadUrl,
  deleteObject,
  ensureStorageBucket,
  getSupabaseStorageConfig,
  uploadObject,
} from '@/lib/supabase-storage';
import { isAllowedAvatarImage } from '@/lib/taumail/profile-server';

export { isAllowedAvatarImage };

function uid(userId: string | number): string {
  return String(userId);
}

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

export async function resolveTauCloudAvatarUrl(
  userId: string | number,
  avatarUrl: string | null,
): Promise<string | null> {
  if (!avatarUrl) return null;

  const cfg = getSupabaseStorageConfig();
  if (!cfg) return avatarUrl.startsWith('http') ? avatarUrl : null;

  if (avatarUrl.startsWith('http')) {
    const match = avatarUrl.match(/(?:taumail|taucloud|tautalk)\/avatars\/[^/?]+/);
    if (!match) return avatarUrl;
    try {
      return await createSignedDownloadUrl(cfg, match[0], 60 * 60 * 24 * 7);
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

export async function uploadTauCloudAvatar(userId: string | number, file: File) {
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
  const objectPath = `taucloud/avatars/${id}.${ext}`;
  const data = await file.arrayBuffer();
  await uploadObject(cfg, objectPath, data, resolveImageMime(file));

  await getPool().query('UPDATE users SET avatar_url = $2 WHERE id = $1', [id, objectPath]);
  const signed = await createSignedDownloadUrl(cfg, objectPath, 60 * 60 * 24 * 7);
  return { path: objectPath, avatarUrl: signed };
}

export async function deleteTauCloudAvatar(userId: string | number) {
  const id = uid(userId);
  const cfg = getSupabaseStorageConfig();
  if (cfg) {
    for (const prefix of ['taucloud/avatars', 'taumail/avatars', 'tautalk/avatars']) {
      for (const ext of ['jpg', 'png', 'webp']) {
        try {
          await deleteObject(cfg, `${prefix}/${id}.${ext}`);
        } catch {
          /* ignore missing object */
        }
      }
    }
  }
  await getPool().query('UPDATE users SET avatar_url = NULL WHERE id = $1', [id]);
}
