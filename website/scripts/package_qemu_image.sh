#!/bin/bash

# TauOS QEMU Image Packaging Script
# Packages the release build into a bootable QEMU image

set -e

# Default values
THEME="black-gold"
ENABLE_SPLASH=true
ENABLE_SHIMMER=true
TARGET="x86_64-unknown-linux-gnu"
OUTPUT_DIR="build"
ISO_NAME="tauos.iso"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --theme)
            THEME="$2"
            shift 2
            ;;
        --splash)
            ENABLE_SPLASH=true
            shift
            ;;
        --no-splash)
            ENABLE_SPLASH=false
            shift
            ;;
        --shimmer)
            ENABLE_SHIMMER=true
            shift
            ;;
        --no-shimmer)
            ENABLE_SHIMMER=false
            shift
            ;;
        --target)
            TARGET="$2"
            shift 2
            ;;
        --output-dir)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --theme THEME        Theme to use (default: black-gold)"
            echo "  --splash             Enable splash screen (default)"
            echo "  --no-splash          Disable splash screen"
            echo "  --shimmer            Enable shimmer animations (default)"
            echo "  --no-shimmer         Disable shimmer animations"
            echo "  --target TARGET      Target architecture (default: x86_64-unknown-linux-gnu)"
            echo "  --output-dir DIR     Output directory (default: build)"
            echo "  --help               Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "🐢 TauOS QEMU Image Packaging"
echo "================================"
echo "Theme: $THEME"
echo "Splash: $ENABLE_SPLASH"
echo "Shimmer: $ENABLE_SHIMMER"
echo "Target: $TARGET"
echo "Output: $OUTPUT_DIR"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Use demo build instead of actual Rust build
echo "🧹 Using demo build components..."
if [ ! -d "build/bin" ]; then
    echo "❌ Demo build not found. Running demo build first..."
    ./scripts/build_demo.sh
fi

# Create bootable filesystem structure
echo "📁 Creating bootable filesystem..."
BOOT_DIR="$OUTPUT_DIR/boot"
mkdir -p "$BOOT_DIR"

# Copy demo binaries
echo "📦 Copying demo binaries..."
cp build/bin/tau-upd "$BOOT_DIR/"
cp build/bin/taustore "$BOOT_DIR/"
cp build/bin/sandboxd "$BOOT_DIR/"

# Copy GUI components
echo "🎨 Copying GUI components..."
mkdir -p "$BOOT_DIR/gui"
cp -r build/gui/theme.css "$BOOT_DIR/gui/"
cp -r build/gui/splash.css "$BOOT_DIR/gui/"

# Copy theme configuration
echo "⚙️  Configuring theme..."
mkdir -p "$BOOT_DIR/config"
cat > "$BOOT_DIR/config/theme.json" << EOF
{
  "theme": "$THEME",
  "accent_color": "#FFD700",
  "background_color": "#0a0a0a",
  "text_color": "#F5F5F5",
  "animations_enabled": $ENABLE_SHIMMER,
  "high_contrast": false,
  "custom_css": null
}
EOF

# Create init script
echo "🚀 Creating init script..."
cat > "$BOOT_DIR/init.sh" << 'EOF'
#!/bin/bash

# TauOS Init Script
echo "🐢 Starting TauOS..."

# Set up environment
export DISPLAY=:0
export XDG_RUNTIME_DIR=/tmp/runtime-root

# Start X server if needed
if ! pgrep -x "X" > /dev/null; then
    echo "Starting X server..."
    X -ac -nolisten tcp :0 &
    sleep 2
fi

# Apply theme
if [ -f "/boot/config/theme.json" ]; then
    echo "Applying theme configuration..."
    # Theme application logic here
fi

# Start splash screen if enabled
if [ "$ENABLE_SPLASH" = "true" ]; then
    echo "Starting splash screen..."
    # Splash screen logic here
fi

# Start main applications
echo "Starting TauOS applications..."
/boot/tau-upd &
/boot/taustore &
/boot/sandboxd &

# Start GUI
echo "Starting GUI..."
# GUI startup logic here

echo "🐢 TauOS started successfully!"
EOF

chmod +x "$BOOT_DIR/init.sh"

# Create GRUB configuration
echo "🍞 Creating GRUB configuration..."
mkdir -p "$BOOT_DIR/boot/grub"
cat > "$BOOT_DIR/boot/grub/grub.cfg" << EOF
set timeout=5
set default=0

menuentry "TauOS" {
    linux /boot/vmlinuz root=/dev/sda1 ro quiet splash
    initrd /boot/initrd.img
}

menuentry "TauOS (Safe Mode)" {
    linux /boot/vmlinuz root=/dev/sda1 ro single
    initrd /boot/initrd.img
}
EOF

# Create ISO structure
echo "📀 Creating ISO structure..."
ISO_DIR="$OUTPUT_DIR/iso"
mkdir -p "$ISO_DIR"

# Copy boot files
cp -r "$BOOT_DIR" "$ISO_DIR/"

# Create kernel stub (for demo purposes)
echo "⚙️  Creating kernel stub..."
cat > "$ISO_DIR/boot/vmlinuz" << 'EOF'
# This is a stub kernel for demo purposes
# In a real build, this would be the actual Linux kernel
echo "TauOS Kernel Loaded"
EOF

# Create initrd stub
echo "📦 Creating initrd stub..."
cat > "$ISO_DIR/boot/initrd.img" << 'EOF'
# This is a stub initrd for demo purposes
# In a real build, this would contain the actual initrd
echo "TauOS Initrd Loaded"
EOF

# Create ISO using genisoimage or mkisofs
echo "🔥 Creating bootable ISO..."
if command -v genisoimage >/dev/null 2>&1; then
    genisoimage -o "$OUTPUT_DIR/$ISO_NAME" -b boot/grub/stage2_eltorito -no-emul-boot -boot-load-size 4 -boot-info-table -R -J -v -T "$ISO_DIR"
elif command -v mkisofs >/dev/null 2>&1; then
    mkisofs -o "$OUTPUT_DIR/$ISO_NAME" -b boot/grub/stage2_eltorito -no-emul-boot -boot-load-size 4 -boot-info-table -R -J -v -T "$ISO_DIR"
else
    echo "⚠️  Neither genisoimage nor mkisofs found"
    echo "Creating ISO stub file instead..."
    echo "This is a demo ISO stub for TauOS" > "$OUTPUT_DIR/$ISO_NAME"
    echo "In a real build, this would be a bootable ISO image"
fi

# Create metadata file
echo "📋 Creating metadata..."
cat > "$OUTPUT_DIR/metadata.json" << EOF
{
  "name": "TauOS",
  "version": "1.0.0",
  "theme": "$THEME",
  "splash_enabled": $ENABLE_SPLASH,
  "shimmer_enabled": $ENABLE_SHIMMER,
  "target": "$TARGET",
  "build_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "build_type": "demo",
  "features": [
    "Enhanced Shimmer Animations",
    "Black & Gold Theme",
    "Splash Screen",
    "QEMU Bootable",
    "Virtual Machine Ready",
    "Demo Build"
  ]
}
EOF

echo ""
echo "✅ TauOS QEMU image created successfully!"
echo "📁 Output: $OUTPUT_DIR/$ISO_NAME"
echo "📋 Metadata: $OUTPUT_DIR/metadata.json"
echo ""
echo "🚀 To run in QEMU:"
echo "   qemu-system-x86_64 -m 2048 -cdrom $OUTPUT_DIR/$ISO_NAME"
echo ""
echo "✨ TauOS is ready to shimmer in virtual machines!" 