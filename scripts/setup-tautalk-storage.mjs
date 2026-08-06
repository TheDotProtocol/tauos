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

  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users (phone) WHERE phone IS NOT NULL
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT
  `);
  console.log('  ✓ users.avatar_url');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_typing (
      conversation_id UUID NOT NULL REFERENCES tautalk_conversations(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (conversation_id, user_id)
    )
  `);
  console.log('  ✓ tautalk_typing');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_otp_verifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      channel TEXT NOT NULL CHECK (channel IN ('email', 'phone')),
      destination TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      attempts INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_tautalk_otp_dest ON tautalk_otp_verifications (channel, destination, created_at DESC)'
  );
  console.log('  ✓ tautalk_otp_verifications');

  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false
  `);
  console.log('  ✓ users.email_verified / phone_verified');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_call_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID NOT NULL REFERENCES tautalk_conversations(id) ON DELETE CASCADE,
      caller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      callee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mode TEXT NOT NULL CHECK (mode IN ('voice', 'video')),
      status TEXT NOT NULL DEFAULT 'ringing'
        CHECK (status IN ('ringing', 'active', 'ended', 'declined', 'missed')),
      started_at TIMESTAMPTZ DEFAULT NOW(),
      answered_at TIMESTAMPTZ,
      ended_at TIMESTAMPTZ
    )
  `);
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_tautalk_call_sessions_callee ON tautalk_call_sessions (callee_id, status)'
  );
  console.log('  ✓ tautalk_call_sessions');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_call_signals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID NOT NULL REFERENCES tautalk_call_sessions(id) ON DELETE CASCADE,
      sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      signal_type TEXT NOT NULL,
      payload JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_tautalk_call_signals_session ON tautalk_call_signals (session_id, created_at)'
  );
  console.log('  ✓ tautalk_call_signals');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_key_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      public_key TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_tautalk_key_history_user ON tautalk_key_history(user_id, created_at DESC)'
  );
  console.log('  ✓ tautalk_key_history');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tautalk_contact_labels (
      owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      contact_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      display_name TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (owner_user_id, contact_user_id)
    )
  `);
  console.log('  ✓ tautalk_contact_labels');

  console.log('\n✅ Tau Talk schema ready');
  await pool.end();
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
