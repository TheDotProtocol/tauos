# Tau SDK Testing Guide

This guide explains how to test the Tau OS Developer SDK functionality.

## Prerequisites

Before testing the SDK, ensure you have the following installed:

### Required Dependencies

1. **Rust and Cargo** (1.70+)
   ```bash
   # Install Rust via rustup
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. **Linux Development Tools**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install build-essential gcc make
   
   # CentOS/RHEL
   sudo yum groupinstall "Development Tools"
   ```

3. **QEMU** (for testing)
   ```bash
   # Ubuntu/Debian
   sudo apt install qemu-system-x86 qemu-utils
   
   # CentOS/RHEL
   sudo yum install qemu-system-x86
   ```

4. **Docker** (optional, for container testing)
   ```bash
   # Ubuntu/Debian
   sudo apt install docker.io
   sudo systemctl start docker
   sudo usermod -aG docker $USER
   ```

## Building the SDK

1. **Clone the repository**
   ```bash
   git clone https://github.com/tauos/tauos.git
   cd tauos/sdk
   ```

2. **Build the SDK**
   ```bash
   cargo build --release
   ```

3. **Install the SDK**
   ```bash
   # Install to system
   sudo cp target/release/tau-sdk /usr/local/bin/
   
   # Or add to PATH
   export PATH="$PWD/target/release:$PATH"
   ```

## Testing the SDK

### 1. Basic Functionality Test

Test that the SDK can be built and basic commands work:

```bash
# Test help command
tau-sdk --help

# Test version
tau-sdk --version

# Test init command help
tau-sdk init --help
```

### 2. Application Creation Test

Test creating a new application:

```bash
# Create a test application
tau-sdk init test-app --lang rust --template rust-basic

# Verify the application was created
ls -la test-app/
cat test-app/tauapp.toml
cat test-app/Cargo.toml
cat test-app/src/main.rs
```

### 3. Build Test

Test building the application:

```bash
cd test-app

# Build in debug mode
tau-sdk build

# Verify binary was created
ls -la target/debug/test-app

# Build in release mode
tau-sdk build --release

# Verify release binary was created
ls -la target/release/test-app
```

### 4. Run Test

Test running the application:

```bash
# Run the application
tau-sdk run

# Run with arguments
tau-sdk run -- --help
```

### 5. Package Test

Test packaging the application:

```bash
# Create unsigned package
tau-sdk package

# Verify package was created
ls -la *.tauapp

# Create signed package
tau-sdk package --sign

# Verify signed package was created
ls -la *.tauapp
```

### 6. Validate Test

Test manifest validation:

```bash
# Validate the manifest
tau-sdk validate
```

### 7. Documentation Test

Test documentation generation:

```bash
# Generate documentation
tau-sdk docs

# Verify documentation was created
ls -la docs/
cat docs/README.md
```

### 8. Test Command

Test the testing functionality:

```bash
# Run local tests
tau-sdk test

# Run with custom config
echo 'environment = "local"' > test-config.toml
tau-sdk test --config test-config.toml
```

## Integration Tests

### 1. Hello World Example

Test the provided Hello World example:

```bash
cd examples/hello-world

# Build the example
cargo build --release

# Test the SDK commands
tau-sdk validate
tau-sdk build
tau-sdk run
tau-sdk package
```

### 2. Template Tests

Test all available templates:

```bash
# Test Rust basic template
tau-sdk init rust-test --lang rust --template rust-basic
cd rust-test
tau-sdk build
tau-sdk run

# Test Rust GUI template
tau-sdk init rust-gui-test --lang rust --template rust-gui
cd rust-gui-test
tau-sdk build

# Test C template
tau-sdk init c-test --lang c --template c-basic
cd c-test
tau-sdk build

# Test Python template
tau-sdk init python-test --lang python --template python-basic
cd python-test
tau-sdk run

# Test Web template
tau-sdk init web-test --lang web --template web-basic
cd web-test
tau-sdk run
```

## Advanced Testing

### 1. QEMU Testing

Test QEMU integration:

```bash
# Create QEMU test config
cat > test-qemu.toml << EOF
environment = "qemu"
[qemu]
arch = "x86_64"
machine = "q35"
memory = 2048
cores = 2
EOF

# Run QEMU tests
tau-sdk test --config test-qemu.toml
```

### 2. Container Testing

Test container integration:

```bash
# Create container test config
cat > test-container.toml << EOF
environment = "container"
timeout = 300
EOF

# Run container tests
tau-sdk test --config test-container.toml
```

### 3. Publishing Test

Test publishing to TauStore (requires API key):

```bash
# Set API key
export TAU_API_KEY="your-api-key-here"

# Test publishing
tau-sdk publish --api-key $TAU_API_KEY
```

## Unit Tests

Run the SDK's unit tests:

```bash
# Run all tests
cargo test

# Run specific test modules
cargo test manifest
cargo test templates
cargo test build
cargo test package
cargo test run
cargo test test
cargo test publish
cargo test config
cargo test utils
```

## Performance Tests

Test SDK performance:

```bash
# Test build performance
time tau-sdk build --release

# Test package creation performance
time tau-sdk package --sign

# Test application startup time
time tau-sdk run
```

## Security Tests

Test security features:

```bash
# Test sandboxing
tau-sdk run --sandbox

# Test permission validation
# Create a manifest with invalid permissions and test validation
echo 'permissions = [{ name = "invalid-permission" }]' >> tauapp.toml
tau-sdk validate  # Should fail

# Test package signing
tau-sdk package --sign
# Verify signature manually
```

## Error Handling Tests

Test error conditions:

```bash
# Test with invalid manifest
echo 'invalid = "manifest"' > tauapp.toml
tau-sdk validate  # Should fail

# Test with missing binary
rm target/release/test-app
tau-sdk run  # Should fail

# Test with invalid template
tau-sdk init test --template invalid-template  # Should fail
```

## Configuration Tests

Test configuration management:

```bash
# Test default configuration
tau-sdk init test-app
cat ~/.tau/sdk/config.toml

# Test custom configuration
export TAU_SDK_CONFIG="/tmp/custom-config.toml"
tau-sdk init test-app2
```

## Cleanup

After testing, clean up test files:

```bash
# Remove test applications
rm -rf test-app test-app2 rust-test rust-gui-test c-test python-test web-test

# Remove test packages
rm -f *.tauapp

# Remove test documentation
rm -rf docs/

# Remove test configuration
rm -f test-config.toml test-qemu.toml test-container.toml
```

## Continuous Integration

For CI/CD testing, create a `.github/workflows/test.yml` file:

```yaml
name: Test Tau SDK

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Install Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
    
    - name: Install dependencies
      run: |
        sudo apt update
        sudo apt install -y build-essential gcc make qemu-system-x86
    
    - name: Build SDK
      run: |
        cd tauos/sdk
        cargo build --release
    
    - name: Run tests
      run: |
        cd tauos/sdk
        cargo test
        ./target/release/tau-sdk --help
    
    - name: Test application creation
      run: |
        cd tauos/sdk
        ./target/release/tau-sdk init test-app --lang rust --template rust-basic
        cd test-app
        cargo build
```

## Troubleshooting

### Common Issues

1. **Rust not found**: Install Rust via rustup
2. **QEMU not found**: Install QEMU system packages
3. **Permission denied**: Check file permissions and sandbox settings
4. **Build failures**: Check dependencies and target architecture
5. **Network errors**: Check internet connection and firewall settings

### Debug Mode

Enable debug logging:

```bash
export RUST_LOG=debug
tau-sdk init test-app --lang rust
```

### Verbose Output

Enable verbose output:

```bash
tau-sdk --log-level debug init test-app
```

## Reporting Issues

When reporting issues, include:

1. **System information**: OS, architecture, Rust version
2. **SDK version**: `tau-sdk --version`
3. **Error messages**: Full error output
4. **Steps to reproduce**: Detailed steps
5. **Expected behavior**: What should happen
6. **Actual behavior**: What actually happened

## Contributing Tests

When adding new features, include corresponding tests:

1. **Unit tests**: Test individual functions
2. **Integration tests**: Test feature interactions
3. **End-to-end tests**: Test complete workflows
4. **Performance tests**: Test performance impact
5. **Security tests**: Test security implications 