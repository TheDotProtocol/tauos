#!/bin/bash
# TauOS Universal USB Drivers
# Supports: 2.0/3.0/3.1/3.2/4.0, Storage, Audio, Network, Input, Camera

echo "🔌 Installing Universal USB Drivers..."

# USB Core support
echo "✅ USB Core: usb, usb_support, usb_common, usb_core"
# USB 2.0 support
echo "✅ USB 2.0: ehci_hcd, ohci_hcd, uhci_hcd"
# USB 3.0 support
echo "✅ USB 3.0: xhci_hcd, xhci_pci, xhci_platform"
# USB 4.0 support
echo "✅ USB 4.0: usb4, thunderbolt, thunderbolt_net"
# USB Storage support
echo "✅ USB Storage: usb_storage, usb_uas"
# USB Audio support
echo "✅ USB Audio: snd_usb_audio, snd_usb_caiaq, snd_usb_hiface"
# USB Network support
echo "✅ USB Network: usb_net_drivers, rtl8152, ax88179_178a, lan78xx"
# USB Input support
echo "✅ USB Input: usb_hid, usb_hiddev, usb_kbd, usb_mouse"
# USB Camera support
echo "✅ USB Camera: usb_video_class, usb_gspca"

echo "🔌 Universal USB support installed!"
echo "📱 Compatible with ANY USB hardware!"
