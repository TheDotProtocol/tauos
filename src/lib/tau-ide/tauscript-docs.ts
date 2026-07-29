/** TauScript v1 — documentation synchronized with runtime */

export const TAUSCRIPT_V1_FEATURES = {
  implemented: [
    { name: 'Variables', syntax: 'let x = 42; const name = "Tau";', example: 'let x = 10\nprint(x)' },
    { name: 'Functions', syntax: 'fn name(a, b) { return a + b; }', example: 'fn add(a, b) { return a + b }\nprint(add(2, 3))' },
    { name: 'Structs', syntax: 'struct Point { x: 0, y: 0 }', example: 'struct Point { x: 0, y: 0 }\nlet p = Point { x: 10, y: 20 }\nprint(p.x)' },
    { name: 'Enums', syntax: 'enum Status { Active, Inactive }', example: 'enum Status { Active, Inactive }\nlet s = Status.Active\nprint(s)' },
    { name: 'Pattern Matching', syntax: 'match expr { pattern => body }', example: 'let r = ok(42)\nmatch r {\n  ok(val) => { print(val) },\n  err(e) => { print(e) }\n}' },
    { name: 'Modules & Imports', syntax: 'import { name } from "std.math"', example: 'import { add, multiply } from "std.math"\nprint(add(5, 3))' },
    { name: 'Conditionals', syntax: 'if (cond) { } else { }', example: 'if (x > 0) { print("positive") } else { print("zero or negative") }' },
    { name: 'While loops', syntax: 'while (cond) { }', example: 'let i = 0\nwhile (i < 3) { print(i); i = i + 1 }' },
    { name: 'For loops', syntax: 'for x in range { }', example: 'for i in 1..3 { print("step " + i) }' },
    { name: 'Arrays', syntax: '[1, 2, 3]', example: 'let arr = [1, 2, 3]\nprint(length(arr))' },
    { name: 'Maps', syntax: '{ key: value }', example: 'let m = { name: "Tau" }\nprint(m.name)' },
    { name: 'Strings', syntax: '"hello" + " world"', example: 'print("Hello, " + "Tau")' },
    { name: 'Print', syntax: 'print(expr)', example: 'print("Hello from TauScript")' },
    { name: 'Standard Library', syntax: 'std.math, std.string, std.io', example: 'import { abs, max } from "std.math"\nprint(max(abs(-5), 3))' },
    { name: 'Return', syntax: 'return value;', example: 'fn double(n) { return n * 2 }\nprint(double(4))' },
  ],
  version2: [
    'Generics and traits/interfaces',
    'Async programming',
    'File I/O and networking',
    'Package manager (taupm)',
    'Compiler to native binary',
    'Language Server Protocol (LSP)',
    'Formatter and doc generator',
    'Debugger architecture',
  ],
};

export const TAUSCRIPT_STD_MODULES = [
  { name: 'std.math', exports: ['add', 'subtract', 'multiply', 'divide', 'abs', 'min', 'max'] },
  { name: 'std.string', exports: ['length', 'upper', 'lower', 'trim', 'contains'] },
  { name: 'std.io', exports: ['println'] },
];

export const TAUSCRIPT_EXAMPLES = [
  { title: 'Hello World', code: 'print("Hello from TauScript")' },
  { title: 'Structs', code: 'struct User { name: "", age: 0 }\nlet u = User { name: "Tau", age: 1 }\nprint(u.name)' },
  { title: 'Enums & Match', code: 'enum Color { Red, Green, Blue }\nlet c = Color.Green\nmatch c {\n  Red => { print("red") },\n  Green => { print("green") },\n  Blue => { print("blue") }\n}' },
  { title: 'Import std.math', code: 'import { add, multiply } from "std.math"\nprint(add(10, multiply(2, 3)))' },
  { title: 'Functions', code: 'fn greet(name) {\n  return "Hi " + name\n}\nprint(greet("Developer"))' },
];
