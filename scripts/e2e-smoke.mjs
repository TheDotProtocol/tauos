#!/usr/bin/env node
/**
 * TAU CORE Public Beta — E2E smoke tests
 * Usage: npm run test:e2e [-- --base=http://localhost:3000]
 */
import { randomBytes } from 'crypto';

const base = process.argv.find((a) => a.startsWith('--base='))?.split('=')[1]
  ?? process.env.E2E_BASE_URL
  ?? 'http://localhost:3000';

const results = [];

async function check(name, fn) {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - start });
    console.log(`  ✓ ${name} (${Date.now() - start}ms)`);
  } catch (err) {
    results.push({ name, ok: false, ms: Date.now() - start, error: err.message });
    console.error(`  ✗ ${name}: ${err.message}`);
  }
}

async function json(path, opts = {}) {
  const res = await fetch(`${base}${path}`, opts);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(body).slice(0, 120)}`);
  return body;
}

async function main() {
  console.log(`\nE2E smoke — ${base}\n`);

  await check('platform status', async () => {
    const data = await json('/api/platform/status');
    if (!data.checks?.database) throw new Error('missing checks');
  });

  await check('download manifest', async () => {
    const res = await fetch(`${base}/downloads/manifest.json`);
    if (!res.ok) throw new Error(String(res.status));
    const m = await res.json();
    if (!m.version || !m.artifacts?.length) throw new Error('invalid manifest');
  });

  await check('taustore catalog search', async () => {
    const data = await json('/api/taustore/apps/search?q=tau');
    if (!data.apps?.length) throw new Error('no apps');
  });

  await check('TauScript run', async () => {
    const data = await json('/api/developers/tauscript/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'print("ok")' }),
    });
    const out = Array.isArray(data.output) ? data.output.join('\n') : String(data.output || '');
    if (!out.includes('ok')) throw new Error('unexpected output');
  });

  const suffix = randomBytes(4).toString('hex');
  const email = `e2e-${suffix}@tauos.org`;
  const password = 'E2eTestPass123!';
  let token = '';

  await check('register + session', async () => {
    const reg = await json('/api/tauid/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `e2e${suffix}`,
        email,
        password,
        fullName: 'E2E Test',
      }),
    });
    token = reg.token;
    if (!token) throw new Error('no token');
    const session = await json('/api/auth/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!session.authenticated && !session.user) throw new Error('session invalid');
  });

  if (!token) {
    console.error('\n  ⚠ Skipping auth-dependent checks (register failed)\n');
  } else {
  await check('tau browser sync GET', async () => {
    const data = await json('/api/taubrowser/sync', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!('bookmarks' in data)) throw new Error('missing bookmarks');
  });

  await check('tau talk conversations', async () => {
    const data = await json('/api/tautalk/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!Array.isArray(data.conversations)) throw new Error('missing conversations');
  });

  await check('GDPR export endpoint', async () => {
    await json('/api/privacy/export', {
      headers: { Authorization: `Bearer ${token}` },
    });
  });
  }

  await check('enterprise compliance-status', async () => {
    const data = await json('/api/enterprise/compliance-status');
    if (!data.frameworks?.length) throw new Error('no frameworks');
  });

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed\n`);
  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
