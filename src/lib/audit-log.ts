import { getPool } from '@/lib/db-pool';

export async function ensureAuditLogTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      resource TEXT,
      ip_address TEXT,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function logAudit(entry: {
  userId?: string | number | null;
  action: string;
  resource?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await ensureAuditLogTable();
    await getPool().query(
      `INSERT INTO audit_log (user_id, action, resource, ip_address, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        entry.userId ? String(entry.userId) : null,
        entry.action,
        entry.resource ?? null,
        entry.ipAddress ?? null,
        JSON.stringify(entry.metadata ?? {}),
      ]
    );
  } catch (err) {
    console.error('[audit_log]', err);
  }
}
