#!/usr/bin/env node
/** Developer Platform E2E — APIs + TauScript scoped builtins */
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
    results.push({ name, ok: false, error: err.message });
    console.error(`  ✗ ${name}: ${err.message}`);
  }
}

async function json(path, opts = {}) {
  const res = await fetch(`${base}${path}`, opts);
  const body = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 401) throw new Error(`${res.status} ${JSON.stringify(body).slice(0, 160)}`);
  return { status: res.status, body };
}

async function main() {
  console.log(`\nDeveloper Platform E2E — ${base}\n`);

  await check('marketplace catalog (public)', async () => {
    const { body } = await json('/api/developers/marketplace');
    if (!body.items?.length) throw new Error('empty catalog');
  });

  await check('monitoring health', async () => {
    const { body } = await json('/api/developers/monitoring/health');
    if (body.ok !== true) throw new Error('health not ok');
  });

  await check('TauScript scoped print in fn', async () => {
    const code = `fn main() { print("scoped-ok"); }\nmain();`;
    const { body } = await json('/api/developers/tauscript/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const out = (body.output ?? []).join('\n');
    if (!out.includes('scoped-ok')) throw new Error(`missing output: ${out} err=${body.error}`);
  });

  await check('billing API (auth optional 401)', async () => {
    const { status } = await json('/api/developers/billing');
    if (status !== 401 && status !== 200) throw new Error(`unexpected ${status}`);
  });

  await check('analytics API (auth optional 401)', async () => {
    const { status } = await json('/api/developers/analytics?range=7d');
    if (status !== 401 && status !== 200) throw new Error(`unexpected ${status}`);
  });

  await check('developer platform pages reachable', async () => {
    for (const path of ['/developers/dashboard', '/developers/api-keys', '/developers/billing', '/developers/marketplace']) {
      const res = await fetch(`${base}${path}`);
      if (res.status >= 500) throw new Error(`${path} returned ${res.status}`);
    }
  });

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed\n`);
  process.exit(failed.length ? 1 : 0);
}

main();
