#!/usr/bin/env node
/** Tau SSO session storage — refresh tokens for httpOnly cookie sessions */
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  console.log('Setting up Tau SSO session storage...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tau_auth_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      user_agent TEXT,
      ip_address TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_tau_auth_sessions_user
    ON tau_auth_sessions (user_id, created_at DESC)
  `);
  console.log('Tau SSO session storage ready.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
