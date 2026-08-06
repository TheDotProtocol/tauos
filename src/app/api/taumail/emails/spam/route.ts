import { withTauMailAuth } from '@/lib/taumail/api-route';
import { getPool } from '@/app/api/taumail/middleware/security';
import { stripAttachmentContentForList } from '@/lib/taumail-inbound';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    try {
      const result = await getPool().query(
        `SELECT ie.*, u.username as sender_username 
         FROM incoming_emails ie 
         LEFT JOIN users u ON ie.from_email = u.email 
         WHERE ie.user_id = $1 AND ie.is_spam = true 
         ORDER BY ie.received_at DESC`,
        [userId]
      );

      return NextResponse.json({
        success: true,
        emails: result.rows.map((row) => ({
          ...row,
          attachments: stripAttachmentContentForList(row.attachments),
        })),
      });
    } catch (error) {
      console.error('TauMail Spam Error:', error);
      return NextResponse.json({ error: 'Failed to load spam' }, { status: 500 });
    }
  });
}
