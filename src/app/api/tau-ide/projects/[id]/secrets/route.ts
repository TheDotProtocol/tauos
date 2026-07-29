import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProject } from '@/lib/tau-ide/server/projects';
import { listSecrets, setSecret, deleteSecret } from '@/lib/tau-ide/server/secrets';

type Ctx = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const project = await getProject(userIdString(user), params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const secrets = await listSecrets(params.id);
    return NextResponse.json({ secrets });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const project = await getProject(userIdString(user), params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const { key, value, secretType } = await request.json();
    if (!key || !value) return NextResponse.json({ error: 'key and value required' }, { status: 400 });
    const result = await setSecret(params.id, key, value, secretType);
    return NextResponse.json({ secret: result }, { status: 201 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  try {
    requireAuthUser(request);
    const { key } = await request.json();
    await deleteSecret(params.id, key);
    return NextResponse.json({ success: true });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
