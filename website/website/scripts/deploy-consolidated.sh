#!/bin/bash

# TauOS Consolidated Deployment Script
# This script deploys the consolidated TauOS system to Vercel

echo "🚀 Starting TauOS Consolidated Deployment..."

# Set environment variables
export NODE_ENV=production

# Navigate to website directory
cd website

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌍 Website: https://tauos.vercel.app"
    echo "🔍 Health Check: https://tauos.vercel.app/api/health"
else
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🎉 TauOS Consolidated Deployment Complete!"
