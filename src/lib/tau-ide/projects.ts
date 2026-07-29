import { apiFetch, setSyncMeta } from './sync-client';

export type ProjectFile = { path: string; name: string; content: string };

export type TauProject = {
  id: string;
  name: string;
  description: string;
  language: 'tauscript' | 'typescript' | 'javascript' | 'python' | 'mixed';
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = 'tau-ide-projects';
const ACTIVE_KEY = 'tau-ide-active-project';

function defaultProject(): TauProject {
  const now = new Date().toISOString();
  return {
    id: 'default',
    name: 'My First Project',
    description: 'A TauScript starter project',
    language: 'tauscript',
    createdAt: now,
    updatedAt: now,
    files: [
      { path: '/main.tau', name: 'main.tau', content: `print("Hello from Tau IDE!");\n` },
      { path: '/README.md', name: 'README.md', content: '# My Project\n\nBuilt with Tau IDE.\n' },
    ],
  };
}

function rowToProject(row: Record<string, unknown>, files: ProjectFile[] = []): TauProject {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description ?? ''),
    language: (row.language as TauProject['language']) ?? 'tauscript',
    files,
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? row.updatedAt ?? new Date().toISOString()),
  };
}

function loadLocal(): TauProject[] {
  if (typeof window === 'undefined') return [defaultProject()];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = [defaultProject()];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as TauProject[];
  } catch {
    return [defaultProject()];
  }
}

function saveLocal(projects: TauProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export async function loadProjects(): Promise<TauProject[]> {
  try {
    const data = await apiFetch<{ projects: Record<string, unknown>[] }>('/api/tau-ide/projects');
    if (data.projects?.length) {
      const projects = await Promise.all(
        data.projects.map(async (p) => {
          try {
            const detail = await apiFetch<{ files: { path: string; name: string; content: string }[] }>(`/api/tau-ide/projects/${p.id}`);
            return rowToProject(p, detail.files ?? []);
          } catch {
            return rowToProject(p);
          }
        })
      );
      saveLocal(projects);
      return projects;
    }
  } catch {
    /* fall back to local */
  }
  return loadLocal();
}

export function loadProjectsSync(): TauProject[] {
  return loadLocal();
}

export function getActiveProjectId(): string {
  if (typeof window === 'undefined') return 'default';
  return localStorage.getItem(ACTIVE_KEY) || 'default';
}

export function setActiveProjectId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveProject(): TauProject {
  const projects = loadLocal();
  const id = getActiveProjectId();
  return projects.find((p) => p.id === id) ?? projects[0];
}

export async function upsertProject(project: TauProject): Promise<TauProject> {
  const updated = { ...project, updatedAt: new Date().toISOString() };
  const local = loadLocal();
  const idx = local.findIndex((p) => p.id === project.id);
  if (idx >= 0) local[idx] = updated; else local.push(updated);
  saveLocal(local);

  try {
    if (project.id.startsWith('proj_') || project.id === 'default') {
      // Local-only id — create on server
      const created = await apiFetch<{ project: Record<string, unknown> }>('/api/tau-ide/projects', {
        method: 'POST',
        body: JSON.stringify({ name: project.name, description: project.description, language: project.language }),
      });
      const serverProject = rowToProject(created.project, project.files);
      setActiveProjectId(serverProject.id);
      await apiFetch(`/api/tau-ide/projects/${serverProject.id}/files`, {
        method: 'PUT',
        body: JSON.stringify({ files: project.files }),
      });
      setSyncMeta(serverProject.id, { status: 'synced', version: 1 });
      return serverProject;
    }
    await apiFetch(`/api/tau-ide/projects/${project.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: project.name, description: project.description }),
    });
    await apiFetch(`/api/tau-ide/projects/${project.id}/files`, {
      method: 'PUT',
      body: JSON.stringify({ files: project.files }),
    });
    setSyncMeta(project.id, { status: 'synced' });
  } catch {
    setSyncMeta(project.id, { status: 'pending' });
  }
  return updated;
}

export function upsertProjectLocal(project: TauProject): TauProject {
  const updated = { ...project, updatedAt: new Date().toISOString() };
  const local = loadLocal();
  const idx = local.findIndex((p) => p.id === project.id);
  if (idx >= 0) local[idx] = updated; else local.push(updated);
  saveLocal(local);
  upsertProject(updated).catch(() => {});
  return updated;
}

export async function createProject(name: string, description = ''): Promise<TauProject> {
  try {
    const data = await apiFetch<{ project: Record<string, unknown> }>('/api/tau-ide/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    const detail = await apiFetch<{ project: Record<string, unknown>; files: ProjectFile[] }>(`/api/tau-ide/projects/${data.project.id}`);
    const project = rowToProject(detail.project ?? data.project, detail.files ?? []);
    const local = loadLocal();
    local.unshift(project);
    saveLocal(local);
    setActiveProjectId(project.id);
    return project;
  } catch {
    const now = new Date().toISOString();
    const project: TauProject = {
      id: `proj_${Date.now()}`,
      name,
      description,
      language: 'tauscript',
      createdAt: now,
      updatedAt: now,
      files: [{ path: '/main.tau', name: 'main.tau', content: `print("New project: ${name}");\n` }],
    };
    upsertProjectLocal(project);
    setActiveProjectId(project.id);
    return project;
  }
}

export async function deleteProject(id: string) {
  try {
    await apiFetch(`/api/tau-ide/projects/${id}`, { method: 'DELETE' });
  } catch { /* local delete anyway */ }
  const projects = loadLocal().filter((p) => p.id !== id);
  if (projects.length === 0) projects.push(defaultProject());
  saveLocal(projects);
  if (getActiveProjectId() === id) setActiveProjectId(projects[0].id);
}

export async function syncProject(projectId: string): Promise<{ status: string; syncVersion?: number }> {
  const data = await apiFetch<{ status: string; syncVersion: number }>(`/api/tau-ide/projects/${projectId}/sync`, { method: 'POST' });
  setSyncMeta(projectId, { status: 'synced', version: data.syncVersion });
  return data;
}

export async function createSnapshot(projectId: string, label?: string) {
  return apiFetch(`/api/tau-ide/projects/${projectId}/versions`, {
    method: 'POST',
    body: JSON.stringify({ label }),
  });
}

export function saveProjects(projects: TauProject[]) {
  saveLocal(projects);
}
