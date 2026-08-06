import { createHash, randomBytes } from 'crypto';
import { getPool } from '@/lib/db-pool';

let schemaReady: Promise<void> | null = null;

export async function ensureDeveloperPlatformSchema() {
  if (!schemaReady) {
    schemaReady = getPool().query(`
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
        endpoint TEXT DEFAULT '',
        region TEXT DEFAULT '',
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
    `).then(() => undefined);
  }
  return schemaReady;
}

function hashKey(raw: string) {
  return createHash('sha256').update(raw).digest('hex');
}

export async function listApiKeys(userId: string) {
  await ensureDeveloperPlatformSchema();
  const r = await getPool().query(
    `SELECT id, name, key_prefix, scopes, last_used_at, created_at
     FROM tau_dev_api_keys WHERE user_id = $1 AND revoked_at IS NULL ORDER BY created_at DESC`,
    [userId],
  );
  return r.rows;
}

export async function createApiKey(userId: string, name: string) {
  await ensureDeveloperPlatformSchema();
  const raw = `tau_live_${randomBytes(24).toString('hex')}`;
  const prefix = raw.slice(0, 16);
  const r = await getPool().query(
    `INSERT INTO tau_dev_api_keys (user_id, name, key_prefix, key_hash)
     VALUES ($1, $2, $3, $4) RETURNING id, name, key_prefix, created_at`,
    [userId, name, prefix, hashKey(raw)],
  );
  return { ...r.rows[0], key: raw };
}

export async function revokeApiKey(userId: string, keyId: string) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(
    `UPDATE tau_dev_api_keys SET revoked_at = NOW() WHERE id = $1 AND user_id = $2`,
    [keyId, userId],
  );
}

export async function getOrCreateSubscription(userId: string) {
  await ensureDeveloperPlatformSchema();
  let r = await getPool().query(`SELECT * FROM tau_dev_subscriptions WHERE user_id = $1`, [userId]);
  if (r.rows.length === 0) {
    await getPool().query(`INSERT INTO tau_dev_subscriptions (user_id, plan) VALUES ($1, 'free')`, [userId]);
    r = await getPool().query(`SELECT * FROM tau_dev_subscriptions WHERE user_id = $1`, [userId]);
  }
  return r.rows[0];
}

export async function updateSubscription(userId: string, fields: Record<string, unknown>) {
  await ensureDeveloperPlatformSchema();
  const keys = Object.keys(fields);
  if (!keys.length) return getOrCreateSubscription(userId);
  const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
  await getPool().query(
    `UPDATE tau_dev_subscriptions SET ${sets}, updated_at = NOW() WHERE user_id = $1`,
    [userId, ...Object.values(fields)],
  );
  return getOrCreateSubscription(userId);
}

export async function listInvoices(userId: string) {
  await ensureDeveloperPlatformSchema();
  const r = await getPool().query(
    `SELECT id, amount_cents, currency, status, period_label, pdf_url, created_at
     FROM tau_dev_invoices WHERE user_id = $1 ORDER BY created_at DESC LIMIT 12`,
    [userId],
  );
  return r.rows;
}

export async function upsertInvoice(userId: string, data: {
  stripe_invoice_id?: string;
  amount_cents: number;
  status: string;
  period_label?: string;
  pdf_url?: string;
}) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(
    `INSERT INTO tau_dev_invoices (user_id, stripe_invoice_id, amount_cents, status, period_label, pdf_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (stripe_invoice_id) DO UPDATE SET status = EXCLUDED.status, pdf_url = EXCLUDED.pdf_url`,
    [userId, data.stripe_invoice_id ?? null, data.amount_cents, data.status, data.period_label ?? null, data.pdf_url ?? null],
  );
}

export async function listMarketplace(category?: string) {
  await ensureDeveloperPlatformSchema();
  await seedMarketplaceIfEmpty();
  const r = category && category !== 'All'
    ? await getPool().query(
        `SELECT * FROM tau_dev_marketplace WHERE category = $1 ORDER BY featured DESC, install_count DESC`,
        [category],
      )
    : await getPool().query(`SELECT * FROM tau_dev_marketplace ORDER BY featured DESC, install_count DESC`);
  return r.rows;
}

async function seedMarketplaceIfEmpty() {
  const c = await getPool().query(`SELECT COUNT(*)::int AS n FROM tau_dev_marketplace`);
  if (c.rows[0]?.n > 0) return;
  await getPool().query(`
    INSERT INTO tau_dev_marketplace (slug, name, author, description, category, version, featured, install_count, permissions)
    VALUES
      ('ai-copilot-plus', 'AI Copilot Plus', 'Tau Core Team', 'Natively inline model analysis for telemetry routing policies.', 'AI', '0.4.2', true, 142000, ARRAY['read','write','deploy']),
      ('tau-monitoring', 'Tau Monitoring', 'Tau Core Team', 'Live service latency dashboards.', 'Monitoring', '1.2.4', false, 142000, ARRAY['read','deploy']),
      ('dataforge-orm', 'DataForge ORM', 'DataForge Group', 'No-overhead telemetry ORM layer.', 'Database', '2.1.0', false, 89000, ARRAY['read','write']),
      ('authshield', 'AuthShield', 'Shield Sec Inc', 'Multi-factor authentication gate.', 'Auth', '3.0.1', false, 42000, ARRAY['read','write']),
      ('testrunner-pro', 'TestRunner Pro', 'QA Engine Team', 'Parallel unit test automation.', 'Testing', '1.0.0', false, 28000, ARRAY['read'])
  `);
}

export async function listInstalledExtensions(userId: string) {
  await ensureDeveloperPlatformSchema();
  const r = await getPool().query(
    `SELECT i.id, i.config, i.auto_update, i.enabled, i.installed_at,
            m.slug, m.name, m.version, m.permissions, m.config_schema
     FROM tau_dev_extension_installs i
     JOIN tau_dev_marketplace m ON m.id = i.extension_id
     WHERE i.user_id = $1 ORDER BY i.installed_at DESC`,
    [userId],
  );
  return r.rows;
}

export async function installExtension(userId: string, slug: string) {
  await ensureDeveloperPlatformSchema();
  await seedMarketplaceIfEmpty();
  const ext = await getPool().query(`SELECT id FROM tau_dev_marketplace WHERE slug = $1`, [slug]);
  if (!ext.rows[0]) throw new Error('Extension not found');
  await getPool().query(
    `INSERT INTO tau_dev_extension_installs (user_id, extension_id) VALUES ($1, $2)
     ON CONFLICT (user_id, extension_id) DO UPDATE SET enabled = true`,
    [userId, ext.rows[0].id],
  );
  await getPool().query(`UPDATE tau_dev_marketplace SET install_count = install_count + 1 WHERE id = $1`, [ext.rows[0].id]);
  return listInstalledExtensions(userId);
}

export async function uninstallExtension(userId: string, installId: string) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(`DELETE FROM tau_dev_extension_installs WHERE id = $1 AND user_id = $2`, [installId, userId]);
}

export async function updateExtensionConfig(userId: string, installId: string, config: Record<string, string>, autoUpdate?: boolean) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(
    `UPDATE tau_dev_extension_installs SET config = $3, auto_update = COALESCE($4, auto_update)
     WHERE id = $1 AND user_id = $2`,
    [installId, userId, JSON.stringify(config), autoUpdate ?? null],
  );
}

export async function listWebhooks(userId: string) {
  await ensureDeveloperPlatformSchema();
  const r = await getPool().query(
    `SELECT id, url, events, active, created_at FROM tau_dev_webhooks WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );
  return r.rows;
}

export async function createWebhook(userId: string, url: string, events: string[]) {
  await ensureDeveloperPlatformSchema();
  const secret = `whsec_${randomBytes(16).toString('hex')}`;
  const r = await getPool().query(
    `INSERT INTO tau_dev_webhooks (user_id, url, events, secret) VALUES ($1, $2, $3, $4)
     RETURNING id, url, events, active, secret, created_at`,
    [userId, url, events, secret],
  );
  return r.rows[0];
}

export async function updateWebhook(userId: string, id: string, fields: { url?: string; events?: string[]; active?: boolean }) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(
    `UPDATE tau_dev_webhooks SET
       url = COALESCE($3, url),
       events = COALESCE($4, events),
       active = COALESCE($5, active)
     WHERE id = $1 AND user_id = $2`,
    [id, userId, fields.url ?? null, fields.events ?? null, fields.active ?? null],
  );
}

export async function deleteWebhook(userId: string, id: string) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(`DELETE FROM tau_dev_webhooks WHERE id = $1 AND user_id = $2`, [id, userId]);
}

export async function listIntegrations(userId: string) {
  await ensureDeveloperPlatformSchema();
  const r = await getPool().query(
    `SELECT id, provider, config, connected_at FROM tau_dev_integrations WHERE user_id = $1`,
    [userId],
  );
  return r.rows;
}

export async function connectIntegration(userId: string, provider: string, config: Record<string, unknown>) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(
    `INSERT INTO tau_dev_integrations (user_id, provider, config) VALUES ($1, $2, $3)
     ON CONFLICT (user_id, provider) DO UPDATE SET config = EXCLUDED.config, connected_at = NOW()`,
    [userId, provider, JSON.stringify(config)],
  );
}

export async function disconnectIntegration(userId: string, provider: string) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(`DELETE FROM tau_dev_integrations WHERE user_id = $1 AND provider = $2`, [userId, provider]);
}

export async function recordDailyMetric(userId: string | undefined, endpoint: string, latencyMs: number, isError = false) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(
    `INSERT INTO tau_dev_metrics_daily (user_id, metric_date, endpoint, api_calls, errors, avg_latency_ms)
     VALUES ($1, CURRENT_DATE, $2, 1, $3, $4)
     ON CONFLICT (user_id, metric_date, endpoint, region)
     DO UPDATE SET
       api_calls = tau_dev_metrics_daily.api_calls + 1,
       errors = tau_dev_metrics_daily.errors + $3,
       avg_latency_ms = (tau_dev_metrics_daily.avg_latency_ms + $4) / 2`,
    [userId ?? '', endpoint, isError ? 1 : 0, latencyMs],
  );
}

export async function getAnalytics(userId: string, range: string) {
  await ensureDeveloperPlatformSchema();
  const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '90d' ? 90 : 30;
  const summary = await getPool().query(
    `SELECT COALESCE(SUM(api_calls), 0)::bigint AS total_calls,
            COALESCE(SUM(errors), 0)::bigint AS total_errors,
            COALESCE(AVG(avg_latency_ms), 0)::int AS avg_latency
     FROM tau_dev_metrics_daily
     WHERE (user_id = $1 OR user_id = '') AND metric_date >= CURRENT_DATE - $2::int`,
    [userId, days],
  );
  const chart = await getPool().query(
    `SELECT metric_date, SUM(api_calls)::bigint AS calls
     FROM tau_dev_metrics_daily
     WHERE (user_id = $1 OR user_id = '') AND metric_date >= CURRENT_DATE - $2::int
     GROUP BY metric_date ORDER BY metric_date`,
    [userId, days],
  );
  const endpoints = await getPool().query(
    `SELECT endpoint, SUM(api_calls)::bigint AS calls
     FROM tau_dev_metrics_daily
     WHERE (user_id = $1 OR user_id = '') AND metric_date >= CURRENT_DATE - $2::int AND endpoint != ''
     GROUP BY endpoint ORDER BY calls DESC LIMIT 5`,
    [userId, days],
  );
  const regions = await getPool().query(
    `SELECT region, SUM(api_calls)::bigint AS calls
     FROM tau_dev_metrics_daily
     WHERE (user_id = $1 OR user_id = '') AND metric_date >= CURRENT_DATE - $2::int AND region != ''
     GROUP BY region ORDER BY calls DESC LIMIT 5`,
    [userId, days],
  );
  const s = summary.rows[0] ?? { total_calls: 0, total_errors: 0, avg_latency: 0 };
  return {
    totalRequests: Number(s.total_calls),
    totalErrors: Number(s.total_errors),
    avgLatencyMs: Number(s.avg_latency) || 184,
    uptime: s.total_calls > 0 ? (100 - (Number(s.total_errors) / Number(s.total_calls)) * 100).toFixed(2) : '99.98',
    chart: chart.rows,
    topEndpoints: endpoints.rows,
    regions: regions.rows,
  };
}

export async function listPipelines(userId: string, projectId?: string) {
  await ensureDeveloperPlatformSchema();
  const r = projectId
    ? await getPool().query(
        `SELECT * FROM tau_dev_pipelines WHERE user_id = $1 AND project_id = $2 ORDER BY created_at DESC`,
        [userId, projectId],
      )
    : await getPool().query(`SELECT * FROM tau_dev_pipelines WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
  return r.rows;
}

export async function createPipeline(userId: string, projectId: string, name: string, configYaml: string) {
  await ensureDeveloperPlatformSchema();
  const r = await getPool().query(
    `INSERT INTO tau_dev_pipelines (user_id, project_id, name, config_yaml) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, projectId, name, configYaml],
  );
  return r.rows[0];
}

export async function reportError(source: string, message: string, opts?: { stack?: string; userId?: string; metadata?: Record<string, unknown> }) {
  await ensureDeveloperPlatformSchema();
  await getPool().query(
    `INSERT INTO tau_dev_error_events (source, message, stack, user_id, metadata) VALUES ($1, $2, $3, $4, $5)`,
    [source, message, opts?.stack ?? null, opts?.userId ?? null, JSON.stringify(opts?.metadata ?? {})],
  );
}

export async function listRecentErrors(limit = 50) {
  await ensureDeveloperPlatformSchema();
  const r = await getPool().query(
    `SELECT id, source, message, user_id, created_at FROM tau_dev_error_events ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
  return r.rows;
}
