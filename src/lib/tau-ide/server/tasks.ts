import { getPool } from '@/lib/db-pool';
import { ensureSchema, dbAvailable, fileStoreRead, fileStoreWrite } from './db';

export type TaskRow = {
  id: string;
  project_id: string;
  parent_id: string | null;
  type: 'epic' | 'feature' | 'story' | 'task' | 'subtask';
  title: string;
  description: string;
  status: string;
  priority: string;
  agent: string | null;
  dependencies: string[];
  metadata: Record<string, unknown>;
};

export async function listTasks(projectId: string): Promise<TaskRow[]> {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('SELECT * FROM tau_ide_tasks WHERE project_id = $1 ORDER BY created_at', [projectId]);
    return res.rows;
  }
  return fileStoreRead(`global`, `tasks-${projectId}`, []);
}

export async function createTask(projectId: string, task: Partial<TaskRow>) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query(
      `INSERT INTO tau_ide_tasks (project_id, parent_id, type, title, description, status, priority, agent, dependencies, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [projectId, task.parent_id ?? null, task.type ?? 'task', task.title, task.description ?? '', task.status ?? 'pending', task.priority ?? 'medium', task.agent ?? null, task.dependencies ?? [], JSON.stringify(task.metadata ?? {})]
    );
    return res.rows[0];
  }
  const tasks = fileStoreRead<TaskRow[]>(`global`, `tasks-${projectId}`, []);
  const row = { id: `task_${Date.now()}`, project_id: projectId, ...task } as TaskRow;
  tasks.push(row);
  fileStoreWrite(`global`, `tasks-${projectId}`, tasks);
  return row;
}

export async function updateTask(taskId: string, patch: Partial<TaskRow>) {
  if (await dbAvailable()) {
    await ensureSchema();
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    for (const k of ['title', 'description', 'status', 'priority', 'agent', 'type'] as const) {
      if (patch[k] !== undefined) { fields.push(`${k} = $${i++}`); values.push(patch[k]); }
    }
    fields.push('updated_at = NOW()');
    values.push(taskId);
    const res = await getPool().query(`UPDATE tau_ide_tasks SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
    return res.rows[0];
  }
  return null;
}
