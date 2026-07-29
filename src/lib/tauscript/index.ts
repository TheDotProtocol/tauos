import { Lexer, TokenType } from './lexer';
import { Parser } from './parser';
import { Evaluator } from './evaluator';

export { Lexer, TokenType } from './lexer';
export { Evaluator } from './evaluator';
export type { ASTNode, TauValue, TauFunction, Environment } from './ast';
export { compile, compileFile } from './compiler/pipeline';
export type { CompileResult, CompileOptions } from './compiler/pipeline';
export { analyzeSemantics } from './compiler/semantic';
export type { Diagnostic, DiagnosticSeverity } from './compiler/diagnostics';
export { format } from './formatter';
export { lint, aiCodeReview } from './linter';
export { runTests, discoverTests } from './test-runner';
export { generateDocs, generatePackageDocs } from './docgen';
export { TauDebugger } from './debugger';
export { handleLSPRequest, getCompletions, getDiagnostics, getHover } from './lsp/server';
export { listModules, getModule, STD_MODULE_DOCS } from './stdlib';

export const TAUSCRIPT_VERSION = '1.0.0';

export function run(source: string) {
  const lexer = new Lexer(source);
  const ast = new Parser(lexer.tokenize()).parse();
  const evaluator = new Evaluator();
  return evaluator.evaluate(ast);
}
