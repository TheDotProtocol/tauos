#!/bin/bash

# TauOS Communication Suite Deployment Script
# Deploys the complete TauOS ecosystem: TauMail, TauConnect, TauMessenger, TauCalendar, TauCloud

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
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    # Check if openssl is installed
    if ! command -v openssl &> /dev/null; then
        error "OpenSSL is not installed. Please install OpenSSL first."
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
    
    success "Environment setup completed"
}

# Deploy TauMail
deploy_taumail() {
    log "Deploying TauMail..."
    
    if [ -d "$PROJECT_DIR/taumail" ]; then
        cd "$PROJECT_DIR/taumail"
        
        # Copy environment variables
        cp "$PROJECT_DIR/.env" .env
        
        # Deploy services
        docker-compose up -d
        
        # Wait for services to be ready
        log "Waiting for TauMail services to be ready..."
        sleep 30
        
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
        docker-compose up -d
        
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
        warning "TauConnect directory not found, skipping..."
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
        docker-compose up -d
        
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
        warning "TauMessenger directory not found, skipping..."
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
        docker-compose up -d
        
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
        warning "TauCalendar directory not found, skipping..."
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
        docker-compose up -d
        
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
        warning "TauCloud directory not found, skipping..."
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
      - targets: ['taumail-postfix:25', 'taumail-dovecot:143']

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

# Create backup script
create_backup_script() {
    log "Creating backup script..."
    
    cat > "$PROJECT_DIR/scripts/backup_tau_suite.sh" << 'EOF'
#!/bin/bash

# TauOS Communication Suite Backup Script

set -e

BACKUP_DIR="/var/backups/tauos_suite"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="tauos_suite_backup_$DATE.tar.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Stop services temporarily
cd /path/to/tauos
docker-compose stop

# Create backup
tar -czf $BACKUP_DIR/$BACKUP_FILE \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=logs \
    .

# Restart services
docker-compose start

echo "Backup created: $BACKUP_DIR/$BACKUP_FILE"
EOF

    chmod +x "$PROJECT_DIR/scripts/backup_tau_suite.sh"
    success "Backup script created"
}

# Create restore script
create_restore_script() {
    log "Creating restore script..."
    
    cat > "$PROJECT_DIR/scripts/restore_tau_suite.sh" << 'EOF'
#!/bin/bash

# TauOS Communication Suite Restore Script

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Stop services
cd /path/to/tauos
docker-compose stop

# Restore from backup
tar -xzf "$BACKUP_FILE"

# Restart services
docker-compose start

echo "Restore completed from: $BACKUP_FILE"
EOF

    chmod +x "$PROJECT_DIR/scripts/restore_tau_suite.sh"
    success "Restore script created"
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
    create_backup_script
    create_restore_script
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
    
    setup_dns
}

# Run main function
main "$@" 