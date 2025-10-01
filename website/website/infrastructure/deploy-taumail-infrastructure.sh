#!/bin/bash

# TauMail Infrastructure Deployment Script
# This script sets up the complete email infrastructure on AWS

set -e

echo "🚀 Starting TauMail Infrastructure Deployment..."

# Configuration
STACK_NAME="taumail-infrastructure"
REGION="us-east-1"
KEY_PAIR_NAME="taumail-key"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check AWS CLI configuration
print_status "Checking AWS CLI configuration..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Create key pair if it doesn't exist
print_status "Setting up EC2 key pair..."
if ! aws ec2 describe-key-pairs --key-names $KEY_PAIR_NAME &> /dev/null; then
    print_status "Creating key pair: $KEY_PAIR_NAME"
    aws ec2 create-key-pair --key-name $KEY_PAIR_NAME --query 'KeyMaterial' --output text > $KEY_PAIR_NAME.pem
    chmod 400 $KEY_PAIR_NAME.pem
    print_status "Key pair created and saved to $KEY_PAIR_NAME.pem"
else
    print_warning "Key pair $KEY_PAIR_NAME already exists"
fi

# Deploy CloudFormation stack
print_status "Deploying CloudFormation stack: $STACK_NAME"
aws cloudformation deploy \
    --template-file infrastructure/taumail-email-stack.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        KeyPairName=$KEY_PAIR_NAME \
        InstanceType=t3.medium \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION

# Wait for stack to complete
print_status "Waiting for stack deployment to complete..."
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $REGION

# Get stack outputs
print_status "Getting stack outputs..."
MAIL_SERVER_IP=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`MailServerPublicIP`].OutputValue' \
    --output text)

INSTANCE_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`MailServerInstanceId`].OutputValue' \
    --output text)

print_status "Mail server IP: $MAIL_SERVER_IP"
print_status "Instance ID: $INSTANCE_ID"

# Wait for instance to be ready
print_status "Waiting for EC2 instance to be ready..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $REGION

# Create configuration package
print_status "Creating mail server configuration package..."
mkdir -p /tmp/taumail-config
cp infrastructure/mail-server-docker-compose.yml /tmp/taumail-config/
cp -r local-development/taumail-local/* /tmp/taumail-config/taumail-web/

# Create configuration archive
cd /tmp
tar -czf mail-server-config.tar.gz taumail-config/
cd -

# Upload configuration to S3
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`ConfigBucketName`].OutputValue' \
    --output text)

print_status "Uploading configuration to S3 bucket: $BUCKET_NAME"
aws s3 cp /tmp/mail-server-config.tar.gz s3://$BUCKET_NAME/

# Wait for user data script to complete
print_status "Waiting for mail server setup to complete..."
sleep 120

# Test mail server connectivity
print_status "Testing mail server connectivity..."
if nc -z $MAIL_SERVER_IP 25; then
    print_status "SMTP (port 25) is accessible"
else
    print_warning "SMTP (port 25) is not accessible yet"
fi

if nc -z $MAIL_SERVER_IP 587; then
    print_status "SMTP Submission (port 587) is accessible"
else
    print_warning "SMTP Submission (port 587) is not accessible yet"
fi

if nc -z $MAIL_SERVER_IP 993; then
    print_status "IMAPS (port 993) is accessible"
else
    print_warning "IMAPS (port 993) is not accessible yet"
fi

# Generate DNS configuration
print_status "Generating DNS configuration..."
cat > dns-config-$STACK_NAME.txt << EOF
# DNS Records for TauMail Infrastructure
# Add these records to your DNS provider for tauos.org

# A Records
mail.tauos.org     A     $MAIL_SERVER_IP
smtp.tauos.org     A     $MAIL_SERVER_IP
web.mail.tauos.org A     $MAIL_SERVER_IP

# MX Records
tauos.org          MX    10 mail.tauos.org

# TXT Records (Email Authentication)
tauos.org          TXT   "v=spf1 include:_spf.tauos.org ~all"
_spf.tauos.org     TXT   "v=spf1 ip4:$MAIL_SERVER_IP ~all"

# DMARC Record
_dmarc.tauos.org   TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc@tauos.org; ruf=mailto:dmarc@tauos.org; sp=quarantine; adkim=r; aspf=r;"

# CNAME Records
www.mail.tauos.org CNAME mail.tauos.org
EOF

print_status "DNS configuration saved to dns-config-$STACK_NAME.txt"

# Generate SSL certificate commands
print_status "Generating SSL certificate setup commands..."
cat > ssl-setup-$STACK_NAME.sh << EOF
#!/bin/bash
# SSL Certificate Setup for TauMail

# Connect to the mail server
ssh -i $KEY_PAIR_NAME.pem ec2-user@$MAIL_SERVER_IP

# Install certbot
sudo yum install -y certbot

# Generate certificates
sudo certbot certonly --standalone -d mail.tauos.org -d smtp.tauos.org -d web.mail.tauos.org

# Set up auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

# Copy certificates to Docker volumes
sudo mkdir -p /opt/taumail/nginx/ssl
sudo cp /etc/letsencrypt/live/mail.tauos.org/fullchain.pem /opt/taumail/nginx/ssl/
sudo cp /etc/letsencrypt/live/mail.tauos.org/privkey.pem /opt/taumail/nginx/ssl/

# Restart nginx
cd /opt/taumail
sudo docker-compose restart nginx
EOF

chmod +x ssl-setup-$STACK_NAME.sh

print_status "SSL setup script saved to ssl-setup-$STACK_NAME.sh"

# Generate test email script
print_status "Generating test email script..."
cat > test-email-$STACK_NAME.sh << EOF
#!/bin/bash
# Test Email Sending for TauMail

echo "Testing email sending to akumartrabaajo@gmail.com..."

# Test SMTP connection
echo "Testing SMTP connection..."
telnet $MAIL_SERVER_IP 25

# Test email sending using curl
curl -X POST http://$MAIL_SERVER_IP:3001/api/emails/send \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "to": "akumartrabaajo@gmail.com",
    "subject": "TauMail Test - Independent Email Service",
    "body": "Hello from TauMail! 🚀\\n\\nThis email was sent from our independent email infrastructure running on AWS.\\n\\nFeatures:\\n✅ Independent SMTP/IMAP servers\\n✅ Privacy-first design\\n✅ Zero third-party dependencies\\n✅ Complete control over email infrastructure\\n\\nSent from: test@tauos.org\\nTo: akumartrabaajo@gmail.com\\n\\nBest regards,\\nTauMail Team"
  }'

echo "Test email sent!"
EOF

chmod +x test-email-$STACK_NAME.sh

print_status "Test email script saved to test-email-$STACK_NAME.sh"

# Final status
print_status "🎉 TauMail Infrastructure Deployment Complete!"
echo ""
echo "📋 Summary:"
echo "  • CloudFormation Stack: $STACK_NAME"
echo "  • Mail Server IP: $MAIL_SERVER_IP"
echo "  • Instance ID: $INSTANCE_ID"
echo "  • Key Pair: $KEY_PAIR_NAME.pem"
echo ""
echo "📝 Next Steps:"
echo "  1. Add DNS records from dns-config-$STACK_NAME.txt"
echo "  2. Run SSL setup: ./ssl-setup-$STACK_NAME.sh"
echo "  3. Test email sending: ./test-email-$STACK_NAME.sh"
echo "  4. Access web interface: https://mail.tauos.org"
echo ""
echo "🔧 SSH Access:"
echo "  ssh -i $KEY_PAIR_NAME.pem ec2-user@$MAIL_SERVER_IP"
echo ""
echo "📊 Monitoring:"
echo "  • CloudWatch Logs: /aws/ec2/$STACK_NAME"
echo "  • Mail server logs: /opt/taumail/logs/"
echo ""

print_status "TauMail is now running as a complete independent email service! 🚀" 