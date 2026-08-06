import { getOrCreateSubscription, updateSubscription, upsertInvoice } from './platform-db';

type StripeClient = {
  checkout: { sessions: { create: (p: unknown) => Promise<{ url: string | null; id: string }> } };
  customers: { create: (p: unknown) => Promise<{ id: string }> };
  webhooks: { constructEvent: (body: string, sig: string, secret: string) => unknown };
};

async function getStripe(): Promise<StripeClient | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    const Stripe = (await import('stripe')).default;
    return new Stripe(key) as unknown as StripeClient;
  } catch {
    return null;
  }
}

export async function createCheckoutSession(userId: string, email: string, plan: 'pro' | 'enterprise') {
  const stripe = await getStripe();
  const sub = await getOrCreateSubscription(userId);

  if (!stripe) {
    return {
      url: null,
      configured: false,
      message: 'Stripe not configured. Set STRIPE_SECRET_KEY and STRIPE_DEVELOPER_PRO_PRICE_ID in .env.local',
    };
  }

  let customerId = sub.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({ email, metadata: { tau_user_id: userId } });
    customerId = customer.id;
    await updateSubscription(userId, { stripe_customer_id: customerId });
  }

  const priceId = plan === 'pro'
    ? process.env.STRIPE_DEVELOPER_PRO_PRICE_ID
    : process.env.STRIPE_DEVELOPER_ENTERPRISE_PRICE_ID;

  if (!priceId) {
    return { url: null, configured: false, message: 'Stripe price ID not configured' };
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/developers/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/developers/billing`,
    metadata: { tau_user_id: userId, plan },
  });

  return { url: session.url, configured: true, sessionId: session.id };
}

export async function handleStripeWebhook(body: string, signature: string) {
  const stripe = await getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return { handled: false, reason: 'not_configured' };

  const event = stripe.webhooks.constructEvent(body, signature, secret) as {
    type: string;
    data: { object: Record<string, unknown> };
  };

  const obj = event.data.object;

  if (event.type === 'checkout.session.completed') {
    const userId = (obj.metadata as Record<string, string>)?.tau_user_id;
    const plan = (obj.metadata as Record<string, string>)?.plan ?? 'pro';
    if (userId) {
      await updateSubscription(userId, {
        plan,
        status: 'active',
        stripe_subscription_id: obj.subscription as string,
        current_period_end: new Date(Date.now() + 30 * 86400000),
        api_calls_limit: plan === 'pro' ? 100_000_000 : 999_999_999,
        build_minutes_limit: plan === 'pro' ? 500 : 9999,
      });
    }
  }

  if (event.type === 'invoice.paid') {
    const customerId = obj.customer as string;
    const pool = (await import('@/lib/db-pool')).getPool();
    const userRes = await pool.query(
      `SELECT user_id FROM tau_dev_subscriptions WHERE stripe_customer_id = $1`,
      [customerId],
    );
    const userId = userRes.rows[0]?.user_id;
    if (userId) {
      await upsertInvoice(userId, {
        stripe_invoice_id: obj.id as string,
        amount_cents: (obj.amount_paid as number) ?? 4900,
        status: 'paid',
        period_label: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
        pdf_url: (obj.invoice_pdf as string) ?? undefined,
      });
      await updateSubscription(userId, {
        payment_method_last4: '4242',
        payment_method_brand: 'visa',
      });
    }
  }

  return { handled: true, type: event.type };
}
