/**
 * TauScript Parser
 * Converts tokens into an Abstract Syntax Tree (AST)
 */

import { Token, TokenType } from './lexer';
import type { ASTNode, LiteralNode, VariableNode, BinaryOpNode, UnaryOpNode, AssignmentNode, FunctionCallNode, FunctionDefNode, IfNode, WhileNode, ForNode, BlockNode, ReturnNode, ArrayNode, MapNode, IndexNode, StructDefNode, EnumDefNode, MatchNode, ImportNode, StructInstanceNode, MemberAccessNode, TraitDefNode, InterfaceDefNode, AwaitNode } from './ast';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ASTNode[] {
    const statements: ASTNode[] = [];
    
    while (!this.isAtEnd()) {
      try {
        const stmt = this.parseStatement();
        if (stmt) {
          statements.push(stmt);
        }
      } catch (error) {
        console.error('Parse error:', error);
        this.synchronize();
      }
    }
    
    return statements;
  }

  private parseStatement(): ASTNode | null {
    if (this.match(TokenType.IMPORT)) {
      return this.parseImport();
    }
    if (this.match(TokenType.TRAIT)) {
      return this.parseTraitDef();
    }
    if (this.match(TokenType.INTERFACE)) {
      return this.parseInterfaceDef();
    }
    if (this.match(TokenType.STRUCT)) {
      return this.parseStructDef();
    }
    if (this.match(TokenType.ENUM)) {
      return this.parseEnumDef();
    }
    if (this.match(TokenType.MATCH)) {
      return this.parseMatch();
    }
    if (this.match(TokenType.LET, TokenType.CONST)) {
      return this.parseVariableDeclaration();
    }
    if (this.match(TokenType.FUNCTION, TokenType.FN, TokenType.ASYNC)) {
      const isAsync = this.previous().type === TokenType.ASYNC;
      if (isAsync) this.consume(TokenType.FN, 'Expected "fn" after async');
      return this.parseFunctionDeclaration(isAsync);
    }
    if (this.match(TokenType.IF)) {
      return this.parseIfStatement();
    }
    if (this.match(TokenType.WHILE)) {
      return this.parseWhileStatement();
    }
    if (this.match(TokenType.FOR)) {
      return this.parseForStatement();
    }
    if (this.match(TokenType.RETURN)) {
      return this.parseReturnStatement();
    }
    if (this.match(TokenType.LEFT_BRACE)) {
      return this.parseBlock();
    }
    
    return this.parseExpressionStatement();
  }

  private parseImport(): ImportNode {
    this.consume(TokenType.LEFT_BRACE, 'Expected "{" after import');
    const names: string[] = [];
    do {
      this.consume(TokenType.IDENTIFIER, 'Expected import name');
      names.push(this.previous().value as string);
    } while (this.match(TokenType.COMMA));
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after import names');
    this.consume(TokenType.FROM, 'Expected "from" after import names');
    const moduleToken = this.consume(TokenType.STRING, 'Expected module path string');
    let alias: string | undefined;
    if (this.match(TokenType.AS)) {
      this.consume(TokenType.IDENTIFIER, 'Expected alias name');
      alias = this.previous().value as string;
    }
    return { type: 'import', names, module: moduleToken.value as string, alias };
  }

  private parseStructDef(): StructDefNode {
    this.consume(TokenType.IDENTIFIER, 'Expected struct name');
    const name = this.previous().value as string;
    this.consume(TokenType.LEFT_BRACE, 'Expected "{" after struct name');
    const fields: Array<{ name: string; defaultValue?: ASTNode }> = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      this.consume(TokenType.IDENTIFIER, 'Expected field name');
      const fieldName = this.previous().value as string;
      let defaultValue: ASTNode | undefined;
      if (this.match(TokenType.COLON)) {
        defaultValue = this.parseExpression();
      }
      fields.push({ name: fieldName, defaultValue });
      this.match(TokenType.COMMA);
    }
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after struct fields');
    return { type: 'structDef', name, fields };
  }

  private parseEnumDef(): EnumDefNode {
    this.consume(TokenType.IDENTIFIER, 'Expected enum name');
    const name = this.previous().value as string;
    this.consume(TokenType.LEFT_BRACE, 'Expected "{" after enum name');
    const variants: string[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      this.consume(TokenType.IDENTIFIER, 'Expected variant name');
      variants.push(this.previous().value as string);
      this.match(TokenType.COMMA);
    }
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after enum variants');
    return { type: 'enumDef', name, variants };
  }

  private parseMatch(): MatchNode {
    const expression = this.parseExpression();
    this.consume(TokenType.LEFT_BRACE, 'Expected "{" after match expression');
    const arms: Array<{ pattern: string; param?: string; body: ASTNode[] }> = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      this.consume(TokenType.IDENTIFIER, 'Expected pattern');
      const pattern = this.previous().value as string;
      let param: string | undefined;
      if (this.match(TokenType.LEFT_PAREN)) {
        this.consume(TokenType.IDENTIFIER, 'Expected param name');
        param = this.previous().value as string;
        this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after param');
      }
      this.consume(TokenType.FAT_ARROW, 'Expected "=>" after pattern');
      const body: ASTNode[] = [];
      if (this.match(TokenType.LEFT_BRACE)) {
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
          const stmt = this.parseStatement();
          if (stmt) body.push(stmt);
        }
        this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after match arm');
      } else {
        const stmt = this.parseStatement();
        if (stmt) body.push(stmt);
      }
      arms.push({ pattern, param, body });
      this.match(TokenType.COMMA);
    }
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after match arms');
    return { type: 'match', expression, arms };
  }

  private parseVariableDeclaration(): AssignmentNode {
    const isLet = this.previous().type === TokenType.LET;
    this.consume(TokenType.IDENTIFIER, 'Expected variable name');
    const name = this.previous().value as string;
    
    let value: ASTNode | null = null;
    if (this.match(TokenType.ASSIGN)) {
      value = this.parseExpression();
    }
    
    if (this.match(TokenType.SEMICOLON)) {
      // Optional semicolon
    }
    
    return {
      type: 'assignment',
      variable: name,
      value: value || { type: 'literal', value: null },
      isLet
    };
  }

  private parseTraitDef(): TraitDefNode {
    this.consume(TokenType.IDENTIFIER, 'Expected trait name');
    const name = this.previous().value as string;
    this.consume(TokenType.LEFT_BRACE, 'Expected "{" after trait name');
    const methods: Array<{ name: string; params: string[] }> = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      this.consume(TokenType.FN, 'Expected method signature');
      this.consume(TokenType.IDENTIFIER, 'Expected method name');
      const methodName = this.previous().value as string;
      this.consume(TokenType.LEFT_PAREN, 'Expected "("');
      const params: string[] = [];
      if (!this.check(TokenType.RIGHT_PAREN)) {
        do {
          this.consume(TokenType.IDENTIFIER, 'Expected param');
          params.push(this.previous().value as string);
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")"');
      this.match(TokenType.SEMICOLON);
      methods.push({ name: methodName, params });
    }
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
    return { type: 'traitDef', name, methods };
  }

  private parseInterfaceDef(): InterfaceDefNode {
    this.consume(TokenType.IDENTIFIER, 'Expected interface name');
    const name = this.previous().value as string;
    this.consume(TokenType.LEFT_BRACE, 'Expected "{" after interface name');
    const methods: Array<{ name: string; params: string[] }> = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      this.consume(TokenType.FN, 'Expected method signature');
      this.consume(TokenType.IDENTIFIER, 'Expected method name');
      const methodName = this.previous().value as string;
      this.consume(TokenType.LEFT_PAREN, 'Expected "("');
      const params: string[] = [];
      if (!this.check(TokenType.RIGHT_PAREN)) {
        do {
          this.consume(TokenType.IDENTIFIER, 'Expected param');
          params.push(this.previous().value as string);
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")"');
      this.match(TokenType.SEMICOLON);
      methods.push({ name: methodName, params });
    }
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}"');
    return { type: 'interfaceDef', name, methods };
  }

  private parseFunctionDeclaration(isAsync = false): FunctionDefNode {
    this.consume(TokenType.IDENTIFIER, 'Expected function name');
    const name = this.previous().value as string;

    let typeParams: string[] | undefined;
    if (this.match(TokenType.LESS)) {
      typeParams = [];
      do {
        this.consume(TokenType.IDENTIFIER, 'Expected type parameter');
        typeParams.push(this.previous().value as string);
      } while (this.match(TokenType.COMMA));
      this.consume(TokenType.GREATER, 'Expected ">" after type parameters');
    }

    this.consume(TokenType.LEFT_PAREN, 'Expected "(" after function name');
    const params: string[] = [];
    
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (params.length >= 255) {
          throw new Error('Cannot have more than 255 parameters');
        }
        this.consume(TokenType.IDENTIFIER, 'Expected parameter name');
        params.push(this.previous().value as string);
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after parameters');
    this.consume(TokenType.LEFT_BRACE, 'Expected "{" before function body');
    
    const body: ASTNode[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
    }
    
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after function body');
    
    return {
      type: 'functionDef',
      name,
      params,
      body,
      async: isAsync,
      typeParams,
    };
  }

  private parseIfStatement(): IfNode {
    this.consume(TokenType.LEFT_PAREN, 'Expected "(" after "if"');
    const condition = this.parseExpression();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after condition');
    
    const thenBranch: ASTNode[] = [];
    if (this.match(TokenType.LEFT_BRACE)) {
      while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
        const stmt = this.parseStatement();
        if (stmt) {
          thenBranch.push(stmt);
        }
      }
      this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after if block');
    } else {
      // Single statement
      const stmt = this.parseStatement();
      if (stmt) {
        thenBranch.push(stmt);
      }
    }
    
    let elseBranch: ASTNode[] | undefined;
    if (this.match(TokenType.ELSE)) {
      elseBranch = [];
      if (this.match(TokenType.LEFT_BRACE)) {
        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
          const stmt = this.parseStatement();
          if (stmt) {
            elseBranch.push(stmt);
          }
        }
        this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after else block');
      } else {
        const stmt = this.parseStatement();
        if (stmt) {
          elseBranch.push(stmt);
        }
      }
    }
    
    return {
      type: 'if',
      condition,
      then: thenBranch,
      else: elseBranch
    };
  }

  private parseWhileStatement(): WhileNode {
    this.consume(TokenType.LEFT_PAREN, 'Expected "(" after "while"');
    const condition = this.parseExpression();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after condition');
    
    const body: ASTNode[] = [];
    if (this.match(TokenType.LEFT_BRACE)) {
      while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
        const stmt = this.parseStatement();
        if (stmt) {
          body.push(stmt);
        }
      }
      this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after while block');
    } else {
      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
    }
    
    return {
      type: 'while',
      condition,
      body
    };
  }

  private parseForStatement(): ForNode {
    this.consume(TokenType.LEFT_PAREN, 'Expected "(" after "for"');
    
    let variable: string;
    if (this.match(TokenType.LET)) {
      this.consume(TokenType.IDENTIFIER, 'Expected variable name');
      variable = this.previous().value as string;
    } else {
      this.consume(TokenType.IDENTIFIER, 'Expected variable name');
      variable = this.previous().value as string;
    }
    
    this.consume(TokenType.IDENTIFIER, 'Expected "in" after variable');
    if (this.previous().value !== 'in') {
      throw new Error('Expected "in" after variable');
    }
    
    const iterable = this.parseExpression();
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after for loop');
    
    const body: ASTNode[] = [];
    if (this.match(TokenType.LEFT_BRACE)) {
      while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
        const stmt = this.parseStatement();
        if (stmt) {
          body.push(stmt);
        }
      }
      this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after for block');
    } else {
      const stmt = this.parseStatement();
      if (stmt) {
        body.push(stmt);
      }
    }
    
    return {
      type: 'for',
      variable,
      iterable,
      body
    };
  }

  private parseReturnStatement(): ReturnNode {
    let value: ASTNode | undefined;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.parseExpression();
    }
    
    if (this.match(TokenType.SEMICOLON)) {
      // Optional semicolon
    }
    
    return {
      type: 'return',
      value
    };
  }

  private parseBlock(): BlockNode {
    const statements: ASTNode[] = [];
    
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }
    
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after block');
    
    return {
      type: 'block',
      statements
    };
  }

  private parseExpressionStatement(): ASTNode {
    // Handle assignments
    if (this.match(TokenType.IDENTIFIER) && this.check(TokenType.ASSIGN)) {
      const name = this.previous().value as string;
      this.advance(); // consume '='
      const value = this.parseExpression();
      return {
        type: 'assignment',
        variable: name,
        value,
        isLet: false
      };
    }
    
    // Reset to beginning
    this.current = Math.max(0, this.current - 1);
    if (this.current > 0 && this.tokens[this.current - 1].type === TokenType.IDENTIFIER) {
      this.current--;
    }
    
    const expr = this.parseExpression();
    if (this.match(TokenType.SEMICOLON)) {
      // Optional semicolon
    }
    return expr;
  }

  private parseExpression(): ASTNode {
    return this.parseAssignment();
  }

  private parseAssignment(): ASTNode {
    let expr = this.parseOr();
    
    if (this.match(TokenType.ASSIGN)) {
      const equals = this.previous();
      const value = this.parseAssignment();
      
      if (expr.type === 'variable') {
        const name = (expr as VariableNode).name;
        return {
          type: 'assignment',
          variable: name,
          value,
          isLet: false
        };
      }
      
      throw new Error(`Invalid assignment target at line ${equals.line}`);
    }
    
    return expr;
  }

  private parseOr(): ASTNode {
    let expr = this.parseAnd();
    
    while (this.match(TokenType.OR)) {
      const operator = this.previous().type;
      const right = this.parseAnd();
      expr = {
        type: 'binaryOp',
        operator: '||',
        left: expr,
        right
      } as BinaryOpNode;
    }
    
    return expr;
  }

  private parseAnd(): ASTNode {
    let expr = this.parseEquality();
    
    while (this.match(TokenType.AND)) {
      const operator = this.previous().type;
      const right = this.parseEquality();
      expr = {
        type: 'binaryOp',
        operator: '&&',
        left: expr,
        right
      } as BinaryOpNode;
    }
    
    return expr;
  }

  private parseEquality(): ASTNode {
    let expr = this.parseComparison();
    
    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous().type;
      const right = this.parseComparison();
      expr = {
        type: 'binaryOp',
        operator: operator === TokenType.EQUAL ? '==' : '!=',
        left: expr,
        right
      } as BinaryOpNode;
    }
    
    return expr;
  }

  private parseComparison(): ASTNode {
    let expr = this.parseTerm();
    
    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator = this.previous().type;
      const right = this.parseTerm();
      let op: BinaryOpNode['operator'];
      switch (operator) {
        case TokenType.GREATER: op = '>'; break;
        case TokenType.GREATER_EQUAL: op = '>='; break;
        case TokenType.LESS: op = '<'; break;
        case TokenType.LESS_EQUAL: op = '<='; break;
        default: op = '==';
      }
      expr = {
        type: 'binaryOp',
        operator: op,
        left: expr,
        right
      } as BinaryOpNode;
    }
    
    return expr;
  }

  private parseTerm(): ASTNode {
    let expr = this.parseFactor();
    
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().type;
      const right = this.parseFactor();
      expr = {
        type: 'binaryOp',
        operator: operator === TokenType.PLUS ? '+' : '-',
        left: expr,
        right
      } as BinaryOpNode;
    }
    
    return expr;
  }

  private parseFactor(): ASTNode {
    let expr = this.parseUnary();
    
    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      const operator = this.previous().type;
      const right = this.parseUnary();
      let op: BinaryOpNode['operator'];
      switch (operator) {
        case TokenType.MULTIPLY: op = '*'; break;
        case TokenType.DIVIDE: op = '/'; break;
        case TokenType.MODULO: op = '%'; break;
        default: op = '+';
      }
      expr = {
        type: 'binaryOp',
        operator: op,
        left: expr,
        right
      } as BinaryOpNode;
    }
    
    return expr;
  }

  private parseUnary(): ASTNode {
    if (this.match(TokenType.AWAIT)) {
      return { type: 'await', expression: this.parseUnary() } as AwaitNode;
    }
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const operator = this.previous().type;
      const right = this.parseUnary();
      return {
        type: 'unaryOp',
        operator: operator === TokenType.NOT ? '!' : '-',
        operand: right
      } as UnaryOpNode;
    }
    
    return this.parseCall();
  }

  private parseCall(): ASTNode {
    let expr = this.parsePrimary();
    
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.LEFT_BRACKET)) {
        const index = this.parseExpression();
        this.consume(TokenType.RIGHT_BRACKET, 'Expected "]" after index');
        expr = {
          type: 'index',
          object: expr,
          index
        } as IndexNode;
      } else if (this.match(TokenType.DOT)) {
        this.consume(TokenType.IDENTIFIER, 'Expected property name');
        const member = this.previous().value as string;
        expr = { type: 'memberAccess', object: expr, member } as MemberAccessNode;
      } else {
        break;
      }
    }
    
    return expr;
  }

  private finishCall(callee: ASTNode): ASTNode {
    const args: ASTNode[] = [];
    
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          throw new Error('Cannot have more than 255 arguments');
        }
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after arguments');
    
    return {
      type: 'functionCall',
      name: callee.type === 'variable' ? callee : { type: 'variable', name: 'anonymous' } as VariableNode,
      args
    } as FunctionCallNode;
  }

  private parsePrimary(): ASTNode {
    if (this.match(TokenType.FALSE)) {
      return { type: 'literal', value: false } as LiteralNode;
    }
    if (this.match(TokenType.TRUE)) {
      return { type: 'literal', value: true } as LiteralNode;
    }
    if (this.match(TokenType.NULL, TokenType.NULL_KW)) {
      return { type: 'literal', value: null } as LiteralNode;
    }
    if (this.match(TokenType.NUMBER, TokenType.STRING, TokenType.BOOLEAN)) {
      return { type: 'literal', value: this.previous().value } as LiteralNode;
    }
    if (this.match(TokenType.IDENTIFIER)) {
      const name = this.previous().value as string;
      if (this.check(TokenType.LEFT_BRACE)) {
        return this.parseStructInstance(name);
      }
      return { type: 'variable', name } as VariableNode;
    }
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after expression');
      return expr;
    }
    if (this.match(TokenType.LEFT_BRACKET)) {
      return this.parseArray();
    }
    if (this.match(TokenType.LEFT_BRACE)) {
      return this.parseMap();
    }
    
    throw new Error(`Unexpected token: ${this.peek().type}`);
  }

  private parseStructInstance(name: string): StructInstanceNode {
    this.consume(TokenType.LEFT_BRACE, 'Expected "{" after struct name');
    const fields: Array<{ name: string; value: ASTNode }> = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      this.consume(TokenType.IDENTIFIER, 'Expected field name');
      const fieldName = this.previous().value as string;
      this.consume(TokenType.COLON, 'Expected ":" after field name');
      const value = this.parseExpression();
      fields.push({ name: fieldName, value });
      this.match(TokenType.COMMA);
    }
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after struct fields');
    return { type: 'structInstance', name, fields };
  }

  private parseArray(): ArrayNode {
    const elements: ASTNode[] = [];
    
    if (!this.check(TokenType.RIGHT_BRACKET)) {
      do {
        elements.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_BRACKET, 'Expected "]" after array elements');
    
    return {
      type: 'array',
      elements
    };
  }

  private parseMap(): MapNode {
    const entries: Array<{ key: string; value: ASTNode }> = [];
    
    if (!this.check(TokenType.RIGHT_BRACE)) {
      do {
        const keyToken = this.consume(TokenType.STRING, 'Expected string key');
        const key = keyToken.value as string;
        this.consume(TokenType.COLON, 'Expected ":" after key');
        const value = this.parseExpression();
        entries.push({ key, value });
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RIGHT_BRACE, 'Expected "}" after map entries');
    
    return {
      type: 'map',
      entries
    };
  }

  // Helper methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(`${message} at line ${this.peek().line}, column ${this.peek().column}`);
  }

  private synchronize(): void {
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;
      
      switch (this.peek().type) {
        case TokenType.FUNCTION:
        case TokenType.FN:
        case TokenType.LET:
        case TokenType.CONST:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.FOR:
        case TokenType.RETURN:
          return;
      }
      
      this.advance();
    }
  }
}

