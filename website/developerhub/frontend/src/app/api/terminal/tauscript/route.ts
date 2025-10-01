import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface TauScriptRequest {
  code: string;
  sessionId?: string;
}

interface TauScriptResponse {
  success: boolean;
  output: string;
  error?: string;
  result?: any;
  executionTime: number;
}

// TauScript Interpreter (Simplified)
class TauScriptInterpreter {
  private variables: Map<string, any> = new Map();
  private functions: Map<string, Function> = new Map();

  constructor() {
    this.initializeBuiltins();
  }

  private initializeBuiltins() {
    // Built-in functions
    this.functions.set('print', (...args: any[]) => {
      return args.map(arg => this.stringify(arg)).join(' ');
    });

    this.functions.set('add', (a: number, b: number) => a + b);
    this.functions.set('subtract', (a: number, b: number) => a - b);
    this.functions.set('multiply', (a: number, b: number) => a * b);
    this.functions.set('divide', (a: number, b: number) => b !== 0 ? a / b : 'Error: Division by zero');

    this.functions.set('length', (arr: any[]) => Array.isArray(arr) ? arr.length : 'Error: Not an array');
    this.functions.set('first', (arr: any[]) => Array.isArray(arr) && arr.length > 0 ? arr[0] : 'Error: Empty array');
    this.functions.set('last', (arr: any[]) => Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : 'Error: Empty array');

    this.functions.set('is_empty', (arr: any[]) => Array.isArray(arr) ? arr.length === 0 : 'Error: Not an array');
    this.functions.set('contains', (arr: any[], item: any) => Array.isArray(arr) ? arr.includes(item) : 'Error: Not an array');

    this.functions.set('sort', (arr: any[]) => Array.isArray(arr) ? [...arr].sort() : 'Error: Not an array');
    this.functions.set('reverse', (arr: any[]) => Array.isArray(arr) ? [...arr].reverse() : 'Error: Not an array');

    this.functions.set('to_string', (value: any) => this.stringify(value));
    this.functions.set('to_number', (value: any) => {
      const num = parseFloat(value);
      return isNaN(num) ? 'Error: Cannot convert to number' : num;
    });

    this.functions.set('now', () => new Date().toISOString());
    this.functions.set('random', () => Math.random());
    this.functions.set('floor', (num: number) => Math.floor(num));
    this.functions.set('ceil', (num: number) => Math.ceil(num));
    this.functions.set('round', (num: number) => Math.round(num));

    this.functions.set('help', () => {
      return `TauScript Built-in Functions:
- print(...args): Print values
- add(a, b): Add two numbers
- subtract(a, b): Subtract two numbers
- multiply(a, b): Multiply two numbers
- divide(a, b): Divide two numbers
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
- random(): Get random number
- floor(num): Round down
- ceil(num): Round up
- round(num): Round to nearest
- help(): Show this help

Variables: Use 'let name = value' to create variables
Arrays: Use '[1, 2, 3]' to create arrays
Strings: Use 'hello world' or "hello world"`;
    });
  }

  private stringify(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (Array.isArray(value)) return `[${value.map(v => this.stringify(v)).join(', ')}]`;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private parseValue(token: string): any {
    // Numbers
    if (/^\d+\.?\d*$/.test(token)) {
      return parseFloat(token);
    }
    
    // Booleans
    if (token === 'true') return true;
    if (token === 'false') return false;
    
    // Null
    if (token === 'null') return null;
    
    // Strings (remove quotes)
    if ((token.startsWith('"') && token.endsWith('"')) || 
        (token.startsWith("'") && token.endsWith("'"))) {
      return token.slice(1, -1);
    }
    
    // Arrays
    if (token.startsWith('[') && token.endsWith(']')) {
      const content = token.slice(1, -1).trim();
      if (content === '') return [];
      return content.split(',').map(item => this.parseValue(item.trim()));
    }
    
    // Variables
    if (this.variables.has(token)) {
      return this.variables.get(token);
    }
    
    return token;
  }

  private tokenize(code: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      
      if (inString) {
        if (char === stringChar) {
          inString = false;
          tokens.push(current + char);
          current = '';
        } else {
          current += char;
        }
      } else if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
        current += char;
      } else if (char === ' ' || char === '\t' || char === '\n') {
        if (current.trim()) {
          tokens.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      tokens.push(current.trim());
    }
    
    return tokens;
  }

  execute(code: string): { output: string; result?: any; error?: string } {
    try {
      const tokens = this.tokenize(code.trim());
      
      if (tokens.length === 0) {
        return { output: '' };
      }

      // Variable assignment
      if (tokens[0] === 'let' && tokens.length >= 4 && tokens[2] === '=') {
        const varName = tokens[1];
        const value = this.parseValue(tokens.slice(3).join(' '));
        this.variables.set(varName, value);
        return { output: `Variable '${varName}' set to ${this.stringify(value)}` };
      }

      // Function call
      if (this.functions.has(tokens[0])) {
        const funcName = tokens[0];
        const args = tokens.slice(1).map(token => this.parseValue(token));
        
        try {
          const result = this.functions.get(funcName)!(...args);
          return { 
            output: this.stringify(result),
            result: result
          };
        } catch (error: any) {
          return { 
            output: '',
            error: `Error in ${funcName}: ${error.message}`
          };
        }
      }

      // Expression evaluation
      if (tokens.length === 1) {
        const value = this.parseValue(tokens[0]);
        return { 
          output: this.stringify(value),
          result: value
        };
      }

      // Multi-token expression
      const expression = tokens.join(' ');
      return { 
        output: `Expression: ${expression}`,
        error: 'Complex expressions not yet supported'
      };

    } catch (error: any) {
      return {
        output: '',
        error: `Parse error: ${error.message}`
      };
    }
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: TauScriptRequest = await request.json();
    const { code, sessionId } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({
        success: false,
        output: '',
        error: 'Code is required',
        executionTime: 0
      } as TauScriptResponse);
    }

    const interpreter = new TauScriptInterpreter();
    const { output, result, error } = interpreter.execute(code);
    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: !error,
      output: output || '',
      error: error,
      result: result,
      executionTime
    } as TauScriptResponse);

  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      output: '',
      error: error.message || 'TauScript execution failed',
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
