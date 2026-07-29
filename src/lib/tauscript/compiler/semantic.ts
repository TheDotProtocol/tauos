import type { ASTNode, FunctionDefNode, StructDefNode, EnumDefNode, ImportNode, TraitDefNode, InterfaceDefNode } from '../ast';
import { DiagnosticCollector, type Diagnostic } from './diagnostics';
import type { TauType } from './types';
import { isAssignable, typeToString } from './types';

export type SymbolTable = Map<string, { kind: 'var' | 'fn' | 'struct' | 'enum' | 'trait' | 'interface'; type: TauType; line?: number }>;

export type SemanticResult = {
  symbols: SymbolTable;
  diagnostics: Diagnostic[];
  exports: string[];
};

function inferLiteralType(node: ASTNode): TauType {
  if (node.type !== 'literal') return { kind: 'unknown' };
  const v = node.value;
  if (typeof v === 'number') return { kind: 'number' };
  if (typeof v === 'string') return { kind: 'string' };
  if (typeof v === 'boolean') return { kind: 'boolean' };
  if (v === null) return { kind: 'null' };
  return { kind: 'unknown' };
}

export function analyzeSemantics(ast: ASTNode[]): SemanticResult {
  const diag = new DiagnosticCollector();
  const symbols: SymbolTable = new Map();
  const exports: string[] = [];

  // First pass: collect declarations
  for (const node of ast) {
    if (node.type === 'structDef') {
      symbols.set(node.name, { kind: 'struct', type: { kind: 'struct', name: node.name }, line: node.line });
      exports.push(node.name);
    } else if (node.type === 'enumDef') {
      symbols.set(node.name, { kind: 'enum', type: { kind: 'enum', name: node.name }, line: node.line });
      exports.push(node.name);
    } else if (node.type === 'functionDef') {
      symbols.set(node.name, {
        kind: 'fn',
        type: { kind: 'function', params: node.params.map(() => ({ kind: 'any' })), returns: { kind: 'any' } },
        line: node.line,
      });
      exports.push(node.name);
    } else if (node.type === 'traitDef') {
      symbols.set(node.name, { kind: 'trait', type: { kind: 'trait', name: node.name }, line: node.line });
      exports.push(node.name);
    } else if (node.type === 'interfaceDef') {
      symbols.set(node.name, { kind: 'interface', type: { kind: 'interface', name: node.name }, line: node.line });
      exports.push(node.name);
    } else if (node.type === 'import') {
      for (const n of node.names) exports.push(n);
    }
  }

  // Second pass: validate usage
  const checkNode = (node: ASTNode, scope: SymbolTable) => {
    switch (node.type) {
      case 'variable': {
        if (!scope.has(node.name) && !symbols.has(node.name)) {
          diag.error(`Undefined variable '${node.name}'`, node.line ?? 1, node.column ?? 1, 'TS1001');
        }
        break;
      }
      case 'functionCall': {
        const name = typeof node.name === 'string' ? node.name : null;
        if (name && !symbols.has(name) && !['print', 'ok', 'err', 'length'].includes(name)) {
          diag.warning(`Call to undeclared function '${name}'`, node.line ?? 1, node.column ?? 1, 'TS2001');
        }
        node.args.forEach((a) => checkNode(a, scope));
        break;
      }
      case 'assignment': {
        if (node.isLet) {
          scope.set(node.variable, { kind: 'var', type: inferLiteralType(node.value), line: node.line });
        }
        checkNode(node.value, scope);
        break;
      }
      case 'binaryOp':
        checkNode(node.left, scope);
        checkNode(node.right, scope);
        break;
      case 'if':
        checkNode(node.condition, scope);
        node.then.forEach((s) => checkNode(s, scope));
        node.else?.forEach((s) => checkNode(s, scope));
        break;
      case 'while':
        checkNode(node.condition, scope);
        node.body.forEach((s) => checkNode(s, scope));
        break;
      case 'for':
        checkNode(node.iterable, scope);
        node.body.forEach((s) => checkNode(s, scope));
        break;
      case 'return':
        if (node.value) checkNode(node.value, scope);
        break;
      case 'match':
        checkNode(node.expression, scope);
        node.arms.forEach((arm) => arm.body.forEach((s) => checkNode(s, scope)));
        break;
      case 'import':
        break;
      default:
        break;
    }
  };

  const globalScope: SymbolTable = new Map(symbols);
  ast.forEach((n) => checkNode(n, globalScope));

  // Complexity warnings
  const fnCount = ast.filter((n) => n.type === 'functionDef').length;
  if (fnCount > 50) diag.warning('High function count — consider splitting modules', 1, 1, 'TS3001');

  return { symbols, diagnostics: diag.getAll(), exports };
}

export function checkTypes(symbols: SymbolTable): Diagnostic[] {
  const diag = new DiagnosticCollector();
  symbols.forEach((sym, name) => {
    if (sym.kind === 'fn' && sym.type.kind === 'function') {
      const fnType = sym.type;
      fnType.params.forEach((p, i) => {
        if (p.kind === 'unknown') {
          diag.info(`Parameter ${i + 1} of '${name}' has inferred type`, sym.line ?? 1, 1, 'TS4001');
        }
      });
    }
  });
  return diag.getAll();
}
