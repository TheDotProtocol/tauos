import { withTauMailAuth } from '@/lib/taumail/api-route';
import { getPool } from '@/app/api/taumail/middleware/security';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    try {
      const result = await getPool().query(
        `SELECT se.*, u.username as sender_username 
         FROM sent_emails se 
         LEFT JOIN users u ON se.user_id = u.id::text 
         WHERE se.user_id = $1 
         ORDER BY se.sent_at DESC`,
        [userId]
      );

      return NextResponse.json({ success: true, emails: result.rows });
    } catch (error) {
      console.error('TauMail Sent Emails Error:', error);
      return NextResponse.json({ error: 'Failed to load sent emails' }, { status: 500 });
    }
  });
}
