import { getPool } from '@/lib/db-pool';
import { ensureSchema, dbAvailable } from './db';
import { getSecretValue } from './secrets';
import { auditLog } from './security';

export type GitProvider = 'github' | 'gitlab' | 'self-hosted';

export async function configureGitRemote(projectId: string, config: { provider: GitProvider; remoteUrl: string; defaultBranch?: string }) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query(
      'UPDATE tau_ide_projects SET git_remote_url = $1, git_provider = $2, git_default_branch = $3, updated_at = NOW() WHERE id = $4',
      [config.remoteUrl, config.provider, config.defaultBranch ?? 'main', projectId]
    );
  }
}

export async function logGitOperation(projectId: string, operation: string, details: Record<string, unknown>, status = 'completed') {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query(
      'INSERT INTO tau_ide_git_operations (project_id, operation, status, details) VALUES ($1,$2,$3,$4)',
      [projectId, operation, status, JSON.stringify(details)]
    );
  }
  auditLog(`git.${operation}`, { projectId, ...details });
}

async function githubFetch(token: string, path: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function githubListRepos(projectId: string) {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured for this project');
  const repos = await githubFetch(token, '/user/repos?per_page=30&sort=updated');
  return repos.map((r: { full_name: string; html_url: string; default_branch: string; private: boolean }) => ({
    fullName: r.full_name,
    url: r.html_url,
    defaultBranch: r.default_branch,
    private: r.private,
  }));
}

export async function githubCreateRepo(projectId: string, name: string, isPrivate = false) {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const repo = await githubFetch(token, '/user/repos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, private: isPrivate, auto_init: true }),
  });
  await configureGitRemote(projectId, { provider: 'github', remoteUrl: repo.clone_url, defaultBranch: repo.default_branch });
  await logGitOperation(projectId, 'create_repo', { name, url: repo.html_url });
  return repo;
}

export async function githubListBranches(projectId: string, owner: string, repo: string) {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const branches = await githubFetch(token, `/repos/${owner}/${repo}/branches`);
  return branches.map((b: { name: string; commit: { sha: string } }) => ({ name: b.name, sha: b.commit.sha.slice(0, 7) }));
}

export async function githubListCommits(projectId: string, owner: string, repo: string, branch = 'main') {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const commits = await githubFetch(token, `/repos/${owner}/${repo}/commits?sha=${branch}&per_page=20`);
  return commits.map((c: { sha: string; commit: { message: string; author: { name: string; date: string } } }) => ({
    sha: c.sha.slice(0, 7),
    message: c.commit.message,
    author: c.commit.author.name,
    date: c.commit.author.date,
  }));
}

export async function githubGetFileTree(projectId: string, owner: string, repo: string, branch = 'main') {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const data = await githubFetch(token, `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  return data.tree?.filter((t: { type: string }) => t.type === 'blob').slice(0, 100) ?? [];
}

/** Push project files to GitHub — creates/updates files via Contents API */
export async function githubPushFiles(projectId: string, owner: string, repo: string, files: { path: string; content: string }[], message: string, branch = 'main') {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const results = [];
  for (const file of files.slice(0, 20)) {
    const filePath = file.path.replace(/^\//, '');
    let sha: string | undefined;
    try {
      const existing = await githubFetch(token, `/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`);
      sha = existing.sha;
    } catch { /* new file */ }
    const result = await githubFetch(token, `/repos/${owner}/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, content: Buffer.from(file.content).toString('base64'), branch, ...(sha ? { sha } : {}) }),
    });
    results.push({ path: filePath, sha: result.content?.sha });
  }
  await logGitOperation(projectId, 'push', { owner, repo, branch, files: results.length });
  return results;
}

export async function gitlabListProjects(projectId: string) {
  const token = await getSecretValue(projectId, 'GITLAB_TOKEN');
  const base = (await getSecretValue(projectId, 'GITLAB_URL')) || 'https://gitlab.com';
  if (!token) throw new Error('GITLAB_TOKEN secret not configured');
  const res = await fetch(`${base}/api/v4/projects?membership=true&per_page=20`, {
    headers: { 'PRIVATE-TOKEN': token },
  });
  if (!res.ok) throw new Error(`GitLab API ${res.status}`);
  const projects = await res.json();
  return projects.map((p: { name: string; web_url: string; default_branch: string }) => ({ name: p.name, url: p.web_url, defaultBranch: p.default_branch }));
}

/** Fetch remote file contents (pull/fetch foundation) */
export async function githubPullFiles(projectId: string, owner: string, repo: string, branch = 'main') {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const tree = await githubFetch(token, `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  const blobs = (tree.tree ?? []).filter((t: { type: string; path: string }) => t.type === 'blob').slice(0, 50);
  const files: { path: string; content: string; sha?: string }[] = [];
  for (const blob of blobs) {
    try {
      const file = await githubFetch(token, `/repos/${owner}/${repo}/contents/${blob.path}?ref=${branch}`);
      const content = file.content ? Buffer.from(file.content, 'base64').toString('utf-8') : '';
      files.push({ path: `/${blob.path}`, content, sha: file.sha });
    } catch { /* skip binary/large */ }
  }
  await logGitOperation(projectId, 'pull', { owner, repo, branch, files: files.length });
  return files;
}

export async function githubFetchRemote(projectId: string, owner: string, repo: string, branch = 'main') {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const ref = await githubFetch(token, `/repos/${owner}/${repo}/git/ref/heads/${branch}`);
  await logGitOperation(projectId, 'fetch', { owner, repo, sha: ref.object?.sha });
  return { sha: ref.object?.sha?.slice(0, 7), branch };
}

/** Diff two strings — line-based */
export function computeDiff(local: string, remote: string): { additions: number; deletions: number; hunks: string[]; conflict: boolean } {
  const localLines = local.split('\n');
  const remoteLines = remote.split('\n');
  const hunks: string[] = [];
  let additions = 0;
  let deletions = 0;
  const max = Math.max(localLines.length, remoteLines.length);
  for (let i = 0; i < max; i++) {
    const l = localLines[i];
    const r = remoteLines[i];
    if (l === r) continue;
    if (l === undefined) { hunks.push(`+ ${r}`); additions++; }
    else if (r === undefined) { hunks.push(`- ${l}`); deletions++; }
    else { hunks.push(`- ${l}`); hunks.push(`+ ${r}`); additions++; deletions++; }
  }
  return { additions, deletions, hunks, conflict: additions > 0 && deletions > 0 };
}

export function detectConflicts(localFiles: { path: string; content: string }[], remoteFiles: { path: string; content: string }[]) {
  const conflicts: Array<{ path: string; local: string; remote: string; diff: ReturnType<typeof computeDiff> }> = [];
  const remoteMap = new Map(remoteFiles.map((f) => [f.path, f.content]));
  for (const local of localFiles) {
    const remote = remoteMap.get(local.path);
    if (remote !== undefined && remote !== local.content) {
      conflicts.push({ path: local.path, local: local.content, remote, diff: computeDiff(local.content, remote) });
    }
  }
  return conflicts;
}

/** Merge: prefer local unless strategy is 'theirs' */
export function mergeFiles(
  localFiles: { path: string; content: string }[],
  remoteFiles: { path: string; content: string }[],
  strategy: 'ours' | 'theirs' | 'manual' = 'ours'
) {
  const merged = new Map(localFiles.map((f) => [f.path, f.content]));
  const conflicts = detectConflicts(localFiles, remoteFiles);
  for (const f of remoteFiles) {
    if (!merged.has(f.path)) merged.set(f.path, f.content);
    else if (strategy === 'theirs' && conflicts.every((c) => c.path !== f.path)) {
      merged.set(f.path, f.content);
    }
  }
  if (strategy === 'theirs') {
    conflicts.forEach((c) => merged.set(c.path, c.remote));
  }
  return {
    files: Array.from(merged.entries()).map(([path, content]) => ({ path, content })),
    conflicts,
  };
}

export async function githubCloneRepo(projectId: string, owner: string, repo: string, branch = 'main') {
  const files = await githubPullFiles(projectId, owner, repo, branch);
  await configureGitRemote(projectId, { provider: 'github', remoteUrl: `https://github.com/${owner}/${repo}.git`, defaultBranch: branch });
  await logGitOperation(projectId, 'clone', { owner, repo, branch });
  return { files, count: files.length };
}

/** Pull Requests — GitHub */
export async function githubListPullRequests(projectId: string, owner: string, repo: string) {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const prs = await githubFetch(token, `/repos/${owner}/${repo}/pulls?state=open&per_page=20`);
  return prs.map((p: { number: number; title: string; user: { login: string }; state: string; head: { ref: string }; base: { ref: string } }) => ({
    number: p.number,
    title: p.title,
    author: p.user.login,
    state: p.state,
    head: p.head.ref,
    base: p.base.ref,
  }));
}

export async function githubCreatePullRequest(projectId: string, owner: string, repo: string, title: string, head: string, base = 'main', body = '') {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const pr = await githubFetch(token, `/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, head, base, body }),
  });
  await logGitOperation(projectId, 'create_pr', { number: pr.number, title });
  return pr;
}

export async function githubMergePullRequest(projectId: string, owner: string, repo: string, number: number) {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  const result = await githubFetch(token, `/repos/${owner}/${repo}/pulls/${number}/merge`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merge_method: 'squash' }),
  });
  await logGitOperation(projectId, 'merge_pr', { number });
  return result;
}

export async function githubGetPullRequestChecks(projectId: string, owner: string, repo: string, ref: string) {
  const token = await getSecretValue(projectId, 'GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN secret not configured');
  try {
    const checks = await githubFetch(token, `/repos/${owner}/${repo}/commits/${ref}/check-runs?per_page=10`);
    return (checks.check_runs ?? []).map((c: { name: string; status: string; conclusion: string | null }) => ({
      name: c.name,
      status: c.status,
      conclusion: c.conclusion,
    }));
  } catch {
    return [];
  }
}
