import { withTauMailAuth } from '@/lib/taumail/api-route';
import { getPool } from '@/app/api/taumail/middleware/security';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    try {
      const { emailId } = await request.json();
      if (!emailId) {
        return NextResponse.json({ error: 'Email ID is required' }, { status: 400 });
      }

      const result = await getPool().query(
        'UPDATE incoming_emails SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING id, subject',
        [emailId, userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Email not found or access denied' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Email marked as read',
        email: result.rows[0],
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      return NextResponse.json({ error: 'Failed to mark email as read' }, { status: 500 });
    }
  });
}

export async function PUT(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    try {
      const { emailIds } = await request.json();
      if (!emailIds || !Array.isArray(emailIds)) {
        return NextResponse.json({ error: 'Email IDs array is required' }, { status: 400 });
      }

      const result = await getPool().query(
        'UPDATE incoming_emails SET is_read = true WHERE id = ANY($1::uuid[]) AND user_id = $2 RETURNING id',
        [emailIds, userId]
      );

      return NextResponse.json({
        success: true,
        message: `${result.rows.length} emails marked as read`,
        count: result.rows.length,
      });
    } catch (error) {
      console.error('Bulk mark as read error:', error);
      return NextResponse.json({ error: 'Failed to mark emails as read' }, { status: 500 });
    }
  });
}
