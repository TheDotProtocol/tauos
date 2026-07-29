import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  acceptCallSession,
  declineCallSession,
  endCallSession,
  getCallSession,
  missCallSession,
} from '@/lib/tautalk-calls';

export const dynamic = 'force-dynamic';

type Params = { params: { sessionId: string } };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const session = await getCallSession(params.sessionId, auth.userId);
    if (!session) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load call' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();
    const sessionId = params.sessionId;

    if (action === 'accept') {
      const session = await acceptCallSession(sessionId, auth.userId);
      return NextResponse.json({ success: true, session });
    }
    if (action === 'decline') {
      const session = await declineCallSession(sessionId, auth.userId);
      return NextResponse.json({ success: true, session });
    }
    if (action === 'end') {
      const session = await endCallSession(sessionId, auth.userId);
      return NextResponse.json({ success: true, session });
    }
    if (action === 'miss') {
      const session = await missCallSession(sessionId, auth.userId);
      return NextResponse.json({ success: true, session });
    }

    return NextResponse.json({ error: 'action must be accept, decline, end, or miss' }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Call action failed';
    const status = msg === 'Not found' ? 404 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
