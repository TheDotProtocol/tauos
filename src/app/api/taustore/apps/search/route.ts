import { NextRequest, NextResponse } from 'next/server';
import { getPool, isProductionDeploy } from '@/lib/db-pool';
import { TAUSTORE_CATALOG } from '@/data/taustore-catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').toLowerCase();
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sort') || 'rating';

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

    apps.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'privacy') return b.privacy_score - a.privacy_score;
      return b.rating - a.rating;
    });

    return NextResponse.json({
      apps,
      total: apps.length,
      query,
      category,
      sortBy,
    });
  } catch (error) {
    console.error('TauStore search error:', error);
    return NextResponse.json({ error: 'Failed to search apps' }, { status: 500 });
  }
}
