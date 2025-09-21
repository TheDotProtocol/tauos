#!/bin/bash

# TauOS Server Startup Script
# This script starts all TauOS services in the correct order

echo "🚀 Starting TauOS Ecosystem..."
echo "================================"

# Kill any existing processes
echo "🛑 Stopping existing servers..."
pkill -f "node app.js" 2>/dev/null
pkill -f "npm start" 2>/dev/null
pkill -f "node app-simple.js" 2>/dev/null
pkill -f "node main-server.js" 2>/dev/null
sleep 2

# Start main landing page (port 3000)
echo "🌐 Starting Main Landing Page (port 3000)..."
cd /Users/macbook/Desktop/tauos && node main-server.js &
sleep 2

# Start TauMail (port 3001)
echo "📧 Starting TauMail (port 3001)..."
cd /Users/macbook/Desktop/tauos/vercel-tauos-mail && node app.js &
sleep 2

# Start TauCloud (port 3002)
echo "☁️ Starting TauCloud (port 3002)..."
cd /Users/macbook/Desktop/tauos/vercel-tauos-cloud && node app.js &
sleep 2

# Start TauID (port 3003)
echo "🆔 Starting TauID (port 3003)..."
cd /Users/macbook/Desktop/tauos/vercel-tauos-id && node app.js &
sleep 2

# Start TauStore (port 3004)
echo "🛍️ Starting TauStore (port 3004)..."
cd /Users/macbook/Desktop/tauos/vercel-tauos-store && node app.js &
sleep 2

# Start TauBrowser (port 3005)
echo "🌐 Starting TauBrowser (port 3005)..."
cd /Users/macbook/Desktop/tauos/vercel-tauos-browser && node app-simple.js &
sleep 2

# Start Desktop UI (port 3006)
echo "🖥️ Starting Desktop UI (port 3006)..."
cd /Users/macbook/Desktop/tauos/desktop-ui && npm start &
sleep 2

# Start Mobile UI (port 3007)
echo "📱 Starting Mobile UI (port 3007)..."
cd /Users/macbook/Desktop/tauos/mobile-phone-ui && npm start &
sleep 2

echo ""
echo "✅ All TauOS services started!"
echo "================================"
echo "🌐 Main Landing: http://localhost:3000"
echo "📧 TauMail: http://localhost:3001"
echo "☁️ TauCloud: http://localhost:3002"
echo "🆔 TauID: http://localhost:3003"
echo "🛍️ TauStore: http://localhost:3004"
echo "🌐 TauBrowser: http://localhost:3005"
echo "🖥️ Desktop UI: http://localhost:3006"
echo "📱 Mobile UI: http://localhost:3007"
echo ""
echo "🔍 Check service status: http://localhost:3000/api/services/status"
echo "📊 Health check: http://localhost:3000/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user input to stop servers
trap 'echo ""; echo "🛑 Stopping all servers..."; pkill -f "node app.js"; pkill -f "npm start"; pkill -f "node app-simple.js"; pkill -f "node main-server.js"; echo "✅ All servers stopped"; exit 0' INT

# Keep script running
while true; do
    sleep 1
done
