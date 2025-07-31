# Tau OS Installation Guide

This guide will walk you through installing Tau OS on your system.

## System Requirements

### Minimum Requirements
- **CPU**: 64-bit x86_64 or ARM64 processor
- **RAM**: 2GB (4GB recommended)
- **Storage**: 8GB available space (16GB recommended)
- **Graphics**: Any modern GPU with OpenGL 3.3+ support
- **Network**: Ethernet or Wi-Fi adapter

### Recommended Requirements
- **CPU**: Multi-core processor (4+ cores)
- **RAM**: 8GB or more
- **Storage**: 32GB SSD
- **Graphics**: Dedicated GPU with Vulkan support
- **Network**: Gigabit Ethernet or 802.11ac Wi-Fi

## Installation Methods

### Method 1: Live USB Installation (Recommended)

1. **Download Tau OS ISO**
   ```bash
   # Download the latest Tau OS ISO
   wget https://tauos.org/downloads/tauos-1.0.0-x86_64.iso
   ```

2. **Create Bootable USB**
   ```bash
   # On Linux/macOS
   sudo dd if=tauos-1.0.0-x86_64.iso of=/dev/sdX bs=4M status=progress
   
   # On Windows, use tools like Rufus or Balena Etcher
   ```

3. **Boot from USB**
   - Restart your computer
   - Enter BIOS/UEFI (usually F2, F12, or Del)
   - Set USB as first boot device
   - Save and exit

4. **Run Installer**
   ```bash
   # From the live environment
   sudo ./install.sh
   ```

### Method 2: Network Installation

1. **Download Network Installer**
   ```bash
   wget https://tauos.org/downloads/tauos-netinst-1.0.0-x86_64.iso
   ```

2. **Boot and Install**
   - Boot from the network installer
   - Follow the guided installation process
   - Download packages over the network

### Method 3: Virtual Machine Installation

1. **Download ISO**
   ```bash
   wget https://tauos.org/downloads/tauos-1.0.0-x86_64.iso
   ```

2. **Create VM**
   ```bash
   # Using QEMU
   qemu-system-x86_64 -m 4G -smp 4 -hda tauos.qcow2 -cdrom tauos-1.0.0-x86_64.iso
   
   # Using VirtualBox
   VBoxManage createvm --name "Tau OS" --ostype "Linux_64"
   VBoxManage modifyvm "Tau OS" --memory 4096 --cpus 4
   VBoxManage storagectl "Tau OS" --name "SATA" --add sata
   VBoxManage storageattach "Tau OS" --storagectl "SATA" --port 0 --device 0 --type hdd --medium tauos.qcow2
   VBoxManage storagectl "Tau OS" --name "IDE" --add ide
   VBoxManage storageattach "Tau OS" --storagectl "IDE" --port 0 --device 0 --type dvddrive --medium tauos-1.0.0-x86_64.iso
   ```

## Installation Process

### Step 1: Partitioning

The installer will help you partition your disk. You can choose:

- **Automatic**: Let the installer handle partitioning
- **Manual**: Create partitions yourself

**Recommended Partition Layout:**
```
/dev/sda1  EFI System Partition    512MB  fat32
/dev/sda2  Boot Partition          1GB    ext4
/dev/sda3  Root Partition          20GB   ext4
/dev/sda4  Home Partition          rest   ext4
/dev/sda5  Swap Partition          4GB    swap
```

### Step 2: System Configuration

1. **Set Hostname**
   ```bash
   # Default: tauos
   # You can change this during installation
   ```

2. **Create User Account**
   ```bash
   # Default user: tau
   # Default password: tauos
   # You can change these during installation
   ```

3. **Configure Network**
   ```bash
   # DHCP is enabled by default
   # You can configure static IP if needed
   ```

### Step 3: Package Installation

The installer will install:

- **Core System**: Kernel, init system, basic tools
- **Desktop Environment**: GTK4-based GUI with TauKit
- **Applications**: Terminal, editor, browser, media player
- **Development Tools**: SDK, compilers, debuggers
- **System Services**: Network, power management, updates

### Step 4: Bootloader Configuration

The installer will:

1. Install GRUB bootloader
2. Configure boot entries
3. Set up secure boot (if available)
4. Configure boot timeout and options

## Post-Installation

### First Boot

1. **Remove Installation Media**
   - Eject USB drive or remove ISO from VM

2. **Boot Tau OS**
   - Select "Tau OS" from GRUB menu
   - Wait for system to start

3. **Login**
   ```bash
   Username: tau
   Password: tauos
   ```

### Initial Setup

1. **Update System**
   ```bash
   sudo tau-upd update
   ```

2. **Install Additional Software**
   ```bash
   # Open TauStore
   tau-store
   
   # Or use command line
   tau-pkg install <package-name>
   ```

3. **Configure User Preferences**
   ```bash
   # Open Settings
   tau-settings
   ```

## Troubleshooting

### Common Issues

1. **Boot Failure**
   ```bash
   # Boot into recovery mode
   # Edit GRUB entry, add 'single' to kernel line
   # Check logs: journalctl -xb
   ```

2. **Network Issues**
   ```bash
   # Check network status
   systemctl status systemd-networkd
   
   # Configure network manually
   sudo nano /etc/systemd/network/20-wired.network
   ```

3. **Graphics Issues**
   ```bash
   # Check graphics drivers
   lspci | grep -i vga
   
   # Install additional drivers
   tau-pkg install tau-graphics-drivers
   ```

4. **Package Installation Issues**
   ```bash
   # Update package database
   tau-pkg sync
   
   # Clear package cache
   sudo rm -rf /var/cache/tau-pkg
   ```

### Getting Help

- **Documentation**: https://docs.tauos.org
- **Forums**: https://forum.tauos.org
- **IRC**: #tauos on Libera.Chat
- **GitHub**: https://github.com/tauos/tauos/issues

## Advanced Installation

### Custom Partitioning

```bash
# Create partitions manually
sudo fdisk /dev/sda

# Format partitions
sudo mkfs.ext4 /dev/sda3  # root
sudo mkfs.ext4 /dev/sda4  # home
sudo mkswap /dev/sda5     # swap

# Mount partitions
sudo mount /dev/sda3 /mnt
sudo mount /dev/sda2 /mnt/boot
sudo mount /dev/sda1 /mnt/efi
```

### Network Installation

```bash
# Boot from network installer
# Configure network manually if needed
ip addr add 192.168.1.100/24 dev eth0
ip route add default via 192.168.1.1
echo "nameserver 8.8.8.8" > /etc/resolv.conf
```

### Dual Boot Installation

1. **Shrink Existing Partition**
   ```bash
   # Use GParted or similar tool
   # Leave space for Tau OS
   ```

2. **Install Tau OS**
   - Choose "Install alongside existing OS"
   - Installer will handle GRUB configuration

3. **Configure Boot Menu**
   ```bash
   # Edit GRUB configuration
   sudo nano /etc/default/grub
   sudo grub-mkconfig -o /boot/grub/grub.cfg
   ```

## Security Considerations

### Full Disk Encryption

```bash
# Enable during installation
# Choose "Encrypt entire disk" option
# Set encryption passphrase
```

### Secure Boot

```bash
# Enable in BIOS/UEFI
# Install secure boot keys
sudo mokutil --import /etc/tau/secure-boot/keys/db.der
```

### Firewall Configuration

```bash
# Enable firewall
sudo systemctl enable ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable
```

## Performance Optimization

### SSD Optimization

```bash
# Enable TRIM
sudo systemctl enable fstrim.timer

# Optimize I/O scheduler
echo 'ACTION=="add|change", KERNEL=="sd[a-z]", ATTR{queue/scheduler}="none"' | sudo tee /etc/udev/rules.d/60-ioschedulers.rules
```

### Memory Optimization

```bash
# Configure swap
sudo swapon --show
sudo nano /etc/sysctl.conf
# Add: vm.swappiness=10
```

### Graphics Optimization

```bash
# Install graphics drivers
tau-pkg install tau-graphics-drivers

# Configure graphics
tau-settings display
```

---

**Tau OS: Minimal, Secure, Beautiful, and Ready for the Future.** 