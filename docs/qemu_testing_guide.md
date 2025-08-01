# TauOS QEMU Testing Guide

## Overview

This guide provides step-by-step instructions for testing TauOS in QEMU virtual machines. QEMU allows us to test TauOS without requiring physical hardware or USB drives.

## Prerequisites

### System Requirements
- **RAM**: Minimum 4GB available for VM
- **Storage**: 20GB free space for VM disk
- **OS**: macOS, Linux, or Windows with QEMU support

### Dependencies

#### macOS
```bash
# Install QEMU and UEFI firmware
brew install qemu ovmf

# Verify installation
qemu-system-x86_64 --version
```

#### Ubuntu/Debian
```bash
# Install QEMU and UEFI firmware
sudo apt-get update
sudo apt-get install -y qemu-system-x86 qemu-system-arm ovmf

# Verify installation
qemu-system-x86_64 --version
```

#### Fedora/RHEL
```bash
# Install QEMU and UEFI firmware
sudo dnf install -y qemu-kvm qemu-system-x86 qemu-system-aarch64 edk2-ovmf

# Verify installation
qemu-system-x86_64 --version
```

#### Arch Linux
```bash
# Install QEMU and UEFI firmware
sudo pacman -S qemu ovmf

# Verify installation
qemu-system-x86_64 --version
```

## Quick Start

### 1. Automated Setup
```bash
# Navigate to TauOS directory
cd tauos

# Run the automated QEMU setup
./scripts/qemu_test_setup.sh
```

### 2. Manual Setup

#### Step 1: Create VM Directory
```bash
mkdir -p ./qemu-vms/tauos-test/disks
mkdir -p ./qemu-vms/tauos-test/efi
```

#### Step 2: Create Virtual Disk
```bash
# Create a 20GB virtual disk
qemu-img create -f qcow2 ./qemu-vms/tauos-test/disks/tauos-disk.qcow2 20G
```

#### Step 3: Start TauOS VM

**For Intel/AMD machines:**
```bash
qemu-system-x86_64 \
  -m 4G \
  -smp 2 \
  -enable-kvm \
  -cpu host \
  -drive file=./qemu-vms/tauos-test/disks/tauos-disk.qcow2,if=virtio,cache=writeback \
  -drive file=./tauos-simple-20250730.iso,if=virtio,media=cdrom,readonly=on \
  -net nic,model=virtio \
  -net user \
  -display gtk \
  -vga virtio \
  -soundhw ac97 \
  -usb \
  -device usb-tablet \
  -machine type=q35,accel=kvm
```

**For ARM machines (Apple Silicon):**
```bash
qemu-system-aarch64 \
  -m 4G \
  -smp 2 \
  -enable-kvm \
  -cpu host \
  -drive file=./qemu-vms/tauos-test/disks/tauos-disk.qcow2,if=virtio,cache=writeback \
  -drive file=./tauos-simple-20250730.iso,if=virtio,media=cdrom,readonly=on \
  -net nic,model=virtio \
  -net user \
  -display gtk \
  -vga virtio \
  -soundhw ac97 \
  -usb \
  -device usb-tablet \
  -machine type=virt,accel=hvf
```

## Advanced Configuration

### UEFI Support

To enable UEFI boot (recommended for modern systems):

**Intel/AMD:**
```bash
# Find OVMF firmware path
find /usr -name "OVMF.fd" 2>/dev/null
find /opt/homebrew -name "edk2-x86_64-code.fd" 2>/dev/null

# Add UEFI firmware to command
qemu-system-x86_64 \
  -bios /path/to/OVMF.fd \
  # ... rest of command
```

**ARM:**
```bash
# Find ARM UEFI firmware path
find /usr -name "QEMU_EFI.fd" 2>/dev/null
find /opt/homebrew -name "edk2-aarch64-code.fd" 2>/dev/null

# Add UEFI firmware to command
qemu-system-aarch64 \
  -bios /path/to/QEMU_EFI.fd \
  # ... rest of command
```

### Performance Optimization

**For better performance, add these options:**
```bash
# Enable KVM acceleration
-enable-kvm

# Use host CPU features
-cpu host

# Optimize disk I/O
-drive file=disk.qcow2,if=virtio,cache=writeback

# Use virtio network adapter
-net nic,model=virtio

# Use virtio graphics
-vga virtio
```

### Network Configuration

**Default (User Networking):**
```bash
-net nic,model=virtio -net user
```

**Bridged Networking (for server testing):**
```bash
# Create bridge interface
sudo brctl addbr br0
sudo brctl addif br0 eth0
sudo ip addr add 192.168.1.1/24 dev br0

# Use bridge in QEMU
-net nic,model=virtio -net bridge,br=br0
```

## Testing Scenarios

### 1. Basic Boot Test
```bash
# Start VM and verify TauOS boots
./scripts/qemu_test_setup.sh
# Select option 1 for GUI VM
```

**Expected Results:**
- TauOS boot screen appears
- System loads to desktop environment
- All basic UI elements are functional

### 2. Installation Test
```bash
# Start VM with persistent disk
./scripts/qemu_test_setup.sh
# Select option 1 for GUI VM
# Install TauOS to virtual disk
```

**Expected Results:**
- Installation process completes successfully
- System boots from installed OS
- All applications are accessible

### 3. Performance Test
```bash
# Start VM with performance monitoring
./scripts/qemu_test_setup.sh
# Select option 2 for headless VM
# Monitor resource usage
```

**Expected Results:**
- CPU usage stays reasonable (<80% under normal load)
- Memory usage is stable
- Disk I/O is responsive

### 4. Network Test
```bash
# Start VM with network access
./scripts/qemu_test_setup.sh
# Select option 1 for GUI VM
# Test internet connectivity
```

**Expected Results:**
- Internet connection works
- TauMail and TauCloud can connect
- Package updates can be downloaded

## Troubleshooting

### Common Issues

#### 1. VM Won't Start
**Symptoms:** QEMU exits immediately or shows error
**Solutions:**
```bash
# Check if KVM is available
ls /dev/kvm

# Enable KVM if needed
sudo modprobe kvm
sudo modprobe kvm_intel  # or kvm_amd

# Check user permissions
sudo usermod -a -G kvm $USER
```

#### 2. Slow Performance
**Symptoms:** VM is sluggish or unresponsive
**Solutions:**
```bash
# Increase RAM allocation
-m 8G

# Add more CPU cores
-smp 4

# Use virtio drivers
-drive file=disk.qcow2,if=virtio,cache=writeback
-net nic,model=virtio
-vga virtio
```

#### 3. Network Issues
**Symptoms:** No internet connection in VM
**Solutions:**
```bash
# Check host network
ip addr show

# Use different network model
-net nic,model=e1000 -net user

# Enable port forwarding
-net user,hostfwd=tcp::2222-:22
```

#### 4. Display Issues
**Symptoms:** No graphics or poor graphics performance
**Solutions:**
```bash
# Try different display backends
-display gtk
-display sdl
-display cocoa  # macOS

# Use different graphics adapter
-vga std
-vga virtio
-vga qxl
```

### Debug Mode

**Enable verbose output:**
```bash
qemu-system-x86_64 \
  -d guest_errors \
  -D qemu.log \
  # ... rest of command
```

**Check logs:**
```bash
tail -f qemu.log
```

## VM Management

### Disk Operations

**Resize disk:**
```bash
qemu-img resize ./qemu-vms/tauos-test/disks/tauos-disk.qcow2 +10G
```

**Create snapshot:**
```bash
qemu-img snapshot -c snapshot1 ./qemu-vms/tauos-test/disks/tauos-disk.qcow2
```

**Restore snapshot:**
```bash
qemu-img snapshot -a snapshot1 ./qemu-vms/tauos-test/disks/tauos-disk.qcow2
```

**Convert disk format:**
```bash
# Convert to raw format
qemu-img convert -f qcow2 -O raw ./qemu-vms/tauos-test/disks/tauos-disk.qcow2 tauos-disk.raw

# Convert to VMDK (VMware)
qemu-img convert -f qcow2 -O vmdk ./qemu-vms/tauos-test/disks/tauos-disk.qcow2 tauos-disk.vmdk
```

### VM Information

**Check disk info:**
```bash
qemu-img info ./qemu-vms/tauos-test/disks/tauos-disk.qcow2
```

**List snapshots:**
```bash
qemu-img snapshot -l ./qemu-vms/tauos-test/disks/tauos-disk.qcow2
```

## Integration with CI/CD

### Automated Testing

**Headless VM for CI:**
```bash
qemu-system-x86_64 \
  -m 2G \
  -smp 2 \
  -enable-kvm \
  -drive file=./qemu-vms/tauos-test/disks/tauos-disk.qcow2,if=virtio \
  -drive file=./tauos-simple-20250730.iso,if=virtio,media=cdrom \
  -net nic,model=virtio \
  -net user \
  -display none \
  -serial stdio \
  -machine type=q35,accel=kvm
```

**Automated test script:**
```bash
#!/bin/bash
# test_tauos.sh

# Start headless VM
qemu-system-x86_64 \
  -m 2G \
  -smp 2 \
  -enable-kvm \
  -drive file=./qemu-vms/tauos-test/disks/tauos-disk.qcow2,if=virtio \
  -drive file=./tauos-simple-20250730.iso,if=virtio,media=cdrom \
  -net nic,model=virtio \
  -net user \
  -display none \
  -serial stdio \
  -machine type=q35,accel=kvm \
  -nographic \
  -monitor null \
  -serial file:test.log &

VM_PID=$!

# Wait for boot
sleep 30

# Run tests
echo "Running TauOS tests..."
# Add your test commands here

# Shutdown VM
kill $VM_PID

# Check test results
if grep -q "TauOS started successfully" test.log; then
    echo "✅ TauOS boot test passed"
    exit 0
else
    echo "❌ TauOS boot test failed"
    exit 1
fi
```

## Next Steps

After successful QEMU testing:

1. **Physical Installation**: Test on real hardware
2. **Performance Optimization**: Tune VM settings for your use case
3. **Network Configuration**: Set up proper networking for your environment
4. **Backup Strategy**: Implement VM backup and recovery procedures

## Support

For issues with QEMU testing:

1. Check the troubleshooting section above
2. Review QEMU logs in `qemu.log`
3. Verify system requirements and dependencies
4. Test with different QEMU configurations

---

*Last updated: July 30, 2025*
*TauOS Version: 1.0* 