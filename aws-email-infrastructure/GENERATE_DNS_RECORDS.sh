#!/bin/bash

echo "🌐 Generating DNS Records for AWS SES"
echo "===================================="

# Get domain verification token
echo "📋 Step 1: Getting domain verification token..."
DOMAIN_VERIFICATION=$(aws ses verify-domain-identity --domain tauos.org --region us-east-1 --query 'VerificationToken' --output text)

# Get DKIM tokens
echo "🔐 Step 2: Getting DKIM tokens..."
DKIM_TOKENS=$(aws ses verify-domain-dkim --domain tauos.org --region us-east-1 --query 'DkimTokens' --output text)

# Parse DKIM tokens
DKIM_TOKEN_1=$(echo $DKIM_TOKENS | cut -d' ' -f1)
DKIM_TOKEN_2=$(echo $DKIM_TOKENS | cut -d' ' -f2)
DKIM_TOKEN_3=$(echo $DKIM_TOKENS | cut -d' ' -f3)

echo ""
echo "📋 DNS RECORDS TO ADD TO CLOUDFLARE:"
echo "===================================="

echo ""
echo "1. DOMAIN VERIFICATION (TXT Record):"
echo "   Name: _amazonses.tauos.org"
echo "   Type: TXT"
echo "   Value: $DOMAIN_VERIFICATION"
echo "   TTL: 300"

echo ""
echo "2. DKIM RECORDS (CNAME Records):"
echo "   Name: $DKIM_TOKEN_1._domainkey.tauos.org"
echo "   Type: CNAME"
echo "   Value: $DKIM_TOKEN_1.dkim.amazonses.com"
echo "   TTL: 300"
echo ""
echo "   Name: $DKIM_TOKEN_2._domainkey.tauos.org"
echo "   Type: CNAME"
echo "   Value: $DKIM_TOKEN_2.dkim.amazonses.com"
echo "   TTL: 300"
echo ""
echo "   Name: $DKIM_TOKEN_3._domainkey.tauos.org"
echo "   Type: CNAME"
echo "   Value: $DKIM_TOKEN_3.dkim.amazonses.com"
echo "   TTL: 300"

echo ""
echo "3. SPF RECORD (TXT Record):"
echo "   Name: tauos.org"
echo "   Type: TXT"
echo "   Value: v=spf1 include:amazonses.com ~all"
echo "   TTL: 300"

echo ""
echo "4. DMARC RECORD (TXT Record):"
echo "   Name: _dmarc.tauos.org"
echo "   Type: TXT"
echo "   Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@tauos.org; ruf=mailto:dmarc@tauos.org; sp=quarantine; adkim=r; aspf=r;"
echo "   TTL: 300"

echo ""
echo "5. REVERSE DNS (PTR Record):"
echo "   Note: This needs to be set up with your hosting provider"
echo "   IP: 54.156.132.149"
echo "   PTR: mail.tauos.org"

echo ""
echo "✅ DNS records generated!"
echo "📧 Add these records to Cloudflare DNS for tauos.org" 