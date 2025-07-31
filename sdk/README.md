# Tau OS Developer SDK

The Tau OS Developer SDK provides tools for creating, building, testing, and publishing applications for Tau OS.

## Features

- **Application Scaffolding**: Create new Tau applications with templates for Rust, C, Python, and Web
- **Build System**: Compile applications for different targets and architectures
- **Packaging**: Create `.tauapp` packages with signing support
- **Testing**: Run applications in local, QEMU, or container environments
- **Publishing**: Upload applications to TauStore with metadata
- **Sandboxing**: Run applications in secure sandboxed environments
- **Documentation**: Auto-generate documentation for applications

## Installation

### Prerequisites

- Rust 1.70+ and Cargo
- Linux development tools (gcc, make, etc.)
- QEMU (optional, for testing)
- Docker (optional, for container testing)

### Building from Source

```bash
cd tauos/sdk
cargo build --release
```

### Installation

```bash
# Install to system
sudo cp target/release/tau-sdk /usr/local/bin/

# Or add to PATH
export PATH="$PWD/target/release:$PATH"
```

## Quick Start

### 1. Initialize a New Application

```bash
# Create a new Rust application
tau-sdk init my-app --lang rust --template rust-basic

# Create a GUI application
tau-sdk init my-gui-app --lang rust --template rust-gui

# Create a Python application
tau-sdk init my-python-app --lang python --template python-basic
```

### 2. Build the Application

```bash
cd my-app
tau-sdk build
```

### 3. Run the Application

```bash
# Run in local environment
tau-sdk run

# Run with arguments
tau-sdk run -- --help
```

### 4. Test the Application

```bash
# Run tests locally
tau-sdk test

# Run tests in QEMU (requires QEMU installation)
tau-sdk test --config test-qemu.toml
```

### 5. Package the Application

```bash
# Create unsigned package
tau-sdk package

# Create signed package
tau-sdk package --sign
```

### 6. Publish to TauStore

```bash
# Publish with API key
tau-sdk publish --api-key YOUR_API_KEY
```

## Command Reference

### `tau-sdk init`

Initialize a new Tau application.

```bash
tau-sdk init <name> [OPTIONS]

OPTIONS:
    --lang <LANG>          Programming language (rust, c, python, web)
    --template <TEMPLATE>   Template to use (rust-basic, rust-gui, c-basic, python-basic, web-basic)
    --output <OUTPUT>       Output directory (default: current directory)
```

### `tau-sdk build`

Build the application.

```bash
tau-sdk build [OPTIONS]

OPTIONS:
    --target <TARGET>       Build target (default: x86_64-unknown-linux-gnu)
    --release               Build in release mode
```

### `tau-sdk run`

Run the application in sandbox.

```bash
tau-sdk run [OPTIONS] [ARGS]...

OPTIONS:
    --sandbox              Use sandboxd for enhanced security
```

### `tau-sdk test`

Test the application.

```bash
tau-sdk test [OPTIONS]

OPTIONS:
    --config <CONFIG>       Test configuration file
```

### `tau-sdk package`

Package the application.

```bash
tau-sdk package [OPTIONS]

OPTIONS:
    --output <OUTPUT>       Output file path
    --sign                  Sign the package
```

### `tau-sdk publish`

Publish to TauStore.

```bash
tau-sdk publish [OPTIONS]

OPTIONS:
    --endpoint <ENDPOINT>   TauStore API endpoint
    --api-key <API_KEY>     Developer API key
```

### `tau-sdk docs`

Generate documentation.

```bash
tau-sdk docs [OPTIONS]

OPTIONS:
    --output <OUTPUT>       Output directory (default: docs)
```

### `tau-sdk validate`

Validate application manifest.

```bash
tau-sdk validate
```

## Application Manifest

Applications are defined by a `tauapp.toml` manifest file:

```toml
id = "com.example.myapp"
name = "My Application"
version = "0.1.0"
description = "A sample Tau OS application"
author = "Your Name <your.email@example.com>"
license = "MIT"
category = "utilities"

main = "src/main.rs"

[entry_points.default]
exec = "target/release/myapp"
args = []
env = {}
cwd = null

permissions = [
    { name = "network", description = "Network access", level = "optional" },
    { name = "filesystem", description = "File system access", level = "required" }
]

dependencies = { system = [], runtime = [], dev = [] }

[build]
target = "x86_64-unknown-linux-gnu"
flags = []
env = {}
pre_build = []
post_build = []

[runtime]
sandbox_level = "normal"
resources = { memory_mb = 512, cpu_percent = 100, disk_mb = 100, network_kbps = 1024 }
env = {}
cwd = null

[store]
tags = ["example", "demo"]
screenshots = []
website = null
repository = null
support = null
```

## Templates

The SDK provides several templates:

### Rust Templates

- **rust-basic**: Basic Rust application with logging and error handling
- **rust-gui**: Rust GUI application with GTK4

### C Templates

- **c-basic**: Basic C application with Makefile

### Python Templates

- **python-basic**: Python application with Click CLI framework

### Web Templates

- **web-basic**: Web application with Express.js

## Configuration

The SDK configuration is stored in `~/.tau/sdk/config.toml`:

```toml
version = "0.1.0"
taustore_endpoint = "https://taustore.tauos.com"
api_key = null
default_target = "x86_64-unknown-linux-gnu"
default_template = "rust-basic"

[qemu]
binary_path = null
default_arch = "x86_64"
default_machine = "q35"
default_memory = 2048
default_cores = 2
default_disk_image = null

[build]
default_build_type = "debug"
default_optimization = "0"
parallel_jobs = 8
build_timeout = 600
auto_clean = false

[test]
default_environment = "local"
test_timeout = 300
auto_generate_tests = true
coverage_reporting = false

[publish]
auto_sign = true
require_api_key = true
auto_validate = true
publish_timeout = 300

[developer]
name = null
email = null
website = null
organization = null
default_license = "MIT"
default_category = "other"
```

## Security

The SDK includes several security features:

- **Sandboxing**: Applications run in isolated environments
- **Permission System**: Fine-grained permission control
- **Package Signing**: Cryptographic signature verification
- **Resource Limits**: Memory, CPU, and disk usage limits

## Testing

### Local Testing

Applications can be tested locally with:

```bash
tau-sdk test
```

### QEMU Testing

For more comprehensive testing, use QEMU:

```bash
# Install QEMU
sudo apt install qemu-system-x86

# Run tests in QEMU
tau-sdk test --config test-qemu.toml
```

### Container Testing

For isolated testing environments:

```bash
# Install Docker
sudo apt install docker.io

# Run tests in container
tau-sdk test --config test-container.toml
```

## Examples

See the `examples/` directory for sample applications:

- `hello-world/`: Basic Hello World application
- `gui-app/`: GTK4 GUI application
- `web-app/`: Web application

## Development

### Building the SDK

```bash
cargo build
cargo test
cargo clippy
```

### Running Tests

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_manifest_validation
```

### Code Style

The project uses:

- `rustfmt` for code formatting
- `clippy` for linting
- `cargo test` for testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- Documentation: [docs.tauos.com](https://docs.tauos.com)
- Issues: [GitHub Issues](https://github.com/tauos/tauos/issues)
- Community: [Discord](https://discord.gg/tauos) 