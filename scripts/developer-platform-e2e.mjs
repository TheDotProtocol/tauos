#!/usr/bin/env node
/** Developer Platform E2E — APIs + TauScript scoped builtins */
const CANDIDATE_BASES = [
  process.argv.find((a) => a.startsWith('--base='))?.split('=')[1],
  process.env.E2E_BASE_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

const FETCH_TIMEOUT_MS = 8000;

const results = [];

async function probeBase(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${url}/api/tau-ide/status`, { signal: ctrl.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function resolveBase() {
  const seen = new Set();
  for (const candidate of CANDIDATE_BASES) {
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    if (await probeBase(candidate)) return candidate;
    console.warn(`  ⚠ ${candidate} not responding — trying next port…`);
  }
  throw new Error('No dev server found on 3000 or 3001. Start with: cd /Users/mac/Downloads/tauos && npm run dev');
}

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

async function json(base, path, opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${base}${path}`, { ...opts, signal: ctrl.signal });
    const body = await res.json().catch(() => ({}));
    if (!res.ok && res.status !== 401) throw new Error(`${res.status} ${JSON.stringify(body).slice(0, 160)}`);
    return { status: res.status, body };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const base = await resolveBase();
  console.log(`\nDeveloper Platform E2E — ${base}\n`);

  await check('marketplace catalog (public)', async () => {
    const { body } = await json(base, '/api/developers/marketplace');
    if (!body.items?.length) throw new Error('empty catalog');
  });

  await check('monitoring health', async () => {
    const { body } = await json(base, '/api/developers/monitoring/health');
    if (body.ok !== true) throw new Error('health not ok');
  });

  await check('TauScript scoped print in fn', async () => {
    const code = `fn main() { print("scoped-ok"); }\nmain();`;
    const { body } = await json(base, '/api/developers/tauscript/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const out = (body.output ?? []).join('\n');
    if (!out.includes('scoped-ok')) throw new Error(`missing output: ${out} err=${body.error}`);
  });

  await check('billing API (auth optional 401)', async () => {
    const { status } = await json(base, '/api/developers/billing');
    if (status !== 401 && status !== 200) throw new Error(`unexpected ${status}`);
  });

  await check('analytics API (auth optional 401)', async () => {
    const { status } = await json(base, '/api/developers/analytics?range=7d');
    if (status !== 401 && status !== 200) throw new Error(`unexpected ${status}`);
  });

  await check('developer platform pages reachable', async () => {
    for (const path of ['/developers/dashboard', '/developers/api-keys', '/developers/billing', '/developers/marketplace']) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
      try {
        const res = await fetch(`${base}${path}`, { signal: ctrl.signal });
        if (res.status >= 500) throw new Error(`${path} returned ${res.status}`);
      } finally {
        clearTimeout(timer);
      }
    }
  });

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed\n`);
  process.exit(failed.length ? 1 : 0);
}

main();
