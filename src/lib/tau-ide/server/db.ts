import { getPool } from '@/lib/db-pool';
import fs from 'fs';
import path from 'path';

let schemaReady = false;

export const SCHEMA_SQL = `-- inline marker for ensureSchema`;

export async function dbAvailable(): Promise<boolean> {
  try {
    if (!process.env.DATABASE_URL) return false;
    await getPool().query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export async function ensureSchema(): Promise<void> {
  if (schemaReady) return;
  if (!(await dbAvailable())) return;

  const schemaPath = path.join(process.cwd(), 'scripts/setup-tau-ide-infrastructure.mjs');
  // Run inline — tables created via setup script; on API boot ensure extensions
  await getPool().query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      language TEXT DEFAULT 'tauscript',
      settings JSONB DEFAULT '{}',
      is_favorite BOOLEAN DEFAULT false,
      git_remote_url TEXT,
      git_provider TEXT,
      git_default_branch TEXT DEFAULT 'main',
      sync_version BIGINT DEFAULT 1,
      last_activity_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_project_files (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      path TEXT NOT NULL, name TEXT NOT NULL, content TEXT DEFAULT '',
      folder_path TEXT DEFAULT '/', sync_version BIGINT DEFAULT 1,
      updated_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(project_id, path)
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_project_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      version_number INT NOT NULL, label TEXT, snapshot JSONB NOT NULL,
      ai_summary TEXT, created_by TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_ai_memory (
      project_id UUID PRIMARY KEY REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      memory JSONB NOT NULL DEFAULT '{}', updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      role TEXT NOT NULL, content TEXT NOT NULL, phase TEXT, provider TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      parent_id UUID REFERENCES tau_ide_tasks(id) ON DELETE CASCADE,
      type TEXT NOT NULL DEFAULT 'task', title TEXT NOT NULL, description TEXT DEFAULT '',
      status TEXT DEFAULT 'pending', priority TEXT DEFAULT 'medium', agent TEXT,
      dependencies UUID[] DEFAULT '{}', metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_knowledge_nodes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      node_type TEXT NOT NULL, label TEXT NOT NULL, content TEXT DEFAULT '',
      metadata JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_knowledge_edges (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      source_id UUID NOT NULL REFERENCES tau_ide_knowledge_nodes(id) ON DELETE CASCADE,
      target_id UUID NOT NULL REFERENCES tau_ide_knowledge_nodes(id) ON DELETE CASCADE,
      relation TEXT NOT NULL DEFAULT 'relates_to', created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_secrets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      key TEXT NOT NULL, encrypted_value TEXT NOT NULL, secret_type TEXT DEFAULT 'env',
      created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(project_id, key)
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_teams (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL, owner_id TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_team_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      team_id UUID NOT NULL REFERENCES tau_ide_teams(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'developer',
      invited_by TEXT, joined_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(team_id, user_id)
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_project_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'developer',
      invited_by TEXT, joined_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(project_id, user_id)
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL, project_id UUID REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      type TEXT NOT NULL, title TEXT NOT NULL, message TEXT DEFAULT '',
      read BOOLEAN DEFAULT false, metadata JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL, job_type TEXT NOT NULL, status TEXT DEFAULT 'pending',
      input JSONB DEFAULT '{}', output JSONB DEFAULT '{}', error TEXT,
      started_at TIMESTAMPTZ, completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_user_preferences (
      user_id TEXT PRIMARY KEY, preferences JSONB DEFAULT '{}',
      recent_projects UUID[] DEFAULT '{}', updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_ide_git_operations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
      operation TEXT NOT NULL, status TEXT DEFAULT 'pending',
      details JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  schemaReady = true;
}

// File fallback for local dev without DATABASE_URL
const DATA_DIR = path.join(process.cwd(), '.data/tau-ide');

function fileStorePath(userId: string, resource: string) {
  const dir = path.join(DATA_DIR, userId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${resource}.json`);
}

export function fileStoreRead<T>(userId: string, resource: string, fallback: T): T {
  try {
    const p = fileStorePath(userId, resource);
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

export function fileStoreWrite(userId: string, resource: string, data: unknown) {
  fs.writeFileSync(fileStorePath(userId, resource), JSON.stringify(data, null, 2));
}
