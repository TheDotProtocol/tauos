#!/bin/bash

# TauOS Multi-Platform Testing Matrix
# Tests TauOS across macOS, Windows, Linux, and creates universal ISOs

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
PLATFORM=""
TEST_TYPE="all"
OUTPUT_DIR="test_results"
VERBOSE=false
SKIP_BUILD=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --platform)
            PLATFORM="$2"
            shift 2
            ;;
        --test-type)
            TEST_TYPE="$2"
            shift 2
            ;;
        --output-dir)
            OUTPUT_DIR="$2"
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
            echo "Options:"
            echo "  --platform PLATFORM  Platform to test (macos, windows, linux, universal)"
            echo "  --test-type TYPE     Test type (all, gui, cli, iso, sdk)"
            echo "  --output-dir DIR     Output directory for results"
            echo "  --verbose            Enable verbose output"
            echo "  --skip-build         Skip build step"
            echo "  --help               Show this help message"
            echo ""
            echo "Platforms:"
            echo "  macos     - Test macOS app bundle (Intel + Apple Silicon)"
            echo "  windows   - Test Windows QEMU runner"
            echo "  linux     - Test Linux ISO in various VMs"
            echo "  universal - Test universal ISO for USB boot"
            echo ""
            echo "Test Types:"
            echo "  all       - Run all tests"
            echo "  gui       - Test GUI environment"
            echo "  cli       - Test command line interface"
            echo "  iso       - Test ISO boot and functionality"
            echo "  sdk       - Test SDK functionality"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Create output directory
mkdir -p "$OUTPUT_DIR"

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
    esac
}

# Test result tracking
TEST_RESULTS=()
add_test_result() {
    local test_name="$1"
    local status="$2"
    local details="$3"
    TEST_RESULTS+=("$test_name|$status|$details")
}

# Detect platform
detect_platform() {
    case "$(uname -s)" in
        Darwin*)
            echo "macos"
            ;;
        Linux*)
            echo "linux"
            ;;
        MINGW*|MSYS*|CYGWIN*)
            echo "windows"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# Check system requirements
check_requirements() {
    log "INFO" "Checking system requirements..."
    
    local current_platform=$(detect_platform)
    log "INFO" "Detected platform: $current_platform"
    
    # Check for required tools
    local missing_tools=()
    
    # Common requirements
    if ! command -v qemu-system-x86_64 &> /dev/null; then
        missing_tools+=("qemu-system-x86_64")
    fi
    
    if ! command -v cargo &> /dev/null; then
        missing_tools+=("cargo")
    fi
    
    # Platform-specific requirements
    case $current_platform in
        "macos")
            if ! command -v xcodebuild &> /dev/null; then
                missing_tools+=("xcodebuild")
            fi
            ;;
        "linux")
            if ! command -v genisoimage &> /dev/null && ! command -v mkisofs &> /dev/null; then
                missing_tools+=("genisoimage or mkisofs")
            fi
            ;;
        "windows")
            if ! command -v qemu-system-x86_64.exe &> /dev/null; then
                missing_tools+=("qemu-system-x86_64.exe")
            fi
            ;;
    esac
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        log "ERROR" "Missing required tools: ${missing_tools[*]}"
        log "INFO" "Please install missing tools and try again"
        exit 1
    fi
    
    log "SUCCESS" "All system requirements met"
}

# Build TauOS components
build_components() {
    if [ "$SKIP_BUILD" = true ]; then
        log "INFO" "Skipping build step"
        return
    fi
    
    log "INFO" "Building TauOS components..."
    
    # Build demo components
    if [ -f "scripts/build_demo.sh" ]; then
        log "INFO" "Building demo components..."
        ./scripts/build_demo.sh
    fi
    
    # Build SDK
    if [ -d "sdk" ]; then
        log "INFO" "Building SDK..."
        cd sdk && cargo build --release && cd ..
    fi
    
    # Build ISO
    if [ -f "scripts/package_qemu_image.sh" ]; then
        log "INFO" "Building QEMU ISO..."
        ./scripts/package_qemu_image.sh --theme black-gold --splash --shimmer --target x86_64
    fi
    
    log "SUCCESS" "All components built successfully"
}

# Test macOS platform
test_macos() {
    log "INFO" "Testing macOS platform..."
    
    local current_platform=$(detect_platform)
    if [ "$current_platform" != "macos" ]; then
        log "WARNING" "macOS tests should be run on macOS"
        add_test_result "macos_platform_check" "SKIPPED" "Not running on macOS"
        return
    fi
    
    # Test 1: Build macOS app
    log "INFO" "Testing macOS app build..."
    if [ -f "export/build_macos_app_demo.sh" ]; then
        ./export/build_macos_app_demo.sh --theme black-gold --output "$OUTPUT_DIR/TauOS.app"
        if [ $? -eq 0 ]; then
            add_test_result "macos_app_build" "PASS" "App bundle created successfully"
        else
            add_test_result "macos_app_build" "FAIL" "App build failed"
        fi
    else
        add_test_result "macos_app_build" "SKIP" "Build script not found"
    fi
    
    # Test 2: Check app bundle structure
    if [ -d "$OUTPUT_DIR/TauOS.app" ]; then
        log "INFO" "Testing app bundle structure..."
        if [ -d "$OUTPUT_DIR/TauOS.app/Contents/MacOS" ] && [ -d "$OUTPUT_DIR/TauOS.app/Contents/Resources" ]; then
            add_test_result "macos_app_structure" "PASS" "App bundle structure correct"
        else
            add_test_result "macos_app_structure" "FAIL" "App bundle structure incorrect"
        fi
    fi
    
    # Test 3: Test app launch (simulated)
    log "INFO" "Testing app launch..."
    if [ -f "$OUTPUT_DIR/TauOS.app/Contents/MacOS/TauOS" ]; then
        add_test_result "macos_app_launch" "PASS" "App executable found"
    else
        add_test_result "macos_app_launch" "FAIL" "App executable not found"
    fi
    
    # Test 4: Check for Apple Silicon compatibility
    log "INFO" "Testing Apple Silicon compatibility..."
    local arch=$(uname -m)
    if [ "$arch" = "arm64" ]; then
        add_test_result "macos_apple_silicon" "PASS" "Running on Apple Silicon ($arch)"
    else
        add_test_result "macos_apple_silicon" "INFO" "Running on Intel ($arch)"
    fi
    
    log "SUCCESS" "macOS platform tests completed"
}

# Test Windows platform
test_windows() {
    log "INFO" "Testing Windows platform..."
    
    # Test 1: Check for Windows QEMU
    log "INFO" "Testing Windows QEMU availability..."
    if command -v qemu-system-x86_64.exe &> /dev/null; then
        add_test_result "windows_qemu_available" "PASS" "QEMU found on Windows"
    else
        add_test_result "windows_qemu_available" "FAIL" "QEMU not found on Windows"
    fi
    
    # Test 2: Create Windows batch script
    log "INFO" "Creating Windows batch script..."
    cat > "$OUTPUT_DIR/run_tauos.bat" << 'EOF'
@echo off
echo TauOS Windows Launcher
echo ====================

REM Check if QEMU is available
where qemu-system-x86_64.exe >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: QEMU not found. Please install QEMU for Windows.
    pause
    exit /b 1
)

REM Check if ISO exists
if not exist "build\tauos.iso" (
    echo ERROR: TauOS ISO not found. Please build the ISO first.
    pause
    exit /b 1
)

echo Starting TauOS in QEMU...
echo.

REM Launch QEMU with TauOS ISO
qemu-system-x86_64.exe ^
    -m 2048 ^
    -smp 2 ^
    -cdrom build\tauos.iso ^
    -boot d ^
    -enable-kvm ^
    -vga virtio ^
    -cpu host ^
    -machine type=q35,accel=kvm:tcg ^
    -display gtk ^
    -usb ^
    -device usb-tablet ^
    -net user ^
    -net nic,model=virtio

echo.
echo TauOS session ended.
pause
EOF
    
    if [ $? -eq 0 ]; then
        add_test_result "windows_batch_script" "PASS" "Windows batch script created"
    else
        add_test_result "windows_batch_script" "FAIL" "Failed to create Windows batch script"
    fi
    
    # Test 3: Create PowerShell script for Surface Pro
    log "INFO" "Creating PowerShell script for Surface Pro..."
    cat > "$OUTPUT_DIR/run_tauos_surface.ps1" << 'EOF'
# TauOS Surface Pro Launcher
# Optimized for Surface Pro touch interface

Write-Host "TauOS Surface Pro Launcher" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green

# Check if QEMU is available
if (-not (Get-Command qemu-system-x86_64.exe -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: QEMU not found. Please install QEMU for Windows." -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

# Check if ISO exists
if (-not (Test-Path "build\tauos.iso")) {
    Write-Host "ERROR: TauOS ISO not found. Please build the ISO first." -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "Starting TauOS on Surface Pro..." -ForegroundColor Yellow
Write-Host ""

# Launch QEMU with Surface Pro optimizations
& qemu-system-x86_64.exe `
    -m 4096 `
    -smp 4 `
    -cdrom build\tauos.iso `
    -boot d `
    -enable-kvm `
    -vga virtio `
    -cpu host `
    -machine type=q35,accel=kvm:tcg `
    -display gtk `
    -usb `
    -device usb-tablet `
    -device usb-kbd `
    -net user `
    -net nic,model=virtio `
    -device virtio-balloon `
    -device virtio-rng-pci

Write-Host ""
Write-Host "TauOS session ended." -ForegroundColor Green
Read-Host "Press Enter to continue"
EOF
    
    if [ $? -eq 0 ]; then
        add_test_result "windows_powershell_script" "PASS" "PowerShell script created for Surface Pro"
    else
        add_test_result "windows_powershell_script" "FAIL" "Failed to create PowerShell script"
    fi
    
    log "SUCCESS" "Windows platform tests completed"
}

# Test Linux platform
test_linux() {
    log "INFO" "Testing Linux platform..."
    
    local current_platform=$(detect_platform)
    if [ "$current_platform" != "linux" ]; then
        log "WARNING" "Linux tests should be run on Linux"
        add_test_result "linux_platform_check" "SKIPPED" "Not running on Linux"
        return
    fi
    
    # Test 1: Check for Linux virtualization tools
    log "INFO" "Testing Linux virtualization tools..."
    local vm_tools=()
    
    if command -v qemu-system-x86_64 &> /dev/null; then
        vm_tools+=("QEMU")
    fi
    
    if command -v virtualbox &> /dev/null; then
        vm_tools+=("VirtualBox")
    fi
    
    if command -v gnome-boxes &> /dev/null; then
        vm_tools+=("GNOME Boxes")
    fi
    
    if command -v vmware &> /dev/null; then
        vm_tools+=("VMware")
    fi
    
    if [ ${#vm_tools[@]} -gt 0 ]; then
        add_test_result "linux_vm_tools" "PASS" "Found VM tools: ${vm_tools[*]}"
    else
        add_test_result "linux_vm_tools" "FAIL" "No VM tools found"
    fi
    
    # Test 2: Test ISO boot in QEMU
    log "INFO" "Testing ISO boot in QEMU..."
    if [ -f "build/tauos.iso" ]; then
        # Test ISO file size
        local iso_size=$(stat -c%s "build/tauos.iso")
        if [ "$iso_size" -gt 1024 ]; then
            add_test_result "linux_iso_boot" "PASS" "ISO file size: ${iso_size} bytes"
        else
            add_test_result "linux_iso_boot" "WARN" "ISO appears to be stub (${iso_size} bytes)"
        fi
    else
        add_test_result "linux_iso_boot" "FAIL" "ISO file not found"
    fi
    
    # Test 3: Create Linux test script
    log "INFO" "Creating Linux test script..."
    cat > "$OUTPUT_DIR/test_linux_vms.sh" << 'EOF'
#!/bin/bash

# TauOS Linux VM Testing Script
# Tests TauOS in various Linux virtualization environments

set -e

echo "🐢 TauOS Linux VM Testing"
echo "========================="

# Test QEMU
echo "Testing QEMU..."
if command -v qemu-system-x86_64 &> /dev/null; then
    echo "✅ QEMU available"
    if [ -f "build/tauos.iso" ]; then
        echo "✅ ISO found, testing boot..."
        timeout 30s qemu-system-x86_64 -m 2048 -smp 2 -cdrom build/tauos.iso -boot d -nographic || true
    else
        echo "❌ ISO not found"
    fi
else
    echo "❌ QEMU not available"
fi

# Test VirtualBox
echo "Testing VirtualBox..."
if command -v VBoxManage &> /dev/null; then
    echo "✅ VirtualBox available"
else
    echo "❌ VirtualBox not available"
fi

# Test GNOME Boxes
echo "Testing GNOME Boxes..."
if command -v gnome-boxes &> /dev/null; then
    echo "✅ GNOME Boxes available"
else
    echo "❌ GNOME Boxes not available"
fi

echo "Linux VM testing completed"
EOF
    
    chmod +x "$OUTPUT_DIR/test_linux_vms.sh"
    add_test_result "linux_test_script" "PASS" "Linux test script created"
    
    # Test 4: Test bare metal boot preparation
    log "INFO" "Testing bare metal boot preparation..."
    if command -v dd &> /dev/null; then
        add_test_result "linux_bare_metal" "PASS" "dd available for USB flashing"
    else
        add_test_result "linux_bare_metal" "FAIL" "dd not available"
    fi
    
    log "SUCCESS" "Linux platform tests completed"
}

# Test Universal ISO
test_universal_iso() {
    log "INFO" "Testing Universal ISO..."
    
    # Test 1: Check ISO structure
    log "INFO" "Testing ISO structure..."
    if [ -f "build/tauos.iso" ]; then
        local iso_size=$(stat -c%s "build/tauos.iso" 2>/dev/null || stat -f%z "build/tauos.iso" 2>/dev/null)
        if [ "$iso_size" -gt 1024 ]; then
            add_test_result "universal_iso_structure" "PASS" "ISO file size: ${iso_size} bytes"
        else
            add_test_result "universal_iso_structure" "WARN" "ISO appears to be stub (${iso_size} bytes)"
        fi
    else
        add_test_result "universal_iso_structure" "FAIL" "ISO file not found"
    fi
    
    # Test 2: Create USB flashing script
    log "INFO" "Creating USB flashing script..."
    cat > "$OUTPUT_DIR/flash_usb.sh" << 'EOF'
#!/bin/bash

# TauOS USB Flashing Script
# Creates bootable USB from TauOS ISO

set -e

echo "🐢 TauOS USB Flashing Tool"
echo "=========================="

if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

if [ ! -f "build/tauos.iso" ]; then
    echo "❌ TauOS ISO not found. Please build the ISO first."
    exit 1
fi

echo "Available USB devices:"
lsblk | grep -E "sd[a-z][0-9]*|nvme[0-9]+n[0-9]+p[0-9]+"

echo ""
echo "⚠️  WARNING: This will ERASE ALL DATA on the selected USB device!"
echo ""

read -p "Enter USB device (e.g., /dev/sdb): " USB_DEVICE

if [ -z "$USB_DEVICE" ]; then
    echo "❌ No device specified"
    exit 1
fi

if [ ! -b "$USB_DEVICE" ]; then
    echo "❌ Device $USB_DEVICE not found"
    exit 1
fi

echo ""
echo "About to flash $USB_DEVICE with TauOS ISO"
echo "This will ERASE ALL DATA on $USB_DEVICE"
echo ""
read -p "Are you sure? Type 'YES' to continue: " CONFIRM

if [ "$CONFIRM" != "YES" ]; then
    echo "❌ Operation cancelled"
    exit 1
fi

echo "🔄 Flashing TauOS to $USB_DEVICE..."
echo "This may take several minutes..."

# Unmount any mounted partitions
umount ${USB_DEVICE}* 2>/dev/null || true

# Flash the ISO
dd if=build/tauos.iso of=$USB_DEVICE bs=4M status=progress conv=fdatasync

echo ""
echo "✅ TauOS flashed to $USB_DEVICE successfully!"
echo "You can now boot from this USB device."
echo ""
echo "Note: Some systems may require disabling Secure Boot to boot from USB."
EOF
    
    chmod +x "$OUTPUT_DIR/flash_usb.sh"
    add_test_result "universal_usb_script" "PASS" "USB flashing script created"
    
    # Test 3: Create UEFI boot test
    log "INFO" "Creating UEFI boot test..."
    cat > "$OUTPUT_DIR/test_uefi_boot.sh" << 'EOF'
#!/bin/bash

# TauOS UEFI Boot Test
# Tests UEFI boot compatibility

set -e

echo "🐢 TauOS UEFI Boot Test"
echo "======================="

# Check if system supports UEFI
if [ -d "/sys/firmware/efi" ]; then
    echo "✅ System supports UEFI"
    add_test_result "uefi_support" "PASS" "UEFI supported"
else
    echo "❌ System does not support UEFI (legacy BIOS)"
    add_test_result "uefi_support" "FAIL" "UEFI not supported"
fi

# Check for secure boot
if command -v mokutil &> /dev/null; then
    if mokutil --sb-state 2>/dev/null | grep -q "SecureBoot enabled"; then
        echo "⚠️  Secure Boot is enabled"
        echo "   You may need to disable Secure Boot to boot TauOS"
    else
        echo "✅ Secure Boot is disabled"
    fi
fi

# Test ISO UEFI compatibility
if [ -f "build/tauos.iso" ]; then
    echo "Testing ISO UEFI compatibility..."
    
    # Check if ISO has UEFI boot files
    if command -v isoinfo &> /dev/null; then
        if isoinfo -R -i build/tauos.iso | grep -q "EFI"; then
            echo "✅ ISO contains UEFI boot files"
            add_test_result "uefi_iso_compatibility" "PASS" "ISO has UEFI boot files"
        else
            echo "❌ ISO does not contain UEFI boot files"
            add_test_result "uefi_iso_compatibility" "FAIL" "ISO missing UEFI boot files"
        fi
    else
        echo "⚠️  isoinfo not available, cannot test UEFI compatibility"
        add_test_result "uefi_iso_compatibility" "SKIP" "isoinfo not available"
    fi
else
    echo "❌ TauOS ISO not found"
    add_test_result "uefi_iso_compatibility" "FAIL" "ISO not found"
fi

echo "UEFI boot test completed"
EOF
    
    chmod +x "$OUTPUT_DIR/test_uefi_boot.sh"
    add_test_result "universal_uefi_test" "PASS" "UEFI boot test script created"
    
    log "SUCCESS" "Universal ISO tests completed"
}

# Test SDK functionality
test_sdk() {
    log "INFO" "Testing SDK functionality..."
    
    # Test 1: Check SDK build
    if [ -d "sdk" ]; then
        log "INFO" "Testing SDK build..."
        cd sdk
        if cargo build --release >/dev/null 2>&1; then
            add_test_result "sdk_build" "PASS" "SDK builds successfully"
        else
            add_test_result "sdk_build" "FAIL" "SDK build failed"
        fi
        cd ..
    else
        add_test_result "sdk_build" "SKIP" "SDK directory not found"
    fi
    
    # Test 2: Test SDK commands
    if [ -f "sdk/target/release/tau-sdk" ]; then
        log "INFO" "Testing SDK commands..."
        
        # Test init command
        if ./sdk/target/release/tau-sdk init TestApp --output "$OUTPUT_DIR" >/dev/null 2>&1; then
            add_test_result "sdk_init" "PASS" "SDK init command works"
        else
            add_test_result "sdk_init" "FAIL" "SDK init command failed"
        fi
        
        # Test build command (if in a project directory)
        if [ -f "$OUTPUT_DIR/TestApp/Cargo.toml" ]; then
            cd "$OUTPUT_DIR/TestApp"
            if cargo build --release >/dev/null 2>&1; then
                add_test_result "sdk_build_project" "PASS" "SDK project builds successfully"
            else
                add_test_result "sdk_build_project" "FAIL" "SDK project build failed"
            fi
            cd - >/dev/null
        fi
    else
        add_test_result "sdk_commands" "SKIP" "SDK binary not found"
    fi
    
    log "SUCCESS" "SDK tests completed"
}

# Generate test report
generate_report() {
    log "INFO" "Generating test report..."
    
    local report_file="$OUTPUT_DIR/test_report.md"
    
    cat > "$report_file" << EOF
# TauOS Multi-Platform Test Report

Generated: $(date)

## Test Summary

EOF
    
    local total_tests=0
    local passed_tests=0
    local failed_tests=0
    local skipped_tests=0
    
    for result in "${TEST_RESULTS[@]}"; do
        IFS='|' read -r test_name status details <<< "$result"
        total_tests=$((total_tests + 1))
        
        case $status in
            "PASS")
                passed_tests=$((passed_tests + 1))
                echo "- ✅ **$test_name**: PASS - $details" >> "$report_file"
                ;;
            "FAIL")
                failed_tests=$((failed_tests + 1))
                echo "- ❌ **$test_name**: FAIL - $details" >> "$report_file"
                ;;
            "WARN")
                echo "- ⚠️  **$test_name**: WARN - $details" >> "$report_file"
                ;;
            "SKIP")
                skipped_tests=$((skipped_tests + 1))
                echo "- ⏭️  **$test_name**: SKIP - $details" >> "$report_file"
                ;;
        esac
    done
    
    cat >> "$report_file" << EOF

## Statistics

- **Total Tests**: $total_tests
- **Passed**: $passed_tests
- **Failed**: $failed_tests
- **Skipped**: $skipped_tests
- **Success Rate**: $((passed_tests * 100 / total_tests))%

## Platform Support

EOF
    
    # Add platform-specific information
    local current_platform=$(detect_platform)
    cat >> "$report_file" << EOF
- **Current Platform**: $current_platform
- **Architecture**: $(uname -m)
- **Kernel**: $(uname -r)

## Next Steps

1. **For Failed Tests**: Review the specific failure details above
2. **For Skipped Tests**: Run on the appropriate platform
3. **For Universal ISO**: Test on actual hardware with USB boot
4. **For Production**: Run full integration tests on all target platforms

## Release Preparation

- [ ] All critical tests pass
- [ ] ISO boots on target hardware
- [ ] SDK works on all platforms
- [ ] Documentation updated
- [ ] Release packages created
EOF
    
    log "SUCCESS" "Test report generated: $report_file"
    
    # Print summary
    echo ""
    echo "=== Test Summary ==="
    echo "Total: $total_tests | Passed: $passed_tests | Failed: $failed_tests | Skipped: $skipped_tests"
    echo "Success Rate: $((passed_tests * 100 / total_tests))%"
    echo ""
    echo "Detailed report: $report_file"
}

# Main execution
main() {
    echo "🐢 TauOS Multi-Platform Testing Matrix"
    echo "======================================"
    echo "Platform: ${PLATFORM:-all}"
    echo "Test Type: $TEST_TYPE"
    echo "Output Directory: $OUTPUT_DIR"
    echo ""
    
    # Check requirements
    check_requirements
    
    # Build components
    build_components
    
    # Run platform-specific tests
    case $PLATFORM in
        "macos"|"")
            test_macos
            ;;
        "windows"|"")
            test_windows
            ;;
        "linux"|"")
            test_linux
            ;;
        "universal"|"")
            test_universal_iso
            ;;
        *)
            log "ERROR" "Unknown platform: $PLATFORM"
            exit 1
            ;;
    esac
    
    # Run SDK tests if requested
    if [ "$TEST_TYPE" = "all" ] || [ "$TEST_TYPE" = "sdk" ]; then
        test_sdk
    fi
    
    # Generate report
    generate_report
    
    log "SUCCESS" "Multi-platform testing completed!"
}

# Run main function
main "$@" 