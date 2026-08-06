import { getPool } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { issueSsoToken, getSsoSecret } from '@/lib/tau-auth';

// Database connection - enterprise grade security


export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic input validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const sanitizedEmail = email.toLowerCase().trim();

    // 🔍 ENHANCED USER QUERY WITH ORGANIZATION INFO
    const result = await getPool().query(
      `SELECT u.id, u.username, u.email, u.password_hash, u.full_name, u.is_active, u.organization_id,
              u.mfa_enabled, u.mfa_secret,
              o.name as organization_name, o.domain as organization_domain
       FROM users u 
       LEFT JOIN organizations o ON u.organization_id = o.id 
       WHERE u.email = $1`,
      [sanitizedEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 401 });
    }

    // Password verification
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.mfa_enabled && user.mfa_secret) {
      const mfaToken = jwt.sign(
        { userId: user.id, purpose: 'taucloud_mfa' },
        getSsoSecret(),
        { expiresIn: '5m' }
      );
      return NextResponse.json({
        requires2fa: true,
        mfaToken,
        message: 'Two-factor authentication required',
      });
    }

    // Update last login
    await getPool().query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    const token = issueSsoToken({
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.full_name,
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      sso: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        organization: {
          id: user.organization_id,
          name: user.organization_name,
          domain: user.organization_domain
        }
      }
    });

  } catch (error) {
    console.error('TauCloud Login Error:', error);
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}