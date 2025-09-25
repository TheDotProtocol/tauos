# TauScript Getting Started Guide

Welcome to TauScript, the ultimate programming language for modern development! This guide will help you get started with TauScript in just a few minutes.

## What is TauScript?

TauScript is a modern, powerful, and developer-friendly programming language designed for the future of software development. It combines the best features of multiple languages while introducing innovative concepts that make development faster, safer, and more enjoyable.

### Key Features

- **🚀 Modern Syntax**: Clean, readable, and intuitive syntax
- **⚡ High Performance**: Compiled to native code for maximum speed
- **🔒 Type Safety**: Strong typing system that prevents common errors
- **🌐 Universal**: Runs everywhere - web, desktop, mobile, server, and embedded
- **🤖 AI-Native**: Built-in AI and machine learning capabilities
- **🏢 Enterprise-Ready**: Security, scalability, and compliance features
- **📦 Rich Ecosystem**: Comprehensive standard library and package manager
- **🛠️ Developer Experience**: Best-in-class tooling and IDE support

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Install TauScript CLI

```bash
# Install TauScript CLI globally
npm install -g tau-cli

# Verify installation
tau version
```

### Alternative Installation Methods

```bash
# Using yarn
yarn global add tau-cli

# Using pnpm
pnpm add -g tau-cli

# Using Homebrew (macOS)
brew install tau-cli

# Using Chocolatey (Windows)
choco install tau-cli
```

## Your First TauScript Program

Let's create your first TauScript program:

### 1. Initialize a New Project

```bash
# Create a new TauScript project
tau init my-first-tau-app

# Navigate to the project directory
cd my-first-tau-app
```

### 2. Write Your First Program

Open `src/index.tau` and write:

```tau
// Hello World in TauScript
module Main {
    export func main(): void {
        console.log("Hello, TauScript!");
        console.log("Welcome to the future of programming!");
    }
}

// Run the application
Main.main();
```

### 3. Run Your Program

```bash
# Run the program
tau run

# Output:
# Hello, TauScript!
# Welcome to the future of programming!
```

## Basic Syntax

### Variables and Types

```tau
// Variable declarations
let name: string = "TauScript";
let version: number = 1.0;
let isAwesome: boolean = true;
let features: string[] = ["fast", "safe", "modern"];

// Type inference
let message = "Hello, World!"; // Automatically inferred as string
let count = 42; // Automatically inferred as number
```

### Functions

```tau
// Function declaration
func greet(name: string): string {
    return `Hello, ${name}!`;
}

// Arrow function
let add = (a: number, b: number): number => a + b;

// Function with default parameters
func createUser(name: string, age: number = 18): User {
    return { name, age };
}
```

### Classes and Objects

```tau
// Class definition
class Person {
    private name: string;
    private age: number;
    
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    public getName(): string {
        return this.name;
    }
    
    public getAge(): number {
        return this.age;
    }
    
    public greet(): string {
        return `Hello, I'm ${this.name} and I'm ${this.age} years old.`;
    }
}

// Usage
let person = new Person("Alice", 30);
console.log(person.greet());
```

### Control Flow

```tau
// If-else statements
if (age >= 18) {
    console.log("You are an adult");
} else if (age >= 13) {
    console.log("You are a teenager");
} else {
    console.log("You are a child");
}

// Switch statements
switch (day) {
    case "Monday":
        console.log("Start of the work week");
        break;
    case "Friday":
        console.log("TGIF!");
        break;
    default:
        console.log("Regular day");
}

// Loops
for (let i = 0; i < 10; i++) {
    console.log(`Count: ${i}`);
}

// For-of loop
for (let item of items) {
    console.log(item);
}

// While loop
while (condition) {
    // Do something
}
```

## Working with Data

### Arrays

```tau
// Array creation
let numbers: number[] = [1, 2, 3, 4, 5];
let fruits = ["apple", "banana", "orange"]; // Type inferred

// Array methods
let doubled = numbers.map(n => n * 2);
let evens = numbers.filter(n => n % 2 === 0);
let sum = numbers.reduce((acc, n) => acc + n, 0);

// Array destructuring
let [first, second, ...rest] = numbers;
```

### Objects

```tau
// Object creation
let user = {
    name: "John",
    age: 30,
    email: "john@example.com"
};

// Object methods
let userInfo = {
    name: "Jane",
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

// Object destructuring
let { name, age } = user;
```

### Async Programming

```tau
// Promises
func fetchData(): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Data fetched successfully!");
        }, 1000);
    });
}

// Async/await
async func processData(): Promise<void> {
    try {
        let data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
}
```

## Modules and Imports

### Creating Modules

```tau
// math.tau
module Math {
    export func add(a: number, b: number): number {
        return a + b;
    }
    
    export func multiply(a: number, b: number): number {
        return a * b;
    }
    
    export const PI = 3.14159;
}
```

### Importing Modules

```tau
// main.tau
import { Math } from "./math.tau";

let result = Math.add(5, 3);
console.log(result); // 8
```

## Error Handling

```tau
// Try-catch blocks
try {
    let result = riskyOperation();
    console.log(result);
} catch (error) {
    console.error("Something went wrong:", error.message);
} finally {
    console.log("Cleanup completed");
}

// Custom errors
class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

func validateAge(age: number): void {
    if (age < 0) {
        throw new ValidationError("Age cannot be negative");
    }
}
```

## Testing

### Writing Tests

```tau
// test/user.test.tau
import { User } from "../src/user.tau";

describe("User", () => {
    test("should create user with valid data", () => {
        let user = new User("Alice", 25);
        expect(user.getName()).toBe("Alice");
        expect(user.getAge()).toBe(25);
    });
    
    test("should throw error for invalid age", () => {
        expect(() => {
            new User("Bob", -5);
        }).toThrow("Age cannot be negative");
    });
});
```

### Running Tests

```bash
# Run all tests
tau test

# Run tests with coverage
tau test --coverage

# Run tests in watch mode
tau test --watch
```

## Building and Deployment

### Building for Production

```bash
# Build for JavaScript
tau build --target js

# Build for WebAssembly
tau build --target wasm

# Build for native code
tau build --target native

# Build with optimizations
tau build --optimize
```

### Package Management

```bash
# Install packages
tau install tau-web tau-ai

# Update packages
tau update

# Remove packages
tau remove tau-web

# Search packages
tau search "web framework"
```

## Next Steps

Now that you have the basics down, here are some next steps:

1. **📚 Learn More**: Check out our [comprehensive documentation](https://docs.tauscript.com)
2. **🎯 Build Projects**: Try building a web app, desktop app, or mobile app
3. **🤖 Explore AI**: Dive into our AI SDK for machine learning
4. **🏢 Enterprise Features**: Learn about security, scalability, and compliance
5. **👥 Join Community**: Connect with other TauScript developers

## Resources

- **📖 Documentation**: [docs.tauscript.com](https://docs.tauscript.com)
- **💬 Community**: [community.tauscript.com](https://community.tauscript.com)
- **📦 Packages**: [packages.tauscript.com](https://packages.tauscript.com)
- **🎓 Tutorials**: [tutorials.tauscript.com](https://tutorials.tauscript.com)
- **🐛 Issues**: [github.com/tauscript/tauscript](https://github.com/tauscript/tauscript)

## Support

Need help? We're here for you:

- **💬 Discord**: Join our Discord server for real-time help
- **📧 Email**: support@tauscript.com
- **📱 Twitter**: [@TauScript](https://twitter.com/tauscript)
- **📺 YouTube**: [TauScript Channel](https://youtube.com/tauscript)

Welcome to the future of programming with TauScript! 🚀
