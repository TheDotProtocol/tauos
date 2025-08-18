#!/bin/bash

echo "🔍 TauOS SMTP Server Status Check"
echo "=================================="
echo ""

# Check if we're on the server
if [[ "$HOSTNAME" != "tauos-smtp" ]]; then
    echo "❌ This script should be run on the tauos-smtp server"
    echo "   SSH into the server first: ssh foundationtau@34.30.189.200"
    exit 1
fi

echo "✅ Running on tauos-smtp server"
echo ""

# 1. Check Postfix status
echo "📧 Checking Postfix Status..."
if systemctl is-active --quiet postfix; then
    echo "   ✅ Postfix is running"
else
    echo "   ❌ Postfix is not running"
    echo "   Starting Postfix..."
    sudo systemctl start postfix
fi

# 2. Check saslauthd status
echo "🔐 Checking saslauthd Status..."
if systemctl is-active --quiet saslauthd; then
    echo "   ✅ saslauthd is running"
else
    echo "   ❌ saslauthd is not running"
    echo "   Starting saslauthd..."
    sudo systemctl start saslauthd
fi

# 3. Check socket directory
echo "🔌 Checking saslauthd socket..."
if [ -S "/var/spool/postfix/var/run/saslauthd/mux" ]; then
    echo "   ✅ saslauthd socket exists"
else
    echo "   ❌ saslauthd socket missing"
fi

# 4. Check port 587
echo "🌐 Checking SMTP port 587..."
if netstat -tlnp | grep ":587 "; then
    echo "   ✅ Port 587 is listening"
else
    echo "   ❌ Port 587 is not listening"
fi

# 5. Test authentication
echo "🔑 Testing SMTP authentication..."
if echo "noreply@tauos.org" | sudo testsaslauthd -s smtp -u noreply@tauos.org -p "TauOS2024!Secure"; then
    echo "   ✅ Authentication working"
else
    echo "   ❌ Authentication failed"
fi

# 6. Check DNS resolution
echo "🌍 Checking DNS resolution..."
if nslookup mailserver.tauos.org | grep "34.30.189.200"; then
    echo "   ✅ DNS resolves correctly"
else
    echo "   ❌ DNS resolution issue"
fi

# 7. Test SMTP connection locally
echo "📤 Testing local SMTP connection..."
if echo "QUIT" | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null | grep "250"; then
    echo "   ✅ Local SMTP connection working"
else
    echo "   ❌ Local SMTP connection failed"
fi

# 8. Check firewall
echo "🔥 Checking firewall..."
if sudo ufw status | grep "587/tcp.*ALLOW"; then
    echo "   ✅ Port 587 is allowed in firewall"
else
    echo "   ❌ Port 587 not allowed in firewall"
fi

# 9. Check mail logs for recent activity
echo "📋 Recent mail logs..."
sudo tail -5 /var/log/mail.log | grep -E "(postfix|smtp)" || echo "   No recent mail activity"

echo ""
echo "🎯 Server Status Summary:"
echo "=========================="
echo "If all checks show ✅, your server is ready for deployment!"
echo "If any show ❌, we need to fix those issues first."
echo ""
echo "Next steps:"
echo "1. Fix any ❌ issues above"
echo "2. Deploy to Vercel with environment variables"
echo "3. Test email sending" 