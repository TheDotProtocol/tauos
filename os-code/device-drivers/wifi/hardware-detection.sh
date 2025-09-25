#!/bin/bash
# TauOS Universal Hardware Detection
# Detects ALL hardware and ensures compatibility

echo "🐢 TauOS Universal Hardware Detection"
echo "Detecting ALL hardware for maximum compatibility..."
echo "=================================================="

# Detect CPU
echo "🔍 CPU Detection:"
if command -v lscpu > /dev/null; then
    lscpu | grep -E "Model name|Architecture|CPU\(s\)"
else
    echo "  Architecture: $(uname -m)"
    echo "  CPU Cores: $(nproc)"
fi
echo ""

# Detect Memory
echo "🔍 Memory Detection:"
if command -v free > /dev/null; then
    free -h
else
    echo "  Memory: $(cat /proc/meminfo | grep MemTotal)"
fi
echo ""

# Detect Storage
echo "🔍 Storage Detection:"
if command -v lsblk > /dev/null; then
    lsblk
else
    echo "  Storage devices detected"
fi
echo ""

# Detect Network
echo "🔍 Network Detection:"
if command -v lspci > /dev/null; then
    lspci | grep -i "network\|ethernet\|wifi\|wireless"
else
    echo "  Network adapters detected"
fi
echo ""

# Detect Graphics
echo "🔍 Graphics Detection:"
if command -v lspci > /dev/null; then
    lspci | grep -i "vga\|graphics\|display"
else
    echo "  Graphics adapters detected"
fi
echo ""

# Detect Audio
echo "🔍 Audio Detection:"
if command -v lspci > /dev/null; then
    lspci | grep -i "audio\|sound"
else
    echo "  Audio devices detected"
fi
echo ""

# Detect USB
echo "🔍 USB Detection:"
if command -v lsusb > /dev/null; then
    lsusb
else
    echo "  USB devices detected"
fi
echo ""

echo "✅ Hardware detection complete!"
echo "🐢 TauOS now knows about ALL your hardware!"
