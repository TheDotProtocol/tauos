#!/bin/bash

echo "🚀 Deploying TauCloud to Railway"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not installed${NC}"
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Navigate to TauCloud directory
cd vercel-tauos-cloud

echo -e "${BLUE}📦 Setting up Railway deployment...${NC}"

# Initialize Railway project (if not already done)
if [ ! -f ".railway" ]; then
    echo -e "${YELLOW}🔧 Initializing Railway project...${NC}"
    railway init --yes
fi

# Set environment variables
echo -e "${BLUE}🔧 Setting environment variables...${NC}"
railway variables set DATABASE_URL="postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres"
railway variables set NODE_ENV="production"
railway variables set JWT_SECRET="tauos-secret-key-change-in-production"

# Deploy to Railway
echo -e "${BLUE}🚀 Deploying to Railway...${NC}"
railway up --detach

# Get deployment URL
echo -e "${BLUE}🔍 Getting deployment URL...${NC}"
railway status

echo -e "${GREEN}✅ Railway deployment initiated!${NC}"
echo -e "${YELLOW}📝 Check Railway dashboard for deployment status${NC}"
echo -e "${YELLOW}🌐 Your app will be available at the URL shown above${NC}"
echo -e "${YELLOW}🔗 You can configure custom domain (cloud.tauos.org) in Railway dashboard${NC}" 