import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '@/lib/auth';
import { RegisterRequest, AuthResponse, AuthError } from '@/types/auth';
import { withCORS, withSecurityHeaders } from '@/middleware/auth';
import { userRepository, sessionRepository, loginAttemptRepository } from '@/lib/database';

export const POST = withCORS(withSecurityHeaders(async (req: NextRequest) => {
  try {
    const body: RegisterRequest = await req.json();
    
    // Validate required fields
    if (!body.email || !body.username || !body.fullName || !body.password || !body.confirmPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'All fields are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!AuthUtils.isValidEmail(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL',
          field: 'email'
        },
        { status: 400 }
      );
    }

    // Validate username
    const usernameValidation = AuthUtils.validateUsername(body.username);
    if (!usernameValidation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: usernameValidation.errors.join(', '),
          code: 'INVALID_USERNAME',
          field: 'username'
        },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = AuthUtils.validatePassword(body.password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: passwordValidation.errors.join(', '),
          code: 'INVALID_PASSWORD',
          field: 'password'
        },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Passwords do not match',
          code: 'PASSWORD_MISMATCH',
          field: 'confirmPassword'
        },
        { status: 400 }
      );
    }

    // Check if terms are accepted
    if (!body.acceptTerms) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'You must accept the terms and conditions',
          code: 'TERMS_NOT_ACCEPTED',
          field: 'acceptTerms'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUserByEmail = await userRepository.findByEmail(body.email.toLowerCase());
    const existingUserByUsername = await userRepository.findByUsername(body.username);
    
    if (existingUserByEmail || existingUserByUsername) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User with this email or username already exists',
          code: 'USER_EXISTS'
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(body.password);

    // Generate email verification token
    const emailVerificationToken = AuthUtils.generateEmailVerificationToken();
    const emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user in database
    const user = await userRepository.create({
      email: AuthUtils.sanitizeInput(body.email.toLowerCase()),
      username: AuthUtils.sanitizeInput(body.username),
      fullName: AuthUtils.sanitizeInput(body.fullName),
      passwordHash: hashedPassword,
      emailVerificationToken,
      emailVerificationExpiresAt,
    });

    // Generate session and tokens
    const sessionId = AuthUtils.generateSessionId();
    const tokens = AuthUtils.generateTokens(user, sessionId);

    // Store session in database
    await sessionRepository.create({
      userId: user.id,
      sessionId,
      ipAddress: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      rememberMe: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // TODO: Send email verification email
    console.log('Email verification token:', emailVerificationToken);

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        isEmailVerified: user.is_email_verified,
        isTwoFactorEnabled: user.is_two_factor_enabled,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      tokens,
      message: 'Registration successful. Please check your email to verify your account.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      },
      { status: 500 }
    );
  }
}));
