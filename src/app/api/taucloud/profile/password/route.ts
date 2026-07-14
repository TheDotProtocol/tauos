import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'Valid passwords required (min 8 chars)' }, { status: 400 });
    }
    const result = await getPool().query(
      'SELECT password_hash FROM users WHERE id = $1',
      [auth.userId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const ok = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!ok) {
      return NextResponse.json({ error: 'Current password incorrect' }, { status: 401 });
    }
    const hash = await bcrypt.hash(newPassword, 12);
    await getPool().query('UPDATE users SET password_hash = $2 WHERE id = $1', [
      auth.userId,
      hash,
    ]);
    return NextResponse.json({ success: true, message: 'Password updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Password update failed' }, { status: 500 });
  }
}
