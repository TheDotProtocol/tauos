import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProject, upsertProjectFiles } from '@/lib/tau-ide/server/projects';
import { createVersion } from '@/lib/tau-ide/server/memory';

type Ctx = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const project = await getProject(userIdString(user), params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const { files } = await request.json();
    if (!Array.isArray(files)) return NextResponse.json({ error: 'files array required' }, { status: 400 });
    await upsertProjectFiles(params.id, files);
    return NextResponse.json({ success: true, saved: files.length });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Ctx) {
  // Auto-save with optional snapshot
  try {
    const user = requireAuthUser(request);
    const body = await request.json();
    if (body.files) await upsertProjectFiles(params.id, body.files);
    if (body.snapshot) await createVersion(params.id, userIdString(user), body.snapshotLabel);
    return NextResponse.json({ success: true, autoSaved: true });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Auto-save failed' }, { status: 500 });
  }
}
