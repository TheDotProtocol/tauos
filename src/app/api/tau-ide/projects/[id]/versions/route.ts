import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { createVersion, listVersions, restoreVersion } from '@/lib/tau-ide/server/memory';

type Ctx = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const versions = await listVersions(params.id);
    return NextResponse.json({ versions });
  } catch (e) {
    return NextResponse.json({ versions: [] });
  }
}

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const { label } = await request.json();
    const version = await createVersion(params.id, userIdString(user), label);
    return NextResponse.json({ version }, { status: 201 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
