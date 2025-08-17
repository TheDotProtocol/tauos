#!/bin/bash

# Diagnose saslauthd Issues
echo "🔍 Diagnosing saslauthd Issues..."
echo "=================================="

echo ""
echo "📧 Checking saslauthd service status..."
sudo systemctl status saslauthd --no-pager -l

echo ""
echo "📧 Checking saslauthd configuration..."
cat /etc/default/saslauthd

echo ""
echo "📧 Checking saslauthd process..."
ps aux | grep saslauthd

echo ""
echo "📧 Checking saslauthd socket directory..."
ls -la /var/spool/postfix/var/run/saslauthd/ 2>/dev/null || echo "Directory not found"

echo ""
echo "📧 Checking saslauthd logs..."
sudo journalctl -u saslauthd --no-pager -l | tail -20

echo ""
echo "📧 Checking PAM configuration..."
cat /etc/pam.d/smtp 2>/dev/null || echo "PAM config not found"

echo ""
echo "📧 Checking user account..."
id noreply

echo ""
echo "📧 Testing password manually..."
echo "noreply" | sudo passwd --stdin noreply 2>/dev/null || echo "Password test failed"

echo ""
echo "📧 Checking saslauthd manual start..."
sudo saslauthd -a pam -d 2>&1 | head -10

echo ""
echo "📧 Checking system logs for saslauthd..."
sudo grep -i saslauthd /var/log/syslog | tail -10

echo ""
echo "📧 Checking if saslauthd package is properly installed..."
dpkg -l | grep sasl 