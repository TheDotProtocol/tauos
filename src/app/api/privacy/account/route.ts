import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';
import { logAudit } from '@/lib/audit-log';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { confirmEmail, password } = body;
    if (!confirmEmail || !password) {
      return NextResponse.json({ error: 'confirmEmail and password required' }, { status: 400 });
    }
    if (confirmEmail.toLowerCase() !== auth.email?.toLowerCase()) {
      return NextResponse.json({ error: 'Email confirmation mismatch' }, { status: 400 });
    }

    const userResult = await getPool().query(
      'SELECT id, password_hash FROM users WHERE id = $1',
      [auth.userId]
    );
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const ok = await bcrypt.compare(password, userResult.rows[0].password_hash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const uid = String(auth.userId);

    await logAudit({
      userId: uid,
      action: 'dsr.erasure.requested',
      resource: 'user_account',
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    });

    await getPool().query('DELETE FROM users WHERE id = $1', [uid]);

    await logAudit({
      userId: null,
      action: 'dsr.erasure.completed',
      resource: uid,
      metadata: { email: auth.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Account and associated data scheduled for deletion (cascade).',
    });
  } catch (error) {
    console.error('Privacy account delete:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
