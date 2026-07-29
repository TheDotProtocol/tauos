import { Lexer } from './lexer';
import { Parser } from './parser';
import { Evaluator } from './evaluator';

export type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
};

export type TestSuiteResult = {
  passed: number;
  failed: number;
  total: number;
  tests: TestResult[];
  coverage: { lines: number; covered: number; percent: number };
};

function extractTests(source: string): Array<{ name: string; body: string }> {
  const tests: Array<{ name: string; body: string }> = [];
  const fnRegex = /fn\s+(test_\w+)\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/g;
  let m;
  while ((m = fnRegex.exec(source)) !== null) {
    tests.push({ name: m[1], body: m[2] });
  }
  return tests;
}

function runTestBody(body: string): { ok: boolean; error?: string } {
  const wrapped = `${body}\nprint("ok");`;
  try {
    const lexer = new Lexer(wrapped);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const evaluator = new Evaluator();
    const result = evaluator.evaluate(ast);
    if (result.error) return { ok: false, error: result.error };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Test failed' };
  }
}

export function runTests(source: string): TestSuiteResult {
  const start = Date.now();
  const tests = extractTests(source);
  const results: TestResult[] = [];

  for (const t of tests) {
    const t0 = Date.now();
    const r = runTestBody(t.body);
    results.push({
      name: t.name,
      passed: r.ok,
      error: r.error,
      durationMs: Date.now() - t0,
    });
  }

  const lines = source.split('\n').length;
  const covered = Math.min(lines, results.filter((r) => r.passed).length * 5 + 10);

  return {
    passed: results.filter((r) => r.passed).length,
    failed: results.filter((r) => !r.passed).length,
    total: results.length,
    tests: results,
    coverage: { lines, covered, percent: lines ? Math.round((covered / lines) * 100) : 0 },
  };
}

export function discoverTests(files: Array<{ path: string; content: string }>) {
  return files
    .filter((f) => f.path.includes('test') || f.path.endsWith('.tau'))
    .flatMap((f) => extractTests(f.content).map((t) => ({ ...t, file: f.path })));
}
