import { getPool } from '@/lib/db-pool';
import { ensureSchema, dbAvailable, fileStoreRead, fileStoreWrite } from './db';

export type ProjectRow = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  language: string;
  settings: Record<string, unknown>;
  is_favorite: boolean;
  git_remote_url: string | null;
  git_provider: string | null;
  git_default_branch: string;
  sync_version: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
};

export type ProjectFileRow = {
  id: string;
  project_id: string;
  path: string;
  name: string;
  content: string;
  folder_path: string;
  sync_version: number;
  updated_at: string;
};

export async function listProjects(userId: string): Promise<ProjectRow[]> {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query(
      `SELECT p.* FROM tau_ide_projects p
       LEFT JOIN tau_ide_project_members m ON m.project_id = p.id
       WHERE p.owner_id = $1 OR m.user_id = $1
       ORDER BY p.last_activity_at DESC`,
      [userId]
    );
    return res.rows;
  }
  return fileStoreRead<ProjectRow[]>(userId, 'projects', []);
}

export async function getProject(userId: string, projectId: string): Promise<ProjectRow | null> {
  const projects = await listProjects(userId);
  return projects.find((p) => p.id === projectId) ?? null;
}

export async function createProject(userId: string, data: { name: string; description?: string; language?: string }) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query(
      `INSERT INTO tau_ide_projects (owner_id, name, description, language)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, data.name, data.description ?? '', data.language ?? 'tauscript']
    );
    const project = res.rows[0];
    await getPool().query(
      `INSERT INTO tau_ide_project_files (project_id, path, name, content) VALUES ($1, '/main.tau', 'main.tau', $2)`,
      [project.id, `print("Hello from ${data.name}");\n`]
    );
    await getPool().query(
      `INSERT INTO tau_ide_project_files (project_id, path, name, content) VALUES ($1, '/README.md', 'README.md', $2)`,
      [project.id, `# ${data.name}\n\nBuilt with Tau IDE.\n`]
    );
    await getPool().query(
      `INSERT INTO tau_ide_project_members (project_id, user_id, role) VALUES ($1, $2, 'owner')`,
      [project.id, userId]
    );
    return project as ProjectRow;
  }
  const projects = fileStoreRead<ProjectRow[]>(userId, 'projects', []);
  const project: ProjectRow = {
    id: `proj_${Date.now()}`,
    owner_id: userId,
    name: data.name,
    description: data.description ?? '',
    language: data.language ?? 'tauscript',
    settings: {},
    is_favorite: false,
    git_remote_url: null,
    git_provider: null,
    git_default_branch: 'main',
    sync_version: 1,
    last_activity_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  projects.unshift(project);
  fileStoreWrite(userId, 'projects', projects);
  const files = [{ project_id: project.id, path: '/main.tau', name: 'main.tau', content: `print("Hello from ${data.name}");\n` }];
  fileStoreWrite(userId, `files-${project.id}`, files);
  return project;
}

export async function updateProject(userId: string, projectId: string, patch: Partial<ProjectRow>) {
  if (await dbAvailable()) {
    await ensureSchema();
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    for (const [k, v] of Object.entries(patch)) {
      if (['name', 'description', 'language', 'settings', 'is_favorite', 'git_remote_url', 'git_provider', 'git_default_branch'].includes(k)) {
        fields.push(`${k} = $${i++}`);
        values.push(k === 'settings' ? JSON.stringify(v) : v);
      }
    }
    fields.push(`updated_at = NOW()`, `last_activity_at = NOW()`, `sync_version = sync_version + 1`);
    values.push(projectId, userId);
    const res = await getPool().query(
      `UPDATE tau_ide_projects SET ${fields.join(', ')} WHERE id = $${i++} AND owner_id = $${i} RETURNING *`,
      values
    );
    return res.rows[0] as ProjectRow;
  }
  const projects = fileStoreRead<ProjectRow[]>(userId, 'projects', []);
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx < 0) throw new Error('Project not found');
  projects[idx] = { ...projects[idx], ...patch, updated_at: new Date().toISOString(), sync_version: projects[idx].sync_version + 1 };
  fileStoreWrite(userId, 'projects', projects);
  return projects[idx];
}

export async function deleteProject(userId: string, projectId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query('DELETE FROM tau_ide_projects WHERE id = $1 AND owner_id = $2', [projectId, userId]);
    return;
  }
  const projects = fileStoreRead<ProjectRow[]>(userId, 'projects', []).filter((p) => p.id !== projectId);
  fileStoreWrite(userId, 'projects', projects);
}

export async function listProjectFiles(projectId: string): Promise<ProjectFileRow[]> {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('SELECT * FROM tau_ide_project_files WHERE project_id = $1 ORDER BY path', [projectId]);
    return res.rows;
  }
  return [];
}

export async function upsertProjectFiles(projectId: string, files: { path: string; name: string; content: string }[]) {
  if (await dbAvailable()) {
    await ensureSchema();
    for (const f of files) {
      await getPool().query(
        `INSERT INTO tau_ide_project_files (project_id, path, name, content, sync_version, updated_at)
         VALUES ($1, $2, $3, $4, 1, NOW())
         ON CONFLICT (project_id, path) DO UPDATE SET content = $4, sync_version = tau_ide_project_files.sync_version + 1, updated_at = NOW()`,
        [projectId, f.path, f.name, f.content]
      );
    }
    await getPool().query('UPDATE tau_ide_projects SET sync_version = sync_version + 1, last_activity_at = NOW() WHERE id = $1', [projectId]);
    return;
  }
}

export async function getProjectWithFiles(userId: string, projectId: string) {
  const project = await getProject(userId, projectId);
  if (!project) return null;
  const files = await listProjectFiles(projectId);
  return { project, files };
}
