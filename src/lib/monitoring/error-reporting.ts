import { reportError, listRecentErrors } from '@/lib/tau-developer/server/platform-db';

export async function capturePlatformError(
  source: string,
  error: unknown,
  context?: { userId?: string; metadata?: Record<string, unknown> },
) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${source}]`, message);
  }

  try {
    await reportError(source, message, {
      stack,
      userId: context?.userId,
      metadata: context?.metadata,
    });
  } catch {
    /* DB unavailable — console only */
  }

  const dsn = process.env.SENTRY_DSN;
  if (dsn) {
    fetch(`https://sentry.io/api/0/envelope/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-sentry-envelope' },
      body: JSON.stringify({
        event_id: crypto.randomUUID().replace(/-/g, ''),
        message,
        platform: 'node',
        tags: { source },
      }),
    }).catch(() => {});
  }
}

export { listRecentErrors };
