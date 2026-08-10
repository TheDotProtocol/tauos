import type { Pool } from 'pg';

let schemaReady = false;

export async function ensureTauMailSchema(pool: Pool): Promise<void> {
  if (schemaReady) return;

  await pool.query(`
    ALTER TABLE incoming_emails ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
    ALTER TABLE incoming_emails ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
    ALTER TABLE incoming_emails ADD COLUMN IF NOT EXISTS is_starred BOOLEAN DEFAULT FALSE;
    ALTER TABLE incoming_emails ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

    ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS storage_used_bytes BIGINT DEFAULT 0;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS storage_quota_bytes BIGINT DEFAULT 268435456000;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS push_notifications_enabled BOOLEAN DEFAULT TRUE;

    CREATE TABLE IF NOT EXISTS taumail_push_devices (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      device_id VARCHAR(255) NOT NULL,
      platform VARCHAR(20) NOT NULL DEFAULT 'unknown',
      push_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, device_id)
    );

    CREATE TABLE IF NOT EXISTS email_drafts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      to_email TEXT,
      cc_email TEXT,
      bcc_email TEXT,
      subject VARCHAR(500) DEFAULT '',
      body TEXT DEFAULT '',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS taumail_contacts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      role VARCHAR(255),
      verified BOOLEAN DEFAULT FALSE,
      phone VARCHAR(50),
      phone_country_code VARCHAR(10) DEFAULT '+1',
      tau_id VARCHAR(255),
      organization VARCHAR(255),
      designation VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS taumail_tasks (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(500) NOT NULL,
      due_date DATE,
      priority VARCHAR(20) DEFAULT 'normal',
      is_done BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS taumail_calendar_events (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(500) NOT NULL,
      location VARCHAR(500),
      starts_at TIMESTAMP NOT NULL,
      ends_at TIMESTAMP,
      color VARCHAR(50) DEFAULT 'gold',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS taumail_notifications (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(500) NOT NULL,
      meta TEXT,
      tone VARCHAR(20) DEFAULT 'info',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS taumail_ai_messages (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_email_drafts_user ON email_drafts(user_id);
    CREATE INDEX IF NOT EXISTS idx_taumail_contacts_user ON taumail_contacts(user_id);
    CREATE INDEX IF NOT EXISTS idx_taumail_tasks_user ON taumail_tasks(user_id);
    CREATE INDEX IF NOT EXISTS idx_taumail_calendar_user ON taumail_calendar_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_taumail_notifications_user ON taumail_notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_taumail_push_devices_user ON taumail_push_devices(user_id);
    CREATE INDEX IF NOT EXISTS idx_taumail_ai_messages_user ON taumail_ai_messages(user_id);
    CREATE INDEX IF NOT EXISTS idx_incoming_emails_deleted ON incoming_emails(user_id, is_deleted);

    ALTER TABLE taumail_contacts ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
    ALTER TABLE taumail_contacts ADD COLUMN IF NOT EXISTS phone_country_code VARCHAR(10) DEFAULT '+1';
    ALTER TABLE taumail_contacts ADD COLUMN IF NOT EXISTS tau_id VARCHAR(255);
    ALTER TABLE taumail_contacts ADD COLUMN IF NOT EXISTS organization VARCHAR(255);
    ALTER TABLE taumail_contacts ADD COLUMN IF NOT EXISTS designation VARCHAR(255);
  `);

  schemaReady = true;
}

export async function ensureDefaultWorkspaceData(pool: Pool, userId: string): Promise<void> {
  await ensureTauMailSchema(pool);

  const tasks = await pool.query('SELECT COUNT(*)::int AS count FROM taumail_tasks WHERE user_id = $1', [userId]);
  if (tasks.rows[0].count === 0) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    await pool.query(
      `INSERT INTO taumail_tasks (user_id, title, due_date, priority, is_done) VALUES
        ($1, 'Review protocol v4.3 specs', $2, 'high', false),
        ($1, 'Confirm Springfield hub telemetry', $3, 'urgent', false),
        ($1, 'Archive Q4 financial projections', $4, 'normal', true),
        ($1, 'Schedule alignment with Sariel', $5, 'normal', false)`,
      [userId, today.toISOString().slice(0, 10), tomorrow.toISOString().slice(0, 10), '2026-10-30', '2026-11-01'],
    );
  }

  const events = await pool.query('SELECT COUNT(*)::int AS count FROM taumail_calendar_events WHERE user_id = $1', [userId]);
  if (events.rows[0].count === 0) {
    await pool.query(
      `INSERT INTO taumail_calendar_events (user_id, title, location, starts_at, ends_at, color) VALUES
        ($1, 'Quantum Computing Sync', 'Central Core Room', '2026-10-28 10:30:00', '2026-10-28 11:30:00', 'gold'),
        ($1, 'Telemetry Sync', NULL, '2026-10-29 14:00:00', '2026-10-29 15:00:00', 'blue'),
        ($1, 'Epsilon Cargo Dispatch', 'Terminal Block D', '2026-10-28 14:00:00', '2026-10-28 15:00:00', 'gold'),
        ($1, 'Node Handshake Debug', 'Security Subsystem', '2026-10-28 16:30:00', '2026-10-28 17:30:00', 'purple'),
        ($1, 'Cargo Dispatch', NULL, '2026-10-30 11:00:00', '2026-10-30 12:00:00', 'purple')`,
      [userId],
    );
  }

  const aiMessages = await pool.query('SELECT COUNT(*)::int AS count FROM taumail_ai_messages WHERE user_id = $1', [userId]);
  if (aiMessages.rows[0].count === 0) {
    await pool.query(
      `INSERT INTO taumail_ai_messages (user_id, role, content) VALUES
        ($1, 'assistant', 'I found 12 unread signals. The highest priority is the Springfield hub telemetry incident from Director Vance.'),
        ($1, 'user', 'Draft a concise reply acknowledging the failsafe trigger.'),
        ($1, 'assistant', 'Acknowledged. Draft ready: "Director Vance — Failsafe trigger noted. Maintenance squads dispatched. Awaiting telemetry report from Springfield hub."')`,
      [userId],
    );
  }
}
