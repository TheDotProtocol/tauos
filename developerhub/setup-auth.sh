#!/bin/bash

# TauCore™ Developer Hub - Authentication System Setup
# This script sets up the authentication system with all dependencies

echo "🚀 Setting up TauCore™ Developer Hub Authentication System..."

# Navigate to frontend directory
cd developerhub/frontend

# Install required dependencies
echo "📦 Installing dependencies..."
npm install pg @types/pg bcryptjs @types/bcryptjs jsonwebtoken @types/jsonwebtoken

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taucore_devhub
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-this-in-production
REFRESH_TOKEN_EXPIRES_IN=7d

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
EOF
    echo "✅ Created .env.local file"
else
    echo "⚠️  .env.local already exists, skipping creation"
fi

# Test database connection
echo "🔍 Testing database connection..."
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'taucore_devhub',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
});

pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
"

# Create test script for authentication
echo "🧪 Creating authentication test script..."
cat > test-auth.js << 'EOF'
const { testConnection, userRepository, sessionRepository } = require('./src/lib/database');

async function testAuth() {
  console.log('🧪 Testing Authentication System...');
  
  // Test database connection
  console.log('1. Testing database connection...');
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Database connection failed');
    return;
  }
  console.log('✅ Database connection successful');
  
  // Test user repository
  console.log('2. Testing user repository...');
  try {
    const users = await userRepository.findByEmail('admin@tauos.org');
    if (users) {
      console.log('✅ User repository working');
    } else {
      console.log('⚠️  No users found (run seed.sql first)');
    }
  } catch (error) {
    console.error('❌ User repository error:', error.message);
  }
  
  console.log('🎉 Authentication system test complete!');
}

testAuth().catch(console.error);
EOF

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run the clean SQL files in your database:"
echo "   - developerhub/database/schema-clean.sql"
echo "   - developerhub/database/seed-clean.sql"
echo ""
echo "2. Test the authentication system:"
echo "   node test-auth.js"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Test the API endpoints:"
echo "   - POST /api/auth/register"
echo "   - POST /api/auth/login"
echo "   - GET /api/auth/me"
echo ""
echo "🚀 Ready to go!"
