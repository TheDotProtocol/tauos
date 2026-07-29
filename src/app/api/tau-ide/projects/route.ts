import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { rateLimit, auditLog } from '@/lib/tau-ide/server/security';
import { listProjects, createProject } from '@/lib/tau-ide/server/projects';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuthUser(request);
    if (!rateLimit(`projects:${userIdString(user)}`, 120)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    const projects = await listProjects(userIdString(user));
    return NextResponse.json({ projects });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed to list projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuthUser(request);
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: 'name required' }, { status: 400 });
    const project = await createProject(userIdString(user), body);
    auditLog('project.create', { userId: userIdString(user), projectId: project.id });
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: e instanceof Error ? e.message : 'Create failed' }, { status: 500 });
  }
}
