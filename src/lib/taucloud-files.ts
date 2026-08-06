import { getPool } from '@/lib/db-pool';
import {
  getSupabaseStorageConfig,
  uploadObject,
  deleteObject,
  createSignedDownloadUrl,
} from '@/lib/supabase-storage';

export const DEFAULT_QUOTA_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

const FILE_SELECT = `id, original_name, file_name, file_size, mime_type, folder, uploaded_at, is_shared, is_starred, deleted_at`;

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

export async function logCloudActivity(
  userId: string | number,
  action: string,
  title: string,
  meta?: string,
  fileId?: string
) {
  await getPool().query(
    `INSERT INTO taucloud_activity (user_id, file_id, action, title, meta)
     VALUES ($1, $2, $3, $4, $5)`,
    [uid(userId), fileId ?? null, action, title, meta ?? null]
  );
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
     RETURNING ${FILE_SELECT}`,
    [fileId, id, file.name, storedName, storagePath, fileSize, file.type, folder || 'root']
  );

  await getPool().query(
    `UPDATE users SET
       storage_used = COALESCE(storage_used, storage_used_bytes, 0) + $1,
       storage_used_bytes = COALESCE(storage_used_bytes, storage_used, 0) + $1
     WHERE id = $2`,
    [fileSize, id]
  );

  await logCloudActivity(id, 'upload', `Ingested: ${file.name}`, 'Via Web Portal', fileId);

  return result.rows[0];
}

export async function listUserFiles(userId: string | number, folder: string) {
  const result = await getPool().query(
    `SELECT ${FILE_SELECT}
     FROM taucloud_files
     WHERE user_id = $1 AND folder = $2 AND deleted_at IS NULL
     ORDER BY uploaded_at DESC`,
    [uid(userId), folder || 'root']
  );
  return result.rows;
}

export async function listRecentFiles(userId: string | number, limit = 12) {
  const result = await getPool().query(
    `SELECT ${FILE_SELECT}
     FROM taucloud_files
     WHERE user_id = $1 AND deleted_at IS NULL
     ORDER BY uploaded_at DESC
     LIMIT $2`,
    [uid(userId), limit]
  );
  return result.rows;
}

export async function listStarredFiles(userId: string | number, limit = 50) {
  const result = await getPool().query(
    `SELECT ${FILE_SELECT}
     FROM taucloud_files
     WHERE user_id = $1 AND deleted_at IS NULL AND is_starred = true
     ORDER BY uploaded_at DESC
     LIMIT $2`,
    [uid(userId), limit]
  );
  return result.rows;
}

export async function listSharedFiles(userId: string | number) {
  const result = await getPool().query(
    `SELECT ${FILE_SELECT}
     FROM taucloud_files f
     WHERE f.user_id = $1
       AND f.deleted_at IS NULL
       AND EXISTS (
         SELECT 1 FROM taucloud_shares s
         WHERE s.file_id = f.id AND (s.expires_at IS NULL OR s.expires_at > NOW())
       )
     ORDER BY f.uploaded_at DESC`,
    [uid(userId)]
  );
  return result.rows;
}

export async function listTrashFiles(userId: string | number) {
  const result = await getPool().query(
    `SELECT ${FILE_SELECT}
     FROM taucloud_files
     WHERE user_id = $1 AND deleted_at IS NOT NULL
     ORDER BY deleted_at DESC`,
    [uid(userId)]
  );
  return result.rows;
}

export async function getUserFileById(userId: string | number, fileId: string) {
  const result = await getPool().query(
    `SELECT id, original_name, file_name, file_size, mime_type, folder, uploaded_at, is_shared, is_starred, deleted_at, storage_path
     FROM taucloud_files
     WHERE id = $1 AND user_id = $2`,
    [fileId, uid(userId)]
  );

  if (result.rows.length === 0) {
    throw new Error('File not found');
  }

  return result.rows[0];
}

export async function getFilePreviewUrl(userId: string | number, fileId: string) {
  const file = await getUserFileById(userId, fileId);
  if (file.deleted_at) {
    throw new Error('File is in trash');
  }
  const cfg = getStorageConfigOrThrow();
  const url = await createSignedDownloadUrl(cfg, file.storage_path);
  return { url, file };
}

async function refreshFileSharedFlag(fileId: string) {
  const result = await getPool().query(
    `SELECT COUNT(*)::int AS count
     FROM taucloud_shares s
     WHERE s.file_id = $1 AND (s.expires_at IS NULL OR s.expires_at > NOW())`,
    [fileId]
  );
  const isShared = Number(result.rows[0]?.count || 0) > 0;
  await getPool().query('UPDATE taucloud_files SET is_shared = $2 WHERE id = $1', [fileId, isShared]);
}

export async function softDeleteUserFile(userId: string | number, fileId: string) {
  const id = uid(userId);
  const result = await getPool().query(
    `UPDATE taucloud_files SET deleted_at = NOW()
     WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
     RETURNING id, original_name`,
    [fileId, id]
  );

  if (result.rows.length === 0) {
    throw new Error('File not found');
  }

  const file = result.rows[0];
  await logCloudActivity(id, 'delete', `Moved to trash: ${file.original_name}`, 'Via Web Portal', fileId);
  return { id: file.id };
}

export async function restoreUserFile(userId: string | number, fileId: string) {
  const id = uid(userId);
  const result = await getPool().query(
    `UPDATE taucloud_files SET deleted_at = NULL
     WHERE id = $1 AND user_id = $2 AND deleted_at IS NOT NULL
     RETURNING id, original_name`,
    [fileId, id]
  );

  if (result.rows.length === 0) {
    throw new Error('File not found in trash');
  }

  const file = result.rows[0];
  await logCloudActivity(id, 'restore', `Restored: ${file.original_name}`, 'Via Web Portal', fileId);
  return { id: file.id };
}

export async function deleteUserFile(userId: string | number, fileId: string) {
  const id = uid(userId);
  const cfg = getStorageConfigOrThrow();
  const result = await getPool().query(
    `SELECT id, storage_path, file_size, original_name FROM taucloud_files WHERE id = $1 AND user_id = $2`,
    [fileId, id]
  );

  if (result.rows.length === 0) {
    throw new Error('File not found');
  }

  const file = result.rows[0];
  await deleteObject(cfg, file.storage_path);
  await getPool().query('DELETE FROM taucloud_shares WHERE file_id = $1', [fileId]);
  await getPool().query('DELETE FROM taucloud_files WHERE id = $1', [fileId]);
  await getPool().query(
    `UPDATE users SET
       storage_used = GREATEST(COALESCE(storage_used, storage_used_bytes, 0) - $1, 0),
       storage_used_bytes = GREATEST(COALESCE(storage_used_bytes, storage_used, 0) - $1, 0)
     WHERE id = $2`,
    [file.file_size, id]
  );

  await logCloudActivity(id, 'permanent_delete', `Permanently deleted: ${file.original_name}`, 'Via Web Portal');

  return { id: file.id };
}

export async function getDownloadUrl(userId: string | number, fileId: string) {
  const file = await getUserFileById(userId, fileId);
  if (file.deleted_at) {
    throw new Error('File is in trash');
  }
  const cfg = getStorageConfigOrThrow();
  const url = await createSignedDownloadUrl(cfg, file.storage_path);
  return { url, name: file.original_name };
}

export async function toggleFileStar(userId: string | number, fileId: string, starred?: boolean) {
  const id = uid(userId);
  const current = await getUserFileById(id, fileId);
  if (current.deleted_at) {
    throw new Error('File is in trash');
  }
  const nextStarred = starred ?? !current.is_starred;
  const result = await getPool().query(
    `UPDATE taucloud_files SET is_starred = $3
     WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
     RETURNING ${FILE_SELECT}`,
    [fileId, id, nextStarred]
  );
  if (result.rows.length === 0) {
    throw new Error('File not found');
  }
  const file = result.rows[0];
  await logCloudActivity(
    id,
    nextStarred ? 'star' : 'unstar',
    `${nextStarred ? 'Pinned' : 'Unpinned'}: ${file.original_name}`,
    'Via Web Portal',
    fileId
  );
  return result.rows[0];
}

export async function createShareLink(userId: string | number, fileId: string, expiresInHours = 168) {
  const id = uid(userId);
  const fileResult = await getPool().query(
    `SELECT id, original_name FROM taucloud_files WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
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

  const fileName = fileResult.rows[0].original_name;
  await logCloudActivity(id, 'share', `Authorized: ${fileName}`, 'Via Web Portal', fileId);

  return {
    token,
    url: `/taucloud/shared/${token}`,
    expiresAt: expiresAt.toISOString(),
    fileName,
  };
}

export async function listUserShares(userId: string | number) {
  const result = await getPool().query(
    `SELECT s.id, s.token, s.expires_at, s.download_count, s.created_at,
            f.id AS file_id, f.original_name, f.file_size, f.mime_type, f.uploaded_at
     FROM taucloud_shares s
     INNER JOIN taucloud_files f ON f.id = s.file_id
     WHERE f.user_id = $1 AND f.deleted_at IS NULL
     ORDER BY s.created_at DESC`,
    [uid(userId)]
  );
  return result.rows;
}

export async function revokeShareLink(userId: string | number, shareId: string) {
  const id = uid(userId);
  const result = await getPool().query(
    `SELECT s.id, s.file_id, f.original_name
     FROM taucloud_shares s
     INNER JOIN taucloud_files f ON f.id = s.file_id
     WHERE s.id = $1 AND f.user_id = $2`,
    [shareId, id]
  );

  if (result.rows.length === 0) {
    throw new Error('Share link not found');
  }

  const share = result.rows[0];
  await getPool().query('DELETE FROM taucloud_shares WHERE id = $1', [shareId]);
  await refreshFileSharedFlag(share.file_id);
  await logCloudActivity(id, 'revoke_share', `Revoked share: ${share.original_name}`, 'Via Web Portal', share.file_id);

  return { id: share.id };
}

export async function listUserActivity(userId: string | number, limit = 50) {
  const result = await getPool().query(
    `SELECT id, file_id, action, title, meta, created_at
     FROM taucloud_activity
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [uid(userId), limit]
  );
  return result.rows;
}

export async function listUserFolders(userId: string | number) {
  const id = uid(userId);
  const result = await getPool().query(
    `WITH folder_names AS (
       SELECT name, created_at FROM taucloud_folders WHERE user_id = $1
       UNION
       SELECT DISTINCT folder AS name, MIN(uploaded_at) AS created_at
       FROM taucloud_files
       WHERE user_id = $1 AND deleted_at IS NULL AND folder IS NOT NULL AND folder <> 'root'
       GROUP BY folder
     )
     SELECT fn.name,
            fn.created_at,
            COUNT(tf.id)::int AS file_count,
            COALESCE(SUM(tf.file_size), 0)::bigint AS total_size
     FROM folder_names fn
     LEFT JOIN taucloud_files tf
       ON tf.user_id = $1 AND tf.folder = fn.name AND tf.deleted_at IS NULL
     GROUP BY fn.name, fn.created_at
     ORDER BY fn.name ASC`,
    [id]
  );

  const rootStats = await getPool().query(
    `SELECT COUNT(*)::int AS file_count, COALESCE(SUM(file_size), 0)::bigint AS total_size
     FROM taucloud_files
     WHERE user_id = $1 AND folder = 'root' AND deleted_at IS NULL`,
    [id]
  );

  const rootRow = rootStats.rows[0] || { file_count: 0, total_size: 0 };
  const folders = [
    {
      name: 'root',
      created_at: null,
      file_count: Number(rootRow.file_count),
      total_size: Number(rootRow.total_size),
    },
    ...result.rows.map((row) => ({
      name: row.name,
      created_at: row.created_at,
      file_count: Number(row.file_count),
      total_size: Number(row.total_size),
    })),
  ];

  return folders;
}

export async function getUserStorageBreakdown(userId: string | number) {
  const id = uid(userId);
  const result = await getPool().query(
    `SELECT
       CASE
         WHEN mime_type LIKE 'image/%' THEN 'Images'
         WHEN mime_type LIKE 'video/%' THEN 'Video'
         WHEN mime_type LIKE 'audio/%' THEN 'Audio'
         WHEN mime_type LIKE 'application/pdf%' OR mime_type LIKE '%document%' OR mime_type LIKE '%word%' OR mime_type LIKE '%text%' THEN 'Documents'
         WHEN mime_type LIKE '%zip%' OR mime_type LIKE '%archive%' OR mime_type LIKE '%compressed%' THEN 'Archives'
         ELSE 'Other'
       END AS category,
       COUNT(*)::int AS file_count,
       COALESCE(SUM(file_size), 0)::bigint AS total_size
     FROM taucloud_files
     WHERE user_id = $1 AND deleted_at IS NULL
     GROUP BY category
     ORDER BY total_size DESC`,
    [id]
  );
  return result.rows;
}

export async function createUserFolder(userId: string | number, name: string) {
  const safeName = name.trim().replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, '_');
  if (!safeName || safeName === 'root') {
    throw new Error('Invalid folder name');
  }
  const id = uid(userId);
  const result = await getPool().query(
    `INSERT INTO taucloud_folders (user_id, name)
     VALUES ($1, $2)
     ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name, created_at`,
    [id, safeName]
  );
  await logCloudActivity(id, 'folder_create', `Created folder: ${safeName}`, 'Via Web Portal');
  return result.rows[0];
}

export async function getSharedFile(token: string) {
  const result = await getPool().query(
    `SELECT s.token, s.expires_at, s.password_hash, s.download_count,
            f.id, f.original_name, f.file_size, f.mime_type, f.storage_path, f.uploaded_at
     FROM taucloud_shares s
     JOIN taucloud_files f ON f.id = s.file_id
     WHERE s.token = $1 AND f.deleted_at IS NULL`,
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
