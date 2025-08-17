#!/bin/bash

# Comprehensive Email Delivery Check for TauOS Mail Server
echo "🔍 Comprehensive Email Delivery Check for TauOS Mail Server"
echo "=========================================================="

echo ""
echo "🌐 DNS Records Check:"
echo "-------------------"
echo "A Record for tauos.org:"
dig +short tauos.org A

echo ""
echo "MX Record for tauos.org:"
dig +short tauos.org MX

echo ""
echo "SPF Record for tauos.org:"
dig +short tauos.org TXT | grep -i spf

echo ""
echo "DKIM Record for tauos.org:"
dig +short tauos.org TXT | grep -i dkim

echo ""
echo "DMARC Record for tauos.org:"
dig +short _dmarc.tauos.org TXT

echo ""
echo "📧 Mail Server Configuration:"
echo "----------------------------"
echo "Postfix main.cf settings:"
sudo postconf -n | grep -E "(myhostname|mydomain|myorigin|inet_interfaces|mynetworks)"

echo ""
echo "🔍 Reverse DNS for 34.30.189.200:"
dig +short -x 34.30.189.200

echo ""
echo "📊 Mail Server Reputation Check:"
echo "-------------------------------"
echo "Checking if IP is blacklisted:"
dig +short 34.30.189.200.zen.spamhaus.org
dig +short 34.30.189.200.bl.spamcop.net

echo ""
echo "📧 Recent Mail Logs:"
echo "-------------------"
sudo tail -10 /var/log/mail.log

echo ""
echo "🔍 Gmail-specific delivery check:"
echo "--------------------------------"
echo "Testing connection to Gmail SMTP:"
echo "QUIT" | openssl s_client -connect gmail-smtp-in.l.google.com:25 -crlf 2>/dev/null | head -5 