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
  const spaces = await getPool().query(
    `SELECT id FROM taubrowser_spaces WHERE user_id = $1 LIMIT 1`,
    [id]
  );
  if (spaces.rows.length === 0) {
    const space = await getPool().query(
      `INSERT INTO taubrowser_spaces (user_id, name, color, icon, sort_order, homepage)
       VALUES ($1, 'Personal', '#facc15', '🌐', 0, 'https://www.tauos.org')
       RETURNING id`,
      [id]
    );
    await getPool().query(
      `INSERT INTO taubrowser_tabs (space_id, user_id, url, title, sort_order, is_active)
       VALUES ($1, $2, 'https://www.tauos.org', 'New Tab', 0, true)`,
      [space.rows[0].id, id]
    );
  }
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
  const [bookmarks, history, settings, privacy, spaces, tabs] = await Promise.all([
    listBookmarks(userId),
    listHistory(userId, 200),
    getSettings(userId),
    getPrivacyStats(userId),
    listSpaces(userId),
    listTabs(userId),
  ]);
  return { bookmarks, history, settings, privacy, spaces, tabs };
}

export async function listSpaces(userId: string | number) {
  await ensureBrowserProfile(userId);
  const result = await getPool().query(
    `SELECT id, name, color, icon, sort_order, homepage, created_at
     FROM taubrowser_spaces WHERE user_id = $1 ORDER BY sort_order ASC, created_at ASC`,
    [uid(userId)]
  );
  return result.rows;
}

export async function createSpace(
  userId: string | number,
  data: { name: string; color?: string; icon?: string; homepage?: string }
) {
  const id = uid(userId);
  const count = await getPool().query(
    `SELECT COUNT(*)::int AS c FROM taubrowser_spaces WHERE user_id = $1`,
    [id]
  );
  const result = await getPool().query(
    `INSERT INTO taubrowser_spaces (user_id, name, color, icon, sort_order, homepage)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, color, icon, sort_order, homepage, created_at`,
    [
      id,
      data.name,
      data.color ?? '#facc15',
      data.icon ?? '🌐',
      count.rows[0].c,
      data.homepage ?? 'https://www.tauos.org',
    ]
  );
  const spaceId = result.rows[0].id;
  await getPool().query(
    `INSERT INTO taubrowser_tabs (space_id, user_id, url, title, sort_order, is_active)
     VALUES ($1, $2, $3, 'New Tab', 0, true)`,
    [spaceId, id, data.homepage ?? 'https://www.tauos.org']
  );
  return result.rows[0];
}

export async function updateSpace(
  userId: string | number,
  spaceId: string,
  patch: { name?: string; color?: string; icon?: string; homepage?: string; sort_order?: number }
) {
  const current = await getPool().query(
    `SELECT * FROM taubrowser_spaces WHERE id = $1 AND user_id = $2`,
    [spaceId, uid(userId)]
  );
  if (current.rows.length === 0) throw new Error('Space not found');
  const row = current.rows[0];
  const result = await getPool().query(
    `UPDATE taubrowser_spaces SET
       name = $3, color = $4, icon = $5, homepage = $6, sort_order = $7
     WHERE id = $1 AND user_id = $2
     RETURNING id, name, color, icon, sort_order, homepage, created_at`,
    [
      spaceId,
      uid(userId),
      patch.name ?? row.name,
      patch.color ?? row.color,
      patch.icon ?? row.icon,
      patch.homepage ?? row.homepage,
      patch.sort_order ?? row.sort_order,
    ]
  );
  return result.rows[0];
}

export async function deleteSpace(userId: string | number, spaceId: string) {
  const count = await getPool().query(
    `SELECT COUNT(*)::int AS c FROM taubrowser_spaces WHERE user_id = $1`,
    [uid(userId)]
  );
  if (count.rows[0].c <= 1) throw new Error('Cannot delete last space');
  const result = await getPool().query(
    `DELETE FROM taubrowser_spaces WHERE id = $1 AND user_id = $2 RETURNING id`,
    [spaceId, uid(userId)]
  );
  if (result.rows.length === 0) throw new Error('Space not found');
  return { id: spaceId };
}

export async function listTabs(userId: string | number, spaceId?: string) {
  await ensureBrowserProfile(userId);
  if (spaceId) {
    const result = await getPool().query(
      `SELECT id, space_id, url, title, sort_order, is_active, created_at
       FROM taubrowser_tabs WHERE user_id = $1 AND space_id = $2
       ORDER BY sort_order ASC, created_at ASC`,
      [uid(userId), spaceId]
    );
    return result.rows;
  }
  const result = await getPool().query(
    `SELECT id, space_id, url, title, sort_order, is_active, created_at
     FROM taubrowser_tabs WHERE user_id = $1 ORDER BY sort_order ASC, created_at ASC`,
    [uid(userId)]
  );
  return result.rows;
}

export async function createTab(
  userId: string | number,
  data: { space_id: string; url?: string; title?: string }
) {
  const id = uid(userId);
  await getPool().query(
    `UPDATE taubrowser_tabs SET is_active = false WHERE user_id = $1 AND space_id = $2`,
    [id, data.space_id]
  );
  const count = await getPool().query(
    `SELECT COUNT(*)::int AS c FROM taubrowser_tabs WHERE user_id = $1 AND space_id = $2`,
    [id, data.space_id]
  );
  const result = await getPool().query(
    `INSERT INTO taubrowser_tabs (space_id, user_id, url, title, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5, true)
     RETURNING id, space_id, url, title, sort_order, is_active, created_at`,
    [
      data.space_id,
      id,
      data.url ?? 'https://www.tauos.org',
      data.title ?? 'New Tab',
      count.rows[0].c,
    ]
  );
  return result.rows[0];
}

export async function updateTab(
  userId: string | number,
  tabId: string,
  patch: { url?: string; title?: string; is_active?: boolean; sort_order?: number }
) {
  const current = await getPool().query(
    `SELECT * FROM taubrowser_tabs WHERE id = $1 AND user_id = $2`,
    [tabId, uid(userId)]
  );
  if (current.rows.length === 0) throw new Error('Tab not found');
  const row = current.rows[0];
  if (patch.is_active) {
    await getPool().query(
      `UPDATE taubrowser_tabs SET is_active = false WHERE user_id = $1 AND space_id = $2`,
      [uid(userId), row.space_id]
    );
  }
  const result = await getPool().query(
    `UPDATE taubrowser_tabs SET
       url = $3, title = $4, is_active = $5, sort_order = $6
     WHERE id = $1 AND user_id = $2
     RETURNING id, space_id, url, title, sort_order, is_active, created_at`,
    [
      tabId,
      uid(userId),
      patch.url ?? row.url,
      patch.title ?? row.title,
      patch.is_active ?? row.is_active,
      patch.sort_order ?? row.sort_order,
    ]
  );
  return result.rows[0];
}

export async function deleteTab(userId: string | number, tabId: string) {
  const tab = await getPool().query(
    `SELECT space_id FROM taubrowser_tabs WHERE id = $1 AND user_id = $2`,
    [tabId, uid(userId)]
  );
  if (tab.rows.length === 0) throw new Error('Tab not found');
  const spaceId = tab.rows[0].space_id;
  const count = await getPool().query(
    `SELECT COUNT(*)::int AS c FROM taubrowser_tabs WHERE user_id = $1 AND space_id = $2`,
    [uid(userId), spaceId]
  );
  if (count.rows[0].c <= 1) throw new Error('Cannot delete last tab in space');
  await getPool().query(`DELETE FROM taubrowser_tabs WHERE id = $1 AND user_id = $2`, [
    tabId,
    uid(userId),
  ]);
  const active = await getPool().query(
    `SELECT id FROM taubrowser_tabs WHERE user_id = $1 AND space_id = $2 AND is_active = true LIMIT 1`,
    [uid(userId), spaceId]
  );
  if (active.rows.length === 0) {
    await getPool().query(
      `UPDATE taubrowser_tabs SET is_active = true
       WHERE id = (SELECT id FROM taubrowser_tabs WHERE user_id = $1 AND space_id = $2 ORDER BY sort_order LIMIT 1)`,
      [uid(userId), spaceId]
    );
  }
  return { id: tabId };
}
