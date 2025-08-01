#!/bin/bash

# TauOS QEMU Runner Script
# Runs TauOS in QEMU virtual machine for testing

set -e

# Default values
ISO_PATH="build/tauos.iso"
MEMORY="2048"
FULLSCREEN=false
ENABLE_GPU=false
ENABLE_KVM=true
ENABLE_AUDIO=false
ENABLE_NETWORK=true
CORES="2"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --iso)
            ISO_PATH="$2"
            shift 2
            ;;
        --memory)
            MEMORY="$2"
            shift 2
            ;;
        --fullscreen)
            FULLSCREEN=true
            shift
            ;;
        --enable-gpu)
            ENABLE_GPU=true
            shift
            ;;
        --disable-kvm)
            ENABLE_KVM=false
            shift
            ;;
        --enable-audio)
            ENABLE_AUDIO=true
            shift
            ;;
        --disable-network)
            ENABLE_NETWORK=false
            shift
            ;;
        --cores)
            CORES="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --iso PATH           ISO file path (default: build/tauos.iso)"
            echo "  --memory MB          Memory in MB (default: 2048)"
            echo "  --fullscreen         Run in fullscreen mode"
            echo "  --enable-gpu         Enable GPU acceleration"
            echo "  --disable-kvm        Disable KVM acceleration"
            echo "  --enable-audio       Enable audio"
            echo "  --disable-network    Disable network"
            echo "  --cores N            Number of CPU cores (default: 2)"
            echo "  --help               Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if ISO exists
if [ ! -f "$ISO_PATH" ]; then
    echo "❌ Error: ISO file not found: $ISO_PATH"
    echo "Please build the ISO first using: ./package_qemu_image.sh"
    exit 1
fi

echo "🐢 TauOS QEMU Runner"
echo "===================="
echo "ISO: $ISO_PATH"
echo "Memory: ${MEMORY}MB"
echo "Fullscreen: $FULLSCREEN"
echo "GPU: $ENABLE_GPU"
echo "KVM: $ENABLE_KVM"
echo "Audio: $ENABLE_AUDIO"
echo "Network: $ENABLE_NETWORK"
echo "Cores: $CORES"
echo ""

# Build QEMU command
QEMU_CMD="qemu-system-x86_64"

# Basic options
QEMU_ARGS=(
    "-m" "$MEMORY"
    "-smp" "$CORES"
    "-cdrom" "$ISO_PATH"
    "-boot" "d"
)

# KVM acceleration
if [ "$ENABLE_KVM" = true ]; then
    if command -v kvm >/dev/null 2>&1; then
        QEMU_ARGS+=("-enable-kvm")
        echo "✅ KVM acceleration enabled"
    else
        echo "⚠️  KVM not available, using software emulation"
    fi
fi

# GPU acceleration
if [ "$ENABLE_GPU" = true ]; then
    QEMU_ARGS+=("-vga" "virtio")
    echo "✅ GPU acceleration enabled"
else
    QEMU_ARGS+=("-vga" "std")
fi

# Fullscreen mode
if [ "$FULLSCREEN" = true ]; then
    QEMU_ARGS+=("-full-screen")
    echo "✅ Fullscreen mode enabled"
fi

# Audio
if [ "$ENABLE_AUDIO" = true ]; then
    QEMU_ARGS+=("-soundhw" "all")
    echo "✅ Audio enabled"
fi

# Network
if [ "$ENABLE_NETWORK" = true ]; then
    QEMU_ARGS+=("-net" "user")
    QEMU_ARGS+=("-net" "nic,model=virtio")
    echo "✅ Network enabled"
fi

# Additional performance options
QEMU_ARGS+=(
    "-cpu" "host"
    "-machine" "type=q35,accel=kvm:tcg"
    "-display" "gtk"
    "-usb"
    "-device" "usb-tablet"
)

# Create log directory
mkdir -p logs

# Start QEMU
echo ""
echo "🚀 Starting TauOS in QEMU..."
echo "Command: $QEMU_CMD ${QEMU_ARGS[*]}"
echo ""

# Run QEMU and capture output
"$QEMU_CMD" "${QEMU_ARGS[@]}" 2>&1 | tee logs/qemu_output.log

echo ""
echo "✅ QEMU session ended"
echo "📋 Log saved to: logs/qemu_output.log"
echo "" 