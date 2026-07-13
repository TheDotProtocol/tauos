import { NextRequest, NextResponse } from 'next/server';
import { Lexer } from '@/lib/tauscript/lexer';
import { Parser } from '@/lib/tauscript/parser';
import { Evaluator } from '@/lib/tauscript/evaluator';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'code string required' }, { status: 400 });
    }

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const evaluator = new Evaluator();
    const result = evaluator.evaluate(ast);

    return NextResponse.json({
      success: !result.error,
      output: result.output ? result.output.split('\n').filter((l) => l.length > 0) : [],
      value: result.result,
      error: result.error,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        output: [],
        error: error instanceof Error ? error.message : 'Execution failed',
      },
      { status: 500 }
    );
  }
}
