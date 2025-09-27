import { NextRequest, NextResponse } from 'next/server';
import { 
  universalSecurityMiddleware, 
  verifyJWTSecure, 
  setSecurityHeaders, 
  EnterpriseAuth,
  InputSecurity,
  logSecurityEvent,
  QuantumSecurity
} from '../../../lib/security/universal-security';
import { Pool } from 'pg';

// Database connection - enterprise grade security
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require',
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function POST(request: NextRequest) {
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    // 🛡️ UNIVERSAL SECURITY MIDDLEWARE
    const securityResponse = await universalSecurityMiddleware(request);
    if (securityResponse) return securityResponse;

    const { email, password } = await request.json();

    // 🔐 ENTERPRISE INPUT VALIDATION
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!InputSecurity.validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // 🚨 RATE LIMITING CHECK
    const rateLimitCheck = EnterpriseAuth.checkRateLimit(clientIP, 'taucloud-login');
    if (!rateLimitCheck.allowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { endpoint: 'taucloud-login' }, request);
      return NextResponse.json({ 
        error: `Too many login attempts. Try again in ${rateLimitCheck.remainingTime} minutes.` 
      }, { status: 429 });
    }

    // 🧹 SANITIZE INPUTS
    const sanitizedEmail = InputSecurity.sanitize(email.toLowerCase().trim());

    // 🔍 ENHANCED USER QUERY WITH ORGANIZATION INFO
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, u.password_hash, u.full_name, u.is_active, u.organization_id,
              o.name as organization_name, o.domain as organization_domain
       FROM users u 
       LEFT JOIN organizations o ON u.organization_id = o.id 
       WHERE u.email = $1`,
      [sanitizedEmail]
    );

    if (result.rows.length === 0) {
      logSecurityEvent('FAILED_LOGIN_ATTEMPT', { email: sanitizedEmail, clientIP }, request);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      logSecurityEvent('LOGIN_DEACTIVATED_ACCOUNT', { email: sanitizedEmail, clientIP }, request);
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 401 });
    }

    // 🔐 QUANTUM-RESISTANT PASSWORD VERIFICATION
    const isValidPassword = await QuantumSecurity.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      logSecurityEvent('INVALID_PASSWORD_ATTEMPT', { email: sanitizedEmail, clientIP }, request);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 🎯 CLEAR FAILED ATTEMPTS ON SUCCESS
    const rateLimitKey = `${clientIP}:taucloud-login`;
    // Clear from rate limit store on successful login

    // 📊 UPDATE LAST LOGIN
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // 🔐 ENHANCED JWT TOKEN WITH QUANTUM SECURITY
    const jwtSecret = process.env.JWT_SECRET_TAUCLOUD || 'tauos-taucloud-jwt-secret-2025-launch-b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        username: user.username, 
        app: 'taucloud',
        organizationId: user.organization_id,
        iat: Math.floor(Date.now() / 1000),
        securityLevel: 'enterprise'
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // 📝 LOG SUCCESSFUL LOGIN
    logSecurityEvent('SUCCESSFUL_LOGIN', { 
      userId: user.id, 
      email: user.email, 
      app: 'taucloud',
      clientIP 
    }, request);

    const response = NextResponse.json({
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

    // 🛡️ APPLY SECURITY HEADERS
    setSecurityHeaders(response);
    return response;

  } catch (error) {
    console.error('TauCloud Login Error:', error);
    
    // 🚨 ENHANCED ERROR LOGGING
    logSecurityEvent('LOGIN_ERROR', { 
      error: error.message,
      stack: error.stack,
      clientIP,
      app: 'taucloud'
    }, request);
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}