import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '@/lib/auth';
import { LoginRequest, AuthResponse } from '@/types/auth';
import { withCORS, withSecurityHeaders, withRateLimit } from '@/middleware/auth';
import { userRepository, sessionRepository, loginAttemptRepository } from '@/lib/database';

export const POST = withCORS(withSecurityHeaders(withRateLimit(5, 15 * 60 * 1000)(async (req: NextRequest) => {
  try {
    const body: LoginRequest = await req.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email and password are required',
          code: 'MISSING_CREDENTIALS'
        },
        { status: 400 }
      );
    }

    // Get client information
    const ipAddress = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Find user by email
    const user = await userRepository.findByEmail(body.email.toLowerCase());
    
    if (!user) {
      // Log failed attempt
      await loginAttemptRepository.log({
        email: body.email,
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'USER_NOT_FOUND',
      });

      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      );
    }

    // Check if account is locked (too many failed attempts)
    const recentFailedAttempts = await loginAttemptRepository.getRecentFailedAttempts(body.email, 15);
    if (recentFailedAttempts.length >= 5) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Account temporarily locked due to too many failed attempts',
          code: 'ACCOUNT_LOCKED'
        },
        { status: 423 }
      );
    }

    // Verify password
    const isPasswordValid = await AuthUtils.verifyPassword(body.password, user.password_hash);
    
    if (!isPasswordValid) {
      // Log failed attempt
      await loginAttemptRepository.log({
        userId: user.id,
        email: body.email,
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'INVALID_PASSWORD',
      });

      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      );
    }

    // Generate session and tokens
    const sessionId = AuthUtils.generateSessionId();
    const tokens = AuthUtils.generateTokens(user, sessionId);

    // Store session in database
    await sessionRepository.create({
      userId: user.id,
      sessionId,
      ipAddress,
      userAgent,
      rememberMe: body.rememberMe || false,
      expiresAt: new Date(Date.now() + (body.rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
    });

    // Update user last login
    await userRepository.update(user.id, {
      last_login_at: new Date().toISOString(),
    });

    // Log successful attempt
    await loginAttemptRepository.log({
      userId: user.id,
      email: body.email,
      ipAddress,
      userAgent,
      success: true,
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        website: user.website,
        isEmailVerified: user.is_email_verified,
        isTwoFactorEnabled: user.is_two_factor_enabled,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLoginAt: user.last_login_at,
      },
      tokens,
      message: 'Login successful',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Login failed',
        code: 'LOGIN_ERROR'
      },
      { status: 500 }
    );
  }
})));
