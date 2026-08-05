import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { ensureDefaultWorkspaceData } from '@/lib/taumail/schema';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const pool = getPool();
    await ensureDefaultWorkspaceData(pool, userId);
    const result = await pool.query(
      `SELECT id, name, email, role, verified, created_at
       FROM taumail_contacts
       WHERE user_id = $1
       ORDER BY name ASC`,
      [userId],
    );
    return NextResponse.json({ success: true, contacts: result.rows });
  });
}

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { name, email, role, verified } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'name and email required' }, { status: 400 });
    }
    const result = await getPool().query(
      `INSERT INTO taumail_contacts (user_id, name, email, role, verified)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, verified, created_at`,
      [userId, name, email, role || '', Boolean(verified)],
    );
    return NextResponse.json({ success: true, contact: result.rows[0] });
  });
}
