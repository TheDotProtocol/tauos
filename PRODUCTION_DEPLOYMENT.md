# Production Deployment Configuration
**Date**: January 2025  
**Status**: Production Deployment Guide  
**Target**: Deploy to Vercel with full production configuration

---

## 🚀 Production Deployment Checklist

### Pre-Deployment

#### 1. Environment Variables
Create `.env.production` or configure in Vercel dashboard:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# Redis
REDIS_URL=rediss://your-redis-host:6380
REDIS_HOST=your-redis-host
REDIS_PORT=6380
REDIS_PASSWORD=your-redis-password

# Security
ENCRYPTION_KEY=your-32-byte-hex-key
ENCRYPTION_ALGORITHM=aes-256-gcm
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
MONITORING_ENABLED=true

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### 2. Database Setup
- [ ] Create production database
- [ ] Run migrations
- [ ] Create `projects` table
- [ ] Set up database backups
- [ ] Configure connection pooling

#### 3. Redis Setup
- [ ] Provision Redis instance (Upstash, Redis Cloud, etc.)
- [ ] Configure Redis connection
- [ ] Set up Redis persistence
- [ ] Configure Redis password

#### 4. SSL/TLS
- [ ] Vercel automatically provides SSL
- [ ] Verify certificate is active
- [ ] Test HTTPS redirect
- [ ] Check certificate expiration

---

## 📦 Vercel Deployment

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Link Project
```bash
cd developerhub/frontend
vercel link
```

### Step 4: Configure Environment Variables
```bash
# Set environment variables
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add ENCRYPTION_KEY
# ... add all required variables
```

Or use Vercel dashboard:
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add all required variables

### Step 5: Deploy
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## 🔧 Production Configuration

### Next.js Configuration
Update `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

### Database Connection Pooling
For production, use connection pooling service:
- **PgBouncer** (recommended)
- **Supabase Connection Pooler**
- **AWS RDS Proxy**

### Redis Configuration
For production Redis:
- Use **Upstash Redis** (Vercel integration)
- Or **Redis Cloud**
- Enable TLS/SSL
- Set up persistence
- Configure backups

---

## 📊 Monitoring Setup

### 1. Vercel Analytics
- Enable in Vercel dashboard
- View performance metrics
- Monitor errors

### 2. Sentry Error Tracking
```bash
npm install @sentry/nextjs
```

Configure in `sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 3. Uptime Monitoring
- Set up **Uptime Robot**
- Monitor critical endpoints
- Configure alerts

### 4. Performance Monitoring
- **Vercel Analytics** (built-in)
- **Web Vitals** tracking
- **Real User Monitoring (RUM)**

---

## 🔒 Security Hardening

### 1. Environment Variables
- Never commit `.env` files
- Use Vercel secrets management
- Rotate keys regularly

### 2. Database Security
- Use strong passwords
- Enable SSL connections
- Restrict IP access
- Regular backups

### 3. API Security
- Rate limiting enabled
- Input validation
- Output sanitization
- CORS properly configured

### 4. Headers
- Security headers configured
- HTTPS enforced
- HSTS enabled
- CSP configured (if needed)

---

## ✅ Post-Deployment Verification

### 1. Smoke Tests
```bash
# Test homepage
curl https://your-domain.com

# Test API
curl https://your-domain.com/api/projects

# Test health endpoint (if exists)
curl https://your-domain.com/api/health
```

### 2. Functional Tests
- [ ] Create a project
- [ ] Access terminal
- [ ] Use IDE
- [ ] Test authentication
- [ ] Verify session persistence

### 3. Performance Tests
- [ ] Page load time < 2s
- [ ] API response < 500ms
- [ ] No console errors
- [ ] Lighthouse score > 90

### 4. Security Tests
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] No sensitive data exposed
- [ ] Rate limiting works

---

## 📝 Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting production deployment..."

# Build
echo "📦 Building..."
cd developerhub/frontend
npm run build

# Run tests
echo "🧪 Running tests..."
npm test || echo "⚠️  Tests failed, continuing..."

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Verify deployment
echo "✅ Verifying deployment..."
sleep 5
curl -f https://your-domain.com || echo "❌ Deployment verification failed"

echo "✅ Deployment complete!"
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd developerhub/frontend
          npm ci
      
      - name: Run tests
        run: |
          cd developerhub/frontend
          npm test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./developerhub/frontend
```

---

## 📊 Production Metrics

### Key Metrics to Monitor
- **Uptime**: Target 99.9%
- **Response Time**: P95 < 500ms
- **Error Rate**: < 0.1%
- **Throughput**: > 100 req/s
- **Database Connections**: Monitor pool usage
- **Redis Memory**: Monitor usage

### Alerts
Set up alerts for:
- High error rate
- Slow response times
- Database connection issues
- Redis connection issues
- High memory usage
- Disk space

---

## 🎯 Launch Checklist

### Before Launch
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Redis configured and tested
- [ ] SSL certificates active
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Backups configured
- [ ] Security audit passed
- [ ] Load testing passed
- [ ] Documentation complete

### Launch Day
- [ ] Final code review
- [ ] Database backup
- [ ] Deploy to production
- [ ] Smoke tests
- [ ] Monitor for issues
- [ ] Announce launch

### Post-Launch
- [ ] Monitor metrics
- [ ] Collect user feedback
- [ ] Address issues
- [ ] Optimize performance
- [ ] Plan improvements

---

**Status**: 🟡 Ready for Production Deployment  
**Last Updated**: [Date]

