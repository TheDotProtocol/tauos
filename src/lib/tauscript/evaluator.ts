/**
 * TauScript Evaluator
 * Executes the AST and produces results
 */

import type { ASTNode, TauValue, TauArray, TauMap, TauFunction, Result, Environment, TauStruct, TauEnumValue, TauResult } from './ast';
import type { LiteralNode, VariableNode, BinaryOpNode, UnaryOpNode, AssignmentNode, FunctionCallNode, FunctionDefNode, IfNode, WhileNode, ForNode, BlockNode, ReturnNode, ArrayNode, MapNode, IndexNode, StructDefNode, EnumDefNode, MatchNode, ImportNode, StructInstanceNode, MemberAccessNode } from './ast';
import { importFromModule } from './stdlib';

export class Evaluator {
  private environment: Environment;
  private output: string[] = [];
  private returnValue: TauValue | null = null;
  private hasReturned: boolean = false;
  private structDefs: Map<string, StructDefNode> = new Map();
  private enumDefs: Map<string, EnumDefNode> = new Map();

  constructor(parentEnvironment?: Environment) {
    this.environment = {
      variables: new Map(),
      functions: new Map(),
      parent: parentEnvironment
    };
    this.initializeBuiltins();
  }

  private initializeBuiltins(): void {
    // Print function
    this.defineFunction('print', ['...args'], (args: TauValue[]) => {
      const output = args.map(arg => this.stringify(arg)).join(' ');
      this.output.push(output);
      return output;
    });

    // Math functions
    this.defineFunction('add', ['a', 'b'], (args: TauValue[]) => {
      const a = this.toNumber(args[0]);
      const b = this.toNumber(args[1]);
      return a + b;
    });

    this.defineFunction('subtract', ['a', 'b'], (args: TauValue[]) => {
      const a = this.toNumber(args[0]);
      const b = this.toNumber(args[1]);
      return a - b;
    });

    this.defineFunction('multiply', ['a', 'b'], (args: TauValue[]) => {
      const a = this.toNumber(args[0]);
      const b = this.toNumber(args[1]);
      return a * b;
    });

    this.defineFunction('divide', ['a', 'b'], (args: TauValue[]) => {
      const a = this.toNumber(args[0]);
      const b = this.toNumber(args[1]);
      if (b === 0) {
        throw new Error('Division by zero');
      }
      return a / b;
    });

    this.defineFunction('floor', ['num'], (args: TauValue[]) => {
      return Math.floor(this.toNumber(args[0]));
    });

    this.defineFunction('ceil', ['num'], (args: TauValue[]) => {
      return Math.ceil(this.toNumber(args[0]));
    });

    this.defineFunction('round', ['num'], (args: TauValue[]) => {
      return Math.round(this.toNumber(args[0]));
    });

    this.defineFunction('random', [], () => {
      return Math.random();
    });

    // Array functions
    this.defineFunction('length', ['arr'], (args: TauValue[]) => {
      const arr = args[0];
      if (Array.isArray(arr)) {
        return arr.length;
      }
      throw new Error('length expects an array');
    });

    this.defineFunction('first', ['arr'], (args: TauValue[]) => {
      const arr = args[0];
      if (Array.isArray(arr) && arr.length > 0) {
        return arr[0];
      }
      throw new Error('first expects a non-empty array');
    });

    this.defineFunction('last', ['arr'], (args: TauValue[]) => {
      const arr = args[0];
      if (Array.isArray(arr) && arr.length > 0) {
        return arr[arr.length - 1];
      }
      throw new Error('last expects a non-empty array');
    });

    this.defineFunction('is_empty', ['arr'], (args: TauValue[]) => {
      const arr = args[0];
      if (Array.isArray(arr)) {
        return arr.length === 0;
      }
      throw new Error('is_empty expects an array');
    });

    this.defineFunction('contains', ['arr', 'item'], (args: TauValue[]) => {
      const arr = args[0];
      const item = args[1];
      if (Array.isArray(arr)) {
        return arr.includes(item);
      }
      throw new Error('contains expects an array');
    });

    this.defineFunction('sort', ['arr'], (args: TauValue[]) => {
      const arr = args[0];
      if (Array.isArray(arr)) {
        return [...arr].sort((a, b) => {
          if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
          }
          return String(a).localeCompare(String(b));
        });
      }
      throw new Error('sort expects an array');
    });

    this.defineFunction('reverse', ['arr'], (args: TauValue[]) => {
      const arr = args[0];
      if (Array.isArray(arr)) {
        return [...arr].reverse();
      }
      throw new Error('reverse expects an array');
    });

    // Type conversion
    this.defineFunction('to_string', ['value'], (args: TauValue[]) => {
      return this.stringify(args[0]);
    });

    this.defineFunction('to_number', ['value'], (args: TauValue[]) => {
      return this.toNumber(args[0]);
    });

    // Time functions
    this.defineFunction('now', [], () => {
      return new Date().toISOString();
    });

    // Help function
    this.defineFunction('help', [], () => {
      return `TauScript Built-in Functions:
- print(...args): Print values
- add(a, b): Add two numbers
- subtract(a, b): Subtract two numbers
- multiply(a, b): Multiply two numbers
- divide(a, b): Divide two numbers
- floor(num): Round down
- ceil(num): Round up
- round(num): Round to nearest
- random(): Get random number
- length(arr): Get array length
- first(arr): Get first element
- last(arr): Get last element
- is_empty(arr): Check if array is empty
- contains(arr, item): Check if array contains item
- sort(arr): Sort array
- reverse(arr): Reverse array
- to_string(value): Convert to string
- to_number(value): Convert to number
- now(): Get current timestamp
- help(): Show this help`;
    });
  }

  private defineFunction(name: string, params: string[], body: (args: TauValue[]) => TauValue): void {
    this.environment.functions.set(name, {
      type: 'function',
      params,
      body: [] as any, // We use JS function instead
      closure: this.environment
    } as TauFunction);
    
    // Store the actual implementation
    (this.environment.functions.get(name) as any).jsImpl = body;
  }

  evaluate(nodes: ASTNode[]): { result: TauValue | null; output: string; error?: string } {
    this.output = [];
    this.returnValue = null;
    this.hasReturned = false;

    try {
      let lastResult: TauValue | null = null;
      
      for (const node of nodes) {
        lastResult = this.evaluateNode(node);
        if (this.hasReturned) {
          lastResult = this.returnValue;
          break;
        }
      }

      // If no explicit return, use the last evaluated expression result
      // This is useful for REPL-style expressions like "x + 5"
      if (this.returnValue === null && lastResult !== null) {
        // Only set result for expression statements (not statements that return null)
        const isExpressionStatement = nodes.length === 1 && 
          (nodes[0].type !== 'assignment' || (nodes[0] as AssignmentNode).isLet === false);
        
        if (isExpressionStatement) {
          this.returnValue = lastResult;
        }
      }

      // Handle null values - display them properly
      const finalResult = this.returnValue !== null ? this.returnValue : lastResult;
      
      return {
        result: finalResult,
        output: this.output.join('\n'),
        error: undefined
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        result: null,
        output: this.output.join('\n'),
        error: errorMessage
      };
    }
  }

  private evaluateNode(node: ASTNode): TauValue {
    switch (node.type) {
      case 'literal':
        return (node as LiteralNode).value;
      
      case 'variable':
        return this.getVariable((node as VariableNode).name);
      
      case 'binaryOp':
        return this.evaluateBinaryOp(node as BinaryOpNode);
      
      case 'unaryOp':
        return this.evaluateUnaryOp(node as UnaryOpNode);
      
      case 'assignment':
        return this.evaluateAssignment(node as AssignmentNode);
      
      case 'functionCall':
        return this.evaluateFunctionCall(node as FunctionCallNode);
      
      case 'functionDef':
        return this.evaluateFunctionDef(node as FunctionDefNode);
      
      case 'if':
        return this.evaluateIf(node as IfNode);
      
      case 'while':
        return this.evaluateWhile(node as WhileNode);
      
      case 'for':
        return this.evaluateFor(node as ForNode);
      
      case 'block':
        return this.evaluateBlock(node as BlockNode);
      
      case 'return':
        return this.evaluateReturn(node as ReturnNode);
      
      case 'array':
        return this.evaluateArray(node as ArrayNode);
      
      case 'map':
        return this.evaluateMap(node as MapNode);
      
      case 'index':
        return this.evaluateIndex(node as IndexNode);

      case 'structDef':
        return this.evaluateStructDef(node as StructDefNode);

      case 'enumDef':
        return this.evaluateEnumDef(node as EnumDefNode);

      case 'match':
        return this.evaluateMatch(node as MatchNode);

      case 'import':
        return this.evaluateImport(node as ImportNode);

      case 'structInstance':
        return this.evaluateStructInstance(node as StructInstanceNode);

      case 'memberAccess':
        return this.evaluateMemberAccess(node as MemberAccessNode);
      
      default:
        throw new Error(`Unknown node type: ${(node as any).type}`);
    }
  }

  private evaluateBinaryOp(node: BinaryOpNode): TauValue {
    const left = this.evaluateNode(node.left);
    const right = this.evaluateNode(node.right);

    switch (node.operator) {
      case '+':
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        return this.toNumber(left) + this.toNumber(right);
      
      case '-':
        return this.toNumber(left) - this.toNumber(right);
      
      case '*':
        return this.toNumber(left) * this.toNumber(right);
      
      case '/':
        const rightNum = this.toNumber(right);
        if (rightNum === 0) {
          throw new Error('Division by zero');
        }
        return this.toNumber(left) / rightNum;
      
      case '%':
        return this.toNumber(left) % this.toNumber(right);
      
      case '==':
        return this.isEqual(left, right);
      
      case '!=':
        return !this.isEqual(left, right);
      
      case '<':
        return this.toNumber(left) < this.toNumber(right);
      
      case '>':
        return this.toNumber(left) > this.toNumber(right);
      
      case '<=':
        return this.toNumber(left) <= this.toNumber(right);
      
      case '>=':
        return this.toNumber(left) >= this.toNumber(right);
      
      case '&&':
        return this.isTruthy(left) && this.isTruthy(right);
      
      case '||':
        return this.isTruthy(left) || this.isTruthy(right);
      
      default:
        throw new Error(`Unknown binary operator: ${node.operator}`);
    }
  }

  private evaluateUnaryOp(node: UnaryOpNode): TauValue {
    const operand = this.evaluateNode(node.operand);

    switch (node.operator) {
      case '-':
        return -this.toNumber(operand);
      
      case '!':
      case 'not':
        return !this.isTruthy(operand);
      
      default:
        throw new Error(`Unknown unary operator: ${node.operator}`);
    }
  }

  private evaluateAssignment(node: AssignmentNode): TauValue {
    const value = this.evaluateNode(node.value);
    this.setVariable(node.variable, value, node.isLet);
    // For REPL, show the assigned value
    if (node.isLet) {
      this.output.push(`Variable '${node.variable}' set to ${this.stringify(value)}`);
    }
    return value;
  }

  private evaluateFunctionCall(node: FunctionCallNode): TauValue {
    let funcName: string;
    if (typeof node.name === 'string') {
      funcName = node.name;
    } else if (node.name.type === 'variable') {
      funcName = (node.name as VariableNode).name;
    } else {
      throw new Error('Invalid function call');
    }

    const args = node.args.map(arg => this.evaluateNode(arg));

    // Check for built-in functions with JS implementation
    const func = this.environment.functions.get(funcName);
    if (func && func.jsImpl) {
      return func.jsImpl(args);
    }

    // Check for user-defined functions
    if (func) {
      const newEnv: Environment = {
        variables: new Map(),
        functions: new Map(),
        parent: this.environment
      };

      // Bind parameters
      for (let i = 0; i < func.params.length; i++) {
        const paramName = func.params[i];
        if (paramName === '...args') {
          // Variadic args
          newEnv.variables.set('args', args.slice(i));
          break;
        }
        newEnv.variables.set(paramName, args[i] || null);
      }

      const oldEnv = this.environment;
      this.environment = newEnv;
      
      try {
        for (const stmt of func.body) {
          this.evaluateNode(stmt);
          if (this.hasReturned) {
            break;
          }
        }
      } finally {
        this.environment = oldEnv;
      }

      return this.returnValue || null;
    }

    throw new Error(`Function '${funcName}' not found`);
  }

  private evaluateFunctionDef(node: FunctionDefNode): TauValue {
    const func: TauFunction = {
      type: 'function',
      params: node.params,
      body: node.body,
      closure: this.environment
    };

    this.environment.functions.set(node.name, func);
    // For REPL, show function definition confirmation
    this.output.push(`Function '${node.name}' defined`);
    return null;
  }

  private evaluateIf(node: IfNode): TauValue {
    const condition = this.evaluateNode(node.condition);
    
    if (this.isTruthy(condition)) {
      for (const stmt of node.then) {
        this.evaluateNode(stmt);
        if (this.hasReturned) {
          break;
        }
      }
    } else if (node.else) {
      for (const stmt of node.else) {
        this.evaluateNode(stmt);
        if (this.hasReturned) {
          break;
        }
      }
    }
    
    return null;
  }

  private evaluateWhile(node: WhileNode): TauValue {
    while (this.isTruthy(this.evaluateNode(node.condition))) {
      for (const stmt of node.body) {
        this.evaluateNode(stmt);
        if (this.hasReturned) {
          return null;
        }
      }
    }
    return null;
  }

  private evaluateFor(node: ForNode): TauValue {
    const iterable = this.evaluateNode(node.iterable);
    
    if (!Array.isArray(iterable)) {
      throw new Error('For loop requires an array');
    }

    for (const item of iterable as TauArray) {
      this.setVariable(node.variable, item, true);
      
      for (const stmt of node.body) {
        this.evaluateNode(stmt);
        if (this.hasReturned) {
          return null;
        }
      }
    }
    
    return null;
  }

  private evaluateBlock(node: BlockNode): TauValue {
    const newEnv: Environment = {
      variables: new Map(),
      functions: new Map(),
      parent: this.environment
    };

    const oldEnv = this.environment;
    this.environment = newEnv;
    
    try {
      for (const stmt of node.statements) {
        this.evaluateNode(stmt);
        if (this.hasReturned) {
          break;
        }
      }
    } finally {
      this.environment = oldEnv;
    }
    
    return null;
  }

  private evaluateReturn(node: ReturnNode): TauValue {
    this.returnValue = node.value ? this.evaluateNode(node.value) : null;
    this.hasReturned = true;
    return this.returnValue;
  }

  private evaluateArray(node: ArrayNode): TauArray {
    return node.elements.map(elem => this.evaluateNode(elem)) as TauArray;
  }

  private evaluateMap(node: MapNode): TauMap {
    const map = new Map<string, TauValue>();
    for (const entry of node.entries) {
      map.set(entry.key, this.evaluateNode(entry.value));
    }
    return map as TauMap;
  }

  private evaluateIndex(node: IndexNode): TauValue {
    const object = this.evaluateNode(node.object);
    const index = this.evaluateNode(node.index);

    if (Array.isArray(object)) {
      const idx = this.toNumber(index);
      if (idx < 0 || idx >= object.length) {
        throw new Error(`Array index ${idx} out of bounds`);
      }
      return object[idx];
    }

    if (object instanceof Map) {
      const key = typeof index === 'string' ? index : String(index);
      return object.get(key) || null;
    }

    throw new Error('Index operation only supported for arrays and maps');
  }

  private evaluateStructDef(node: StructDefNode): TauValue {
    this.structDefs.set(node.name, node);
    this.output.push(`Struct '${node.name}' defined`);
    return null;
  }

  private evaluateEnumDef(node: EnumDefNode): TauValue {
    this.enumDefs.set(node.name, node);
    this.environment.variables.set(node.name, { type: 'enumType', enumName: node.name, variant: '' } as TauEnumValue & { type: 'enumType' });
    this.output.push(`Enum '${node.name}' defined`);
    return null;
  }

  private evaluateStructInstance(node: StructInstanceNode): TauValue {
    const def = this.structDefs.get(node.name);
    const fields = new Map<string, TauValue>();
    if (def) {
      for (const f of def.fields) {
        fields.set(f.name, f.defaultValue ? this.evaluateNode(f.defaultValue) : null);
      }
    }
    for (const f of node.fields) {
      fields.set(f.name, this.evaluateNode(f.value));
    }
    return { type: 'struct', name: node.name, fields };
  }

  private evaluateMemberAccess(node: MemberAccessNode): TauValue {
    const object = this.evaluateNode(node.object);
    if (object && typeof object === 'object' && 'type' in object) {
      if ((object as { type: string }).type === 'enumType') {
        const enumName = (object as TauEnumValue).enumName;
        const enumDef = this.enumDefs.get(enumName);
        if (enumDef && enumDef.variants.includes(node.member)) {
          return { type: 'enum', enumName, variant: node.member };
        }
      }
      if (object.type === 'struct') {
        const s = object as TauStruct;
        if (!s.fields.has(node.member)) throw new Error(`Field '${node.member}' not found on struct '${s.name}'`);
        return s.fields.get(node.member)!;
      }
      if (object.type === 'enum') {
        const e = object as TauEnumValue;
        if (node.member === 'name') return e.variant;
        if (node.member === 'enum') return e.enumName;
      }
      if (object.type === 'result') {
        const r = object as TauResult;
        if (node.member === 'ok') return r.ok;
        if (node.member === 'value') return r.value;
      }
    }
    throw new Error(`Cannot access member '${node.member}'`);
  }

  private evaluateMatch(node: MatchNode): TauValue {
    const value = this.evaluateNode(node.expression);
    for (const arm of node.arms) {
      let matched = false;
      if (arm.pattern === '_' || arm.pattern === 'default') {
        matched = true;
      } else if (value && typeof value === 'object' && 'type' in value && value.type === 'result') {
        const r = value as TauResult;
        if (arm.pattern === 'ok' && r.ok) { matched = true; if (arm.param) this.setVariable(arm.param, r.value, true); }
        if (arm.pattern === 'err' && !r.ok) { matched = true; if (arm.param) this.setVariable(arm.param, r.value, true); }
      } else if (value && typeof value === 'object' && 'type' in value && value.type === 'enum') {
        const e = value as TauEnumValue;
        if (arm.pattern === e.variant) matched = true;
      } else if (arm.pattern === String(value)) {
        matched = true;
      }
      if (matched) {
        for (const stmt of arm.body) {
          const result = this.evaluateNode(stmt);
          if (this.hasReturned) return result;
        }
        return null;
      }
    }
    return null;
  }

  private evaluateImport(node: ImportNode): TauValue {
    const imported = importFromModule(node.module, node.names);
    imported.forEach((value, name) => {
      if (typeof value === 'object' && value !== null && 'type' in value && value.type === 'function') {
        this.environment.functions.set(name, value as TauFunction);
      } else {
        this.environment.variables.set(name, value as TauValue);
      }
    });
    this.output.push(`Imported { ${node.names.join(', ')} } from "${node.module}"`);
    return null;
  }

  // Helper methods
  private getVariable(name: string): TauValue {
    let env: Environment | undefined = this.environment;
    while (env) {
      if (env.variables.has(name)) {
        return env.variables.get(name)!;
      }
      env = env.parent;
    }
    throw new Error(`Variable '${name}' not found`);
  }

  private setVariable(name: string, value: TauValue, isLet: boolean): void {
    if (isLet) {
      // Check if variable already exists in current scope
      if (this.environment.variables.has(name)) {
        throw new Error(`Variable '${name}' already declared`);
      }
    }
    this.environment.variables.set(name, value);
  }

  private isTruthy(value: TauValue): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (value instanceof Map) return value.size > 0;
    return true;
  }

  private isEqual(a: TauValue, b: TauValue): boolean {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this.isEqual(a[i], b[i])) return false;
      }
      return true;
    }
    return false;
  }

  private toNumber(value: TauValue): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (isNaN(num)) {
        throw new Error(`Cannot convert '${value}' to number`);
      }
      return num;
    }
    if (typeof value === 'boolean') return value ? 1 : 0;
    throw new Error(`Cannot convert ${typeof value} to number`);
  }

  private stringify(value: TauValue): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (Array.isArray(value)) {
      return '[' + value.map(v => this.stringify(v)).join(', ') + ']';
    }
    if (value instanceof Map) {
      const entries: string[] = [];
      value.forEach((v, k) => {
        entries.push(`${k}: ${this.stringify(v)}`);
      });
      return '{' + entries.join(', ') + '}';
    }
    if (typeof value === 'object' && value !== null && 'type' in value) {
      if (value.type === 'struct') {
        const s = value as TauStruct;
        const fields = Array.from(s.fields.entries()).map(([k, v]) => `${k}: ${this.stringify(v)}`).join(', ');
        return `${s.name} { ${fields} }`;
      }
      if (value.type === 'enum') {
        const e = value as TauEnumValue;
        return `${e.enumName}.${e.variant}`;
      }
      if (value.type === 'result') {
        const r = value as TauResult;
        return r.ok ? `ok(${this.stringify(r.value)})` : `err(${this.stringify(r.value)})`;
      }
    }
    return String(value);
  }
}

