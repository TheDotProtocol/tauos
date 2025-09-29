import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Database connection - production ready with enhanced error handling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Rate limiting for login attempts - Enterprise optimized
const loginAttempts = new Map<string, { count: number; resetTime: number; lastAttempt: number }>();
const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 20; // Increased for enterprise load
const LOCKOUT_DURATION = 5 * 60 * 1000; // Reduced to 5 minutes

function checkLoginRateLimit(ip: string, email: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now();
  const key = `login:${ip}:${email}`;
  const current = loginAttempts.get(key);
  
  if (!current || now > current.resetTime) {
    loginAttempts.set(key, { count: 1, resetTime: now + LOGIN_RATE_LIMIT_WINDOW, lastAttempt: now });
    return { allowed: true };
  }
  
  // Check if account is locked out
  if (now - current.lastAttempt < LOCKOUT_DURATION && current.count >= MAX_LOGIN_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - current.lastAttempt)) / 1000 / 60);
    return { allowed: false, remainingTime };
  }
  
  if (current.count >= MAX_LOGIN_ATTEMPTS) {
    current.lastAttempt = now;
    return { allowed: false, remainingTime: Math.ceil(LOCKOUT_DURATION / 1000 / 60) };
  }
  
  current.count++;
  current.lastAttempt = now;
  return { allowed: true };
}

// Input validation
function validateLoginInput(email: string, password: string) {
  const errors: string[] = [];
  
  if (!email || !email.trim()) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Valid email format is required');
    }
  }
  
  if (!password || password.length < 1) {
    errors.push('Password is required');
  }
  
  return errors;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    const { email, password } = await request.json();

    // Input validation
    const validationErrors = validateLoginInput(email, password);
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    // Rate limiting check
    const rateLimitCheck = checkLoginRateLimit(clientIP, sanitizedEmail);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ 
        error: `Too many login attempts. Please try again in ${rateLimitCheck.remainingTime} minutes.` 
      }, { status: 429 });
    }

    // Query user from database with organization info
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, u.password_hash, u.full_name, u.is_active, u.organization_id,
              o.name as organization_name, o.domain as organization_domain
       FROM users u 
       LEFT JOIN organizations o ON u.organization_id = o.id 
       WHERE u.email = $1`,
      [sanitizedEmail]
    );

    if (result.rows.length === 0) {
      // Log failed login attempt
      console.warn(`Failed login attempt for email: ${sanitizedEmail} from IP: ${clientIP}`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      console.warn(`Login attempt for deactivated account: ${sanitizedEmail} from IP: ${clientIP}`);
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 401 });
    }

    // Verify password with timing attack protection
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      // Log failed login attempt
      console.warn(`Invalid password for email: ${sanitizedEmail} from IP: ${clientIP}`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Clear failed attempts on successful login
    const key = `login:${clientIP}:${sanitizedEmail}`;
    loginAttempts.delete(key);

    // Update last login
    await pool.query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token with enhanced security
    const jwtSecret = process.env.JWT_SECRET_TAUMAIL || 'tauos-taumail-jwt-secret-2025-launch-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        username: user.username,
        organizationId: user.organization_id,
        iat: Math.floor(Date.now() / 1000)
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Log successful login
    console.log(`Successful login for user: ${user.username} (${user.email}) from IP: ${clientIP}`);

    return NextResponse.json({
      message: 'Login successful',
      token,
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
    console.error('TauMail Login Error:', error);
    
    // Enhanced error logging
    console.error('Login Error Details:', {
      error: error.message,
      stack: error.stack,
      clientIP,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
