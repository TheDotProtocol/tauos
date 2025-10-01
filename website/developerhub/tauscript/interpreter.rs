use std::collections::HashMap;
use std::fmt;
use serde::{Deserialize, Serialize};

/// TauScript Interpreter - Core Implementation
/// 
/// This is the main interpreter for the TauScript language.
/// It provides a complete runtime environment with support for:
/// - Variable management
/// - Function calls
/// - Control flow
/// - Error handling
/// - Memory management

#[derive(Debug, Clone, PartialEq)]
pub enum Value {
    Int(i64),
    Float(f64),
    Bool(bool),
    String(String),
    Array(Vec<Value>),
    Map(HashMap<String, Value>),
    Function(Function),
    Null,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Function {
    pub name: String,
    pub parameters: Vec<String>,
    pub body: Vec<Statement>,
    pub return_type: Option<String>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Statement {
    VariableDeclaration {
        name: String,
        value: Expression,
        var_type: Option<String>,
    },
    Assignment {
        name: String,
        value: Expression,
    },
    Expression(Expression),
    If {
        condition: Expression,
        then_branch: Vec<Statement>,
        else_branch: Option<Vec<Statement>>,
    },
    While {
        condition: Expression,
        body: Vec<Statement>,
    },
    For {
        variable: String,
        iterable: Expression,
        body: Vec<Statement>,
    },
    Return(Option<Expression>),
    FunctionDefinition {
        name: String,
        parameters: Vec<String>,
        body: Vec<Statement>,
        return_type: Option<String>,
    },
    Print(Expression),
}

#[derive(Debug, Clone, PartialEq)]
pub enum Expression {
    Literal(Value),
    Variable(String),
    BinaryOp {
        left: Box<Expression>,
        operator: BinaryOperator,
        right: Box<Expression>,
    },
    UnaryOp {
        operator: UnaryOperator,
        operand: Box<Expression>,
    },
    FunctionCall {
        name: String,
        arguments: Vec<Expression>,
    },
    ArrayAccess {
        array: Box<Expression>,
        index: Box<Expression>,
    },
    MapAccess {
        map: Box<Expression>,
        key: String,
    },
    Conditional {
        condition: Box<Expression>,
        then_expr: Box<Expression>,
        else_expr: Box<Expression>,
    },
}

#[derive(Debug, Clone, PartialEq)]
pub enum BinaryOperator {
    Add,
    Subtract,
    Multiply,
    Divide,
    Modulo,
    Equal,
    NotEqual,
    LessThan,
    LessThanOrEqual,
    GreaterThan,
    GreaterThanOrEqual,
    And,
    Or,
    Concat,
}

#[derive(Debug, Clone, PartialEq)]
pub enum UnaryOperator {
    Not,
    Negate,
    Increment,
    Decrement,
}

#[derive(Debug, Clone)]
pub struct Interpreter {
    pub variables: HashMap<String, Value>,
    pub functions: HashMap<String, Function>,
    pub call_stack: Vec<HashMap<String, Value>>,
}

impl Interpreter {
    pub fn new() -> Self {
        Self {
            variables: HashMap::new(),
            functions: HashMap::new(),
            call_stack: Vec::new(),
        }
    }

    pub fn interpret(&mut self, statements: Vec<Statement>) -> Result<Value, String> {
        for statement in statements {
            self.execute_statement(statement)?;
        }
        Ok(Value::Null)
    }

    fn execute_statement(&mut self, statement: Statement) -> Result<Value, String> {
        match statement {
            Statement::VariableDeclaration { name, value, var_type: _ } => {
                let value = self.evaluate_expression(value)?;
                self.variables.insert(name, value);
                Ok(Value::Null)
            }
            Statement::Assignment { name, value } => {
                let value = self.evaluate_expression(value)?;
                self.variables.insert(name, value);
                Ok(Value::Null)
            }
            Statement::Expression(expr) => {
                self.evaluate_expression(expr)
            }
            Statement::If { condition, then_branch, else_branch } => {
                let condition_value = self.evaluate_expression(condition)?;
                if self.is_truthy(condition_value) {
                    for stmt in then_branch {
                        self.execute_statement(stmt)?;
                    }
                } else if let Some(else_branch) = else_branch {
                    for stmt in else_branch {
                        self.execute_statement(stmt)?;
                    }
                }
                Ok(Value::Null)
            }
            Statement::While { condition, body } => {
                loop {
                    let condition_value = self.evaluate_expression(condition.clone())?;
                    if !self.is_truthy(condition_value) {
                        break;
                    }
                    for stmt in body.clone() {
                        self.execute_statement(stmt)?;
                    }
                }
                Ok(Value::Null)
            }
            Statement::For { variable, iterable, body } => {
                let iterable_value = self.evaluate_expression(iterable)?;
                if let Value::Array(array) = iterable_value {
                    for item in array {
                        self.variables.insert(variable.clone(), item);
                        for stmt in body.clone() {
                            self.execute_statement(stmt)?;
                        }
                    }
                }
                Ok(Value::Null)
            }
            Statement::Return(expr) => {
                if let Some(expr) = expr {
                    self.evaluate_expression(expr)
                } else {
                    Ok(Value::Null)
                }
            }
            Statement::FunctionDefinition { name, parameters, body, return_type } => {
                let function = Function {
                    name: name.clone(),
                    parameters,
                    body,
                    return_type,
                };
                self.functions.insert(name, function);
                Ok(Value::Null)
            }
            Statement::Print(expr) => {
                let value = self.evaluate_expression(expr)?;
                println!("{}", self.value_to_string(value));
                Ok(Value::Null)
            }
        }
    }

    fn evaluate_expression(&mut self, expr: Expression) -> Result<Value, String> {
        match expr {
            Expression::Literal(value) => Ok(value),
            Expression::Variable(name) => {
                self.variables.get(&name)
                    .cloned()
                    .ok_or_else(|| format!("Undefined variable: {}", name))
            }
            Expression::BinaryOp { left, operator, right } => {
                let left_value = self.evaluate_expression(*left)?;
                let right_value = self.evaluate_expression(*right)?;
                self.evaluate_binary_op(left_value, operator, right_value)
            }
            Expression::UnaryOp { operator, operand } => {
                let operand_value = self.evaluate_expression(*operand)?;
                self.evaluate_unary_op(operator, operand_value)
            }
            Expression::FunctionCall { name, arguments } => {
                let mut arg_values = Vec::new();
                for arg in arguments {
                    arg_values.push(self.evaluate_expression(arg)?);
                }
                self.call_function(name, arg_values)
            }
            Expression::ArrayAccess { array, index } => {
                let array_value = self.evaluate_expression(*array)?;
                let index_value = self.evaluate_expression(*index)?;
                self.access_array(array_value, index_value)
            }
            Expression::MapAccess { map, key } => {
                let map_value = self.evaluate_expression(*map)?;
                self.access_map(map_value, key)
            }
            Expression::Conditional { condition, then_expr, else_expr } => {
                let condition_value = self.evaluate_expression(*condition)?;
                if self.is_truthy(condition_value) {
                    self.evaluate_expression(*then_expr)
                } else {
                    self.evaluate_expression(*else_expr)
                }
            }
        }
    }

    fn evaluate_binary_op(&self, left: Value, operator: BinaryOperator, right: Value) -> Result<Value, String> {
        match operator {
            BinaryOperator::Add => self.add_values(left, right),
            BinaryOperator::Subtract => self.subtract_values(left, right),
            BinaryOperator::Multiply => self.multiply_values(left, right),
            BinaryOperator::Divide => self.divide_values(left, right),
            BinaryOperator::Modulo => self.modulo_values(left, right),
            BinaryOperator::Equal => Ok(Value::Bool(self.values_equal(left, right))),
            BinaryOperator::NotEqual => Ok(Value::Bool(!self.values_equal(left, right))),
            BinaryOperator::LessThan => self.compare_values(left, right, |a, b| a < b),
            BinaryOperator::LessThanOrEqual => self.compare_values(left, right, |a, b| a <= b),
            BinaryOperator::GreaterThan => self.compare_values(left, right, |a, b| a > b),
            BinaryOperator::GreaterThanOrEqual => self.compare_values(left, right, |a, b| a >= b),
            BinaryOperator::And => Ok(Value::Bool(self.is_truthy(left) && self.is_truthy(right))),
            BinaryOperator::Or => Ok(Value::Bool(self.is_truthy(left) || self.is_truthy(right))),
            BinaryOperator::Concat => self.concat_values(left, right),
        }
    }

    fn evaluate_unary_op(&self, operator: UnaryOperator, operand: Value) -> Result<Value, String> {
        match operator {
            UnaryOperator::Not => Ok(Value::Bool(!self.is_truthy(operand))),
            UnaryOperator::Negate => {
                match operand {
                    Value::Int(i) => Ok(Value::Int(-i)),
                    Value::Float(f) => Ok(Value::Float(-f)),
                    _ => Err("Cannot negate non-numeric value".to_string()),
                }
            }
            UnaryOperator::Increment => {
                match operand {
                    Value::Int(i) => Ok(Value::Int(i + 1)),
                    Value::Float(f) => Ok(Value::Float(f + 1.0)),
                    _ => Err("Cannot increment non-numeric value".to_string()),
                }
            }
            UnaryOperator::Decrement => {
                match operand {
                    Value::Int(i) => Ok(Value::Int(i - 1)),
                    Value::Float(f) => Ok(Value::Float(f - 1.0)),
                    _ => Err("Cannot decrement non-numeric value".to_string()),
                }
            }
        }
    }

    fn add_values(&self, left: Value, right: Value) -> Result<Value, String> {
        match (left, right) {
            (Value::Int(a), Value::Int(b)) => Ok(Value::Int(a + b)),
            (Value::Float(a), Value::Float(b)) => Ok(Value::Float(a + b)),
            (Value::Int(a), Value::Float(b)) => Ok(Value::Float(a as f64 + b)),
            (Value::Float(a), Value::Int(b)) => Ok(Value::Float(a + b as f64)),
            (Value::String(a), Value::String(b)) => Ok(Value::String(a + &b)),
            _ => Err("Cannot add these types".to_string()),
        }
    }

    fn subtract_values(&self, left: Value, right: Value) -> Result<Value, String> {
        match (left, right) {
            (Value::Int(a), Value::Int(b)) => Ok(Value::Int(a - b)),
            (Value::Float(a), Value::Float(b)) => Ok(Value::Float(a - b)),
            (Value::Int(a), Value::Float(b)) => Ok(Value::Float(a as f64 - b)),
            (Value::Float(a), Value::Int(b)) => Ok(Value::Float(a - b as f64)),
            _ => Err("Cannot subtract these types".to_string()),
        }
    }

    fn multiply_values(&self, left: Value, right: Value) -> Result<Value, String> {
        match (left, right) {
            (Value::Int(a), Value::Int(b)) => Ok(Value::Int(a * b)),
            (Value::Float(a), Value::Float(b)) => Ok(Value::Float(a * b)),
            (Value::Int(a), Value::Float(b)) => Ok(Value::Float(a as f64 * b)),
            (Value::Float(a), Value::Int(b)) => Ok(Value::Float(a * b as f64)),
            _ => Err("Cannot multiply these types".to_string()),
        }
    }

    fn divide_values(&self, left: Value, right: Value) -> Result<Value, String> {
        match (left, right) {
            (Value::Int(a), Value::Int(b)) => {
                if b == 0 {
                    Err("Division by zero".to_string())
                } else {
                    Ok(Value::Float(a as f64 / b as f64))
                }
            }
            (Value::Float(a), Value::Float(b)) => {
                if b == 0.0 {
                    Err("Division by zero".to_string())
                } else {
                    Ok(Value::Float(a / b))
                }
            }
            (Value::Int(a), Value::Float(b)) => {
                if b == 0.0 {
                    Err("Division by zero".to_string())
                } else {
                    Ok(Value::Float(a as f64 / b))
                }
            }
            (Value::Float(a), Value::Int(b)) => {
                if b == 0 {
                    Err("Division by zero".to_string())
                } else {
                    Ok(Value::Float(a / b as f64))
                }
            }
            _ => Err("Cannot divide these types".to_string()),
        }
    }

    fn modulo_values(&self, left: Value, right: Value) -> Result<Value, String> {
        match (left, right) {
            (Value::Int(a), Value::Int(b)) => {
                if b == 0 {
                    Err("Modulo by zero".to_string())
                } else {
                    Ok(Value::Int(a % b))
                }
            }
            _ => Err("Cannot perform modulo on these types".to_string()),
        }
    }

    fn compare_values<F>(&self, left: Value, right: Value, compare_fn: F) -> Result<Value, String>
    where
        F: FnOnce(f64, f64) -> bool,
    {
        let left_num = self.value_to_number(left)?;
        let right_num = self.value_to_number(right)?;
        Ok(Value::Bool(compare_fn(left_num, right_num)))
    }

    fn concat_values(&self, left: Value, right: Value) -> Result<Value, String> {
        let left_str = self.value_to_string(left);
        let right_str = self.value_to_string(right);
        Ok(Value::String(left_str + &right_str))
    }

    fn call_function(&mut self, name: String, arguments: Vec<Value>) -> Result<Value, String> {
        let function = self.functions.get(&name)
            .ok_or_else(|| format!("Undefined function: {}", name))?
            .clone();

        if arguments.len() != function.parameters.len() {
            return Err(format!(
                "Expected {} arguments, got {}",
                function.parameters.len(),
                arguments.len()
            ));
        }

        // Create new scope
        let mut new_scope = HashMap::new();
        for (param, arg) in function.parameters.iter().zip(arguments.iter()) {
            new_scope.insert(param.clone(), arg.clone());
        }

        // Save current scope and set new scope
        let old_variables = std::mem::replace(&mut self.variables, new_scope);
        self.call_stack.push(old_variables);

        // Execute function body
        let mut result = Value::Null;
        for statement in function.body {
            result = self.execute_statement(statement)?;
        }

        // Restore scope
        self.variables = self.call_stack.pop().unwrap();

        Ok(result)
    }

    fn access_array(&self, array: Value, index: Value) -> Result<Value, String> {
        match (array, index) {
            (Value::Array(arr), Value::Int(idx)) => {
                if idx < 0 || idx as usize >= arr.len() {
                    Err("Array index out of bounds".to_string())
                } else {
                    Ok(arr[idx as usize].clone())
                }
            }
            _ => Err("Cannot access array with this index type".to_string()),
        }
    }

    fn access_map(&self, map: Value, key: String) -> Result<Value, String> {
        match map {
            Value::Map(m) => {
                m.get(&key)
                    .cloned()
                    .ok_or_else(|| format!("Key not found: {}", key))
            }
            _ => Err("Cannot access map with this value type".to_string()),
        }
    }

    fn is_truthy(&self, value: Value) -> bool {
        match value {
            Value::Bool(b) => b,
            Value::Int(i) => i != 0,
            Value::Float(f) => f != 0.0,
            Value::String(s) => !s.is_empty(),
            Value::Array(a) => !a.is_empty(),
            Value::Map(m) => !m.is_empty(),
            Value::Null => false,
            Value::Function(_) => true,
        }
    }

    fn values_equal(&self, left: Value, right: Value) -> bool {
        match (left, right) {
            (Value::Int(a), Value::Int(b)) => a == b,
            (Value::Float(a), Value::Float(b)) => (a - b).abs() < f64::EPSILON,
            (Value::Bool(a), Value::Bool(b)) => a == b,
            (Value::String(a), Value::String(b)) => a == b,
            (Value::Array(a), Value::Array(b)) => a == b,
            (Value::Map(a), Value::Map(b)) => a == b,
            (Value::Null, Value::Null) => true,
            _ => false,
        }
    }

    fn value_to_number(&self, value: Value) -> Result<f64, String> {
        match value {
            Value::Int(i) => Ok(i as f64),
            Value::Float(f) => Ok(f),
            Value::String(s) => s.parse::<f64>()
                .map_err(|_| "Cannot convert string to number".to_string()),
            _ => Err("Cannot convert value to number".to_string()),
        }
    }

    fn value_to_string(&self, value: Value) -> String {
        match value {
            Value::Int(i) => i.to_string(),
            Value::Float(f) => f.to_string(),
            Value::Bool(b) => b.to_string(),
            Value::String(s) => s,
            Value::Array(a) => {
                let items: Vec<String> = a.iter()
                    .map(|v| self.value_to_string(v.clone()))
                    .collect();
                format!("[{}]", items.join(", "))
            }
            Value::Map(m) => {
                let pairs: Vec<String> = m.iter()
                    .map(|(k, v)| format!("{}: {}", k, self.value_to_string(v.clone())))
                    .collect();
                format!("{{{}}}", pairs.join(", "))
            }
            Value::Null => "null".to_string(),
            Value::Function(f) => format!("<function {}>", f.name),
        }
    }
}

impl fmt::Display for Value {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.value_to_string(self.clone()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_arithmetic() {
        let mut interpreter = Interpreter::new();
        
        // Test: let x = 5 + 3
        let statements = vec![
            Statement::VariableDeclaration {
                name: "x".to_string(),
                value: Expression::BinaryOp {
                    left: Box::new(Expression::Literal(Value::Int(5))),
                    operator: BinaryOperator::Add,
                    right: Box::new(Expression::Literal(Value::Int(3))),
                },
                var_type: None,
            }
        ];
        
        interpreter.interpret(statements).unwrap();
        assert_eq!(interpreter.variables.get("x"), Some(&Value::Int(8)));
    }

    #[test]
    fn test_function_definition() {
        let mut interpreter = Interpreter::new();
        
        // Test: function add(a, b) { return a + b }
        let statements = vec![
            Statement::FunctionDefinition {
                name: "add".to_string(),
                parameters: vec!["a".to_string(), "b".to_string()],
                body: vec![
                    Statement::Return(Some(Expression::BinaryOp {
                        left: Box::new(Expression::Variable("a".to_string())),
                        operator: BinaryOperator::Add,
                        right: Box::new(Expression::Variable("b".to_string())),
                    }))
                ],
                return_type: None,
            }
        ];
        
        interpreter.interpret(statements).unwrap();
        assert!(interpreter.functions.contains_key("add"));
    }

    #[test]
    fn test_conditional() {
        let mut interpreter = Interpreter::new();
        
        // Test: if (5 > 3) { print("true") }
        let statements = vec![
            Statement::If {
                condition: Expression::BinaryOp {
                    left: Box::new(Expression::Literal(Value::Int(5))),
                    operator: BinaryOperator::GreaterThan,
                    right: Box::new(Expression::Literal(Value::Int(3))),
                },
                then_branch: vec![
                    Statement::Print(Expression::Literal(Value::String("true".to_string())))
                ],
                else_branch: None,
            }
        ];
        
        interpreter.interpret(statements).unwrap();
        // Should print "true" to console
    }
}
