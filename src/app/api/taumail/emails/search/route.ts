import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { stripAttachmentContentForList } from '@/lib/taumail-inbound';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MAX_RESULTS = 50;

function sanitizeQuery(raw: string | null): string {
  return String(raw || '')
    .trim()
    .slice(0, 200);
}

export async function GET(request: NextRequest) {
  try {
    return await withTauMailAuth(request, async (userId) => {
      const q = sanitizeQuery(request.nextUrl.searchParams.get('q'));
      if (!q) {
        return NextResponse.json({ success: true, emails: [], total: 0, query: '' });
      }

      const folder = request.nextUrl.searchParams.get('folder') || 'all';
      const pattern = `%${q.replace(/[%_\\]/g, '\\$&')}%`;
      const pool = getPool();
      const emails: Record<string, unknown>[] = [];

      if (folder === 'inbox' || folder === 'all') {
        const inbox = await pool.query(
          `SELECT ie.id, ie.subject, ie.body, ie.body_html, ie.from_email, ie.sender_name,
                  ie.received_at, ie.is_read, ie.is_spam, ie.is_starred, ie.attachments,
                  COALESCE(ie.sender_name, ie.from_email) AS display_name,
                  ie.from_email AS sender_email,
                  'inbox' AS folder
           FROM incoming_emails ie
           WHERE ie.user_id::text = $1::text
             AND COALESCE(ie.is_deleted, false) = false
             AND COALESCE(ie.is_spam, false) = false
             AND COALESCE(ie.is_archived, false) = false
             AND (
               ie.subject ILIKE $2 ESCAPE '\\'
               OR ie.body ILIKE $2 ESCAPE '\\'
               OR ie.body_text ILIKE $2 ESCAPE '\\'
               OR ie.from_email ILIKE $2 ESCAPE '\\'
               OR COALESCE(ie.sender_name, '') ILIKE $2 ESCAPE '\\'
             )
           ORDER BY ie.received_at DESC
           LIMIT $3`,
          [userId, pattern, MAX_RESULTS],
        );
        emails.push(...inbox.rows);
      }

      if ((folder === 'sent' || folder === 'all') && emails.length < MAX_RESULTS) {
        const remaining = MAX_RESULTS - emails.length;
        const sent = await pool.query(
          `SELECT se.id, se.subject, se.body, se.recipient_email, se.sent_at,
                  se.recipient_email AS display_name,
                  se.recipient_email AS sender_email,
                  'sent' AS folder
           FROM sent_emails se
           WHERE se.user_id::text = $1::text
             AND (
               se.subject ILIKE $2 ESCAPE '\\'
               OR se.body ILIKE $2 ESCAPE '\\'
               OR se.recipient_email ILIKE $2 ESCAPE '\\'
             )
           ORDER BY se.sent_at DESC
           LIMIT $3`,
          [userId, pattern, remaining],
        );
        emails.push(...sent.rows);
      }

      return NextResponse.json({
        success: true,
        query: q,
        emails: emails.map((row) => ({
          ...row,
          attachments: stripAttachmentContentForList(row.attachments),
        })),
        total: emails.length,
      });
    });
  } catch (error) {
    console.error('TauMail Search Error:', error);
    return NextResponse.json(
      {
        error: 'Search failed',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
