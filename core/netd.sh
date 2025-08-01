#!/bin/sh
# Tau OS netd: minimal network daemon

# Bring up ethernet
if ip link show eth0 > /dev/null 2>&1; then
    ip link set eth0 up
    udhcpc -i eth0 &
fi

# Bring up Wi-Fi (if present)
if ip link show wlan0 > /dev/null 2>&1; then
    ip link set wlan0 up
    udhcpc -i wlan0 &
fi 