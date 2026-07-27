import { NextResponse } from 'next/server';
import { MAIL_DOMAINS } from '@/config/mail-domains';

export async function GET() {
  return NextResponse.json({
    domains: MAIL_DOMAINS.map((d) => ({
      domain: d.domain,
      label: d.label,
      organization: d.organization,
      mxHost: d.mxHost,
      comingSoon: d.comingSoon,
    })),
    defaultDomain: 'taumail.org',
    count: MAIL_DOMAINS.length,
  });
}
