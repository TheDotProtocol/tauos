#!/bin/bash

# TauService Installation Script
# This script installs TauService system-wide on Tau OS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BINARY_NAME="tau-service"
INSTALL_DIR="/usr/bin"
CONFIG_DIR="/etc/tau"
SERVICES_DIR="/etc/tau/services"
SYSTEM_DIR="/etc/tau/system"
STATE_DIR="/var/lib/tau-service"
LOG_DIR="/var/log/tau/journal"
USER_SERVICES_DIR="$HOME/.config/tau/services"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# Function to check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check for Rust
    if ! command -v cargo &> /dev/null; then
        print_error "Rust is not installed. Please install Rust first."
        exit 1
    fi
    
    # Check for required system packages
    local missing_packages=()
    
    for pkg in "build-essential" "pkg-config" "libssl-dev"; do
        if ! dpkg -l | grep -q "^ii  $pkg"; then
            missing_packages+=("$pkg")
        fi
    done
    
    if [[ ${#missing_packages[@]} -gt 0 ]]; then
        print_warning "Missing packages: ${missing_packages[*]}"
        print_status "Installing missing packages..."
        apt-get update
        apt-get install -y "${missing_packages[@]}"
    fi
    
    print_success "Dependencies check complete"
}

# Function to build TauService
build_tauservice() {
    print_status "Building TauService..."
    
    # Change to the TauService directory
    cd "$(dirname "$0")"
    
    # Build in release mode
    if cargo build --release; then
        print_success "TauService built successfully"
    else
        print_error "Failed to build TauService"
        exit 1
    fi
}

# Function to create directories
create_directories() {
    print_status "Creating directories..."
    
    local dirs=(
        "$CONFIG_DIR"
        "$SERVICES_DIR"
        "$SYSTEM_DIR"
        "$STATE_DIR"
        "$LOG_DIR"
        "$USER_SERVICES_DIR"
    )
    
    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            print_status "Created directory: $dir"
        fi
    done
    
    print_success "Directories created"
}

# Function to install binary
install_binary() {
    print_status "Installing TauService binary..."
    
    local binary_path="target/release/$BINARY_NAME"
    local install_path="$INSTALL_DIR/$BINARY_NAME"
    
    if [[ -f "$binary_path" ]]; then
        cp "$binary_path" "$install_path"
        chmod +x "$install_path"
        print_success "Binary installed to $install_path"
    else
        print_error "Binary not found at $binary_path"
        exit 1
    fi
}

# Function to create systemd service
create_systemd_service() {
    print_status "Creating systemd service..."
    
    local service_file="/etc/systemd/system/tauserviced.service"
    
    cat > "$service_file" << EOF
[Unit]
Description=TauService Daemon
Documentation=man:tau-service(8)
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/tau-service daemon
Restart=always
RestartSec=5
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd
    systemctl daemon-reload
    
    print_success "Systemd service created"
}

# Function to create example service units
create_example_units() {
    print_status "Creating example service units..."
    
    # Copy example units
    if [[ -d "examples" ]]; then
        cp examples/*.tau "$SERVICES_DIR/"
        print_status "Copied example service units"
    fi
    
    print_success "Example units created"
}

# Function to setup boot integration
setup_boot_integration() {
    print_status "Setting up boot integration..."
    
    # Run TauService boot setup
    if "$INSTALL_DIR/$BINARY_NAME" boot setup; then
        print_success "Boot integration setup complete"
    else
        print_warning "Boot integration setup failed"
    fi
}

# Function to create man pages
create_man_pages() {
    print_status "Creating man pages..."
    
    local man_dir="/usr/share/man/man8"
    mkdir -p "$man_dir"
    
    # Create basic man page
    cat > "$man_dir/tau-service.8" << 'EOF'
.TH TAU-SERVICE 8 "2024" "Tau OS" "System Administration"
.SH NAME
tau-service \- Tau OS Service Manager
.SH SYNOPSIS
.B tau-service
[\fIOPTIONS\fR] \fICOMMAND\fR [\fIARGS\fR]
.SH DESCRIPTION
TauService is the service manager for Tau OS, providing functionality to start,
stop, enable, and manage system services.
.SH COMMANDS
.TP
.B start \fISERVICE\fR
Start a service
.TP
.B stop \fISERVICE\fR
Stop a service
.TP
.B restart \fISERVICE\fR
Restart a service
.TP
.B enable \fISERVICE\fR
Enable a service for boot
.TP
.B disable \fISERVICE\fR
Disable a service from boot
.TP
.B status \fISERVICE\fR
Show service status
.TP
.B list
List all services
.TP
.B logs \fISERVICE\fR
Show service logs
.TP
.B tui
Open TUI interface
.SH FILES
.TP
.I /etc/tau/services/
Service unit files
.TP
.I /var/lib/tau-service/
Service state files
.TP
.I /var/log/tau/journal/
Service log files
.SH SEE ALSO
.BR systemd (1)
.SH AUTHOR
Tau OS Team
EOF
    
    # Update man database
    mandb -q
    
    print_success "Man pages created"
}

# Function to create completion scripts
create_completion_scripts() {
    print_status "Creating completion scripts..."
    
    # Bash completion
    local bash_completion_dir="/etc/bash_completion.d"
    if [[ -d "$bash_completion_dir" ]]; then
        cat > "$bash_completion_dir/tau-service" << 'EOF'
# Bash completion for tau-service
_tau_service() {
    local cur prev opts cmds
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    cmds="start stop restart enable disable status list logs tui daemon-reload daemon boot state security taupkg"
    
    case "${prev}" in
        tau-service)
            COMPREPLY=( $(compgen -W "${cmds}" -- "${cur}") )
            return 0
            ;;
        start|stop|restart|enable|disable|status|logs)
            # Add service name completion here
            return 0
            ;;
    esac
}

complete -F _tau_service tau-service
EOF
        print_status "Bash completion script created"
    fi
    
    print_success "Completion scripts created"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if cargo test; then
        print_success "Tests passed"
    else
        print_warning "Some tests failed"
    fi
}

# Function to show installation summary
show_summary() {
    print_success "TauService installation complete!"
    echo
    echo "Installation Summary:"
    echo "  Binary: $INSTALL_DIR/$BINARY_NAME"
    echo "  Config: $CONFIG_DIR"
    echo "  Services: $SERVICES_DIR"
    echo "  State: $STATE_DIR"
    echo "  Logs: $LOG_DIR"
    echo
    echo "Next steps:"
    echo "  1. Create service unit files in $SERVICES_DIR"
    echo "  2. Enable services: tau-service enable <service>"
    echo "  3. Start services: tau-service start <service>"
    echo "  4. Use TUI: tau-service tui"
    echo
    echo "Documentation: man tau-service"
}

# Main installation function
main() {
    echo "TauService Installation Script"
    echo "=============================="
    echo
    
    # Check if running as root
    check_root
    
    # Check dependencies
    check_dependencies
    
    # Build TauService
    build_tauservice
    
    # Create directories
    create_directories
    
    # Install binary
    install_binary
    
    # Create systemd service
    create_systemd_service
    
    # Create example units
    create_example_units
    
    # Setup boot integration
    setup_boot_integration
    
    # Create man pages
    create_man_pages
    
    # Create completion scripts
    create_completion_scripts
    
    # Run tests
    run_tests
    
    # Show summary
    show_summary
}

# Handle command line arguments
case "${1:-install}" in
    install)
        main
        ;;
    uninstall)
        print_status "Uninstalling TauService..."
        
        # Remove binary
        rm -f "$INSTALL_DIR/$BINARY_NAME"
        
        # Remove systemd service
        systemctl stop tauserviced 2>/dev/null || true
        systemctl disable tauserviced 2>/dev/null || true
        rm -f /etc/systemd/system/tauserviced.service
        systemctl daemon-reload
        
        # Remove man page
        rm -f /usr/share/man/man8/tau-service.8
        mandb -q
        
        # Remove completion script
        rm -f /etc/bash_completion.d/tau-service
        
        print_success "TauService uninstalled"
        ;;
    *)
        echo "Usage: $0 {install|uninstall}"
        exit 1
        ;;
esac 