import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getUserStorage } from '@/lib/taucloud-files';
import { getPool } from '@/lib/db-pool';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const storage = await getUserStorage(auth.userId);
    return NextResponse.json({
      success: true,
      storage,
      user: {
        id: auth.userId,
        email: auth.email,
        username: auth.username,
      },
    });
  } catch (error) {
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
       WHERE id = $1 RETURNING id, username, email, full_name`,
      [auth.userId, body.full_name ?? null, body.username ?? null]
    );
    return NextResponse.json({ success: true, user: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
