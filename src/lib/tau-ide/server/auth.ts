import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import type { TauTokenPayload } from '@/lib/tau-auth';

export function getAuthUser(request: NextRequest): TauTokenPayload | null {
  return requireAuth(request);
}

export function requireAuthUser(request: NextRequest): TauTokenPayload {
  const user = requireAuth(request);
  if (!user?.userId) {
    throw new AuthError('Authentication required', 401);
  }
  return user;
}

export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return null;
}

export function userIdString(user: TauTokenPayload): string {
  return String(user.userId);
}
