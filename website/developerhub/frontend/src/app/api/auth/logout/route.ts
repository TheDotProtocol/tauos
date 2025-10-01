import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndSecurity } from '@/middleware/auth';
import { sessionRepository } from '@/lib/database';

export const POST = withAuthAndSecurity(async (req: NextRequest) => {
  try {
    const sessionId = req.user?.sessionId;
    
    if (!sessionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        },
        { status: 400 }
      );
    }

    // Remove session from database
    await sessionRepository.delete(sessionId);

    // TODO: Add session to blacklist for JWT invalidation
    // In a real app, you'd want to blacklist the JWT token

    return NextResponse.json(
      { 
        success: true, 
        message: 'Logout successful'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed',
        code: 'LOGOUT_ERROR'
      },
      { status: 500 }
    );
  }
});
