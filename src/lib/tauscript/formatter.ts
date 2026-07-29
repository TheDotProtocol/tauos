import { Lexer } from './lexer';
import { Parser } from './parser';
import type { ASTNode } from './ast';

export type FormatOptions = {
  indentSize?: number;
  maxLineLength?: number;
};

const DEFAULT_OPTS: Required<FormatOptions> = { indentSize: 2, maxLineLength: 100 };

function formatNode(node: ASTNode, indent: number, opts: Required<FormatOptions>): string {
  const sp = ' '.repeat(indent);
  const sp2 = ' '.repeat(indent + opts.indentSize);

  switch (node.type) {
    case 'literal':
      if (typeof node.value === 'string') return `"${node.value}"`;
      return String(node.value);
    case 'variable':
      return node.name;
    case 'assignment':
      return `${node.isLet ? 'let ' : ''}${node.variable} = ${formatNode(node.value, indent, opts)};`;
    case 'functionDef': {
      const asyncKw = node.async ? 'async ' : '';
      const generics = node.typeParams?.length ? `<${node.typeParams.join(', ')}>` : '';
      const body = node.body.map((s) => sp2 + formatNode(s, indent + opts.indentSize, opts)).join('\n');
      return `${asyncKw}fn ${node.name}${generics}(${node.params.join(', ')}) {\n${body}\n${sp}}`;
    }
    case 'structDef': {
      const fields = node.fields.map((f) => `${f.name}${f.defaultValue ? `: ${formatNode(f.defaultValue, indent, opts)}` : ''}`).join(', ');
      return `struct ${node.name} { ${fields} }`;
    }
    case 'enumDef':
      return `enum ${node.name} { ${node.variants.join(', ')} }`;
    case 'traitDef':
      return `trait ${node.name} {\n${node.methods.map((m) => sp2 + `fn ${m.name}(${m.params.join(', ')});`).join('\n')}\n${sp}}`;
    case 'interfaceDef':
      return `interface ${node.name} {\n${node.methods.map((m) => sp2 + `fn ${m.name}(${m.params.join(', ')});`).join('\n')}\n${sp}}`;
    case 'import':
      return `import { ${node.names.join(', ')} } from "${node.module}"${node.alias ? ` as ${node.alias}` : ''};`;
    case 'if': {
      const then = node.then.map((s) => sp2 + formatNode(s, indent + opts.indentSize, opts)).join('\n');
      const els = node.else?.map((s) => sp2 + formatNode(s, indent + opts.indentSize, opts)).join('\n');
      return `if (${formatNode(node.condition, indent, opts)}) {\n${then}\n${sp}}${els ? ` else {\n${els}\n${sp}}` : ''}`;
    }
    case 'while': {
      const body = node.body.map((s) => sp2 + formatNode(s, indent + opts.indentSize, opts)).join('\n');
      return `while (${formatNode(node.condition, indent, opts)}) {\n${body}\n${sp}}`;
    }
    case 'for': {
      const body = node.body.map((s) => sp2 + formatNode(s, indent + opts.indentSize, opts)).join('\n');
      return `for ${node.variable} in ${formatNode(node.iterable, indent, opts)} {\n${body}\n${sp}}`;
    }
    case 'return':
      return node.value ? `return ${formatNode(node.value, indent, opts)};` : 'return;';
    case 'functionCall': {
      const name = typeof node.name === 'string' ? node.name : formatNode(node.name, indent, opts);
      return `${name}(${node.args.map((a) => formatNode(a, indent, opts)).join(', ')})`;
    }
    case 'binaryOp':
      return `${formatNode(node.left, indent, opts)} ${node.operator} ${formatNode(node.right, indent, opts)}`;
    case 'unaryOp':
      return `${node.operator}${formatNode(node.operand, indent, opts)}`;
    case 'await':
      return `await ${formatNode(node.expression, indent, opts)}`;
    case 'match': {
      const arms = node.arms.map((a) => {
        const pat = a.param ? `${a.pattern}(${a.param})` : a.pattern;
        const body = a.body.map((s) => sp2 + formatNode(s, indent + opts.indentSize, opts)).join('\n');
        return `${sp2}${pat} => {\n${body}\n${sp2}}`;
      }).join(',\n');
      return `match ${formatNode(node.expression, indent, opts)} {\n${arms}\n${sp}}`;
    }
    case 'array':
      return `[${node.elements.map((e) => formatNode(e, indent, opts)).join(', ')}]`;
    case 'structInstance':
      return `${node.name} { ${node.fields.map((f) => `${f.name}: ${formatNode(f.value, indent, opts)}`).join(', ')} }`;
    case 'memberAccess':
      return `${formatNode(node.object, indent, opts)}.${node.member}`;
    default:
      return '';
  }
}

export function format(source: string, options: FormatOptions = {}): string {
  const opts = { ...DEFAULT_OPTS, ...options };
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  return ast.map((n) => formatNode(n, 0, opts)).filter(Boolean).join('\n\n') + '\n';
}
