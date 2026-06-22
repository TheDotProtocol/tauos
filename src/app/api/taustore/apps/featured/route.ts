import { NextResponse } from 'next/server';
import { TAUSTORE_CATALOG } from '@/data/taustore-catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apps = TAUSTORE_CATALOG.filter((a) => a.is_featured && a.status === 'live').sort(
    (a, b) => a.featured_order - b.featured_order
  );

  return NextResponse.json({ success: true, apps });
}
