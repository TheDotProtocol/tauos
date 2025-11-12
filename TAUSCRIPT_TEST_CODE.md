# TauScript Test Code

## Quick Links

- **TauScript Landing Page**: http://localhost:3003/tauscript
- **TauStudio IDE**: http://localhost:3000/ide
- **TauScript Documentation**: http://localhost:3003/docs/tauscript

## Sample Code to Test

### 1. Basic Hello World

```tau
// hello.tau - Basic TauScript program
fn main() {
    print("Hello, TauScript!");
    print("Welcome to the privacy-first programming language");
}
```

### 2. Variables and Types

```tau
// variables.tau - Demonstrating type system
fn main() {
    // Type inference
    let name = "TauScript";
    let version = 1.0;
    let isReady = true;
    
    // Explicit types
    let count: i32 = 42;
    let pi: f64 = 3.14159;
    
    print(`Language: ${name}`);
    print(`Version: ${version}`);
    print(`Ready: ${isReady}`);
    print(`Count: ${count}`);
    print(`PI: ${pi}`);
}
```

### 3. Functions and Error Handling

```tau
// functions.tau - Demonstrating functions and result types
fn divide(a: f64, b: f64) -> result<f64, string> {
    if b == 0.0 {
        return err("Division by zero");
    }
    return ok(a / b);
}

fn main() {
    match divide(10.0, 2.0) {
        ok(value) => print(`Result: ${value}`),
        err(msg) => print(`Error: ${msg}`)
    }
    
    match divide(10.0, 0.0) {
        ok(value) => print(`Result: ${value}`),
        err(msg) => print(`Error: ${msg}`)
    }
}
```

### 4. Collections and Loops

```tau
// collections.tau - Working with arrays and maps
fn main() {
    // Array
    let apps = ["Desktop", "Mobile", "Web", "Cloud"];
    
    print("TauScript runs on:");
    for app in apps {
        print(`  - ${app}`);
    }
    
    // Map
    let features = map {
        "privacy" => "Zero telemetry",
        "performance" => "Near-native speed",
        "ai" => "Built-in AI primitives"
    };
    
    print("\nFeatures:");
    for (key, value) in features {
        print(`  ${key}: ${value}`);
    }
}
```

### 5. Async/Await

```tau
// async.tau - Demonstrating async programming
async fn fetchData(url: string) -> result<string, string> {
    // Simulate async operation
    await sleep(1000);
    return ok(`Data from ${url}`);
}

async fn main() {
    print("Fetching data...");
    
    match await fetchData("https://api.example.com/data") {
        ok(data) => print(`Success: ${data}`),
        err(msg) => print(`Error: ${msg}`)
    }
}
```

### 6. AI Integration Example

```tau
// ai_example.tau - Demonstrating built-in AI capabilities
import tau.ai;

async fn main() {
    // Local AI inference (no external API calls)
    let model = ai.loadModel("local-llm");
    
    let prompt = "Explain privacy-first computing";
    let response = await model.infer(prompt);
    
    print("AI Response:");
    print(response);
    
    // Federated learning example
    let federatedModel = ai.createFederatedModel();
    await federatedModel.trainLocal();
    await federatedModel.sync();
}
```

### 7. Privacy-First Data Processing

```tau
// privacy.tau - Demonstrating privacy features
import std.crypto;
import std.encryption;

fn main() {
    let data = "Sensitive user data";
    
    // Encrypt data
    let encrypted = encryption.encrypt(data, "user-key");
    print(`Encrypted: ${encrypted}`);
    
    // Decrypt data
    let decrypted = encryption.decrypt(encrypted, "user-key");
    print(`Decrypted: ${decrypted}`);
    
    // Hash for privacy-preserving analytics
    let hash = crypto.sha256(data);
    print(`Hash: ${hash}`);
}
```

### 8. Complete Example: Simple Calculator

```tau
// calculator.tau - Complete example with error handling
fn calculate(operation: string, a: f64, b: f64) -> result<f64, string> {
    match operation {
        "add" => ok(a + b),
        "subtract" => ok(a - b),
        "multiply" => ok(a * b),
        "divide" => {
            if b == 0.0 {
                return err("Division by zero");
            }
            return ok(a / b);
        },
        _ => err(`Unknown operation: ${operation}`)
    }
}

fn main() {
    let operations = [
        ("add", 10.0, 5.0),
        ("subtract", 10.0, 5.0),
        ("multiply", 10.0, 5.0),
        ("divide", 10.0, 5.0),
        ("divide", 10.0, 0.0)
    ];
    
    for (op, a, b) in operations {
        match calculate(op, a, b) {
            ok(result) => print(`${op}(${a}, ${b}) = ${result}`),
            err(msg) => print(`Error: ${msg}`)
        }
    }
}
```

## How to Test

1. **Open TauStudio IDE**: http://localhost:3000/ide
2. **Create a new file**: Click "New File" or use the file explorer
3. **Copy one of the sample codes** above
4. **Run the code**: Click the "Run" button or use the terminal
5. **View output**: Check the terminal/console output

## Expected Output Examples

### For hello.tau:
```
Hello, TauScript!
Welcome to the privacy-first programming language
```

### For calculator.tau:
```
add(10, 5) = 15
subtract(10, 5) = 5
multiply(10, 5) = 50
divide(10, 5) = 2
Error: Division by zero
```

## Features to Test

- ✅ Type inference and explicit types
- ✅ Error handling with result<T, E>
- ✅ Pattern matching
- ✅ Async/await operations
- ✅ Collections (arrays, maps)
- ✅ Privacy-first features (encryption, hashing)
- ✅ AI integration (if available)
- ✅ Cross-platform compatibility

