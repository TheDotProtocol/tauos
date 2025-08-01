#!/bin/bash

# TauOS Launch Deployment Script
# Deploys QEMU testing, TauMail, and website for production launch

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="tauos.org"
MAIL_DOMAIN="mail.tauos.org"
CLOUD_DOMAIN="cloud.tauos.org"
WEBSITE_DOMAIN="www.tauos.org"

# Function to check dependencies
check_dependencies() {
    echo -e "${BLUE}🔍 Checking deployment dependencies...${NC}"
    
    local missing_deps=()
    
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing dependencies: ${missing_deps[*]}${NC}"
        echo -e "${YELLOW}📦 Please install missing dependencies and run again${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ All dependencies found${NC}"
    fi
}

# Function to create environment files
setup_environment() {
    echo -e "${YELLOW}🔧 Setting up environment configuration...${NC}"
    
    # Create .env files for TauMail
    cat > tauos/taumail/server/.env << EOF
# TauMail Environment Configuration
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://taumail:secure_password_123@postgres:5432/taumail
POSTGRES_PASSWORD=secure_password_123

# Redis
REDIS_URL=redis://:redis_password_123@redis:6379
REDIS_PASSWORD=redis_password_123

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Mail Configuration
MAIL_DOMAIN=${MAIL_DOMAIN}
SMTP_HOST=postfix
SMTP_PORT=587
SMTP_USER=admin@${MAIL_DOMAIN}
SMTP_PASSWORD=secure_smtp_123
IMAP_HOST=dovecot
IMAP_PORT=993
IMAP_USER=admin@${MAIL_DOMAIN}
IMAP_PASSWORD=secure_imap_123

# Frontend
FRONTEND_URL=https://${MAIL_DOMAIN}
EOF

    # Create .env files for website
    cat > tauos/website/.env.local << EOF
# TauOS Website Environment Configuration
NEXT_PUBLIC_API_URL=https://api.${DOMAIN}
NEXT_PUBLIC_MAIL_URL=https://${MAIL_DOMAIN}
NEXT_PUBLIC_CLOUD_URL=https://${CLOUD_DOMAIN}
NEXT_PUBLIC_DOWNLOAD_URL=https://downloads.${DOMAIN}
EOF

    echo -e "${GREEN}✅ Environment files created${NC}"
}

# Function to setup SSL certificates
setup_ssl() {
    echo -e "${YELLOW}🔒 Setting up SSL certificates...${NC}"
    
    # Create SSL directory
    mkdir -p tauos/taumail/server/ssl
    
    # Generate self-signed certificates for development
    # In production, you would use Let's Encrypt or other CA
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout tauos/taumail/server/ssl/private.key \
        -out tauos/taumail/server/ssl/certificate.crt \
        -subj "/C=US/ST=State/L=City/O=TauOS/CN=${DOMAIN}"
    
    echo -e "${GREEN}✅ SSL certificates generated${NC}"
}

# Function to build TauMail
build_taumail() {
    echo -e "${YELLOW}📧 Building TauMail...${NC}"
    
    cd tauos/taumail
    
    # Build webmail interface
    echo -e "${BLUE}Building webmail interface...${NC}"
    cd webmail
    npm install
    npm run build
    cd ..
    
    # Build admin interface
    echo -e "${BLUE}Building admin interface...${NC}"
    cd admin
    npm install
    npm run build
    cd ..
    
    # Build API server
    echo -e "${BLUE}Building API server...${NC}"
    cd server/api
    npm install
    npm run build
    cd ..
    
    cd ../..
    
    echo -e "${GREEN}✅ TauMail built successfully${NC}"
}

# Function to build website
build_website() {
    echo -e "${YELLOW}🌐 Building TauOS website...${NC}"
    
    cd tauos/website
    
    npm install
    npm run build
    
    cd ../..
    
    echo -e "${GREEN}✅ Website built successfully${NC}"
}

# Function to setup QEMU testing
setup_qemu_testing() {
    echo -e "${YELLOW}🖥️  Setting up QEMU testing environment...${NC}"
    
    # Make QEMU script executable
    chmod +x tauos/scripts/qemu_test_setup.sh
    
    # Create QEMU VM directory
    mkdir -p tauos/qemu-vms/tauos-test/disks
    
    echo -e "${GREEN}✅ QEMU testing environment ready${NC}"
}

# Function to create download directory
setup_downloads() {
    echo -e "${YELLOW}📦 Setting up download directory...${NC}"
    
    mkdir -p tauos/website/public/downloads
    
    # Copy ISO file to downloads
    if [ -f "tauos/tauos-simple-20250730.iso" ]; then
        cp tauos/tauos-simple-20250730.iso tauos/website/public/downloads/
        echo -e "${GREEN}✅ ISO file copied to downloads${NC}"
    else
        echo -e "${YELLOW}⚠️  ISO file not found, skipping copy${NC}"
    fi
    
    # Create placeholder files for other platforms
    touch tauos/website/public/downloads/TauOS.dmg
    touch tauos/website/public/downloads/TauOS-Setup.exe
    
    echo -e "${GREEN}✅ Download directory setup complete${NC}"
}

# Function to create nginx configuration
setup_nginx() {
    echo -e "${YELLOW}🌐 Setting up nginx configuration...${NC}"
    
    mkdir -p tauos/nginx/conf.d
    
    # Create nginx configuration
    cat > tauos/nginx/nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/s;
    
    # Upstream servers
    upstream taumail_webmail {
        server taumail-webmail:3000;
    }
    
    upstream taumail_admin {
        server taumail-admin:3001;
    }
    
    upstream taumail_api {
        server taumail-webmail:3000;
    }
    
    upstream website {
        server website:3000;
    }
    
    # Main server block
    server {
        listen 80;
        server_name ${DOMAIN} www.${DOMAIN};
        
        # Redirect HTTP to HTTPS
        return 301 https://\$server_name\$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name ${DOMAIN} www.${DOMAIN};
        
        # SSL configuration
        ssl_certificate /etc/nginx/ssl/certificate.crt;
        ssl_certificate_key /etc/nginx/ssl/private.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        
        # Website
        location / {
            proxy_pass http://website;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # Downloads
        location /downloads/ {
            alias /var/www/downloads/;
            add_header Content-Disposition "attachment";
        }
    }
    
    # TauMail server block
    server {
        listen 80;
        server_name ${MAIL_DOMAIN};
        return 301 https://\$server_name\$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name ${MAIL_DOMAIN};
        
        # SSL configuration
        ssl_certificate /etc/nginx/ssl/certificate.crt;
        ssl_certificate_key /etc/nginx/ssl/private.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        
        # Rate limiting
        limit_req zone=login burst=5 nodelay;
        
        # Webmail interface
        location / {
            proxy_pass http://taumail_webmail;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # Admin interface
        location /admin {
            proxy_pass http://taumail_admin;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # API
        location /api/ {
            limit_req zone=api burst=10 nodelay;
            proxy_pass http://taumail_api;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
    
    # TauCloud server block
    server {
        listen 80;
        server_name ${CLOUD_DOMAIN};
        return 301 https://\$server_name\$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name ${CLOUD_DOMAIN};
        
        # SSL configuration
        ssl_certificate /etc/nginx/ssl/certificate.crt;
        ssl_certificate_key /etc/nginx/ssl/private.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        
        # TauCloud interface (placeholder)
        location / {
            return 200 "TauCloud coming soon!";
            add_header Content-Type text/plain;
        }
    }
}
EOF

    echo -e "${GREEN}✅ Nginx configuration created${NC}"
}

# Function to create docker-compose for production
create_production_compose() {
    echo -e "${YELLOW}🐳 Creating production docker-compose...${NC}"
    
    cat > tauos/docker-compose.prod.yml << EOF
version: '3.8'

services:
  # Website
  website:
    build:
      context: ./website
      dockerfile: Dockerfile
    container_name: tauos-website
    environment:
      NODE_ENV: production
    volumes:
      - ./website/public/downloads:/var/www/downloads
    restart: unless-stopped
    networks:
      - tauos-network

  # TauMail Services
  taumail-postgres:
    image: postgres:15-alpine
    container_name: taumail-postgres
    environment:
      POSTGRES_DB: taumail
      POSTGRES_USER: taumail
      POSTGRES_PASSWORD: secure_password_123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - tauos-network

  taumail-redis:
    image: redis:7-alpine
    container_name: taumail-redis
    command: redis-server --appendonly yes --requirepass redis_password_123
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - tauos-network

  taumail-postfix:
    image: catatnight/postfix:latest
    container_name: taumail-postfix
    environment:
      maildomain: ${MAIL_DOMAIN}
      smtp_user: admin@${MAIL_DOMAIN}:secure_smtp_123
    volumes:
      - ./taumail/server/config/postfix:/etc/postfix
      - mail_data:/var/mail
    restart: unless-stopped
    networks:
      - tauos-network

  taumail-dovecot:
    image: dovemark/dovecot:latest
    container_name: taumail-dovecot
    environment:
      DOVECOT_DOMAIN: ${MAIL_DOMAIN}
    volumes:
      - ./taumail/server/config/dovecot:/etc/dovecot
      - mail_data:/var/mail
    restart: unless-stopped
    networks:
      - tauos-network

  taumail-rspamd:
    image: rspamd/rspamd:latest
    container_name: taumail-rspamd
    volumes:
      - ./taumail/server/config/rspamd:/etc/rspamd
    restart: unless-stopped
    networks:
      - tauos-network

  taumail-webmail:
    build:
      context: ./taumail/webmail
      dockerfile: Dockerfile
    container_name: taumail-webmail
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://taumail:secure_password_123@taumail-postgres:5432/taumail
      REDIS_URL: redis://:redis_password_123@taumail-redis:6379
      JWT_SECRET: your_super_secret_jwt_key_change_this_in_production
      SMTP_HOST: taumail-postfix
      SMTP_PORT: 587
      IMAP_HOST: taumail-dovecot
      IMAP_PORT: 993
      MAIL_DOMAIN: ${MAIL_DOMAIN}
    restart: unless-stopped
    networks:
      - tauos-network
    depends_on:
      - taumail-postgres
      - taumail-redis
      - taumail-postfix
      - taumail-dovecot

  taumail-admin:
    build:
      context: ./taumail/admin
      dockerfile: Dockerfile
    container_name: taumail-admin
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://taumail:secure_password_123@taumail-postgres:5432/taumail
      REDIS_URL: redis://:redis_password_123@taumail-redis:6379
      JWT_SECRET: your_super_secret_jwt_key_change_this_in_production
    restart: unless-stopped
    networks:
      - tauos-network
    depends_on:
      - taumail-postgres
      - taumail-redis

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: tauos-nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./taumail/server/ssl:/etc/nginx/ssl
      - ./website/public/downloads:/var/www/downloads
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped
    networks:
      - tauos-network
    depends_on:
      - website
      - taumail-webmail
      - taumail-admin

volumes:
  postgres_data:
  redis_data:
  mail_data:

networks:
  tauos-network:
    driver: bridge
EOF

    echo -e "${GREEN}✅ Production docker-compose created${NC}"
}

# Function to create deployment script
create_deployment_script() {
    echo -e "${YELLOW}📝 Creating deployment script...${NC}"
    
    cat > tauos/scripts/deploy.sh << 'EOF'
#!/bin/bash

# TauOS Production Deployment Script

set -e

echo "🐢 Deploying TauOS to production..."

# Build all services
echo "📦 Building services..."
docker-compose -f docker-compose.prod.yml build

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

echo "✅ TauOS deployed successfully!"
echo "🌐 Website: https://tauos.org"
echo "📧 TauMail: https://mail.tauos.org"
echo "☁️  TauCloud: https://cloud.tauos.org"
EOF

    chmod +x tauos/scripts/deploy.sh
    
    echo -e "${GREEN}✅ Deployment script created${NC}"
}

# Function to create monitoring setup
setup_monitoring() {
    echo -e "${YELLOW}📊 Setting up monitoring...${NC}"
    
    # Create monitoring docker-compose
    cat > tauos/monitoring/docker-compose.yml << EOF
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: tauos-prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    restart: unless-stopped
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: tauos-grafana
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    ports:
      - "3000:3000"
    restart: unless-stopped
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:

networks:
  monitoring:
    driver: bridge
EOF

    # Create Prometheus configuration
    cat > tauos/monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'tauos-website'
    static_configs:
      - targets: ['website:3000']

  - job_name: 'taumail-webmail'
    static_configs:
      - targets: ['taumail-webmail:3000']

  - job_name: 'taumail-admin'
    static_configs:
      - targets: ['taumail-admin:3001']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
EOF

    echo -e "${GREEN}✅ Monitoring setup complete${NC}"
}

# Function to create backup script
create_backup_script() {
    echo -e "${YELLOW}💾 Creating backup script...${NC}"
    
    cat > tauos/scripts/backup.sh << 'EOF'
#!/bin/bash

# TauOS Backup Script

set -e

BACKUP_DIR="/backups/tauos"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🐢 Creating TauOS backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
echo "📊 Backing up database..."
docker exec taumail-postgres pg_dump -U taumail taumail > $BACKUP_DIR/database_$DATE.sql

# Backup mail data
echo "📧 Backing up mail data..."
docker run --rm -v taumail_mail_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/mail_data_$DATE.tar.gz -C /data .

# Backup configuration
echo "⚙️  Backing up configuration..."
tar czf $BACKUP_DIR/config_$DATE.tar.gz -C tauos taumail/server/config nginx ssl

# Create backup manifest
cat > $BACKUP_DIR/backup_$DATE.manifest << MANIFEST
TauOS Backup - $DATE
====================
Database: database_$DATE.sql
Mail Data: mail_data_$DATE.tar.gz
Configuration: config_$DATE.tar.gz
MANIFEST

echo "✅ Backup completed: $BACKUP_DIR/backup_$DATE.manifest"
EOF

    chmod +x tauos/scripts/backup.sh
    
    echo -e "${GREEN}✅ Backup script created${NC}"
}

# Function to create documentation
create_documentation() {
    echo -e "${YELLOW}📚 Creating documentation...${NC}"
    
    cat > tauos/LAUNCH_README.md << EOF
# TauOS Launch Documentation

## Overview

This directory contains all components needed for the TauOS launch:

### 🖥️ QEMU Testing
- **Script**: \`scripts/qemu_test_setup.sh\`
- **Guide**: \`docs/qemu_testing_guide.md\`
- **Usage**: Run \`./scripts/qemu_test_setup.sh\` to test TauOS in QEMU

### 📧 TauMail Email Suite
- **Docker Compose**: \`taumail/server/docker-compose.yml\`
- **Webmail Interface**: \`taumail/webmail/\`
- **API Server**: \`taumail/server/api/\`
- **Admin Dashboard**: \`taumail/admin/\`

### 🌐 TauOS Website
- **Next.js App**: \`website/\`
- **Landing Page**: Modern, responsive design
- **Download System**: OS detection and smart downloads
- **SSL Ready**: HTTPS configuration included

## Quick Start

### 1. Test TauOS in QEMU
\`\`\`bash
cd tauos
./scripts/qemu_test_setup.sh
\`\`\`

### 2. Deploy TauMail
\`\`\`bash
cd tauos/taumail/server
docker-compose up -d
\`\`\`

### 3. Deploy Website
\`\`\`bash
cd tauos/website
npm install
npm run build
npm start
\`\`\`

### 4. Production Deployment
\`\`\`bash
cd tauos
./scripts/deploy.sh
\`\`\`

## Configuration

### Environment Variables
- \`DOMAIN\`: Main domain (default: tauos.org)
- \`MAIL_DOMAIN\`: Email domain (default: mail.tauos.org)
- \`CLOUD_DOMAIN\`: Cloud domain (default: cloud.tauos.org)

### SSL Certificates
- Self-signed certificates generated for development
- Use Let's Encrypt for production

### Database
- PostgreSQL for TauMail
- Redis for sessions and caching

## Monitoring

### Health Checks
- Website: https://tauos.org/health
- TauMail: https://mail.tauos.org/health
- API: https://mail.tauos.org/api/health

### Metrics
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

## Backup

### Automated Backups
\`\`\`bash
./scripts/backup.sh
\`\`\`

### Manual Backup
\`\`\`bash
# Database
docker exec taumail-postgres pg_dump -U taumail taumail > backup.sql

# Mail data
docker run --rm -v taumail_mail_data:/data -v \$(pwd):/backup alpine tar czf /backup/mail_backup.tar.gz -C /data .
\`\`\`

## Troubleshooting

### Common Issues

1. **QEMU not starting**
   - Check if KVM is enabled: \`ls /dev/kvm\`
   - Install QEMU: \`brew install qemu\` (macOS) or \`sudo apt install qemu\` (Linux)

2. **TauMail not connecting**
   - Check database: \`docker logs taumail-postgres\`
   - Check Redis: \`docker logs taumail-redis\`
   - Check Postfix: \`docker logs taumail-postfix\`

3. **Website not loading**
   - Check nginx: \`docker logs tauos-nginx\`
   - Check website: \`docker logs tauos-website\`

### Logs
\`\`\`bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# View specific service
docker-compose -f docker-compose.prod.yml logs taumail-webmail
\`\`\`

## Security

### SSL/TLS
- HTTPS enforced for all services
- HSTS headers enabled
- Modern cipher suites

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints

### Data Protection
- End-to-end encryption for emails
- Client-side encryption for cloud storage
- No telemetry or data collection

## Performance

### Optimization
- Gzip compression enabled
- Static file caching
- Database connection pooling
- Redis caching layer

### Scaling
- Horizontal scaling ready
- Load balancer configuration
- Auto-scaling policies

## Support

### Documentation
- QEMU Testing: \`docs/qemu_testing_guide.md\`
- TauMail API: \`taumail/server/api/README.md\`
- Website: \`website/README.md\`

### Community
- GitHub: https://github.com/tauos/tauos
- Discord: https://discord.gg/tauos
- Forum: https://forum.tauos.org

---

*Last updated: July 30, 2025*
*TauOS Version: 1.0*
EOF

    echo -e "${GREEN}✅ Documentation created${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🐢 TauOS Launch Deployment Setup${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Setup environment
    setup_environment
    
    # Setup SSL
    setup_ssl
    
    # Build components
    build_taumail
    build_website
    
    # Setup QEMU testing
    setup_qemu_testing
    
    # Setup downloads
    setup_downloads
    
    # Setup nginx
    setup_nginx
    
    # Create production compose
    create_production_compose
    
    # Create deployment script
    create_deployment_script
    
    # Setup monitoring
    setup_monitoring
    
    # Create backup script
    create_backup_script
    
    # Create documentation
    create_documentation
    
    echo ""
    echo -e "${GREEN}✅ TauOS launch setup complete!${NC}"
    echo ""
    echo -e "${BLUE}🎯 Next Steps:${NC}"
    echo "1. Test QEMU: ./scripts/qemu_test_setup.sh"
    echo "2. Deploy TauMail: cd taumail/server && docker-compose up -d"
    echo "3. Deploy Website: cd website && npm start"
    echo "4. Production: ./scripts/deploy.sh"
    echo ""
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo "- Launch Guide: LAUNCH_README.md"
    echo "- QEMU Testing: docs/qemu_testing_guide.md"
    echo ""
    echo -e "${GREEN}🚀 Ready for launch!${NC}"
}

# Run main function
main "$@" 