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
