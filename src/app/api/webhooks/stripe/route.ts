import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/lib/tau-developer/server/stripe-billing';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';
  try {
    const result = await handleStripeWebhook(body, signature);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Webhook failed' },
      { status: 400 },
    );
  }
}
