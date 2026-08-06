import { getPool } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { attachAuthSession } from '@/lib/tau-session';
import { trackMetrics } from '../../../middleware/metrics';
import {
  DEFAULT_MAIL_DOMAIN,
  isAllowedMailDomain,
  isRegisterableMailDomain,
  parseEmailAddress,
} from '@/config/mail-domains';

// Database connection - production ready with enhanced error handling


// Input validation and sanitization
function validateInput(email: string, password: string, username: string, fullName: string) {
  const errors: string[] = [];
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  }
  
  // Password validation
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Username validation
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!username || !usernameRegex.test(username)) {
    errors.push('Username must be 3-20 characters, alphanumeric, hyphens, and underscores only');
  }
  
  // Full name validation
  if (!fullName || fullName.trim().length < 2) {
    errors.push('Full name is required');
  }
  
  return errors;
}

// Rate limiting (simple in-memory store - in production use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `register:${ip}`;
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (current.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }
  
  current.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json({ 
        error: 'Too many registration attempts. Please try again later.' 
      }, { status: 429 });
    }

    const { email, password, username, fullName, domain: domainInput } = await request.json();

    const sanitizedUsername = username?.toLowerCase().trim();
    const sanitizedFullName = fullName?.trim();
    const resolvedDomain = (domainInput || DEFAULT_MAIL_DOMAIN).toLowerCase().trim();
    const sanitizedEmail =
      email?.includes('@')
        ? email.toLowerCase().trim()
        : `${sanitizedUsername}@${resolvedDomain}`;

    if (!isRegisterableMailDomain(resolvedDomain)) {
      return NextResponse.json(
        { error: `Registration is not yet open for @${resolvedDomain}` },
        { status: 400 }
      );
    }

    if (!isAllowedMailDomain(resolvedDomain)) {
      return NextResponse.json({ error: 'Mail domain is not supported' }, { status: 400 });
    }

    const parsed = parseEmailAddress(sanitizedEmail);
    if (!parsed || parsed.domain !== resolvedDomain) {
      return NextResponse.json(
        { error: `Email must use @${resolvedDomain}` },
        { status: 400 }
      );
    }

    // Input validation
    const validationErrors = validateInput(sanitizedEmail, password, sanitizedUsername, sanitizedFullName);
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }

    // Sanitize inputs (username/fullName already sanitized above)

    // Check if user already exists
    const existingUser = await getPool().query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [sanitizedEmail, sanitizedUsername]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password with higher salt rounds for better security
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Get default organization ID
    const orgResult = await getPool().query(
      'SELECT id FROM organizations WHERE domain = $1 LIMIT 1',
      [resolvedDomain]
    );
    
    if (orgResult.rows.length === 0) {
      console.error('Default organization not found');
      return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
    }
    
    const organizationId = orgResult.rows[0].id;

    // Create user with proper UUID handling
    const result = await getPool().query(
      `INSERT INTO users (organization_id, username, email, password_hash, full_name, is_active, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) 
       RETURNING id, username, email, full_name`,
      [organizationId, sanitizedUsername, sanitizedEmail, passwordHash, sanitizedFullName, true]
    );

    const user = result.rows[0];

    try {
      const welcomeResponse = await fetch(`${process.env.NEXT_PUBLIC_TAUMAIL_API_URL || 'https://www.tauos.org/api'}/taumail/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.email, userName: user.full_name }),
      });
      if (welcomeResponse.ok) {
        console.log(`Welcome email sent to ${user.email}`);
      }
    } catch (welcomeError) {
      console.log(`Welcome email error for ${user.email}:`, welcomeError);
    }

    const responseTime = Date.now() - startTime;
    trackMetrics('taumail', '/api/taumail/auth/register', responseTime, 200);

    return attachAuthSession(
      request,
      {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
      },
      {
        message: 'Registration successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
        },
      }
    );

  } catch (error) {
    console.error('TauMail Registration Error:', error);
    const responseTime = Date.now() - startTime;
    trackMetrics('taumail', '/api/taumail/auth/register', responseTime, 500);
    
    // Enhanced error logging
    console.error('Registration Error Details:', {
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
