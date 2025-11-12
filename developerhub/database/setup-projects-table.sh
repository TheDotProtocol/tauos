#!/bin/bash

# Setup projects table for Developer Hub
# This script creates the projects table if it doesn't exist

echo "🚀 Setting up projects table..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Checking for .env.local..."
    
    if [ -f "../frontend/.env.local" ]; then
        export $(cat ../frontend/.env.local | grep -v '^#' | xargs)
    fi
    
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL not found. Please set it in .env.local or as an environment variable."
        echo ""
        echo "Example:"
        echo "DATABASE_URL=postgresql://username:password@localhost:5432/tauos"
        exit 1
    fi
fi

# Run SQL script
echo "📝 Creating projects table..."
psql "$DATABASE_URL" -f create-projects-table.sql

if [ $? -eq 0 ]; then
    echo "✅ Projects table created successfully!"
else
    echo "❌ Failed to create projects table."
    echo ""
    echo "Common issues:"
    echo "1. PostgreSQL is not running"
    echo "2. Database doesn't exist"
    echo "3. User doesn't have permissions"
    echo ""
    echo "To fix:"
    echo "1. Start PostgreSQL: brew services start postgresql"
    echo "2. Create database: createdb tauos"
    echo "3. Check DATABASE_URL in .env.local"
    exit 1
fi

echo ""
echo "✅ Setup complete!"

