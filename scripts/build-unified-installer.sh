#!/bin/bash

# TauOS Unified Installer Build Script
# This script creates a unified installer package for TauOS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
RELEASE_DIR="$BUILD_DIR/release"
INSTALLER_DIR="$BUILD_DIR/installer"
VERSION="1.0.0"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${PURPLE}🚀 TauOS Unified Installer Build${NC}"
echo -e "${CYAN}Version: $VERSION${NC}"
echo -e "${CYAN}Timestamp: $TIMESTAMP${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to setup build environment
setup_build_environment() {
    print_info "Setting up build environment..."
    mkdir -p "$INSTALLER_DIR" "$INSTALLER_DIR/bin" "$INSTALLER_DIR/config" "$INSTALLER_DIR/apps"
    print_status "Build environment created"
}

# Function to build core components
build_core_components() {
    print_info "Building core components..."
    
    local components=("tau-session" "tau-powerd" "tau-inputd" "tau-displaysvc")
    
    for component in "${components[@]}"; do
        if [ -d "$PROJECT_ROOT/core/$component" ]; then
            print_info "Building $component..."
            cd "$PROJECT_ROOT/core/$component"
            if [ -f "Cargo.toml" ]; then
                cargo build --release
                if [ -f "target/release/$component" ]; then
                    cp "target/release/$component" "$INSTALLER_DIR/bin/"
                    print_status "Built $component"
                else
                    print_warning "Failed to build $component"
                fi
            else
                print_warning "No Cargo.toml found for $component"
            fi
        else
            print_warning "Component directory missing: $component"
        fi
    done
    
    print_status "Core components build completed"
}

# Function to build GUI applications
build_gui_applications() {
    print_info "Building GUI applications..."
    
    local apps=("settings" "launcher" "splash" "tauhome" "dock")
    
    for app in "${apps[@]}"; do
        if [ -d "$PROJECT_ROOT/gui/$app" ]; then
            print_info "Building $app..."
            cd "$PROJECT_ROOT/gui/$app"
            if [ -f "Cargo.toml" ]; then
                cargo build --release
                if [ -f "target/release/$app" ]; then
                    cp "target/release/$app" "$INSTALLER_DIR/bin/"
                    print_status "Built $app"
                else
                    print_warning "Failed to build $app"
                fi
            else
                print_warning "No Cargo.toml found for $app"
            fi
        else
            print_warning "App directory missing: $app"
        fi
    done
    
    print_status "GUI applications build completed"
}

# Function to build desktop applications
build_desktop_applications() {
    print_info "Building desktop applications..."
    
    local apps=("taumedia" "taustore")
    
    for app in "${apps[@]}"; do
        if [ -d "$PROJECT_ROOT/apps/$app" ]; then
            print_info "Building $app..."
            cd "$PROJECT_ROOT/apps/$app"
            if [ -f "Cargo.toml" ]; then
                cargo build --release
                if [ -f "target/release/$app" ]; then
                    cp "target/release/$app" "$INSTALLER_DIR/bin/"
                    print_status "Built $app"
                else
                    print_warning "Failed to build $app"
                fi
            else
                print_warning "No Cargo.toml found for $app"
            fi
        else
            print_warning "App directory missing: $app"
        fi
    done
    
    print_status "Desktop applications build completed"
}

# Function to create configuration files
create_configuration_files() {
    print_info "Creating configuration files..."
    
    # Main configuration
    cat > "$INSTALLER_DIR/config/tauos.conf" << 'CONFIG_EOF'
# TauOS Configuration File

[System]
# Enable privacy features
privacy_mode = true
telemetry = false
analytics = false

[Applications]
# Default applications
default_browser = tau-browser
default_email = taumail
default_media_player = taumedia
default_file_manager = tau-explorer

[Security]
# Security settings
sandboxing = true
encryption = true
secure_boot = true

[Updates]
# Update settings
auto_update = false
update_channel = stable
CONFIG_EOF

    # Systemd service files
    cat > "$INSTALLER_DIR/config/tau-session.service" << 'SERVICE_EOF'
[Unit]
Description=TauOS Session Manager
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/tau-session
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
SERVICE_EOF

    cat > "$INSTALLER_DIR/config/tau-powerd.service" << 'SERVICE_EOF'
[Unit]
Description=TauOS Power Management
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/tau-powerd
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
SERVICE_EOF

    print_status "Configuration files created"
}

# Function to create desktop shortcuts
create_desktop_shortcuts() {
    print_info "Creating desktop shortcuts..."
    
    # Tau Settings
    cat > "$INSTALLER_DIR/apps/tau-settings.desktop" << 'DESKTOP_EOF'
[Desktop Entry]
Name=Tau Settings
Comment=Configure TauOS system settings
Exec=tau-settings
Icon=preferences-system
Terminal=false
Type=Application
Categories=Settings;
DESKTOP_EOF

    # Tau Store
    cat > "$INSTALLER_DIR/apps/tau-store.desktop" << 'DESKTOP_EOF'
[Desktop Entry]
Name=Tau Store
Comment=Install and manage applications
Exec=taustore
Icon=applications-other
Terminal=false
Type=Application
Categories=System;
DESKTOP_EOF

    # Tau Media Player
    cat > "$INSTALLER_DIR/apps/tau-media.desktop" << 'DESKTOP_EOF'
[Desktop Entry]
Name=Tau Media Player
Comment=Play audio and video files
Exec=taumedia
Icon=multimedia-player
Terminal=false
Type=Application
Categories=AudioVideo;
DESKTOP_EOF

    print_status "Desktop shortcuts created"
}

# Function to create installer script
create_installer_script() {
    print_info "Creating installer script..."
    
    cat > "$INSTALLER_DIR/install.sh" << 'INSTALLER_EOF'
#!/bin/bash

# TauOS Unified Installer v1.0.0
# This script installs TauOS and all its components

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

VERSION="1.0.0"
INSTALL_DIR="/opt/tauos"
BIN_DIR="/usr/local/bin"
CONFIG_DIR="/etc/tauos"
SERVICE_DIR="/etc/systemd/system"

echo -e "${PURPLE}🚀 TauOS Unified Installer v$VERSION${NC}"
echo -e "${CYAN}Privacy-First Operating System${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check system requirements
check_system_requirements() {
    print_info "Checking system requirements..."
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
    
    # Check OS
    if ! command -v systemctl &> /dev/null; then
        print_error "Systemd is required but not found"
        exit 1
    fi
    
    # Check available disk space (need at least 2GB)
    local available_space=$(df / | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 2097152 ]; then # 2GB in KB
        print_error "Insufficient disk space. Need at least 2GB free."
        exit 1
    fi
    
    # Check RAM (need at least 2GB)
    local total_ram=$(free -k | awk 'NR==2{print $2}')
    if [ "$total_ram" -lt 2097152 ]; then # 2GB in KB
        print_error "Insufficient RAM. Need at least 2GB."
        exit 1
    fi
    
    print_status "System requirements met"
}

# Function to install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    # Update package lists
    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y build-essential pkg-config libgtk-4-dev libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev
    elif command -v dnf &> /dev/null; then
        dnf install -y gcc gcc-c++ pkgconfig gtk4-devel gstreamer1-devel gstreamer1-plugins-base-devel
    elif command -v pacman &> /dev/null; then
        pacman -S --noconfirm base-devel gtk4 gstreamer gst-plugins-base
    else
        print_warning "Unsupported package manager. Please install dependencies manually."
    fi
    
    print_status "Dependencies installed"
}

# Function to create directories
create_directories() {
    print_info "Creating directories..."
    
    mkdir -p "$INSTALL_DIR" "$BIN_DIR" "$CONFIG_DIR" "$SERVICE_DIR"
    
    print_status "Directories created"
}

# Function to install binaries
install_binaries() {
    print_info "Installing binaries..."
    
    # Copy all binaries
    if [ -d "bin" ]; then
        cp bin/* "$BIN_DIR/"
        chmod +x "$BIN_DIR"/*
        print_status "Binaries installed"
    else
        print_warning "No binaries found"
    fi
}

# Function to install configuration
install_configuration() {
    print_info "Installing configuration..."
    
    # Copy configuration files
    if [ -d "config" ]; then
        cp config/*.conf "$CONFIG_DIR/"
        cp config/*.service "$SERVICE_DIR/"
        print_status "Configuration installed"
    else
        print_warning "No configuration files found"
    fi
}

# Function to install desktop shortcuts
install_desktop_shortcuts() {
    print_info "Installing desktop shortcuts..."
    
    local desktop_dir="/usr/share/applications"
    
    # Copy desktop shortcuts
    if [ -d "apps" ]; then
        cp apps/*.desktop "$desktop_dir/"
        print_status "Desktop shortcuts installed"
    else
        print_warning "No desktop shortcuts found"
    fi
}

# Function to enable services
enable_services() {
    print_info "Enabling services..."
    
    systemctl daemon-reload
    
    if [ -f "$SERVICE_DIR/tau-session.service" ]; then
        systemctl enable tau-session.service
        print_status "Tau session service enabled"
    fi
    
    if [ -f "$SERVICE_DIR/tau-powerd.service" ]; then
        systemctl enable tau-powerd.service
        print_status "Tau power management service enabled"
    fi
}

# Function to run post-installation tests
run_post_installation_tests() {
    print_info "Running post-installation tests..."
    
    # Test if binaries exist
    local binaries=("tau-session" "tau-powerd" "tau-inputd" "tau-settings" "taustore" "taumedia")
    for binary in "${binaries[@]}"; do
        if command -v "$binary" &> /dev/null; then
            print_status "Binary available: $binary"
        else
            print_warning "Binary missing: $binary"
        fi
    done
    
    # Test if services are enabled
    if systemctl is-enabled tau-session.service &> /dev/null; then
        print_status "Tau session service enabled"
    else
        print_warning "Tau session service not enabled"
    fi
    
    print_status "Post-installation tests completed"
}

# Function to display completion message
display_completion_message() {
    echo ""
    echo -e "${GREEN}🎉 TauOS Installation Completed Successfully!${NC}"
    echo ""
    echo -e "${CYAN}What's Next:${NC}"
    echo -e "${YELLOW}1. Reboot your system: sudo reboot${NC}"
    echo -e "${YELLOW}2. Log in and explore TauOS applications${NC}"
    echo -e "${YELLOW}3. Configure settings: tau-settings${NC}"
    echo -e "${YELLOW}4. Install apps: taustore${NC}"
    echo -e "${YELLOW}5. Get help: https://tauos.org/support${NC}"
    echo ""
    echo -e "${PURPLE}Welcome to the future of privacy-first computing!${NC}"
}

# Main installation function
main() {
    echo -e "${PURPLE}Starting TauOS installation...${NC}"
    echo ""
    
    check_system_requirements
    install_dependencies
    create_directories
    install_binaries
    install_configuration
    install_desktop_shortcuts
    enable_services
    run_post_installation_tests
    display_completion_message
}

# Run main function
main "$@"
INSTALLER_EOF

    chmod +x "$INSTALLER_DIR/install.sh"
    print_status "Installer script created"
}

# Function to create package
create_package() {
    print_info "Creating unified installer package..."
    
    cd "$BUILD_DIR"
    
    # Create tar.gz package
    tar -czf "tauos-unified-$VERSION.tar.gz" -C "$BUILD_DIR" installer/
    
    # Create SHA256 checksum
    sha256sum "tauos-unified-$VERSION.tar.gz" > "tauos-unified-$VERSION.tar.gz.sha256"
    
    print_status "Package created: tauos-unified-$VERSION.tar.gz"
    print_status "Checksum created: tauos-unified-$VERSION.tar.gz.sha256"
}

# Function to display build summary
display_build_summary() {
    echo ""
    echo -e "${GREEN}🎉 Unified Installer Build Completed Successfully!${NC}"
    echo ""
    echo -e "${CYAN}Build Summary:${NC}"
    echo -e "${YELLOW}Package: $BUILD_DIR/tauos-unified-$VERSION.tar.gz${NC}"
    echo -e "${YELLOW}Checksum: $BUILD_DIR/tauos-unified-$VERSION.tar.gz.sha256${NC}"
    echo -e "${YELLOW}Installer Directory: $INSTALLER_DIR${NC}"
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo -e "${YELLOW}1. Test the installer on a clean system${NC}"
    echo -e "${YELLOW}2. Upload to download server${NC}"
    echo -e "${YELLOW}3. Update website with download links${NC}"
    echo -e "${YELLOW}4. Prepare for public launch${NC}"
}

# Main execution
main() {
    echo -e "${PURPLE}Starting TauOS Unified Installer Build${NC}"
    echo ""
    
    setup_build_environment
    build_core_components
    build_gui_applications
    build_desktop_applications
    create_configuration_files
    create_desktop_shortcuts
    create_installer_script
    create_package
    display_build_summary
}

# Run main function
main "$@" 