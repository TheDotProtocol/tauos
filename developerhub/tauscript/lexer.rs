use std::collections::HashMap;

/// TauScript Lexer - Tokenizes source code into tokens
/// 
/// This module handles the lexical analysis of TauScript source code,
/// converting text into a stream of tokens that can be parsed.

#[derive(Debug, Clone, PartialEq)]
pub enum TokenType {
    // Literals
    Int(i64),
    Float(f64),
    String(String),
    Bool(bool),
    Identifier(String),
    
    // Keywords
    Let,
    Const,
    Function,
    If,
    Else,
    While,
    For,
    In,
    Return,
    True,
    False,
    Null,
    Async,
    Await,
    Try,
    Catch,
    Finally,
    Match,
    Class,
    Interface,
    Extends,
    Implements,
    Public,
    Private,
    Static,
    Export,
    Import,
    From,
    Module,
    Type,
    Result,
    Ok,
    Err,
    
    // Operators
    Plus,           // +
    Minus,          // -
    Multiply,       // *
    Divide,         // /
    Modulo,         // %
    Equal,          // ==
    NotEqual,       // !=
    LessThan,       // <
    LessThanOrEqual, // <=
    GreaterThan,    // >
    GreaterThanOrEqual, // >=
    Assign,         // =
    PlusAssign,     // +=
    MinusAssign,    // -=
    MultiplyAssign, // *=
    DivideAssign,   // /=
    And,            // &&
    Or,             // ||
    Not,            // !
    Increment,      // ++
    Decrement,      // --
    Concat,         // +
    
    // Delimiters
    LeftParen,      // (
    RightParen,     // )
    LeftBracket,    // [
    RightBracket,   // ]
    LeftBrace,      // {
    RightBrace,     // }
    Comma,          // ,
    Semicolon,      // ;
    Colon,          // :
    Dot,            // .
    Arrow,          // =>
    Question,       // ?
    Pipe,           // |
    
    // Special
    Newline,
    Eof,
    Comment(String),
}

#[derive(Debug, Clone)]
pub struct Token {
    pub token_type: TokenType,
    pub line: usize,
    pub column: usize,
    pub lexeme: String,
}

pub struct Lexer {
    source: String,
    current: usize,
    line: usize,
    column: usize,
    keywords: HashMap<String, TokenType>,
}

impl Lexer {
    pub fn new(source: String) -> Self {
        let mut keywords = HashMap::new();
        
        // Keywords
        keywords.insert("let".to_string(), TokenType::Let);
        keywords.insert("const".to_string(), TokenType::Const);
        keywords.insert("function".to_string(), TokenType::Function);
        keywords.insert("if".to_string(), TokenType::If);
        keywords.insert("else".to_string(), TokenType::Else);
        keywords.insert("while".to_string(), TokenType::While);
        keywords.insert("for".to_string(), TokenType::For);
        keywords.insert("in".to_string(), TokenType::In);
        keywords.insert("fn".to_string(), TokenType::Function);
        keywords.insert("return".to_string(), TokenType::Return);
        keywords.insert("true".to_string(), TokenType::Bool(true));
        keywords.insert("false".to_string(), TokenType::Bool(false));
        keywords.insert("null".to_string(), TokenType::Null);
        keywords.insert("async".to_string(), TokenType::Async);
        keywords.insert("await".to_string(), TokenType::Await);
        keywords.insert("try".to_string(), TokenType::Try);
        keywords.insert("catch".to_string(), TokenType::Catch);
        keywords.insert("finally".to_string(), TokenType::Finally);
        keywords.insert("match".to_string(), TokenType::Match);
        keywords.insert("class".to_string(), TokenType::Class);
        keywords.insert("interface".to_string(), TokenType::Interface);
        keywords.insert("extends".to_string(), TokenType::Extends);
        keywords.insert("implements".to_string(), TokenType::Implements);
        keywords.insert("public".to_string(), TokenType::Public);
        keywords.insert("private".to_string(), TokenType::Private);
        keywords.insert("static".to_string(), TokenType::Static);
        keywords.insert("export".to_string(), TokenType::Export);
        keywords.insert("import".to_string(), TokenType::Import);
        keywords.insert("from".to_string(), TokenType::From);
        keywords.insert("module".to_string(), TokenType::Module);
        keywords.insert("type".to_string(), TokenType::Type);
        keywords.insert("result".to_string(), TokenType::Result);
        keywords.insert("Ok".to_string(), TokenType::Ok);
        keywords.insert("Err".to_string(), TokenType::Err);
        
        Self {
            source,
            current: 0,
            line: 1,
            column: 1,
            keywords,
        }
    }

    pub fn tokenize(&mut self) -> Result<Vec<Token>, String> {
        let mut tokens = Vec::new();
        
        while !self.is_at_end() {
            self.skip_whitespace();
            
            if self.is_at_end() {
                break;
            }
            
            let token = self.scan_token()?;
            tokens.push(token);
        }
        
        tokens.push(Token {
            token_type: TokenType::Eof,
            line: self.line,
            column: self.column,
            lexeme: "".to_string(),
        });
        
        Ok(tokens)
    }

    fn scan_token(&mut self) -> Result<Token, String> {
        let start = self.current;
        let line = self.line;
        let column = self.column;
        
        let c = self.advance();
        
        match c {
            // Single character tokens
            '(' => self.make_token(TokenType::LeftParen, start, line, column),
            ')' => self.make_token(TokenType::RightParen, start, line, column),
            '[' => self.make_token(TokenType::LeftBracket, start, line, column),
            ']' => self.make_token(TokenType::RightBracket, start, line, column),
            '{' => self.make_token(TokenType::LeftBrace, start, line, column),
            '}' => self.make_token(TokenType::RightBrace, start, line, column),
            ',' => self.make_token(TokenType::Comma, start, line, column),
            ';' => self.make_token(TokenType::Semicolon, start, line, column),
            ':' => self.make_token(TokenType::Colon, start, line, column),
            '.' => self.make_token(TokenType::Dot, start, line, column),
            '?' => self.make_token(TokenType::Question, start, line, column),
            '|' => self.make_token(TokenType::Pipe, start, line, column),
            
            // Operators
            '+' => {
                if self.match_char('+') {
                    self.make_token(TokenType::Increment, start, line, column)
                } else if self.match_char('=') {
                    self.make_token(TokenType::PlusAssign, start, line, column)
                } else {
                    self.make_token(TokenType::Plus, start, line, column)
                }
            }
            '-' => {
                if self.match_char('-') {
                    self.make_token(TokenType::Decrement, start, line, column)
                } else if self.match_char('=') {
                    self.make_token(TokenType::MinusAssign, start, line, column)
                } else {
                    self.make_token(TokenType::Minus, start, line, column)
                }
            }
            '*' => {
                if self.match_char('=') {
                    self.make_token(TokenType::MultiplyAssign, start, line, column)
                } else {
                    self.make_token(TokenType::Multiply, start, line, column)
                }
            }
            '/' => {
                if self.match_char('=') {
                    self.make_token(TokenType::DivideAssign, start, line, column)
                } else if self.match_char('/') {
                    self.scan_comment()
                } else if self.match_char('*') {
                    self.scan_multiline_comment()
                } else {
                    self.make_token(TokenType::Divide, start, line, column)
                }
            }
            '%' => self.make_token(TokenType::Modulo, start, line, column),
            '!' => {
                if self.match_char('=') {
                    self.make_token(TokenType::NotEqual, start, line, column)
                } else {
                    self.make_token(TokenType::Not, start, line, column)
                }
            }
            '=' => {
                if self.match_char('=') {
                    self.make_token(TokenType::Equal, start, line, column)
                } else if self.match_char('>') {
                    self.make_token(TokenType::Arrow, start, line, column)
                } else {
                    self.make_token(TokenType::Assign, start, line, column)
                }
            }
            '<' => {
                if self.match_char('=') {
                    self.make_token(TokenType::LessThanOrEqual, start, line, column)
                } else {
                    self.make_token(TokenType::LessThan, start, line, column)
                }
            }
            '>' => {
                if self.match_char('=') {
                    self.make_token(TokenType::GreaterThanOrEqual, start, line, column)
                } else {
                    self.make_token(TokenType::GreaterThan, start, line, column)
                }
            }
            '&' => {
                if self.match_char('&') {
                    self.make_token(TokenType::And, start, line, column)
                } else {
                    return Err(format!("Unexpected character '&' at line {}, column {}", line, column));
                }
            }
            '|' => {
                if self.match_char('|') {
                    self.make_token(TokenType::Or, start, line, column)
                } else {
                    self.make_token(TokenType::Pipe, start, line, column)
                }
            }
            
            // String literals
            '"' => self.scan_string(),
            '\'' => self.scan_char(),
            
            // Numbers
            '0'..='9' => self.scan_number(),
            
            // Identifiers and keywords
            'a'..='z' | 'A'..='Z' | '_' => self.scan_identifier(),
            
            // Newlines
            '\n' => {
                self.line += 1;
                self.column = 1;
                self.make_token(TokenType::Newline, start, line, column)
            }
            
            _ => Err(format!("Unexpected character '{}' at line {}, column {}", c, line, column)),
        }
    }

    fn scan_string(&mut self) -> Result<Token, String> {
        let start = self.current - 1;
        let line = self.line;
        let column = self.column - 1;
        let mut value = String::new();
        
        while self.peek() != '"' && !self.is_at_end() {
            if self.peek() == '\n' {
                self.line += 1;
                self.column = 1;
            }
            
            let c = self.advance();
            
            if c == '\\' && !self.is_at_end() {
                let next = self.advance();
                match next {
                    'n' => value.push('\n'),
                    't' => value.push('\t'),
                    'r' => value.push('\r'),
                    '\\' => value.push('\\'),
                    '"' => value.push('"'),
                    _ => return Err(format!("Invalid escape sequence '\\{}' at line {}, column {}", next, self.line, self.column)),
                }
            } else {
                value.push(c);
            }
        }
        
        if self.is_at_end() {
            return Err(format!("Unterminated string at line {}, column {}", line, column));
        }
        
        self.advance(); // consume closing quote
        self.make_token(TokenType::String(value), start, line, column)
    }

    fn scan_char(&mut self) -> Result<Token, String> {
        let start = self.current - 1;
        let line = self.line;
        let column = self.column - 1;
        
        if self.is_at_end() {
            return Err(format!("Unterminated character at line {}, column {}", line, column));
        }
        
        let c = self.advance();
        
        if self.peek() != '\'' {
            return Err(format!("Character literal must be single character at line {}, column {}", self.line, self.column));
        }
        
        self.advance(); // consume closing quote
        
        let value = if c == '\\' && !self.is_at_end() {
            let next = self.advance();
            match next {
                'n' => '\n',
                't' => '\t',
                'r' => '\r',
                '\\' => '\\',
                '\'' => '\'',
                _ => return Err(format!("Invalid escape sequence '\\{}' at line {}, column {}", next, self.line, self.column)),
            }
        } else {
            c
        };
        
        self.make_token(TokenType::String(value.to_string()), start, line, column)
    }

    fn scan_number(&mut self) -> Result<Token, String> {
        let start = self.current - 1;
        let line = self.line;
        let column = self.column - 1;
        let mut value = String::new();
        
        // Integer part
        while self.peek().is_ascii_digit() {
            value.push(self.advance());
        }
        
        // Decimal part
        if self.peek() == '.' && self.peek_next().is_ascii_digit() {
            value.push(self.advance()); // consume '.'
            while self.peek().is_ascii_digit() {
                value.push(self.advance());
            }
        }
        
        // Parse as float if it has decimal point, otherwise int
        if value.contains('.') {
            let float_value = value.parse::<f64>()
                .map_err(|_| format!("Invalid float literal '{}' at line {}, column {}", value, line, column))?;
            self.make_token(TokenType::Float(float_value), start, line, column)
        } else {
            let int_value = value.parse::<i64>()
                .map_err(|_| format!("Invalid integer literal '{}' at line {}, column {}", value, line, column))?;
            self.make_token(TokenType::Int(int_value), start, line, column)
        }
    }

    fn scan_identifier(&mut self) -> Result<Token, String> {
        let start = self.current - 1;
        let line = self.line;
        let column = self.column - 1;
        let mut value = String::new();
        
        while self.peek().is_ascii_alphanumeric() || self.peek() == '_' {
            value.push(self.advance());
        }
        
        // Check if it's a keyword
        let token_type = self.keywords.get(&value)
            .cloned()
            .unwrap_or(TokenType::Identifier(value));
        
        self.make_token(token_type, start, line, column)
    }

    fn scan_comment(&mut self) -> Result<Token, String> {
        let start = self.current - 2;
        let line = self.line;
        let column = self.column - 2;
        let mut value = String::new();
        
        while self.peek() != '\n' && !self.is_at_end() {
            value.push(self.advance());
        }
        
        self.make_token(TokenType::Comment(value), start, line, column)
    }

    fn scan_multiline_comment(&mut self) -> Result<Token, String> {
        let start = self.current - 2;
        let line = self.line;
        let column = self.column - 2;
        let mut value = String::new();
        
        while !self.is_at_end() {
            if self.peek() == '*' && self.peek_next() == '/' {
                self.advance(); // consume '*'
                self.advance(); // consume '/'
                break;
            }
            
            if self.peek() == '\n' {
                self.line += 1;
                self.column = 1;
            } else {
                self.column += 1;
            }
            
            value.push(self.advance());
        }
        
        if self.is_at_end() {
            return Err(format!("Unterminated multiline comment at line {}, column {}", line, column));
        }
        
        self.make_token(TokenType::Comment(value), start, line, column)
    }

    fn skip_whitespace(&mut self) {
        while !self.is_at_end() {
            let c = self.peek();
            match c {
                ' ' | '\r' | '\t' => {
                    self.advance();
                    self.column += 1;
                }
                '\n' => {
                    self.advance();
                    self.line += 1;
                    self.column = 1;
                }
                _ => break,
            }
        }
    }

    fn advance(&mut self) -> char {
        if self.is_at_end() {
            '\0'
        } else {
            let c = self.source.chars().nth(self.current).unwrap();
            self.current += 1;
            self.column += 1;
            c
        }
    }

    fn peek(&self) -> char {
        if self.is_at_end() {
            '\0'
        } else {
            self.source.chars().nth(self.current).unwrap()
        }
    }

    fn peek_next(&self) -> char {
        if self.current + 1 >= self.source.len() {
            '\0'
        } else {
            self.source.chars().nth(self.current + 1).unwrap()
        }
    }

    fn match_char(&mut self, expected: char) -> bool {
        if self.is_at_end() || self.peek() != expected {
            false
        } else {
            self.advance();
            true
        }
    }

    fn is_at_end(&self) -> bool {
        self.current >= self.source.len()
    }

    fn make_token(&self, token_type: TokenType, start: usize, line: usize, column: usize) -> Result<Token, String> {
        let lexeme = self.source[start..self.current].to_string();
        Ok(Token {
            token_type,
            line,
            column,
            lexeme,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_tokens() {
        let source = "let x = 42;".to_string();
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        
        assert_eq!(tokens.len(), 6); // let, x, =, 42, ;, EOF
        assert_eq!(tokens[0].token_type, TokenType::Let);
        assert_eq!(tokens[1].token_type, TokenType::Identifier("x".to_string()));
        assert_eq!(tokens[2].token_type, TokenType::Assign);
        assert_eq!(tokens[3].token_type, TokenType::Int(42));
        assert_eq!(tokens[4].token_type, TokenType::Semicolon);
        assert_eq!(tokens[5].token_type, TokenType::Eof);
    }

    #[test]
    fn test_string_literals() {
        let source = r#""Hello, World!""#.to_string();
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        
        assert_eq!(tokens.len(), 2);
        assert_eq!(tokens[0].token_type, TokenType::String("Hello, World!".to_string()));
        assert_eq!(tokens[1].token_type, TokenType::Eof);
    }

    #[test]
    fn test_operators() {
        let source = "x + y * z / w % v".to_string();
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        
        assert_eq!(tokens.len(), 10); // x, +, y, *, z, /, w, %, v, EOF
        assert_eq!(tokens[1].token_type, TokenType::Plus);
        assert_eq!(tokens[3].token_type, TokenType::Multiply);
        assert_eq!(tokens[5].token_type, TokenType::Divide);
        assert_eq!(tokens[7].token_type, TokenType::Modulo);
    }

    #[test]
    fn test_keywords() {
        let source = "function if else while for return".to_string();
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().unwrap();
        
        assert_eq!(tokens.len(), 7);
        assert_eq!(tokens[0].token_type, TokenType::Function);
        assert_eq!(tokens[1].token_type, TokenType::If);
        assert_eq!(tokens[2].token_type, TokenType::Else);
        assert_eq!(tokens[3].token_type, TokenType::While);
        assert_eq!(tokens[4].token_type, TokenType::For);
        assert_eq!(tokens[5].token_type, TokenType::Return);
    }
}
