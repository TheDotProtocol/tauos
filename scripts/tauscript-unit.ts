#!/usr/bin/env npx tsx
/** TauScript unit tests — evaluator scoped builtins */
import { Lexer } from '../src/lib/tauscript/lexer';
import { Parser } from '../src/lib/tauscript/parser';
import { Evaluator } from '../src/lib/tauscript/evaluator';

function run(code: string) {
  const tokens = new Lexer(code).tokenize();
  const ast = new Parser(tokens).parseStrict();
  return new Evaluator().evaluate(ast);
}

const tests: { name: string; code: string; expect: (r: ReturnType<Evaluator['evaluate']>) => void }[] = [
  {
    name: 'top-level print',
    code: 'print("hello");',
    expect: (r) => {
      if (!r.output?.includes('hello')) throw new Error(r.error ?? 'no hello');
    },
  },
  {
    name: 'print inside fn block',
    code: 'fn main() { print("inside"); }\nmain();',
    expect: (r) => {
      if (r.error) throw new Error(r.error);
      if (!r.output?.includes('inside')) throw new Error(`output: ${r.output}`);
    },
  },
  {
    name: 'print inside bare block',
    code: '{ print("block"); }',
    expect: (r) => {
      if (!r.output?.includes('block')) throw new Error(r.error ?? r.output);
    },
  },
  {
    name: 'nested fn calls builtin',
    code: 'fn greet() { print("tau"); }\ngreet();',
    expect: (r) => {
      if (!r.output?.includes('tau')) throw new Error(r.error ?? r.output);
    },
  },
];

let failed = 0;
for (const t of tests) {
  try {
    t.expect(run(t.code));
    console.log(`  ✓ ${t.name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${t.name}:`, e instanceof Error ? e.message : e);
  }
}

console.log(failed ? `\n${failed} failed` : `\nAll ${tests.length} passed`);
process.exit(failed ? 1 : 0);
