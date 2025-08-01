# Enhanced TauPkg: Tau OS Package Manager

TauPkg is the official package manager for Tau OS, designed for speed, security, and simplicity. This enhanced version includes full dependency resolution, automatic runtime dependency installation, package signature verification, and fail-safe rollback capabilities.

## Key Features

### 🔐 Security Features
- **Cryptographic Signature Verification**: All packages are verified using Ed25519 or RSA signatures
- **Trusted Key Management**: Centralized trusted key store with automatic verification
- **Checksum Validation**: SHA256 checksums ensure package integrity
- **Secure Installation**: Packages are installed with proper permissions and isolation

### 📦 Dependency Management
- **Full Dependency Resolution**: Automatically resolves and installs all required dependencies
- **Circular Dependency Detection**: Prevents installation of packages with circular dependencies
- **Optional Dependencies**: Smart handling of optional dependencies based on availability
- **Reverse Dependency Tracking**: Prevents removal of packages that other packages depend on

### 🔄 Rollback & Recovery
- **Automatic Backups**: Creates backups before installing/updating packages
- **Fail-Safe Rollback**: Automatic rollback if installation fails
- **Manual Rollback**: Ability to rollback to previous package versions
- **State Persistence**: Maintains installation state across reboots

### 🚀 Performance & Reliability
- **Parallel Downloads**: Downloads packages and dependencies in parallel when possible
- **Caching**: Local cache for package metadata and downloaded packages
- **Resume Downloads**: Ability to resume interrupted downloads
- **Atomic Operations**: Package installations are atomic - either complete or rolled back

## Installation & Setup

### Prerequisites
```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install build dependencies
sudo apt install build-essential pkg-config libssl-dev
```

### Building TauPkg
```bash
cd pkgmgr
cargo build --release
sudo cp target/release/tau-pkg /usr/bin/
```

### Initial Configuration
```bash
# Create configuration directories
sudo mkdir -p /etc/tau-pkg
sudo mkdir -p /var/lib/tau-pkg
sudo mkdir -p /var/cache/tau-pkg

# Add trusted keys (example)
echo "YOUR_TRUSTED_PUBLIC_KEY_BASE64" | sudo tee /etc/tau-pkg/trusted-keys
```

## Usage

### Basic Commands

#### Install Packages
```bash
# Install a package with all dependencies
tau-pkg install my-app

# Install without dependencies (advanced users only)
tau-pkg install my-app --no-deps

# Install with custom root directory
tau-pkg install my-app --root /custom/path
```

#### Remove Packages
```bash
# Remove a package (fails if other packages depend on it)
tau-pkg remove my-app

# Force remove (may break dependencies)
tau-pkg remove my-app --force
```

#### Update Packages
```bash
# Update a specific package
tau-pkg update my-app

# Update all packages
tau-pkg update --all

# Update system packages
tau-pkg update
```

#### Search & List
```bash
# Search for packages
tau-pkg search "text editor"

# Search with detailed information
tau-pkg search "text editor" --detailed

# List installed packages
tau-pkg list

# List with detailed information
tau-pkg list --detailed
```

#### Repository Management
```bash
# Sync repository index
tau-pkg sync

# Verify package signatures
tau-pkg verify my-app
```

#### Rollback Operations
```bash
# Rollback a package to previous version
tau-pkg rollback my-app
```

### Advanced Usage

#### Verbose Output
```bash
# Enable verbose logging
tau-pkg install my-app --verbose

# Quiet mode (errors only)
tau-pkg install my-app --quiet
```

#### Custom Installation Root
```bash
# Install to custom location
tau-pkg install my-app --root /opt/tauos
```

## Package Format

### Manifest Structure (`manifest.toml`)
```toml
name = "my-app"
version = "1.0.0"
description = "A sample application for Tau OS"
author = "Your Name <your.email@example.com>"
license = "MIT"

# Required dependencies
dependencies = [
    { name = "gtk4", version = "4.0.0" },
    { name = "glib", version = "2.0.0" }
]

# Optional dependencies
optional_dependencies = [
    { name = "python3", version = "3.8.0", optional = true }
]

# Permissions for sandboxing
permissions = [
    "network",
    "filesystem:ro",
    "camera"
]

# Package signature
[signature]
algorithm = "ed25519"
signature = "base64_encoded_signature"
public_key = "base64_encoded_public_key"

# Package files
files = [
    "bin/my-app",
    "share/applications/my-app.desktop",
    "share/icons/my-app.png"
]

# Installation scripts
[scripts]
pre_install = "echo 'Pre-installation script'"
post_install = "echo 'Post-installation script'"

# Architecture and size
architecture = "x86_64"
size = 1048576
checksum = "sha256_hash_of_package"
```

### Package Archive Structure
```
my-app-1.0.0.taupkg
├── manifest.toml          # Package manifest
├── bin/                   # Executables
│   └── my-app
├── share/                 # Shared resources
│   ├── applications/
│   │   └── my-app.desktop
│   └── icons/
│       └── my-app.png
└── lib/                   # Libraries
    └── libmy-app.so
```

## Security Model

### Signature Verification
1. **Key Generation**: Developers generate Ed25519 keypairs for signing packages
2. **Package Signing**: Packages are signed with the developer's private key
3. **Verification**: TauPkg verifies signatures using trusted public keys
4. **Trust Store**: System administrators manage trusted public keys

### Trusted Key Management
```bash
# Add a trusted key
echo "PUBLIC_KEY_BASE64" | sudo tee -a /etc/tau-pkg/trusted-keys

# Remove a trusted key
sudo sed -i '/PUBLIC_KEY_BASE64/d' /etc/tau-pkg/trusted-keys

# List trusted keys
cat /etc/tau-pkg/trusted-keys
```

### Sandboxing Integration
- Packages declare required permissions in their manifest
- `sandboxd` enforces permissions at runtime
- Apps run in isolated namespaces with minimal privileges

## Dependency Resolution

### Algorithm
1. **Parse Dependencies**: Extract all required and optional dependencies
2. **Build Dependency Graph**: Create directed acyclic graph of dependencies
3. **Detect Cycles**: Prevent circular dependencies
4. **Topological Sort**: Determine installation order
5. **Install Dependencies**: Install dependencies before dependent packages

### Example Dependency Resolution
```
Package A depends on B and C
Package B depends on D
Package C depends on E
Package D has no dependencies
Package E has no dependencies

Installation Order: D, E, B, C, A
```

## Rollback System

### Automatic Rollback
- Creates backup before installation
- Rolls back automatically on failure
- Maintains system consistency

### Manual Rollback
```bash
# Rollback to previous version
tau-pkg rollback my-app

# Check available rollback points
ls /var/lib/tau-pkg/backups/
```

### Backup Structure
```
/var/lib/tau-pkg/backups/
├── my-app.backup/         # Previous version
├── another-app.backup/    # Another package backup
└── state.json            # Installation state
```

## Error Handling

### Common Errors
- **Signature Verification Failed**: Package signature doesn't match trusted keys
- **Dependency Resolution Failed**: Circular dependencies or missing packages
- **Installation Failed**: Insufficient permissions or disk space
- **Rollback Failed**: Backup not found or corrupted

### Troubleshooting
```bash
# Check package manager logs
journalctl -u tau-pkg

# Verify package integrity
tau-pkg verify my-app

# Check installation state
cat /var/lib/tau-pkg/state.json

# Reset package manager state (dangerous)
sudo rm /var/lib/tau-pkg/state.json
```

## Integration with Tau OS

### System Integration
- **Init System**: TauPkg integrates with systemd for service management
- **Session Manager**: Automatic app discovery and launching
- **TauStore**: Frontend for package management
- **Sandboxing**: Automatic permission enforcement

### Developer Workflow
```bash
# Build and package an application
tau-sdk build
tau-sdk package

# Install locally for testing
tau-pkg install ./my-app-1.0.0.taupkg

# Publish to TauStore
tau-sdk publish
```

## Performance Optimizations

### Caching
- **Metadata Cache**: Repository index cached locally
- **Package Cache**: Downloaded packages cached for reuse
- **Dependency Cache**: Resolved dependencies cached

### Parallel Operations
- **Parallel Downloads**: Multiple packages downloaded simultaneously
- **Parallel Verification**: Signature verification in parallel
- **Parallel Installation**: Independent packages installed in parallel

## Future Enhancements

### Planned Features
- **Delta Updates**: Download only changed parts of packages
- **GUI Frontend**: Graphical interface for package management
- **Flatpak Integration**: Support for containerized applications
- **Offline Mode**: Work with cached packages without network
- **Package Signing Tools**: CLI tools for developers to sign packages

### Advanced Features
- **Package Deltas**: Efficient updates using binary diffs
- **Multi-Repository Support**: Install from multiple repositories
- **Package Groups**: Install related packages together
- **System Snapshots**: Create system snapshots before major updates

---

**TauPkg: Fast, Secure, and Reliable Package Management for Tau OS.** 🚀 