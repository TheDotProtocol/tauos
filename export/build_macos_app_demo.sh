#!/bin/bash

# TauOS macOS App Package Builder (Demo Version)
# Creates a native macOS .app package that runs TauOS

set -e

# Default values
THEME="black-gold"
OUTPUT_PATH="$HOME/Desktop/TauOS.app"
ENABLE_SPLASH=true
ENABLE_SHIMMER=true
BUILD_TYPE="demo"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --theme)
            THEME="$2"
            shift 2
            ;;
        --output)
            OUTPUT_PATH="$2"
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
        --debug)
            BUILD_TYPE="debug"
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --theme THEME        Theme to use (default: black-gold)"
            echo "  --output PATH        Output path (default: ~/Desktop/TauOS.app)"
            echo "  --splash             Enable splash screen (default)"
            echo "  --no-splash          Disable splash screen"
            echo "  --shimmer            Enable shimmer animations (default)"
            echo "  --no-shimmer         Disable shimmer animations"
            echo "  --debug              Build in debug mode"
            echo "  --help               Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "🐢 TauOS macOS App Package Builder (Demo)"
echo "=========================================="
echo "Theme: $THEME"
echo "Output: $OUTPUT_PATH"
echo "Splash: $ENABLE_SPLASH"
echo "Shimmer: $ENABLE_SHIMMER"
echo "Build Type: $BUILD_TYPE"
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: This script must be run on macOS"
    exit 1
fi

# Use demo build components
echo "🧹 Using demo build components..."
if [ ! -d "build/bin" ]; then
    echo "❌ Demo build not found. Running demo build first..."
    ./scripts/build_demo.sh
fi

# Create app bundle structure
echo "📦 Creating app bundle structure..."
APP_DIR="$OUTPUT_PATH"
CONTENTS_DIR="$APP_DIR/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"

# Remove existing app if it exists
if [ -d "$APP_DIR" ]; then
    rm -rf "$APP_DIR"
fi

# Create directory structure
mkdir -p "$MACOS_DIR"
mkdir -p "$RESOURCES_DIR"

# Copy demo binaries
echo "📦 Copying demo binaries..."
cp build/bin/tau-upd "$MACOS_DIR/"
cp build/bin/taustore "$MACOS_DIR/"
cp build/bin/sandboxd "$MACOS_DIR/"

# Copy GUI components
echo "🎨 Copying GUI components..."
mkdir -p "$RESOURCES_DIR/gui"
cp -r build/gui/theme.css "$RESOURCES_DIR/gui/"
cp -r build/gui/splash.css "$RESOURCES_DIR/gui/"

# Copy theme configuration
echo "⚙️  Configuring theme..."
mkdir -p "$RESOURCES_DIR/config"
cat > "$RESOURCES_DIR/config/theme.json" << EOF
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

# Create Info.plist
echo "📋 Creating Info.plist..."
cat > "$CONTENTS_DIR/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>tau-upd</string>
    <key>CFBundleIdentifier</key>
    <string>org.tauos.desktop</string>
    <key>CFBundleName</key>
    <string>TauOS</string>
    <key>CFBundleDisplayName</key>
    <string>TauOS</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.utilities</string>
    <key>CFBundleDocumentTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeName</key>
            <string>TauOS Document</string>
            <key>CFBundleTypeExtensions</key>
            <array>
                <string>tau</string>
            </array>
            <key>CFBundleTypeRole</key>
            <string>Viewer</string>
        </dict>
    </array>
</dict>
</plist>
EOF

# Create main launcher script
echo "🚀 Creating launcher script..."
cat > "$MACOS_DIR/TauOS" << 'EOF'
#!/bin/bash

# TauOS macOS Launcher (Demo)
# This script launches TauOS on macOS

set -e

# Get the app bundle directory
APP_BUNDLE="$(cd "$(dirname "$0")/.." && pwd)"
RESOURCES_DIR="$APP_BUNDLE/Contents/Resources"
MACOS_DIR="$APP_BUNDLE/Contents/MacOS"

# Set up environment
export TAUOS_APP_BUNDLE="$APP_BUNDLE"
export TAUOS_RESOURCES="$RESOURCES_DIR"
export TAUOS_BINARIES="$MACOS_DIR"

# Create log directory
mkdir -p "$HOME/Library/Logs/TauOS"

# Start TauOS
echo "🐢 Starting TauOS on macOS (Demo)..."
echo "App Bundle: $APP_BUNDLE"
echo "Resources: $RESOURCES_DIR"
echo "Binaries: $MACOS_DIR"
echo ""

# Display demo information
echo "=========================================="
echo "🐢 TauOS macOS Demo"
echo "=========================================="
echo "Theme: Black & Gold"
echo "Shimmer animations: Enabled"
echo "Splash screen: Enabled"
echo "Build type: Demo"
echo ""

# Show available components
echo "Available components:"
ls -la "$MACOS_DIR" | grep -v "TauOS$"
echo ""

# Show theme configuration
if [ -f "$RESOURCES_DIR/config/theme.json" ]; then
    echo "Theme configuration:"
    cat "$RESOURCES_DIR/config/theme.json"
    echo ""
fi

# Simulate component startup
echo "Starting TauOS components..."
echo "✅ tau-upd (Update Manager)"
echo "✅ taustore (App Store)"
echo "✅ sandboxd (Sandbox Manager)"
echo ""

echo "🐢 TauOS demo started successfully!"
echo "This is a demonstration of the TauOS visual stack."
echo "In a real build, this would launch the actual GUI applications."
echo ""

# Keep the app running for a moment
sleep 3
EOF

chmod +x "$MACOS_DIR/TauOS"

# Create PkgInfo
echo "📦 Creating PkgInfo..."
echo "APPL????" > "$CONTENTS_DIR/PkgInfo"

# Create app icon (placeholder)
echo "🎨 Creating app icon..."
mkdir -p "$RESOURCES_DIR/icons"
cat > "$RESOURCES_DIR/icons/tauos.icns" << 'EOF'
# This is a placeholder for the TauOS app icon
# In a real build, this would be a proper .icns file
EOF

# Create metadata
echo "📋 Creating metadata..."
cat > "$RESOURCES_DIR/metadata.json" << EOF
{
  "name": "TauOS",
  "version": "1.0.0",
  "theme": "$THEME",
  "splash_enabled": $ENABLE_SPLASH,
  "shimmer_enabled": $ENABLE_SHIMMER,
  "build_type": "$BUILD_TYPE",
  "build_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "platform": "macOS",
  "features": [
    "Enhanced Shimmer Animations",
    "Black & Gold Theme",
    "Splash Screen",
    "Native macOS App",
    "Self-Contained Package",
    "Demo Build"
  ]
}
EOF

# Create README
echo "📖 Creating README..."
cat > "$RESOURCES_DIR/README.txt" << 'EOF'
TauOS macOS App Package (Demo)
==============================

This is a native macOS application package for TauOS (Demo Version).

Features:
- Enhanced shimmer animations
- Black & Gold theme
- Splash screen with turtle shell
- Self-contained package
- No macOS modification required
- Demo build for testing

To run:
1. Double-click TauOS.app
2. Or run from Terminal: open /path/to/TauOS.app

System Requirements:
- macOS 10.15 (Catalina) or later
- 2GB RAM minimum
- 500MB free disk space

Logs are stored in: ~/Library/Logs/TauOS/

This is a demonstration build showing the TauOS visual stack
and component architecture without requiring system dependencies.

For support, visit: https://tauos.org
EOF

# Set permissions
echo "🔐 Setting permissions..."
chmod +x "$MACOS_DIR"/*
chmod -R 755 "$APP_DIR"

# Create desktop integration
echo "🖥️  Creating desktop integration..."
cat > "$RESOURCES_DIR/install.sh" << 'EOF'
#!/bin/bash

# TauOS macOS Desktop Integration (Demo)
# Installs TauOS to Applications folder

set -e

APP_NAME="TauOS.app"
SOURCE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="/Applications/$APP_NAME"

echo "🐢 Installing TauOS to Applications (Demo)..."

# Check if already installed
if [ -d "$TARGET_DIR" ]; then
    echo "Removing existing installation..."
    rm -rf "$TARGET_DIR"
fi

# Copy to Applications
echo "Installing to Applications..."
cp -R "$SOURCE_DIR" "$TARGET_DIR"

# Set permissions
chmod -R 755 "$TARGET_DIR"

echo "✅ TauOS demo installed successfully!"
echo "You can now launch TauOS from Applications or Spotlight"
echo "This is a demonstration build for testing purposes."
EOF

chmod +x "$RESOURCES_DIR/install.sh"

echo ""
echo "✅ TauOS macOS app package created successfully!"
echo "📁 Output: $OUTPUT_PATH"
echo "📋 Metadata: $OUTPUT_PATH/Contents/Resources/metadata.json"
echo ""
echo "🚀 To run:"
echo "   open $OUTPUT_PATH"
echo ""
echo "📦 To install to Applications:"
echo "   $OUTPUT_PATH/Contents/Resources/install.sh"
echo ""
echo "✨ TauOS demo is ready to shimmer on macOS!" 