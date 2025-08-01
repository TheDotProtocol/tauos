# TauService: Tau OS Service Manager

TauService is a minimal yet powerful service manager for Tau OS, designed to manage system and user services with dependency resolution, sandboxing, and comprehensive logging.

## 🚀 Quick Start

### Installation
```bash
# Clone and build
git clone https://github.com/tauos/tau-service.git
cd tau-service
cargo build --release

# Install system-wide
sudo ./install.sh

# Or install manually
sudo cp target/release/tau-service /usr/bin/
sudo mkdir -p /etc/tau/services /var/lib/tau-service /var/log/tau/journal
```

### Basic Usage
```bash
# Start a service
tau-service start nginx

# Enable for boot
tau-service enable nginx

# Check status
tau-service status nginx

# Open TUI interface
tau-service tui
```

## Features

### 🔧 Core Functionality
- **Service Lifecycle Management**: Start, stop, restart, reload services
- **Dependency Resolution**: Automatic dependency chaining and circular detection
- **Service Enablement**: Enable/disable services for boot-time startup
- **Status Tracking**: Real-time service status and health monitoring
- **Comprehensive Logging**: Journal-based logging with structured output

### 🔒 Security & Sandboxing
- **Service Sandboxing**: Restrict filesystem and network access
- **User/Group Support**: Run services as specific users
- **Capability Management**: Control process capabilities
- **Privilege Isolation**: Prevent privilege escalation
- **AppArmor/SELinux Integration**: Security profile support

### 📊 Monitoring & Debugging
- **Service Status**: Detailed status information with PID tracking
- **Log Management**: Structured logging with filtering and following
- **Health Monitoring**: Automatic restart of failed services
- **Performance Metrics**: Service uptime and restart tracking
- **Security Auditing**: Comprehensive security analysis

### 🎯 Boot Integration
- **System Boot**: Automatic service startup on boot
- **Target System**: Multi-user, network, and custom targets
- **Persistent State**: Service states saved across reboots
- **Boot Services**: Automatic management of boot-time services

### 📦 TauPkg Integration
- **Package Hooks**: Automatic service registration from packages
- **Post-Install Scripts**: Auto-enable services after installation
- **Service Discovery**: Automatic detection of package services
- **Clean Removal**: Proper cleanup when packages are removed

## Installation & Setup

### Prerequisites
```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install build dependencies
sudo apt install build-essential pkg-config libssl-dev
```

### Building TauService
```bash
cd core/tauservice
cargo build --release
sudo cp target/release/tau-service /usr/bin/
```

### System Installation
```bash
# Run installation script
sudo ./install.sh

# Or install manually
sudo ./install.sh install
```

### Initial Configuration
```bash
# Create service directories
sudo mkdir -p /etc/tau/services
sudo mkdir -p /etc/tau/system
sudo mkdir -p /var/lib/tau-service
sudo mkdir -p /var/log/tau/journal

# Create user service directory
mkdir -p ~/.config/tau/services

# Setup boot integration
sudo tau-service boot setup
```

## Usage

### Basic Commands

#### Service Control
```bash
# Start a service
tau-service start nginx

# Start with wait (block until active)
tau-service start nginx --wait

# Stop a service
tau-service stop nginx

# Force stop (SIGKILL)
tau-service stop nginx --force

# Restart a service
tau-service restart nginx

# Reload service configuration
tau-service reload nginx
```

#### Service Management
```bash
# Enable service for boot startup
tau-service enable nginx

# Disable service from boot startup
tau-service disable nginx

# Show service status
tau-service status nginx

# Show all service statuses
tau-service status
```

#### Service Listing
```bash
# List all services
tau-service list

# List only running services
tau-service list --running

# List only enabled services
tau-service list --enabled

# List only failed services
tau-service list --failed
```

#### Log Management
```bash
# Show service logs
tau-service logs nginx

# Show last 100 lines
tau-service logs nginx --lines 100

# Follow logs in real-time
tau-service logs nginx --follow

# Clear service logs
tau-service clear-logs nginx

# Clear all logs
tau-service clear-logs
```

#### Daemon Management
```bash
# Reload all unit files
tau-service daemon-reload

# Start the service manager daemon
tau-service daemon
```

### Advanced Commands

#### Boot Integration
```bash
# Setup boot integration
tau-service boot setup

# Start boot services
tau-service boot start

# List boot services
tau-service boot list

# Enable service for boot
tau-service boot enable nginx

# Disable service from boot
tau-service boot disable nginx
```

#### State Management
```bash
# Show state summary
tau-service state summary

# Backup current state
tau-service state backup

# Restore state from backup
tau-service state restore 1234567890

# List available backups
tau-service state list-backups

# Clear all state
tau-service state clear
```

#### Security Management
```bash
# Audit service security
tau-service security audit nginx

# Create security profile
tau-service security create-profile nginx

# Remove security profile
tau-service security remove-profile nginx

# Show security report
tau-service security report nginx
```

#### TauPkg Integration
```bash
# Install package hooks
tau-service taupkg install-hooks my-package /path/to/package

# Remove package hooks
tau-service taupkg remove-hooks my-package

# List package services
tau-service taupkg list-services my-package

# Auto-enable package services
tau-service taupkg auto-enable my-package

# Auto-disable package services
tau-service taupkg auto-disable my-package
```

#### TUI Interface
```bash
# Open TUI interface
tau-service tui
```

The TUI provides an interactive interface for:
- Viewing service status
- Starting/stopping services
- Enabling/disabling services
- Viewing logs
- Security auditing
- System statistics

### Verbose Output
```bash
# Enable verbose logging
tau-service start nginx --verbose

# Quiet mode (errors only)
tau-service start nginx --quiet
```

## Service Unit Files

### File Format
TauService uses TOML-based unit files with `.tau` extension, similar to systemd's `.service` files but with a cleaner syntax.

### Unit File Structure

#### Basic Service Unit
```toml
name = "my-service"
description = "My custom service"

[service]
exec_start = "/usr/bin/my-service"
exec_stop = "/usr/bin/my-service --stop"
restart = "always"
user = "myuser"
group = "mygroup"
working_directory = "/var/lib/my-service"

environment = { "DEBUG" = "true", "PORT" = "8080" }
environment_file = ["/etc/my-service/env.conf"]

standard_output = "journal"
standard_error = "journal"

[sandbox]
read_write_paths = ["/var/log/my-service", "/var/cache/my-service"]
read_only_paths = ["/etc/my-service"]
no_new_privileges = true
private_tmp = true
network_access = true

[install]
wanted_by = ["multi-user.target"]

[unit]
description = "My custom service"
after = ["network.target"]
wants = ["network.target"]
```

### Service Section Options

#### Execution Commands
- `exec_start`: Main command to start the service
- `exec_stop`: Command to stop the service gracefully
- `exec_reload`: Command to reload configuration
- `exec_start_pre`: Commands to run before starting
- `exec_start_post`: Commands to run after starting
- `exec_stop_post`: Commands to run after stopping

#### Process Control
- `restart`: Restart policy (`no`, `always`, `on-success`, `on-failure`, etc.)
- `restart_sec`: Time to wait before restarting
- `timeout_start_sec`: Maximum time to wait for start
- `timeout_stop_sec`: Maximum time to wait for stop
- `kill_mode`: How to terminate the process (`control-group`, `mixed`, `process`, `none`)
- `kill_signal`: Signal to send for termination

#### User/Environment
- `user`: User to run the service as
- `group`: Group to run the service as
- `working_directory`: Working directory for the service
- `environment`: Environment variables
- `environment_file`: Files containing environment variables
- `nice`: Process nice value

#### Service Type
- `type`: Service type (`simple`, `forking`, `oneshot`, `notify`, `dbus`)
- `remain_after_exit`: Whether to consider service active after exit

#### Output Handling
- `standard_output`: Where to send stdout (`inherit`, `null`, `journal`, etc.)
- `standard_error`: Where to send stderr

### Sandbox Section Options

#### Filesystem Access
- `read_write_paths`: Paths the service can read and write
- `read_only_paths`: Paths the service can only read
- `private_tmp`: Use private /tmp directory
- `protect_system`: Protect system directories
- `protect_home`: Protect home directories

#### Security
- `no_new_privileges`: Prevent privilege escalation
- `private_devices`: Restrict device access
- `network_access`: Allow network access
- `capabilities`: Linux capabilities to grant

### Install Section Options

#### Boot Configuration
- `wanted_by`: Targets that want this service
- `required_by`: Targets that require this service
- `also`: Additional services to install
- `alias`: Alternative names for the service

### Unit Section Options

#### Dependencies
- `requires`: Services this unit requires
- `wants`: Services this unit wants (soft dependency)
- `after`: Services to start after
- `before`: Services to start before
- `conflicts`: Services that conflict with this unit
- `part_of`: Services this unit is part of
- `binds_to`: Services this unit is bound to

## Service States

### State Transitions
```
Inactive → Activating → Active
    ↓         ↓         ↓
Deactivating ← Failed ← Reloading
```

### State Descriptions
- **Inactive**: Service is not running
- **Activating**: Service is starting up
- **Active**: Service is running normally
- **Deactivating**: Service is shutting down
- **Failed**: Service failed to start or crashed
- **Reloading**: Service is reloading configuration

## Logging System

### Journal Structure
```
/var/log/tau/journal/
├── nginx.log
├── sshd.log
├── my-service.log
└── ...
```

### Log Format
```
2024-01-01 12:00:00 [STDOUT] INFO: Server started on port 8080
2024-01-01 12:00:01 [STDERR] WARNING: Configuration file not found
2024-01-01 12:00:02 [SYSTEM] ERROR: Failed to bind to port 8080
```

### Log Levels
- **DEBUG**: Detailed debugging information
- **INFO**: General information messages
- **WARNING**: Warning messages
- **ERROR**: Error messages
- **CRITICAL**: Critical error messages

## Boot Integration

### Boot Targets
TauService creates a target system similar to systemd:

- **boot.target**: Initial boot target
- **multi-user.target**: Multi-user system target
- **network.target**: Network services target
- **graphical.target**: Graphical interface target

### Boot Process
1. System boots and starts `boot.target`
2. `boot.target` starts basic services
3. `multi-user.target` starts user services
4. Services marked with `wanted_by = ["multi-user.target"]` start automatically

### Persistent State
Service states are saved in `/var/lib/tau-service/state.json`:
- Enabled/disabled status
- Last known state
- Restart counts
- Timestamps

## Security Features

### Sandboxing
Services can be sandboxed with various restrictions:

```toml
[sandbox]
# Filesystem restrictions
read_write_paths = ["/var/log/my-app"]
read_only_paths = ["/etc/my-app"]
private_tmp = true

# Security restrictions
no_new_privileges = true
private_devices = true
network_access = false

# Capabilities
capabilities = ["CAP_NET_BIND_SERVICE"]
```

### Security Profiles
TauService supports AppArmor and SELinux profiles:

```bash
# Create security profile
tau-service security create-profile my-service

# Audit service security
tau-service security audit my-service
```

### Security Auditing
The security auditor provides comprehensive analysis:

```bash
# Get security report
tau-service security report nginx
```

## TauPkg Integration

### Package Hooks
When packages are installed via TauPkg, they can automatically register services:

```bash
# Install package with services
tau-pkg install nginx

# Services are automatically registered
tau-service list
# Shows: nginx.service

# Services can be auto-enabled
tau-service taupkg auto-enable nginx
```

### Package Service Discovery
TauService automatically discovers services in packages:

```bash
# List services provided by package
tau-service taupkg list-services my-package

# Install hooks for package
tau-service taupkg install-hooks my-package /path/to/package
```

## Advanced Features

### Dependency Resolution
TauService automatically resolves service dependencies:
```toml
# Service A depends on B and C
[unit]
requires = ["service-b", "service-c"]
after = ["service-b", "service-c"]
```

### Circular Dependency Detection
TauService prevents circular dependencies:
```bash
# This would fail with circular dependency error
tau-service start service-a
# Error: Circular dependency detected for service: service-a
```

### Service Health Monitoring
TauService monitors service health and restarts failed services:
```bash
# Check service health
tau-service status my-service

# View restart history
tau-service logs my-service | grep "restart"
```

### Performance Monitoring
TauService tracks service performance:
```bash
# View service statistics
tau-service state summary

# Check service uptime
tau-service status my-service
```

## Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check service status
tau-service status my-service

# View service logs
tau-service logs my-service

# Check unit file syntax
tau-service daemon-reload
```

#### Service Keeps Restarting
```bash
# Check restart count
tau-service status my-service

# View recent logs
tau-service logs my-service --lines 100

# Check dependencies
tau-service list --running
```

#### Permission Issues
```bash
# Check user/group settings
cat /etc/tau/services/my-service.tau

# Verify file permissions
ls -la /usr/bin/my-service
```

#### Boot Issues
```bash
# Check boot integration
tau-service boot list

# Verify boot services
tau-service boot start

# Check system targets
ls -la /etc/tau/system/
```

### Debugging Commands
```bash
# Enable verbose logging
tau-service start my-service --verbose

# Check daemon status
tau-service daemon-reload

# View all service logs
tau-service logs my-service --follow

# Security audit
tau-service security audit my-service
```

### Log Locations
- **Service Logs**: `/var/log/tau/journal/`
- **State Files**: `/var/lib/tau-service/`
- **Configuration**: `/etc/tau/services/`
- **Boot Files**: `/etc/tau/system/`

## Performance Considerations

### Resource Usage
- **Memory**: ~2MB base memory usage
- **CPU**: Minimal overhead for service management
- **Disk**: Log files can grow, use log rotation
- **Network**: No network usage unless configured

### Optimization Tips
- Use `type = "simple"` for most services
- Avoid unnecessary dependencies
- Use `restart = "no"` for one-shot services
- Configure appropriate timeouts
- Use sandboxing for security and performance

## Development

### Building from Source
```bash
# Clone repository
git clone https://github.com/tauos/tau-service.git
cd tau-service

# Build in debug mode
cargo build

# Build in release mode
cargo build --release

# Run tests
cargo test

# Run with verbose output
RUST_LOG=debug cargo run -- start nginx
```

### Running Tests
```bash
# Run all tests
cargo test

# Run specific test
cargo test test_service_lifecycle

# Run integration tests
cargo test --test integration_tests
```

### Code Quality
```bash
# Run clippy
cargo clippy

# Run security audit
cargo audit

# Format code
cargo fmt
```

## Architecture

### Component Overview
```
tau-service CLI
    ↓
ServiceManager (Core Logic)
    ↓
├── UnitLoader (Parse .tau files)
├── ProcessManager (Manage processes)
├── JournalLogger (Handle logging)
├── StateManager (Persistent state)
├── BootManager (Boot integration)
├── SandboxManager (Security)
└── TauPkgHooks (Package integration)
```

### Event Flow
1. **CLI Command** → ServiceManager
2. **ServiceManager** → Load units, resolve dependencies
3. **ProcessManager** → Start/stop processes
4. **JournalLogger** → Capture output and logs
5. **StateManager** → Save persistent state

### Security Model
- **Namespace Isolation**: PID, network, mount namespaces
- **Capability Management**: Linux capabilities
- **Filesystem Restrictions**: Read-only, read-write paths
- **Security Profiles**: AppArmor/SELinux integration

## Future Enhancements

### Planned Features
- **Socket Activation**: Support for socket-activated services
- **Timer Units**: Time-based service activation
- **Mount Units**: Automatic filesystem mounting
- **Target Units**: Service grouping and ordering
- **User Services**: Enhanced user-level service support

### Advanced Features
- **Service Templates**: Reusable service configurations
- **Service Groups**: Manage related services together
- **Resource Limits**: CPU and memory limits
- **Service Metrics**: Performance monitoring
- **Remote Management**: Network-based service control

### Performance Improvements
- **Parallel Service Startup**: Start multiple services simultaneously
- **Lazy Loading**: Load services on demand
- **Caching**: Cache parsed unit files
- **Optimized Logging**: Structured logging with compression

---

**TauService: Minimal, Secure, and Powerful Service Management for Tau OS.** 🚀

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Fork and clone
git clone https://github.com/your-username/tau-service.git
cd tau-service

# Install dependencies
cargo build

# Run tests
cargo test

# Submit pull request
```

### Code Style
- Follow Rust conventions
- Use meaningful variable names
- Add comprehensive tests
- Update documentation
- Run `cargo fmt` and `cargo clippy`

## License

TauService is licensed under the MIT License. See [LICENSE](LICENSE) for details. 