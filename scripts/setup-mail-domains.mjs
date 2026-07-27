#!/usr/bin/env node
/**
 * Seed organizations for all Tau Mail production domains.
 * Usage: npm run mail:setup
 */
import dotenv from 'dotenv';
import pg from 'pg';
import { MAIL_ORGANIZATIONS } from './mail-domains-data.mjs';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function getOrgColumns(pool) {
  const { rows } = await pool.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'organizations'`
  );
  return new Set(rows.map((r) => r.column_name));
}

async function upsertOrg(pool, org, columns) {
  const existing = await pool.query(
    'SELECT id FROM organizations WHERE domain = $1',
    [org.domain]
  );

  if (existing.rows.length > 0) {
    if (columns.has('updated_at')) {
      await pool.query(
        'UPDATE organizations SET name = $1, updated_at = NOW() WHERE domain = $2',
        [org.name, org.domain]
      );
    } else {
      await pool.query('UPDATE organizations SET name = $1 WHERE domain = $2', [
        org.name,
        org.domain,
      ]);
    }
    return { action: 'updated', id: existing.rows[0].id };
  }

  const fields = ['name', 'domain'];
  const values = [org.name, org.domain];
  const placeholders = ['$1', '$2'];

  if (columns.has('storage_limit')) {
    fields.push('storage_limit');
    values.push(5368709120);
    placeholders.push(`$${values.length}`);
  }
  if (columns.has('created_at')) {
    fields.push('created_at');
    placeholders.push('NOW()');
  }
  if (columns.has('updated_at')) {
    fields.push('updated_at');
    placeholders.push('NOW()');
  }

  const result = await pool.query(
    `INSERT INTO organizations (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING id`,
    values
  );
  return { action: 'created', id: result.rows[0].id };
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    console.log(`Setting up ${MAIL_ORGANIZATIONS.length} mail domain organizations...\n`);

    const columns = await getOrgColumns(pool);
    if (!columns.has('domain') || !columns.has('name')) {
      throw new Error('organizations table missing required columns (name, domain)');
    }

    for (const org of MAIL_ORGANIZATIONS) {
      const { action, id } = await upsertOrg(pool, org, columns);
      console.log(`  ${action === 'created' ? '+' : '✓'} @${org.domain} (${action}, id: ${id})`);
    }

    const all = await pool.query(
      'SELECT id, name, domain FROM organizations WHERE domain = ANY($1) ORDER BY domain',
      [MAIL_ORGANIZATIONS.map((d) => d.domain)]
    );

    console.log(`\n✅ ${all.rows.length} mail domains ready:\n`);
    all.rows.forEach((row) => {
      console.log(`   ${row.id}. ${row.name} (@${row.domain})`);
    });
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
