export type ProjectFile = {
  path: string;
  name: string;
  content: string;
};

export type TauProject = {
  id: string;
  name: string;
  description: string;
  language: 'tauscript' | 'typescript' | 'javascript';
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
      {
        path: '/main.tau',
        name: 'main.tau',
        content: `// Tau IDE — TauScript v1
print("Hello from Tau IDE!");

fn greet(name) {
  return "Welcome, " + name;
}

print(greet("Developer"));
`,
      },
      {
        path: '/README.md',
        name: 'README.md',
        content: '# My Project\n\nBuilt with Tau IDE Developer Platform.\n',
      },
    ],
  };
}

export function loadProjects(): TauProject[] {
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

export function saveProjects(projects: TauProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getActiveProjectId(): string {
  if (typeof window === 'undefined') return 'default';
  return localStorage.getItem(ACTIVE_KEY) || 'default';
}

export function setActiveProjectId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function getActiveProject(): TauProject {
  const projects = loadProjects();
  const id = getActiveProjectId();
  return projects.find((p) => p.id === id) ?? projects[0];
}

export function upsertProject(project: TauProject) {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: new Date().toISOString() };
  if (idx >= 0) projects[idx] = updated;
  else projects.push(updated);
  saveProjects(projects);
  return updated;
}

export function createProject(name: string, description = ''): TauProject {
  const now = new Date().toISOString();
  const project: TauProject = {
    id: `proj_${Date.now()}`,
    name,
    description,
    language: 'tauscript',
    createdAt: now,
    updatedAt: now,
    files: [
      {
        path: '/main.tau',
        name: 'main.tau',
        content: `print("New project: ${name}");\n`,
      },
    ],
  };
  upsertProject(project);
  setActiveProjectId(project.id);
  return project;
}

export function deleteProject(id: string) {
  const projects = loadProjects().filter((p) => p.id !== id);
  if (projects.length === 0) projects.push(defaultProject());
  saveProjects(projects);
  if (getActiveProjectId() === id) setActiveProjectId(projects[0].id);
}
