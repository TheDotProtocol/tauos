#!/bin/bash

# TauOS AWS Production Deployment Script
# Deploys TauMail and TauCloud to AWS with full production setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="407294409495"
HOSTED_ZONE_ID="Z034202916UQMT8I53RRA"
DOMAIN="tauos.org"
MAIL_DOMAIN="mail.tauos.org"
CLOUD_DOMAIN="cloud.tauos.org"

# Instance specifications
INSTANCE_TYPE="t3.medium"
AMI_ID="ami-0c02fb55956c7d316" # Ubuntu 22.04 LTS
KEY_NAME="tauos-production"
SECURITY_GROUP_NAME="tauos-production-sg"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Function to check AWS CLI
check_aws_cli() {
    print_info "Checking AWS CLI configuration..."
    
    if ! aws sts get-caller-identity > /dev/null 2>&1; then
        print_error "AWS CLI not configured or credentials invalid"
        exit 1
    fi
    
    print_status "AWS CLI configured successfully"
}

# Function to create EC2 key pair
create_key_pair() {
    print_info "Creating EC2 key pair..."
    
    if ! aws ec2 describe-key-pairs --key-names "$KEY_NAME" > /dev/null 2>&1; then
        aws ec2 create-key-pair --key-name "$KEY_NAME" --query 'KeyMaterial' --output text > "$KEY_NAME.pem"
        chmod 400 "$KEY_NAME.pem"
        print_status "Key pair created: $KEY_NAME.pem"
    else
        print_warning "Key pair $KEY_NAME already exists"
    fi
}

# Function to create security group
create_security_group() {
    print_info "Creating security group..."
    
    # Check if security group exists
    if ! aws ec2 describe-security-groups --group-names "$SECURITY_GROUP_NAME" > /dev/null 2>&1; then
        # Create security group
        SECURITY_GROUP_ID=$(aws ec2 create-security-group \
            --group-name "$SECURITY_GROUP_NAME" \
            --description "TauOS Production Security Group" \
            --query 'GroupId' --output text)
        
        # Add inbound rules
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp --port 22 --cidr 0.0.0.0/0
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp --port 80 --cidr 0.0.0.0/0
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp --port 443 --cidr 0.0.0.0/0
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp --port 25 --cidr 0.0.0.0/0
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp --port 587 --cidr 0.0.0.0/0
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp --port 993 --cidr 0.0.0.0/0
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp --port 995 --cidr 0.0.0.0/0
        
        print_status "Security group created: $SECURITY_GROUP_ID"
    else
        SECURITY_GROUP_ID=$(aws ec2 describe-security-groups \
            --group-names "$SECURITY_GROUP_NAME" \
            --query 'SecurityGroups[0].GroupId' --output text)
        print_warning "Security group $SECURITY_GROUP_NAME already exists: $SECURITY_GROUP_ID"
    fi
}

# Function to create EC2 instances
create_instances() {
    print_info "Creating EC2 instances..."
    
    # Create TauMail instance
    print_info "Creating TauMail instance..."
    MAIL_INSTANCE_ID=$(aws ec2 run-instances \
        --image-id "$AMI_ID" \
        --count 1 \
        --instance-type "$INSTANCE_TYPE" \
        --key-name "$KEY_NAME" \
        --security-group-ids "$SECURITY_GROUP_ID" \
        --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=tauos-mail},{Key=Project,Value=tauos}]' \
        --query 'Instances[0].InstanceId' --output text)
    
    # Create TauCloud instance
    print_info "Creating TauCloud instance..."
    CLOUD_INSTANCE_ID=$(aws ec2 run-instances \
        --image-id "$AMI_ID" \
        --count 1 \
        --instance-type "$INSTANCE_TYPE" \
        --key-name "$KEY_NAME" \
        --security-group-ids "$SECURITY_GROUP_ID" \
        --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=tauos-cloud},{Key=Project,Value=tauos}]' \
        --query 'Instances[0].InstanceId' --output text)
    
    print_status "Instances created:"
    print_status "  TauMail: $MAIL_INSTANCE_ID"
    print_status "  TauCloud: $CLOUD_INSTANCE_ID"
    
    # Wait for instances to be running
    print_info "Waiting for instances to be running..."
    aws ec2 wait instance-running --instance-ids "$MAIL_INSTANCE_ID" "$CLOUD_INSTANCE_ID"
    
    # Get public IPs
    MAIL_PUBLIC_IP=$(aws ec2 describe-instances \
        --instance-ids "$MAIL_INSTANCE_ID" \
        --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
    
    CLOUD_PUBLIC_IP=$(aws ec2 describe-instances \
        --instance-ids "$CLOUD_INSTANCE_ID" \
        --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
    
    print_status "Public IPs:"
    print_status "  TauMail: $MAIL_PUBLIC_IP"
    print_status "  TauCloud: $CLOUD_PUBLIC_IP"
}

# Function to update DNS records
update_dns() {
    print_info "Updating DNS records..."
    
    # Create DNS change batch
    cat > dns-changes.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$MAIL_DOMAIN",
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
                "Name": "$CLOUD_DOMAIN",
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
    aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch file://dns-changes.json
    
    print_status "DNS records updated"
}

# Function to create deployment script for instances
create_deployment_script() {
    print_info "Creating deployment script for instances..."
    
    cat > deploy-instance.sh << 'EOF'
#!/bin/bash

# Instance deployment script
set -e

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

# Create Docker Compose files
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

  rspamd:
    image: rspamd:latest
    container_name: taumail-rspamd
    ports:
      - "11332:11332"
    restart: unless-stopped

  webmail:
    image: taumail-webmail:latest
    container_name: taumail-webmail
    ports:
      - "80:3000"
      - "443:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postfix
      - dovecot
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
    image: taucloud-frontend:latest
    container_name: taucloud-frontend
    ports:
      - "8080:3000"
    environment:
      - NODE_ENV=production
      - MINIO_ENDPOINT=minio:9000
    depends_on:
      - minio
    restart: unless-stopped

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: tauos-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - webmail
      - taucloud
    restart: unless-stopped

volumes:
  mail-data:
  cloud-data:
COMPOSE_EOF

# Create Nginx configuration
cat > /opt/tauos/nginx.conf << 'NGINX_EOF'
events {
    worker_connections 1024;
}

http {
    upstream taumail {
        server webmail:3000;
    }

    upstream taucloud {
        server taucloud:3000;
    }

    server {
        listen 80;
        server_name mail.tauos.org;

        location / {
            proxy_pass http://taumail;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    server {
        listen 80;
        server_name cloud.tauos.org;

        location / {
            proxy_pass http://taucloud;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
NGINX_EOF

# Start services
cd /opt/tauos
sudo docker-compose up -d

# Setup SSL certificates
sudo certbot --nginx -d mail.tauos.org -d cloud.tauos.org --non-interactive --agree-tos --email admin@tauos.org

echo "Deployment completed successfully!"
EOF
    
    chmod +x deploy-instance.sh
    print_status "Deployment script created: deploy-instance.sh"
}

# Function to deploy to instances
deploy_to_instances() {
    print_info "Deploying to instances..."
    
    # Copy deployment script to instances
    scp -i "$KEY_NAME.pem" -o StrictHostKeyChecking=no deploy-instance.sh ubuntu@"$MAIL_PUBLIC_IP":~/
    scp -i "$KEY_NAME.pem" -o StrictHostKeyChecking=no deploy-instance.sh ubuntu@"$CLOUD_PUBLIC_IP":~/
    
    # Execute deployment on instances
    ssh -i "$KEY_NAME.pem" -o StrictHostKeyChecking=no ubuntu@"$MAIL_PUBLIC_IP" "chmod +x deploy-instance.sh && ./deploy-instance.sh" &
    ssh -i "$KEY_NAME.pem" -o StrictHostKeyChecking=no ubuntu@"$CLOUD_PUBLIC_IP" "chmod +x deploy-instance.sh && ./deploy-instance.sh" &
    
    print_info "Deployment started on both instances..."
    print_info "This may take 10-15 minutes to complete"
}

# Function to verify deployment
verify_deployment() {
    print_info "Verifying deployment..."
    
    # Wait for services to be ready
    sleep 60
    
    # Test TauMail
    if curl -s -f "http://$MAIL_PUBLIC_IP" > /dev/null; then
        print_status "TauMail is accessible"
    else
        print_warning "TauMail not yet accessible"
    fi
    
    # Test TauCloud
    if curl -s -f "http://$CLOUD_PUBLIC_IP" > /dev/null; then
        print_status "TauCloud is accessible"
    else
        print_warning "TauCloud not yet accessible"
    fi
    
    # Test DNS resolution
    if nslookup "$MAIL_DOMAIN" > /dev/null 2>&1; then
        print_status "DNS resolution working for $MAIL_DOMAIN"
    else
        print_warning "DNS resolution not yet working for $MAIL_DOMAIN"
    fi
    
    if nslookup "$CLOUD_DOMAIN" > /dev/null 2>&1; then
        print_status "DNS resolution working for $CLOUD_DOMAIN"
    else
        print_warning "DNS resolution not yet working for $CLOUD_DOMAIN"
    fi
}

# Main execution
main() {
    echo -e "${PURPLE}🚀 TauOS AWS Production Deployment${NC}"
    echo -e "${CYAN}Deploying TauMail and TauCloud to AWS${NC}"
    echo ""
    
    check_aws_cli
    create_key_pair
    create_security_group
    create_instances
    update_dns
    create_deployment_script
    deploy_to_instances
    verify_deployment
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed!${NC}"
    echo -e "${CYAN}Services:${NC}"
    echo -e "${CYAN}  TauMail: https://$MAIL_DOMAIN${NC}"
    echo -e "${CYAN}  TauCloud: https://$CLOUD_DOMAIN${NC}"
    echo ""
    echo -e "${YELLOW}Note: DNS propagation may take up to 48 hours${NC}"
    echo -e "${YELLOW}SSL certificates will be automatically configured${NC}"
}

# Run main function
main "$@" 