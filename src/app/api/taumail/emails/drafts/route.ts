import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const result = await getPool().query(
      `SELECT id, to_email, cc_email, bcc_email, subject, body, updated_at, created_at
       FROM email_drafts
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId],
    );
    return NextResponse.json({ success: true, drafts: result.rows });
  });
}

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { to, cc, bcc, subject, body } = await request.json();
    const result = await getPool().query(
      `INSERT INTO email_drafts (user_id, to_email, cc_email, bcc_email, subject, body, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING id, to_email, cc_email, bcc_email, subject, body, updated_at, created_at`,
      [userId, to || '', cc || '', bcc || '', subject || '', body || ''],
    );
    return NextResponse.json({ success: true, draft: result.rows[0] });
  });
}
