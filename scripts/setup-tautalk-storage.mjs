#!/usr/bin/env node
/**
 * Tau Talk — encrypted messaging tables
 * Usage: npm run talk:setup
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

async function main() {
  console.log('Setting up Tau Talk database schema...\n');

  await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type TEXT NOT NULL DEFAULT 'direct',
      title TEXT,
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ tautalk_conversations');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_participants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES tautalk_conversations(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      joined_at TIMESTAMPTZ DEFAULT NOW(),
      last_read_at TIMESTAMPTZ,
      UNIQUE(conversation_id, user_id)
    )
  `);
  console.log('  ✓ tautalk_participants');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES tautalk_conversations(id) ON DELETE CASCADE,
      sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content_encrypted TEXT NOT NULL,
      content_type TEXT DEFAULT 'text',
      reply_to UUID REFERENCES tautalk_messages(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      edited_at TIMESTAMPTZ,
      deleted_at TIMESTAMPTZ
    )
  `);
  console.log('  ✓ tautalk_messages');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_keys (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      public_key TEXT NOT NULL,
      key_version INTEGER DEFAULT 1,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ tautalk_keys');

  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_tautalk_messages_conv ON tautalk_messages(conversation_id, created_at DESC)'
  );
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_tautalk_participants_user ON tautalk_participants(user_id)'
  );

  console.log('\n✅ Tau Talk schema ready');
  await pool.end();
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
