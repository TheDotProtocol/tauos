import { NextRequest, NextResponse } from 'next/server';
import { Lexer } from '@/lib/tauscript/lexer';
import { Parser } from '@/lib/tauscript/parser';
import { Evaluator } from '@/lib/tauscript/evaluator';
import { withTauScriptGuard } from '@/lib/tau-ide/server/route-guard';

export const POST = withTauScriptGuard(async (_request, body) => {
  const { code } = body;
  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'code string required' }, { status: 400 });
  }
  if (code.length > 100_000) {
    return NextResponse.json({ error: 'Code exceeds maximum size (100KB)' }, { status: 413 });
  }

  try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parseStrict();
    const evaluator = new Evaluator();
    const result = evaluator.evaluate(ast);

    return NextResponse.json({
      success: !result.error,
      output: result.output ? result.output.split('\n').filter((l) => l.length > 0) : [],
      value: result.result,
      error: result.error,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Parse failed';
    return NextResponse.json({ error: message, output: [] }, { status: 400 });
  }
}, 'tauscript.run');
