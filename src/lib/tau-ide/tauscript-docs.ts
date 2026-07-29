/** TauScript v1.0 — official documentation synchronized with runtime */

export const TAUSCRIPT_VERSION = '1.0.0';

export const TAUSCRIPT_V1_FEATURES = {
  implemented: [
    { name: 'Variables & Constants', syntax: 'let x = 42; const name = "Tau";', example: 'let x = 10\nprint(x)' },
    { name: 'Functions', syntax: 'fn name(a, b) { return a + b; }', example: 'fn add(a, b) { return a + b }\nprint(add(2, 3))' },
    { name: 'Generics', syntax: 'fn identity<T>(x) { return x; }', example: 'fn box<T>(v) { return v }\nprint(box(42))' },
    { name: 'Structs', syntax: 'struct Point { x: 0, y: 0 }', example: 'struct Point { x: 0, y: 0 }\nlet p = Point { x: 10, y: 20 }\nprint(p.x)' },
    { name: 'Enums', syntax: 'enum Status { Active, Inactive }', example: 'enum Status { Active, Inactive }\nlet s = Status.Active' },
    { name: 'Traits & Interfaces', syntax: 'trait Printable { fn print(self); }', example: 'trait Greeter { fn greet(name); }' },
    { name: 'Pattern Matching', syntax: 'match expr { pattern => body }', example: 'match r { ok(v) => { print(v) }, err(e) => { print(e) } }' },
    { name: 'Result Types', syntax: 'ok(value) / err(message)', example: 'let r = ok(42)\nmatch r { ok(v) => { print(v) }, err(e) => { print(e) } }' },
    { name: 'Async Foundations', syntax: 'async fn fetch() { await task; }', example: 'async fn run() { print("async ready") }\nrun()' },
    { name: 'Modules & Imports', syntax: 'import { name } from "std.math"', example: 'import { add } from "std.math"\nprint(add(5, 3))' },
    { name: 'Conditionals & Loops', syntax: 'if/while/for', example: 'for i in 1..3 { print(i) }' },
    { name: 'Collections', syntax: 'arrays, maps', example: 'let arr = [1, 2, 3]\nprint(length(arr))' },
  ],
  tooling: [
    'Compiler pipeline (lex → parse → semantic → IR)',
    'Tau CLI (tau run, build, test, fmt, lint, doc)',
    'taupm package manager',
    'Language Server (LSP) with Monaco IntelliSense',
    'Formatter (tau fmt)',
    'Debugger (breakpoints, step, watch)',
    'Testing framework (tau test)',
    'Documentation generator (tau doc)',
    'AI code review (tau lint --ai)',
  ],
};

export const TAUSCRIPT_STD_MODULES = [
  { name: 'std.math', exports: ['add', 'subtract', 'multiply', 'divide', 'abs', 'min', 'max', 'floor', 'ceil', 'round', 'sqrt', 'pow'] },
  { name: 'std.string', exports: ['length', 'upper', 'lower', 'trim', 'contains', 'split', 'join', 'replace'] },
  { name: 'std.io', exports: ['println', 'print'] },
  { name: 'std.collections', exports: ['push', 'pop', 'map', 'filter', 'reduce', 'keys', 'values'] },
  { name: 'std.json', exports: ['parse', 'stringify', 'pretty'] },
  { name: 'std.time', exports: ['now', 'iso', 'format', 'sleep'] },
  { name: 'std.crypto', exports: ['hash', 'random_bytes'] },
  { name: 'std.env', exports: ['get', 'platform'] },
  { name: 'std.http', exports: ['get', 'post', 'status_ok'] },
  { name: 'std.fs', exports: ['read', 'write', 'exists', 'delete', 'list'] },
  { name: 'std.encoding', exports: ['base64_encode', 'base64_decode', 'url_encode', 'url_decode'] },
  { name: 'std.random', exports: ['float', 'int', 'choice'] },
  { name: 'std.logging', exports: ['info', 'warn', 'error', 'debug'] },
  { name: 'std.config', exports: ['load', 'get'] },
  { name: 'std.compression', exports: ['gzip', 'ungzip'] },
];

export const TAUSCRIPT_CLI_COMMANDS = [
  { cmd: 'tau new <name>', desc: 'Create new project' },
  { cmd: 'tau init', desc: 'Initialize taupm.toml' },
  { cmd: 'tau run [file]', desc: 'Run TauScript' },
  { cmd: 'tau build', desc: 'Compile to IR' },
  { cmd: 'tau compile', desc: 'Compile to JavaScript' },
  { cmd: 'tau test', desc: 'Run test suite' },
  { cmd: 'tau fmt', desc: 'Format source' },
  { cmd: 'tau lint', desc: 'Lint and analyze' },
  { cmd: 'tau doc', desc: 'Generate documentation' },
  { cmd: 'tau doctor', desc: 'Check environment' },
  { cmd: 'tau pm install', desc: 'Install dependencies (taupm)' },
  { cmd: 'tau pm search', desc: 'Search package registry' },
];

export const TAUSCRIPT_EXAMPLES = [
  { title: 'Hello World', path: 'examples/tauscript/hello-world', code: 'print("Hello from TauScript v1.0")' },
  { title: 'REST API', path: 'examples/tauscript/rest-api', code: 'import { stringify } from "std.json"\nprint(stringify({ status: 200 }))' },
  { title: 'CLI Tool', path: 'examples/tauscript/cli-tool', code: 'import { upper } from "std.string"\nprint(upper("tau"))' },
  { title: 'Generics & Traits', path: 'examples/tauscript/hello-world', code: 'trait Show { fn show(self); }\nfn id<T>(x) { return x }' },
  { title: 'Testing', path: 'examples/tauscript/testing', code: 'fn test_add() { print(2 + 2); }' },
];

export const TAUSCRIPT_SDK_ARCHITECTURE = {
  planned: [
    { lang: 'JavaScript/TypeScript', interface: 'TauBridge.run(code)', status: 'architecture' },
    { lang: 'Python', interface: 'tau.run(code)', status: 'architecture' },
    { lang: 'Rust', interface: 'tau::run(code)', status: 'architecture' },
    { lang: 'Go', interface: 'tau.Run(code)', status: 'architecture' },
    { lang: 'C#', interface: 'TauRuntime.Run(code)', status: 'architecture' },
  ],
  protocol: 'HTTP POST /api/developers/tauscript/run { code } → { output, value, error }',
};
