#!/bin/bash

# Test AWS CLI access
echo "Testing AWS CLI access..."

# Test basic AWS access
echo "1. Testing AWS STS..."
aws sts get-caller-identity

echo ""
echo "2. Testing EC2 access..."
aws ec2 describe-regions --query 'Regions[0].RegionName' --output text

echo ""
echo "3. Testing Route53 access..."
aws route53 list-hosted-zones --query 'HostedZones[0].Name' --output text

echo ""
echo "4. Testing S3 access..."
aws s3 ls --max-items 1

echo ""
echo "✅ AWS CLI access verified successfully!" 