import { getPool } from '@/lib/db-pool';

function uid(userId: string | number): string {
  return String(userId);
}

export type BrowserSettings = {
  block_ads: boolean;
  block_trackers: boolean;
  fingerprint_protection: boolean;
  https_only: boolean;
  do_not_track: boolean;
  clear_on_exit: boolean;
  search_engine: string;
  homepage: string;
};

const DEFAULT_SETTINGS: BrowserSettings = {
  block_ads: true,
  block_trackers: true,
  fingerprint_protection: true,
  https_only: true,
  do_not_track: true,
  clear_on_exit: false,
  search_engine: 'duckduckgo',
  homepage: 'https://www.tauos.org',
};

export async function ensureBrowserProfile(userId: string | number) {
  const id = uid(userId);
  await getPool().query(
    `INSERT INTO taubrowser_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
    [id]
  );
  await getPool().query(
    `INSERT INTO taubrowser_privacy_stats (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
    [id]
  );
}

export async function listBookmarks(userId: string | number) {
  const result = await getPool().query(
    `SELECT id, title, url, favicon, folder, created_at
     FROM taubrowser_bookmarks WHERE user_id = $1 ORDER BY created_at DESC`,
    [uid(userId)]
  );
  return result.rows;
}

export async function addBookmark(
  userId: string | number,
  data: { title: string; url: string; favicon?: string; folder?: string }
) {
  const result = await getPool().query(
    `INSERT INTO taubrowser_bookmarks (user_id, title, url, favicon, folder)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, title, url, favicon, folder, created_at`,
    [uid(userId), data.title, data.url, data.favicon ?? null, data.folder ?? 'default']
  );
  return result.rows[0];
}

export async function deleteBookmark(userId: string | number, bookmarkId: string) {
  const result = await getPool().query(
    `DELETE FROM taubrowser_bookmarks WHERE id = $1 AND user_id = $2 RETURNING id`,
    [bookmarkId, uid(userId)]
  );
  if (result.rows.length === 0) throw new Error('Bookmark not found');
  return { id: bookmarkId };
}

export async function listHistory(userId: string | number, limit = 100) {
  const result = await getPool().query(
    `SELECT id, title, url, visited_at FROM taubrowser_history
     WHERE user_id = $1 ORDER BY visited_at DESC LIMIT $2`,
    [uid(userId), limit]
  );
  return result.rows;
}

export async function addHistoryEntry(
  userId: string | number,
  data: { title?: string; url: string }
) {
  const result = await getPool().query(
    `INSERT INTO taubrowser_history (user_id, title, url) VALUES ($1, $2, $3)
     RETURNING id, title, url, visited_at`,
    [uid(userId), data.title ?? null, data.url]
  );
  return result.rows[0];
}

export async function clearHistory(userId: string | number) {
  await getPool().query(`DELETE FROM taubrowser_history WHERE user_id = $1`, [uid(userId)]);
  return { cleared: true };
}

export async function getSettings(userId: string | number): Promise<BrowserSettings> {
  await ensureBrowserProfile(userId);
  const result = await getPool().query(
    `SELECT block_ads, block_trackers, fingerprint_protection, https_only,
            do_not_track, clear_on_exit, search_engine, homepage
     FROM taubrowser_settings WHERE user_id = $1`,
    [uid(userId)]
  );
  return result.rows[0] ?? DEFAULT_SETTINGS;
}

export async function updateSettings(userId: string | number, patch: Partial<BrowserSettings>) {
  await ensureBrowserProfile(userId);
  const current = await getSettings(userId);
  const next = { ...current, ...patch };
  await getPool().query(
    `UPDATE taubrowser_settings SET
       block_ads = $2, block_trackers = $3, fingerprint_protection = $4,
       https_only = $5, do_not_track = $6, clear_on_exit = $7,
       search_engine = $8, homepage = $9, updated_at = NOW()
     WHERE user_id = $1`,
    [
      uid(userId),
      next.block_ads,
      next.block_trackers,
      next.fingerprint_protection,
      next.https_only,
      next.do_not_track,
      next.clear_on_exit,
      next.search_engine,
      next.homepage,
    ]
  );
  return next;
}

export async function getPrivacyStats(userId: string | number) {
  await ensureBrowserProfile(userId);
  const result = await getPool().query(
    `SELECT blocked_ads, blocked_trackers, blocked_requests, data_saved_bytes, updated_at
     FROM taubrowser_privacy_stats WHERE user_id = $1`,
    [uid(userId)]
  );
  const row = result.rows[0] ?? {
    blocked_ads: 0,
    blocked_trackers: 0,
    blocked_requests: 0,
    data_saved_bytes: 0,
  };
  return {
    blockedAds: Number(row.blocked_ads),
    blockedTrackers: Number(row.blocked_trackers),
    blockedRequests: Number(row.blocked_requests),
    dataSavedBytes: Number(row.data_saved_bytes),
    updatedAt: row.updated_at,
    privacyScore: 100,
  };
}

export async function incrementPrivacyStats(
  userId: string | number,
  delta: { ads?: number; trackers?: number; requests?: number; bytes?: number }
) {
  await ensureBrowserProfile(userId);
  await getPool().query(
    `UPDATE taubrowser_privacy_stats SET
       blocked_ads = blocked_ads + $2,
       blocked_trackers = blocked_trackers + $3,
       blocked_requests = blocked_requests + $4,
       data_saved_bytes = data_saved_bytes + $5,
       updated_at = NOW()
     WHERE user_id = $1`,
    [
      uid(userId),
      delta.ads ?? 0,
      delta.trackers ?? 0,
      delta.requests ?? 0,
      delta.bytes ?? 0,
    ]
  );
  return getPrivacyStats(userId);
}

export async function syncAll(userId: string | number) {
  await ensureBrowserProfile(userId);
  const [bookmarks, history, settings, privacy] = await Promise.all([
    listBookmarks(userId),
    listHistory(userId, 200),
    getSettings(userId),
    getPrivacyStats(userId),
  ]);
  return { bookmarks, history, settings, privacy };
}
