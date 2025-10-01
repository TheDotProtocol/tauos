import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '@/lib/auth';
import { SessionData } from '@/types/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: SessionData;
}

/**
 * Authentication middleware for API routes
 */
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Authorization header required',
            code: 'MISSING_AUTH_HEADER'
          },
          { status: 401 }
        );
      }

      const token = AuthUtils.extractTokenFromHeader(authHeader);
      
      if (!token) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid authorization format',
            code: 'INVALID_AUTH_FORMAT'
          },
          { status: 401 }
        );
      }

      const sessionData = AuthUtils.verifyAccessToken(token);
      
      if (!sessionData) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid or expired token',
            code: 'INVALID_TOKEN'
          },
          { status: 401 }
        );
      }

      // Check if token is expired
      if (AuthUtils.isTokenExpired(token)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Token has expired',
            code: 'TOKEN_EXPIRED'
          },
          { status: 401 }
        );
      }

      // Add user data to request
      (req as AuthenticatedRequest).user = sessionData;

      return handler(req as AuthenticatedRequest);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication failed',
          code: 'AUTH_ERROR'
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export function withOptionalAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (authHeader) {
        const token = AuthUtils.extractTokenFromHeader(authHeader);
        
        if (token) {
          const sessionData = AuthUtils.verifyAccessToken(token);
          
          if (sessionData && !AuthUtils.isTokenExpired(token)) {
            (req as AuthenticatedRequest).user = sessionData;
          }
        }
      }

      return handler(req as AuthenticatedRequest);
    } catch (error) {
      console.error('Optional authentication middleware error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication processing failed',
          code: 'AUTH_PROCESSING_ERROR'
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Role-based authentication middleware
 */
export function withRole(requiredRole: string) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (req: AuthenticatedRequest) => {
      // This would need to be implemented with actual role checking
      // For now, we'll assume all authenticated users have the required role
      return handler(req);
    });
  };
}

/**
 * Rate limiting middleware
 */
export function withRateLimit(maxRequests: number, windowMs: number) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return async (req: AuthenticatedRequest): Promise<NextResponse> => {
      const clientId = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
      const now = Date.now();
      
      const clientData = requests.get(clientId);
      
      if (!clientData || now > clientData.resetTime) {
        requests.set(clientId, { count: 1, resetTime: now + windowMs });
      } else {
        clientData.count++;
        
        if (clientData.count > maxRequests) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Too many requests',
              code: 'RATE_LIMIT_EXCEEDED'
            },
            { status: 429 }
          );
        }
      }

      return handler(req);
    };
  };
}

/**
 * CORS middleware
 */
export function withCORS(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    const response = await handler(req);
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  };
}

/**
 * Security headers middleware
 */
export function withSecurityHeaders(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    const response = await handler(req);
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    return response;
  };
}

/**
 * Combined middleware for API routes
 */
export function withAuthAndSecurity(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withCORS(withSecurityHeaders(withAuth(handler)));
}

/**
 * Combined middleware for optional auth
 */
export function withOptionalAuthAndSecurity(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withCORS(withSecurityHeaders(withOptionalAuth(handler)));
}
