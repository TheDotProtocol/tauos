import { NextResponse } from 'next/server';
import { getBlocklist } from '@/lib/taubrowser-blocklist';

export const dynamic = 'force-dynamic';

/** Public privacy blocklist for native Tau Browser clients. */
export async function GET() {
  return NextResponse.json({
    success: true,
    blocklist: getBlocklist(),
    policy: {
      telemetry: false,
      fingerprinting: 'blocked-by-default',
      thirdPartyCookies: 'blocked',
      searchDefault: 'duckduckgo',
    },
  });
}
