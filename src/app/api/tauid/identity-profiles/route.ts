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
    const result = await getPool().query(
      `SELECT id, profile_name, profile_type, is_primary, created_at
       FROM tauid_identity_profiles WHERE user_id = $1 ORDER BY created_at ASC`,
      [auth.userId]
    );
    return NextResponse.json({ success: true, profiles: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list profiles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await ensureProfilesTable();
    const body = await request.json();
    if (!body.profile_name) {
      return NextResponse.json({ error: 'profile_name required' }, { status: 400 });
    }
    const result = await getPool().query(
      `INSERT INTO tauid_identity_profiles (user_id, profile_name, profile_type, is_primary)
       VALUES ($1, $2, $3, false)
       RETURNING id, profile_name, profile_type, is_primary, created_at`,
      [auth.userId, body.profile_name, body.profile_type ?? 'personal']
    );
    return NextResponse.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const row = await getPool().query(
      `SELECT is_primary FROM tauid_identity_profiles WHERE id = $1 AND user_id = $2`,
      [id, auth.userId]
    );
    if (row.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (row.rows[0].is_primary) {
      return NextResponse.json({ error: 'Cannot delete primary profile' }, { status: 400 });
    }
    await getPool().query(
      `DELETE FROM tauid_identity_profiles WHERE id = $1 AND user_id = $2`,
      [id, auth.userId]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
