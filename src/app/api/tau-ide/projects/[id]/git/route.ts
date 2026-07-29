import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProject, listProjectFiles, upsertProjectFiles } from '@/lib/tau-ide/server/projects';
import {
  configureGitRemote, githubListRepos, githubCreateRepo, githubListBranches, githubListCommits,
  githubPushFiles, gitlabListProjects, githubPullFiles, githubFetchRemote, githubCloneRepo,
  detectConflicts, mergeFiles, computeDiff, githubListPullRequests, githubCreatePullRequest,
  githubMergePullRequest, githubGetPullRequestChecks,
} from '@/lib/tau-ide/server/git-remote';

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
    if (action === 'pull_requests' && owner && repo) {
      const prs = await githubListPullRequests(params.id, owner, repo);
      return NextResponse.json({ pullRequests: prs });
    }
    if (action === 'fetch' && owner && repo) {
      const result = await githubFetchRemote(params.id, owner, repo, project.git_default_branch);
      return NextResponse.json(result);
    }
    if (action === 'diff' && owner && repo) {
      const path = request.nextUrl.searchParams.get('path') ?? '';
      const localFiles = await listProjectFiles(params.id);
      const remoteFiles = await githubPullFiles(params.id, owner, repo, project.git_default_branch);
      const local = localFiles.find((f) => f.path === path)?.content ?? '';
      const remote = remoteFiles.find((f) => f.path === path)?.content ?? '';
      return NextResponse.json({ diff: computeDiff(local, remote), path });
    }
    if (action === 'conflicts' && owner && repo) {
      const localFiles = await listProjectFiles(params.id);
      const remoteFiles = await githubPullFiles(params.id, owner, repo, project.git_default_branch);
      return NextResponse.json({ conflicts: detectConflicts(
        localFiles.map((f) => ({ path: f.path, content: f.content })),
        remoteFiles
      ) });
    }
    if (action === 'checks' && owner && repo) {
      const ref = request.nextUrl.searchParams.get('ref') ?? 'main';
      const checks = await githubGetPullRequestChecks(params.id, owner, repo, ref);
      return NextResponse.json({ checks });
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
    if (body.action === 'pull') {
      const remoteFiles = await githubPullFiles(params.id, body.owner, body.repo, body.branch ?? project.git_default_branch);
      const localFiles = (await listProjectFiles(params.id)).map((f) => ({ path: f.path, content: f.content }));
      const { files, conflicts } = mergeFiles(localFiles, remoteFiles, body.strategy ?? 'ours');
      if (body.apply && conflicts.length === 0) {
        await upsertProjectFiles(params.id, files.map((f) => ({ ...f, name: f.path.split('/').pop() || f.path })));
      }
      return NextResponse.json({ files: remoteFiles.length, conflicts, merged: body.apply && conflicts.length === 0 });
    }
    if (body.action === 'clone') {
      const { files, count } = await githubCloneRepo(params.id, body.owner, body.repo, body.branch);
      if (body.apply !== false) {
        await upsertProjectFiles(params.id, files.map((f) => ({ ...f, name: f.path.split('/').pop() || f.path })));
      }
      return NextResponse.json({ cloned: count, files });
    }
    if (body.action === 'merge') {
      const localFiles = (await listProjectFiles(params.id)).map((f) => ({ path: f.path, content: f.content }));
      const remoteFiles = await githubPullFiles(params.id, body.owner, body.repo, body.branch ?? project.git_default_branch);
      const result = mergeFiles(localFiles, remoteFiles, body.strategy ?? 'manual');
      if (body.apply && result.conflicts.length === 0) {
        await upsertProjectFiles(params.id, result.files.map((f) => ({ ...f, name: f.path.split('/').pop() || f.path })));
      }
      return NextResponse.json(result);
    }
    if (body.action === 'create_pr') {
      const pr = await githubCreatePullRequest(params.id, body.owner, body.repo, body.title, body.head, body.base, body.body);
      return NextResponse.json({ pullRequest: pr });
    }
    if (body.action === 'merge_pr') {
      const result = await githubMergePullRequest(params.id, body.owner, body.repo, body.number);
      return NextResponse.json({ merged: result.merged });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: e instanceof Error ? e.message : 'Git operation failed' }, { status: 500 });
  }
}
