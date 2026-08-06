#!/usr/bin/env node
/**
 * Clear all Tau Talk chat messages (and related call signal noise).
 * Run: npm run talk:clear-messages
 */
import dotenv from 'dotenv';
import pg from 'pg';
import { existsSync } from 'fs';

for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) dotenv.config({ path: f });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL missing in .env.local');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

async function main() {
  console.log('Clearing Tau Talk messages…\n');

  const before = await pool.query('SELECT COUNT(*)::int AS n FROM tautalk_messages');
  const count = before.rows[0]?.n ?? 0;

  await pool.query('DELETE FROM tautalk_call_signals');
  await pool.query(`UPDATE tautalk_call_sessions SET status = 'ended', ended_at = NOW() WHERE status IN ('ringing', 'active')`);
  await pool.query('DELETE FROM tautalk_messages');
  await pool.query(`UPDATE tautalk_conversations SET updated_at = NOW()`);

  console.log(`  ✓ Removed ${count} message(s)`);
  console.log('  ✓ Cleared call signals and ended active call sessions');
  console.log('\n✅ Tau Talk message history cleared');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
