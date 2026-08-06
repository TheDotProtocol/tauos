import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getUserStorage } from '@/lib/taucloud-files';
import { getPool } from '@/lib/db-pool';
import { resolveTauCloudAvatarUrl } from '@/lib/taucloud-profile';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const storage = await getUserStorage(auth.userId);
    const userResult = await getPool().query(
      'SELECT id, username, email, full_name, avatar_url FROM users WHERE id = $1',
      [String(auth.userId)],
    );
    const userRow = userResult.rows[0] || {};
    const avatarUrl = await resolveTauCloudAvatarUrl(auth.userId, userRow.avatar_url ?? null);
    return NextResponse.json({
      success: true,
      storage,
      user: {
        id: auth.userId,
        email: userRow.email || auth.email,
        username: userRow.username || auth.username,
        full_name: userRow.full_name,
        fullName: userRow.full_name,
        avatar_url: userRow.avatar_url,
        avatarUrl,
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
       WHERE id = $1 RETURNING id, username, email, full_name, avatar_url`,
      [auth.userId, body.full_name ?? body.fullName ?? null, body.username ?? null]
    );
    const row = result.rows[0];
    const avatarUrl = await resolveTauCloudAvatarUrl(auth.userId, row.avatar_url ?? null);
    return NextResponse.json({
      success: true,
      user: { ...row, avatarUrl },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
