#!/usr/bin/env node
/** Tau IDE Sprint 3 — PostgreSQL infrastructure setup */
import dotenv from 'dotenv';
import pg from 'pg';
import { existsSync } from 'fs';

for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) dotenv.config({ path: f });
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const SCHEMA = `
-- Tau IDE Projects
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
);

CREATE TABLE IF NOT EXISTS tau_ide_project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT DEFAULT '',
  folder_path TEXT DEFAULT '/',
  sync_version BIGINT DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, path)
);

CREATE TABLE IF NOT EXISTS tau_ide_project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  label TEXT,
  snapshot JSONB NOT NULL,
  ai_summary TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_ai_memory (
  project_id UUID PRIMARY KEY REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  memory JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  phase TEXT,
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES tau_ide_tasks(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'task',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  agent TEXT,
  dependencies UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_knowledge_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL,
  label TEXT NOT NULL,
  content TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_knowledge_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES tau_ide_knowledge_nodes(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES tau_ide_knowledge_nodes(id) ON DELETE CASCADE,
  relation TEXT NOT NULL DEFAULT 'relates_to',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  encrypted_value TEXT NOT NULL,
  secret_type TEXT DEFAULT 'env',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, key)
);

CREATE TABLE IF NOT EXISTS tau_ide_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES tau_ide_teams(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'developer',
  invited_by TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

CREATE TABLE IF NOT EXISTS tau_ide_project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'developer',
  invited_by TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS tau_ide_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  project_id UUID REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  input JSONB DEFAULT '{}',
  output JSONB DEFAULT '{}',
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_user_preferences (
  user_id TEXT PRIMARY KEY,
  preferences JSONB DEFAULT '{}',
  recent_projects UUID[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_ide_git_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  operation TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tau_ide_projects_owner ON tau_ide_projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_tau_ide_files_project ON tau_ide_project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_tau_ide_versions_project ON tau_ide_project_versions(project_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_tau_ide_conversations_project ON tau_ide_conversations(project_id, created_at);
CREATE INDEX IF NOT EXISTS idx_tau_ide_tasks_project ON tau_ide_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tau_ide_knowledge_project ON tau_ide_knowledge_nodes(project_id);
CREATE INDEX IF NOT EXISTS idx_tau_ide_notifications_user ON tau_ide_notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_tau_ide_jobs_status ON tau_ide_jobs(status, created_at);
`;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL required');
    process.exit(1);
  }
  await pool.query(SCHEMA);
  console.log('✅ Tau IDE infrastructure tables ready');
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
