import { getPool } from '@/lib/db-pool';
import { ensureSchema, dbAvailable, fileStoreRead, fileStoreWrite } from './db';
import { getSecretValue } from './secrets';
import { listProjectFiles } from './projects';
import { getAiMemory, getConversations } from './memory';
import { listTasks } from './tasks';

export type KnowledgeNode = { id: string; project_id: string; node_type: string; label: string; content: string; metadata: Record<string, unknown> };

export async function upsertKnowledgeNode(projectId: string, node: { node_type: string; label: string; content?: string; metadata?: Record<string, unknown> }) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query(
      `INSERT INTO tau_ide_knowledge_nodes (project_id, node_type, label, content, metadata) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [projectId, node.node_type, node.label, node.content ?? '', JSON.stringify(node.metadata ?? {})]
    );
    return res.rows[0];
  }
  const nodes = fileStoreRead<KnowledgeNode[]>(`global`, `knowledge-${projectId}`, []);
  const row: KnowledgeNode = { id: `kn_${Date.now()}`, project_id: projectId, node_type: node.node_type, label: node.label, content: node.content ?? '', metadata: node.metadata ?? {} };
  nodes.push(row);
  fileStoreWrite(`global`, `knowledge-${projectId}`, nodes);
  return row;
}

export async function linkKnowledge(projectId: string, sourceId: string, targetId: string, relation: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query(
      'INSERT INTO tau_ide_knowledge_edges (project_id, source_id, target_id, relation) VALUES ($1,$2,$3,$4)',
      [projectId, sourceId, targetId, relation]
    );
  }
}

export async function getKnowledgeGraph(projectId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const nodes = await getPool().query('SELECT * FROM tau_ide_knowledge_nodes WHERE project_id = $1', [projectId]);
    const edges = await getPool().query('SELECT * FROM tau_ide_knowledge_edges WHERE project_id = $1', [projectId]);
    return { nodes: nodes.rows, edges: edges.rows };
  }
  const nodes = fileStoreRead(`global`, `knowledge-${projectId}`, []);
  return { nodes, edges: [] };
}

export async function buildKnowledgeFromMemory(projectId: string) {
  const memory = await getAiMemory(projectId);
  if (!memory) return { nodes: [], edges: [] };

  const nodes: KnowledgeNode[] = [];
  for (const goal of memory.goals ?? []) {
    nodes.push(await upsertKnowledgeNode(projectId, { node_type: 'requirement', label: goal.slice(0, 100), content: goal }));
  }
  for (const [phase, content] of Object.entries(memory.deliverables ?? {})) {
    if (phase.includes('diagram')) continue;
    nodes.push(await upsertKnowledgeNode(projectId, { node_type: phase.includes('architecture') ? 'architecture' : 'deliverable', label: phase, content: content.slice(0, 500) }));
  }
  for (const d of memory.architectureDecisions ?? []) {
    nodes.push(await upsertKnowledgeNode(projectId, { node_type: 'decision', label: d.decision.slice(0, 80), content: d.rationale }));
  }
  return getKnowledgeGraph(projectId);
}

export async function globalSearch(userId: string, query: string) {
  const q = query.toLowerCase();
  const results: { type: string; label: string; snippet: string; projectId?: string; href?: string }[] = [];

  if (await dbAvailable()) {
    await ensureSchema();
    const projects = await getPool().query(
      `SELECT id, name, description FROM tau_ide_projects WHERE owner_id = $1 AND (LOWER(name) LIKE $2 OR LOWER(description) LIKE $2)`,
      [userId, `%${q}%`]
    );
    for (const p of projects.rows) {
      results.push({ type: 'project', label: p.name, snippet: p.description, projectId: p.id, href: `/developers/workspace?project=${p.id}` });
    }

    const files = await getPool().query(
      `SELECT f.project_id, f.path, f.name, LEFT(f.content, 120) AS snippet
       FROM tau_ide_project_files f JOIN tau_ide_projects p ON p.id = f.project_id
       WHERE p.owner_id = $1 AND (LOWER(f.name) LIKE $2 OR LOWER(f.content) LIKE $2) LIMIT 20`,
      [userId, `%${q}%`]
    );
    for (const f of files.rows) {
      results.push({ type: 'file', label: f.name, snippet: f.snippet, projectId: f.project_id, href: `/developers/workspace?project=${f.project_id}` });
    }

    const convos = await getPool().query(
      `SELECT c.project_id, c.content, c.phase FROM tau_ide_conversations c
       JOIN tau_ide_projects p ON p.id = c.project_id
       WHERE p.owner_id = $1 AND LOWER(c.content) LIKE $2 LIMIT 10`,
      [userId, `%${q}%`]
    );
    for (const c of convos.rows) {
      results.push({ type: 'conversation', label: c.phase ?? 'AI chat', snippet: c.content.slice(0, 120), projectId: c.project_id, href: `/developers/architect?project=${c.project_id}` });
    }

    const tasks = await getPool().query(
      `SELECT t.project_id, t.title, t.type, t.status FROM tau_ide_tasks t
       JOIN tau_ide_projects p ON p.id = t.project_id
       WHERE p.owner_id = $1 AND LOWER(t.title) LIKE $2 LIMIT 15`,
      [userId, `%${q}%`]
    );
    for (const t of tasks.rows) {
      results.push({ type: 'task', label: t.title, snippet: `${t.type} · ${t.status}`, projectId: t.project_id, href: `/developers/dashboard?project=${t.project_id}` });
    }

    const nodes = await getPool().query(
      `SELECT n.project_id, n.label, n.node_type, LEFT(n.content, 100) AS snippet FROM tau_ide_knowledge_nodes n
       JOIN tau_ide_projects p ON p.id = n.project_id
       WHERE p.owner_id = $1 AND (LOWER(n.label) LIKE $2 OR LOWER(n.content) LIKE $2) LIMIT 15`,
      [userId, `%${q}%`]
    );
    for (const n of nodes.rows) {
      results.push({ type: 'knowledge', label: n.label, snippet: n.snippet, projectId: n.project_id, href: `/developers/architect?project=${n.project_id}` });
    }

    const gitOps = await getPool().query(
      `SELECT g.project_id, g.operation, g.details FROM tau_ide_git_operations g
       JOIN tau_ide_projects p ON p.id = g.project_id
       WHERE p.owner_id = $1 AND (LOWER(g.operation) LIKE $2 OR g.details::text ILIKE $2) LIMIT 10`,
      [userId, `%${q}%`]
    );
    for (const g of gitOps.rows) {
      results.push({ type: 'git', label: g.operation, snippet: JSON.stringify(g.details).slice(0, 100), projectId: g.project_id, href: `/developers/git?project=${g.project_id}` });
    }
  }

  // TauScript stdlib / package search (always available)
  if (q.includes('std.') || q.includes('tau-') || q.includes('package')) {
    const packages = ['tau-http', 'tau-json', 'tau-cli', 'tau-test', 'tau-auth'];
    packages.filter((p) => p.includes(q.replace('package', '').trim()) || q.includes('package')).forEach((p) => {
      results.push({ type: 'package', label: p, snippet: 'TauScript package registry', href: '/developers/tauscript' });
    });
  }

  if (q.includes('fn ') || q.includes('struct ') || q.includes('enum ')) {
    results.push({ type: 'symbol', label: 'Symbol search', snippet: `Search symbols matching "${query}" in workspace`, href: '/developers/workspace' });
  }

  if (q.includes('doc') || q.includes('tutorial') || q.includes('spec')) {
    results.push({ type: 'documentation', label: 'TauScript v1.0 Documentation', snippet: 'Language specification, CLI, taupm, stdlib reference', href: '/developers/tauscript' });
  }

  return results;
}

export async function getProjectDashboard(userId: string, projectId: string) {
  const { getProjectWithFiles } = await import('./projects');
  const projectData = await getProjectWithFiles(userId, projectId);
  if (!projectData) return null;

  const [memory, tasks, versions, members, graph] = await Promise.all([
    getAiMemory(projectId),
    listTasks(projectId),
    import('./memory').then((m) => m.listVersions(projectId)),
    import('./teams').then((t) => t.listProjectMembers(projectId)),
    getKnowledgeGraph(projectId),
  ]);

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const recentFiles = projectData.files.slice(-5).reverse();

  return {
    project: projectData.project,
    health: {
      score: Math.min(100, 50 + completedTasks * 5 + (memory ? 20 : 0) + (projectData.files.length > 1 ? 10 : 0)),
      files: projectData.files.length,
      tasks: { total: tasks.length, completed: completedTasks },
      versions: versions.length,
      contributors: members.length || 1,
    },
    git: { remote: projectData.project.git_remote_url, provider: projectData.project.git_provider, branch: projectData.project.git_default_branch },
    ai: { phase: memory?.currentPhase ?? 'discovery', goals: memory?.goals?.length ?? 0, hasMemory: Boolean(memory) },
    deployment: { status: 'ready', target: projectData.project.settings?.deployTarget ?? 'vercel' },
    recentFiles,
    architectureSummary: memory?.deliverables?.architecture?.slice(0, 300) ?? null,
    knowledgeNodes: graph.nodes.length,
    lastActivity: projectData.project.last_activity_at,
  };
}
