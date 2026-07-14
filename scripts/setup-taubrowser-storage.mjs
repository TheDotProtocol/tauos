#!/usr/bin/env node
/**
 * Tau Browser — sync tables (bookmarks, history, settings, privacy)
 * Usage: npm run browser:setup
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
  console.log('Setting up Tau Browser database schema...\n');

  await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS taubrowser_bookmarks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      favicon TEXT,
      folder TEXT DEFAULT 'default',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ taubrowser_bookmarks');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS taubrowser_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT,
      url TEXT NOT NULL,
      visited_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ taubrowser_history');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS taubrowser_settings (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      block_ads BOOLEAN DEFAULT true,
      block_trackers BOOLEAN DEFAULT true,
      fingerprint_protection BOOLEAN DEFAULT true,
      https_only BOOLEAN DEFAULT true,
      do_not_track BOOLEAN DEFAULT true,
      clear_on_exit BOOLEAN DEFAULT false,
      search_engine TEXT DEFAULT 'duckduckgo',
      homepage TEXT DEFAULT 'https://www.tauos.org',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ taubrowser_settings');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS taubrowser_privacy_stats (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      blocked_ads BIGINT DEFAULT 0,
      blocked_trackers BIGINT DEFAULT 0,
      blocked_requests BIGINT DEFAULT 0,
      data_saved_bytes BIGINT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ taubrowser_privacy_stats');

  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_taubrowser_bookmarks_user ON taubrowser_bookmarks(user_id)'
  );
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_taubrowser_history_user ON taubrowser_history(user_id, visited_at DESC)'
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS taubrowser_spaces (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL DEFAULT 'Personal',
      color TEXT DEFAULT '#facc15',
      icon TEXT DEFAULT '🌐',
      sort_order INT DEFAULT 0,
      homepage TEXT DEFAULT 'https://www.tauos.org',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ taubrowser_spaces');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS taubrowser_tabs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      space_id UUID NOT NULL REFERENCES taubrowser_spaces(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      url TEXT NOT NULL DEFAULT 'https://www.tauos.org',
      title TEXT DEFAULT 'New Tab',
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ taubrowser_tabs');

  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_taubrowser_spaces_user ON taubrowser_spaces(user_id, sort_order)'
  );
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_taubrowser_tabs_space ON taubrowser_tabs(space_id, sort_order)'
  );

  console.log('\n✅ Tau Browser schema ready');
  await pool.end();
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
