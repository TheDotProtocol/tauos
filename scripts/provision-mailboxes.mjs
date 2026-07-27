#!/usr/bin/env node
/**
 * Sync Tau Mail mailboxes from scripts/mailboxes.json
 * - create missing accounts
 * - update name + password on existing
 * - delete listed emails
 *
 * Usage: npm run mail:provision
 */
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'mailboxes.json');
const OUTPUT_PATH = path.join(__dirname, 'mailboxes-provisioned.json');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

function parseEmail(email) {
  const m = String(email).toLowerCase().trim().match(/^([^@\s]+)@([^@\s]+)$/);
  if (!m) return null;
  return { local: m[1], domain: m[2] };
}

function sanitizeUsername(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 32);
}

async function deleteMailbox(pool, email, results) {
  const normalized = email.toLowerCase().trim();
  try {
    const del = await pool.query('DELETE FROM users WHERE LOWER(email) = $1 RETURNING id, email', [
      normalized,
    ]);
    if (del.rows.length) {
      results.push({ email: normalized, ok: true, action: 'deleted', id: del.rows[0].id });
      console.log(`  - ${normalized} (deleted)`);
      return;
    }
    const soft = await pool.query(
      'UPDATE users SET is_active = false WHERE LOWER(email) = $1 RETURNING id, email',
      [normalized]
    );
    if (soft.rows.length) {
      results.push({ email: normalized, ok: true, action: 'deactivated', id: soft.rows[0].id });
      console.log(`  - ${normalized} (deactivated — FK blocked hard delete)`);
      return;
    }
    results.push({ email: normalized, ok: true, action: 'not_found' });
    console.log(`  ○ ${normalized} — not found (skip delete)`);
  } catch (err) {
    results.push({ email: normalized, ok: false, error: err.message });
    console.log(`  ✗ ${normalized} — delete failed: ${err.message}`);
  }
}

async function upsertMailbox(pool, entry, defaultPassword, results) {
  const parsed = parseEmail(entry.email);
  if (!parsed) {
    results.push({ email: entry.email, ok: false, error: 'Invalid email' });
    console.log(`  ✗ ${entry.email} — invalid email`);
    return;
  }

  const email = `${parsed.local}@${parsed.domain}`;
  const username = sanitizeUsername(entry.username || `${parsed.domain.split('.')[0]}-${parsed.local}`);
  const fullName = entry.fullName?.trim() || parsed.local;
  const password = entry.password || defaultPassword;
  const passwordHash = await bcrypt.hash(password, 12);

  const org = await pool.query('SELECT id FROM organizations WHERE domain = $1 LIMIT 1', [
    parsed.domain,
  ]);
  if (org.rows.length === 0) {
    results.push({
      email,
      ok: false,
      error: `No organization for @${parsed.domain} — run npm run mail:setup first`,
    });
    console.log(`  ✗ ${email} — org missing for @${parsed.domain}`);
    return;
  }

  const byEmail = await pool.query('SELECT id, email, username FROM users WHERE LOWER(email) = $1', [
    email,
  ]);

  if (byEmail.rows.length > 0) {
    const user = byEmail.rows[0];
    await pool.query(
      `UPDATE users SET full_name = $1, password_hash = $2, is_active = true, organization_id = $3
       WHERE id = $4`,
      [fullName, passwordHash, org.rows[0].id, user.id]
    );
    results.push({
      ok: true,
      action: 'updated',
      id: user.id,
      email,
      username: user.username,
      fullName,
    });
    console.log(`  ↻ ${email} (${fullName}) — updated`);
    return;
  }

  const usernameTaken = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  if (usernameTaken.rows.length > 0) {
    results.push({
      email,
      ok: false,
      error: `Username "${username}" already taken — set unique username in mailboxes.json`,
    });
    console.log(`  ✗ ${email} — username ${username} taken`);
    return;
  }

  const insert = await pool.query(
    `INSERT INTO users (organization_id, username, email, password_hash, full_name, is_active, created_at)
     VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP)
     RETURNING id, username, email, full_name`,
    [org.rows[0].id, username, email, passwordHash, fullName]
  );

  const user = insert.rows[0];
  results.push({
    ok: true,
    action: 'created',
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.full_name,
  });
  console.log(`  + ${user.email} (${user.full_name})`);
}

async function main() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`Missing ${CONFIG_PATH}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const list = config.mailboxes || [];
  const deletes = config.delete || [];
  const defaultPassword = config.defaultPassword;

  if (!defaultPassword) {
    console.error('defaultPassword is required in mailboxes.json');
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const results = [];

  console.log(`\nSyncing mailboxes (${list.length} upserts, ${deletes.length} deletes)...\n`);

  try {
    if (deletes.length) {
      console.log('Deletes:');
      for (const email of deletes) {
        await deleteMailbox(pool, email, results);
      }
      console.log('');
    }

    console.log('Upserts:');
    for (const entry of list) {
      await upsertMailbox(pool, entry, defaultPassword, results);
    }

    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify({ syncedAt: new Date().toISOString(), results }, null, 2)
    );

    const summary = results.reduce(
      (acc, r) => {
        if (r.action) acc[r.action] = (acc[r.action] || 0) + 1;
        if (r.ok === false) acc.failed += 1;
        return acc;
      },
      { failed: 0 }
    );

    console.log(`\n✅ Sync complete — created ${summary.created || 0}, updated ${summary.updated || 0}, deleted ${summary.deleted || 0}, failed ${summary.failed}`);
    console.log(`   Log: ${OUTPUT_PATH}\n`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
