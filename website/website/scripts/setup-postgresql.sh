#!/bin/bash

echo "🚀 Setting up PostgreSQL for TauOS Platform..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "📦 On macOS: brew install postgresql"
    echo "📦 On Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL service is not running. Please start PostgreSQL first."
    echo "🔄 On macOS: brew services start postgresql"
    echo "🔄 On Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create databases
echo "🗄️ Creating databases..."

# Create TauMail database
psql -U postgres -c "CREATE DATABASE taumail;" 2>/dev/null || echo "Database taumail already exists"
psql -U postgres -c "CREATE DATABASE taucloud;" 2>/dev/null || echo "Database taucloud already exists"

echo "✅ Databases created"

# Install dependencies
echo "📦 Installing PostgreSQL dependencies..."

cd local-development/taumail-local
npm install pg

cd ../taucloud-local
npm install pg

echo "✅ Dependencies installed"

# Set up environment variables
echo "🔧 Setting up environment variables..."

# Create .env files
cat > local-development/taumail-local/.env << EOF
DB_USER=postgres
DB_HOST=localhost
DB_NAME=taumail
DB_PASSWORD=password
DB_PORT=5432
JWT_SECRET=tauos-secret-key-change-in-production
EOF

cat > local-development/taucloud-local/.env << EOF
DB_USER=postgres
DB_HOST=localhost
DB_NAME=taucloud
DB_PASSWORD=password
DB_PORT=5432
JWT_SECRET=tauos-secret-key-change-in-production
EOF

echo "✅ Environment files created"

# Run migrations
echo "🔄 Running migrations..."

cd local-development/taumail-local
npm run migrate

cd ../taucloud-local
npm run migrate

echo "✅ Migrations completed"

echo ""
echo "🎉 PostgreSQL setup completed successfully!"
echo ""
echo "📧 TauMail Database: taumail"
echo "☁️ TauCloud Database: taucloud"
echo ""
echo "🚀 To start the services:"
echo "   cd local-development/taumail-local && npm start"
echo "   cd local-development/taucloud-local && npm start"
echo ""
echo "🔗 Access URLs:"
echo "   TauMail: http://localhost:3001"
echo "   TauCloud: http://localhost:3002"
echo ""
echo "👤 Sample users:"
echo "   Username: admin, Password: password123"
echo "   Username: testuser, Password: password123" 