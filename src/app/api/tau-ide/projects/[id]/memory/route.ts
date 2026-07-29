import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProject } from '@/lib/tau-ide/server/projects';
import { getAiMemory, saveAiMemory, getConversations, appendConversation, createVersion, listVersions, restoreVersion } from '@/lib/tau-ide/server/memory';

type Ctx = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    requireAuthUser(request);
    const memory = await getAiMemory(params.id);
    return NextResponse.json({ memory });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    requireAuthUser(request);
    const { memory } = await request.json();
    await saveAiMemory(params.id, memory);
    return NextResponse.json({ success: true });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
