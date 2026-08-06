import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { listUserShares, revokeShareLink } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const shares = await listUserShares(auth.userId);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tauos.org';
    const items = shares.map((row) => ({
      ...row,
      fullUrl: `${baseUrl}/taucloud/shared/${row.token}`,
      isExpired: row.expires_at ? new Date(row.expires_at) < new Date() : false,
    }));

    return NextResponse.json({ success: true, shares: items });
  } catch (error) {
    console.error('TauCloud shares list:', error);
    return NextResponse.json({ error: 'Failed to load shares' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const shareId = request.nextUrl.searchParams.get('id');
    if (!shareId) {
      return NextResponse.json({ error: 'Share id required' }, { status: 400 });
    }

    const revoked = await revokeShareLink(auth.userId, shareId);
    return NextResponse.json({ success: true, share: revoked });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Revoke failed';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
