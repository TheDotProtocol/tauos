#!/bin/bash

# TauOS Email Server Deployment Script
# This script deploys the complete email server infrastructure on AWS

set -e

echo "🚀 Starting TauOS Email Server deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Navigate to Terraform directory
cd "$(dirname "$0")/terraform"

echo "🔧 Initializing Terraform..."
terraform init

echo "📋 Planning Terraform deployment..."
terraform plan -out=tfplan

echo "🚀 Deploying AWS infrastructure..."
terraform apply tfplan

# Get the public IP of the email server
EMAIL_SERVER_IP=$(terraform output -raw email_server_public_ip)
INSTANCE_ID=$(terraform output -raw email_server_instance_id)

echo "✅ AWS infrastructure deployed successfully!"
echo "📧 Email server IP: $EMAIL_SERVER_IP"
echo "🆔 Instance ID: $INSTANCE_ID"

# Wait for the server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 60

# Test SSH connection
echo "🔍 Testing SSH connection..."
ssh -i ssh/tauos-email-key -o StrictHostKeyChecking=no -o ConnectTimeout=10 ubuntu@$EMAIL_SERVER_IP "echo 'SSH connection successful'"

if [ $? -eq 0 ]; then
    echo "✅ SSH connection successful!"
    
    # Copy the setup script to the server
    echo "📤 Copying setup script to server..."
    scp -i ssh/tauos-email-key scripts/email-server-setup.sh ubuntu@$EMAIL_SERVER_IP:/tmp/
    
    # Run the setup script
    echo "🔧 Running email server setup..."
    ssh -i ssh/tauos-email-key ubuntu@$EMAIL_SERVER_IP "sudo bash /tmp/email-server-setup.sh"
    
    echo "✅ Email server setup complete!"
    echo ""
    echo "🎉 TauOS Email Server is now live!"
    echo "📧 Mail Server: mail.tauos.org"
    echo "🌐 Web Interface: https://mail.tauos.org"
    echo "🔑 Test User: test@tauos.org / tauostest2024!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update DNS records in Route53"
    echo "2. Obtain SSL certificate with Let's Encrypt"
    echo "3. Test email functionality"
    echo "4. Configure TauMail web app to use this server"
    
else
    echo "❌ SSH connection failed. Please check the instance status."
    exit 1
fi 