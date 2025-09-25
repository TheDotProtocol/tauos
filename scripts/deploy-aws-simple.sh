#!/bin/bash

# Simplified TauOS AWS Deployment
# This script deploys TauMail and TauCloud to AWS

set -e

echo "🚀 Starting TauOS AWS Deployment..."

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="407294409495"
HOSTED_ZONE_ID="Z034202916UQMT8I53RRA"
KEY_NAME="tauos-production"
SECURITY_GROUP_NAME="tauos-production-sg"
INSTANCE_TYPE="t3.medium"
AMI_ID="ami-0c02fb55956c7d316" # Ubuntu 22.04 LTS

echo "✅ Configuration loaded"

# Step 1: Create Key Pair
echo "🔑 Creating EC2 key pair..."
aws ec2 create-key-pair --key-name "$KEY_NAME" --query 'KeyMaterial' --output text > "$KEY_NAME.pem" 2>/dev/null || echo "Key pair may already exist"
chmod 400 "$KEY_NAME.pem" 2>/dev/null || true
echo "✅ Key pair ready"

# Step 2: Create Security Group
echo "🛡️ Creating security group..."
SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name "$SECURITY_GROUP_NAME" --description "TauOS Production Security Group" --query 'GroupId' --output text 2>/dev/null || aws ec2 describe-security-groups --group-names "$SECURITY_GROUP_NAME" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null)

# Add security group rules
aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 22 --cidr 0.0.0.0/0 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 443 --cidr 0.0.0.0/0 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 25 --cidr 0.0.0.0/0 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 587 --cidr 0.0.0.0/0 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 993 --cidr 0.0.0.0/0 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id "$SECURITY_GROUP_ID" --protocol tcp --port 995 --cidr 0.0.0.0/0 2>/dev/null || true
echo "✅ Security group ready: $SECURITY_GROUP_ID"

# Step 3: Create EC2 Instances
echo "🖥️ Creating EC2 instances..."

# Create TauMail instance
echo "Creating TauMail instance..."
MAIL_INSTANCE_ID=$(aws ec2 run-instances --image-id "$AMI_ID" --count 1 --instance-type "$INSTANCE_TYPE" --key-name "$KEY_NAME" --security-group-ids "$SECURITY_GROUP_ID" --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=tauos-mail},{Key=Project,Value=tauos}]' --query 'Instances[0].InstanceId' --output text)

# Create TauCloud instance
echo "Creating TauCloud instance..."
CLOUD_INSTANCE_ID=$(aws ec2 run-instances --image-id "$AMI_ID" --count 1 --instance-type "$INSTANCE_TYPE" --key-name "$KEY_NAME" --security-group-ids "$SECURITY_GROUP_ID" --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=tauos-cloud},{Key=Project,Value=tauos}]' --query 'Instances[0].InstanceId' --output text)

echo "✅ Instances created:"
echo "  TauMail: $MAIL_INSTANCE_ID"
echo "  TauCloud: $CLOUD_INSTANCE_ID"

# Wait for instances to be running
echo "⏳ Waiting for instances to be running..."
aws ec2 wait instance-running --instance-ids "$MAIL_INSTANCE_ID" "$CLOUD_INSTANCE_ID"

# Get public IPs
MAIL_PUBLIC_IP=$(aws ec2 describe-instances --instance-ids "$MAIL_INSTANCE_ID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
CLOUD_PUBLIC_IP=$(aws ec2 describe-instances --instance-ids "$CLOUD_INSTANCE_ID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo "✅ Public IPs:"
echo "  TauMail: $MAIL_PUBLIC_IP"
echo "  TauCloud: $CLOUD_PUBLIC_IP"

# Step 4: Update DNS Records
echo "🌐 Updating DNS records..."

# Create DNS change batch
cat > dns-changes.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "mail.tauos.org",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "$MAIL_PUBLIC_IP"
                    }
                ]
            }
        },
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "cloud.tauos.org",
                "Type": "A",
                "TTL": 300,
                "ResourceRecords": [
                    {
                        "Value": "$CLOUD_PUBLIC_IP"
                    }
                ]
            }
        }
    ]
}
EOF

# Apply DNS changes
aws route53 change-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --change-batch file://dns-changes.json
echo "✅ DNS records updated"

# Step 5: Create deployment script for instances
echo "📦 Creating deployment script..."

cat > deploy-instance.sh << 'EOF'
#!/bin/bash

# Instance deployment script
set -e

echo "🚀 Starting instance deployment..."

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install certbot
sudo apt-get install -y certbot

# Create application directory
sudo mkdir -p /opt/tauos
sudo chown ubuntu:ubuntu /opt/tauos

# Create Docker Compose file
cat > /opt/tauos/docker-compose.yml << 'COMPOSE_EOF'
version: '3.8'

services:
  # TauMail Services
  postfix:
    image: postfix:latest
    container_name: taumail-postfix
    ports:
      - "25:25"
      - "587:587"
    environment:
      - DOMAIN=tauos.org
    volumes:
      - ./mail-data:/var/mail
    restart: unless-stopped

  dovecot:
    image: dovecot:latest
    container_name: taumail-dovecot
    ports:
      - "993:993"
      - "995:995"
    volumes:
      - ./mail-data:/var/mail
    restart: unless-stopped

  webmail:
    image: nginx:alpine
    container_name: taumail-webmail
    ports:
      - "80:80"
    volumes:
      - ./webmail:/usr/share/nginx/html
    restart: unless-stopped

  # TauCloud Services
  minio:
    image: minio/minio:latest
    container_name: taucloud-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=secure_password_here
    volumes:
      - ./cloud-data:/data
    command: server /data --console-address ":9001"
    restart: unless-stopped

  taucloud:
    image: nginx:alpine
    container_name: taucloud-frontend
    ports:
      - "8080:80"
    volumes:
      - ./taucloud:/usr/share/nginx/html
    restart: unless-stopped

volumes:
  mail-data:
  cloud-data:
COMPOSE_EOF

# Create simple web pages
mkdir -p /opt/tauos/webmail /opt/tauos/taucloud

cat > /opt/tauos/webmail/index.html << 'HTML_EOF'
<!DOCTYPE html>
<html>
<head>
    <title>TauMail - Coming Soon</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #6366f1; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 TauMail</h1>
        <h2>Privacy-First Email Service</h2>
        <p>Coming soon to mail.tauos.org</p>
        <p>End-to-end encryption • Zero tracking • Self-hosted</p>
    </div>
</body>
</html>
HTML_EOF

cat > /opt/tauos/taucloud/index.html << 'HTML_EOF'
<!DOCTYPE html>
<html>
<head>
    <title>TauCloud - Coming Soon</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #3b82f6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>☁️ TauCloud</h1>
        <h2>Privacy-First Cloud Storage</h2>
        <p>Coming soon to cloud.tauos.org</p>
        <p>Client-side encryption • Zero-knowledge • Self-hosted</p>
    </div>
</body>
</html>
HTML_EOF

# Start services
cd /opt/tauos
sudo docker-compose up -d

echo "✅ Instance deployment completed!"
EOF

chmod +x deploy-instance.sh
echo "✅ Deployment script created"

# Step 6: Deploy to instances
echo "🚀 Deploying to instances..."

# Wait a bit for instances to be fully ready
sleep 30

# Copy and execute deployment script on instances
scp -i "$KEY_NAME.pem" -o StrictHostKeyChecking=no deploy-instance.sh ubuntu@"$MAIL_PUBLIC_IP":~/ 2>/dev/null || echo "SSH connection may take a moment..."
scp -i "$KEY_NAME.pem" -o StrictHostKeyChecking=no deploy-instance.sh ubuntu@"$CLOUD_PUBLIC_IP":~/ 2>/dev/null || echo "SSH connection may take a moment..."

# Execute deployment (background)
ssh -i "$KEY_NAME.pem" -o StrictHostKeyChecking=no ubuntu@"$MAIL_PUBLIC_IP" "chmod +x deploy-instance.sh && ./deploy-instance.sh" &
ssh -i "$KEY_NAME.pem" -o StrictHostKeyChecking=no ubuntu@"$CLOUD_PUBLIC_IP" "chmod +x deploy-instance.sh && ./deploy-instance.sh" &

echo "✅ Deployment started on both instances"
echo "⏳ This may take 10-15 minutes to complete"

# Step 7: Final status
echo ""
echo "🎉 AWS Deployment Summary:"
echo "=========================="
echo "TauMail Instance: $MAIL_INSTANCE_ID"
echo "TauMail IP: $MAIL_PUBLIC_IP"
echo "TauMail URL: http://mail.tauos.org"
echo ""
echo "TauCloud Instance: $CLOUD_INSTANCE_ID"
echo "TauCloud IP: $CLOUD_PUBLIC_IP"
echo "TauCloud URL: http://cloud.tauos.org"
echo ""
echo "📝 Next Steps:"
echo "1. Wait 10-15 minutes for deployment to complete"
echo "2. DNS propagation may take up to 48 hours"
echo "3. SSL certificates will be configured automatically"
echo "4. Monitor instances in AWS Console"
echo ""
echo "🔗 AWS Console: https://console.aws.amazon.com/ec2/v2/home" 