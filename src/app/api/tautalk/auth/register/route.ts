import { getPool } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { issueSsoToken } from '@/lib/tau-auth';

function normalizePhone(raw: string | undefined | null): string | null {
  if (!raw?.trim()) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 7) return null;
  return raw.trim().startsWith('+') ? `+${digits}` : digits;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, fullName, phone } = await request.json();
    if (!email || !password || !username || !fullName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(phone);

    const existing = await getPool().query(
      `SELECT id FROM users
       WHERE email = $1 OR username = $2 OR ($3::text IS NOT NULL AND phone = $3)`,
      [email.toLowerCase().trim(), username, normalizedPhone]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await getPool().query(
      `INSERT INTO users (username, email, password_hash, full_name, phone, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP)
       RETURNING id, username, email, full_name, phone`,
      [username, email.toLowerCase().trim(), hash, fullName, normalizedPhone]
    );

    const user = result.rows[0];
    const token = issueSsoToken({
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.full_name,
    });

    return NextResponse.json({
      message: 'Registration successful',
      token,
      sso: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone ?? null,
        fullName: user.full_name,
      },
    });
  } catch (error) {
    console.error('TauTalk register:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
