import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProjectWithFiles, updateProject, deleteProject } from '@/lib/tau-ide/server/projects';

type Ctx = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const data = await getProjectWithFiles(userIdString(user), params.id);
    if (!data) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const body = await request.json();
    const project = await updateProject(userIdString(user), params.id, body);
    return NextResponse.json({ project });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: e instanceof Error ? e.message : 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    await deleteProject(userIdString(user), params.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
