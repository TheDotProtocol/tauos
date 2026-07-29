/**
 * TauScript AST (Abstract Syntax Tree) Types
 */

export type TauValue = number | string | boolean | null | TauArray | TauMap | TauFunction | TauStruct | TauEnumValue | TauResult;

export interface TauStruct {
  type: 'struct';
  name: string;
  fields: Map<string, TauValue>;
}

export interface TauEnumValue {
  type: 'enum';
  enumName: string;
  variant: string;
  payload?: TauValue;
}

export interface TauResult {
  type: 'result';
  ok: boolean;
  value: TauValue;
}

export interface TauArray extends Array<TauValue> {
  // Extended array with TauScript-specific methods
}

export interface TauMap extends Map<string, TauValue> {
  // Map type for key-value pairs
}

export interface TauFunction {
  type: 'function';
  params: string[];
  body: ASTNode[];
  closure?: Environment;
  jsImpl?: (args: TauValue[]) => TauValue;
}

export type Result<T, E = string> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface Environment {
  variables: Map<string, TauValue>;
  functions: Map<string, TauFunction>;
  parent?: Environment;
}

// AST Node Types
export type ASTNode =
  | LiteralNode
  | VariableNode
  | BinaryOpNode
  | UnaryOpNode
  | AssignmentNode
  | FunctionCallNode
  | FunctionDefNode
  | IfNode
  | WhileNode
  | ForNode
  | BlockNode
  | ReturnNode
  | ArrayNode
  | MapNode
  | IndexNode
  | StructDefNode
  | EnumDefNode
  | MatchNode
  | ImportNode
  | StructInstanceNode
  | MemberAccessNode
  | TraitDefNode
  | InterfaceDefNode
  | AwaitNode;

export interface LiteralNode {
  type: 'literal';
  value: TauValue;
  line?: number;
  column?: number;
}

export interface VariableNode {
  type: 'variable';
  name: string;
  line?: number;
  column?: number;
}

export interface BinaryOpNode {
  type: 'binaryOp';
  operator: '+' | '-' | '*' | '/' | '%' | '==' | '!=' | '<' | '>' | '<=' | '>=' | '&&' | '||';
  left: ASTNode;
  right: ASTNode;
  line?: number;
  column?: number;
}

export interface UnaryOpNode {
  type: 'unaryOp';
  operator: '-' | '!' | 'not';
  operand: ASTNode;
  line?: number;
  column?: number;
}

export interface AssignmentNode {
  type: 'assignment';
  variable: string;
  value: ASTNode;
  isLet: boolean; // 'let' vs regular assignment
  line?: number;
  column?: number;
}

export interface FunctionCallNode {
  type: 'functionCall';
  name: string | ASTNode; // Can be a function reference or name
  args: ASTNode[];
  line?: number;
  column?: number;
}

export interface FunctionDefNode {
  type: 'functionDef';
  name: string;
  params: string[];
  body: ASTNode[];
  async?: boolean;
  typeParams?: string[];
  line?: number;
  column?: number;
}

export interface IfNode {
  type: 'if';
  condition: ASTNode;
  then: ASTNode[];
  else?: ASTNode[];
  line?: number;
  column?: number;
}

export interface WhileNode {
  type: 'while';
  condition: ASTNode;
  body: ASTNode[];
  line?: number;
  column?: number;
}

export interface ForNode {
  type: 'for';
  variable: string;
  iterable: ASTNode;
  body: ASTNode[];
  line?: number;
  column?: number;
}

export interface BlockNode {
  type: 'block';
  statements: ASTNode[];
  line?: number;
  column?: number;
}

export interface ReturnNode {
  type: 'return';
  value?: ASTNode;
  line?: number;
  column?: number;
}

export interface ArrayNode {
  type: 'array';
  elements: ASTNode[];
  line?: number;
  column?: number;
}

export interface MapNode {
  type: 'map';
  entries: Array<{ key: string; value: ASTNode }>;
  line?: number;
  column?: number;
}

export interface IndexNode {
  type: 'index';
  object: ASTNode;
  index: ASTNode;
  line?: number;
  column?: number;
}

export interface StructDefNode {
  type: 'structDef';
  name: string;
  fields: Array<{ name: string; defaultValue?: ASTNode }>;
  line?: number;
  column?: number;
}

export interface EnumDefNode {
  type: 'enumDef';
  name: string;
  variants: string[];
  line?: number;
  column?: number;
}

export interface MatchNode {
  type: 'match';
  expression: ASTNode;
  arms: Array<{ pattern: string; param?: string; body: ASTNode[] }>;
  line?: number;
  column?: number;
}

export interface ImportNode {
  type: 'import';
  names: string[];
  module: string;
  alias?: string;
  line?: number;
  column?: number;
}

export interface StructInstanceNode {
  type: 'structInstance';
  name: string;
  fields: Array<{ name: string; value: ASTNode }>;
  line?: number;
  column?: number;
}

export interface MemberAccessNode {
  type: 'memberAccess';
  object: ASTNode;
  member: string;
  line?: number;
  column?: number;
}

export interface TraitDefNode {
  type: 'traitDef';
  name: string;
  methods: Array<{ name: string; params: string[] }>;
  line?: number;
  column?: number;
}

export interface InterfaceDefNode {
  type: 'interfaceDef';
  name: string;
  methods: Array<{ name: string; params: string[] }>;
  line?: number;
  column?: number;
}

export interface AwaitNode {
  type: 'await';
  expression: ASTNode;
  line?: number;
  column?: number;
}

