import { NextRequest, NextResponse } from 'next/server';
import { createPipeline, listPipelines } from '@/lib/tau-developer/server/platform-db';
import { withDeveloperHandler } from '@/lib/tau-developer/server/route-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.pipelines.list', async (userId) => {
    const projectId = request.nextUrl.searchParams.get('projectId') ?? undefined;
    const pipelines = await listPipelines(userId, projectId ?? undefined);
    return NextResponse.json({ pipelines });
  });
}

export async function POST(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.pipelines.create', async (userId) => {
    const body = await request.json();
    const pipeline = await createPipeline(
      userId,
      body.projectId,
      String(body.name ?? 'Default Pipeline'),
      String(body.configYaml ?? ''),
    );
    return NextResponse.json({ pipeline }, { status: 201 });
  });
}
