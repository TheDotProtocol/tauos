import { NextRequest, NextResponse } from 'next/server';
import { getDownloadsForAgent } from '@/lib/taubrowser-downloads';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') ?? '';
  const downloads = getDownloadsForAgent(userAgent);
  return NextResponse.json({ success: true, ...downloads });
}
