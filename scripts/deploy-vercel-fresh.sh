#!/bin/bash

echo "🚀 Deploying Fresh Vercel Project for TauCloud"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# Navigate to TauCloud directory
cd vercel-tauos-cloud

echo "🔧 Setting up fresh Vercel project..."

# Remove existing .vercel directory if it exists
if [ -d ".vercel" ]; then
    echo "🗑️  Removing existing Vercel configuration..."
    rm -rf .vercel
fi

# Create fresh vercel.json
cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/app.js"
    }
  ],
  "env": {
    "DATABASE_URL": "postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres",
    "NODE_ENV": "production",
    "JWT_SECRET": "tauos-secret-key-change-in-production"
  }
}
EOF

echo "📝 Created fresh vercel.json configuration"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo "✅ Fresh Vercel deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Find your new project"
echo "3. Go to Settings → Domains"
echo "4. Add custom domain: cloud.tauos.org"
echo "5. Update DNS records in Squarespace"
echo ""
echo "🌐 Your new Vercel URL will be shown above" 