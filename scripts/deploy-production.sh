#!/bin/bash

# TauOS Production Deployment Script
# This script deploys all TauOS services to production

set -e

echo "🚀 Deploying TauOS to Production..."

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOMAIN="tauos.org"
EMAIL="admin@tauos.org"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}📋 Production Deployment Checklist:${NC}"

# 1. Deploy Website to Vercel
echo -e "${YELLOW}1. Deploying website to Vercel...${NC}"
cd "$PROJECT_ROOT/website"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
vercel --prod --yes

echo -e "${GREEN}✅ Website deployed to Vercel${NC}"

# 2. Deploy TauMail
echo -e "${YELLOW}2. Deploying TauMail...${NC}"
cd "$PROJECT_ROOT/tauos"

# Create production Docker Compose
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  # Reverse Proxy
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik:/etc/traefik
    command:
      - --api.insecure=true
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.httpchallenge=true
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
      - --certificatesresolvers.letsencrypt.acme.email=admin@tauos.org
      - --certificatesresolvers.letsencrypt.acme.storage=/etc/traefik/acme.json

  # Database
  postgres:
    image: postgres:15
    container_name: taumail-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: taumail
      POSTGRES_USER: taumail
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - taumail-network

  # Redis
  redis:
    image: redis:7-alpine
    container_name: taumail-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - taumail-network

  # Mail Server
  postfix:
    image: catatnight/postfix
    container_name: taumail-postfix
    restart: unless-stopped
    environment:
      maildomain: tauos.org
      smtp_user: taumail:${MAIL_PASSWORD}
    volumes:
      - mail_data:/var/mail
    networks:
      - taumail-network

  # IMAP Server
  dovecot:
    image: dovemark/dovecot
    container_name: taumail-dovecot
    restart: unless-stopped
    volumes:
      - mail_data:/var/mail
    networks:
      - taumail-network

  # Webmail Frontend
  taumail-frontend:
    build: ./tauos
    container_name: taumail-frontend
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://taumail:${DB_PASSWORD}@postgres:5432/taumail
      - REDIS_URL=redis://redis:6379
      - SMTP_HOST=postfix
      - IMAP_HOST=dovecot
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.taumail.rule=Host(`mail.tauos.org`)"
      - "traefik.http.routers.taumail.tls.certresolver=letsencrypt"
      - "traefik.http.services.taumail.loadbalancer.server.port=3000"
    networks:
      - taumail-network
    depends_on:
      - postgres
      - redis
      - postfix
      - dovecot

volumes:
  postgres_data:
  redis_data:
  mail_data:

networks:
  taumail-network:
    driver: bridge
EOF

# Deploy TauMail
docker-compose -f docker-compose.prod.yml up -d

echo -e "${GREEN}✅ TauMail deployed${NC}"

# 3. Deploy TauCloud
echo -e "${YELLOW}3. Deploying TauCloud...${NC}"

# Create TauCloud production config
cat > docker-compose-taucloud.yml << 'EOF'
version: '3.8'

services:
  # MinIO Storage
  minio:
    image: minio/minio:latest
    container_name: taucloud-minio
    restart: unless-stopped
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.minio.rule=Host(`storage.tauos.org`)"
      - "traefik.http.routers.minio.tls.certresolver=letsencrypt"
      - "traefik.http.services.minio.loadbalancer.server.port=9000"
    networks:
      - taucloud-network

  # TauCloud Backend
  taucloud-backend:
    build: ./taucloud/backend
    container_name: taucloud-backend
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://taucloud:${DB_PASSWORD}@postgres:5432/taucloud
      - MINIO_ENDPOINT=minio:9000
      - MINIO_ACCESS_KEY=admin
      - MINIO_SECRET_KEY=${MINIO_PASSWORD}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.taucloud-api.rule=Host(`api.cloud.tauos.org`)"
      - "traefik.http.routers.taucloud-api.tls.certresolver=letsencrypt"
      - "traefik.http.services.taucloud-api.loadbalancer.server.port=3000"
    networks:
      - taucloud-network
    depends_on:
      - postgres
      - minio

  # TauCloud Frontend
  taucloud-frontend:
    build: ./taucloud/frontend
    container_name: taucloud-frontend
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_API_URL=https://api.cloud.tauos.org
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.taucloud.rule=Host(`cloud.tauos.org`)"
      - "traefik.http.routers.taucloud.tls.certresolver=letsencrypt"
      - "traefik.http.services.taucloud.loadbalancer.server.port=3000"
    networks:
      - taucloud-network

volumes:
  minio_data:

networks:
  taucloud-network:
    driver: bridge
EOF

# Deploy TauCloud
docker-compose -f docker-compose-taucloud.yml up -d

echo -e "${GREEN}✅ TauCloud deployed${NC}"

# 4. Deploy Tau Store
echo -e "${YELLOW}4. Deploying Tau Store...${NC}"

# Create Tau Store production config
cat > docker-compose-taustore.yml << 'EOF'
version: '3.8'

services:
  # Tau Store Backend
  taustore-backend:
    build: ./apps/taustore
    container_name: taustore-backend
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://taustore:${DB_PASSWORD}@postgres:5432/taustore
      - JWT_SECRET=${JWT_SECRET}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.taustore-api.rule=Host(`api.store.tauos.org`)"
      - "traefik.http.routers.taustore-api.tls.certresolver=letsencrypt"
      - "traefik.http.services.taustore-api.loadbalancer.server.port=3000"
    networks:
      - taustore-network
    depends_on:
      - postgres

  # Tau Store Frontend
  taustore-frontend:
    build: ./apps/taustore/frontend
    container_name: taustore-frontend
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_API_URL=https://api.store.tauos.org
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.taustore.rule=Host(`store.tauos.org`)"
      - "traefik.http.routers.taustore.tls.certresolver=letsencrypt"
      - "traefik.http.services.taustore.loadbalancer.server.port=3000"
    networks:
      - taustore-network

networks:
  taustore-network:
    driver: bridge
EOF

# Deploy Tau Store
docker-compose -f docker-compose-taustore.yml up -d

echo -e "${GREEN}✅ Tau Store deployed${NC}"

# 5. Configure DNS
echo -e "${YELLOW}5. DNS Configuration${NC}"
echo "Please configure the following DNS records in your Squarespace DNS settings:"
echo ""
echo "A Records:"
echo "  @ -> [Your Vercel IP]"
echo "  www -> [Your Vercel IP]"
echo "  mail -> [Your Server IP]"
echo "  cloud -> [Your Server IP]"
echo "  store -> [Your Server IP]"
echo "  api.cloud -> [Your Server IP]"
echo "  api.store -> [Your Server IP]"
echo ""
echo "CNAME Records:"
echo "  mail.tauos.org -> mail.tauos.org"
echo "  cloud.tauos.org -> cloud.tauos.org"
echo "  store.tauos.org -> store.tauos.org"

# 6. Generate SSL Certificates
echo -e "${YELLOW}6. SSL Certificates${NC}"
echo "SSL certificates will be automatically generated by Traefik using Let's Encrypt."

# 7. Create Production Environment File
echo -e "${YELLOW}7. Creating production environment...${NC}"
cat > .env.production << 'EOF'
# Database
DB_PASSWORD=your_secure_db_password_here
POSTGRES_PASSWORD=your_secure_db_password_here

# Mail
MAIL_PASSWORD=your_secure_mail_password_here

# MinIO
MINIO_PASSWORD=your_secure_minio_password_here

# JWT
JWT_SECRET=your_secure_jwt_secret_here

# Domain
DOMAIN=tauos.org
EMAIL=admin@tauos.org
EOF

echo -e "${GREEN}✅ Production deployment configuration complete!${NC}"
echo ""
echo -e "${GREEN}🎉 Next Steps:${NC}"
echo "1. Update .env.production with secure passwords"
echo "2. Configure DNS records in Squarespace"
echo "3. Run: docker-compose -f docker-compose.prod.yml up -d"
echo "4. Run: docker-compose -f docker-compose-taucloud.yml up -d"
echo "5. Run: docker-compose -f docker-compose-taustore.yml up -d"
echo "6. Test all services at:"
echo "   - https://tauos.org (Website)"
echo "   - https://mail.tauos.org (TauMail)"
echo "   - https://cloud.tauos.org (TauCloud)"
echo "   - https://store.tauos.org (Tau Store)"
echo ""
echo -e "${GREEN}🚀 TauOS is ready for production!${NC}" 