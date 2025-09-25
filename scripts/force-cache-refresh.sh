#!/bin/bash

echo "🔄 Forcing Vercel Cache Refresh..."

# Add timestamp to force cache invalidation
echo "// Cache refresh: $(date)" > cache-refresh.js

# Add to git and push
echo "📤 Pushing cache refresh..."
git add cache-refresh.js
git commit -m "Force cache refresh - $(date)"
git push origin main

echo "✅ Cache refresh pushed!"
echo ""
echo "📋 Next Steps:"
echo "1. Wait 2-3 minutes for Vercel to rebuild"
echo "2. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)"
echo "3. Test the updated endpoints"
echo ""
echo "🔍 Test endpoints:"
echo "- Health: https://cloud.tauos.org/api/health"
echo "- Register: POST https://cloud.tauos.org/api/register" 