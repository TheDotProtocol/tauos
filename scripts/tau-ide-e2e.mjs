#!/usr/bin/env node
/**
 * Tau IDE E2E tests — RC1 public beta hardening
 * Usage: npm run tau-ide:test:e2e [-- --base=http://localhost:3000]
 */
import { randomBytes } from 'crypto';

const base = process.argv.find((a) => a.startsWith('--base='))?.split('=')[1]
  ?? process.env.E2E_BASE_URL
  ?? 'http://localhost:3000';

const results = [];
let authToken = null;

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
  const headers = { 'Content-Type': 'application/json', ...(opts.headers ?? {}) };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(`${base}${path}`, { ...opts, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(body).slice(0, 200)}`);
  return body;
}

async function main() {
  console.log(`\nTau IDE E2E — ${base}\n`);

  await check('tau-ide status endpoint', async () => {
    const data = await json('/api/tau-ide/status');
    if (!data.tauIde?.version) throw new Error('missing tauIde status');
  });

  await check('TauScript run (rate limited)', async () => {
    const data = await json('/api/developers/tauscript/run', {
      method: 'POST',
      body: JSON.stringify({ code: 'print("e2e-ok")' }),
    });
    const out = Array.isArray(data.output) ? data.output.join('\n') : '';
    if (!out.includes('e2e-ok')) throw new Error('unexpected output');
  });

  await check('TauScript compile', async () => {
    const data = await json('/api/developers/tauscript/compile', {
      method: 'POST',
      body: JSON.stringify({ code: 'fn main() { print(1); }', target: 'ir' }),
    });
    if (!data.success && data.error) throw new Error(data.error);
  });

  await check('TauScript format', async () => {
    const data = await json('/api/developers/tauscript/format', {
      method: 'POST',
      body: JSON.stringify({ code: 'let x=1;' }),
    });
    if (!data.formatted) throw new Error('no formatted output');
  });

  await check('TauScript lint', async () => {
    const data = await json('/api/developers/tauscript/lint', {
      method: 'POST',
      body: JSON.stringify({ code: 'print("test");' }),
    });
    if (typeof data.score !== 'number') throw new Error('no score');
  });

  await check('TauScript test runner API', async () => {
    const data = await json('/api/developers/tauscript/test', {
      method: 'POST',
      body: JSON.stringify({ code: 'fn test_e2e() {\n  print(1);\n}\n' }),
    });
    if (!data.tests?.length) throw new Error('no tests found');
  });

  await check('Architect requires auth', async () => {
    const res = await fetch(`${base}/api/tau-ide/architect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }),
    });
    if (res.status !== 401) throw new Error(`expected 401, got ${res.status}`);
  });

  await check('register + login flow', async () => {
    const email = `tauide-e2e-${randomBytes(4).toString('hex')}@example.com`;
    const password = 'TestPass123!';
    await json('/api/tauid/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username: `u${randomBytes(3).toString('hex')}`, fullName: 'E2E User' }),
    });
    const login = await json('/api/tauid/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!login.token) throw new Error('no token');
    authToken = login.token;
  });

  await check('create project (authenticated)', async () => {
    const data = await json('/api/tau-ide/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'E2E Project', description: 'RC1 test' }),
    });
    if (!data.project?.id) throw new Error('no project id');
  });

  await check('global search (authenticated)', async () => {
    const data = await json('/api/tau-ide/search?q=e2e');
    if (!Array.isArray(data.results)) throw new Error('no results array');
  });

  await check('developers landing page', async () => {
    const res = await fetch(`${base}/developers`);
    if (!res.ok) throw new Error(String(res.status));
  });

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed\n`);
  process.exit(failed ? 1 : 0);
}

main();
