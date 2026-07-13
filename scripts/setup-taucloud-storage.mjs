#!/usr/bin/env node
/**
 * Tau Cloud — database tables + user storage columns
 * Usage: npm run cloud:setup
 */
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

async function columnExists(table, column) {
  const { rows } = await pool.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
    [table, column]
  );
  return rows.length > 0;
}

async function main() {
  console.log('Setting up Tau Cloud database schema...\n');

  await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  if (!(await columnExists('users', 'storage_quota'))) {
    await pool.query(
      'ALTER TABLE users ADD COLUMN storage_quota BIGINT DEFAULT 5368709120'
    );
    console.log('  ✓ users.storage_quota');
  }

  if (!(await columnExists('users', 'storage_used'))) {
    await pool.query('ALTER TABLE users ADD COLUMN storage_used BIGINT DEFAULT 0');
    console.log('  ✓ users.storage_used');
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS taucloud_files (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      original_name TEXT NOT NULL,
      file_name TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      file_size BIGINT NOT NULL DEFAULT 0,
      mime_type TEXT,
      folder TEXT DEFAULT 'root',
      is_shared BOOLEAN DEFAULT false,
      uploaded_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ taucloud_files');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS taucloud_shares (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      file_id UUID NOT NULL REFERENCES taucloud_files(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      expires_at TIMESTAMPTZ,
      download_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ taucloud_shares');

  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_taucloud_files_user_folder ON taucloud_files(user_id, folder)'
  );
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_taucloud_shares_token ON taucloud_shares(token)'
  );

  console.log('\n✅ Tau Cloud schema ready');
  await pool.end();
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
