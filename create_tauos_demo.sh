#!/bin/bash

# Create TauOS Demo Bootable System
echo "🚀 Creating TauOS Demo Bootable System"
echo "======================================"

# Create a simple bootable system
mkdir -p tauos_demo_build/{boot,rootfs}

# Create a simple kernel and initrd
echo "Creating TauOS kernel..."
cat > tauos_demo_build/boot/vmlinuz << 'EOF'
# TauOS Kernel Placeholder
# This would be a real Linux kernel in production
EOF

echo "Creating TauOS initrd..."
cat > tauos_demo_build/boot/initrd.img << 'EOF'
# TauOS Initrd Placeholder
# This would be a real initrd in production
EOF

# Create a simple boot configuration
cat > tauos_demo_build/boot/grub.cfg << 'EOF'
set timeout=5
set default=0

menuentry "TauOS Desktop" {
    linux /boot/vmlinuz root=/dev/sda1
    initrd /boot/initrd.img
}

menuentry "TauOS Mobile" {
    linux /boot/vmlinuz root=/dev/sda1 mobile=1
    initrd /boot/initrd.img
}
EOF

# Create a simple root filesystem
mkdir -p tauos_demo_build/rootfs/{bin,sbin,etc,usr,var,home}

# Create TauOS desktop environment
cat > tauos_demo_build/rootfs/usr/bin/tauos-desktop << 'EOF'
#!/bin/bash
echo "🖥️  TauOS Desktop Environment"
echo "============================="
echo "Welcome to TauOS Desktop!"
echo "This is a demonstration of the TauOS operating system."
echo ""
echo "Desktop Features:"
echo "  ✅ Modern Desktop Environment"
echo "  ✅ File Manager"
echo "  ✅ Web Browser"
echo "  ✅ Email Client (TauMail)"
echo "  ✅ System Settings"
echo ""
echo "Press any key to continue..."
read -n 1
EOF

chmod +x tauos_demo_build/rootfs/usr/bin/tauos-desktop

# Create TauOS mobile environment
cat > tauos_demo_build/rootfs/usr/bin/tauos-mobile << 'EOF'
#!/bin/bash
echo "📱 TauOS Mobile Environment"
echo "========================="
echo "Welcome to TauOS Mobile!"
echo "This is a demonstration of the TauOS mobile operating system."
echo ""
echo "Mobile Features:"
echo "  ✅ Touch Interface"
echo "  ✅ Mobile Apps"
echo "  ✅ Camera Integration"
echo "  ✅ GPS Navigation"
echo "  ✅ Mobile Messaging"
echo ""
echo "Press any key to continue..."
read -n 1
EOF

chmod +x tauos_demo_build/rootfs/usr/bin/tauos-mobile

echo "✅ TauOS Demo System Created!"
echo "============================="
echo "Desktop Demo: tauos_demo_build/rootfs/usr/bin/tauos-desktop"
echo "Mobile Demo:  tauos_demo_build/rootfs/usr/bin/tauos-mobile"
echo ""
echo "This is a demonstration system for marketing purposes."
echo "In production, this would be a full Linux distribution."
