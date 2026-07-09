import { NextResponse } from 'next/server';
import { checkMailServerHealth } from '@/lib/mail-transport';
import { MAIL_DOMAINS } from '@/config/mail-domains';

export async function GET() {
  const health = await checkMailServerHealth();
  return NextResponse.json({
    ...health,
    domains: MAIL_DOMAINS.map((d) => d.domain),
    node: process.env.PHONE_MAIL_NODE_NAME || 'phone-mail-node',
    inboundWebhook: '/api/taumail/smtp/incoming',
  });
}
