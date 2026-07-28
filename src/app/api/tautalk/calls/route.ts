import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  createCallSession,
  getCallSession,
  listIncomingCalls,
  type CallMode,
} from '@/lib/tautalk-calls';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = request.nextUrl.searchParams.get('sessionId');
    if (sessionId) {
      const session = await getCallSession(sessionId, auth.userId);
      if (!session) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, session });
    }

    const incoming = await listIncomingCalls(auth.userId);
    return NextResponse.json({ success: true, incoming });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to load calls';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const conversationId = body.conversationId as string | undefined;
    const mode = (body.mode as CallMode) || 'voice';
    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
    }
    if (mode !== 'voice' && mode !== 'video') {
      return NextResponse.json({ error: 'mode must be voice or video' }, { status: 400 });
    }

    const session = await createCallSession(auth.userId, conversationId, mode);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to start call';
    const status = msg === 'Not found' ? 404 : msg.includes('already') ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
