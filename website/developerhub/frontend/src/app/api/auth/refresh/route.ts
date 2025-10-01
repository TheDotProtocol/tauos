import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '@/lib/auth';
import { withCORS, withSecurityHeaders } from '@/middleware/auth';

// Mock database - replace with actual database
const users: any[] = [];
const sessions: any[] = [];

export const POST = withCORS(withSecurityHeaders(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { refreshToken } = body;
    
    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Refresh token is required',
          code: 'MISSING_REFRESH_TOKEN'
        },
        { status: 400 }
      );
    }

    // Verify refresh token
    const tokenData = AuthUtils.verifyRefreshToken(refreshToken);
    
    if (!tokenData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or expired refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        },
        { status: 401 }
      );
    }

    // Check if session exists and is valid
    const session = sessions.find(s => s.id === tokenData.sessionId);
    
    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session expired',
          code: 'SESSION_EXPIRED'
        },
        { status: 401 }
      );
    }

    // Find user
    const user = users.find(u => u.id === tokenData.userId);
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Generate new tokens
    const newTokens = AuthUtils.generateTokens(user, session.id);

    return NextResponse.json(
      { 
        success: true,
        tokens: newTokens,
        message: 'Tokens refreshed successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Token refresh failed',
        code: 'REFRESH_ERROR'
      },
      { status: 500 }
    );
  }
}));
