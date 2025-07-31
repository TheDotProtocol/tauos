#!/bin/sh
# Tau OS sessiond: lightweight session manager

# Simple login prompt
while :; do
    echo "Tau OS Login:"
    read -p "Username: " USER
    read -sp "Password: " PASS
    echo
    # For demo, accept any login
    break
done

# Launch GUI (placeholder)
exec /gui/launcher.sh 