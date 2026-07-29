/** TauScript v1 — documentation synchronized with runtime */

export const TAUSCRIPT_V1_FEATURES = {
  implemented: [
    { name: 'Variables', syntax: 'let x = 42; const name = "Tau";', example: 'let x = 10\nprint(x)' },
    { name: 'Functions', syntax: 'fn name(a, b) { return a + b; }', example: 'fn add(a, b) { return a + b }\nprint(add(2, 3))' },
    { name: 'Conditionals', syntax: 'if (cond) { } else { }', example: 'if (x > 0) { print("positive") } else { print("zero or negative") }' },
    { name: 'While loops', syntax: 'while (cond) { }', example: 'let i = 0\nwhile (i < 3) { print(i); i = i + 1 }' },
    { name: 'For loops', syntax: 'for x in range { }', example: 'for i in 1..3 { print("step " + i) }' },
    { name: 'Arrays', syntax: '[1, 2, 3]', example: 'let arr = [1, 2, 3]\nprint(length(arr))' },
    { name: 'Maps', syntax: '{ key: value }', example: 'let m = { name: "Tau" }\nprint(m.name)' },
    { name: 'Strings', syntax: '"hello" + " world"', example: 'print("Hello, " + "Tau")' },
    { name: 'Print', syntax: 'print(expr)', example: 'print("Hello from TauScript")' },
    { name: 'Math builtins', syntax: 'add(), subtract(), multiply(), divide()', example: 'print(add(10, 5))' },
    { name: 'Return', syntax: 'return value;', example: 'fn double(n) { return n * 2 }\nprint(double(4))' },
  ],
  version2: [
    'Modules and imports',
    'Structs, enums, interfaces, traits',
    'Generics and pattern matching',
    'File I/O and networking',
    'Package manager (taupm)',
    'Compiler to native binary',
    'Language Server Protocol (LSP)',
    'Formatter and doc generator',
  ],
};

export const TAUSCRIPT_EXAMPLES = [
  { title: 'Hello World', code: 'print("Hello from TauScript")' },
  { title: 'Variables & Math', code: 'let x = 42\nprint(add(x, 8))' },
  { title: 'Functions', code: 'fn greet(name) {\n  return "Hi " + name\n}\nprint(greet("Developer"))' },
  { title: 'While Loop', code: 'let i = 0\nwhile i < 3 {\n  print("step " + i)\n  i = i + 1\n}' },
  { title: 'Arrays', code: 'let nums = [1, 2, 3]\nprint(length(nums))' },
];
