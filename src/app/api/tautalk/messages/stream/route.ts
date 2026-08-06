import { NextRequest } from 'next/server';
import { requireAuth, getAccessToken } from '@/lib/auth-server';
import { verifyTauToken } from '@/lib/tau-auth';
import { listMessages, userInConversation } from '@/lib/tautalk-data';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function resolveAuth(request: NextRequest) {
  const token = getAccessToken(request) ?? request.nextUrl.searchParams.get('token') ?? null;
  if (token) {
    const decoded = verifyTauToken(token);
    if (!decoded?.userId) return null;
    return { userId: decoded.userId, token };
  }
  const auth = requireAuth(request);
  if (!auth?.userId) return null;
  return { userId: auth.userId, token: getAccessToken(request) };
}

export async function GET(request: NextRequest) {
  const auth = resolveAuth(request);
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

      send('connected', { conversationId, ts: Date.now(), cookieAuth: !request.nextUrl.searchParams.get('token') });

      let interval: ReturnType<typeof setInterval>;

      const poll = async () => {
        if (closed) return;

        const currentToken = getAccessToken(request) ?? request.nextUrl.searchParams.get('token');
        const valid = currentToken ? verifyTauToken(currentToken) : requireAuth(request);
        if (!valid?.userId) {
          send('auth_expired', { message: 'Session expired' });
          closed = true;
          clearInterval(interval);
          controller.close();
          return;
        }

        try {
          const messages = await listMessages(valid.userId, conversationId, lastSince, 20);
          for (const m of messages) {
            send('message', m);
            lastSince = m.created_at;
          }
        } catch {
          send('error', { message: 'poll failed' });
        }
      };

      poll();
      interval = setInterval(poll, 4000);

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
