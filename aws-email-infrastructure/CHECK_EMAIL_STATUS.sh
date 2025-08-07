#!/bin/bash

echo "🔍 Checking Email Server Status..."
echo "=================================="

# Check if Postfix is running
echo "📧 Step 1: Checking Postfix status..."
sudo systemctl status postfix --no-pager

# Check mail queue
echo ""
echo "📋 Step 2: Checking mail queue..."
sudo mailq

# Check mail logs
echo ""
echo "📝 Step 3: Checking recent mail logs..."
sudo tail -20 /var/log/maillog

# Check if sendmail is working
echo ""
echo "🧪 Step 4: Testing sendmail directly..."
echo "Subject: Test from TauOS Email Server" | sendmail -f "superuser@tauos.org" "akumartrabaajo@gmail.com"

# Check mail queue again
echo ""
echo "📋 Step 5: Checking mail queue after test..."
sudo mailq

# Check if emails are being processed
echo ""
echo "📊 Step 6: Checking if emails are being sent..."
sudo tail -f /var/log/maillog &
TAIL_PID=$!

echo "Watching mail logs for 10 seconds..."
sleep 10
kill $TAIL_PID

# Check DNS resolution
echo ""
echo "🌐 Step 7: Checking DNS resolution..."
nslookup smtptauos.tauos.org
nslookup imaptauos.tauos.org

# Check external connectivity
echo ""
echo "🌍 Step 8: Checking external connectivity..."
nc -zv 54.156.132.149 587
nc -zv 54.156.132.149 993

echo ""
echo "✅ Email server status check completed!" 