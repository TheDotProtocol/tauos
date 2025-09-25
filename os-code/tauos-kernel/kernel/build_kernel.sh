#!/bin/bash
set -e

ARCH=${1:-arm64} # or x86_64
KERNEL_VERSION=6.6.30 # Example LTS version
KERNEL_DIR=linux-$KERNEL_VERSION

if [ ! -d "$KERNEL_DIR" ]; then
  wget https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-$KERNEL_VERSION.tar.xz
  tar -xf linux-$KERNEL_VERSION.tar.xz
fi

cd $KERNEL_DIR

if [ "$ARCH" = "arm64" ]; then
  make ARCH=arm64 defconfig
  make -j$(nproc) ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu-
else
  make defconfig
  make -j$(nproc)
fi

echo "Kernel build complete for $ARCH." 