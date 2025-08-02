#!/bin/bash

echo "🔄 Forcing Fresh Vercel Deployment..."

# Navigate to TauCloud directory
cd vercel-tauos-cloud

# Remove any cached files
echo "🧹 Cleaning cache..."
rm -rf .vercel
rm -rf node_modules
rm -rf .next

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Create a timestamp to force cache invalidation
echo "⏰ Adding timestamp to force cache invalidation..."
echo "// Force deployment: $(date)" > force-deploy.js

# Add to git and push
echo "📤 Pushing to trigger deployment..."
git add .
git commit -m "Force fresh deployment with PostgreSQL integration - $(date)"
git push origin main

echo "✅ Force deployment triggered!"
echo ""
echo "📋 Next Steps:"
echo "1. Check Vercel Dashboard for deployment status"
echo "2. Wait for build to complete"
echo "3. Test the updated endpoints"
echo ""
echo "🔍 Test endpoints:"
echo "- Health: https://cloud.tauos.org/api/health"
echo "- Register: POST https://cloud.tauos.org/api/register"
echo "- Login: POST https://cloud.tauos.org/api/login" 