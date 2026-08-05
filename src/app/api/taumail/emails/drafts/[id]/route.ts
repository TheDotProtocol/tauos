import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withTauMailAuth(request, async (userId) => {
    const { to, cc, bcc, subject, body } = await request.json();
    const result = await getPool().query(
      `UPDATE email_drafts
       SET to_email = COALESCE($3, to_email),
           cc_email = COALESCE($4, cc_email),
           bcc_email = COALESCE($5, bcc_email),
           subject = COALESCE($6, subject),
           body = COALESCE($7, body),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING id, to_email, cc_email, bcc_email, subject, body, updated_at, created_at`,
      [id, userId, to, cc, bcc, subject, body],
    );
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, draft: result.rows[0] });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return withTauMailAuth(request, async (userId) => {
    const result = await getPool().query(
      'DELETE FROM email_drafts WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId],
    );
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  });
}
