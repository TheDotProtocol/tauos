#!/usr/bin/env node
/**
 * Tau ID storage setup — identity profiles, OTP codes
 */
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  console.log('Setting up Tau ID storage...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tauid_identity_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      profile_name TEXT NOT NULL,
      profile_type TEXT DEFAULT 'personal',
      is_primary BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tauid_otp_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      purpose TEXT NOT NULL,
      destination TEXT NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      code_hash TEXT NOT NULL,
      attempts INT DEFAULT 0,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_tauid_otp_lookup
    ON tauid_otp_codes (purpose, destination, created_at DESC)
  `);

  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret TEXT
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ
  `);

  console.log('Tau ID storage ready.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
