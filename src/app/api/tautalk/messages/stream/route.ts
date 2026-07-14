import { NextRequest } from 'next/server';
import { requireAuth, getBearerToken } from '@/lib/auth-server';
import { listMessages, userInConversation } from '@/lib/tautalk-data';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token =
    getBearerToken(request) ?? request.nextUrl.searchParams.get('token') ?? null;
  const auth = token
    ? (await import('@/lib/tau-auth')).verifyTauToken(token)
    : requireAuth(request);
  if (!auth?.userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const conversationId = request.nextUrl.searchParams.get('conversationId');
  if (!conversationId) {
    return new Response('conversationId required', { status: 400 });
  }

  const allowed = await userInConversation(auth.userId, conversationId);
  if (!allowed) {
    return new Response('Not found', { status: 404 });
  }

  const encoder = new TextEncoder();
  let lastSince = request.nextUrl.searchParams.get('since') ?? new Date().toISOString();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send('connected', { conversationId, ts: Date.now() });

      const poll = async () => {
        if (closed) return;
        try {
          const messages = await listMessages(auth.userId!, conversationId, lastSince, 20);
          for (const m of messages) {
            send('message', m);
            lastSince = m.created_at;
          }
        } catch {
          send('error', { message: 'poll failed' });
        }
      };

      poll();
      const interval = setInterval(poll, 2500);

      request.signal.addEventListener('abort', () => {
        closed = true;
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
