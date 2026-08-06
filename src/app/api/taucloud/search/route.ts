import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
    if (!q) {
      return NextResponse.json({ success: true, results: [] });
    }
    const result = await getPool().query(
      `SELECT id, original_name, mime_type, file_size, folder, uploaded_at, is_shared, is_starred
       FROM taucloud_files
       WHERE user_id = $1
         AND deleted_at IS NULL
         AND (original_name ILIKE $2 OR mime_type ILIKE $2)
       ORDER BY uploaded_at DESC LIMIT 50`,
      [auth.userId, `%${q}%`]
    );
    return NextResponse.json({ success: true, results: result.rows, query: q });
  } catch (error) {
    console.error('TauCloud search:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
