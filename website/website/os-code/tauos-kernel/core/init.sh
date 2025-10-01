#!/bin/sh
# Tau OS minimal init (PID 1)

mount -t proc proc /proc
mount -t sysfs sys /sys
mount -t devtmpfs dev /dev

# Start networking
ohup /core/netd.sh &

# Start session manager
/core/sessiond.sh &

# Wait for children
while :; do
    sleep 60
done 