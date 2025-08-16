#!/bin/bash

# Check Google Cloud Instance for SMTP Deployment
echo "🔍 Checking Google Cloud Instance for SMTP Deployment..."
echo "=================================================="

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  This script should be run with sudo for full functionality"
fi

echo ""
echo "📋 System Information:"
echo "OS: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"

echo ""
echo "🌐 Network Configuration:"
echo "External IP: $(curl -s ifconfig.me)"
echo "Internal IP: $(hostname -I | awk '{print $1}')"
echo "Hostname: $(hostname)"

echo ""
echo "🔧 Package Status:"
if command -v postfix &> /dev/null; then
    echo "✅ Postfix: Installed"
    echo "   Version: $(postconf -d | grep mail_version | cut -d'=' -f2)"
else
    echo "❌ Postfix: Not installed"
fi

if command -v dovecot &> /dev/null; then
    echo "✅ Dovecot: Installed"
    echo "   Version: $(dovecot --version)"
else
    echo "❌ Dovecot: Not installed"
fi

echo ""
echo "🚪 Port Status:"
echo "Port 25 (SMTP): $(netstat -tlnp 2>/dev/null | grep :25 || echo 'Not listening')"
echo "Port 587 (SMTP Submission): $(netstat -tlnp 2>/dev/null | grep :587 || echo 'Not listening')"
echo "Port 465 (SMTPS): $(netstat -tlnp 2>/dev/null | grep :465 || echo 'Not listening')"

echo ""
echo "🔥 Firewall Status:"
if command -v ufw &> /dev/null; then
    echo "UFW Status: $(ufw status | head -1)"
else
    echo "UFW: Not installed"
fi

echo ""
echo "📁 DNS Resolution Test:"
echo "mailserver.tauos.org resolves to: $(nslookup mailserver.tauos.org 2>/dev/null | grep 'Address:' | tail -1 | awk '{print $2}' || echo 'Not resolving')"

echo ""
echo "🔐 SSL Certificate Check:"
if [ -f "/etc/ssl/certs/ssl-cert-snakeoil.pem" ]; then
    echo "✅ Default SSL certificate exists"
else
    echo "❌ Default SSL certificate missing"
fi

echo ""
echo "📧 Mail User Check:"
if id "noreply" &>/dev/null; then
    echo "✅ noreply user exists"
else
    echo "❌ noreply user does not exist"
fi

echo ""
echo "=================================================="
echo "🎯 Next Steps:"
echo "1. If Postfix/Dovecot not installed: Run deployment guide"
echo "2. If ports not listening: Check service status"
echo "3. If DNS not resolving: Update A record for mailserver.tauos.org"
echo "4. If firewall blocking: Configure UFW rules"
echo "==================================================" 