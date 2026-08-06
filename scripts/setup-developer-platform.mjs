#!/usr/bin/env node
/** Tau Developer Platform — billing, marketplace, extensions, webhooks, API keys, metrics */
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
ALTER TABLE tau_ide_projects ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS tau_dev_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{read,write}',
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tau_dev_subscriptions (
  user_id TEXT PRIMARY KEY,
  plan TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  api_calls_limit BIGINT DEFAULT 1000000,
  build_minutes_limit INT DEFAULT 500,
  api_calls_used BIGINT DEFAULT 0,
  build_minutes_used INT DEFAULT 0,
  payment_method_last4 TEXT,
  payment_method_brand TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_dev_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  stripe_invoice_id TEXT UNIQUE,
  amount_cents INT NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'paid',
  period_label TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_dev_marketplace (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  version TEXT DEFAULT '1.0.0',
  featured BOOLEAN DEFAULT false,
  install_count INT DEFAULT 0,
  permissions TEXT[] DEFAULT '{read}',
  config_schema JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_dev_extension_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  extension_id UUID NOT NULL REFERENCES tau_dev_marketplace(id) ON DELETE CASCADE,
  config JSONB DEFAULT '{}',
  auto_update BOOLEAN DEFAULT true,
  enabled BOOLEAN DEFAULT true,
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, extension_id)
);

CREATE TABLE IF NOT EXISTS tau_dev_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT '{deploy,build,alert}',
  secret TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_dev_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

CREATE TABLE IF NOT EXISTS tau_dev_metrics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  api_calls BIGINT DEFAULT 0,
  errors BIGINT DEFAULT 0,
  avg_latency_ms INT DEFAULT 0,
  endpoint TEXT,
  region TEXT,
  UNIQUE(user_id, metric_date, endpoint, region)
);

CREATE TABLE IF NOT EXISTS tau_dev_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES tau_ide_projects(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  config_yaml TEXT DEFAULT '',
  last_run_status TEXT DEFAULT 'idle',
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tau_dev_error_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  stack TEXT,
  user_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tau_dev_api_keys_user ON tau_dev_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_tau_dev_installs_user ON tau_dev_extension_installs(user_id);
CREATE INDEX IF NOT EXISTS idx_tau_dev_webhooks_user ON tau_dev_webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_tau_dev_metrics_date ON tau_dev_metrics_daily(metric_date);
CREATE INDEX IF NOT EXISTS idx_tau_dev_errors_created ON tau_dev_error_events(created_at DESC);
`;

const SEED = `
INSERT INTO tau_dev_marketplace (slug, name, author, description, category, version, featured, install_count, permissions, config_schema)
VALUES
  ('ai-copilot-plus', 'AI Copilot Plus', 'Tau Core Team', 'Natively inline model analysis for telemetry routing policies.', 'AI', '0.4.2', true, 142000,
   ARRAY['read','write','deploy'],
   '[{"key":"COPILOT_API_KEY","label":"Copilot API Key","type":"secret"},{"key":"ROUTING_POLICY","label":"Routing Policy","type":"text","default":"min-latency-optimization"}]'::jsonb),
  ('tau-monitoring', 'Tau Monitoring', 'Tau Core Team', 'Live service latency dashboards.', 'Monitoring', '1.2.4', false, 142000,
   ARRAY['read','deploy'], '[]'::jsonb),
  ('dataforge-orm', 'DataForge ORM', 'DataForge Group', 'No-overhead telemetry ORM layer.', 'Database', '2.1.0', false, 89000,
   ARRAY['read','write'], '[]'::jsonb),
  ('authshield', 'AuthShield', 'Shield Sec Inc', 'Multi-factor authentication gate.', 'Auth', '3.0.1', false, 42000,
   ARRAY['read','write'], '[]'::jsonb),
  ('testrunner-pro', 'TestRunner Pro', 'QA Engine Team', 'Parallel unit test automation.', 'Testing', '1.0.0', false, 28000,
   ARRAY['read'], '[]'::jsonb)
ON CONFLICT (slug) DO NOTHING;
`;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL required');
    process.exit(1);
  }
  await pool.query(SCHEMA);
  await pool.query(SEED);
  console.log('✅ Tau Developer Platform tables ready');
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
