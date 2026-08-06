import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { createJob, getJob, listJobs, runJobAsync } from '@/lib/tau-ide/server/jobs';
import { buildKnowledgeFromMemory } from '@/lib/tau-ide/server/knowledge';
import { validateProjectFiles } from '@/lib/tau-ide/architect/project-generator';
import { listProjectFiles } from '@/lib/tau-ide/server/projects';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuthUser(request);
    const id = request.nextUrl.searchParams.get('id');
    if (id) {
      const job = await getJob(id);
      return NextResponse.json({ job });
    }
    const jobs = await listJobs(userIdString(user));
    return NextResponse.json({ jobs });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ jobs: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuthUser(request);
    const { jobType, projectId, input } = await request.json();
    const job = await createJob(userIdString(user), jobType, input ?? {}, projectId);

    // Fire and forget background processing
    if (jobType === 'validate') {
      runJobAsync(job.id, async () => {
        const files = await listProjectFiles(projectId);
        return validateProjectFiles(files.map((f) => ({ path: f.path, content: f.content })));
      }).catch(console.error);
    } else if (jobType === 'index_knowledge') {
      runJobAsync(job.id, async () => buildKnowledgeFromMemory(projectId)).catch(console.error);
    } else if (jobType === 'deploy') {
      runJobAsync(job.id, async () => ({
        environment: input?.environment ?? 'production',
        branch: input?.branch ?? 'main',
        status: 'deployed',
      })).catch(console.error);
    }

    return NextResponse.json({ job }, { status: 202 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
