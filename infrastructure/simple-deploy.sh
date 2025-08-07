#!/bin/bash

# Simple EC2 Deployment for TauMail
set -e

echo "🚀 Starting Simple TauMail EC2 Deployment..."

# Configuration
KEY_PAIR_NAME="taumail-key"
INSTANCE_TYPE="t3.medium"
REGION="us-east-1"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check AWS CLI
print_status "Checking AWS CLI configuration..."
if ! aws ec2 describe-regions --region $REGION &> /dev/null; then
    echo "❌ AWS CLI not configured properly"
    exit 1
fi

print_status "✅ AWS CLI configured successfully"

# Create key pair
print_status "Setting up EC2 key pair..."
if ! aws ec2 describe-key-pairs --key-names $KEY_PAIR_NAME --region $REGION &> /dev/null; then
    print_status "Creating key pair: $KEY_PAIR_NAME"
    aws ec2 create-key-pair --key-name $KEY_PAIR_NAME --region $REGION --query 'KeyMaterial' --output text > $KEY_PAIR_NAME.pem
    chmod 400 $KEY_PAIR_NAME.pem
    print_status "Key pair created and saved to $KEY_PAIR_NAME.pem"
else
    print_warning "Key pair $KEY_PAIR_NAME already exists"
fi

# Create security group
print_status "Creating security group..."
SG_NAME="taumail-mail-server-sg"
SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$SG_NAME" --region $REGION --query 'SecurityGroups[0].GroupId' --output text)

if [ "$SG_ID" == "None" ] || [ -z "$SG_ID" ]; then
    print_status "Creating security group: $SG_NAME"
    SG_ID=$(aws ec2 create-security-group --group-name $SG_NAME --description "Security group for TauMail email server" --region $REGION --query 'GroupId' --output text)
    
    # Add inbound rules
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 25 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 587 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 465 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 143 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 993 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 110 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 995 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0 --region $REGION
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 3001 --cidr 0.0.0.0/0 --region $REGION
    
    print_status "Security group created: $SG_ID"
else
    print_warning "Security group already exists: $SG_ID"
fi

# Get latest Amazon Linux 2 AMI
print_status "Getting latest Amazon Linux 2 AMI..."
AMI_ID=$(aws ec2 describe-images --owners amazon --filters "Name=name,Values=amzn2-ami-hvm-*-x86_64-gp2" "Name=state,Values=available" --query 'sort_by(Images, &CreationDate)[-1].ImageId' --output text --region $REGION)

print_status "Using AMI: $AMI_ID"

# Launch EC2 instance
print_status "Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_PAIR_NAME \
    --security-group-ids $SG_ID \
    --region $REGION \
    --query 'Instances[0].InstanceId' \
    --output text)

print_status "Instance launched: $INSTANCE_ID"

# Wait for instance to be running
print_status "Waiting for instance to be running..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $REGION

# Get public IP
print_status "Getting public IP..."
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --region $REGION \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

print_status "Public IP: $PUBLIC_IP"

# Generate DNS configuration
print_status "Generating DNS configuration..."
cat > dns-config-simple.txt << EOF
# DNS Records for TauMail Infrastructure
# Add these records to your DNS provider for tauos.org

# A Records
mail.tauos.org     A     $PUBLIC_IP
smtp.tauos.org     A     $PUBLIC_IP
web.mail.tauos.org A     $PUBLIC_IP

# MX Records
tauos.org          MX    10 mail.tauos.org

# TXT Records (Email Authentication)
tauos.org          TXT   "v=spf1 include:_spf.tauos.org ~all"
_spf.tauos.org     TXT   "v=spf1 ip4:$PUBLIC_IP ~all"

# DMARC Record
_dmarc.tauos.org   TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc@tauos.org; ruf=mailto:dmarc@tauos.org; sp=quarantine; adkim=r; aspf=r;"

# CNAME Records
www.mail.tauos.org CNAME mail.tauos.org
EOF

# Generate setup instructions
cat > setup-instructions.txt << EOF
# TauMail EC2 Setup Instructions

## Instance Details:
- Instance ID: $INSTANCE_ID
- Public IP: $PUBLIC_IP
- Key Pair: $KEY_PAIR_NAME.pem

## Next Steps:

1. SSH into the instance:
   ssh -i $KEY_PAIR_NAME.pem ec2-user@$PUBLIC_IP

2. Install Docker and setup:
   sudo yum update -y
   sudo yum install -y docker git
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user

3. Install Docker Compose:
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose

4. Upload deployment package:
   scp -i $KEY_PAIR_NAME.pem infrastructure/taumail-deployment.tar.gz ec2-user@$PUBLIC_IP:~/

5. Extract and setup:
   mkdir -p /opt/taumail
   cd /opt/taumail
   tar -xzf ~/taumail-deployment.tar.gz
   docker-compose up -d

6. Test web interface:
   http://$PUBLIC_IP:3001

7. Add DNS records from dns-config-simple.txt

## Test Email Command:
curl -X POST http://$PUBLIC_IP:3001/api/emails/send \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "to": "akumartrabaajo@gmail.com",
    "subject": "TauMail Test",
    "body": "Hello from TauMail!"
  }'
EOF

print_status "🎉 EC2 Instance Created Successfully!"
echo ""
echo "📋 Summary:"
echo "  • Instance ID: $INSTANCE_ID"
echo "  • Public IP: $PUBLIC_IP"
echo "  • Key Pair: $KEY_PAIR_NAME.pem"
echo ""
echo "📝 Next Steps:"
echo "  1. Follow instructions in setup-instructions.txt"
echo "  2. Add DNS records from dns-config-simple.txt"
echo "  3. Test web interface: http://$PUBLIC_IP:3001"
echo ""
echo "🔧 SSH Access:"
echo "  ssh -i $KEY_PAIR_NAME.pem ec2-user@$PUBLIC_IP"
echo ""

print_status "TauMail infrastructure is ready for setup! 🚀" 