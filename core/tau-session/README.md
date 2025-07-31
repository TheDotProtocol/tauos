# Tau Session Manager

The comprehensive user session and login manager for Tau OS, providing secure authentication, session management, and user environment control.

## Features

### 🔐 Authentication & Security
- **Secure Password Hashing**: bcrypt-based password storage with configurable cost
- **Account Lockout**: Automatic lockout after failed login attempts
- **Password Policies**: Configurable password requirements (length, complexity)
- **Audit Logging**: Comprehensive logging of all authentication events
- **Session Encryption**: Optional session data encryption

### 👥 User Management
- **Multi-User Support**: Handle multiple concurrent user sessions
- **User Profiles**: Per-user configuration and preferences
- **Admin Controls**: Privilege separation with root-only operations
- **Account States**: Enable/disable user accounts
- **Password Management**: Secure password changes and validation

### 🖥️ Session Management
- **TTY Login**: Traditional terminal-based login
- **Graphical Login**: Modern GUI login with `tau-greeter`
- **SSH Support**: Remote session management
- **Session Switching**: Switch between user sessions
- **Session Locking**: Secure screen locking with `tau-lock`
- **Auto-Lock**: Configurable session timeout and auto-lock

### 🎨 GUI Components
- **Login Greeter**: Beautiful graphical login interface
- **Lock Screen**: Secure screen locking with password authentication
- **Session Controls**: GUI for session management
- **Theme Integration**: Black & Gold luxury theme

### 📊 Logging & Monitoring
- **Comprehensive Logging**: All events logged to `/var/log/tau/session.log`
- **Audit Trail**: Security events and user actions tracked
- **Session Statistics**: Login/logout statistics and session duration
- **Log Rotation**: Automatic log file rotation and management

## Architecture

```
tau-session/
├── src/
│   ├── main.rs              # Main session manager daemon
│   ├── auth.rs              # Authentication and user management
│   ├── session.rs           # Session lifecycle management
│   ├── config.rs            # Configuration management
│   ├── logging.rs           # Logging and audit functionality
│   └── bin/
│       ├── login.rs         # TTY/SSH login handler
│       ├── greeter.rs       # Graphical login interface
│       ├── lock.rs          # Screen lock application
│       └── auth.rs          # Privileged user management
```

## Installation

```bash
# Build the project
cd tauos/core/tau-session
cargo build --release

# Install binaries
sudo cp target/release/tau-session /usr/bin/
sudo cp target/release/tau-login /usr/bin/
sudo cp target/release/tau-greeter /usr/bin/
sudo cp target/release/tau-lock /usr/bin/
sudo cp target/release/tau-auth /usr/bin/

# Create necessary directories
sudo mkdir -p /etc/tau
sudo mkdir -p /var/log/tau
sudo mkdir -p /var/lib/tau/sessions
```

## Usage

### Session Management

```bash
# Start session daemon
tau-session daemon

# Login via TTY
tau-login tty /dev/tty1

# Login via GUI
tau-login gui

# Login via SSH
tau-login ssh

# List active sessions
tau-session list

# Lock a session
tau-session lock <session_id>

# Unlock a session
tau-session unlock <session_id>

# Switch user
tau-session switch <username>

# Logout
tau-session logout <session_id>
```

### User Management (Root Only)

```bash
# Add a new user
sudo tau-auth add-user john

# Add admin user
sudo tau-auth add-user admin --admin

# Remove user
sudo tau-auth remove-user john

# Enable/disable user
sudo tau-auth enable-user john
sudo tau-auth disable-user john

# Change password
sudo tau-auth change-password john

# List all users
sudo tau-auth list-users

# Unlock locked account
sudo tau-auth unlock-account john

# Set admin privileges
sudo tau-auth set-admin john
sudo tau-auth unset-admin john
```

### GUI Applications

```bash
# Launch graphical login
tau-greeter

# Lock screen
tau-lock
```

## Configuration

### System Configuration (`/etc/tau/session.toml`)

```toml
default_shell = "/bin/bash"
default_gui = "tau-desktop"
session_timeout = 3600
max_failed_logins = 5
lockout_duration = 300
guest_session_enabled = true
remote_session_enabled = true

[security]
password_min_length = 8
require_special_chars = true
require_numbers = true
require_uppercase = true
password_expiry_days = 90
session_encryption = true
audit_logging = true
```

### User Configuration (`~/.tau/session.toml`)

```toml
shell = "/bin/bash"
gui = "tau-desktop"
startup_apps = ["tau-launcher", "tau-dock"]
theme = "tau-dark"
locale = "en_US.UTF-8"
session_timeout = 3600
auto_lock = true
auto_lock_timeout = 300

[environment]
EDITOR = "nano"
BROWSER = "firefox"

[permissions]
network_access = true
file_system_access = true
device_access = false
system_access = false
allowed_apps = []
blocked_apps = []
```

### User Database (`/etc/tau/users.toml`)

```toml
[users.tau]
username = "tau"
password_hash = "$2b$12$..."
shell = "/bin/bash"
gui = "tau-desktop"
home = "/home/tau"
uid = 1000
gid = 1000
groups = ["users", "wheel"]
enabled = true
admin = true
failed_attempts = 0
last_failed = null
locked_until = null

[users.john]
username = "john"
password_hash = "$2b$12$..."
shell = "/bin/bash"
gui = "tau-desktop"
home = "/home/john"
uid = 1001
gid = 1001
groups = ["users"]
enabled = true
admin = false
failed_attempts = 0
last_failed = null
locked_until = null
```

## Security Features

### Authentication Security
- **bcrypt Hashing**: Industry-standard password hashing with configurable cost
- **Account Lockout**: Automatic lockout after 5 failed attempts (configurable)
- **Password Policies**: Enforce strong password requirements
- **Session Isolation**: Each user session runs in isolated environment

### Session Security
- **Process Isolation**: User processes cannot affect other sessions
- **Resource Limits**: Per-session resource usage limits
- **Environment Sanitization**: Clean environment for each session
- **Secure Logout**: Proper cleanup of session resources

### Audit & Monitoring
- **Comprehensive Logging**: All authentication and session events logged
- **Audit Trail**: Complete audit trail for security events
- **Session Tracking**: Monitor active sessions and resource usage
- **Failed Login Detection**: Track and alert on suspicious activity

## Integration

### System Integration
- **Init System**: Integrates with systemd or custom init system
- **Display Manager**: Replaces traditional display managers
- **TTY Management**: Handles TTY allocation and management
- **Service Integration**: Works with other Tau OS services

### GUI Integration
- **GTK4 Integration**: Modern GTK4-based interfaces
- **Theme Support**: Black & Gold luxury theme
- **Accessibility**: Full accessibility support
- **Internationalization**: Multi-language support

### Network Integration
- **SSH Support**: Remote session management
- **Network Authentication**: LDAP/Active Directory integration ready
- **Remote Desktop**: VNC/RDP integration capabilities

## Development

### Building

```bash
# Build all components
cargo build

# Build specific binary
cargo build --bin tau-session
cargo build --bin tau-login
cargo build --bin tau-greeter
cargo build --bin tau-lock
cargo build --bin tau-auth

# Run tests
cargo test

# Run with debug logging
RUST_LOG=debug cargo run --bin tau-session daemon
```

### Testing

```bash
# Run unit tests
cargo test

# Run integration tests
cargo test --test integration

# Test authentication
cargo test auth

# Test session management
cargo test session
```

### Debugging

```bash
# Enable debug logging
export RUST_LOG=debug

# Run with verbose output
cargo run --bin tau-session -- --verbose

# Check logs
tail -f /var/log/tau/session.log
```

## Troubleshooting

### Common Issues

**Login Fails**
- Check user exists in `/etc/tau/users.toml`
- Verify password hash is correct
- Check account is not locked or disabled
- Review logs: `tail -f /var/log/tau/session.log`

**Session Won't Start**
- Verify user home directory exists and has correct permissions
- Check XDG directories are created
- Ensure display server is running
- Review session configuration

**GUI Login Issues**
- Check DISPLAY environment variable
- Verify X11 authorization
- Ensure tau-greeter is properly installed
- Check GTK4 dependencies

**Permission Denied**
- Ensure running as root for privileged operations
- Check file permissions on configuration files
- Verify user has necessary permissions

### Log Analysis

```bash
# View recent login events
grep "LOGIN" /var/log/tau/session.log

# Check failed login attempts
grep "LOGIN_FAILED" /var/log/tau/session.log

# Monitor active sessions
grep "SESSION_START" /var/log/tau/session.log

# Check security events
grep "AUDIT" /var/log/tau/session.log
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the logs for error messages
- Consult the troubleshooting guide

---

**Tau Session Manager**: Secure, modern, and beautiful session management for Tau OS. 