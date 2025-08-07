#!/bin/bash

# Test TauMail Email Sending
echo "🧪 Testing TauMail Email Sending..."

# Get instance IP from user
read -p "Enter your EC2 instance IP: " INSTANCE_IP

if [ -z "$INSTANCE_IP" ]; then
    echo "❌ No IP provided"
    exit 1
fi

echo "📧 Testing email sending to akumartrabaajo@gmail.com..."

# Test SMTP connection
echo "🔌 Testing SMTP connection..."
if nc -z $INSTANCE_IP 25; then
    echo "✅ SMTP (port 25) is accessible"
else
    echo "❌ SMTP (port 25) is not accessible"
fi

if nc -z $INSTANCE_IP 587; then
    echo "✅ SMTP Submission (port 587) is accessible"
else
    echo "❌ SMTP Submission (port 587) is not accessible"
fi

# Test web interface
echo "🌐 Testing web interface..."
if curl -s http://$INSTANCE_IP:3001/health > /dev/null; then
    echo "✅ Web interface is accessible"
else
    echo "❌ Web interface is not accessible"
fi

echo ""
echo "📝 To test email sending manually:"
echo "1. Register a user: curl -X POST http://$INSTANCE_IP:3001/api/auth/register -H 'Content-Type: application/json' -d '{\"username\": \"testuser\", \"email\": \"testuser@tauos.org\", \"password\": \"password\"}'"
echo "2. Send email: curl -X POST http://$INSTANCE_IP:3001/api/emails/send -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_TOKEN' -d '{\"to\": \"akumartrabaajo@gmail.com\", \"subject\": \"Test\", \"body\": \"Hello from TauMail!\"}'"
echo ""
echo "🌐 Access web interface: http://$INSTANCE_IP:3001"
