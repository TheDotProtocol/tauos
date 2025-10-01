#!/bin/bash

echo "🚀 Setting up TauOS Monitoring Stack..."

# Create necessary directories
mkdir -p grafana/dashboards
mkdir -p prometheus

# Set permissions
chmod +x setup-monitoring.sh

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Start the monitoring stack
echo "📊 Starting Prometheus and Grafana..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Monitoring stack is running!"
    echo ""
    echo "📊 Access URLs:"
    echo "  - Grafana: http://localhost:3001 (admin/tauos2025)"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Node Exporter: http://localhost:9100"
    echo "  - TauOS Monitoring: http://localhost:3000/monitoring"
    echo ""
    echo "🔧 To stop the monitoring stack:"
    echo "  docker-compose down"
    echo ""
    echo "🔧 To view logs:"
    echo "  docker-compose logs -f"
else
    echo "❌ Failed to start monitoring stack. Check logs with: docker-compose logs"
    exit 1
fi
