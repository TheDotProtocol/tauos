import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { addCallSignal, listCallSignals } from '@/lib/tautalk-calls';

export const dynamic = 'force-dynamic';

type Params = { params: { sessionId: string } };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const since = request.nextUrl.searchParams.get('since') ?? undefined;
    const signals = await listCallSignals(params.sessionId, auth.userId, since);
    return NextResponse.json({ success: true, signals });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to load signals';
    const status = msg === 'Not found' ? 404 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { signalType, payload } = await request.json();
    if (!signalType || typeof signalType !== 'string') {
      return NextResponse.json({ error: 'signalType required' }, { status: 400 });
    }

    const signal = await addCallSignal(params.sessionId, auth.userId, signalType, payload);
    return NextResponse.json({ success: true, signal });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to send signal';
    const status = msg === 'Not found' ? 404 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
