import { NextRequest, NextResponse } from 'next/server';
import { TAUSTORE_CATALOG } from '@/data/taustore-catalog';

export const dynamic = 'force-dynamic';

/** Legacy route — delegates to catalog-backed search */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('query') || searchParams.get('q') || '').toLowerCase();
  const category = searchParams.get('category') || '';

  let apps = TAUSTORE_CATALOG.filter((a) => a.status === 'live');

  if (query) {
    apps = apps.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
    );
  }
  if (category) {
    apps = apps.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    apps,
    total: apps.length,
    query,
    category,
  });
}
