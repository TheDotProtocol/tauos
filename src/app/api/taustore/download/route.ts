import { NextRequest, NextResponse } from 'next/server';
import { TAUSTORE_CATALOG } from '@/data/taustore-catalog';
import { getPool } from '@/lib/db-pool';

export const dynamic = 'force-dynamic';

async function ensureDownloadsTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS taustore_downloads (
      app_id TEXT PRIMARY KEY,
      download_count BIGINT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function POST(request: NextRequest) {
  try {
    const { appId } = await request.json();
    if (!appId) {
      return NextResponse.json({ error: 'appId required' }, { status: 400 });
    }
    const app = TAUSTORE_CATALOG.find((a) => a.id === appId);
    if (!app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }
    await ensureDownloadsTable();
    await getPool().query(
      `INSERT INTO taustore_downloads (app_id, download_count)
       VALUES ($1, 1)
       ON CONFLICT (app_id) DO UPDATE SET download_count = taustore_downloads.download_count + 1, updated_at = NOW()`,
      [appId]
    );
    return NextResponse.json({
      success: true,
      app: {
        id: app.id,
        name: app.name,
        href: app.href,
        version: app.version,
      },
      artifactUrl: app.href,
    });
  } catch (error) {
    console.error('TauStore download:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
