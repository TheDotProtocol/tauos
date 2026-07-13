import { getPool } from '@/lib/db-pool';
import {
  getSupabaseStorageConfig,
  uploadObject,
  deleteObject,
  createSignedDownloadUrl,
} from '@/lib/supabase-storage';

export const DEFAULT_QUOTA_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

function uid(userId: string | number): string {
  return String(userId);
}

export function buildStoragePath(
  userId: string | number,
  folder: string,
  fileName: string
): string {
  const safeFolder = (folder || 'root').replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${userId}/${safeFolder}/${fileName}`;
}

export function getStorageConfigOrThrow() {
  const cfg = getSupabaseStorageConfig();
  if (!cfg) {
    throw new Error('Supabase Storage is not configured');
  }
  return cfg;
}

export async function getUserStorage(userId: string | number) {
  const result = await getPool().query(
    `SELECT id,
            COALESCE(storage_used, storage_used_bytes, 0)::bigint AS storage_used,
            COALESCE(storage_quota, $2)::bigint AS storage_quota
     FROM users WHERE id = $1`,
    [uid(userId), DEFAULT_QUOTA_BYTES]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const row = result.rows[0];
  const used = Number(row.storage_used);
  const limit = Number(row.storage_quota);
  return {
    used,
    limit,
    usedPercent: limit > 0 ? (used / limit) * 100 : 0,
  };
}

export async function uploadUserFile(
  userId: string | number,
  file: File,
  folder: string
) {
  const id = uid(userId);
  const cfg = getStorageConfigOrThrow();
  const storage = await getUserStorage(id);
  const fileSize = file.size;

  if (storage.used + fileSize > storage.limit) {
    throw new Error('Storage quota exceeded');
  }

  const fileId = crypto.randomUUID();
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
  const storedName = `${fileId}.${ext}`;
  const storagePath = buildStoragePath(id, folder, storedName);

  const bytes = await file.arrayBuffer();
  await uploadObject(cfg, storagePath, bytes, file.type || 'application/octet-stream');

  const result = await getPool().query(
    `INSERT INTO taucloud_files
       (id, user_id, original_name, file_name, storage_path, file_size, mime_type, folder, uploaded_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     RETURNING id, original_name, file_size, mime_type, folder, uploaded_at, is_shared`,
    [fileId, id, file.name, storedName, storagePath, fileSize, file.type, folder || 'root']
  );

  await getPool().query(
    `UPDATE users SET
       storage_used = COALESCE(storage_used, storage_used_bytes, 0) + $1,
       storage_used_bytes = COALESCE(storage_used_bytes, storage_used, 0) + $1
     WHERE id = $2`,
    [fileSize, id]
  );

  return result.rows[0];
}

export async function listUserFiles(userId: string | number, folder: string) {
  const result = await getPool().query(
    `SELECT id, original_name, file_name, file_size, mime_type, folder, uploaded_at, is_shared
     FROM taucloud_files
     WHERE user_id = $1 AND folder = $2
     ORDER BY uploaded_at DESC`,
    [uid(userId), folder || 'root']
  );
  return result.rows;
}

export async function deleteUserFile(userId: string | number, fileId: string) {
  const id = uid(userId);
  const cfg = getStorageConfigOrThrow();
  const result = await getPool().query(
    `SELECT id, storage_path, file_size FROM taucloud_files WHERE id = $1 AND user_id = $2`,
    [fileId, id]
  );

  if (result.rows.length === 0) {
    throw new Error('File not found');
  }

  const file = result.rows[0];
  await deleteObject(cfg, file.storage_path);
  await getPool().query('DELETE FROM taucloud_files WHERE id = $1', [fileId]);
  await getPool().query(
    `UPDATE users SET
       storage_used = GREATEST(COALESCE(storage_used, storage_used_bytes, 0) - $1, 0),
       storage_used_bytes = GREATEST(COALESCE(storage_used_bytes, storage_used, 0) - $1, 0)
     WHERE id = $2`,
    [file.file_size, id]
  );

  return { id: file.id };
}

export async function getDownloadUrl(userId: string | number, fileId: string) {
  const id = uid(userId);
  const cfg = getStorageConfigOrThrow();
  const result = await getPool().query(
    `SELECT id, original_name, storage_path FROM taucloud_files WHERE id = $1 AND user_id = $2`,
    [fileId, id]
  );

  if (result.rows.length === 0) {
    throw new Error('File not found');
  }

  const file = result.rows[0];
  const url = await createSignedDownloadUrl(cfg, file.storage_path);
  return { url, name: file.original_name };
}

export async function createShareLink(userId: string | number, fileId: string, expiresInHours = 168) {
  const id = uid(userId);
  const fileResult = await getPool().query(
    `SELECT id, original_name FROM taucloud_files WHERE id = $1 AND user_id = $2`,
    [fileId, id]
  );

  if (fileResult.rows.length === 0) {
    throw new Error('File not found');
  }

  const token = crypto.randomUUID().replace(/-/g, '');
  const expiresAt = new Date(Date.now() + expiresInHours * 3600 * 1000);

  await getPool().query(
    `INSERT INTO taucloud_shares (file_id, token, expires_at) VALUES ($1, $2, $3)`,
    [fileId, token, expiresAt]
  );

  await getPool().query('UPDATE taucloud_files SET is_shared = true WHERE id = $1', [fileId]);

  return {
    token,
    url: `/taucloud/shared/${token}`,
    expiresAt: expiresAt.toISOString(),
    fileName: fileResult.rows[0].original_name,
  };
}

export async function getSharedFile(token: string) {
  const result = await getPool().query(
    `SELECT s.token, s.expires_at, s.password_hash, s.download_count,
            f.id, f.original_name, f.file_size, f.mime_type, f.storage_path, f.uploaded_at
     FROM taucloud_shares s
     JOIN taucloud_files f ON f.id = s.file_id
     WHERE s.token = $1`,
    [token]
  );

  if (result.rows.length === 0) {
    throw new Error('Share link not found');
  }

  const row = result.rows[0];
  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    throw new Error('Share link expired');
  }

  return row;
}

export async function getSharedDownloadUrl(token: string) {
  const row = await getSharedFile(token);
  const cfg = getStorageConfigOrThrow();
  const url = await createSignedDownloadUrl(cfg, row.storage_path);

  await getPool().query(
    'UPDATE taucloud_shares SET download_count = COALESCE(download_count, 0) + 1 WHERE token = $1',
    [token]
  );

  return { url, name: row.original_name };
}
