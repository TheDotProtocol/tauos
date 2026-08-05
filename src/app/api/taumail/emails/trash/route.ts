import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { stripAttachmentContentForList } from '@/lib/taumail-inbound';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const result = await getPool().query(
      `SELECT ie.id, ie.subject, ie.body, ie.body_html, ie.from_email, ie.sender_name,
              ie.received_at, ie.deleted_at, ie.is_read, ie.attachments,
              COALESCE(ie.sender_name, ie.from_email) as display_name,
              ie.from_email as sender_email
       FROM incoming_emails ie
       WHERE ie.user_id = $1 AND ie.is_deleted = true
       ORDER BY ie.deleted_at DESC NULLS LAST, ie.received_at DESC
       LIMIT 50`,
      [userId],
    );
    return NextResponse.json({
      success: true,
      emails: result.rows.map((row) => ({
        ...row,
        attachments: stripAttachmentContentForList(row.attachments),
      })),
    });
  });
}

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { emailId, action } = await request.json();
    if (!emailId) {
      return NextResponse.json({ error: 'emailId required' }, { status: 400 });
    }

    if (action === 'restore') {
      const result = await getPool().query(
        `UPDATE incoming_emails
         SET is_deleted = false, deleted_at = NULL
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [emailId, userId],
      );
      if (!result.rows.length) {
        return NextResponse.json({ error: 'Email not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, action: 'restore' });
    }

    const result = await getPool().query(
      `UPDATE incoming_emails
       SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2 AND (is_deleted IS NOT TRUE)
       RETURNING id`,
      [emailId, userId],
    );
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, action: 'trash' });
  });
}

export async function DELETE(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const emailId = request.nextUrl.searchParams.get('emailId');
    if (!emailId) {
      return NextResponse.json({ error: 'emailId required' }, { status: 400 });
    }
    const result = await getPool().query(
      'DELETE FROM incoming_emails WHERE id = $1 AND user_id = $2 AND is_deleted = true RETURNING id',
      [emailId, userId],
    );
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Email not found in trash' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  });
}
