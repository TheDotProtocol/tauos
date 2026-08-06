import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db-pool';
import { createCheckoutSession } from '@/lib/tau-developer/server/stripe-billing';
import { withDeveloperHandler } from '@/lib/tau-developer/server/route-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.billing.checkout', async (userId) => {
    const body = await request.json();
    const plan = (body.plan === 'enterprise' ? 'enterprise' : 'pro') as 'pro' | 'enterprise';
    const userRes = await getPool().query('SELECT email FROM users WHERE id = $1', [userId]);
    const email = userRes.rows[0]?.email ?? '';
    const session = await createCheckoutSession(userId, email, plan);
    return NextResponse.json(session);
  });
}
