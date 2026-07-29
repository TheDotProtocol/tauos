import type { TauValue, TauFunction } from './ast';

type ModuleExports = Map<string, TauValue | TauFunction>;

const modules = new Map<string, ModuleExports>();

function fn(params: string[], impl: (args: TauValue[]) => TauValue): TauFunction {
  return { type: 'function', params, body: [], jsImpl: impl };
}

function registerModule(name: string, exports: ModuleExports) {
  modules.set(name, exports);
}

// std.math
registerModule('std.math', new Map([
  ['add', fn(['a', 'b'], (a) => Number(a[0]) + Number(a[1]))],
  ['subtract', fn(['a', 'b'], (a) => Number(a[0]) - Number(a[1]))],
  ['multiply', fn(['a', 'b'], (a) => Number(a[0]) * Number(a[1]))],
  ['divide', fn(['a', 'b'], (a) => { const b = Number(a[1]); if (b === 0) throw new Error('Division by zero'); return Number(a[0]) / b; })],
  ['abs', fn(['n'], (a) => Math.abs(Number(a[0])))],
  ['min', fn(['a', 'b'], (a) => Math.min(Number(a[0]), Number(a[1])))],
  ['max', fn(['a', 'b'], (a) => Math.max(Number(a[0]), Number(a[1])))],
  ['floor', fn(['n'], (a) => Math.floor(Number(a[0])))],
  ['ceil', fn(['n'], (a) => Math.ceil(Number(a[0])))],
  ['round', fn(['n'], (a) => Math.round(Number(a[0])))],
  ['sqrt', fn(['n'], (a) => Math.sqrt(Number(a[0])))],
  ['pow', fn(['a', 'b'], (a) => Math.pow(Number(a[0]), Number(a[1])))],
]));

// std.string
registerModule('std.string', new Map([
  ['length', fn(['s'], (a) => String(a[0]).length)],
  ['upper', fn(['s'], (a) => String(a[0]).toUpperCase())],
  ['lower', fn(['s'], (a) => String(a[0]).toLowerCase())],
  ['trim', fn(['s'], (a) => String(a[0]).trim())],
  ['contains', fn(['s', 'sub'], (a) => String(a[0]).includes(String(a[1])))],
  ['split', fn(['s', 'sep'], (a) => String(a[0]).split(String(a[1] ?? ',')))],
  ['join', fn(['arr', 'sep'], (a) => (Array.isArray(a[0]) ? a[0] : []).map(String).join(String(a[1] ?? ',')))],
  ['replace', fn(['s', 'from', 'to'], (a) => String(a[0]).replace(String(a[1]), String(a[2])))],
]));

// std.io
registerModule('std.io', new Map([
  ['println', fn(['...args'], () => null)],
  ['print', fn(['...args'], () => null)],
]));

// std.collections
registerModule('std.collections', new Map([
  ['push', fn(['arr', 'item'], (a) => { const arr = Array.isArray(a[0]) ? [...a[0]] : []; arr.push(a[1]); return arr; })],
  ['pop', fn(['arr'], (a) => { const arr = Array.isArray(a[0]) ? [...a[0]] : []; return arr.pop() ?? null; })],
  ['map', fn(['arr', 'fn'], (a) => (Array.isArray(a[0]) ? a[0] : []).map((x) => x))],
  ['filter', fn(['arr', 'fn'], (a) => (Array.isArray(a[0]) ? a[0] : []))],
  ['reduce', fn(['arr', 'init'], (a) => (Array.isArray(a[0]) ? a[0] : []).reduce((acc, v) => acc, a[1] ?? 0))],
  ['keys', fn(['map'], (a) => (a[0] instanceof Map ? Array.from(a[0].keys()) : []))],
  ['values', fn(['map'], (a) => (a[0] instanceof Map ? Array.from(a[0].values()) : []))],
]));

// std.json
registerModule('std.json', new Map([
  ['parse', fn(['s'], (a) => { try { return JSON.parse(String(a[0])); } catch { return null; } })],
  ['stringify', fn(['v'], (a) => JSON.stringify(a[0]))],
  ['pretty', fn(['v'], (a) => JSON.stringify(a[0], null, 2))],
]));

// std.time
registerModule('std.time', new Map([
  ['now', fn([], () => Date.now())],
  ['iso', fn([], () => new Date().toISOString())],
  ['format', fn(['ms'], (a) => new Date(Number(a[0])).toISOString())],
  ['sleep', fn(['ms'], () => null)], // sync stub
]));

// std.crypto
registerModule('std.crypto', new Map([
  ['hash', fn(['s'], (a) => { let h = 0; const s = String(a[0]); for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return Math.abs(h).toString(16); })],
  ['random_bytes', fn(['n'], (a) => Array.from({ length: Number(a[0]) || 16 }, () => Math.floor(Math.random() * 256)))],
]));

// std.env
registerModule('std.env', new Map([
  ['get', fn(['key'], (a) => (typeof process !== 'undefined' ? process.env[String(a[0])] ?? null : null))],
  ['platform', fn([], () => (typeof process !== 'undefined' ? process.platform : 'browser'))],
]));

// std.http (foundations)
registerModule('std.http', new Map([
  ['get', fn(['url'], () => null)], // async stub — returns null in interpreter
  ['post', fn(['url', 'body'], () => null)],
  ['status_ok', fn(['code'], (a) => Number(a[0]) >= 200 && Number(a[0]) < 300)],
]));

// std.fs (sandboxed — in-memory only in browser)
const virtualFs = new Map<string, string>();
registerModule('std.fs', new Map([
  ['read', fn(['path'], (a) => virtualFs.get(String(a[0])) ?? '')],
  ['write', fn(['path', 'content'], (a) => { virtualFs.set(String(a[0]), String(a[1])); return true; })],
  ['exists', fn(['path'], (a) => virtualFs.has(String(a[0])))],
  ['delete', fn(['path'], (a) => virtualFs.delete(String(a[0])))],
  ['list', fn(['dir'], (a) => Array.from(virtualFs.keys()).filter((k) => k.startsWith(String(a[0]))))],
]));

// std.encoding
registerModule('std.encoding', new Map([
  ['base64_encode', fn(['s'], (a) => {
    const s = String(a[0]);
    if (typeof Buffer !== 'undefined') return Buffer.from(s).toString('base64');
    if (typeof btoa !== 'undefined') return btoa(s);
    return s;
  })],
  ['base64_decode', fn(['s'], (a) => {
    const s = String(a[0]);
    if (typeof Buffer !== 'undefined') return Buffer.from(s, 'base64').toString();
    if (typeof atob !== 'undefined') return atob(s);
    return s;
  })],
  ['url_encode', fn(['s'], (a) => encodeURIComponent(String(a[0])))],
  ['url_decode', fn(['s'], (a) => decodeURIComponent(String(a[0])))],
]));

// std.random
registerModule('std.random', new Map([
  ['float', fn([], () => Math.random())],
  ['int', fn(['min', 'max'], (a) => Math.floor(Math.random() * (Number(a[1]) - Number(a[0]) + 1)) + Number(a[0]))],
  ['choice', fn(['arr'], (a) => { const arr = Array.isArray(a[0]) ? a[0] : []; return arr[Math.floor(Math.random() * arr.length)] ?? null; })],
]));

// std.logging
registerModule('std.logging', new Map([
  ['info', fn(['msg'], () => null)],
  ['warn', fn(['msg'], () => null)],
  ['error', fn(['msg'], () => null)],
  ['debug', fn(['msg'], () => null)],
]));

// std.config
registerModule('std.config', new Map([
  ['load', fn(['json'], (a) => { try { return JSON.parse(String(a[0])); } catch { return {}; } })],
  ['get', fn(['cfg', 'key'], (a) => {
    if (a[0] && typeof a[0] === 'object' && !Array.isArray(a[0])) {
      const v = (a[0] as unknown as Record<string, unknown>)[String(a[1])];
      return (v as TauValue) ?? null;
    }
    return null;
  })],
]));

// std.compression (stub)
registerModule('std.compression', new Map([
  ['gzip', fn(['data'], (a) => String(a[0]))],
  ['ungzip', fn(['data'], (a) => String(a[0]))],
]));

export function getModule(name: string): ModuleExports | undefined {
  return modules.get(name);
}

export function listModules(): string[] {
  return Array.from(modules.keys());
}

export function importFromModule(moduleName: string, names: string[]): Map<string, TauValue | TauFunction> {
  const mod = modules.get(moduleName);
  if (!mod) throw new Error(`Module '${moduleName}' not found`);
  const result = new Map<string, TauValue | TauFunction>();
  for (const name of names) {
    const exp = mod.get(name);
    if (exp === undefined) throw new Error(`'${name}' not exported from '${moduleName}'`);
    result.set(name, exp);
  }
  return result;
}

export const STD_MODULE_DOCS: Record<string, string[]> = {
  'std.math': ['add', 'subtract', 'multiply', 'divide', 'abs', 'min', 'max', 'floor', 'ceil', 'round', 'sqrt', 'pow'],
  'std.string': ['length', 'upper', 'lower', 'trim', 'contains', 'split', 'join', 'replace'],
  'std.io': ['println', 'print'],
  'std.collections': ['push', 'pop', 'map', 'filter', 'reduce', 'keys', 'values'],
  'std.json': ['parse', 'stringify', 'pretty'],
  'std.time': ['now', 'iso', 'format', 'sleep'],
  'std.crypto': ['hash', 'random_bytes'],
  'std.env': ['get', 'platform'],
  'std.http': ['get', 'post', 'status_ok'],
  'std.fs': ['read', 'write', 'exists', 'delete', 'list'],
  'std.encoding': ['base64_encode', 'base64_decode', 'url_encode', 'url_decode'],
  'std.random': ['float', 'int', 'choice'],
  'std.logging': ['info', 'warn', 'error', 'debug'],
  'std.config': ['load', 'get'],
  'std.compression': ['gzip', 'ungzip'],
};
