import { Lexer } from './lexer';
import { Parser } from './parser';
import { Evaluator } from './evaluator';
import type { ASTNode } from './ast';

export type Breakpoint = { line: number; enabled: boolean; condition?: string };
export type WatchExpression = { expr: string; value?: string };
export type StackFrame = { name: string; line: number };

export type DebuggerState = {
  running: boolean;
  paused: boolean;
  currentLine: number;
  breakpoints: Breakpoint[];
  watches: WatchExpression[];
  callStack: StackFrame[];
  variables: Record<string, string>;
  output: string[];
};

export class TauDebugger {
  private source: string;
  private ast: ASTNode[] = [];
  private evaluator: Evaluator;
  private state: DebuggerState;
  private lineMap: Map<number, ASTNode[]> = new Map();

  constructor(source: string) {
    this.source = source;
    this.evaluator = new Evaluator();
    this.state = {
      running: false,
      paused: false,
      currentLine: 1,
      breakpoints: [],
      watches: [],
      callStack: [],
      variables: {},
      output: [],
    };
    this.parse();
  }

  private parse() {
    const lexer = new Lexer(this.source);
    const parser = new Parser(lexer.tokenize());
    this.ast = parser.parse();
    this.ast.forEach((node) => {
      const line = node.line ?? 1;
      const existing = this.lineMap.get(line) ?? [];
      existing.push(node);
      this.lineMap.set(line, existing);
    });
  }

  getState(): DebuggerState {
    return { ...this.state };
  }

  setBreakpoint(line: number, condition?: string) {
    const existing = this.state.breakpoints.find((b) => b.line === line);
    if (existing) {
      existing.enabled = true;
      existing.condition = condition;
    } else {
      this.state.breakpoints.push({ line, enabled: true, condition });
    }
  }

  removeBreakpoint(line: number) {
    this.state.breakpoints = this.state.breakpoints.filter((b) => b.line !== line);
  }

  addWatch(expr: string) {
    this.state.watches.push({ expr });
  }

  async start() {
    this.state.running = true;
    this.state.paused = false;
    this.state.currentLine = 1;
    return this.runToEnd();
  }

  private checkBreakpoint(line: number): boolean {
    const bp = this.state.breakpoints.find((b) => b.line === line && b.enabled);
    if (!bp) return false;
    this.state.paused = true;
    this.state.currentLine = line;
    return true;
  }

  async stepOver() {
    this.state.paused = false;
    const nextLine = this.state.currentLine + 1;
    if (this.checkBreakpoint(nextLine)) return this.getState();
    this.state.currentLine = nextLine;
    if (nextLine > this.source.split('\n').length) {
      return this.runToEnd();
    }
    this.state.paused = true;
    return this.getState();
  }

  async stepInto() {
    this.state.callStack.push({ name: 'main', line: this.state.currentLine });
    return this.stepOver();
  }

  async stepOut() {
    if (this.state.callStack.length) this.state.callStack.pop();
    return this.stepOver();
  }

  continue() {
    this.state.paused = false;
    return this.runToEnd();
  }

  private runToEnd() {
    try {
      const result = this.evaluator.evaluate(this.ast);
      this.state.output = result.output ? result.output.split('\n') : [];
      this.state.running = false;
      this.state.paused = false;
      if (result.error) {
        this.state.output.push(`Error: ${result.error}`);
      }
    } catch (e) {
      this.state.output.push(e instanceof Error ? e.message : 'Debug error');
      this.state.running = false;
    }
    return this.getState();
  }

  inspectVariable(name: string): string | undefined {
    return this.state.variables[name];
  }
}
