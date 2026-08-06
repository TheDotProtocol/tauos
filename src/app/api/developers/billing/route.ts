import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSubscription, listInvoices } from '@/lib/tau-developer/server/platform-db';
import { withDeveloperHandler } from '@/lib/tau-developer/server/route-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.billing.get', async (userId) => {
    const subscription = await getOrCreateSubscription(userId);
    const invoices = await listInvoices(userId);
    const tiers = [
      { id: 'free', name: 'Free Sandbox', price: '$0', active: subscription.plan === 'free' },
      { id: 'pro', name: 'Pro Tier', price: '$49', active: subscription.plan === 'pro' },
      { id: 'enterprise', name: 'Enterprise', price: 'Custom', active: subscription.plan === 'enterprise' },
    ];
    const apiPct = subscription.api_calls_limit
      ? Math.min(100, Math.round((Number(subscription.api_calls_used) / Number(subscription.api_calls_limit)) * 100))
      : 0;
    const buildPct = subscription.build_minutes_limit
      ? Math.min(100, Math.round((Number(subscription.build_minutes_used) / Number(subscription.build_minutes_limit)) * 100))
      : 0;
    return NextResponse.json({
      subscription,
      tiers,
      quotas: {
        apiCalls: {
          used: Number(subscription.api_calls_used),
          limit: Number(subscription.api_calls_limit),
          pct: apiPct,
        },
        buildMinutes: {
          used: Number(subscription.build_minutes_used),
          limit: Number(subscription.build_minutes_limit),
          pct: buildPct,
        },
      },
      invoices,
    });
  });
}
