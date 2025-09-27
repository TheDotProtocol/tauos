#!/bin/bash

# TauOS Demo Build Script
# Creates mock binaries and packages for demonstration purposes

set -e

echo "🐢 TauOS Demo Build"
echo "==================="
echo "Building mock components for demonstration..."
echo ""

# Create build directory
mkdir -p build/bin
mkdir -p build/gui
mkdir -p build/config
mkdir -p build/logs

# Create mock binaries
echo "📦 Creating mock binaries..."

# Mock tau-upd
cat > build/bin/tau-upd << 'EOF'
#!/bin/bash
echo "🐢 TauOS Update Manager"
echo "======================="
echo "Mock binary for demonstration"
echo "Theme: Black & Gold"
echo "Shimmer animations: Enabled"
echo "Splash screen: Enabled"
echo ""
echo "This is a mock binary for the TauOS demo."
echo "In a real build, this would be the actual update manager."
sleep 2
EOF

# Mock taustore
cat > build/bin/taustore << 'EOF'
#!/bin/bash
echo "🛍️  TauStore"
echo "============="
echo "Mock binary for demonstration"
echo "Theme: Black & Gold"
echo "Shimmer animations: Enabled"
echo ""
echo "This is a mock binary for the TauOS demo."
echo "In a real build, this would be the actual app store."
sleep 2
EOF

# Mock sandboxd
cat > build/bin/sandboxd << 'EOF'
#!/bin/bash
echo "🔒 TauOS Sandbox Manager"
echo "========================"
echo "Mock binary for demonstration"
echo "Theme: Black & Gold"
echo "Shimmer animations: Enabled"
echo ""
echo "This is a mock binary for the TauOS demo."
echo "In a real build, this would be the actual sandbox manager."
sleep 2
EOF

# Make binaries executable
chmod +x build/bin/*

# Copy GUI components
echo "🎨 Copying GUI components..."
cp gui/taukit/theme.css build/gui/
cp gui/splash/splash.css build/gui/

# Create theme configuration
echo "⚙️  Creating theme configuration..."
cat > build/config/theme.json << EOF
{
  "theme": "black-gold",
  "accent_color": "#FFD700",
  "background_color": "#0a0a0a",
  "text_color": "#F5F5F5",
  "animations_enabled": true,
  "high_contrast": false,
  "custom_css": null
}
EOF

# Create metadata
echo "📋 Creating metadata..."
cat > build/metadata.json << EOF
{
  "name": "TauOS",
  "version": "1.0.0",
  "theme": "black-gold",
  "splash_enabled": true,
  "shimmer_enabled": true,
  "target": "x86_64",
  "build_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "build_type": "demo",
  "features": [
    "Enhanced Shimmer Animations",
    "Black & Gold Theme",
    "Splash Screen",
    "Mock Components",
    "Demo Build"
  ]
}
EOF

# Create demo log
echo "📝 Creating demo log..."
cat > build/logs/demo_output.log << EOF
TauOS Demo Build Log
====================
Build Date: $(date)
Build Type: Demo
Theme: Black & Gold
Shimmer: Enabled
Splash: Enabled

Components Built:
✅ Mock tau-upd (Update Manager)
✅ Mock taustore (App Store)
✅ Mock sandboxd (Sandbox Manager)
✅ GUI theme files
✅ Theme configuration
✅ Metadata

Demo Features:
- Enhanced shimmer animations
- Black & Gold theme system
- Splash screen with turtle shell
- Mock component binaries
- Theme configuration loading
- Metadata generation

This is a demonstration build showing the TauOS visual stack
and component architecture without requiring system dependencies.
EOF

echo ""
echo "✅ TauOS demo build completed successfully!"
echo "📁 Output: build/"
echo "📋 Metadata: build/metadata.json"
echo "📝 Log: build/logs/demo_output.log"
echo ""
echo "🚀 To test the mock components:"
echo "   ./build/bin/tau-upd"
echo "   ./build/bin/taustore"
echo "   ./build/bin/sandboxd"
echo ""
echo "✨ TauOS demo is ready to shimmer!" 