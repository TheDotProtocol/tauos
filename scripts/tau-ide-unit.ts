#!/usr/bin/env npx tsx
/** Tau IDE unit tests — RC1 */
import assert from 'assert';
import { validateTauIdeEnv } from '../src/lib/tau-ide/server/env';
import { checkRateLimit } from '../src/lib/tau-ide/server/rate-limit';
import { compile } from '../src/lib/tauscript/compiler/pipeline';
import { format } from '../src/lib/tauscript/formatter';
import { lint } from '../src/lib/tauscript/linter';
import { runTests } from '../src/lib/tauscript/test-runner';

const results: { name: string; ok: boolean; error?: string }[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    results.push({ name, ok: true });
    console.log(`  ✓ ${name}`);
  } catch (e) {
    results.push({ name, ok: false, error: e instanceof Error ? e.message : String(e) });
    console.error(`  ✗ ${name}: ${e instanceof Error ? e.message : e}`);
  }
}

console.log('\nTau IDE unit tests\n');

test('env validation warns in dev without DATABASE_URL', () => {
  const orig = process.env.NODE_ENV;
  process.env.NODE_ENV = 'development';
  delete process.env.DATABASE_URL;
  const v = validateTauIdeEnv();
  assert.ok(v.warnings.length > 0);
  process.env.NODE_ENV = orig;
});

test('env validation fails production without secrets key', () => {
  const saved = { ...process.env };
  process.env.NODE_ENV = 'production';
  process.env.DATABASE_URL = 'postgresql://x';
  delete process.env.TAU_IDE_SECRETS_KEY;
  const v = validateTauIdeEnv();
  assert.ok(!v.valid);
  Object.assign(process.env, saved);
});

test('rate limit blocks after threshold', () => {
  const key = `test-${Date.now()}`;
  for (let i = 0; i < 5; i++) checkRateLimit(key, 5, 60_000);
  const blocked = checkRateLimit(key, 5, 60_000);
  assert.ok(!blocked.allowed);
});

test('TauScript compiles hello world', () => {
  const r = compile('print("hi");');
  assert.ok(r.success);
  assert.ok(r.ast.length > 0);
});

test('TauScript formatter produces output', () => {
  const out = format('let x=1;\nprint(x);');
  assert.ok(out.includes('let x'));
});

test('TauScript linter returns score', () => {
  const r = lint('print("ok");');
  assert.ok(typeof r.score === 'number');
});

test('TauScript test runner finds tests', () => {
  const r = runTests('fn test_ok() {\n  print(1);\n}');
  assert.ok(r.total >= 1);
});

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed\n`);
process.exit(failed ? 1 : 0);
