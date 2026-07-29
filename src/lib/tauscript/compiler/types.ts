/** TauScript v1.0 type system */
export type TauType =
  | { kind: 'unknown' }
  | { kind: 'void' }
  | { kind: 'number' }
  | { kind: 'string' }
  | { kind: 'boolean' }
  | { kind: 'null' }
  | { kind: 'any' }
  | { kind: 'array'; element: TauType }
  | { kind: 'map' }
  | { kind: 'function'; params: TauType[]; returns: TauType }
  | { kind: 'struct'; name: string }
  | { kind: 'enum'; name: string }
  | { kind: 'result'; ok: TauType; err: TauType }
  | { kind: 'generic'; name: string }
  | { kind: 'trait'; name: string }
  | { kind: 'interface'; name: string };

export function typeToString(t: TauType): string {
  switch (t.kind) {
    case 'unknown': return 'unknown';
    case 'void': return 'void';
    case 'number': return 'number';
    case 'string': return 'string';
    case 'boolean': return 'boolean';
    case 'null': return 'null';
    case 'any': return 'any';
    case 'array': return `Array<${typeToString(t.element)}>`;
    case 'map': return 'Map';
    case 'function': return `fn(${t.params.map(typeToString).join(', ')}) -> ${typeToString(t.returns)}`;
    case 'struct': return t.name;
    case 'enum': return t.name;
    case 'result': return `Result<${typeToString(t.ok)}, ${typeToString(t.err)}>`;
    case 'generic': return t.name;
    case 'trait': return `trait ${t.name}`;
    case 'interface': return `interface ${t.name}`;
    default: return 'unknown';
  }
}

export function isAssignable(from: TauType, to: TauType): boolean {
  if (to.kind === 'any' || from.kind === 'any') return true;
  if (from.kind === to.kind) {
    if (from.kind === 'struct' && to.kind === 'struct') return from.name === to.name;
    if (from.kind === 'enum' && to.kind === 'enum') return from.name === to.name;
    if (from.kind === 'array' && to.kind === 'array') return isAssignable(from.element, to.element);
    return true;
  }
  if (from.kind === 'null' && to.kind === 'string') return true;
  return false;
}
