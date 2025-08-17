#!/bin/bash

# Test DNS Propagation for TauOS Mail Server
echo "🔍 Testing DNS Propagation for TauOS Mail Server"
echo "================================================"

echo ""
echo "🌐 Testing from local server:"
echo "----------------------------"
echo "MX Record for tauos.org:"
dig +short tauos.org MX

echo ""
echo "A Record for mailserver.tauos.org:"
dig +short mailserver.tauos.org A

echo ""
echo "🌐 Testing from Google DNS (8.8.8.8):"
echo "-----------------------------------"
echo "MX Record for tauos.org:"
dig +short @8.8.8.8 tauos.org MX

echo ""
echo "A Record for mailserver.tauos.org:"
dig +short @8.8.8.8 mailserver.tauos.org A

echo ""
echo "🌐 Testing from Cloudflare DNS (1.1.1.1):"
echo "----------------------------------------"
echo "MX Record for tauos.org:"
dig +short @1.1.1.1 tauos.org MX

echo ""
echo "A Record for mailserver.tauos.org:"
dig +short @1.1.1.1 mailserver.tauos.org A

echo ""
echo "🌐 Testing from OpenDNS (208.67.222.222):"
echo "----------------------------------------"
echo "MX Record for tauos.org:"
dig +short @208.67.222.222 tauos.org MX

echo ""
echo "A Record for mailserver.tauos.org:"
dig +short @208.67.222.222 mailserver.tauos.org A

echo ""
echo "📧 Testing SMTP connection with domain:"
echo "-------------------------------------"
echo "Testing connection to mailserver.tauos.org:587"
timeout 10 openssl s_client -connect mailserver.tauos.org:587 -starttls smtp 2>/dev/null | head -5

echo ""
echo "🔍 Checking if records are cached locally:"
echo "-----------------------------------------"
nslookup tauos.org
nslookup mailserver.tauos.org 