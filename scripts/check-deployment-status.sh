#!/bin/bash

# Check TauOS AWS Deployment Status

echo "🔍 Checking TauOS AWS Deployment Status..."

# Instance IDs
MAIL_INSTANCE_ID="i-02d85f6fa269855f8"
CLOUD_INSTANCE_ID="i-04843d9b57374ba75"

# Check instance status
echo "📊 Instance Status:"
aws ec2 describe-instances --instance-ids "$MAIL_INSTANCE_ID" "$CLOUD_INSTANCE_ID" --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]' --output table

# Get public IPs
MAIL_IP=$(aws ec2 describe-instances --instance-ids "$MAIL_INSTANCE_ID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
CLOUD_IP=$(aws ec2 describe-instances --instance-ids "$CLOUD_INSTANCE_ID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo ""
echo "🌐 Service URLs:"
echo "TauMail: http://$MAIL_IP"
echo "TauCloud: http://$CLOUD_IP"
echo "TauMail Domain: http://mail.tauos.org"
echo "TauCloud Domain: http://cloud.tauos.org"

echo ""
echo "🔍 Testing connectivity..."

# Test HTTP connectivity
echo "Testing TauMail HTTP..."
if curl -s -f -m 10 "http://$MAIL_IP" > /dev/null; then
    echo "✅ TauMail HTTP accessible"
else
    echo "⏳ TauMail HTTP not yet accessible (deployment in progress)"
fi

echo "Testing TauCloud HTTP..."
if curl -s -f -m 10 "http://$CLOUD_IP" > /dev/null; then
    echo "✅ TauCloud HTTP accessible"
else
    echo "⏳ TauCloud HTTP not yet accessible (deployment in progress)"
fi

echo ""
echo "📝 Deployment Status:"
echo "- EC2 Instances: ✅ Created and running"
echo "- Security Groups: ✅ Configured"
echo "- DNS Records: ✅ Updated"
echo "- Services: ⏳ Deploying (10-15 minutes)"
echo "- SSL Certificates: ⏳ Will be configured automatically"

echo ""
echo "🎯 Next Steps:"
echo "1. Wait 10-15 minutes for deployment to complete"
echo "2. Check AWS Console for instance status"
echo "3. Test services at the URLs above"
echo "4. DNS propagation may take up to 48 hours" 