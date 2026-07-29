import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProject } from '@/lib/tau-ide/server/projects';
import { appendConversation, getConversations } from '@/lib/tau-ide/server/memory';

type Ctx = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const conversations = await getConversations(params.id);
    return NextResponse.json({ conversations });
  } catch (e) {
    return NextResponse.json({ conversations: [] });
  }
}

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const project = await getProject(userIdString(user), params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const msg = await request.json();
    await appendConversation(params.id, msg);
    return NextResponse.json({ success: true });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
