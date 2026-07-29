# TauScript Language Specification v1.0

TauScript v1.0 is the official release of the Tau programming language for the Tau IDE Developer Platform.

## Overview

- **Version:** 1.0.0
- **Runtime:** TypeScript interpreter with compiler pipeline
- **Package Manager:** taupm
- **CLI:** `npm run tau -- run`

## Syntax

### Variables
```
let x = 42;
const name = "Tau";
```

### Functions & Generics
```
fn add(a, b) { return a + b; }
fn identity<T>(x) { return x; }
async fn fetch() { await load(); }
```

### Structs & Enums
```
struct User { name: "", age: 0 }
enum Status { Active, Inactive }
```

### Traits & Interfaces
```
trait Printable { fn print(self); }
interface Serializable { fn to_json(self); }
```

### Pattern Matching & Results
```
let r = ok(42);
match r {
  ok(val) => { print(val) },
  err(e) => { print(e) }
}
```

### Modules
```
import { add, max } from "std.math";
```

## Standard Library

15 modules: std.math, std.string, std.io, std.collections, std.json, std.time, std.crypto, std.env, std.http, std.fs, std.encoding, std.random, std.logging, std.config, std.compression

## Tooling

| Tool | Command |
|------|---------|
| Run | `npm run tau -- run` |
| Compile | `npm run tau -- build` |
| Test | `npm run tau -- test` |
| Format | `npm run tau -- fmt` |
| Lint | `npm run tau -- lint` |
| Docs | `npm run tau -- doc` |
| Packages | `npm run taupm -- install` |

## Compiler Pipeline

```
Source → Lexer → Parser → AST → Semantic Analysis → Type Check → IR → Target (interpret/js)
```

## Examples

Official examples in `examples/tauscript/`.
