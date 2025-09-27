#!/bin/bash

# Fix DNS Routing for TauMail and TauCloud
# This script updates DNS records to point to AWS instances

set -e

echo "🔧 Fixing DNS Routing for TauMail and TauCloud..."

# Configuration
HOSTED_ZONE_ID="Z034202916UQMT8I53RRA"
MAIL_DOMAIN="mail.tauos.org"
CLOUD_DOMAIN="cloud.tauos.org"
MAIL_IP="3.85.78.66"
CLOUD_IP="3.84.217.185"

echo "📊 Current DNS Status:"
echo "mail.tauos.org → $(nslookup mail.tauos.org | grep Address | tail -1)"
echo "cloud.tauos.org → $(nslookup cloud.tauos.org | grep Address | tail -1)"

echo ""
echo "🎯 Target IPs:"
echo "mail.tauos.org → $MAIL_IP"
echo "cloud.tauos.org → $CLOUD_IP"

# Create DNS change batch
cat > dns-fix.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$MAIL_DOMAIN",
                "Type": "A",
                "TTL": 60,
                "ResourceRecords": [
                    {
                        "Value": "$MAIL_IP"
                    }
                ]
            }
        },
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$CLOUD_DOMAIN",
                "Type": "A",
                "TTL": 60,
                "ResourceRecords": [
                    {
                        "Value": "$CLOUD_IP"
                    }
                ]
            }
        }
    ]
}
EOF

echo ""
echo "🔄 Updating DNS records..."
aws route53 change-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --change-batch file://dns-fix.json

echo "✅ DNS records updated"
echo ""
echo "⏳ DNS propagation may take 5-10 minutes"
echo "🌐 You can test the changes with:"
echo "   curl -I http://$MAIL_IP"
echo "   curl -I http://$CLOUD_IP" 