#!/bin/bash

# TauOS Icon Pack Installation Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ICON_DIR="/usr/share/icons/tauos"
ICON_SIZES=(16 24 32 48 64 128 256)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}🐢 TauOS Icon Pack Installation${NC}"
echo "=================================="

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}Error: This script must be run as root${NC}"
   echo "Please run: sudo $0"
   exit 1
fi

# Create icon directory
echo -e "${YELLOW}Creating icon directory...${NC}"
mkdir -p "$ICON_DIR"

# Create size directories
for size in "${ICON_SIZES[@]}"; do
    mkdir -p "$ICON_DIR/${size}x${size}/apps"
    mkdir -p "$ICON_DIR/${size}x${size}/actions"
    mkdir -p "$ICON_DIR/${size}x${size}/status"
    mkdir -p "$ICON_DIR/${size}x${size}/places"
    mkdir -p "$ICON_DIR/${size}x${size}/mimetypes"
done

# Generate SVG icons
echo -e "${YELLOW}Generating SVG icons...${NC}"

# Application icons
cat > "$ICON_DIR/scalable/apps/tauos-app.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#000" stroke-width="2"/>
    <path d="M8 12L11 15L16 9" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

# Settings icon
cat > "$ICON_DIR/scalable/apps/tauos-settings.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#FFD700" stroke-width="2"/>
    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9887C9.5799 19.7195 9.31074 19.5149 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.104 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.104 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74206 9.96512 4.01128 9.77251C4.2805 9.5799 4.48514 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.024 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.024 4.47575 4.21 4.29C4.39575 4.104 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.104 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.024 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.024 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="#FFD700" stroke-width="2"/>
</svg>
EOF

# Action icons
cat > "$ICON_DIR/scalable/actions/tauos-add.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
    <path d="M5 12H19" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
</svg>
EOF

cat > "$ICON_DIR/scalable/actions/tauos-close.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 6L18 18" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

# Status icons
cat > "$ICON_DIR/scalable/status/tauos-success.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9817C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76488 14.1003 1.98232 16.07 2.85999" stroke="#44FF99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 4L12 14.01L9 11.01" stroke="#44FF99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

cat > "$ICON_DIR/scalable/status/tauos-error.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#FF5555" stroke-width="2"/>
    <path d="M15 9L9 15" stroke="#FF5555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 9L15 15" stroke="#FF5555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

cat > "$ICON_DIR/scalable/status/tauos-warning.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="#FFBD2E" stroke-width="2"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="#FFBD2E" stroke-width="2" stroke-linecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FFBD2E" stroke-width="2" stroke-linecap="round"/>
</svg>
EOF

# Places icons
cat > "$ICON_DIR/scalable/places/tauos-home.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#FFD700" stroke-width="2"/>
    <path d="M9 22V12H15V22" stroke="#FFD700" stroke-width="2"/>
</svg>
EOF

cat > "$ICON_DIR/scalable/places/tauos-folder.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 19A2 2 0 0 1 20 21H4A2 2 0 0 1 2 19V5A2 2 0 0 1 4 3H9L11 6H20A2 2 0 0 1 22 8Z" stroke="#FFD700" stroke-width="2"/>
</svg>
EOF

# Mime type icons
cat > "$ICON_DIR/scalable/mimetypes/tauos-file.svg" << 'EOF'
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="#FFD700" stroke-width="2"/>
    <polyline points="14,2 14,8 20,8" stroke="#FFD700" stroke-width="2"/>
</svg>
EOF

# Generate PNG versions for different sizes
echo -e "${YELLOW}Generating PNG icons...${NC}"

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    for size in "${ICON_SIZES[@]}"; do
        echo "Generating ${size}x${size} icons..."
        
        # Convert SVG to PNG for each size
        for svg_file in "$ICON_DIR"/scalable/*/*.svg; do
            if [[ -f "$svg_file" ]]; then
                # Extract category and filename
                category=$(basename "$(dirname "$svg_file")")
                filename=$(basename "$svg_file" .svg)
                
                # Create output directory
                mkdir -p "$ICON_DIR/${size}x${size}/$category"
                
                # Convert SVG to PNG
                convert "$svg_file" -resize "${size}x${size}" "$ICON_DIR/${size}x${size}/$category/$filename.png"
            fi
        done
    done
else
    echo -e "${YELLOW}Warning: ImageMagick not found. Only SVG icons will be available.${NC}"
    echo "Install ImageMagick to generate PNG icons: sudo apt install imagemagick"
fi

# Create index.theme file
echo -e "${YELLOW}Creating index.theme file...${NC}"
cat > "$ICON_DIR/index.theme" << 'EOF'
[Icon Theme]
Name=TauOS
Comment=TauOS Icon Theme
Example=folder

# Directories
Directories=scalable/apps,scalable/actions,scalable/status,scalable/places,scalable/mimetypes,16x16/apps,16x16/actions,16x16/status,16x16/places,16x16/mimetypes,24x24/apps,24x24/actions,24x24/status,24x24/places,24x24/mimetypes,32x32/apps,32x32/actions,32x32/status,32x32/places,32x32/mimetypes,48x48/apps,48x48/actions,48x48/status,48x48/places,48x48/mimetypes,64x64/apps,64x64/actions,64x64/status,64x64/places,64x64/mimetypes,128x128/apps,128x128/actions,128x128/status,128x128/places,128x128/mimetypes,256x256/apps,256x256/actions,256x256/status,256x256/places,256x256/mimetypes

# Scalable directories
[scalable/apps]
Size=16
MinSize=8
MaxSize=512
Type=Scalable

[scalable/actions]
Size=16
MinSize=8
MaxSize=512
Type=Scalable

[scalable/status]
Size=16
MinSize=8
MaxSize=512
Type=Scalable

[scalable/places]
Size=16
MinSize=8
MaxSize=512
Type=Scalable

[scalable/mimetypes]
Size=16
MinSize=8
MaxSize=512
Type=Scalable

# Fixed size directories
[16x16/apps]
Size=16
Type=Fixed

[16x16/actions]
Size=16
Type=Fixed

[16x16/status]
Size=16
Type=Fixed

[16x16/places]
Size=16
Type=Fixed

[16x16/mimetypes]
Size=16
Type=Fixed

[24x24/apps]
Size=24
Type=Fixed

[24x24/actions]
Size=24
Type=Fixed

[24x24/status]
Size=24
Type=Fixed

[24x24/places]
Size=24
Type=Fixed

[24x24/mimetypes]
Size=24
Type=Fixed

[32x32/apps]
Size=32
Type=Fixed

[32x32/actions]
Size=32
Type=Fixed

[32x32/status]
Size=32
Type=Fixed

[32x32/places]
Size=32
Type=Fixed

[32x32/mimetypes]
Size=32
Type=Fixed

[48x48/apps]
Size=48
Type=Fixed

[48x48/actions]
Size=48
Type=Fixed

[48x48/status]
Size=48
Type=Fixed

[48x48/places]
Size=48
Type=Fixed

[48x48/mimetypes]
Size=48
Type=Fixed

[64x64/apps]
Size=64
Type=Fixed

[64x64/actions]
Size=64
Type=Fixed

[64x64/status]
Size=64
Type=Fixed

[64x64/places]
Size=64
Type=Fixed

[64x64/mimetypes]
Size=64
Type=Fixed

[128x128/apps]
Size=128
Type=Fixed

[128x128/actions]
Size=128
Type=Fixed

[128x128/status]
Size=128
Type=Fixed

[128x128/places]
Size=128
Type=Fixed

[128x128/mimetypes]
Size=128
Type=Fixed

[256x256/apps]
Size=256
Type=Fixed

[256x256/actions]
Size=256
Type=Fixed

[256x256/status]
Size=256
Type=Fixed

[256x256/places]
Size=256
Type=Fixed

[256x256/mimetypes]
Size=256
Type=Fixed
EOF

# Set permissions
echo -e "${YELLOW}Setting permissions...${NC}"
chmod -R 755 "$ICON_DIR"
chown -R root:root "$ICON_DIR"

# Update icon cache
echo -e "${YELLOW}Updating icon cache...${NC}"
if command -v gtk-update-icon-cache &> /dev/null; then
    gtk-update-icon-cache -f -t "$ICON_DIR"
else
    echo -e "${YELLOW}Warning: gtk-update-icon-cache not found. Icon cache not updated.${NC}"
fi

echo -e "${GREEN}✅ TauOS Icon Pack installation completed successfully!${NC}"
echo ""
echo -e "${BLUE}Installed icons:${NC}"
echo "  📱 Application icons (tauos-app, tauos-settings)"
echo "  ⚡ Action icons (tauos-add, tauos-close)"
echo "  📊 Status icons (tauos-success, tauos-error, tauos-warning)"
echo "  🏠 Place icons (tauos-home, tauos-folder)"
echo "  📄 Mime type icons (tauos-file)"
echo ""
echo -e "${BLUE}Icon sizes available:${NC}"
for size in "${ICON_SIZES[@]}"; do
    echo "  ${size}x${size}"
done
echo "  scalable (SVG)"
echo ""
echo -e "${BLUE}Location:${NC} $ICON_DIR"
echo ""
echo -e "${YELLOW}To use the icons in your applications:${NC}"
echo "  - Use icon names like 'tauos-app', 'tauos-settings', etc."
echo "  - Icons will automatically scale to the requested size"
echo "  - Available in both SVG and PNG formats" 