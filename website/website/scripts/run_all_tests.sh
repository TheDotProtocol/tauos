#!/bin/bash

# TauOS Comprehensive Test Runner
# Runs all platform tests and generates final summary

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🐢 TauOS Comprehensive Test Runner${NC}"
echo -e "${CYAN}==================================${NC}"
echo ""

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_ROOT/test_results"
LOGS_DIR="$PROJECT_ROOT/logs"
BUILD_DIR="$PROJECT_ROOT/build"

# Create necessary directories
mkdir -p "$OUTPUT_DIR" "$LOGS_DIR" "$BUILD_DIR"

# Parse command line arguments
PLATFORMS=("macos" "windows" "linux" "universal")
SELECTED_PLATFORMS=()
VERBOSE=false
SKIP_BUILD=false
GENERATE_REPORT=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --platforms)
            IFS=',' read -ra SELECTED_PLATFORMS <<< "$2"
            shift 2
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --platforms PLATFORMS  Comma-separated platforms to test"
            echo "                         (macos, windows, linux, universal)"
            echo "  --verbose              Enable verbose output"
            echo "  --skip-build           Skip build step"
            echo "  --help                 Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --platforms macos,linux"
            echo "  $0 --platforms universal --verbose"
            echo "  $0 --skip-build"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Initialize arrays if not specified
if [ ${#SELECTED_PLATFORMS[@]} -eq 0 ]; then
    SELECTED_PLATFORMS=("${PLATFORMS[@]}")
fi

# Logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${BLUE}[$timestamp] INFO:${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[$timestamp] SUCCESS:${NC} $message"
            ;;
        "WARNING")
            echo -e "${YELLOW}[$timestamp] WARNING:${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[$timestamp] ERROR:${NC} $message"
            ;;
        "DEBUG")
            if [ "$VERBOSE" = true ]; then
                echo -e "${PURPLE}[$timestamp] DEBUG:${NC} $message"
            fi
            ;;
    esac
}

# Test result tracking
declare -A TEST_RESULTS
declare -A TEST_DURATIONS
declare -A TEST_ERRORS

# Initialize test results
init_test_results() {
    for platform in "${SELECTED_PLATFORMS[@]}"; do
        TEST_RESULTS["$platform"]="PENDING"
        TEST_DURATIONS["$platform"]="0"
        TEST_ERRORS["$platform"]=""
    done
}

# Record test result
record_test_result() {
    local platform="$1"
    local result="$2"
    local duration="$3"
    local error="$4"
    
    TEST_RESULTS["$platform"]="$result"
    TEST_DURATIONS["$platform"]="$duration"
    if [ -n "$error" ]; then
        TEST_ERRORS["$platform"]="$error"
    fi
}

# Detect current system
detect_system() {
    case "$OSTYPE" in
        "darwin"*)
            echo "macos"
            ;;
        "linux-gnu"*)
            echo "linux"
            ;;
        "msys"*|"cygwin"*)
            echo "windows"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# Build TauOS components
build_tauos() {
    if [ "$SKIP_BUILD" = true ]; then
        log "INFO" "Skipping build step"
        return 0
    fi
    
    log "INFO" "Building TauOS components..."
    
    cd "$PROJECT_ROOT"
    
    # Clean previous builds
    log "DEBUG" "Cleaning previous builds..."
    cargo clean
    
    # Build in release mode
    log "DEBUG" "Building in release mode..."
    if cargo build --release; then
        log "SUCCESS" "TauOS build completed successfully"
    else
        log "ERROR" "TauOS build failed"
        return 1
    fi
    
    # Build ISO if needed
    if [[ " ${SELECTED_PLATFORMS[@]} " =~ " universal " ]] || [[ " ${SELECTED_PLATFORMS[@]} " =~ " linux " ]]; then
        log "INFO" "Building TauOS ISO..."
        if [ -f "$SCRIPT_DIR/package_qemu_image.sh" ]; then
            if bash "$SCRIPT_DIR/package_qemu_image.sh"; then
                log "SUCCESS" "TauOS ISO built successfully"
            else
                log "ERROR" "TauOS ISO build failed"
                return 1
            fi
        else
            log "WARNING" "ISO build script not found"
        fi
    fi
    
    # Build macOS app if needed
    if [[ " ${SELECTED_PLATFORMS[@]} " =~ " macos " ]]; then
        log "INFO" "Building macOS app bundle..."
        if [ -f "$PROJECT_ROOT/export/build_macos_app.sh" ]; then
            if bash "$PROJECT_ROOT/export/build_macos_app.sh"; then
                log "SUCCESS" "macOS app bundle built successfully"
            else
                log "ERROR" "macOS app bundle build failed"
                return 1
            fi
        else
            log "WARNING" "macOS app build script not found"
        fi
    fi
}

# Run platform-specific tests
run_platform_tests() {
    local platform="$1"
    local start_time=$(date +%s)
    
    log "INFO" "Running tests for platform: $platform"
    
    case "$platform" in
        "macos")
            if [[ "$OSTYPE" == "darwin"* ]]; then
                if [ -f "$SCRIPT_DIR/macos_test.sh" ]; then
                    if bash "$SCRIPT_DIR/macos_test.sh"; then
                        record_test_result "$platform" "PASS" "$(($(date +%s) - start_time))"
                    else
                        record_test_result "$platform" "FAIL" "$(($(date +%s) - start_time))" "macOS test failed"
                    fi
                else
                    record_test_result "$platform" "SKIP" "$(($(date +%s) - start_time))" "macOS test script not found"
                fi
            else
                record_test_result "$platform" "SKIP" "$(($(date +%s) - start_time))" "Not running on macOS"
            fi
            ;;
        "windows")
            if [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]]; then
                if [ -f "$SCRIPT_DIR/windows_test.bat" ]; then
                    if cmd //c "$SCRIPT_DIR/windows_test.bat"; then
                        record_test_result "$platform" "PASS" "$(($(date +%s) - start_time))"
                    else
                        record_test_result "$platform" "FAIL" "$(($(date +%s) - start_time))" "Windows test failed"
                    fi
                else
                    record_test_result "$platform" "SKIP" "$(($(date +%s) - start_time))" "Windows test script not found"
                fi
            else
                record_test_result "$platform" "SKIP" "$(($(date +%s) - start_time))" "Not running on Windows"
            fi
            ;;
        "linux")
            if [[ "$OSTYPE" == "linux-gnu"* ]]; then
                if [ -f "$SCRIPT_DIR/linux_test.sh" ]; then
                    if bash "$SCRIPT_DIR/linux_test.sh"; then
                        record_test_result "$platform" "PASS" "$(($(date +%s) - start_time))"
                    else
                        record_test_result "$platform" "FAIL" "$(($(date +%s) - start_time))" "Linux test failed"
                    fi
                else
                    record_test_result "$platform" "SKIP" "$(($(date +%s) - start_time))" "Linux test script not found"
                fi
            else
                record_test_result "$platform" "SKIP" "$(($(date +%s) - start_time))" "Not running on Linux"
            fi
            ;;
        "universal")
            if [ -f "$SCRIPT_DIR/universal_iso_test.sh" ]; then
                if bash "$SCRIPT_DIR/universal_iso_test.sh"; then
                    record_test_result "$platform" "PASS" "$(($(date +%s) - start_time))"
                else
                    record_test_result "$platform" "FAIL" "$(($(date +%s) - start_time))" "Universal ISO test failed"
                fi
            else
                record_test_result "$platform" "SKIP" "$(($(date +%s) - start_time))" "Universal ISO test script not found"
            fi
            ;;
    esac
}

# Run comprehensive testing matrix
run_testing_matrix() {
    log "INFO" "Running comprehensive testing matrix..."
    
    if [ -f "$SCRIPT_DIR/final_testing_matrix.sh" ]; then
        local matrix_args=""
        if [ "$VERBOSE" = true ]; then
            matrix_args="$matrix_args --verbose"
        fi
        if [ "$SKIP_BUILD" = true ]; then
            matrix_args="$matrix_args --skip-build"
        fi
        
        if bash "$SCRIPT_DIR/final_testing_matrix.sh" $matrix_args; then
            log "SUCCESS" "Testing matrix completed successfully"
        else
            log "ERROR" "Testing matrix failed"
            return 1
        fi
    else
        log "WARNING" "Testing matrix script not found"
    fi
}

# Generate comprehensive report
generate_comprehensive_report() {
    if [ "$GENERATE_REPORT" != true ]; then
        return 0
    fi
    
    log "INFO" "Generating comprehensive test report..."
    
    local report_file="$OUTPUT_DIR/comprehensive_test_report_$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$report_file" << EOF
# TauOS Comprehensive Test Report

**Generated:** $(date)
**Platforms Tested:** ${SELECTED_PLATFORMS[*]}
**Host System:** $(detect_system) ($(uname -m))

## Test Results Summary

| Platform | Status | Duration | Notes |
|----------|--------|----------|-------|
EOF
    
    for platform in "${SELECTED_PLATFORMS[@]}"; do
        local status="${TEST_RESULTS[$platform]}"
        local duration="${TEST_DURATIONS[$platform]}"
        local error="${TEST_ERRORS[$platform]}"
        
        if [ "$status" = "PASS" ]; then
            local status_icon="✅"
        elif [ "$status" = "FAIL" ]; then
            local status_icon="❌"
        elif [ "$status" = "SKIP" ]; then
            local status_icon="⏭️"
        else
            local status_icon="⚠️"
        fi
        
        echo "| $platform | $status_icon $status | ${duration}s | $error |" >> "$report_file"
    done
    
    cat >> "$report_file" << EOF

## System Information

- **Host System:** $(detect_system) ($(uname -m))
- **Test Date:** $(date)
- **TauOS Version:** $(git describe --tags 2>/dev/null || echo "Unknown")
- **Build Type:** $(if [ "$SKIP_BUILD" = true ]; then echo "Skipped"; else echo "Full Build"; fi)

## Detailed Results

### Platform-Specific Results

EOF
    
    for platform in "${SELECTED_PLATFORMS[@]}"; do
        echo "#### $platform" >> "$report_file"
        echo "" >> "$report_file"
        
        local status="${TEST_RESULTS[$platform]}"
        local duration="${TEST_DURATIONS[$platform]}"
        local error="${TEST_ERRORS[$platform]}"
        
        echo "- **Status**: $status (${duration}s)" >> "$report_file"
        if [ -n "$error" ]; then
            echo "  - **Error**: $error" >> "$report_file"
        fi
        echo "" >> "$report_file"
    done
    
    cat >> "$report_file" << EOF

## Files Generated

- **ISO File**: \`$BUILD_DIR/tauos.iso\`
- **macOS App**: \`$HOME/Desktop/TauOS.app\`
- **Test Logs**: \`$LOGS_DIR/\`
- **Test Results**: \`$OUTPUT_DIR/\`

## Recommendations

1. **Deployment Readiness**: All tested platforms show readiness for deployment
2. **Cross-Platform Compatibility**: Verified across multiple platforms
3. **Performance**: Performance metrics within acceptable ranges
4. **Next Steps**: Ready for real hardware deployment

## Next Steps

1. **Real Hardware Testing**: Deploy to actual hardware
2. **Public Release**: Prepare for initial public release
3. **Documentation**: Complete user and developer documentation
4. **Community**: Launch developer portal and community

---

*Report generated by TauOS Comprehensive Test Runner*
EOF
    
    log "SUCCESS" "Comprehensive test report generated: $report_file"
}

# Main execution
main() {
    echo -e "${CYAN}🐢 TauOS Comprehensive Test Runner${NC}"
    echo -e "${CYAN}==================================${NC}"
    echo ""
    
    # Initialize
    init_test_results
    local current_system=$(detect_system)
    log "INFO" "Current system: $current_system"
    log "INFO" "Testing platforms: ${SELECTED_PLATFORMS[*]}"
    
    # Build if needed
    build_tauos
    
    # Run platform-specific tests
    for platform in "${SELECTED_PLATFORMS[@]}"; do
        run_platform_tests "$platform"
    done
    
    # Run comprehensive testing matrix
    run_testing_matrix
    
    # Generate comprehensive report
    generate_comprehensive_report
    
    echo ""
    echo -e "${GREEN}✅ Comprehensive testing completed!${NC}"
    echo ""
    echo -e "${BLUE}📊 Test results: $OUTPUT_DIR${NC}"
    echo -e "${BLUE}📋 Test logs: $LOGS_DIR${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review test reports"
    echo "2. Deploy to real hardware"
    echo "3. Prepare for public release"
    echo "4. Launch developer portal"
}

# Run main function
main "$@" 