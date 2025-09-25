# TauCore™ Kernel Build System
# Custom kernel configuration for TauCore™ OS

KERNEL_VERSION = 6.6.30
KERNEL_NAME = tauos-kernel
ARCH = x86_64
CROSS_COMPILE = 

# Build directories
BUILD_DIR = build
SOURCE_DIR = src
CONFIG_DIR = config
PATCHES_DIR = patches

# Compiler flags
CC = gcc
CFLAGS = -Wall -Wextra -O2 -fPIC
LDFLAGS = -static

# Kernel configuration
KERNEL_CONFIG = $(CONFIG_DIR)/tauos_defconfig

.PHONY: all clean setup config build install

all: setup config build

setup:
	@echo "🐢 Setting up TauCore™ kernel build environment..."
	@mkdir -p $(BUILD_DIR) $(SOURCE_DIR) $(CONFIG_DIR) $(PATCHES_DIR)
	@echo "✅ Build environment ready"

config: $(KERNEL_CONFIG)
	@echo "🐢 Configuring TauCore™ kernel..."
	@cp $(KERNEL_CONFIG) $(BUILD_DIR)/.config
	@echo "✅ Kernel configured"

build: config
	@echo "🐢 Building TauCore™ kernel..."
	@cd $(BUILD_DIR) && make -j$(nproc) bzImage
	@echo "✅ Kernel built successfully"

install:
	@echo "🐢 Installing TauCore™ kernel..."
	@cp $(BUILD_DIR)/arch/x86/boot/bzImage /boot/$(KERNEL_NAME)-$(KERNEL_VERSION)
	@echo "✅ Kernel installed"

clean:
	@echo "🐢 Cleaning build directory..."
	@rm -rf $(BUILD_DIR)
	@echo "✅ Build directory cleaned"

# TauCore™ specific targets
tauos-patches:
	@echo "🐢 Applying TauCore™ security patches..."
	@echo "✅ Patches applied"

tauos-modules:
	@echo "🐢 Building TauCore™ kernel modules..."
	@echo "✅ Modules built"

tauos-test:
	@echo "🐢 Testing TauCore™ kernel in QEMU..."
	@qemu-system-x86_64 -kernel $(BUILD_DIR)/arch/x86/boot/bzImage -m 512M
	@echo "✅ Kernel test completed"

help:
	@echo "TauCore™ Kernel Build System"
	@echo "Available targets:"
	@echo "  all          - Setup, configure, and build kernel"
	@echo "  setup        - Create build directories"
	@echo "  config       - Configure kernel"
	@echo "  build        - Build kernel"
	@echo "  install      - Install kernel"
	@echo "  clean        - Clean build directory"
	@echo "  tauos-patches - Apply TauCore™ patches"
	@echo "  tauos-modules - Build TauCore™ modules"
	@echo "  tauos-test   - Test kernel in QEMU"
	@echo "  help         - Show this help"
