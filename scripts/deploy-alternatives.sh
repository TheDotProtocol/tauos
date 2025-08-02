#!/bin/bash

echo "🚀 TauOS Alternative Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to deploy to Railway
deploy_railway() {
    echo -e "${BLUE}📦 Deploying to Railway...${NC}"
    
    if command -v railway &> /dev/null; then
        cd vercel-tauos-cloud
        railway login --browserless
        railway init --yes
        railway up --detach
        echo -e "${GREEN}✅ Railway deployment initiated${NC}"
    else
        echo -e "${RED}❌ Railway CLI not installed${NC}"
        echo "Install with: npm install -g @railway/cli"
    fi
}

# Function to deploy to Render
deploy_render() {
    echo -e "${BLUE}📦 Deploying to Render...${NC}"
    
    # Create render.yaml for automatic deployment
    cat > render.yaml << EOF
services:
  - type: web
    name: tauos-cloud
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        value: postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres
EOF
    
    echo -e "${GREEN}✅ Render configuration created${NC}"
    echo "Deploy manually at: https://render.com"
}

# Function to deploy to Fly.io
deploy_fly() {
    echo -e "${BLUE}📦 Deploying to Fly.io...${NC}"
    
    if command -v fly &> /dev/null; then
        cd vercel-tauos-cloud
        fly launch --no-deploy
        fly deploy
        echo -e "${GREEN}✅ Fly.io deployment completed${NC}"
    else
        echo -e "${RED}❌ Fly CLI not installed${NC}"
        echo "Install with: curl -L https://fly.io/install.sh | sh"
    fi
}

# Function to deploy to Netlify
deploy_netlify() {
    echo -e "${BLUE}📦 Deploying to Netlify...${NC}"
    
    if command -v netlify &> /dev/null; then
        cd vercel-tauos-cloud
        netlify deploy --prod --dir=public
        echo -e "${GREEN}✅ Netlify deployment completed${NC}"
    else
        echo -e "${RED}❌ Netlify CLI not installed${NC}"
        echo "Install with: npm install -g netlify-cli"
    fi
}

# Function to use Vercel Dashboard
deploy_vercel_dashboard() {
    echo -e "${BLUE}📦 Using Vercel Dashboard...${NC}"
    echo -e "${YELLOW}📋 Manual Steps:${NC}"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Click 'New Project'"
    echo "3. Import from GitHub: TheDotProtocol/tauos"
    echo "4. Set root directory to: vercel-tauos-cloud"
    echo "5. Set build command: npm install"
    echo "6. Set output directory: public"
    echo "7. Add environment variables:"
    echo "   - DATABASE_URL: postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres"
    echo "   - NODE_ENV: production"
    echo "8. Deploy"
}

# Main menu
echo -e "${YELLOW}Choose deployment platform:${NC}"
echo "1) Railway.app (Recommended - No rate limits)"
echo "2) Render.com (Reliable, good free tier)"
echo "3) Fly.io (Global deployment)"
echo "4) Netlify (Serverless functions)"
echo "5) Vercel Dashboard (Manual deployment)"
echo "6) All platforms (Deploy to multiple)"

read -p "Enter choice (1-6): " choice

case $choice in
    1)
        deploy_railway
        ;;
    2)
        deploy_render
        ;;
    3)
        deploy_fly
        ;;
    4)
        deploy_netlify
        ;;
    5)
        deploy_vercel_dashboard
        ;;
    6)
        echo -e "${BLUE}🚀 Deploying to all platforms...${NC}"
        deploy_railway
        deploy_render
        deploy_fly
        deploy_netlify
        deploy_vercel_dashboard
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo -e "${YELLOW}📝 Check the platform dashboard for deployment status${NC}" 