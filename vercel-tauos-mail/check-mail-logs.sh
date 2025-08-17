#!/bin/bash

# Check Mail Logs for Email Delivery Issues
echo "📧 Checking mail logs for delivery issues..."

echo ""
echo "🔍 Recent mail log entries:"
sudo tail -20 /var/log/mail.log

echo ""
echo "📋 Checking Postfix queue:"
sudo mailq

echo ""
echo "🔍 Checking for specific email delivery:"
sudo grep -i "noreply@tauos.org" /var/log/mail.log | tail -10

echo ""
echo "📧 Checking SMTP authentication logs:"
sudo grep -i "smtp" /var/log/mail.log | tail -10

echo ""
echo "🔍 Checking for any errors:"
sudo grep -i "error\|failed\|reject" /var/log/mail.log | tail -10 