import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { ensureTauMailSchema } from '@/lib/taumail/schema';
import { isRemotePushConfigured, setPushPreference } from '@/lib/taumail/push';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();
    await ensureTauMailSchema(pool);
    const result = await pool.query(
      `SELECT COALESCE(push_notifications_enabled, true) AS enabled
       FROM users WHERE id::text = $1::text LIMIT 1`,
      [userId],
    );
    return NextResponse.json({
      success: true,
      enabled: result.rows.length ? Boolean(result.rows[0].enabled) : true,
      remotePushConfigured: isRemotePushConfigured(),
    });
  });
}

export async function PATCH(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { enabled } = await request.json();
    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'enabled boolean required' }, { status: 400 });
    }
    await setPushPreference(userId, enabled);
    return NextResponse.json({ success: true, enabled });
  });
}
