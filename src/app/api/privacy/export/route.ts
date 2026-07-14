import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';
import { logAudit } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const uid = String(auth.userId);

    const [user, mail, cloud, browser, talk, profiles] = await Promise.all([
      getPool().query(
        `SELECT id, username, email, full_name, created_at, last_login_at
         FROM users WHERE id = $1`,
        [uid]
      ),
      getPool().query(
        'SELECT id, subject, from_address, created_at FROM mail_messages WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
        [uid]
      ).catch(() => ({ rows: [] })),
      getPool().query(
        'SELECT id, original_name, size_bytes, mime_type, created_at FROM taucloud_files WHERE user_id = $1 AND deleted_at IS NULL',
        [uid]
      ).catch(() => ({ rows: [] })),
      getPool().query(
        'SELECT id, title, url, created_at FROM taubrowser_bookmarks WHERE user_id = $1',
        [uid]
      ).catch(() => ({ rows: [] })),
      getPool().query(
        `SELECT c.id, c.type, c.title FROM tautalk_conversations c
         JOIN tautalk_participants p ON p.conversation_id = c.id WHERE p.user_id = $1`,
        [uid]
      ).catch(() => ({ rows: [] })),
      getPool().query(
        'SELECT id, profile_name, profile_type, created_at FROM tauid_identity_profiles WHERE user_id = $1',
        [uid]
      ).catch(() => ({ rows: [] })),
    ]);

    const bundle = {
      exportedAt: new Date().toISOString(),
      format: 'tauos-gdpr-export-v1',
      user: user.rows[0] ?? null,
      mail: mail.rows,
      cloud: cloud.rows,
      browserBookmarks: browser.rows,
      talkConversations: talk.rows,
      identityProfiles: profiles.rows,
    };

    await logAudit({
      userId: uid,
      action: 'dsr.export',
      resource: 'user_data',
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    });

    return NextResponse.json({ success: true, data: bundle });
  } catch (error) {
    console.error('Privacy export:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
