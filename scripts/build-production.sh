#!/bin/bash

# TauOS Production Build Script
# This script creates a complete production-ready TauOS ISO

set -e

echo "🚀 Building TauOS Production ISO..."

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
ISO_DIR="$BUILD_DIR/iso"
APPS_DIR="$ISO_DIR/apps"
SCRIPTS_DIR="$ISO_DIR/scripts"

# Create build directories
mkdir -p "$BUILD_DIR" "$ISO_DIR" "$APPS_DIR" "$SCRIPTS_DIR"

echo "📦 Building TauOS Core Applications..."

# Build Tau Home (Desktop Environment)
cd "$PROJECT_ROOT/gui/tauhome"
cargo build --release
cp target/release/tauhome "$APPS_DIR/"

# Build Tau Browser
cd "$PROJECT_ROOT/gui/tauhome"
cargo build --release --bin taubrowser
cp target/release/taubrowser "$APPS_DIR/"

# Build Tau Settings
cd "$PROJECT_ROOT/gui/settings"
cargo build --release
cp target/release/tausettings "$APPS_DIR/"

# Build Tau Media Player
cd "$PROJECT_ROOT/apps/taumedia"
cargo build --release
cp target/release/taumedia "$APPS_DIR/"

# Build Tau Store
cd "$PROJECT_ROOT/apps/taustore"
cargo build --release
cp target/release/taustore "$APPS_DIR/"

echo "🔧 Creating Installation Scripts..."

# Create one-click installer
cat > "$SCRIPTS_DIR/install.sh" << 'EOF'
#!/bin/bash

# TauOS One-Click Installer
# This script installs TauOS on any Linux system

set -e

echo "🚀 TauOS Installation Starting..."

# Detect system
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo "❌ Unsupported system"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v apt-get &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y gtk4 libgtk-4-dev libadwaita-1-dev gstreamer1.0-plugins-base gstreamer1.0-plugins-good
elif command -v dnf &> /dev/null; then
    sudo dnf install -y gtk4-devel libadwaita-devel gstreamer1-plugins-base gstreamer1-plugins-good
elif command -v pacman &> /dev/null; then
    sudo pacman -S --noconfirm gtk4 libadwaita gst-plugins-base gst-plugins-good
fi

# Copy applications
echo "📁 Installing TauOS applications..."
sudo mkdir -p /opt/tauos/apps
sudo cp apps/* /opt/tauos/apps/
sudo chmod +x /opt/tauos/apps/*

# Create desktop entries
echo "🖥️ Creating desktop shortcuts..."
mkdir -p ~/.local/share/applications

cat > ~/.local/share/applications/tauhome.desktop << 'DESKTOP'
[Desktop Entry]
Name=TauOS Home
Comment=TauOS Desktop Environment
Exec=/opt/tauos/apps/tauhome
Icon=tauos
Type=Application
Categories=System;
DESKTOP

cat > ~/.local/share/applications/taubrowser.desktop << 'DESKTOP'
[Desktop Entry]
Name=Tau Browser
Comment=Privacy-first web browser
Exec=/opt/tauos/apps/taubrowser
Icon=tauos-browser
Type=Application
Categories=Network;WebBrowser;
DESKTOP

cat > ~/.local/share/applications/tausettings.desktop << 'DESKTOP'
[Desktop Entry]
Name=TauOS Settings
Comment=System configuration
Exec=/opt/tauos/apps/tausettings
Icon=tauos-settings
Type=Application
Categories=Settings;
DESKTOP

cat > ~/.local/share/applications/taumedia.desktop << 'DESKTOP'
[Desktop Entry]
Name=Tau Media Player
Comment=Privacy-first media player
Exec=/opt/tauos/apps/taumedia
Icon=tauos-media
Type=Application
Categories=AudioVideo;Player;
DESKTOP

cat > ~/.local/share/applications/taustore.desktop << 'DESKTOP'
[Desktop Entry]
Name=Tau Store
Comment=Application marketplace
Exec=/opt/tauos/apps/taustore
Icon=tauos-store
Type=Application
Categories=System;
DESKTOP

echo "✅ TauOS installation complete!"
echo "🎉 You can now launch TauOS applications from your application menu."
echo "🌐 Visit https://tauos.org for support and updates."
EOF

chmod +x "$SCRIPTS_DIR/install.sh"

# Create macOS installer
cat > "$SCRIPTS_DIR/install-macos.sh" << 'EOF'
#!/bin/bash

# TauOS macOS Installer

echo "🚀 Installing TauOS on macOS..."

# Install Homebrew if not present
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install dependencies
echo "📦 Installing dependencies..."
brew install gtk4 libadwaita gstreamer gst-plugins-base gst-plugins-good

# Copy applications
echo "📁 Installing TauOS applications..."
sudo mkdir -p /Applications/TauOS
sudo cp apps/* /Applications/TauOS/
sudo chmod +x /Applications/TauOS/*

# Create Applications folder shortcuts
echo "🖥️ Creating application shortcuts..."
osascript -e 'tell application "Finder" to make new folder at (path to applications folder) with properties {name:"TauOS"}'

echo "✅ TauOS installation complete!"
echo "🎉 You can find TauOS applications in /Applications/TauOS/"
echo "🌐 Visit https://tauos.org for support and updates."
EOF

chmod +x "$SCRIPTS_DIR/install-macos.sh"

# Create Windows installer
cat > "$SCRIPTS_DIR/install-windows.ps1" << 'EOF'
# TauOS Windows Installer

Write-Host "🚀 Installing TauOS on Windows..." -ForegroundColor Green

# Create TauOS directory
$tauosDir = "C:\Program Files\TauOS"
New-Item -ItemType Directory -Force -Path $tauosDir

# Copy applications
Write-Host "📁 Installing TauOS applications..." -ForegroundColor Yellow
Copy-Item "apps\*" $tauosDir -Recurse -Force

# Create desktop shortcuts
Write-Host "🖥️ Creating desktop shortcuts..." -ForegroundColor Yellow
$desktop = [Environment]::GetFolderPath("Desktop")

$shortcuts = @(
    @{Name="TauOS Home"; Exec="$tauosDir\tauhome.exe"; Icon="$tauosDir\tauos.ico"},
    @{Name="Tau Browser"; Exec="$tauosDir\taubrowser.exe"; Icon="$tauosDir\browser.ico"},
    @{Name="TauOS Settings"; Exec="$tauosDir\tausettings.exe"; Icon="$tauosDir\settings.ico"},
    @{Name="Tau Media Player"; Exec="$tauosDir\taumedia.exe"; Icon="$tauosDir\media.ico"},
    @{Name="Tau Store"; Exec="$tauosDir\taustore.exe"; Icon="$tauosDir\store.ico"}
)

foreach ($shortcut in $shortcuts) {
    $WshShell = New-Object -comObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$desktop\$($shortcut.Name).lnk")
    $Shortcut.TargetPath = $shortcut.Exec
    $Shortcut.IconLocation = $shortcut.Icon
    $Shortcut.Save()
}

Write-Host "✅ TauOS installation complete!" -ForegroundColor Green
Write-Host "🎉 You can find TauOS applications on your desktop." -ForegroundColor Green
Write-Host "🌐 Visit https://tauos.org for support and updates." -ForegroundColor Cyan
EOF

echo "📋 Creating README..."
cat > "$ISO_DIR/README.md" << 'EOF'
# TauOS - Privacy-First Operating System

## Installation

### Linux
```bash
chmod +x scripts/install.sh
sudo ./scripts/install.sh
```

### macOS
```bash
chmod +x scripts/install-macos.sh
./scripts/install-macos.sh
```

### Windows
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\install-windows.ps1
```

## Features

- **TauOS Home**: Complete desktop environment
- **Tau Browser**: Privacy-first web browser
- **TauOS Settings**: System configuration
- **Tau Media Player**: Privacy-first media player
- **Tau Store**: Application marketplace

## Support

Visit https://tauos.org for documentation and support.

## Privacy

TauOS is built with privacy by design. No telemetry, no tracking, no compromises.
EOF

echo "🔐 Generating checksums..."
cd "$ISO_DIR"
find . -type f -exec sha256sum {} \; > checksums.txt

echo "📦 Creating production ISO..."
cd "$BUILD_DIR"
tar -czf tauos-production-$(date +%Y%m%d).tar.gz iso/

echo "✅ Production build complete!"
echo "📁 Build location: $BUILD_DIR/tauos-production-$(date +%Y%m%d).tar.gz"
echo "🔐 Checksums: $ISO_DIR/checksums.txt" 