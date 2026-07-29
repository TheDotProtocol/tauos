import type { TauValue, TauFunction } from './ast';

type ModuleExports = Map<string, TauValue | TauFunction>;

const modules = new Map<string, ModuleExports>();

function fn(params: string[], impl: (args: TauValue[]) => TauValue): TauFunction {
  return { type: 'function', params, body: [], jsImpl: impl };
}

function registerModule(name: string, exports: ModuleExports) {
  modules.set(name, exports);
}

registerModule('std.math', new Map([
  ['add', fn(['a', 'b'], (args) => Number(args[0]) + Number(args[1]))],
  ['subtract', fn(['a', 'b'], (args) => Number(args[0]) - Number(args[1]))],
  ['multiply', fn(['a', 'b'], (args) => Number(args[0]) * Number(args[1]))],
  ['divide', fn(['a', 'b'], (args) => { const b = Number(args[1]); if (b === 0) throw new Error('Division by zero'); return Number(args[0]) / b; })],
  ['abs', fn(['n'], (args) => Math.abs(Number(args[0])))],
  ['min', fn(['a', 'b'], (args) => Math.min(Number(args[0]), Number(args[1])))],
  ['max', fn(['a', 'b'], (args) => Math.max(Number(args[0]), Number(args[1])))],
]));

registerModule('std.string', new Map([
  ['length', fn(['s'], (args) => String(args[0]).length)],
  ['upper', fn(['s'], (args) => String(args[0]).toUpperCase())],
  ['lower', fn(['s'], (args) => String(args[0]).toLowerCase())],
  ['trim', fn(['s'], (args) => String(args[0]).trim())],
  ['contains', fn(['s', 'sub'], (args) => String(args[0]).includes(String(args[1])))],
]));

registerModule('std.io', new Map([
  ['println', fn(['...args'], () => null)],
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
