import { getPool } from '@/app/api/taumail/middleware/security';
import { withTauMailAuth } from '@/lib/taumail/api-route';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const result = await getPool().query(
      `SELECT u.id, u.username, u.email, u.full_name, u.display_name, u.job_title,
              u.timezone, u.storage_used_bytes, u.storage_quota_bytes,
              o.name AS organization_name
       FROM users u
       LEFT JOIN organizations o ON u.organization_id = o.id
       WHERE u.id = $1`,
      [userId],
    );
    if (!result.rows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = result.rows[0];
    return NextResponse.json({
      success: true,
      profile: {
        fullName: user.full_name || '',
        displayName: user.display_name || user.username || '',
        email: user.email || '',
        organization: user.organization_name || '',
        title: user.job_title || '',
        timezone: user.timezone || '(UTC-05:00) Eastern Time (US & Canada)',
      },
    });
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
       RETURNING id, username, email, full_name, display_name, job_title, timezone`,
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

    const user = result.rows[0];
    return NextResponse.json({
      success: true,
      profile: {
        fullName: user.full_name || '',
        displayName: user.display_name || user.username || '',
        email: user.email || '',
        organization: organization || '',
        title: user.job_title || '',
        timezone: user.timezone || '(UTC-05:00) Eastern Time (US & Canada)',
      },
    });
  });
}
