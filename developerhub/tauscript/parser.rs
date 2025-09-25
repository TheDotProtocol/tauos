use crate::lexer::{Token, TokenType};
use crate::interpreter::{Statement, Expression, BinaryOperator, UnaryOperator, Value};

/// TauScript Parser - Converts tokens into Abstract Syntax Tree
/// 
/// This module handles the parsing of TauScript tokens into an AST
/// that can be executed by the interpreter.

pub struct Parser {
    tokens: Vec<Token>,
    current: usize,
}

impl Parser {
    pub fn new(tokens: Vec<Token>) -> Self {
        Self { tokens, current: 0 }
    }

    pub fn parse(&mut self) -> Result<Vec<Statement>, String> {
        let mut statements = Vec::new();
        
        while !self.is_at_end() {
            statements.push(self.declaration()?);
        }
        
        Ok(statements)
    }

    fn declaration(&mut self) -> Result<Statement, String> {
        if self.match_token(&[TokenType::Function]) {
            self.function_declaration()
        } else if self.match_token(&[TokenType::Let, TokenType::Const]) {
            self.variable_declaration()
        } else {
            self.statement()
        }
    }

    fn function_declaration(&mut self) -> Result<Statement, String> {
        let name = self.consume_identifier("Expected function name")?;
        
        self.consume(&TokenType::LeftParen, "Expected '(' after function name")?;
        
        let mut parameters = Vec::new();
        if !self.check(&TokenType::RightParen) {
            loop {
                if parameters.len() >= 255 {
                    return Err("Cannot have more than 255 parameters".to_string());
                }
                
                parameters.push(self.consume_identifier("Expected parameter name")?);
                
                if !self.match_token(&[TokenType::Comma]) {
                    break;
                }
            }
        }
        
        self.consume(&TokenType::RightParen, "Expected ')' after parameters")?;
        
        // Optional return type
        let return_type = if self.match_token(&[TokenType::Colon]) {
            Some(self.consume_identifier("Expected return type")?)
        } else {
            None
        };
        
        self.consume(&TokenType::LeftBrace, "Expected '{' before function body")?;
        
        let body = self.block()?;
        
        Ok(Statement::FunctionDefinition {
            name,
            parameters,
            body,
            return_type,
        })
    }

    fn variable_declaration(&mut self) -> Result<Statement, String> {
        let is_const = self.previous().token_type == TokenType::Const;
        let name = self.consume_identifier("Expected variable name")?;
        
        // Optional type annotation
        let var_type = if self.match_token(&[TokenType::Colon]) {
            Some(self.consume_identifier("Expected type")?)
        } else {
            None
        };
        
        let value = if self.match_token(&[TokenType::Assign]) {
            self.expression()?
        } else {
            Expression::Literal(Value::Null)
        };
        
        if is_const && matches!(value, Expression::Literal(Value::Null)) {
            return Err("Constants must be initialized".to_string());
        }
        
        self.consume(&TokenType::Semicolon, "Expected ';' after variable declaration")?;
        
        Ok(Statement::VariableDeclaration {
            name,
            value,
            var_type,
        })
    }

    fn statement(&mut self) -> Result<Statement, String> {
        if self.match_token(&[TokenType::If]) {
            self.if_statement()
        } else if self.match_token(&[TokenType::While]) {
            self.while_statement()
        } else if self.match_token(&[TokenType::For]) {
            self.for_statement()
        } else if self.match_token(&[TokenType::Return]) {
            self.return_statement()
        } else if self.match_token(&[TokenType::LeftBrace]) {
            Ok(Statement::Expression(Expression::Literal(Value::Null))) // Block statement
        } else {
            self.expression_statement()
        }
    }

    fn if_statement(&mut self) -> Result<Statement, String> {
        self.consume(&TokenType::LeftParen, "Expected '(' after 'if'")?;
        let condition = self.expression()?;
        self.consume(&TokenType::RightParen, "Expected ')' after if condition")?;
        
        let then_branch = self.block()?;
        
        let else_branch = if self.match_token(&[TokenType::Else]) {
            Some(self.block()?)
        } else {
            None
        };
        
        Ok(Statement::If {
            condition,
            then_branch,
            else_branch,
        })
    }

    fn while_statement(&mut self) -> Result<Statement, String> {
        self.consume(&TokenType::LeftParen, "Expected '(' after 'while'")?;
        let condition = self.expression()?;
        self.consume(&TokenType::RightParen, "Expected ')' after while condition")?;
        
        let body = self.block()?;
        
        Ok(Statement::While { condition, body })
    }

    fn for_statement(&mut self) -> Result<Statement, String> {
        self.consume(&TokenType::LeftParen, "Expected '(' after 'for'")?;
        
        let variable = self.consume_identifier("Expected variable name")?;
        self.consume(&TokenType::In, "Expected 'in' after variable name")?;
        let iterable = self.expression()?;
        self.consume(&TokenType::RightParen, "Expected ')' after for clause")?;
        
        let body = self.block()?;
        
        Ok(Statement::For {
            variable,
            iterable,
            body,
        })
    }

    fn return_statement(&mut self) -> Result<Statement, String> {
        let value = if !self.check(&TokenType::Semicolon) {
            Some(self.expression()?)
        } else {
            None
        };
        
        self.consume(&TokenType::Semicolon, "Expected ';' after return value")?;
        
        Ok(Statement::Return(value))
    }

    fn expression_statement(&mut self) -> Result<Statement, String> {
        let expr = self.expression()?;
        self.consume(&TokenType::Semicolon, "Expected ';' after expression")?;
        Ok(Statement::Expression(expr))
    }

    fn block(&mut self) -> Result<Vec<Statement>, String> {
        let mut statements = Vec::new();
        
        while !self.check(&TokenType::RightBrace) && !self.is_at_end() {
            statements.push(self.declaration()?);
        }
        
        self.consume(&TokenType::RightBrace, "Expected '}' after block")?;
        Ok(statements)
    }

    fn expression(&mut self) -> Result<Expression, String> {
        self.assignment()
    }

    fn assignment(&mut self) -> Result<Expression, String> {
        let expr = self.or()?;
        
        if self.match_token(&[TokenType::Assign]) {
            let value = self.assignment()?;
            
            if let Expression::Variable(name) = expr {
                return Ok(Expression::BinaryOp {
                    left: Box::new(Expression::Variable(name)),
                    operator: BinaryOperator::Assign,
                    right: Box::new(value),
                });
            }
            
            return Err("Invalid assignment target".to_string());
        }
        
        Ok(expr)
    }

    fn or(&mut self) -> Result<Expression, String> {
        let mut expr = self.and()?;
        
        while self.match_token(&[TokenType::Or]) {
            let operator = BinaryOperator::Or;
            let right = self.and()?;
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
            };
        }
        
        Ok(expr)
    }

    fn and(&mut self) -> Result<Expression, String> {
        let mut expr = self.equality()?;
        
        while self.match_token(&[TokenType::And]) {
            let operator = BinaryOperator::And;
            let right = self.equality()?;
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
            };
        }
        
        Ok(expr)
    }

    fn equality(&mut self) -> Result<Expression, String> {
        let mut expr = self.comparison()?;
        
        while self.match_token(&[TokenType::Equal, TokenType::NotEqual]) {
            let operator = match self.previous().token_type {
                TokenType::Equal => BinaryOperator::Equal,
                TokenType::NotEqual => BinaryOperator::NotEqual,
                _ => unreachable!(),
            };
            let right = self.comparison()?;
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
            };
        }
        
        Ok(expr)
    }

    fn comparison(&mut self) -> Result<Expression, String> {
        let mut expr = self.term()?;
        
        while self.match_token(&[
            TokenType::GreaterThan,
            TokenType::GreaterThanOrEqual,
            TokenType::LessThan,
            TokenType::LessThanOrEqual,
        ]) {
            let operator = match self.previous().token_type {
                TokenType::GreaterThan => BinaryOperator::GreaterThan,
                TokenType::GreaterThanOrEqual => BinaryOperator::GreaterThanOrEqual,
                TokenType::LessThan => BinaryOperator::LessThan,
                TokenType::LessThanOrEqual => BinaryOperator::LessThanOrEqual,
                _ => unreachable!(),
            };
            let right = self.term()?;
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
            };
        }
        
        Ok(expr)
    }

    fn term(&mut self) -> Result<Expression, String> {
        let mut expr = self.factor()?;
        
        while self.match_token(&[TokenType::Plus, TokenType::Minus]) {
            let operator = match self.previous().token_type {
                TokenType::Plus => BinaryOperator::Add,
                TokenType::Minus => BinaryOperator::Subtract,
                _ => unreachable!(),
            };
            let right = self.factor()?;
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
            };
        }
        
        Ok(expr)
    }

    fn factor(&mut self) -> Result<Expression, String> {
        let mut expr = self.unary()?;
        
        while self.match_token(&[TokenType::Multiply, TokenType::Divide, TokenType::Modulo]) {
            let operator = match self.previous().token_type {
                TokenType::Multiply => BinaryOperator::Multiply,
                TokenType::Divide => BinaryOperator::Divide,
                TokenType::Modulo => BinaryOperator::Modulo,
                _ => unreachable!(),
            };
            let right = self.unary()?;
            expr = Expression::BinaryOp {
                left: Box::new(expr),
                operator,
                right: Box::new(right),
            };
        }
        
        Ok(expr)
    }

    fn unary(&mut self) -> Result<Expression, String> {
        if self.match_token(&[TokenType::Not, TokenType::Minus, TokenType::Increment, TokenType::Decrement]) {
            let operator = match self.previous().token_type {
                TokenType::Not => UnaryOperator::Not,
                TokenType::Minus => UnaryOperator::Negate,
                TokenType::Increment => UnaryOperator::Increment,
                TokenType::Decrement => UnaryOperator::Decrement,
                _ => unreachable!(),
            };
            let right = self.unary()?;
            return Ok(Expression::UnaryOp {
                operator,
                operand: Box::new(right),
            });
        }
        
        self.call()
    }

    fn call(&mut self) -> Result<Expression, String> {
        let mut expr = self.primary()?;
        
        loop {
            if self.match_token(&[TokenType::LeftParen]) {
                expr = self.finish_call(expr)?;
            } else if self.match_token(&[TokenType::LeftBracket]) {
                expr = self.finish_array_access(expr)?;
            } else if self.match_token(&[TokenType::Dot]) {
                expr = self.finish_property_access(expr)?;
            } else {
                break;
            }
        }
        
        Ok(expr)
    }

    fn finish_call(&mut self, callee: Expression) -> Result<Expression, String> {
        let mut arguments = Vec::new();
        
        if !self.check(&TokenType::RightParen) {
            loop {
                if arguments.len() >= 255 {
                    return Err("Cannot have more than 255 arguments".to_string());
                }
                arguments.push(self.expression()?);
                
                if !self.match_token(&[TokenType::Comma]) {
                    break;
                }
            }
        }
        
        self.consume(&TokenType::RightParen, "Expected ')' after arguments")?;
        
        if let Expression::Variable(name) = callee {
            Ok(Expression::FunctionCall { name, arguments })
        } else {
            Err("Expected function name".to_string())
        }
    }

    fn finish_array_access(&mut self, array: Expression) -> Result<Expression, String> {
        let index = self.expression()?;
        self.consume(&TokenType::RightBracket, "Expected ']' after array index")?;
        
        Ok(Expression::ArrayAccess {
            array: Box::new(array),
            index: Box::new(index),
        })
    }

    fn finish_property_access(&mut self, object: Expression) -> Result<Expression, String> {
        let key = self.consume_identifier("Expected property name")?;
        
        Ok(Expression::MapAccess {
            map: Box::new(object),
            key,
        })
    }

    fn primary(&mut self) -> Result<Expression, String> {
        if self.match_token(&[TokenType::True]) {
            return Ok(Expression::Literal(Value::Bool(true)));
        }
        if self.match_token(&[TokenType::False]) {
            return Ok(Expression::Literal(Value::Bool(false)));
        }
        if self.match_token(&[TokenType::Null]) {
            return Ok(Expression::Literal(Value::Null));
        }
        
        if let TokenType::Int(value) = &self.peek().token_type {
            self.advance();
            return Ok(Expression::Literal(Value::Int(*value)));
        }
        
        if let TokenType::Float(value) = &self.peek().token_type {
            self.advance();
            return Ok(Expression::Literal(Value::Float(*value)));
        }
        
        if let TokenType::String(value) = &self.peek().token_type {
            self.advance();
            return Ok(Expression::Literal(Value::String(value.clone())));
        }
        
        if self.match_token(&[TokenType::LeftParen]) {
            let expr = self.expression()?;
            self.consume(&TokenType::RightParen, "Expected ')' after expression")?;
            return Ok(expr);
        }
        
        if self.match_token(&[TokenType::LeftBracket]) {
            return self.array_literal();
        }
        
        if self.match_token(&[TokenType::LeftBrace]) {
            return self.map_literal();
        }
        
        if self.match_token(&[TokenType::Identifier(_)]) {
            return Ok(Expression::Variable(self.previous().lexeme.clone()));
        }
        
        Err("Expected expression".to_string())
    }

    fn array_literal(&mut self) -> Result<Expression, String> {
        let mut elements = Vec::new();
        
        if !self.check(&TokenType::RightBracket) {
            loop {
                elements.push(self.expression()?);
                
                if !self.match_token(&[TokenType::Comma]) {
                    break;
                }
            }
        }
        
        self.consume(&TokenType::RightBracket, "Expected ']' after array elements")?;
        
        Ok(Expression::Literal(Value::Array(elements)))
    }

    fn map_literal(&mut self) -> Result<Expression, String> {
        let mut map = std::collections::HashMap::new();
        
        if !self.check(&TokenType::RightBrace) {
            loop {
                let key = self.consume_identifier("Expected map key")?;
                self.consume(&TokenType::Colon, "Expected ':' after map key")?;
                let value = self.expression()?;
                
                map.insert(key, value);
                
                if !self.match_token(&[TokenType::Comma]) {
                    break;
                }
            }
        }
        
        self.consume(&TokenType::RightBrace, "Expected '}' after map elements")?;
        
        Ok(Expression::Literal(Value::Map(map)))
    }

    fn match_token(&mut self, types: &[TokenType]) -> bool {
        for token_type in types {
            if self.check(token_type) {
                self.advance();
                return true;
            }
        }
        false
    }

    fn check(&self, token_type: &TokenType) -> bool {
        if self.is_at_end() {
            false
        } else {
            std::mem::discriminant(&self.peek().token_type) == std::mem::discriminant(token_type)
        }
    }

    fn advance(&mut self) -> &Token {
        if !self.is_at_end() {
            self.current += 1;
        }
        self.previous()
    }

    fn is_at_end(&self) -> bool {
        matches!(self.peek().token_type, TokenType::Eof)
    }

    fn peek(&self) -> &Token {
        &self.tokens[self.current]
    }

    fn previous(&self) -> &Token {
        &self.tokens[self.current - 1]
    }

    fn consume(&mut self, token_type: &TokenType, message: &str) -> Result<&Token, String> {
        if self.check(token_type) {
            Ok(self.advance())
        } else {
            Err(format!("{} at line {}, column {}", message, self.peek().line, self.peek().column))
        }
    }

    fn consume_identifier(&mut self, message: &str) -> Result<String, String> {
        if let TokenType::Identifier(name) = &self.peek().token_type {
            let name = name.clone();
            self.advance();
            Ok(name)
        } else {
            Err(format!("{} at line {}, column {}", message, self.peek().line, self.peek().column))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::lexer::Lexer;

    #[test]
    fn test_parse_variable_declaration() {
        let source = "let x = 42;".to_string();
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        let mut parser = Parser::new(tokens);
        let statements = parser.parse().unwrap();
        
        assert_eq!(statements.len(), 1);
        if let Statement::VariableDeclaration { name, value, var_type } = &statements[0] {
            assert_eq!(name, "x");
            assert_eq!(var_type, &None);
            if let Expression::Literal(Value::Int(42)) = value {
                // Correct
            } else {
                panic!("Expected integer literal 42");
            }
        } else {
            panic!("Expected variable declaration");
        }
    }

    #[test]
    fn test_parse_function_declaration() {
        let source = "function add(a, b) { return a + b; }".to_string();
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        let mut parser = Parser::new(tokens);
        let statements = parser.parse().unwrap();
        
        assert_eq!(statements.len(), 1);
        if let Statement::FunctionDefinition { name, parameters, body, return_type } = &statements[0] {
            assert_eq!(name, "add");
            assert_eq!(parameters, &["a", "b"]);
            assert_eq!(return_type, &None);
            assert_eq!(body.len(), 1);
        } else {
            panic!("Expected function definition");
        }
    }

    #[test]
    fn test_parse_arithmetic_expression() {
        let source = "let result = 2 + 3 * 4;".to_string();
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        let mut parser = Parser::new(tokens);
        let statements = parser.parse().unwrap();
        
        assert_eq!(statements.len(), 1);
        if let Statement::VariableDeclaration { name: _, value, var_type: _ } = &statements[0] {
            // Should parse as 2 + (3 * 4) due to operator precedence
            if let Expression::BinaryOp { left, operator: BinaryOperator::Add, right } = value {
                if let Expression::Literal(Value::Int(2)) = **left {
                    // Correct
                } else {
                    panic!("Expected 2 as left operand");
                }
                if let Expression::BinaryOp { left: _, operator: BinaryOperator::Multiply, right: _ } = **right {
                    // Correct
                } else {
                    panic!("Expected multiplication as right operand");
                }
            } else {
                panic!("Expected addition expression");
            }
        } else {
            panic!("Expected variable declaration");
        }
    }
}
