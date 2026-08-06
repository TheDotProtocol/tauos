#!/usr/bin/env node
/** OAuth identity linking table for Google / GitHub social login */
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  console.log('Setting up OAuth identity storage...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS oauth_identities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider TEXT NOT NULL,
      provider_user_id TEXT NOT NULL,
      email TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (provider, provider_user_id)
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_oauth_identities_user
    ON oauth_identities (user_id)
  `);
  console.log('OAuth identity storage ready.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
