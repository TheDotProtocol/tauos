import { getPool } from '@/lib/db-pool';
import {
  getSupabaseStorageConfig,
  uploadObject,
  createSignedDownloadUrl,
  deleteObject,
} from '@/lib/supabase-storage';
import { randomUUID } from 'crypto';

function uid(userId: string | number): string {
  return String(userId);
}

export type TalkProfile = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
};

export async function getTalkProfile(userId: string | number): Promise<TalkProfile | null> {
  const result = await getPool().query(
    `SELECT id, username, email, full_name, phone, avatar_url
     FROM users WHERE id = $1 AND is_active = true`,
    [uid(userId)]
  );
  return result.rows[0] ?? null;
}

export async function updateTalkProfile(
  userId: string | number,
  updates: { username?: string; fullName?: string }
) {
  const id = uid(userId);
  if (updates.username) {
    const taken = await getPool().query(
      `SELECT id FROM users WHERE username = $1 AND id <> $2`,
      [updates.username, id]
    );
    if (taken.rows.length > 0) {
      throw new Error('Username already taken');
    }
  }

  const result = await getPool().query(
    `UPDATE users SET
       username = COALESCE($2, username),
       full_name = COALESCE($3, full_name)
     WHERE id = $1
     RETURNING id, username, email, full_name, phone, avatar_url`,
    [id, updates.username ?? null, updates.fullName ?? null]
  );
  return result.rows[0] as TalkProfile;
}

export async function setTalkAvatar(userId: string | number, avatarPath: string) {
  const publicPath = avatarPath.startsWith('http') ? avatarPath : avatarPath;
  const result = await getPool().query(
    `UPDATE users SET avatar_url = $2 WHERE id = $1
     RETURNING id, username, email, full_name, phone, avatar_url`,
    [uid(userId), publicPath]
  );
  return result.rows[0] as TalkProfile;
}

export async function uploadTalkFile(
  userId: string | number,
  file: File,
  folder = 'attachments'
): Promise<{ path: string; mime: string; size: number; name: string }> {
  const cfg = getSupabaseStorageConfig();
  if (!cfg) {
    throw new Error('File storage is not configured on the server');
  }

  const id = uid(userId);
  const safeName = (file.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
  const objectPath = `tautalk/${folder}/${id}/${randomUUID()}-${safeName}`;
  const data = await file.arrayBuffer();
  await uploadObject(cfg, objectPath, data, file.type || 'application/octet-stream');

  return {
    path: objectPath,
    mime: file.type || 'application/octet-stream',
    size: file.size,
    name: file.name || safeName,
  };
}

export async function uploadTalkAvatar(userId: string | number, file: File) {
  const cfg = getSupabaseStorageConfig();
  if (!cfg) {
    throw new Error('Avatar storage is not configured on the server');
  }

  const id = uid(userId);
  const ext = file.type.includes('png') ? 'png' : 'jpg';
  const objectPath = `tautalk/avatars/${id}.${ext}`;
  const data = await file.arrayBuffer();
  await uploadObject(cfg, objectPath, data, file.type || 'image/jpeg');

  const signed = await createSignedDownloadUrl(cfg, objectPath, 60 * 60 * 24 * 7);
  await setTalkAvatar(id, signed);
  return { path: objectPath, avatarUrl: signed };
}

export async function signedTalkFileUrl(objectPath: string, expiresIn = 3600) {
  const cfg = getSupabaseStorageConfig();
  if (!cfg) throw new Error('File storage is not configured');
  if (!objectPath.startsWith('tautalk/')) {
    throw new Error('Invalid attachment path');
  }
  return createSignedDownloadUrl(cfg, objectPath, expiresIn);
}

export async function deleteTalkAvatar(userId: string | number) {
  const id = uid(userId);
  const cfg = getSupabaseStorageConfig();
  if (cfg) {
    for (const ext of ['jpg', 'png', 'webp']) {
      try {
        await deleteObject(cfg, `tautalk/avatars/${id}.${ext}`);
      } catch {
        /* ignore */
      }
    }
  }
  await getPool().query(`UPDATE users SET avatar_url = NULL WHERE id = $1`, [id]);
}
