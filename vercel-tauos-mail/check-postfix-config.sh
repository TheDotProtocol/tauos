#!/bin/bash

# Check Postfix Configuration on Google Cloud Instance
echo "🔍 Checking Postfix Configuration..."
echo "=================================================="

echo ""
echo "📋 Postfix Status:"
sudo systemctl status postfix --no-pager -l

echo ""
echo "🔧 Postfix Configuration:"
echo "myhostname: $(sudo postconf -h myhostname)"
echo "mydomain: $(sudo postconf -h mydomain)"
echo "myorigin: $(sudo postconf -h myorigin)"
echo "inet_interfaces: $(sudo postconf -h inet_interfaces)"
echo "mydestination: $(sudo postconf -h mydestination)"
echo "relay_domains: $(sudo postconf -h relay_domains)"

echo ""
echo "🔐 Authentication Settings:"
echo "smtpd_sasl_auth_enable: $(sudo postconf -h smtpd_sasl_auth_enable)"
echo "smtpd_sasl_security_options: $(sudo postconf -h smtpd_sasl_security_options)"
echo "smtpd_sasl_local_domain: $(sudo postconf -h smtpd_sasl_local_domain)"

echo ""
echo "🔒 TLS Settings:"
echo "smtpd_use_tls: $(sudo postconf -h smtpd_use_tls)"
echo "smtpd_tls_cert_file: $(sudo postconf -h smtpd_tls_cert_file)"
echo "smtpd_tls_key_file: $(sudo postconf -h smtpd_tls_key_file)"

echo ""
echo "🚪 Port Configuration:"
echo "smtpd_tls_security_level: $(sudo postconf -h smtpd_tls_security_level)"
echo "smtpd_tls_auth_only: $(sudo postconf -h smtpd_tls_auth_only)"

echo ""
echo "👥 User Authentication:"
echo "noreply user exists: $(id noreply 2>/dev/null && echo 'Yes' || echo 'No')"
echo "noreply in postfix group: $(groups noreply 2>/dev/null | grep -q postfix && echo 'Yes' || echo 'No')"

echo ""
echo "📝 Recent Mail Logs:"
sudo tail -20 /var/log/mail.log

echo ""
echo "🔍 Testing SMTP Authentication:"
echo "Testing with: noreply@tauos.org"
echo "You can test manually with:"
echo "openssl s_client -connect localhost:587 -starttls smtp"
echo "Then: AUTH LOGIN"
echo "Then base64 encoded username and password"

echo ""
echo "==================================================" 