import { getPool } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { issueSsoToken } from '@/lib/tau-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, fullName } = await request.json();
    if (!email || !password || !username || !fullName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await getPool().query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase().trim(), username]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await getPool().query(
      `INSERT INTO users (username, email, password_hash, full_name, is_active, created_at)
       VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP)
       RETURNING id, username, email, full_name`,
      [username, email.toLowerCase().trim(), hash, fullName]
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
        fullName: user.full_name,
      },
    });
  } catch (error) {
    console.error('TauTalk register:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
