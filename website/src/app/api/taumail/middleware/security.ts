import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Database connection for security checks
const pool = new Pool({
  connectionString = process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  ssl: {
    rejectUnauthorized: false
  }
});

// Security headers middleware
export function setSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // CSP Header
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.tauos.org;"
  );
  
  return response;
}

// JWT verification middleware
export async function verifyJWT(request: NextRequest): Promise<{ valid: boolean; user?: any; error?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET_TAUMAIL || 'tauos-taumail-jwt-secret-2025-launch-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Verify user still exists and is active
    const userResult = await pool.query(
      'SELECT id, username, email, is_active, organization_id FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      return { valid: false, error: 'User not found' };
    }
    
    const user = userResult.rows[0];
    if (!user.is_active) {
      return { valid: false, error: 'Account deactivated' };
    }
    
    return { valid: true, user };
    
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return { valid: false, error: 'Invalid token' };
  }
}

// Rate limiting middleware
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per 15 minutes

export function checkRateLimit(request: NextRequest): { allowed: boolean; remainingTime?: number } {
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const key = `rate_limit:${clientIP}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    const remainingTime = Math.ceil((current.resetTime - now) / 1000 / 60);
    return { allowed: false, remainingTime };
  }
  
  current.count++;
  return { allowed: true };
}

// Input sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  
  return input;
}

// SQL injection protection
export function validateSQLInput(input: string): boolean {
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\/\*|\*\/)/,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
    /(UNION\s+SELECT)/i,
    /(DROP\s+TABLE)/i,
    /(DELETE\s+FROM)/i,
    /(INSERT\s+INTO)/i,
    /(UPDATE\s+SET)/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
}

// XSS protection
export function sanitizeHTML(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Password strength validation
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common, please choose a stronger password');
  }
  
  return { valid: errors.length === 0, errors };
}

// CSRF protection
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// Audit logging
export function logSecurityEvent(event: string, details: any, request: NextRequest) {
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  console.log(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    clientIP,
    userAgent,
    details
  });
}

// Comprehensive security middleware
export async function securityMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // Set security headers
  const response = new NextResponse();
  setSecurityHeaders(response);
  
  // Rate limiting
  const rateLimitCheck = checkRateLimit(request);
  if (!rateLimitCheck.allowed) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', { 
      remainingTime: rateLimitCheck.remainingTime 
    }, request);
    
    return NextResponse.json({ 
      error: `Rate limit exceeded. Please try again in ${rateLimitCheck.remainingTime} minutes.` 
    }, { status: 429 });
  }
  
  // Check for suspicious patterns
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Block common attack patterns
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /javascript:/i,  // JavaScript injection
    /vbscript:/i,  // VBScript injection
    /onload=/i,  // Event handler injection
    /onerror=/i  // Event handler injection
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(url) || pattern.test(userAgent))) {
    logSecurityEvent('SUSPICIOUS_REQUEST', { url, userAgent }, request);
    return NextResponse.json({ error: 'Suspicious request detected' }, { status: 400 });
  }
  
  return null; // Continue with request
}
