use std::io::{self, Write};
use std::fs;
use clap::{Parser, Subcommand};

mod lexer;
mod parser;
mod interpreter;

use lexer::Lexer;
use parser::Parser;
use interpreter::Interpreter;

/// TauScript - Privacy-First, AI-Native Programming Language
/// 
/// TauScript is a modern programming language designed for the TauCore™ ecosystem.
/// It combines the simplicity of Python with the performance of Rust and the
/// privacy guarantees of a zero-telemetry system.

#[derive(Parser)]
#[command(name = "tauscript")]
#[command(about = "TauScript - Privacy-First, AI-Native Programming Language")]
#[command(version = "1.0.0")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Run a TauScript file
    Run {
        /// Path to the TauScript file
        file: String,
    },
    /// Start interactive REPL
    Repl,
    /// Compile TauScript to another language
    Compile {
        /// Path to the TauScript file
        file: String,
        /// Target language (js, rust, c)
        target: String,
        /// Output file path
        #[arg(short, long)]
        output: Option<String>,
    },
    /// Format TauScript code
    Format {
        /// Path to the TauScript file
        file: String,
        /// Output file path (defaults to overwriting input file)
        #[arg(short, long)]
        output: Option<String>,
    },
    /// Lint TauScript code
    Lint {
        /// Path to the TauScript file
        file: String,
    },
    /// Test TauScript code
    Test {
        /// Path to the TauScript file or directory
        path: String,
    },
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();
    
    match cli.command {
        Commands::Run { file } => {
            run_file(&file)?;
        }
        Commands::Repl => {
            run_repl()?;
        }
        Commands::Compile { file, target, output } => {
            compile_file(&file, &target, output)?;
        }
        Commands::Format { file, output } => {
            format_file(&file, output)?;
        }
        Commands::Lint { file } => {
            lint_file(&file)?;
        }
        Commands::Test { path } => {
            test_path(&path)?;
        }
    }
    
    Ok(())
}

fn run_file(file_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("🐢 Running TauScript file: {}", file_path);
    
    let source = fs::read_to_string(file_path)?;
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize()?;
    
    let mut parser = Parser::new(tokens);
    let statements = parser.parse()?;
    
    let mut interpreter = Interpreter::new();
    interpreter.interpret(statements)?;
    
    Ok(())
}

fn run_repl() -> Result<(), Box<dyn std::error::Error>> {
    println!("🐢 TauScript REPL v1.0.0");
    println!("Type 'exit' or 'quit' to exit, 'help' for help");
    
    let mut interpreter = Interpreter::new();
    
    loop {
        print!("tauscript> ");
        io::stdout().flush()?;
        
        let mut input = String::new();
        io::stdin().read_line(&mut input)?;
        
        let input = input.trim();
        
        if input.is_empty() {
            continue;
        }
        
        if input == "exit" || input == "quit" {
            println!("Goodbye! 🐢");
            break;
        }
        
        if input == "help" {
            print_help();
            continue;
        }
        
        if input == "clear" {
            print!("\x1B[2J\x1B[1;1H");
            continue;
        }
        
        // Handle multi-line input
        let mut full_input = input.to_string();
        if input.ends_with('{') || input.ends_with('(') || input.ends_with('[') {
            loop {
                print!("... ");
                io::stdout().flush()?;
                
                let mut line = String::new();
                io::stdin().read_line(&mut line)?;
                let line = line.trim();
                
                full_input.push('\n');
                full_input.push_str(line);
                
                if line.ends_with('}') || line.ends_with(')') || line.ends_with(']') {
                    break;
                }
            }
        }
        
        match execute_code(&mut interpreter, &full_input) {
            Ok(value) => {
                if !matches!(value, interpreter::Value::Null) {
                    println!("{}", value);
                }
            }
            Err(error) => {
                println!("Error: {}", error);
            }
        }
    }
    
    Ok(())
}

fn execute_code(interpreter: &mut Interpreter, code: &str) -> Result<interpreter::Value, String> {
    let mut lexer = Lexer::new(code.to_string());
    let tokens = lexer.tokenize()?;
    
    let mut parser = Parser::new(tokens);
    let statements = parser.parse()?;
    
    let mut result = interpreter::Value::Null;
    for statement in statements {
        result = interpreter.execute_statement(statement)?;
    }
    
    Ok(result)
}

fn compile_file(file_path: &str, target: &str, output: Option<String>) -> Result<(), Box<dyn std::error::Error>> {
    println!("🐢 Compiling {} to {}", file_path, target);
    
    let source = fs::read_to_string(file_path)?;
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize()?;
    
    let mut parser = Parser::new(tokens);
    let statements = parser.parse()?;
    
    let output_path = output.unwrap_or_else(|| {
        let base = file_path.trim_end_matches(".tau");
        match target {
            "js" => format!("{}.js", base),
            "rust" => format!("{}.rs", base),
            "c" => format!("{}.c", base),
            _ => format!("{}.{}", base, target),
        }
    });
    
    let compiled_code = match target {
        "js" => compile_to_javascript(&statements)?,
        "rust" => compile_to_rust(&statements)?,
        "c" => compile_to_c(&statements)?,
        _ => return Err(format!("Unsupported target language: {}", target).into()),
    };
    
    fs::write(&output_path, compiled_code)?;
    println!("✅ Compiled to: {}", output_path);
    
    Ok(())
}

fn format_file(file_path: &str, output: Option<String>) -> Result<(), Box<dyn std::error::Error>> {
    println!("🐢 Formatting {}", file_path);
    
    let source = fs::read_to_string(file_path)?;
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize()?;
    
    let mut parser = Parser::new(tokens);
    let statements = parser.parse()?;
    
    let formatted_code = format_code(&statements);
    
    let output_path = output.unwrap_or_else(|| file_path.to_string());
    fs::write(&output_path, formatted_code)?;
    println!("✅ Formatted: {}", output_path);
    
    Ok(())
}

fn lint_file(file_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("🐢 Linting {}", file_path);
    
    let source = fs::read_to_string(file_path)?;
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize()?;
    
    let mut parser = Parser::new(tokens);
    let statements = parser.parse()?;
    
    let issues = lint_code(&statements);
    
    if issues.is_empty() {
        println!("✅ No issues found");
    } else {
        for issue in issues {
            println!("⚠️  {}", issue);
        }
    }
    
    Ok(())
}

fn test_path(path: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("🐢 Running tests in {}", path);
    
    // Simple test runner - in a real implementation, this would be more sophisticated
    let mut interpreter = Interpreter::new();
    
    if path.ends_with(".tau") {
        // Single file
        run_tests_in_file(&mut interpreter, path)?;
    } else {
        // Directory
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            let path = entry.path();
            if path.extension().map_or(false, |ext| ext == "tau") {
                run_tests_in_file(&mut interpreter, &path.to_string_lossy())?;
            }
        }
    }
    
    Ok(())
}

fn run_tests_in_file(interpreter: &mut Interpreter, file_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let source = fs::read_to_string(file_path)?;
    let mut lexer = Lexer::new(source);
    let tokens = lexer.tokenize()?;
    
    let mut parser = Parser::new(tokens);
    let statements = parser.parse()?;
    
    // Look for test functions (functions starting with "test_")
    for statement in statements {
        if let interpreter::Statement::FunctionDefinition { name, parameters, body, .. } = statement {
            if name.starts_with("test_") {
                println!("Running test: {}", name);
                
                // Create test environment
                let mut test_interpreter = interpreter.clone();
                
                // Run test function
                match test_interpreter.call_function(name, parameters.iter().map(|_| interpreter::Value::Null).collect()) {
                    Ok(_) => println!("✅ {} passed", name),
                    Err(error) => println!("❌ {} failed: {}", name, error),
                }
            }
        }
    }
    
    Ok(())
}

fn compile_to_javascript(statements: &[interpreter::Statement]) -> Result<String, String> {
    let mut js_code = String::new();
    js_code.push_str("// Generated by TauScript compiler\n");
    js_code.push_str("// TauScript to JavaScript transpilation\n\n");
    
    for statement in statements {
        js_code.push_str(&statement_to_javascript(statement)?);
        js_code.push('\n');
    }
    
    Ok(js_code)
}

fn compile_to_rust(statements: &[interpreter::Statement]) -> Result<String, String> {
    let mut rust_code = String::new();
    rust_code.push_str("// Generated by TauScript compiler\n");
    rust_code.push_str("// TauScript to Rust transpilation\n\n");
    
    for statement in statements {
        rust_code.push_str(&statement_to_rust(statement)?);
        rust_code.push('\n');
    }
    
    Ok(rust_code)
}

fn compile_to_c(statements: &[interpreter::Statement]) -> Result<String, String> {
    let mut c_code = String::new();
    c_code.push_str("// Generated by TauScript compiler\n");
    c_code.push_str("// TauScript to C transpilation\n\n");
    c_code.push_str("#include <stdio.h>\n");
    c_code.push_str("#include <stdlib.h>\n");
    c_code.push_str("#include <string.h>\n\n");
    
    for statement in statements {
        c_code.push_str(&statement_to_c(statement)?);
        c_code.push('\n');
    }
    
    Ok(c_code)
}

fn statement_to_javascript(statement: &interpreter::Statement) -> Result<String, String> {
    match statement {
        interpreter::Statement::VariableDeclaration { name, value, var_type: _ } => {
            Ok(format!("let {} = {};", name, expression_to_javascript(value)?))
        }
        interpreter::Statement::FunctionDefinition { name, parameters, body, return_type: _ } => {
            let params = parameters.join(", ");
            let mut body_js = String::new();
            for stmt in body {
                body_js.push_str(&statement_to_javascript(stmt)?);
                body_js.push('\n');
            }
            Ok(format!("function {}({}) {{\n{}\n}}", name, params, body_js))
        }
        _ => Ok("// Unsupported statement".to_string()),
    }
}

fn statement_to_rust(statement: &interpreter::Statement) -> Result<String, String> {
    match statement {
        interpreter::Statement::VariableDeclaration { name, value, var_type: _ } => {
            Ok(format!("let {} = {};", name, expression_to_rust(value)?))
        }
        interpreter::Statement::FunctionDefinition { name, parameters, body, return_type: _ } => {
            let params = parameters.join(", ");
            let mut body_rust = String::new();
            for stmt in body {
                body_rust.push_str(&statement_to_rust(stmt)?);
                body_rust.push('\n');
            }
            Ok(format!("fn {}({}) {{\n{}\n}}", name, params, body_rust))
        }
        _ => Ok("// Unsupported statement".to_string()),
    }
}

fn statement_to_c(statement: &interpreter::Statement) -> Result<String, String> {
    match statement {
        interpreter::Statement::VariableDeclaration { name, value, var_type: _ } => {
            Ok(format!("int {} = {};", name, expression_to_c(value)?))
        }
        interpreter::Statement::FunctionDefinition { name, parameters, body, return_type: _ } => {
            let params = parameters.join(", ");
            let mut body_c = String::new();
            for stmt in body {
                body_c.push_str(&statement_to_c(stmt)?);
                body_c.push('\n');
            }
            Ok(format!("int {}({}) {{\n{}\n}}", name, params, body_c))
        }
        _ => Ok("// Unsupported statement".to_string()),
    }
}

fn expression_to_javascript(expr: &interpreter::Expression) -> Result<String, String> {
    match expr {
        interpreter::Expression::Literal(value) => Ok(value_to_javascript(value)),
        interpreter::Expression::Variable(name) => Ok(name.clone()),
        interpreter::Expression::BinaryOp { left, operator, right } => {
            let left_js = expression_to_javascript(left)?;
            let right_js = expression_to_javascript(right)?;
            let op_js = match operator {
                interpreter::BinaryOperator::Add => "+",
                interpreter::BinaryOperator::Subtract => "-",
                interpreter::BinaryOperator::Multiply => "*",
                interpreter::BinaryOperator::Divide => "/",
                _ => "?",
            };
            Ok(format!("({} {} {})", left_js, op_js, right_js))
        }
        _ => Ok("/* Unsupported expression */".to_string()),
    }
}

fn expression_to_rust(expr: &interpreter::Expression) -> Result<String, String> {
    match expr {
        interpreter::Expression::Literal(value) => Ok(value_to_rust(value)),
        interpreter::Expression::Variable(name) => Ok(name.clone()),
        interpreter::Expression::BinaryOp { left, operator, right } => {
            let left_rust = expression_to_rust(left)?;
            let right_rust = expression_to_rust(right)?;
            let op_rust = match operator {
                interpreter::BinaryOperator::Add => "+",
                interpreter::BinaryOperator::Subtract => "-",
                interpreter::BinaryOperator::Multiply => "*",
                interpreter::BinaryOperator::Divide => "/",
                _ => "?",
            };
            Ok(format!("({} {} {})", left_rust, op_rust, right_rust))
        }
        _ => Ok("/* Unsupported expression */".to_string()),
    }
}

fn expression_to_c(expr: &interpreter::Expression) -> Result<String, String> {
    match expr {
        interpreter::Expression::Literal(value) => Ok(value_to_c(value)),
        interpreter::Expression::Variable(name) => Ok(name.clone()),
        interpreter::Expression::BinaryOp { left, operator, right } => {
            let left_c = expression_to_c(left)?;
            let right_c = expression_to_c(right)?;
            let op_c = match operator {
                interpreter::BinaryOperator::Add => "+",
                interpreter::BinaryOperator::Subtract => "-",
                interpreter::BinaryOperator::Multiply => "*",
                interpreter::BinaryOperator::Divide => "/",
                _ => "?",
            };
            Ok(format!("({} {} {})", left_c, op_c, right_c))
        }
        _ => Ok("/* Unsupported expression */".to_string()),
    }
}

fn value_to_javascript(value: &interpreter::Value) -> String {
    match value {
        interpreter::Value::Int(i) => i.to_string(),
        interpreter::Value::Float(f) => f.to_string(),
        interpreter::Value::Bool(b) => b.to_string(),
        interpreter::Value::String(s) => format!("\"{}\"", s),
        interpreter::Value::Null => "null".to_string(),
        _ => "/* Unsupported value */".to_string(),
    }
}

fn value_to_rust(value: &interpreter::Value) -> String {
    match value {
        interpreter::Value::Int(i) => i.to_string(),
        interpreter::Value::Float(f) => f.to_string(),
        interpreter::Value::Bool(b) => b.to_string(),
        interpreter::Value::String(s) => format!("\"{}\"", s),
        interpreter::Value::Null => "None".to_string(),
        _ => "/* Unsupported value */".to_string(),
    }
}

fn value_to_c(value: &interpreter::Value) -> String {
    match value {
        interpreter::Value::Int(i) => i.to_string(),
        interpreter::Value::Float(f) => f.to_string(),
        interpreter::Value::Bool(b) => if *b { "1" } else { "0" },
        interpreter::Value::String(s) => format!("\"{}\"", s),
        interpreter::Value::Null => "NULL".to_string(),
        _ => "/* Unsupported value */".to_string(),
    }
}

fn format_code(statements: &[interpreter::Statement]) -> String {
    // Simple formatter - in a real implementation, this would be more sophisticated
    let mut formatted = String::new();
    
    for statement in statements {
        formatted.push_str(&format_statement(statement));
        formatted.push('\n');
    }
    
    formatted
}

fn format_statement(statement: &interpreter::Statement) -> String {
    match statement {
        interpreter::Statement::VariableDeclaration { name, value, var_type } => {
            let type_annotation = if let Some(t) = var_type {
                format!(": {}", t)
            } else {
                String::new()
            };
            format!("let {}{} = {};", name, type_annotation, format_expression(value))
        }
        interpreter::Statement::FunctionDefinition { name, parameters, body, return_type } => {
            let params = parameters.join(", ");
            let return_type_annotation = if let Some(t) = return_type {
                format!(": {}", t)
            } else {
                String::new()
            };
            let mut body_formatted = String::new();
            for stmt in body {
                body_formatted.push_str(&format_statement(stmt));
                body_formatted.push('\n');
            }
            format!("function {}({}){} {{\n{}\n}}", name, params, return_type_annotation, body_formatted)
        }
        _ => "// Unsupported statement".to_string(),
    }
}

fn format_expression(expr: &interpreter::Expression) -> String {
    match expr {
        interpreter::Expression::Literal(value) => format_value(value),
        interpreter::Expression::Variable(name) => name.clone(),
        interpreter::Expression::BinaryOp { left, operator, right } => {
            let left_fmt = format_expression(left);
            let right_fmt = format_expression(right);
            let op_fmt = match operator {
                interpreter::BinaryOperator::Add => "+",
                interpreter::BinaryOperator::Subtract => "-",
                interpreter::BinaryOperator::Multiply => "*",
                interpreter::BinaryOperator::Divide => "/",
                _ => "?",
            };
            format!("{} {} {}", left_fmt, op_fmt, right_fmt)
        }
        _ => "/* Unsupported expression */".to_string(),
    }
}

fn format_value(value: &interpreter::Value) -> String {
    match value {
        interpreter::Value::Int(i) => i.to_string(),
        interpreter::Value::Float(f) => f.to_string(),
        interpreter::Value::Bool(b) => b.to_string(),
        interpreter::Value::String(s) => format!("\"{}\"", s),
        interpreter::Value::Null => "null".to_string(),
        _ => "/* Unsupported value */".to_string(),
    }
}

fn lint_code(statements: &[interpreter::Statement]) -> Vec<String> {
    let mut issues = Vec::new();
    
    // Simple linter - in a real implementation, this would be more sophisticated
    for statement in statements {
        match statement {
            interpreter::Statement::VariableDeclaration { name, .. } => {
                if name.len() > 50 {
                    issues.push(format!("Variable name '{}' is too long (max 50 characters)", name));
                }
                if name.starts_with("_") && name.len() > 1 {
                    issues.push(format!("Variable name '{}' should not start with underscore", name));
                }
            }
            interpreter::Statement::FunctionDefinition { name, .. } => {
                if name.len() > 50 {
                    issues.push(format!("Function name '{}' is too long (max 50 characters)", name));
                }
            }
            _ => {}
        }
    }
    
    issues
}

fn print_help() {
    println!("TauScript REPL Help:");
    println!("  help          - Show this help message");
    println!("  exit/quit     - Exit the REPL");
    println!("  clear         - Clear the screen");
    println!("  <expression>  - Evaluate an expression");
    println!("  <statement>   - Execute a statement");
    println!();
    println!("Examples:");
    println!("  let x = 42");
    println!("  x + 1");
    println!("  function add(a, b) { return a + b; }");
    println!("  add(5, 3)");
}
