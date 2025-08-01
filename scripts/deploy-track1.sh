#!/bin/bash

# TauOS Track 1 Infrastructure Deployment Script
# Deploys TauMail, TauCloud, TauID, TauVoice, and Compliance Dashboard

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        warning "Running as root. Consider running as a regular user with sudo privileges."
    fi
    
    log "Prerequisites check completed."
}

# Create necessary directories
setup_directories() {
    log "Setting up directories..."
    
    mkdir -p tauos/taumail/{config,logs,ssl,backups}
    mkdir -p tauos/taucloud/{config,logs,ssl,backups}
    mkdir -p tauos/tauid/{config,logs,ssl,backups,did-documents}
    mkdir -p tauos/tauvoice/{config,logs,models,audio}
    mkdir -p tauos/compliance/{config,logs,ssl,backups}
    
    log "Directories created successfully."
}

# Deploy TauMail
deploy_taumail() {
    log "Deploying TauMail..."
    
    cd tauos/taumail
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        error "TauMail docker-compose.yml not found."
    fi
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# TauMail Environment Variables
TAUMAIL_DOMAIN=mail.tauos.org
TAUMAIL_SECRET=taumail_secret_2025
DATABASE_URL=postgresql://taumail:taumail_secure_password_2025@postgres:5432/taumail
REDIS_URL=redis://:taumail_redis_password_2025@redis:6379
JWT_SECRET=taumail_jwt_secret_2025
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=taumail_refresh_secret_2025
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=https://mail.tauos.org
EOF
    fi
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for TauMail services to be ready..."
    sleep 30
    
    # Check service health
    if curl -f http://localhost:3000/health &> /dev/null; then
        log "TauMail deployed successfully!"
    else
        warning "TauMail health check failed. Check logs with: docker-compose logs"
    fi
    
    cd ../..
}

# Deploy TauCloud
deploy_taucloud() {
    log "Deploying TauCloud..."
    
    cd tauos/taucloud
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        error "TauCloud docker-compose.yml not found."
    fi
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# TauCloud Environment Variables
TAUCLOUD_DOMAIN=cloud.tauos.org
TAUCLOUD_SECRET=taucloud_secret_2025
DATABASE_URL=postgresql://taucloud:taucloud_secure_password_2025@postgres:5432/taucloud
REDIS_URL=redis://:taucloud_redis_password_2025@redis:6379
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=taucloud_access_key
MINIO_SECRET_KEY=taucloud_secret_key_2025
MINIO_BUCKET=taucloud-files
JWT_SECRET=taucloud_jwt_secret_2025
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=taucloud_refresh_secret_2025
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=https://cloud.tauos.org
EOF
    fi
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for TauCloud services to be ready..."
    sleep 30
    
    # Check service health
    if curl -f http://localhost:3000/health &> /dev/null; then
        log "TauCloud deployed successfully!"
    else
        warning "TauCloud health check failed. Check logs with: docker-compose logs"
    fi
    
    cd ../..
}

# Deploy TauID
deploy_tauid() {
    log "Deploying TauID..."
    
    cd tauos/tauid
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        error "TauID docker-compose.yml not found."
    fi
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# TauID Environment Variables
TAUID_DOMAIN=tauid.tauos.org
TAUID_SECRET=tauid_secret_2025
DATABASE_URL=postgresql://tauid:tauid_secure_password_2025@postgres:5432/tauid
REDIS_URL=redis://:tauid_redis_password_2025@redis:6379
JWT_SECRET=tauid_jwt_secret_2025
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=tauid_refresh_secret_2025
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=https://tauid.tauos.org
EOF
    fi
    
    # Create DID documents directory
    mkdir -p did-documents/.well-known
    
    # Create sample DID document
    cat > did-documents/.well-known/did.json << EOF
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:tauos.org",
  "verificationMethod": [
    {
      "id": "did:web:tauos.org#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:web:tauos.org",
      "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
    }
  ],
  "authentication": ["did:web:tauos.org#key-1"],
  "service": [
    {
      "id": "did:web:tauos.org#tauid",
      "type": "TauIDService",
      "serviceEndpoint": "https://tauid.tauos.org"
    }
  ]
}
EOF
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for TauID services to be ready..."
    sleep 30
    
    # Check service health
    if curl -f http://localhost:3000/health &> /dev/null; then
        log "TauID deployed successfully!"
    else
        warning "TauID health check failed. Check logs with: docker-compose logs"
    fi
    
    cd ../..
}

# Deploy TauVoice
deploy_tauvoice() {
    log "Deploying TauVoice..."
    
    cd tauos/tauvoice
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        error "TauVoice docker-compose.yml not found."
    fi
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# TauVoice Environment Variables
TAUVOICE_OPENROUTER_API_KEY=your_openrouter_api_key_here
TAUVOICE_AUDIO_DEVICE=default
TAUVOICE_LANGUAGE=en-US
TAUVOICE_MODEL_PATH=/app/models/vosk-model-small-en-us
TAUVOICE_GPU=false
TAUVOICE_DOMAIN=tauvoice.tauos.org
TAUVOICE_SECRET=tauvoice_secret_2025
DATABASE_URL=postgresql://tauvoice:tauvoice_secure_password_2025@postgres:5432/tauvoice
REDIS_URL=redis://:tauvoice_redis_password_2025@redis:6379
JWT_SECRET=tauvoice_jwt_secret_2025
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=tauvoice_refresh_secret_2025
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=https://tauvoice.tauos.org
EOF
    fi
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for TauVoice services to be ready..."
    sleep 30
    
    # Check service health
    if curl -f http://localhost:3000/health &> /dev/null; then
        log "TauVoice deployed successfully!"
    else
        warning "TauVoice health check failed. Check logs with: docker-compose logs"
    fi
    
    cd ../..
}

# Deploy Compliance Dashboard
deploy_compliance() {
    log "Deploying Compliance Dashboard..."
    
    cd tauos/compliance
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        error "Compliance docker-compose.yml not found."
    fi
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Compliance Environment Variables
COMPLIANCE_DOMAIN=compliance.tauos.org
COMPLIANCE_SECRET=compliance_secret_2025
DATABASE_URL=postgresql://compliance:compliance_secure_password_2025@postgres:5432/compliance
REDIS_URL=redis://:compliance_redis_password_2025@redis:6379
JWT_SECRET=compliance_jwt_secret_2025
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=compliance_refresh_secret_2025
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=https://compliance.tauos.org
GDPR_ENABLED=true
DPDP_ENABLED=true
EOF
    fi
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for Compliance services to be ready..."
    sleep 30
    
    # Check service health
    if curl -f http://localhost:3000/health &> /dev/null; then
        log "Compliance Dashboard deployed successfully!"
    else
        warning "Compliance health check failed. Check logs with: docker-compose logs"
    fi
    
    cd ../..
}

# Setup DNS records
setup_dns() {
    log "Setting up DNS records..."
    
    info "Please add the following DNS records to your domain provider:"
    echo ""
    echo "A Records:"
    echo "  mail.tauos.org → $(curl -s ifconfig.me)"
    echo "  cloud.tauos.org → $(curl -s ifconfig.me)"
    echo "  tauid.tauos.org → $(curl -s ifconfig.me)"
    echo "  tauvoice.tauos.org → $(curl -s ifconfig.me)"
    echo "  compliance.tauos.org → $(curl -s ifconfig.me)"
    echo ""
    echo "CNAME Records:"
    echo "  www.mail.tauos.org → mail.tauos.org"
    echo "  www.cloud.tauos.org → cloud.tauos.org"
    echo "  www.tauid.tauos.org → tauid.tauos.org"
    echo "  www.tauvoice.tauos.org → tauvoice.tauos.org"
    echo "  www.compliance.tauos.org → compliance.tauos.org"
    echo ""
    
    read -p "Press Enter after adding DNS records..."
}

# Generate SSL certificates
generate_ssl() {
    log "Generating SSL certificates..."
    
    # Create SSL directory
    mkdir -p tauos/ssl
    
    # Generate certificates for each service
    services=("mail" "cloud" "tauid" "tauvoice" "compliance")
    
    for service in "${services[@]}"; do
        log "Generating SSL certificate for ${service}.tauos.org..."
        
        # Use Let's Encrypt certbot
        docker run --rm \
            -v "$(pwd)/tauos/ssl:/etc/letsencrypt" \
            -v "$(pwd)/tauos/ssl:/var/lib/letsencrypt" \
            certbot/certbot certonly \
            --webroot \
            --webroot-path=/var/www/html \
            --email admin@tauos.org \
            --agree-tos \
            --no-eff-email \
            -d "${service}.tauos.org"
    done
    
    log "SSL certificates generated successfully!"
}

# Health check all services
health_check() {
    log "Performing health check on all services..."
    
    services=(
        "TauMail:https://mail.tauos.org/health"
        "TauCloud:https://cloud.tauos.org/health"
        "TauID:https://tauid.tauos.org/health"
        "TauVoice:https://tauvoice.tauos.org/health"
        "Compliance:https://compliance.tauos.org/health"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r name url <<< "$service"
        log "Checking $name..."
        
        if curl -f "$url" &> /dev/null; then
            log "✅ $name is healthy"
        else
            warning "❌ $name health check failed"
        fi
    done
}

# Main deployment function
main() {
    log "Starting TauOS Track 1 Infrastructure Deployment..."
    
    # Check prerequisites
    check_prerequisites
    
    # Setup directories
    setup_directories
    
    # Deploy services
    deploy_taumail
    deploy_taucloud
    deploy_tauid
    deploy_tauvoice
    deploy_compliance
    
    # Setup DNS
    setup_dns
    
    # Generate SSL certificates
    generate_ssl
    
    # Health check
    health_check
    
    log "🎉 Track 1 Infrastructure Deployment Completed!"
    
    echo ""
    echo "=== Deployment Summary ==="
    echo "✅ TauMail: https://mail.tauos.org"
    echo "✅ TauCloud: https://cloud.tauos.org"
    echo "✅ TauID: https://tauid.tauos.org"
    echo "✅ TauVoice: https://tauvoice.tauos.org"
    echo "✅ Compliance: https://compliance.tauos.org"
    echo ""
    echo "=== Next Steps ==="
    echo "1. Configure DNS records as shown above"
    echo "2. Wait for DNS propagation (up to 24 hours)"
    echo "3. Test all services"
    echo "4. Configure TauOS desktop integration"
    echo ""
}

# Run main function
main "$@" 