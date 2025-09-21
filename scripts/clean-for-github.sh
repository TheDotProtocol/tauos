#!/bin/bash

echo "🧹 Cleaning TauOS repository for GitHub..."

# Remove all environment files
echo "Removing environment files..."
find . -name "*.env*" -type f -not -path "./env/vercel-production.env" -delete
find . -name ".env*" -type f -delete

# Remove log files
echo "Removing log files..."
find . -name "*.log" -type f -delete
find . -name "logs" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove node_modules (will be reinstalled)
echo "Removing node_modules..."
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove build artifacts
echo "Removing build artifacts..."
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "build" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove cache directories
echo "Removing cache directories..."
find . -name ".cache" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".parcel-cache" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove temporary files
echo "Removing temporary files..."
find . -name "*.tmp" -type f -delete
find . -name "*.temp" -type f -delete
find . -name ".DS_Store" -type f -delete
find . -name "Thumbs.db" -type f -delete

# Remove sensitive documentation
echo "Removing sensitive documentation..."
rm -rf docs/sensitive/ 2>/dev/null || true
rm -rf docs/private/ 2>/dev/null || true
find . -name "*secret*" -type f -delete
find . -name "*password*" -type f -delete
find . -name "*key*" -type f -delete

# Remove test results with sensitive data
echo "Removing test results..."
rm -f test_results_*.json 2>/dev/null || true
rm -f *.log 2>/dev/null || true

# Remove Docker volumes (if any)
echo "Removing Docker volumes..."
rm -rf monitoring/grafana/data/ 2>/dev/null || true
rm -rf monitoring/prometheus/data/ 2>/dev/null || true

# Remove IDE files
echo "Removing IDE files..."
find . -name ".vscode" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".idea" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.swp" -type f -delete
find . -name "*.swo" -type f -delete

# Remove Python cache
echo "Removing Python cache..."
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -type f -delete
find . -name "*.pyo" -type f -delete

# Remove backup files
echo "Removing backup files..."
find . -name "*.bak" -type f -delete
find . -name "*.backup" -type f -delete

# Remove coverage reports
echo "Removing coverage reports..."
rm -rf coverage/ 2>/dev/null || true
rm -rf .nyc_output/ 2>/dev/null || true

# Remove yarn/npm lock files (will be regenerated)
echo "Removing lock files..."
find . -name "yarn.lock" -type f -delete
find . -name "package-lock.json" -type f -delete

# Keep only essential files
echo "Keeping essential files..."
# Keep README.md, package.json, etc.

echo "✅ Repository cleaned for GitHub!"
echo ""
echo "📋 Summary of removed items:"
echo "  - Environment files (.env*)"
echo "  - Log files (*.log)"
echo "  - Node modules (node_modules/)"
echo "  - Build artifacts (.next/, dist/, build/)"
echo "  - Cache directories (.cache/, .parcel-cache/)"
echo "  - Temporary files (*.tmp, *.temp, .DS_Store)"
echo "  - Sensitive documentation"
echo "  - Test results with sensitive data"
echo "  - Docker volumes"
echo "  - IDE files (.vscode/, .idea/)"
echo "  - Python cache (__pycache__/)"
echo "  - Backup files (*.bak, *.backup)"
echo "  - Coverage reports"
echo "  - Lock files (will be regenerated)"
echo ""
echo "🚀 Ready for GitHub push!"
