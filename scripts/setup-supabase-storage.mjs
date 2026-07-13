#!/usr/bin/env node
/**
 * Create Supabase Storage bucket for Tau Cloud (Phase 0)
 * Usage: npm run storage:setup
 */
import dotenv from 'dotenv';
import { existsSync } from 'fs';

for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) dotenv.config({ path: f });
}

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'taucloud-files';

let url = process.env.SUPABASE_URL?.trim();
if (!url) {
  const db = process.env.DATABASE_URL ?? '';
  const match = db.match(/postgres\.([a-z0-9]+)\./i) ?? db.match(/@db\.([a-z0-9]+)\./i);
  if (match?.[1]) url = `https://${match[1]}.supabase.co`;
}

if (!url || !serviceKey) {
  console.error('❌ Set SUPABASE_SERVICE_ROLE_KEY (and optionally SUPABASE_URL) in .env.local');
  console.error('   Find service role key: Supabase Dashboard → Settings → API');
  process.exit(1);
}

const base = `${url.replace(/\/$/, '')}/storage/v1`;

console.log(`Setting up bucket "${bucket}" on ${url}…`);

const res = await fetch(`${base}/bucket`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: bucket,
    public: false,
    file_size_limit: 52428800,
    allowed_mime_types: null,
  }),
});

const text = await res.text();
if (res.ok || res.status === 409 || text.includes('already exists')) {
  console.log(`✅ Bucket ready: ${bucket}`);
  process.exit(0);
}

console.error(`❌ Failed (${res.status}): ${text}`);
process.exit(1);
