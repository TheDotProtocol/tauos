#!/bin/bash

# TauMail Production Deployment Script
set -e

echo "🚀 Starting TauMail Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p traefik
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources
mkdir -p scripts
mkdir -p ssl

# Set proper permissions
chmod +x deploy.sh

# Build and start services
print_status "Building TauMail services..."
docker-compose build

print_status "Starting TauMail stack..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."
if docker-compose ps | grep -q "Up"; then
    print_status "All services are running successfully!"
else
    print_error "Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Initialize SSL certificates
print_status "Initializing SSL certificates..."
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/html --email admin@arholdings.group --agree-tos --no-eff-email -d mail.arholdings.group

# Restart nginx to load SSL certificates
print_status "Restarting nginx with SSL certificates..."
docker-compose restart nginx

# Display service information
print_status "TauMail deployment completed successfully!"
echo ""
echo "📧 TauMail Services:"
echo "  - Webmail: https://mail.arholdings.group"
echo "  - Admin Dashboard: https://mail.arholdings.group/admin"
echo "  - Grafana Monitoring: http://localhost:3001"
echo "  - Prometheus Metrics: http://localhost:9090"
echo ""
echo "🔐 Default Admin Credentials:"
echo "  - Email: admin@arholdings.group"
echo "  - Password: (check logs for generated password)"
echo ""
echo "📊 Monitoring:"
echo "  - Grafana: http://localhost:3001 (admin/taumail_grafana_password_2025)"
echo "  - Prometheus: http://localhost:9090"
echo ""
echo "🔧 Useful Commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - Update SSL: docker-compose run --rm certbot renew" 