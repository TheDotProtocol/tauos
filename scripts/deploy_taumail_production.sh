#!/bin/bash

# TauMail Production Deployment Script
# Deploys TauMail for public access with full production configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENVIRONMENT="production"
DOMAIN="arholdings.group"
SUBDOMAIN="tauos"
MAIL_DOMAIN="mail.${SUBDOMAIN}.${DOMAIN}"
WEBMAIL_DOMAIN="webmail.${SUBDOMAIN}.${DOMAIN}"
ADMIN_EMAIL="admin@${DOMAIN}"

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
    
    # Check certbot
    if ! command -v certbot &> /dev/null; then
        missing_deps+=("certbot")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    success "Prerequisites check completed"
}

# Setup production environment
setup_production_environment() {
    log "Setting up production environment..."
    
    # Create production .env file
    cat > "$PROJECT_DIR/taumail/.env" << EOF
# TauMail Production Environment Configuration
ENVIRONMENT=production
DOMAIN=${DOMAIN}
SUBDOMAIN=${SUBDOMAIN}
MAIL_DOMAIN=${MAIL_DOMAIN}
WEBMAIL_DOMAIN=${WEBMAIL_DOMAIN}

# Admin Configuration
ADMIN_EMAIL=${ADMIN_EMAIL}

# Database
DB_PASSWORD=$(openssl rand -base64 32)
DATABASE_URL=postgresql://taumail:${DB_PASSWORD}@postgres:5432/taumail

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32)

# API Secrets
API_SECRET=$(openssl rand -base64 64)
ADMIN_SECRET=$(openssl rand -base64 64)
JWT_SECRET=$(openssl rand -base64 64)

# SSL Configuration
SSL_EMAIL=${ADMIN_EMAIL}
SSL_STAGING=false

# Mail Server Configuration
POSTFIX_HOSTNAME=${MAIL_DOMAIN}
DOVECOT_HOSTNAME=${MAIL_DOMAIN}
RSPAMD_HOSTNAME=rspamd.${MAIL_DOMAIN}

# Webmail Configuration
NEXT_PUBLIC_API_URL=https://api.${MAIL_DOMAIN}
NEXT_PUBLIC_WEBMAIL_URL=https://${WEBMAIL_DOMAIN}

# Security
ENABLE_SPF=true
ENABLE_DKIM=true
ENABLE_DMARC=true
ENABLE_ANTI_SPAM=true
ENABLE_PGP=true
ENABLE_SMIME=true

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE="0 2 * * *"

# Monitoring
PROMETHEUS_ENABLED=true
GRAFANA_ENABLED=true
ALERT_EMAIL=${ADMIN_EMAIL}
EOF

    success "Production environment configured"
}

# Build TauMail webmail for production
build_taumail_webmail() {
    log "Building TauMail webmail for production..."
    
    cd "$PROJECT_DIR/taumail/webmail"
    
    # Install dependencies
    npm ci --only=production
    
    # Build the application
    npm run build
    
    success "TauMail webmail built successfully"
}

# Deploy TauMail services
deploy_taumail_services() {
    log "Deploying TauMail services..."
    
    cd "$PROJECT_DIR/taumail"
    
    # Stop existing services if running
    docker-compose down --remove-orphans
    
    # Deploy services
    docker-compose up -d --build
    
    # Wait for services to be ready
    log "Waiting for TauMail services to be ready..."
    sleep 60
    
    # Check service health
    if docker-compose ps | grep -q "Up"; then
        success "TauMail services deployed successfully"
    else
        error "TauMail deployment failed"
        return 1
    fi
}

# Setup SSL certificates
setup_ssl_certificates() {
    log "Setting up SSL certificates..."
    
    # Create SSL directory
    mkdir -p "$PROJECT_DIR/ssl"
    
    # Generate SSL certificates for mail domains
    local domains=("${MAIL_DOMAIN}" "${WEBMAIL_DOMAIN}" "api.${MAIL_DOMAIN}")
    
    for domain in "${domains[@]}"; do
        log "Generating SSL certificate for $domain"
        
        # Use certbot to generate certificates
        certbot certonly \
            --standalone \
            --email ${ADMIN_EMAIL} \
            --agree-tos \
            --no-eff-email \
            -d $domain \
            --non-interactive
        
        # Copy certificates to project directory
        cp /etc/letsencrypt/live/$domain/fullchain.pem "$PROJECT_DIR/ssl/${domain}.crt"
        cp /etc/letsencrypt/live/$domain/privkey.pem "$PROJECT_DIR/ssl/${domain}.key"
    done
    
    success "SSL certificates generated"
}

# Setup DNS records
setup_dns_records() {
    log "Setting up DNS records..."
    
    local server_ip=$(curl -s ifconfig.me)
    
    cat << EOF
Please add the following DNS records in your Squarespace domain manager:

A Records:
- ${MAIL_DOMAIN} -> ${server_ip}
- ${WEBMAIL_DOMAIN} -> ${server_ip}
- api.${MAIL_DOMAIN} -> ${server_ip}

MX Records:
- ${MAIL_DOMAIN} -> ${MAIL_DOMAIN} (priority 10)

TXT Records (SPF):
- ${MAIL_DOMAIN} -> "v=spf1 mx a ip4:${server_ip} ~all"

TXT Records (DKIM):
- default._domainkey.${MAIL_DOMAIN} -> "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"

TXT Records (DMARC):
- _dmarc.${MAIL_DOMAIN} -> "v=DMARC1; p=quarantine; rua=mailto:dmarc@${MAIL_DOMAIN}; ruf=mailto:dmarc@${MAIL_DOMAIN}"

CNAME Records:
- webmail.${MAIL_DOMAIN} -> ${MAIL_DOMAIN}
- api.${MAIL_DOMAIN} -> ${MAIL_DOMAIN}

Port Configuration:
- SMTP: 587 (STARTTLS)
- SMTP: 465 (SSL)
- IMAP: 993 (SSL)
- POP3: 995 (SSL)

EOF
}

# Setup backup system
setup_backup_system() {
    log "Setting up backup system..."
    
    # Create backup script
    cat > "$PROJECT_DIR/scripts/backup_taumail.sh" << 'EOF'
#!/bin/bash

# TauMail Backup Script

set -e

BACKUP_DIR="/var/backups/taumail"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="taumail_backup_$DATE.tar.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Stop services temporarily
cd /path/to/tauos/taumail
docker-compose stop

# Create backup
tar -czf $BACKUP_DIR/$BACKUP_FILE \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=logs \
    .

# Restart services
docker-compose start

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "taumail_backup_*.tar.gz" -mtime +30 -delete

echo "Backup created: $BACKUP_DIR/$BACKUP_FILE"
EOF

    chmod +x "$PROJECT_DIR/scripts/backup_taumail.sh"
    
    # Add to crontab for daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * $PROJECT_DIR/scripts/backup_taumail.sh") | crontab -
    
    success "Backup system configured"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create monitoring configuration
    cat > "$PROJECT_DIR/monitoring/taumail_prometheus.yml" << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'taumail'
    static_configs:
      - targets: ['taumail-postfix:25', 'taumail-dovecot:143', 'taumail-webmail:3000']

  - job_name: 'taumail-webmail'
    static_configs:
      - targets: ['taumail-webmail:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s

  - job_name: 'taumail-mail-server'
    static_configs:
      - targets: ['taumail-postfix:25', 'taumail-dovecot:143', 'taumail-dovecot:993']
    scrape_interval: 60s
EOF

    success "Monitoring configured"
}

# Test mail server functionality
test_mail_server() {
    log "Testing mail server functionality..."
    
    # Test SMTP
    if telnet ${MAIL_DOMAIN} 587 < /dev/null 2>&1 | grep -q "220"; then
        success "SMTP server is responding"
    else
        warning "SMTP server may not be responding"
    fi
    
    # Test IMAP
    if telnet ${MAIL_DOMAIN} 993 < /dev/null 2>&1 | grep -q "OK"; then
        success "IMAP server is responding"
    else
        warning "IMAP server may not be responding"
    fi
    
    # Test webmail
    if curl -f -s "https://${WEBMAIL_DOMAIN}/api/health" > /dev/null; then
        success "Webmail is accessible"
    else
        warning "Webmail may not be accessible"
    fi
}

# Create landing page configuration
create_landing_page_config() {
    log "Creating landing page configuration..."
    
    cat > "$PROJECT_DIR/landing_page_config.md" << EOF
# TauOS Landing Page Configuration

## Squarespace Configuration

### Page Structure
- URL: arholdings.group/tauos
- Title: "TauOS - Privacy-First Operating System"
- Description: "Secure, lightweight, and privacy-focused operating system"

### Content Sections

#### 1. Hero Section
- Headline: "TauOS - Your Privacy, Your Control"
- Subheadline: "A secure, lightweight operating system built for the modern world"
- CTA Button: "Join Beta" (links to Mailchimp form)

#### 2. Key Features
- **TauMail**: Self-hosted email with Gmail-style interface
- **OTA Updates**: Automatic security and feature updates
- **Custom Kernel**: Optimized for security and performance
- **Lightweight**: Minimal resource usage, maximum efficiency

#### 3. Technology Stack
- Built with Rust, C, and modern web technologies
- GTK4 for native desktop experience
- Cross-platform compatibility (Linux, macOS, Windows)
- Mobile support (Android, iOS)

#### 4. Security Features
- End-to-end encryption
- Zero telemetry
- Sandboxed applications
- Secure boot and updates

#### 5. Call to Action
- "Download TauOS ISO" (when ready)
- "Try TauMail Webmail" (links to webmail)
- "Join Beta Program" (Mailchimp signup)

### Mailchimp Integration
- Form ID: [TO BE CREATED]
- List: "TauOS Beta Users"
- Fields: Name, Email, Use Case, Platform Preference

### Analytics
- Google Analytics (optional)
- Privacy-focused analytics (no personal data collection)

EOF

    success "Landing page configuration created"
}

# Health check
health_check() {
    log "Performing health check..."
    
    local services=("postfix" "dovecot" "webmail" "rspamd" "redis" "postgres")
    local failed_services=()
    
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "${service}.*Up"; then
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

# Main deployment function
main() {
    log "Starting TauMail production deployment"
    
    check_prerequisites
    setup_production_environment
    build_taumail_webmail
    deploy_taumail_services
    setup_ssl_certificates
    setup_backup_system
    setup_monitoring
    test_mail_server
    create_landing_page_config
    health_check
    
    log "TauMail production deployment completed successfully!"
    log ""
    log "Access your TauMail services at:"
    log "  Webmail: https://${WEBMAIL_DOMAIN}"
    log "  Mail Server: ${MAIL_DOMAIN}"
    log "  Admin Dashboard: https://${WEBMAIL_DOMAIN}/admin"
    log "  API Documentation: https://api.${MAIL_DOMAIN}/docs"
    log ""
    log "Next steps:"
    log "  1. Configure DNS records in Squarespace"
    log "  2. Set up landing page at arholdings.group/tauos"
    log "  3. Create Mailchimp form for beta signup"
    log "  4. Test email functionality"
    log "  5. Begin internal beta testing"
    
    setup_dns_records
}

# Run main function
main "$@" 