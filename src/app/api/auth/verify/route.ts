import { NextRequest, NextResponse } from 'next/server';
import { verifyTauToken } from '@/lib/tau-auth';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token required' }, { status: 400 });
    }

    const payload = verifyTauToken(token);
    if (!payload) {
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      sso: Boolean(payload.sso),
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
      app: payload.app,
    });
  } catch {
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
  }
}
