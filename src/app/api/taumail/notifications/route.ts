import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { ensureDefaultWorkspaceData } from '@/lib/taumail/schema';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function formatMeta(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const mins = Math.max(1, Math.floor(diffMs / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();
    await ensureDefaultWorkspaceData(pool, userId);
    const result = await pool.query(
      `SELECT id, title, meta, tone, is_read, created_at
       FROM taumail_notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId],
    );
    const notifications = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      meta: formatMeta(row.created_at),
      tone: row.tone || 'info',
      isRead: row.is_read,
    }));
    return NextResponse.json({ success: true, notifications });
  });
}

export async function PATCH(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { id, isRead, markAllRead } = await request.json();
    if (markAllRead) {
      await getPool().query(
        'UPDATE taumail_notifications SET is_read = true WHERE user_id = $1',
        [userId],
      );
      return NextResponse.json({ success: true });
    }
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    const result = await getPool().query(
      `UPDATE taumail_notifications SET is_read = COALESCE($3, is_read)
       WHERE id = $1 AND user_id = $2
       RETURNING id, title, meta, tone, is_read, created_at`,
      [id, userId, isRead],
    );
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, notification: result.rows[0] });
  });
}
