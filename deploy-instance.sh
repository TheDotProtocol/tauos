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
