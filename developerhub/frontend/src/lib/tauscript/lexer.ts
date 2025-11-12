/**
 * TauScript Lexer (Tokenizer)
 * Converts source code into tokens
 */

export enum TokenType {
  // Literals
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
  
  // Identifiers
  IDENTIFIER = 'IDENTIFIER',
  
  // Keywords
  LET = 'LET',
  CONST = 'CONST',
  FUNCTION = 'FUNCTION',
  FN = 'FN',
  IF = 'IF',
  ELSE = 'ELSE',
  WHILE = 'WHILE',
  FOR = 'FOR',
  RETURN = 'RETURN',
  MATCH = 'MATCH',
  OK = 'OK',
  ERR = 'ERR',
  RESULT = 'RESULT',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NULL_KW = 'NULL_KW',
  
  // Operators
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  MODULO = 'MODULO',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  LESS = 'LESS',
  GREATER = 'GREATER',
  LESS_EQUAL = 'LESS_EQUAL',
  GREATER_EQUAL = 'GREATER_EQUAL',
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  ASSIGN = 'ASSIGN',
  
  // Punctuation
  SEMICOLON = 'SEMICOLON',
  COMMA = 'COMMA',
  DOT = 'DOT',
  COLON = 'COLON',
  QUESTION = 'QUESTION',
  ARROW = 'ARROW',
  
  // Brackets
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  LEFT_BRACKET = 'LEFT_BRACKET',
  RIGHT_BRACKET = 'RIGHT_BRACKET',
  
  // Special
  EOF = 'EOF',
  NEWLINE = 'NEWLINE'
}

export interface Token {
  type: TokenType;
  value: string | number | boolean | null;
  line: number;
  column: number;
}

const KEYWORDS: Record<string, TokenType> = {
  'let': TokenType.LET,
  'const': TokenType.CONST,
  'function': TokenType.FUNCTION,
  'fn': TokenType.FN,
  'if': TokenType.IF,
  'else': TokenType.ELSE,
  'while': TokenType.WHILE,
  'for': TokenType.FOR,
  'return': TokenType.RETURN,
  'match': TokenType.MATCH,
  'ok': TokenType.OK,
  'err': TokenType.ERR,
  'result': TokenType.RESULT,
  'true': TokenType.TRUE,
  'false': TokenType.FALSE,
  'null': TokenType.NULL_KW,
};

export class Lexer {
  private source: string;
  private current: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (!this.isAtEnd()) {
      this.skipWhitespace();
      if (this.isAtEnd()) break;
      
      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }
    
    tokens.push({
      type: TokenType.EOF,
      value: null,
      line: this.line,
      column: this.column
    });
    
    return tokens;
  }

  private nextToken(): Token | null {
    const start = this.current;
    const line = this.line;
    const column = this.column;
    const char = this.advance();

    // Single character tokens
    switch (char) {
      case '(': return this.makeToken(TokenType.LEFT_PAREN, char, line, column);
      case ')': return this.makeToken(TokenType.RIGHT_PAREN, char, line, column);
      case '{': return this.makeToken(TokenType.LEFT_BRACE, char, line, column);
      case '}': return this.makeToken(TokenType.RIGHT_BRACE, char, line, column);
      case '[': return this.makeToken(TokenType.LEFT_BRACKET, char, line, column);
      case ']': return this.makeToken(TokenType.RIGHT_BRACKET, char, line, column);
      case ',': return this.makeToken(TokenType.COMMA, char, line, column);
      case ';': return this.makeToken(TokenType.SEMICOLON, char, line, column);
      case '.': return this.makeToken(TokenType.DOT, char, line, column);
      case ':': return this.makeToken(TokenType.COLON, char, line, column);
      case '?': return this.makeToken(TokenType.QUESTION, char, line, column);
      case '+': return this.makeToken(TokenType.PLUS, char, line, column);
      case '-':
        if (this.peek() === '>') {
          this.advance();
          return this.makeToken(TokenType.ARROW, '->', line, column);
        }
        return this.makeToken(TokenType.MINUS, char, line, column);
      case '*': return this.makeToken(TokenType.MULTIPLY, char, line, column);
      case '/':
        if (this.peek() === '/') {
          // Single line comment
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
          return null;
        }
        if (this.peek() === '*') {
          // Multi-line comment
          this.advance(); // consume '*'
          while (!this.isAtEnd()) {
            if (this.peek() === '*' && this.peekNext() === '/') {
              this.advance(); // consume '*'
              this.advance(); // consume '/'
              return null;
            }
            if (this.peek() === '\n') {
              this.line++;
              this.column = 1;
            } else {
              this.column++;
            }
            this.advance();
          }
          return null;
        }
        return this.makeToken(TokenType.DIVIDE, char, line, column);
      case '%': return this.makeToken(TokenType.MODULO, char, line, column);
      case '=':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.EQUAL, '==', line, column);
        }
        return this.makeToken(TokenType.ASSIGN, char, line, column);
      case '!':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.NOT_EQUAL, '!=', line, column);
        }
        return this.makeToken(TokenType.NOT, char, line, column);
      case '<':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.LESS_EQUAL, '<=', line, column);
        }
        return this.makeToken(TokenType.LESS, char, line, column);
      case '>':
        if (this.peek() === '=') {
          this.advance();
          return this.makeToken(TokenType.GREATER_EQUAL, '>=', line, column);
        }
        return this.makeToken(TokenType.GREATER, char, line, column);
      case '&':
        if (this.peek() === '&') {
          this.advance();
          return this.makeToken(TokenType.AND, '&&', line, column);
        }
        break;
      case '|':
        if (this.peek() === '|') {
          this.advance();
          return this.makeToken(TokenType.OR, '||', line, column);
        }
        break;
      case '"':
      case "'":
        return this.string(char, line, column);
    }

    // Numbers
    if (this.isDigit(char)) {
      return this.number(char, line, column);
    }

    // Identifiers and keywords
    if (this.isAlpha(char)) {
      return this.identifier(char, line, column);
    }

    // Unknown character
    return null;
  }

  private string(quote: string, line: number, column: number): Token {
    let value = '';
    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      
      if (this.peek() === '\\') {
        this.advance();
        const next = this.peek();
        switch (next) {
          case 'n': value += '\n'; break;
          case 't': value += '\t'; break;
          case 'r': value += '\r'; break;
          case '\\': value += '\\'; break;
          case quote: value += quote; break;
          default: value += next; break;
        }
        this.advance();
      } else {
        value += this.advance();
      }
    }

    if (this.isAtEnd()) {
      throw new Error(`Unterminated string at line ${line}, column ${column}`);
    }

    this.advance(); // consume closing quote
    return this.makeToken(TokenType.STRING, value, line, column);
  }

  private number(firstChar: string, line: number, column: number): Token {
    let value = firstChar;
    
    while (this.isDigit(this.peek())) {
      value += this.advance();
    }
    
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      value += this.advance(); // consume '.'
      while (this.isDigit(this.peek())) {
        value += this.advance();
      }
    }
    
    const numValue = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
    return this.makeToken(TokenType.NUMBER, numValue, line, column);
  }

  private identifier(firstChar: string, line: number, column: number): Token {
    let value = firstChar;
    
    while (this.isAlphaNumeric(this.peek())) {
      value += this.advance();
    }
    
    const keyword = KEYWORDS[value.toLowerCase()];
    if (keyword) {
      if (keyword === TokenType.TRUE) {
        return this.makeToken(TokenType.BOOLEAN, true, line, column);
      }
      if (keyword === TokenType.FALSE) {
        return this.makeToken(TokenType.BOOLEAN, false, line, column);
      }
      if (keyword === TokenType.NULL_KW) {
        return this.makeToken(TokenType.NULL, null, line, column);
      }
      return this.makeToken(keyword, value, line, column);
    }
    
    return this.makeToken(TokenType.IDENTIFIER, value, line, column);
  }

  private skipWhitespace(): void {
    while (!this.isAtEnd()) {
      const char = this.peek();
      if (char === ' ' || char === '\r' || char === '\t') {
        this.advance();
      } else if (char === '\n') {
        this.line++;
        this.column = 1;
        this.advance();
      } else {
        break;
      }
    }
  }

  private advance(): string {
    if (!this.isAtEnd()) {
      this.column++;
    }
    return this.source[this.current++];
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source[this.current];
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source[this.current + 1];
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_';
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private makeToken(type: TokenType, value: string | number | boolean | null, line: number, column: number): Token {
    return { type, value, line, column };
  }
}

