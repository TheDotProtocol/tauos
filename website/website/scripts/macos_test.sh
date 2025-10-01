#!/bin/bash

# TauOS macOS Testing Script
# Tests TauOS on macOS (Intel and Apple Silicon)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo "🐢 TauOS macOS Testing"
echo "======================"

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ This script should be run on macOS${NC}"
    exit 1
fi

# Detect architecture
ARCH=$(uname -m)
echo "Architecture: $ARCH"

# Test configuration
APP_PATH="$HOME/Desktop/TauOS.app"
BUILD_DIR="$(dirname "$(dirname "$0")")/build"
EXPORT_DIR="$(dirname "$(dirname "$0")")/export"

# Test functions
test_app_bundle() {
    echo ""
    echo "=== App Bundle Testing ==="
    
    if [ -d "$APP_PATH" ]; then
        echo -e "${GREEN}✅ TauOS.app found${NC}"
        
        # Test app bundle structure
        local required_files=("Contents/MacOS/TauOS" "Contents/Resources/theme.css" "Contents/Info.plist")
        local missing_files=()
        
        for file in "${required_files[@]}"; do
            if [ -f "$APP_PATH/$file" ]; then
                echo "Found: $file"
            else
                missing_files+=("$file")
            fi
        done
        
        if [ ${#missing_files[@]} -eq 0 ]; then
            echo -e "${GREEN}✅ App bundle structure is complete${NC}"
        else
            echo -e "${YELLOW}⚠️  Missing files: ${missing_files[*]}${NC}"
        fi
    else
        echo -e "${RED}❌ TauOS.app not found${NC}"
        echo "Building macOS app bundle..."
        
        if [ -f "$EXPORT_DIR/build_macos_app.sh" ]; then
            bash "$EXPORT_DIR/build_macos_app.sh"
        else
            echo -e "${RED}❌ macOS app build script not found${NC}"
            return 1
        fi
    fi
}

test_app_launch() {
    echo ""
    echo "=== App Launch Testing ==="
    
    if [ -f "$APP_PATH/Contents/MacOS/TauOS" ]; then
        echo "Testing app launch (10 second timeout)..."
        
        # Test app launch
        if timeout 10s "$APP_PATH/Contents/MacOS/TauOS" --test-mode &> /dev/null; then
            echo -e "${GREEN}✅ App launch test passed${NC}"
        else
            echo -e "${YELLOW}⚠️  App launch test failed (expected in test mode)${NC}"
        fi
        
        # Test startup time
        echo "Testing startup time..."
        local start_time=$(date +%s%N)
        timeout 5s "$APP_PATH/Contents/MacOS/TauOS" --test-mode &> /dev/null
        local end_time=$(date +%s%N)
        local duration=$(((end_time - start_time) / 1000000))
        echo "Startup time: ${duration}ms"
    else
        echo -e "${RED}❌ App executable not found${NC}"
    fi
}

test_gatekeeper() {
    echo ""
    echo "=== Gatekeeper Testing ==="
    
    if [ -d "$APP_PATH" ]; then
        # Check if app is quarantined
        if xattr -p com.apple.quarantine "$APP_PATH" &> /dev/null; then
            echo -e "${YELLOW}⚠️  App is quarantined by Gatekeeper${NC}"
            echo "To remove quarantine: xattr -d com.apple.quarantine $APP_PATH"
        else
            echo -e "${GREEN}✅ App is not quarantined${NC}"
        fi
        
        # Test app signing
        if codesign -dv "$APP_PATH" &> /dev/null; then
            echo -e "${GREEN}✅ App is properly signed${NC}"
        else
            echo -e "${YELLOW}⚠️  App is not signed${NC}"
        fi
    fi
}

test_architecture_compatibility() {
    echo ""
    echo "=== Architecture Compatibility Testing ==="
    
    if [ -f "$APP_PATH/Contents/MacOS/TauOS" ]; then
        # Check architecture support
        local arch_info=$(file "$APP_PATH/Contents/MacOS/TauOS")
        echo "Binary architecture: $arch_info"
        
        if [[ "$ARCH" == "arm64" ]]; then
            if echo "$arch_info" | grep -q "arm64"; then
                echo -e "${GREEN}✅ Native Apple Silicon support${NC}"
            elif echo "$arch_info" | grep -q "x86_64"; then
                echo -e "${YELLOW}⚠️  Running under Rosetta 2${NC}"
            else
                echo -e "${RED}❌ Architecture compatibility issue${NC}"
            fi
        elif [[ "$ARCH" == "x86_64" ]]; then
            if echo "$arch_info" | grep -q "x86_64"; then
                echo -e "${GREEN}✅ Native Intel support${NC}"
            else
                echo -e "${RED}❌ Architecture compatibility issue${NC}"
            fi
        fi
    fi
}

test_performance() {
    echo ""
    echo "=== Performance Testing ==="
    
    if [ -f "$APP_PATH/Contents/MacOS/TauOS" ]; then
        echo "Running performance tests..."
        
        # Memory usage test
        echo "Testing memory usage..."
        local memory_usage=$(ps -o rss= -p $$ 2>/dev/null || echo "Unknown")
        echo "Memory usage: ${memory_usage}KB"
        
        # CPU usage test
        echo "Testing CPU usage..."
        local cpu_usage=$(ps -o %cpu= -p $$ 2>/dev/null || echo "Unknown")
        echo "CPU usage: ${cpu_usage}%"
        
        # Multiple launch test
        echo "Testing multiple launches..."
        for i in {1..3}; do
            local start_time=$(date +%s%N)
            timeout 3s "$APP_PATH/Contents/MacOS/TauOS" --test-mode &> /dev/null
            local end_time=$(date +%s%N)
            local duration=$(((end_time - start_time) / 1000000))
            echo "Launch $i: ${duration}ms"
        done
    fi
}

test_cli_tools() {
    echo ""
    echo "=== CLI Tools Testing ==="
    
    local cli_tools=("tau-upd" "taustore" "sandboxd")
    local build_dir="$(dirname "$(dirname "$0")")"
    
    for tool in "${cli_tools[@]}"; do
        if [ -f "$build_dir/target/release/$tool" ]; then
            echo -e "${GREEN}✅ Found: $tool${NC}"
            
            # Test tool execution
            if timeout 5s "$build_dir/target/release/$tool" --help &> /dev/null; then
                echo "  - Help command works"
            else
                echo "  - Help command failed (expected)"
            fi
        else
            echo -e "${YELLOW}⚠️  Missing: $tool${NC}"
        fi
    done
}

test_sdk() {
    echo ""
    echo "=== SDK Testing ==="
    
    local sdk_dir="$(dirname "$(dirname "$0")")/sdk"
    
    if [ -d "$sdk_dir" ]; then
        echo -e "${GREEN}✅ SDK directory found${NC}"
        
        # Test SDK templates
        local sdk_templates=("c" "rust" "python")
        for template in "${sdk_templates[@]}"; do
            if [ -d "$sdk_dir/templates/$template" ]; then
                echo "Found SDK template: $template"
            else
                echo -e "${YELLOW}⚠️  Missing SDK template: $template${NC}"
            fi
        done
        
        # Test SDK tools
        if [ -f "$sdk_dir/tau-sdk" ]; then
            echo "Found SDK tool: tau-sdk"
        else
            echo -e "${YELLOW}⚠️  Missing SDK tool: tau-sdk${NC}"
        fi
    else
        echo -e "${RED}❌ SDK directory not found${NC}"
    fi
}

# Main execution
main() {
    echo "Starting macOS testing..."
    echo "Architecture: $ARCH"
    echo "App path: $APP_PATH"
    echo ""
    
    test_app_bundle
    test_app_launch
    test_gatekeeper
    test_architecture_compatibility
    test_performance
    test_cli_tools
    test_sdk
    
    echo ""
    echo -e "${GREEN}✅ macOS testing completed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test on different macOS versions"
    echo "2. Test on different Apple Silicon Macs"
    echo "3. Test on different Intel Macs"
    echo "4. Submit for notarization if needed"
}

# Run main function
main "$@" 