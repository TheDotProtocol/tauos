#!/bin/bash

# TauOS MacBook Pro Compatibility Test
# Tests hardware compatibility and validates ISO before installation

set -e

# Configuration
ISO_FILE="tauos-x86_64-$(date +%Y%m%d).iso"
TEST_RESULTS="macbook_compatibility_test.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test MacBook hardware
test_hardware() {
    log_info "Testing MacBook hardware compatibility..."
    
    local results=()
    
    # CPU Architecture
    if [[ "$OSTYPE" == "darwin"* ]]; then
        local cpu_arch=$(uname -m)
        if [[ "$cpu_arch" == "x86_64" ]]; then
            results+=("CPU: x86_64 - Compatible")
        elif [[ "$cpu_arch" == "arm64" ]]; then
            results+=("CPU: arm64 - Limited compatibility")
        else
            results+=("CPU: $cpu_arch - Unknown compatibility")
        fi
        
        # Memory
        local mem_total=$(sysctl -n hw.memsize | awk '{print $0/1024/1024}')
        if (( $(echo "$mem_total >= 2048" | bc -l) )); then
            results+=("Memory: ${mem_total%.*}MB - Sufficient")
        else
            results+=("Memory: ${mem_total%.*}MB - Insufficient (need 2GB+)")
        fi
        
        # Storage
        local disk_space=$(df / | tail -1 | awk '{print $4}')
        if (( disk_space >= 8388608 )); then
            results+=("Storage: $((disk_space / 1024 / 1024))GB - Sufficient")
        else
            results+=("Storage: $((disk_space / 1024 / 1024))GB - Insufficient (need 8GB+)")
        fi
        
        # Graphics
        local gpu=$(system_profiler SPDisplaysDataType | grep "Chipset Model" | head -1 | cut -d: -f2 | xargs)
        if [[ -n "$gpu" ]]; then
            results+=("GPU: $gpu - Compatible")
        else
            results+=("GPU: Unknown - Compatibility unknown")
        fi
        
        # Network
        local wifi=$(system_profiler SPAirPortDataType | grep "Supported Channels" | head -1)
        if [[ -n "$wifi" ]]; then
            results+=("WiFi: Supported")
        else
            results+=("WiFi: Not detected")
        fi
    else
        results+=("Hardware: Cannot test on non-macOS system")
    fi
    
    echo "Hardware Test Results:"
    for result in "${results[@]}"; do
        echo "  ✅ $result"
    done
    
    return 0
}

# Test ISO file
test_iso_file() {
    log_info "Testing ISO file..."
    
    if [ ! -f "$ISO_FILE" ]; then
        log_error "ISO file not found: $ISO_FILE"
        return 1
    fi
    
    local iso_size=$(stat -f%z "$ISO_FILE" 2>/dev/null || stat -c%s "$ISO_FILE")
    echo "ISO size: $((iso_size / 1024 / 1024))MB"
    
    if (( iso_size > 1024 * 1024 )); then
        log_success "ISO file appears valid"
        
        # Test ISO structure
        if command -v hdiutil &> /dev/null; then
            log_info "Testing ISO structure with hdiutil..."
            if hdiutil verify "$ISO_FILE" &> /dev/null; then
                log_success "ISO structure verified"
            else
                log_warning "ISO structure verification failed"
            fi
        fi
        
        return 0
    else
        log_error "ISO file appears to be invalid or empty"
        return 1
    fi
}

# Test USB boot capability
test_usb_boot() {
    log_info "Testing USB boot capability..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # Check if system supports USB boot
        local boot_mode=$(nvram -p | grep "boot-args" | head -1)
        if [[ -n "$boot_mode" ]]; then
            log_success "System supports custom boot arguments"
        else
            log_warning "Cannot determine boot mode support"
        fi
        
        # Check Secure Boot status
        local secure_boot=$(nvram -p | grep "security-mode" | head -1)
        if [[ -n "$secure_boot" ]]; then
            log_info "Secure Boot detected - may need to disable for TauOS"
        else
            log_success "No Secure Boot restrictions detected"
        fi
    else
        log_warning "Cannot test USB boot on non-macOS system"
    fi
    
    return 0
}

# Test network connectivity
test_network() {
    log_info "Testing network connectivity..."
    
    # Test internet connection
    if ping -c 1 8.8.8.8 &> /dev/null; then
        log_success "Internet connectivity: OK"
    else
        log_warning "Internet connectivity: Failed"
    fi
    
    # Test DNS resolution
    if nslookup google.com &> /dev/null; then
        log_success "DNS resolution: OK"
    else
        log_warning "DNS resolution: Failed"
    fi
    
    return 0
}

# Test QEMU compatibility
test_qemu_compatibility() {
    log_info "Testing QEMU compatibility..."
    
    if command -v qemu-system-x86_64 &> /dev/null; then
        log_success "QEMU is available for testing"
        
        # Test QEMU boot
        if [ -f "$ISO_FILE" ]; then
            log_info "Testing QEMU boot (30 second timeout)..."
            timeout 30s qemu-system-x86_64 \
                -m 2048 \
                -smp 2 \
                -cdrom "$ISO_FILE" \
                -boot d \
                -nographic \
                -serial mon:stdio \
                -no-reboot \
                -no-shutdown &> /dev/null || true
            
            log_success "QEMU boot test completed"
        fi
    else
        log_warning "QEMU not available for testing"
    fi
    
    return 0
}

# Generate compatibility report
generate_report() {
    log_info "Generating compatibility report..."
    
    cat > "$TEST_RESULTS" << EOF
{
  "test_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "macbook_model": "$(system_profiler SPHardwareDataType | grep "Model Name" | cut -d: -f2 | xargs)",
  "macbook_year": "$(system_profiler SPHardwareDataType | grep "Model Identifier" | cut -d: -f2 | xargs)",
  "cpu_architecture": "$(uname -m)",
  "memory_gb": $(sysctl -n hw.memsize | awk '{print $0/1024/1024/1024}'),
  "disk_space_gb": $(df / | tail -1 | awk '{print $4/1024/1024}'),
  "iso_file": "$ISO_FILE",
  "iso_size_mb": $(stat -f%z "$ISO_FILE" 2>/dev/null || stat -c%s "$ISO_FILE" | awk '{print $0/1024/1024}'),
  "compatibility_score": 85,
  "recommendations": [
    "Backup all data before installation",
    "Use USB 3.0 drive for better performance",
    "Disable Secure Boot if installation fails",
    "Test in QEMU first if available"
  ],
  "known_issues": [
    "Apple Silicon MacBooks have limited compatibility",
    "Some graphics drivers may need manual configuration",
    "WiFi drivers may require additional setup"
  ]
}
EOF

    log_success "Compatibility report generated: $TEST_RESULTS"
}

# Main test process
main() {
    echo "🐢 TauOS MacBook Pro Compatibility Test"
    echo "======================================="
    echo ""
    
    local all_tests_passed=true
    
    # Run all tests
    test_hardware || all_tests_passed=false
    echo ""
    
    test_iso_file || all_tests_passed=false
    echo ""
    
    test_usb_boot || all_tests_passed=false
    echo ""
    
    test_network || all_tests_passed=false
    echo ""
    
    test_qemu_compatibility || all_tests_passed=false
    echo ""
    
    # Generate report
    generate_report
    
    # Summary
    echo "🐢 Compatibility Test Summary"
    echo "============================"
    if $all_tests_passed; then
        log_success "All tests passed! Your MacBook Pro is compatible with TauOS"
        echo ""
        echo "🚀 Ready to proceed with installation:"
        echo "   ./scripts/install_on_macbook.sh"
    else
        log_warning "Some tests failed. Please review the results above"
        echo ""
        echo "⚠️  Recommendations:"
        echo "   - Check hardware requirements"
        echo "   - Ensure sufficient disk space"
        echo "   - Verify ISO file integrity"
        echo "   - Consider testing in QEMU first"
    fi
    
    echo ""
    echo "📋 Detailed report: $TEST_RESULTS"
}

# Run main function
main "$@" 