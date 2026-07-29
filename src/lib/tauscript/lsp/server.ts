import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { compile } from '../compiler/pipeline';
import { listModules, getModule } from '../stdlib';
import type { Diagnostic } from '../compiler/diagnostics';

export type LSPPosition = { line: number; character: number };
export type LSPRange = { start: LSPPosition; end: LSPPosition };

export type CompletionItem = {
  label: string;
  kind: 'function' | 'variable' | 'keyword' | 'module' | 'struct' | 'enum';
  detail?: string;
  insertText?: string;
};

export type HoverInfo = { contents: string; range?: LSPRange };

const KEYWORDS = [
  'let', 'const', 'fn', 'function', 'if', 'else', 'while', 'for', 'return',
  'match', 'struct', 'enum', 'import', 'from', 'as', 'trait', 'interface', 'async', 'await',
  'ok', 'err', 'result', 'true', 'false', 'null',
];

const BUILTINS = ['print', 'length', 'ok', 'err'];

export function getCompletions(source: string, position: LSPPosition): CompletionItem[] {
  const items: CompletionItem[] = [];
  const line = source.split('\n')[position.line] ?? '';
  const prefix = line.slice(0, position.character).match(/[\w.]*$/)?.[0] ?? '';

  // Keywords
  KEYWORDS.filter((k) => k.startsWith(prefix)).forEach((k) => {
    items.push({ label: k, kind: 'keyword', insertText: k });
  });

  // Builtins
  BUILTINS.filter((b) => b.startsWith(prefix)).forEach((b) => {
    items.push({ label: b, kind: 'function', detail: 'builtin' });
  });

  // Stdlib modules
  listModules().forEach((mod) => {
    if (mod.startsWith(prefix) || prefix.startsWith('std.')) {
      items.push({ label: mod, kind: 'module', detail: 'standard library' });
    }
    const exports = getModule(mod);
    if (exports && (prefix.includes('.') || prefix === '')) {
      exports.forEach((_, name) => {
        if (name.startsWith(prefix.split('.').pop() ?? prefix)) {
          items.push({ label: name, kind: 'function', detail: mod });
        }
      });
    }
  });

  // Symbols from source
  try {
    const ast = new Parser(new Lexer(source).tokenize()).parse();
    ast.forEach((node) => {
      if (node.type === 'functionDef') {
        items.push({ label: node.name, kind: 'function', detail: `fn(${node.params.join(', ')})` });
      }
      if (node.type === 'structDef') {
        items.push({ label: node.name, kind: 'struct' });
      }
      if (node.type === 'enumDef') {
        items.push({ label: node.name, kind: 'enum' });
      }
    });
  } catch { /* partial parse */ }

  return items.slice(0, 50);
}

export function getHover(source: string, position: LSPPosition): HoverInfo | null {
  const line = source.split('\n')[position.line] ?? '';
  const word = line.slice(0, position.character).match(/\w+$/)?.[0];
  if (!word) return null;

  if (BUILTINS.includes(word)) {
    return { contents: `**${word}** — TauScript builtin function` };
  }

  for (const mod of listModules()) {
    const exports = getModule(mod);
    if (exports?.has(word)) {
      return { contents: `**${word}** from \`${mod}\`\n\nStandard library export.` };
    }
  }

  try {
    const ast = new Parser(new Lexer(source).tokenize()).parse();
    for (const node of ast) {
      if (node.type === 'functionDef' && node.name === word) {
        const asyncKw = node.async ? 'async ' : '';
        return { contents: `\`\`\`tau\n${asyncKw}fn ${node.name}(${node.params.join(', ')})\n\`\`\`` };
      }
      if (node.type === 'structDef' && node.name === word) {
        return { contents: `struct **${node.name}** — ${node.fields.map((f) => f.name).join(', ')}` };
      }
    }
  } catch { /* skip */ }

  if (KEYWORDS.includes(word)) {
    return { contents: `**${word}** — TauScript keyword` };
  }

  return null;
}

export function getDiagnostics(source: string): Diagnostic[] {
  const result = compile(source);
  return result.diagnostics;
}

export function findDefinition(source: string, position: LSPPosition): LSPRange | null {
  const line = source.split('\n')[position.line] ?? '';
  const word = line.match(/\w+/)?.[0];
  if (!word) return null;

  try {
    const ast = new Parser(new Lexer(source).tokenize()).parse();
    for (const node of ast) {
      if ((node.type === 'functionDef' || node.type === 'structDef' || node.type === 'enumDef') && node.name === word) {
        return {
          start: { line: (node.line ?? 1) - 1, character: 0 },
          end: { line: (node.line ?? 1) - 1, character: word.length },
        };
      }
    }
  } catch { /* skip */ }
  return null;
}

export function findReferences(source: string, symbol: string): LSPRange[] {
  const ranges: LSPRange[] = [];
  source.split('\n').forEach((line, i) => {
    let idx = 0;
    while ((idx = line.indexOf(symbol, idx)) !== -1) {
      ranges.push({
        start: { line: i, character: idx },
        end: { line: i, character: idx + symbol.length },
      });
      idx += symbol.length;
    }
  });
  return ranges;
}

export function renameSymbol(source: string, oldName: string, newName: string): string {
  const re = new RegExp(`\\b${oldName}\\b`, 'g');
  return source.replace(re, newName);
}

export function getSignatureHelp(source: string, position: LSPPosition): string | null {
  const line = source.split('\n')[position.line] ?? '';
  const fnMatch = line.match(/(\w+)\s*\([^)]*$/);
  if (!fnMatch) return null;
  const fnName = fnMatch[1];
  try {
    const ast = new Parser(new Lexer(source).tokenize()).parse();
    for (const node of ast) {
      if (node.type === 'functionDef' && node.name === fnName) {
        return `fn ${fnName}(${node.params.join(', ')})`;
      }
    }
  } catch { /* skip */ }
  return null;
}

export function getWorkspaceSymbols(source: string): Array<{ name: string; kind: string; line: number }> {
  const symbols: Array<{ name: string; kind: string; line: number }> = [];
  try {
    const ast = new Parser(new Lexer(source).tokenize()).parse();
    ast.forEach((node) => {
      if (node.type === 'functionDef') symbols.push({ name: node.name, kind: 'function', line: node.line ?? 1 });
      if (node.type === 'structDef') symbols.push({ name: node.name, kind: 'struct', line: node.line ?? 1 });
      if (node.type === 'enumDef') symbols.push({ name: node.name, kind: 'enum', line: node.line ?? 1 });
    });
  } catch { /* skip */ }
  return symbols;
}

export function handleLSPRequest(method: string, params: Record<string, unknown>): unknown {
  const source = String(params.source ?? '');
  const position = (params.position ?? { line: 0, character: 0 }) as LSPPosition;

  switch (method) {
    case 'textDocument/completion': return { items: getCompletions(source, position) };
    case 'textDocument/hover': return getHover(source, position);
    case 'textDocument/definition': return findDefinition(source, position);
    case 'textDocument/references': return findReferences(source, String(params.symbol ?? ''));
    case 'textDocument/signatureHelp': return getSignatureHelp(source, position);
    case 'textDocument/documentSymbol': return getWorkspaceSymbols(source);
    case 'textDocument/publishDiagnostics': return { diagnostics: getDiagnostics(source) };
    case 'textDocument/rename': return renameSymbol(source, String(params.oldName), String(params.newName));
    default: return { error: `Unknown method: ${method}` };
  }
}
