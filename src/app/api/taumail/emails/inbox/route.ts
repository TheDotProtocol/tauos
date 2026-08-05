import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    return await withTauMailAuth(request, async (userId) => {
      const result = await getPool().query(
        `SELECT ie.id, ie.subject, ie.body, ie.body_html, ie.from_email, ie.sender_name,
                ie.received_at, ie.is_read, ie.is_spam, ie.attachments,
                COALESCE(ie.sender_name, ie.from_email) as display_name,
                ie.from_email as sender_email,
                CASE
                  WHEN ie.is_spam = true THEN 'spam'
                  ELSE 'normal'
                END as priority
         FROM incoming_emails ie
         LEFT JOIN users u ON ie.from_email = u.email
         WHERE ie.user_id::text = $1::text
           AND COALESCE(ie.is_deleted, false) = false
           AND COALESCE(ie.is_spam, false) = false
         ORDER BY ie.received_at DESC
         LIMIT 50`,
        [userId],
      );

      return NextResponse.json({
        success: true,
        emails: result.rows,
        total: result.rows.length,
      });
    });
  } catch (error) {
    console.error('TauMail Inbox Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to load inbox',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
