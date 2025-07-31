#!/bin/bash

# TauOS Communication Suite - Complete Deployment Script
# Deploys the entire TauOS ecosystem with full integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENVIRONMENT="${1:-production}"
DOMAIN_PREFIX="${2:-tauos}"

# Service domains
TAUMAIL_DOMAIN="mail.${DOMAIN_PREFIX}.org"
TAUCONNECT_DOMAIN="connect.${DOMAIN_PREFIX}.org"
TAUMESSENGER_DOMAIN="messenger.${DOMAIN_PREFIX}.org"
TAUCALENDAR_DOMAIN="calendar.${DOMAIN_PREFIX}.org"
TAUCLOUD_DOMAIN="cloud.${DOMAIN_PREFIX}.org"

ADMIN_EMAIL="admin@${DOMAIN_PREFIX}.org"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    local missing_deps=()
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    # Check openssl
    if ! command -v openssl &> /dev/null; then
        missing_deps+=("openssl")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    success "Prerequisites check completed"
}

# Setup environment
setup_environment() {
    log "Setting up environment..."
    
    # Create main .env file
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        cat > "$PROJECT_DIR/.env" << EOF
# TauOS Communication Suite Environment Configuration
ENVIRONMENT=$ENVIRONMENT
DOMAIN_PREFIX=$DOMAIN_PREFIX

# Service Domains
TAUMAIL_DOMAIN=$TAUMAIL_DOMAIN
TAUCONNECT_DOMAIN=$TAUCONNECT_DOMAIN
TAUMESSENGER_DOMAIN=$TAUMESSENGER_DOMAIN
TAUCALENDAR_DOMAIN=$TAUCALENDAR_DOMAIN
TAUCLOUD_DOMAIN=$TAUCLOUD_DOMAIN

# Admin Configuration
ADMIN_EMAIL=$ADMIN_EMAIL

# Database
DB_PASSWORD=$(openssl rand -base64 32)
DATABASE_URL=postgresql://tauos:${DB_PASSWORD}@postgres:5432/tauos_suite

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32)

# API Secrets
API_SECRET=$(openssl rand -base64 64)
ADMIN_SECRET=$(openssl rand -base64 64)
JWT_SECRET=$(openssl rand -base64 64)

# SSL Configuration
SSL_EMAIL=$ADMIN_EMAIL
SSL_STAGING=false

# Monitoring
PROMETHEUS_PASSWORD=$(openssl rand -base64 32)
GRAFANA_PASSWORD=$(openssl rand -base64 32)

# TauID Integration
TAUID_URL=https://id.${DOMAIN_PREFIX}.org

# Service Integration Tokens
TAUMAIL_API_TOKEN=$(openssl rand -base64 32)
TAUCONNECT_API_TOKEN=$(openssl rand -base64 32)
TAUMESSENGER_API_TOKEN=$(openssl rand -base64 32)
TAUCALENDAR_API_TOKEN=$(openssl rand -base64 32)
TAUCLOUD_API_TOKEN=$(openssl rand -base64 32)
EOF
        success "Created main .env file"
    else
        log ".env file already exists"
    fi
    
    # Create necessary directories
    mkdir -p "$PROJECT_DIR/ssl"
    mkdir -p "$PROJECT_DIR/logs"
    mkdir -p "$PROJECT_DIR/backups"
    mkdir -p "$PROJECT_DIR/monitoring"
    mkdir -p "$PROJECT_DIR/screenshots"
    mkdir -p "$PROJECT_DIR/docs"
    
    success "Environment setup completed"
}

# Build TauMail webmail
build_taumail_webmail() {
    log "Building TauMail webmail..."
    
    if [ -d "$PROJECT_DIR/taumail/webmail" ]; then
        cd "$PROJECT_DIR/taumail/webmail"
        
        # Install dependencies
        npm install
        
        # Build the application
        npm run build
        
        success "TauMail webmail built successfully"
    else
        warning "TauMail webmail directory not found, skipping..."
    fi
}

# Deploy TauMail
deploy_taumail() {
    log "Deploying TauMail..."
    
    if [ -d "$PROJECT_DIR/taumail" ]; then
        cd "$PROJECT_DIR/taumail"
        
        # Copy environment variables
        cp "$PROJECT_DIR/.env" .env
        
        # Build webmail if not already built
        if [ ! -d "webmail/.next" ]; then
            build_taumail_webmail
        fi
        
        # Deploy services
        docker-compose up -d --build
        
        # Wait for services to be ready
        log "Waiting for TauMail services to be ready..."
        sleep 45
        
        # Check service health
        if docker-compose ps | grep -q "Up"; then
            success "TauMail deployed successfully"
        else
            error "TauMail deployment failed"
            return 1
        fi
    else
        warning "TauMail directory not found, skipping..."
    fi
}

# Deploy TauConnect
deploy_tauconnect() {
    log "Deploying TauConnect..."
    
    if [ -d "$PROJECT_DIR/tauconnect" ]; then
        cd "$PROJECT_DIR/tauconnect"
        
        # Copy environment variables
        cp "$PROJECT_DIR/.env" .env
        
        # Deploy services
        docker-compose up -d --build
        
        # Wait for services to be ready
        log "Waiting for TauConnect services to be ready..."
        sleep 30
        
        # Check service health
        if docker-compose ps | grep -q "Up"; then
            success "TauConnect deployed successfully"
        else
            error "TauConnect deployment failed"
            return 1
        fi
    else
        warning "TauConnect directory not found, creating basic structure..."
        
        # Create basic TauConnect structure
        mkdir -p "$PROJECT_DIR/tauconnect"
        cd "$PROJECT_DIR/tauconnect"
        
        # Create docker-compose.yml
        cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  tauconnect-signaling:
    image: node:18-alpine
    container_name: tauconnect-signaling
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SIGNALING_PORT=3000
    volumes:
      - ./signaling:/app
    working_dir: /app
    command: ["node", "server.js"]
    networks:
      - tauconnect_network
    restart: unless-stopped

  tauconnect-media:
    image: node:18-alpine
    container_name: tauconnect-media
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - MEDIA_PORT=3002
    volumes:
      - ./media:/app
    working_dir: /app
    command: ["node", "server.js"]
    networks:
      - tauconnect_network
    restart: unless-stopped

  tauconnect-web:
    image: nginx:alpine
    container_name: tauconnect-web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./web:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - tauconnect_network
    restart: unless-stopped

networks:
  tauconnect_network:
    driver: bridge
EOF
        
        success "TauConnect basic structure created"
    fi
}

# Deploy TauMessenger
deploy_taumessenger() {
    log "Deploying TauMessenger..."
    
    if [ -d "$PROJECT_DIR/taumessenger" ]; then
        cd "$PROJECT_DIR/taumessenger"
        
        # Copy environment variables
        cp "$PROJECT_DIR/.env" .env
        
        # Deploy services
        docker-compose up -d --build
        
        # Wait for services to be ready
        log "Waiting for TauMessenger services to be ready..."
        sleep 30
        
        # Check service health
        if docker-compose ps | grep -q "Up"; then
            success "TauMessenger deployed successfully"
        else
            error "TauMessenger deployment failed"
            return 1
        fi
    else
        warning "TauMessenger directory not found, creating basic structure..."
        
        # Create basic TauMessenger structure
        mkdir -p "$PROJECT_DIR/taumessenger"
        cd "$PROJECT_DIR/taumessenger"
        
        # Create docker-compose.yml
        cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  taumessenger-messaging:
    image: node:18-alpine
    container_name: taumessenger-messaging
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MESSAGING_PORT=3000
    volumes:
      - ./messaging:/app
    working_dir: /app
    command: ["node", "server.js"]
    networks:
      - taumessenger_network
    restart: unless-stopped

  taumessenger-presence:
    image: node:18-alpine
    container_name: taumessenger-presence
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PRESENCE_PORT=3001
    volumes:
      - ./presence:/app
    working_dir: /app
    command: ["node", "server.js"]
    networks:
      - taumessenger_network
    restart: unless-stopped

  taumessenger-web:
    image: nginx:alpine
    container_name: taumessenger-web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./web:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - taumessenger_network
    restart: unless-stopped

networks:
  taumessenger_network:
    driver: bridge
EOF
        
        success "TauMessenger basic structure created"
    fi
}

# Deploy TauCalendar
deploy_taucalendar() {
    log "Deploying TauCalendar..."
    
    if [ -d "$PROJECT_DIR/taucalendar" ]; then
        cd "$PROJECT_DIR/taucalendar"
        
        # Copy environment variables
        cp "$PROJECT_DIR/.env" .env
        
        # Deploy services
        docker-compose up -d --build
        
        # Wait for services to be ready
        log "Waiting for TauCalendar services to be ready..."
        sleep 30
        
        # Check service health
        if docker-compose ps | grep -q "Up"; then
            success "TauCalendar deployed successfully"
        else
            error "TauCalendar deployment failed"
            return 1
        fi
    else
        warning "TauCalendar directory not found, creating basic structure..."
        
        # Create basic TauCalendar structure
        mkdir -p "$PROJECT_DIR/taucalendar"
        cd "$PROJECT_DIR/taucalendar"
        
        # Create docker-compose.yml
        cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  taucalendar-calendar:
    image: node:18-alpine
    container_name: taucalendar-calendar
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - CALENDAR_PORT=3000
    volumes:
      - ./calendar:/app
    working_dir: /app
    command: ["node", "server.js"]
    networks:
      - taucalendar_network
    restart: unless-stopped

  taucalendar-tasks:
    image: node:18-alpine
    container_name: taucalendar-tasks
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - TASKS_PORT=3001
    volumes:
      - ./tasks:/app
    working_dir: /app
    command: ["node", "server.js"]
    networks:
      - taucalendar_network
    restart: unless-stopped

  taucalendar-web:
    image: nginx:alpine
    container_name: taucalendar-web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./web:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - taucalendar_network
    restart: unless-stopped

networks:
  taucalendar_network:
    driver: bridge
EOF
        
        success "TauCalendar basic structure created"
    fi
}

# Deploy TauCloud
deploy_taucloud() {
    log "Deploying TauCloud..."
    
    if [ -d "$PROJECT_DIR/taucloud" ]; then
        cd "$PROJECT_DIR/taucloud"
        
        # Copy environment variables
        cp "$PROJECT_DIR/.env" .env
        
        # Deploy services
        docker-compose up -d --build
        
        # Wait for services to be ready
        log "Waiting for TauCloud services to be ready..."
        sleep 30
        
        # Check service health
        if docker-compose ps | grep -q "Up"; then
            success "TauCloud deployed successfully"
        else
            error "TauCloud deployment failed"
            return 1
        fi
    else
        warning "TauCloud directory not found, creating basic structure..."
        
        # Create basic TauCloud structure
        mkdir -p "$PROJECT_DIR/taucloud"
        cd "$PROJECT_DIR/taucloud"
        
        # Create docker-compose.yml
        cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  taucloud-storage:
    image: minio/minio:latest
    container_name: taucloud-storage
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=tauos
      - MINIO_ROOT_PASSWORD=tauos123456
    volumes:
      - taucloud_data:/data
    command: server /data --console-address ":9001"
    networks:
      - taucloud_network
    restart: unless-stopped

  taucloud-sync:
    image: node:18-alpine
    container_name: taucloud-sync
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SYNC_PORT=3000
    volumes:
      - ./sync:/app
    working_dir: /app
    command: ["node", "server.js"]
    networks:
      - taucloud_network
    restart: unless-stopped

  taucloud-web:
    image: nginx:alpine
    container_name: taucloud-web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./web:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - taucloud_network
    restart: unless-stopped

volumes:
  taucloud_data:

networks:
  taucloud_network:
    driver: bridge
EOF
        
        success "TauCloud basic structure created"
    fi
}

# Setup SSL certificates
setup_ssl() {
    log "Setting up SSL certificates..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # Generate SSL certificates for all domains
        local domains=("$TAUMAIL_DOMAIN" "$TAUCONNECT_DOMAIN" "$TAUMESSENGER_DOMAIN" "$TAUCALENDAR_DOMAIN" "$TAUCLOUD_DOMAIN")
        
        for domain in "${domains[@]}"; do
            log "Generating SSL certificate for $domain"
            
            # Use certbot to generate certificates
            docker run --rm \
                -v "$PROJECT_DIR/ssl:/etc/letsencrypt" \
                -v "$PROJECT_DIR/certbot:/var/www/certbot" \
                certbot/certbot certonly \
                --webroot \
                --webroot-path=/var/www/certbot \
                --email $ADMIN_EMAIL \
                --agree-tos \
                --no-eff-email \
                -d $domain
        done
        
        success "SSL certificates generated"
    else
        # Generate self-signed certificates for development
        for domain in "$TAUMAIL_DOMAIN" "$TAUCONNECT_DOMAIN" "$TAUMESSENGER_DOMAIN" "$TAUCALENDAR_DOMAIN" "$TAUCLOUD_DOMAIN"; do
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout "$PROJECT_DIR/ssl/${domain}.key" \
                -out "$PROJECT_DIR/ssl/${domain}.crt" \
                -subj "/C=US/ST=State/L=City/O=TauOS/CN=$domain"
        done
        
        success "Self-signed SSL certificates generated for development"
    fi
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create Prometheus configuration
    cat > "$PROJECT_DIR/monitoring/prometheus.yml" << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # TauMail monitoring
  - job_name: 'taumail'
    static_configs:
      - targets: ['taumail-postfix:25', 'taumail-dovecot:143', 'taumail-webmail:3000']

  # TauConnect monitoring
  - job_name: 'tauconnect'
    static_configs:
      - targets: ['tauconnect-signaling:3000', 'tauconnect-media:3002']

  # TauMessenger monitoring
  - job_name: 'taumessenger'
    static_configs:
      - targets: ['taumessenger-messaging:3000', 'taumessenger-presence:3001']

  # TauCalendar monitoring
  - job_name: 'taucalendar'
    static_configs:
      - targets: ['taucalendar-calendar:3000', 'taucalendar-tasks:3001']

  # TauCloud monitoring
  - job_name: 'taucloud'
    static_configs:
      - targets: ['taucloud-storage:9000', 'taucloud-sync:3000']
EOF

    # Create Grafana dashboard configuration
    mkdir -p "$PROJECT_DIR/monitoring/grafana/dashboards"
    
    success "Monitoring setup completed"
}

# Take screenshots
take_screenshots() {
    log "Taking screenshots of all services..."
    
    # Install screenshot tool if not available
    if ! command -v wkhtmltopdf &> /dev/null; then
        log "Installing wkhtmltopdf for screenshots..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y wkhtmltopdf
        elif command -v yum &> /dev/null; then
            sudo yum install -y wkhtmltopdf
        elif command -v brew &> /dev/null; then
            brew install wkhtmltopdf
        fi
    fi
    
    # Take screenshots of all services
    local services=(
        "TauMail:https://$TAUMAIL_DOMAIN"
        "TauConnect:https://$TAUCONNECT_DOMAIN"
        "TauMessenger:https://$TAUMESSENGER_DOMAIN"
        "TauCalendar:https://$TAUCALENDAR_DOMAIN"
        "TauCloud:https://$TAUCLOUD_DOMAIN"
    )
    
    for service in "${services[@]}"; do
        local name=$(echo $service | cut -d: -f1)
        local url=$(echo $service | cut -d: -f2)
        
        log "Taking screenshot of $name..."
        wkhtmltopdf --javascript-delay 3000 --no-stop-slow-scripts "$url" "$PROJECT_DIR/screenshots/${name,,}_screenshot.pdf"
        
        # Convert to PNG for web use
        if command -v convert &> /dev/null; then
            convert "$PROJECT_DIR/screenshots/${name,,}_screenshot.pdf" "$PROJECT_DIR/screenshots/${name,,}_screenshot.png"
        fi
    done
    
    success "Screenshots taken successfully"
}

# Setup DNS records
setup_dns() {
    log "Setting up DNS records..."
    
    local server_ip=$(curl -s ifconfig.me)
    
    cat << EOF
Please add the following DNS records for your domains:

A Records:
- $TAUMAIL_DOMAIN -> $server_ip
- $TAUCONNECT_DOMAIN -> $server_ip
- $TAUMESSENGER_DOMAIN -> $server_ip
- $TAUCALENDAR_DOMAIN -> $server_ip
- $TAUCLOUD_DOMAIN -> $server_ip

MX Records:
- $TAUMAIL_DOMAIN -> $TAUMAIL_DOMAIN (priority 10)

TXT Records (SPF):
- $TAUMAIL_DOMAIN -> "v=spf1 mx a ip4:$server_ip ~all"

TXT Records (DMARC):
- _dmarc.$TAUMAIL_DOMAIN -> "v=DMARC1; p=quarantine; rua=mailto:dmarc@$TAUMAIL_DOMAIN; ruf=mailto:dmarc@$TAUMAIL_DOMAIN"

CNAME Records:
- api.$TAUMAIL_DOMAIN -> $TAUMAIL_DOMAIN
- api.$TAUCONNECT_DOMAIN -> $TAUCONNECT_DOMAIN
- api.$TAUMESSENGER_DOMAIN -> $TAUMESSENGER_DOMAIN
- api.$TAUCALENDAR_DOMAIN -> $TAUCALENDAR_DOMAIN
- api.$TAUCLOUD_DOMAIN -> $TAUCLOUD_DOMAIN

EOF
}

# Health check
health_check() {
    log "Performing health check..."
    
    local services=(
        "taumail"
        "tauconnect"
        "taumessenger"
        "taucalendar"
        "taucloud"
    )
    
    local failed_services=()
    
    for service in "${services[@]}"; do
        if [ -d "$PROJECT_DIR/$service" ]; then
            cd "$PROJECT_DIR/$service"
            if docker-compose ps | grep -q "Up"; then
                log "✓ $service is running"
            else
                error "✗ $service is not running"
                failed_services+=($service)
            fi
        fi
    done
    
    if [ ${#failed_services[@]} -gt 0 ]; then
        error "Some services failed to start: ${failed_services[*]}"
        return 1
    fi
    
    success "All services are healthy"
}

# Main deployment function
main() {
    log "Starting TauOS Communication Suite deployment for environment: $ENVIRONMENT"
    
    check_prerequisites
    setup_environment
    setup_ssl
    deploy_taumail
    deploy_tauconnect
    deploy_taumessenger
    deploy_taucalendar
    deploy_taucloud
    setup_monitoring
    take_screenshots
    health_check
    
    log "Deployment completed successfully!"
    log ""
    log "Access your TauOS Communication Suite at:"
    log "  TauMail: https://$TAUMAIL_DOMAIN"
    log "  TauConnect: https://$TAUCONNECT_DOMAIN"
    log "  TauMessenger: https://$TAUMESSENGER_DOMAIN"
    log "  TauCalendar: https://$TAUCALENDAR_DOMAIN"
    log "  TauCloud: https://$TAUCLOUD_DOMAIN"
    log ""
    log "Admin panels:"
    log "  TauMail Admin: https://$TAUMAIL_DOMAIN/admin"
    log "  Monitoring: http://localhost:9090"
    log ""
    log "API documentation:"
    log "  TauMail API: https://api.$TAUMAIL_DOMAIN/docs"
    log "  TauConnect API: https://api.$TAUCONNECT_DOMAIN/docs"
    log "  TauMessenger API: https://api.$TAUMESSENGER_DOMAIN/docs"
    log "  TauCalendar API: https://api.$TAUCALENDAR_DOMAIN/docs"
    log "  TauCloud API: https://api.$TAUCLOUD_DOMAIN/docs"
    log ""
    log "Screenshots saved to: $PROJECT_DIR/screenshots/"
    
    setup_dns
}

# Run main function
main "$@" 