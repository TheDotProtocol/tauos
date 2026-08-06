import { getPool } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { attachAuthSession } from '@/lib/tau-session';

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return raw.trim().startsWith('+') ? `+${digits}` : digits;
}

function isPhoneIdentifier(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.includes('@')) return false;
  return /^\+?[\d\s().-]{7,}$/.test(trimmed);
}

export async function POST(request: NextRequest) {
  try {
    const { email, phone, password, identifier } = await request.json();
    const loginId = (identifier || email || phone || '').trim();
    if (!loginId || !password) {
      return NextResponse.json(
        { error: 'Email or phone and password are required' },
        { status: 400 }
      );
    }

    const usePhone = isPhoneIdentifier(loginId);
    const result = await getPool().query(
      usePhone
        ? `SELECT id, username, email, phone, password_hash, full_name, avatar_url, is_active
           FROM users WHERE phone = $1`
        : `SELECT id, username, email, phone, password_hash, full_name, avatar_url, is_active
           FROM users WHERE email = $1`,
      [usePhone ? normalizePhone(loginId) : loginId.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return NextResponse.json({ error: 'Account deactivated' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await getPool().query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    return attachAuthSession(
      request,
      { id: user.id, email: user.email, username: user.username, fullName: user.full_name },
      {
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone ?? null,
          fullName: user.full_name,
          avatarUrl: user.avatar_url ?? null,
        },
      }
    );
  } catch (error) {
    console.error('TauTalk login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
