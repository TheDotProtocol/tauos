import { NextRequest, NextResponse } from 'next/server';
import { Lexer } from '@/lib/tauscript/lexer';
import { Parser } from '@/lib/tauscript/parser';
import { Evaluator } from '@/lib/tauscript/evaluator';
import { sessionService } from '@/lib/session';
import type { Environment, TauValue } from '@/lib/tauscript/ast';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

interface TauScriptRequest {
  code: string;
  sessionId?: string;
}

interface TauScriptResponse {
  success: boolean;
  output: string;
  error?: string;
  result?: unknown;
  executionTime: number;
}

// Session-based interpreter storage (in-memory for now, will persist to Redis)
const interpreters = new Map<string, Evaluator>();

function getInterpreter(sessionId: string): Evaluator {
  if (!interpreters.has(sessionId)) {
    // Try to restore from session
    // For now, create new interpreter
    // TODO: Restore environment from session.replContext when Redis persistence is fully implemented
    interpreters.set(sessionId, new Evaluator());
  }
  return interpreters.get(sessionId)!;
}

function saveInterpreterState(sessionId: string, evaluator: Evaluator): void {
  // Save environment state to session
  // This would be called after each execution
  // TODO: Implement session persistence for REPL context
}

function stringifyValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (Array.isArray(value)) {
    return '[' + value.map(v => stringifyValue(v)).join(', ') + ']';
  }
  if (value instanceof Map) {
    const entries: string[] = [];
    value.forEach((v, k) => {
      entries.push(`${k}: ${stringifyValue(v)}`);
    });
    return '{' + entries.join(', ') + '}';
  }
  return String(value);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: TauScriptRequest = await request.json();
    let { code, sessionId } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({
        success: false,
        output: '',
        error: 'Code is required',
        executionTime: 0
      } as TauScriptResponse);
    }

    // Generate session ID if not provided
    if (!sessionId) {
      sessionId = randomBytes(16).toString('hex');
    }

    // Get or create interpreter for this session
    const evaluator = getInterpreter(sessionId);

    try {
      // Lex and parse
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      
      const parser = new Parser(tokens);
      const ast = parser.parse();

      // Evaluate
      const { result, output, error } = evaluator.evaluate(ast);

      // Save interpreter state
      saveInterpreterState(sessionId, evaluator);

      const executionTime = Date.now() - startTime;

      // Combine output and result for REPL-style display
      let finalOutput = output || '';
      if ((result !== null && result !== undefined) || result === null) {
        if (!error) {
          // If output is empty or result is different from output, append result
          const resultStr = stringifyValue(result);
          if (!finalOutput || finalOutput !== resultStr) {
            if (finalOutput) {
              finalOutput += '\n' + resultStr;
            } else {
              finalOutput = resultStr;
            }
          }
        }
      }

      return NextResponse.json({
        success: !error,
        output: finalOutput,
        error: error,
        result: result,
        executionTime,
        sessionId
      } as TauScriptResponse & { sessionId?: string });

    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
      const executionTime = Date.now() - startTime;
      
      return NextResponse.json({
        success: false,
        output: '',
        error: `Parse error: ${errorMessage}`,
        executionTime
      } as TauScriptResponse);
    }

  } catch (error: unknown) {
    const executionTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'TauScript execution failed';
    
    return NextResponse.json({
      success: false,
      output: '',
      error: errorMessage,
      executionTime
    } as TauScriptResponse);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
