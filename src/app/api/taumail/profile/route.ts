import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { getTauMailProfileRow, mapTauMailProfile } from '@/lib/taumail/profile-server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const user = await getTauMailProfileRow(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, profile: mapTauMailProfile(user) });
  });
}

export async function PUT(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const { fullName, displayName, organization, title, timezone } = await request.json();
    const result = await getPool().query(
      `UPDATE users
       SET full_name = COALESCE($2, full_name),
           display_name = COALESCE($3, display_name),
           job_title = COALESCE($4, job_title),
           timezone = COALESCE($5, timezone)
       WHERE id = $1
       RETURNING id, username, email, full_name, display_name, job_title, timezone, avatar_url`,
      [userId, fullName, displayName, title, timezone],
    );
    if (!result.rows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (organization) {
      await getPool().query(
        `UPDATE organizations SET name = $2
         WHERE id = (SELECT organization_id FROM users WHERE id = $1)`,
        [userId, organization],
      );
    }

    const user = await getTauMailProfileRow(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: mapTauMailProfile(user) });
  });
}
