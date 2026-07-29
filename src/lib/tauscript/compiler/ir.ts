/** TauScript Intermediate Representation — foundation for native compilation */
export type IROp =
  | { op: 'const'; value: number | string | boolean | null; dest: string }
  | { op: 'load'; name: string; dest: string }
  | { op: 'store'; name: string; src: string }
  | { op: 'call'; fn: string; args: string[]; dest?: string }
  | { op: 'binop'; operator: string; left: string; right: string; dest: string }
  | { op: 'jump'; label: string }
  | { op: 'jumpIfFalse'; cond: string; label: string }
  | { op: 'label'; name: string }
  | { op: 'return'; src?: string };

export type IRFunction = {
  name: string;
  params: string[];
  typeParams?: string[];
  async?: boolean;
  locals: string[];
  body: IROp[];
};

export type IRModule = {
  name: string;
  functions: IRFunction[];
  structs: string[];
  enums: string[];
  traits: string[];
  interfaces: string[];
  imports: Array<{ module: string; names: string[] }>;
};

export function irToText(mod: IRModule): string {
  const lines: string[] = [`module ${mod.name}`];
  for (const imp of mod.imports) {
    lines.push(`  import { ${imp.names.join(', ')} } from "${imp.module}"`);
  }
  for (const f of mod.functions) {
    const asyncKw = f.async ? 'async ' : '';
    const generics = f.typeParams?.length ? `<${f.typeParams.join(', ')}>` : '';
    lines.push(`  ${asyncKw}fn ${f.name}${generics}(${f.params.join(', ')}) {`);
    for (const op of f.body) {
      lines.push(`    ${JSON.stringify(op)}`);
    }
    lines.push('  }');
  }
  return lines.join('\n');
}
