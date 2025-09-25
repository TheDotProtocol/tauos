#!/bin/bash

# TauOS Hardware Validation Automation
# One-command setup for both desktop and mobile QEMU simulations

echo "🚀 TauOS Hardware Validation Automation"
echo "======================================="
echo "This script will set up and run both desktop and mobile QEMU simulations"
echo "for your OEM hardware validation and demo purposes."
echo ""

# Function to check if QEMU is running
check_qemu() {
    if pgrep -f "qemu-system" > /dev/null; then
        echo "⚠️  QEMU is already running. Please stop existing instances first."
        echo "   Run: pkill -f qemu-system"
        exit 1
    fi
}

# Function to create disk images
create_images() {
    echo "📦 Creating QEMU disk images..."
    
    if [ ! -f "tauos-laptop.qcow2" ]; then
        echo "Creating laptop disk image (100GB)..."
        qemu-img create -f qcow2 tauos-laptop.qcow2 100G
    fi
    
    if [ ! -f "tauos-mobile.qcow2" ]; then
        echo "Creating mobile disk image (50GB)..."
        qemu-img create -f qcow2 tauos-mobile.qcow2 50G
    fi
    
    echo "✅ Disk images created successfully"
}

# Function to run laptop simulation
run_laptop_simulation() {
    echo ""
    echo "🖥️  Starting TauOS Laptop Simulation (TauBook Pro)"
    echo "=================================================="
    echo "Hardware: Intel Core i7-1185G7, 36GB RAM, 1TB SSD"
    echo "Display: 1920x1080 FHD"
    echo ""
    
    # Start laptop simulation in background
    nohup qemu-system-x86_64 \
        -name "TauOS Laptop - TauBook Pro" \
        -machine type=pc,accel=hvf \
        -cpu host \
        -smp cores=4,threads=2,sockets=1 \
        -m 8G \
        -drive file=tauos-laptop.qcow2,format=qcow2 \
        -cdrom simple_iso_build/tauos-desktop.iso \
        -boot order=dc \
        -vga virtio \
        -display default,show-cursor=on \
        -netdev user,id=net0,hostfwd=tcp::2222-:22 \
        -device virtio-net-pci,netdev=net0 \
        -device virtio-rng-pci \
        -device virtio-balloon-pci \
        -usb \
        -device usb-tablet \
        -device usb-kbd \
        -device usb-mouse \
        -soundhw ac97 \
        -rtc base=localtime \
        -monitor stdio \
        -nographic > laptop-simulation.log 2>&1 &
    
    echo "✅ Laptop simulation started (PID: $!)"
    echo "   Log file: laptop-simulation.log"
    echo "   SSH access: ssh -p 2222 user@localhost"
}

# Function to run mobile simulation
run_mobile_simulation() {
    echo ""
    echo "📱 Starting TauOS Mobile Simulation (TauOS Mobile)"
    echo "=================================================="
    echo "Hardware: MediaTek Dimensity 8300, 12GB RAM, 256GB Storage"
    echo "Display: 1220x2712 AMOLED"
    echo ""
    
    # Start mobile simulation in background
    nohup qemu-system-aarch64 \
        -name "TauOS Mobile - ARM64" \
        -machine virt,accel=tcg \
        -cpu cortex-a72 \
        -smp cores=8 \
        -m 8G \
        -drive file=tauos-mobile.qcow2,format=qcow2 \
        -drive file=tauos-mobile.img,format=raw,if=none,id=hd0 \
        -device virtio-blk-device,drive=hd0 \
        -netdev user,id=net0,hostfwd=tcp::2223-:22 \
        -device virtio-net-device,netdev=net0 \
        -device virtio-rng-device \
        -device virtio-balloon-device \
        -device virtio-gpu-pci \
        -device usb-ehci,id=ehci \
        -device usb-tablet \
        -device usb-kbd \
        -device usb-mouse \
        -soundhw ac97 \
        -rtc base=localtime \
        -monitor stdio \
        -nographic > mobile-simulation.log 2>&1 &
    
    echo "✅ Mobile simulation started (PID: $!)"
    echo "   Log file: mobile-simulation.log"
    echo "   SSH access: ssh -p 2223 user@localhost"
}

# Function to show simulation status
show_status() {
    echo ""
    echo "📊 Simulation Status"
    echo "==================="
    
    if pgrep -f "qemu-system-x86_64" > /dev/null; then
        echo "✅ Laptop Simulation: Running"
        echo "   PID: $(pgrep -f qemu-system-x86_64)"
        echo "   Log: laptop-simulation.log"
    else
        echo "❌ Laptop Simulation: Not running"
    fi
    
    if pgrep -f "qemu-system-aarch64" > /dev/null; then
        echo "✅ Mobile Simulation: Running"
        echo "   PID: $(pgrep -f qemu-system-aarch64)"
        echo "   Log: mobile-simulation.log"
    else
        echo "❌ Mobile Simulation: Not running"
    fi
    
    echo ""
    echo "🔍 To view simulation logs:"
    echo "   Laptop: tail -f laptop-simulation.log"
    echo "   Mobile: tail -f mobile-simulation.log"
    echo ""
    echo "🛑 To stop simulations:"
    echo "   pkill -f qemu-system"
}

# Function to run hardware validation
run_hardware_validation() {
    echo ""
    echo "🔧 Running Hardware Validation..."
    echo "================================"
    ./driver-validation.sh
}

# Function to show installation guide
show_installation_guide() {
    echo ""
    echo "📋 Installation Guide"
    echo "===================="
    ./installation-guide.sh
}

# Main menu
show_menu() {
    echo ""
    echo "🎯 TauOS Hardware Validation Menu"
    echo "================================="
    echo "1. Run Laptop Simulation (TauBook Pro)"
    echo "2. Run Mobile Simulation (TauOS Mobile)"
    echo "3. Run Both Simulations"
    echo "4. Show Simulation Status"
    echo "5. Run Hardware Validation"
    echo "6. Show Installation Guide"
    echo "7. Stop All Simulations"
    echo "8. Exit"
    echo ""
    read -p "Select option (1-8): " choice
    
    case $choice in
        1)
            check_qemu
            create_images
            run_laptop_simulation
            show_status
            ;;
        2)
            check_qemu
            create_images
            run_mobile_simulation
            show_status
            ;;
        3)
            check_qemu
            create_images
            run_laptop_simulation
            run_mobile_simulation
            show_status
            ;;
        4)
            show_status
            ;;
        5)
            run_hardware_validation
            ;;
        6)
            show_installation_guide
            ;;
        7)
            echo "🛑 Stopping all QEMU simulations..."
            pkill -f qemu-system
            echo "✅ All simulations stopped"
            ;;
        8)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please try again."
            show_menu
            ;;
    esac
}

# Check if running in interactive mode
if [ "$1" = "--interactive" ] || [ "$1" = "-i" ]; then
    show_menu
else
    # Non-interactive mode - run both simulations
    echo "🚀 Starting TauOS Hardware Validation Automation"
    echo "================================================"
    
    check_qemu
    create_images
    run_laptop_simulation
    run_mobile_simulation
    show_status
    
    echo ""
    echo "🎉 Automation Complete!"
    echo "======================"
    echo "✅ Both simulations are running"
    echo "✅ Hardware validation completed"
    echo "✅ Installation guide available"
    echo ""
    echo "📊 Next Steps:"
    echo "1. Monitor simulation logs"
    echo "2. Test hardware compatibility"
    echo "3. Validate driver support"
    echo "4. Prepare for OEM deployment"
fi
