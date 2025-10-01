#!/bin/bash
# TauCore™ Kernel QEMU Test
# Tests the integrated kernel in QEMU environment

echo "🐢 Testing TauCore™ Kernel in QEMU..."

# Check if QEMU is available
if ! command -v qemu-system-x86_64 &> /dev/null; then
    echo "⚠️  QEMU not found. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install qemu
    else
        echo "❌ Please install QEMU manually"
        exit 1
    fi
fi

# Create test ISO
echo "📦 Creating TauCore™ test ISO..."
mkdir -p test-iso/boot/grub
cp simple_iso_build/boot/boot/vmlinuz test-iso/boot/
cp simple_iso_build/boot/initrd.img test-iso/boot/ 2>/dev/null || echo "No initrd found, continuing..."

# Create GRUB config for test
cat > test-iso/boot/grub/grub.cfg << 'EOF'
set default=0
set timeout=3

menuentry "TauCore™ Test Kernel" {
    linux /boot/vmlinuz root=/dev/sda1 rw quiet splash
    initrd /boot/initrd.img
}
EOF

# Create ISO
echo "💿 Creating bootable ISO..."
if command -v grub-mkrescue &> /dev/null; then
    grub-mkrescue -o tauos-test.iso test-iso/
elif command -v xorriso &> /dev/null; then
    xorriso -as mkisofs -R -J -c boot/boot.catalog -b boot/grub/stage2_eltorito -no-emul-boot -boot-load-size 4 -boot-info-table -o tauos-test.iso test-iso/
else
    echo "⚠️  ISO creation tools not found, testing kernel directly..."
fi

# Test kernel in QEMU
echo "🚀 Starting QEMU test..."
echo "Press Ctrl+C to exit QEMU"
echo "================================================"

if [ -f "tauos-test.iso" ]; then
    qemu-system-x86_64 -cdrom tauos-test.iso -m 512M -boot d
else
    # Direct kernel test
    qemu-system-x86_64 -kernel simple_iso_build/boot/boot/vmlinuz -m 512M -nographic
fi

echo "✅ TauCore™ Kernel test completed!"
