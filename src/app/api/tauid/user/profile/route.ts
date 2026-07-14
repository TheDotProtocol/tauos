import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';

export const dynamic = 'force-dynamic';

async function ensureProfilesTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tauid_identity_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      profile_name TEXT NOT NULL,
      profile_type TEXT DEFAULT 'personal',
      is_primary BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await ensureProfilesTable();
    const userResult = await getPool().query(
      `SELECT id, username, email, full_name, email_verified, created_at, last_login_at
       FROM users WHERE id = $1`,
      [auth.userId]
    );
    const profiles = await getPool().query(
      `SELECT id, profile_name, profile_type, is_primary, created_at
       FROM tauid_identity_profiles WHERE user_id = $1 ORDER BY created_at ASC`,
      [auth.userId]
    );
    if (profiles.rows.length === 0) {
      await getPool().query(
        `INSERT INTO tauid_identity_profiles (user_id, profile_name, profile_type, is_primary)
         VALUES ($1, 'Primary', 'personal', true)`,
        [auth.userId]
      );
      const again = await getPool().query(
        `SELECT id, profile_name, profile_type, is_primary, created_at
         FROM tauid_identity_profiles WHERE user_id = $1`,
        [auth.userId]
      );
      return NextResponse.json({ user: userResult.rows[0], profiles: again.rows });
    }
    return NextResponse.json({ user: userResult.rows[0], profiles: profiles.rows });
  } catch (error) {
    console.error('TauID profile GET:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const result = await getPool().query(
      `UPDATE users SET full_name = COALESCE($2, full_name), username = COALESCE($3, username)
       WHERE id = $1 RETURNING id, username, email, full_name, email_verified`,
      [auth.userId, body.full_name ?? null, body.username ?? null]
    );
    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
