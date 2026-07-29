import { getPool } from '@/lib/db-pool';
import { ensureSchema, dbAvailable, fileStoreRead, fileStoreWrite } from './db';
import type { ProjectMemory } from '@/lib/tau-ide/architect/memory';
import { listProjectFiles } from './projects';

export async function getAiMemory(projectId: string): Promise<ProjectMemory | null> {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('SELECT memory FROM tau_ide_ai_memory WHERE project_id = $1', [projectId]);
    return res.rows[0]?.memory ?? null;
  }
  return fileStoreRead<ProjectMemory | null>('global', `memory-${projectId}`, null);
}

export async function saveAiMemory(projectId: string, memory: ProjectMemory) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query(
      `INSERT INTO tau_ide_ai_memory (project_id, memory, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT (project_id) DO UPDATE SET memory = $2, updated_at = NOW()`,
      [projectId, JSON.stringify(memory)]
    );
    return;
  }
  fileStoreWrite('global', `memory-${projectId}`, memory);
}

export async function appendConversation(projectId: string, msg: { role: string; content: string; phase?: string; provider?: string }) {
  if (await dbAvailable()) {
    await ensureSchema();
    await getPool().query(
      'INSERT INTO tau_ide_conversations (project_id, role, content, phase, provider) VALUES ($1, $2, $3, $4, $5)',
      [projectId, msg.role, msg.content, msg.phase ?? null, msg.provider ?? null]
    );
  }
}

export async function getConversations(projectId: string, limit = 100) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query(
      'SELECT * FROM tau_ide_conversations WHERE project_id = $1 ORDER BY created_at ASC LIMIT $2',
      [projectId, limit]
    );
    return res.rows;
  }
  return fileStoreRead(`global`, `conversations-${projectId}`, []);
}

export async function createVersion(projectId: string, userId: string, label?: string) {
  const files = await listProjectFiles(projectId);
  const memory = await getAiMemory(projectId);
  const snapshot = { files, memory, timestamp: new Date().toISOString() };

  if (await dbAvailable()) {
    await ensureSchema();
    const countRes = await getPool().query('SELECT COALESCE(MAX(version_number), 0) + 1 AS next FROM tau_ide_project_versions WHERE project_id = $1', [projectId]);
    const versionNumber = countRes.rows[0].next;
    const res = await getPool().query(
      `INSERT INTO tau_ide_project_versions (project_id, version_number, label, snapshot, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [projectId, versionNumber, label ?? `Version ${versionNumber}`, JSON.stringify(snapshot), userId]
    );
    return res.rows[0];
  }
  const versions = fileStoreRead<unknown[]>('global', `versions-${projectId}`, []);
  const version = { id: `ver_${Date.now()}`, project_id: projectId, version_number: versions.length + 1, label, snapshot, created_at: new Date().toISOString() };
  versions.push(version);
  fileStoreWrite('global', `versions-${projectId}`, versions);
  return version;
}

export async function listVersions(projectId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query(
      'SELECT id, version_number, label, ai_summary, created_by, created_at FROM tau_ide_project_versions WHERE project_id = $1 ORDER BY version_number DESC',
      [projectId]
    );
    return res.rows;
  }
  return fileStoreRead(`global`, `versions-${projectId}`, []);
}

export async function restoreVersion(projectId: string, versionId: string) {
  if (await dbAvailable()) {
    await ensureSchema();
    const res = await getPool().query('SELECT snapshot FROM tau_ide_project_versions WHERE id = $1 AND project_id = $2', [versionId, projectId]);
    if (!res.rows[0]) throw new Error('Version not found');
    const snapshot = res.rows[0].snapshot;
    if (snapshot.files) {
      const { upsertProjectFiles } = await import('./projects');
      await upsertProjectFiles(projectId, snapshot.files);
    }
    if (snapshot.memory) await saveAiMemory(projectId, snapshot.memory);
    return snapshot;
  }
  throw new Error('Version restore requires database');
}
