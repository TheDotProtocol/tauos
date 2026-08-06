import { NextRequest, NextResponse } from 'next/server';
import { listMarketplace } from '@/lib/tau-developer/server/platform-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category') ?? undefined;
  const items = await listMarketplace(category);
  const featured = items.find((i) => i.featured) ?? items[0] ?? null;
  return NextResponse.json({ items, featured });
}
