import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndSecurity } from '@/middleware/auth';

// Mock database - replace with actual database
const users: any[] = [];

export const GET = withAuthAndSecurity(async (req: NextRequest) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User ID not found',
          code: 'USER_ID_NOT_FOUND'
        },
        { status: 400 }
      );
    }

    // Find user in database
    const user = users.find(u => u.id === userId);
    
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

    // Return user data (excluding sensitive information)
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      website: user.website,
      isEmailVerified: user.isEmailVerified,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    };

    return NextResponse.json(
      { 
        success: true,
        user: userData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get user data',
        code: 'GET_USER_ERROR'
      },
      { status: 500 }
    );
  }
});
