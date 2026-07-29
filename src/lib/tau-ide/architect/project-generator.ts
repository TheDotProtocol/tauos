export type GeneratedProject = {
  projectName: string;
  description?: string;
  stack?: { frontend?: string; backend?: string; database?: string };
  files: { path: string; content: string; category?: string }[];
  tasks?: { id: string; title: string; status: string; agent?: string }[];
};

export function parseProjectBlock(content: string): GeneratedProject | null {
  const match = content.match(/```tau-project\n([\s\S]*?)```/);
  if (!match) {
    // Legacy format
    const legacy = content.match(/```tauscript-project\n([\s\S]*?)```/);
    if (!legacy) return null;
    try {
      const parsed = JSON.parse(legacy[1]);
      return {
        projectName: parsed.projectName || 'Generated Project',
        files: parsed.files || [],
      };
    } catch { return null; }
  }
  try {
    return JSON.parse(match[1]) as GeneratedProject;
  } catch {
    return null;
  }
}

export function importProjectToWorkspace(project: GeneratedProject) {
  const { upsertProject, getActiveProject, setActiveProjectId, createProject } = require('@/lib/tau-ide/projects');
  const existing = getActiveProject();
  const updated = {
    ...existing,
    name: project.projectName,
    description: project.description || existing.description,
    files: project.files.map((f) => ({
      path: f.path.startsWith('/') ? f.path : `/${f.path}`,
      name: f.path.split('/').pop() || f.path,
      content: f.content,
    })),
  };
  upsertProject(updated);
  return updated;
}

export type ValidationResult = {
  passed: number;
  failed: number;
  warnings: number;
  items: { name: string; status: 'pass' | 'fail' | 'warn'; message: string }[];
};

export function parseValidationBlock(content: string): ValidationResult | null {
  const match = content.match(/```tau-validation\n([\s\S]*?)```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as ValidationResult;
  } catch {
    return null;
  }
}

export function validateProjectFiles(files: { path: string; content: string }[]): ValidationResult {
  const items: ValidationResult['items'] = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  if (files.length === 0) {
    items.push({ name: 'Project files', status: 'fail', message: 'No files generated' });
    failed++;
  } else {
    items.push({ name: 'Project files', status: 'pass', message: `${files.length} files present` });
    passed++;
  }

  const hasReadme = files.some((f) => f.path.toLowerCase().includes('readme'));
  if (hasReadme) { items.push({ name: 'Documentation', status: 'pass', message: 'README found' }); passed++; }
  else { items.push({ name: 'Documentation', status: 'warn', message: 'No README found' }); warnings++; }

  const hasEnv = files.some((f) => f.path.includes('.env'));
  if (hasEnv) { items.push({ name: 'Environment', status: 'pass', message: 'Environment config found' }); passed++; }
  else { items.push({ name: 'Environment', status: 'warn', message: 'No .env.example found' }); warnings++; }

  const hasTests = files.some((f) => f.path.includes('test') || f.path.includes('spec'));
  if (hasTests) { items.push({ name: 'Tests', status: 'pass', message: 'Test files found' }); passed++; }
  else { items.push({ name: 'Tests', status: 'warn', message: 'No test files found' }); warnings++; }

  for (const file of files.filter((f) => f.path.endsWith('.tau'))) {
    try {
      const { Lexer } = require('@/lib/tauscript/lexer');
      const { Parser } = require('@/lib/tauscript/parser');
      const lexer = new Lexer(file.content);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      parser.parse();
      items.push({ name: `TauScript: ${file.path}`, status: 'pass', message: 'Syntax valid' });
      passed++;
    } catch (e) {
      items.push({ name: `TauScript: ${file.path}`, status: 'fail', message: e instanceof Error ? e.message : 'Parse error' });
      failed++;
    }
  }

  return { passed, failed, warnings, items };
}

export function extractMermaidDiagrams(content: string): string[] {
  const diagrams: string[] = [];
  const regex = /```mermaid\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    diagrams.push(match[1].trim());
  }
  return diagrams;
}
