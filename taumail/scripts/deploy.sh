#!/bin/bash

# TauMail Deployment Script
# Deploys the complete TauMail system with all components

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
DOMAIN="mail.tauos.org"
ADMIN_EMAIL="admin@tauos.org"

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
    
    # Check if domain is accessible
    if ! nslookup $DOMAIN &> /dev/null; then
        warning "Domain $DOMAIN is not accessible. Please ensure DNS is configured."
    fi
    
    success "Prerequisites check completed"
}

# Setup environment
setup_environment() {
    log "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        cat > "$PROJECT_DIR/.env" << EOF
# TauMail Environment Configuration
ENVIRONMENT=$ENVIRONMENT
DOMAIN=$DOMAIN
ADMIN_EMAIL=$ADMIN_EMAIL

# Database
DB_PASSWORD=$(openssl rand -base64 32)
DATABASE_URL=postgresql://taumail:${DB_PASSWORD}@postgres:5432/taumail

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32)

# API Secrets
API_SECRET=$(openssl rand -base64 64)
ADMIN_SECRET=$(openssl rand -base64 64)

# SSL Configuration
SSL_EMAIL=$ADMIN_EMAIL
SSL_STAGING=false

# Monitoring
PROMETHEUS_PASSWORD=$(openssl rand -base64 32)
GRAFANA_PASSWORD=$(openssl rand -base64 32)
EOF
        success "Created .env file"
    else
        log ".env file already exists"
    fi
    
    # Create necessary directories
    mkdir -p "$PROJECT_DIR/server/ssl"
    mkdir -p "$PROJECT_DIR/config/nginx"
    mkdir -p "$PROJECT_DIR/config/monitoring"
    mkdir -p "$PROJECT_DIR/logs"
    mkdir -p "$PROJECT_DIR/backups"
    
    success "Environment setup completed"
}

# Configure SSL certificates
setup_ssl() {
    log "Setting up SSL certificates..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # Generate SSL certificates using Let's Encrypt
        docker-compose run --rm certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email $ADMIN_EMAIL \
            --agree-tos \
            --no-eff-email \
            -d $DOMAIN \
            -d api.tauos.org
            
        success "SSL certificates generated"
    else
        # Generate self-signed certificates for development
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$PROJECT_DIR/server/ssl/tauos.org.key" \
            -out "$PROJECT_DIR/server/ssl/tauos.org.crt" \
            -subj "/C=US/ST=State/L=City/O=TauOS/CN=$DOMAIN"
            
        success "Self-signed SSL certificates generated for development"
    fi
}

# Build and deploy services
deploy_services() {
    log "Deploying TauMail services..."
    
    # Build images
    docker-compose build
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_service_health
    
    success "Services deployed successfully"
}

# Check service health
check_service_health() {
    log "Checking service health..."
    
    local services=("postfix" "dovecot" "rspamd" "redis" "webmail" "admin" "api" "nginx")
    local failed_services=()
    
    for service in "${services[@]}"; do
        if docker-compose ps $service | grep -q "Up"; then
            log "✓ $service is running"
        else
            error "✗ $service is not running"
            failed_services+=($service)
        fi
    done
    
    if [ ${#failed_services[@]} -gt 0 ]; then
        error "Some services failed to start: ${failed_services[*]}"
        return 1
    fi
    
    success "All services are healthy"
}

# Setup DNS records
setup_dns() {
    log "Setting up DNS records..."
    
    cat << EOF
Please add the following DNS records for your domains:

MX Records:
- $DOMAIN -> mail.tauos.org (priority 10)

A Records:
- mail.tauos.org -> $(curl -s ifconfig.me)
- api.tauos.org -> $(curl -s ifconfig.me)

TXT Records (SPF):
- $DOMAIN -> "v=spf1 mx a ip4:$(curl -s ifconfig.me) ~all"

TXT Records (DMARC):
- _dmarc.$DOMAIN -> "v=DMARC1; p=quarantine; rua=mailto:dmarc@$DOMAIN; ruf=mailto:dmarc@$DOMAIN"

DKIM Records:
- taumail._domainkey.$DOMAIN -> (will be generated after first email)

EOF
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create Prometheus configuration
    cat > "$PROJECT_DIR/config/monitoring/prometheus.yml" << EOF
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

  - job_name: 'postfix'
    static_configs:
      - targets: ['postfix:25']

  - job_name: 'dovecot'
    static_configs:
      - targets: ['dovecot:143']

  - job_name: 'rspamd'
    static_configs:
      - targets: ['rspamd:11332']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
EOF

    # Create Grafana dashboard configuration
    mkdir -p "$PROJECT_DIR/config/monitoring/grafana/dashboards"
    
    success "Monitoring setup completed"
}

# Create backup script
create_backup_script() {
    log "Creating backup script..."
    
    cat > "$PROJECT_DIR/scripts/backup.sh" << 'EOF'
#!/bin/bash

# TauMail Backup Script

set -e

BACKUP_DIR="/var/backups/taumail"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="taumail_backup_$DATE.tar.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Stop services temporarily
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

    chmod +x "$PROJECT_DIR/scripts/backup.sh"
    success "Backup script created"
}

# Create restore script
create_restore_script() {
    log "Creating restore script..."
    
    cat > "$PROJECT_DIR/scripts/restore.sh" << 'EOF'
#!/bin/bash

# TauMail Restore Script

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
docker-compose stop

# Restore from backup
tar -xzf "$BACKUP_FILE"

# Restart services
docker-compose start

echo "Restore completed from: $BACKUP_FILE"
EOF

    chmod +x "$PROJECT_DIR/scripts/restore.sh"
    success "Restore script created"
}

# Main deployment function
main() {
    log "Starting TauMail deployment for environment: $ENVIRONMENT"
    
    check_prerequisites
    setup_environment
    setup_ssl
    deploy_services
    setup_monitoring
    create_backup_script
    create_restore_script
    
    log "Deployment completed successfully!"
    log "Access your TauMail at: https://$DOMAIN"
    log "Admin panel: https://$DOMAIN/admin"
    log "API documentation: https://api.tauos.org/docs"
    
    setup_dns
}

# Run main function
main "$@" 