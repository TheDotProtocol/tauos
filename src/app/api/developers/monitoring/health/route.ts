import { NextResponse } from 'next/server';
import { listRecentErrors } from '@/lib/monitoring/error-reporting';

export const dynamic = 'force-dynamic';

export async function GET() {
  const errors = await listRecentErrors(25);
  return NextResponse.json({
    ok: true,
    count: errors.length,
    errors,
    sentryConfigured: Boolean(process.env.SENTRY_DSN),
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
  });
}
