#!/bin/bash

# Check and Fix Required Files and Folders
echo "🔍 Checking Required Files and Folders..."
echo "=========================================="

echo ""
echo "📧 Checking saslauthd configuration..."
echo "File: /etc/default/saslauthd"
if [ -f /etc/default/saslauthd ]; then
    cat /etc/default/saslauthd
else
    echo "❌ MISSING: /etc/default/saslauthd"
fi

echo ""
echo "📧 Checking saslauthd directory..."
echo "Directory: /var/spool/postfix/var/run/saslauthd"
if [ -d /var/spool/postfix/var/run/saslauthd ]; then
    ls -la /var/spool/postfix/var/run/saslauthd/
else
    echo "❌ MISSING: /var/spool/postfix/var/run/saslauthd"
fi

echo ""
echo "🔐 Checking PAM configuration..."
echo "File: /etc/pam.d/smtp"
if [ -f /etc/pam.d/smtp ]; then
    cat /etc/pam.d/smtp
else
    echo "❌ MISSING: /etc/pam.d/smtp"
fi

echo ""
echo "📧 Checking SASL configuration..."
echo "File: /etc/postfix/sasl/smtpd.conf"
if [ -f /etc/postfix/sasl/smtpd.conf ]; then
    cat /etc/postfix/sasl/smtpd.conf
else
    echo "❌ MISSING: /etc/postfix/sasl/smtpd.conf"
fi

echo ""
echo "📧 Checking password file..."
echo "File: /etc/postfix/sasl_passwd"
if [ -f /etc/postfix/sasl_passwd ]; then
    cat /etc/postfix/sasl_passwd
else
    echo "❌ MISSING: /etc/postfix/sasl_passwd"
fi

echo ""
echo "📧 Checking aliases file..."
echo "File: /etc/aliases (noreply entries)"
if [ -f /etc/aliases ]; then
    grep noreply /etc/aliases || echo "❌ No noreply entries found"
else
    echo "❌ MISSING: /etc/aliases"
fi

echo ""
echo "👤 Checking user account..."
echo "User: noreply"
if id noreply >/dev/null 2>&1; then
    id noreply
else
    echo "❌ MISSING: noreply user"
fi

echo ""
echo "📧 Checking saslauthd service status..."
sudo systemctl status saslauthd --no-pager -l

echo ""
echo "📧 Checking saslauthd process..."
ps aux | grep saslauthd

echo ""
echo "📧 Checking saslauthd logs..."
sudo journalctl -u saslauthd --no-pager -l | tail -10

echo ""
echo "🔍 Now let's fix any missing files..."
echo "=====================================" 