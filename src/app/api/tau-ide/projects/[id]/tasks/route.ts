import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProject } from '@/lib/tau-ide/server/projects';
import { listTasks, createTask, updateTask } from '@/lib/tau-ide/server/tasks';

type Ctx = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const tasks = await listTasks(params.id);
    return NextResponse.json({ tasks });
  } catch (e) {
    return NextResponse.json({ tasks: [] });
  }
}

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    requireAuthUser(request);
    const task = await createTask(params.id, await request.json());
    return NextResponse.json({ task }, { status: 201 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  try {
    requireAuthUser(request);
    const { taskId, ...patch } = await request.json();
    const task = await updateTask(taskId, patch);
    return NextResponse.json({ task });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
