import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProject, listProjectFiles, upsertProjectFiles } from '@/lib/tau-ide/server/projects';
import { getAiMemory, saveAiMemory } from '@/lib/tau-ide/server/memory';

type Ctx = { params: { id: string } };

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const project = await getProject(userIdString(user), params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await request.json();
    const clientVersion = body.syncVersion ?? 0;

    if (clientVersion > 0 && clientVersion < project.sync_version) {
      const serverFiles = await listProjectFiles(params.id);
      const serverMemory = await getAiMemory(params.id);
      return NextResponse.json({
        status: 'conflict',
        serverVersion: project.sync_version,
        serverFiles,
        serverMemory,
      }, { status: 409 });
    }

    if (body.files) await upsertProjectFiles(params.id, body.files);
    if (body.memory) await saveAiMemory(params.id, body.memory);

    const updated = await getProject(userIdString(user), params.id);
    return NextResponse.json({ status: 'synced', syncVersion: updated?.sync_version ?? project.sync_version + 1 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
