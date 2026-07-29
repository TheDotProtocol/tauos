import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProject, listProjectFiles } from '@/lib/tau-ide/server/projects';
import { configureGitRemote, githubListRepos, githubCreateRepo, githubListBranches, githubListCommits, githubPushFiles, gitlabListProjects } from '@/lib/tau-ide/server/git-remote';

type Ctx = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const project = await getProject(userIdString(user), params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const action = request.nextUrl.searchParams.get('action');
    const owner = request.nextUrl.searchParams.get('owner') ?? '';
    const repo = request.nextUrl.searchParams.get('repo') ?? '';

    if (action === 'repos') {
      try {
        const repos = project.git_provider === 'gitlab'
          ? await gitlabListProjects(params.id)
          : await githubListRepos(params.id);
        return NextResponse.json({ repos });
      } catch (e) {
        return NextResponse.json({ repos: [], error: e instanceof Error ? e.message : 'Configure GITHUB_TOKEN secret' });
      }
    }
    if (action === 'branches' && owner && repo) {
      const branches = await githubListBranches(params.id, owner, repo);
      return NextResponse.json({ branches });
    }
    if (action === 'commits' && owner && repo) {
      const commits = await githubListCommits(params.id, owner, repo, project.git_default_branch);
      return NextResponse.json({ commits });
    }

    return NextResponse.json({
      remote: project.git_remote_url,
      provider: project.git_provider,
      branch: project.git_default_branch,
    });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const project = await getProject(userIdString(user), params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const body = await request.json();

    if (body.action === 'configure') {
      await configureGitRemote(params.id, body);
      return NextResponse.json({ success: true });
    }
    if (body.action === 'create_repo') {
      const repo = await githubCreateRepo(params.id, body.name, body.private);
      return NextResponse.json({ repo });
    }
    if (body.action === 'push') {
      const files = body.files ?? (await listProjectFiles(params.id)).map((f) => ({ path: f.path, content: f.content }));
      const results = await githubPushFiles(params.id, body.owner, body.repo, files, body.message ?? 'Update from Tau IDE', body.branch);
      return NextResponse.json({ pushed: results.length, results });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: e instanceof Error ? e.message : 'Git operation failed' }, { status: 500 });
  }
}
