#!/bin/bash

echo "🔍 Testing Railway Database Connection..."

# Test direct connection
echo "📡 Testing direct connection to Supabase..."
curl -s "https://db.tviqcormikopltejomkc.supabase.co:5432" || echo "❌ Direct connection failed (expected)"

# Test pooler connection
echo "📡 Testing pooler connection..."
curl -s "https://aws-0-ap-southeast-1.pooler.supabase.com:6543" || echo "❌ Pooler connection failed"

# Test with psql if available
if command -v psql &> /dev/null; then
    echo "🐘 Testing with psql..."
    PGPASSWORD="Ak1233@@5" psql -h aws-0-ap-southeast-1.pooler.supabase.com -p 6543 -U postgres.tviqcormikopltejomkc -d postgres -c "SELECT NOW();" || echo "❌ psql connection failed"
else
    echo "⚠️  psql not available, skipping direct database test"
fi

echo "✅ Database connection test complete" 