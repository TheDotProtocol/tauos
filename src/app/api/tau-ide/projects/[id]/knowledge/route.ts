import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getKnowledgeGraph, buildKnowledgeFromMemory, upsertKnowledgeNode, linkKnowledge } from '@/lib/tau-ide/server/knowledge';

type Ctx = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const graph = await getKnowledgeGraph(params.id);
    return NextResponse.json(graph);
  } catch (e) {
    return NextResponse.json({ nodes: [], edges: [] });
  }
}

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    requireAuthUser(request);
    const body = await request.json();
    if (body.action === 'rebuild') {
      const graph = await buildKnowledgeFromMemory(params.id);
      return NextResponse.json(graph);
    }
    if (body.sourceId && body.targetId) {
      await linkKnowledge(params.id, body.sourceId, body.targetId, body.relation ?? 'relates_to');
      return NextResponse.json({ success: true });
    }
    const node = await upsertKnowledgeNode(params.id, body);
    return NextResponse.json({ node }, { status: 201 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
