import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type EmailAction = 'star' | 'unstar' | 'archive' | 'unarchive';

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { emailId, action } = (await request.json()) as {
      emailId?: string;
      action?: EmailAction;
    };

    if (!emailId || !action) {
      return NextResponse.json({ error: 'emailId and action are required' }, { status: 400 });
    }

    let query = '';
    if (action === 'star') {
      query = `UPDATE incoming_emails SET is_starred = true WHERE id = $1 AND user_id = $2 RETURNING id, is_starred`;
    } else if (action === 'unstar') {
      query = `UPDATE incoming_emails SET is_starred = false WHERE id = $1 AND user_id = $2 RETURNING id, is_starred`;
    } else if (action === 'archive') {
      query = `UPDATE incoming_emails SET is_archived = true WHERE id = $1 AND user_id = $2 RETURNING id, is_archived`;
    } else if (action === 'unarchive') {
      query = `UPDATE incoming_emails SET is_archived = false WHERE id = $1 AND user_id = $2 RETURNING id, is_archived`;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await getPool().query(query, [emailId, userId]);
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, action, email: result.rows[0] });
  });
}
