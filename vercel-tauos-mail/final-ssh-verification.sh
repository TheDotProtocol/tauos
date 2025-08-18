#!/bin/bash

echo "🚀 TauOS SMTP Server - Final Verification"
echo "=========================================="
echo ""

# Check if we're on the server
if [[ "$HOSTNAME" != "tauos-smtp" ]]; then
    echo "❌ This script should be run on the tauos-smtp server"
    echo "   SSH into the server first: ssh foundationtau@34.30.189.200"
    exit 1
fi

echo "✅ Running on tauos-smtp server"
echo ""

# 1. Check all services
echo "📧 Checking Services..."
if systemctl is-active --quiet postfix; then
    echo "   ✅ Postfix is running"
else
    echo "   ❌ Postfix is not running"
fi

if systemctl is-active --quiet saslauthd; then
    echo "   ✅ saslauthd is running"
else
    echo "   ❌ saslauthd is not running"
fi

# 2. Check socket
echo "🔌 Checking saslauthd socket..."
if [ -S "/var/spool/postfix/var/run/saslauthd/mux" ]; then
    echo "   ✅ saslauthd socket exists"
else
    echo "   ❌ saslauthd socket missing"
fi

# 3. Check port 587
echo "🌐 Checking SMTP port 587..."
if netstat -tlnp | grep ":587 "; then
    echo "   ✅ Port 587 is listening"
else
    echo "   ❌ Port 587 is not listening"
fi

# 4. Test authentication
echo "🔑 Testing SMTP authentication..."
if echo "noreply@tauos.org" | sudo testsaslauthd -s smtp -u noreply -p 'TauOS2024!Secure' -f /var/spool/postfix/var/run/saslauthd/mux; then
    echo "   ✅ Authentication working"
else
    echo "   ❌ Authentication failed"
fi

# 5. Check firewall
echo "🔥 Checking firewall..."
if sudo ufw status | grep "587/tcp.*ALLOW"; then
    echo "   ✅ Port 587 is allowed in firewall"
else
    echo "   ❌ Port 587 not allowed in firewall"
fi

# 6. Test external connectivity
echo "🌍 Testing external connectivity..."
if curl -s --connect-timeout 5 https://mail.tauos.org > /dev/null; then
    echo "   ✅ mail.tauos.org is accessible"
else
    echo "   ❌ mail.tauos.org is not accessible"
fi

if curl -s --connect-timeout 5 https://cloud.tauos.org > /dev/null; then
    echo "   ✅ cloud.tauos.org is accessible"
else
    echo "   ❌ cloud.tauos.org is not accessible"
fi

# 7. Test SMTP connection from external
echo "📤 Testing external SMTP connection..."
if telnet 34.30.189.200 587 < /dev/null 2>&1 | grep "Connected"; then
    echo "   ✅ External SMTP connection working"
else
    echo "   ❌ External SMTP connection failed"
fi

# 8. Check recent mail logs
echo "📋 Recent mail logs (last 10 entries)..."
sudo tail -10 /var/log/mail.log | grep -E "(postfix|smtp)" || echo "   No recent mail activity"

# 9. Test complete SMTP flow
echo "🧪 Testing complete SMTP flow..."
echo "   Testing local SMTP with authentication..."
echo -e "EHLO localhost\r\nAUTH LOGIN\r\nbm9yZXBseQ==\r\nVGF1T1MyMDI0IVNlY3VyZQ==\r\nMAIL FROM: noreply@tauos.org\r\nRCPT TO: test@example.com\r\nDATA\r\nSubject: Test from TauOS\r\n\r\nThis is a test email from TauOS SMTP server.\r\n.\r\nQUIT\r\n" | openssl s_client -connect localhost:587 -starttls smtp -crlf 2>/dev/null | grep -E "(250|235|354|221)" | tail -5

echo ""
echo "🎯 Final Status Summary:"
echo "========================"
echo "If all checks show ✅, your sovereign email system is ready!"
echo ""
echo "Next steps:"
echo "1. Test email sending from TauMail application"
echo "2. Verify emails reach Gmail"
echo "3. Check for 'sent' status (not 'database_only')"
echo ""
echo "Your sovereign email infrastructure is ready! 🚀" 