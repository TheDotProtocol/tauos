# 🚀 TauOS Production Deployment Instructions

## **Environment Variables for Vercel**

Copy and paste these environment variables into your Vercel dashboard:

### **Database Configuration**
```
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require
```

### **OpenAI Configuration**
```
OPENAI_API_KEY=your-openai-api-key-here
```

### **JWT Secrets for Each App**
```
JWT_SECRET_TAUMAIL=tauos-taumail-jwt-secret-2025-launch-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
JWT_SECRET_TAUCLOUD=tauos-taucloud-jwt-secret-2025-launch-b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
JWT_SECRET_TAUID=tauos-tauid-jwt-secret-2025-launch-c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3
JWT_SECRET_TAUSTORE=tauos-taustore-jwt-secret-2025-launch-d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5
JWT_SECRET_TAUBROWSER=tauos-taubrowser-jwt-secret-2025-launch-e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7
JWT_SECRET_TAUAI=tauos-tauai-jwt-secret-2025-launch-f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9
```

### **Master JWT Secret**
```
JWT_SECRET=b8c3f1e7a9d2c5f8b1e4a7c0d3f6b9e2a5c8f1b4e7a0d3c6f9b2e5a8c1f4b7e0a3c6d9c2f5b8e1a4c7f0b3e6d9c2a5f8b1e4a7c0d3f6b9e2a5c8f1b4e7a0
```

### **Email Configuration**
```
SENDGRID_API_KEY=your-sendgrid-api-key-here
EMAIL_DOMAIN=tauos.org
```

### **SMTP Configuration (Vultr Server)**
```
SMTP_HOST=136.244.83.147
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=admin@tauos.org
SMTP_PASS=Ak1233@@5
```

### **Application URLs**
```
NEXT_PUBLIC_TAUOS_URL=https://tauos.vercel.app
NEXT_PUBLIC_TAUCLOUD_API_URL=https://tauos.vercel.app/api/taucloud
NEXT_PUBLIC_TAUMAIL_API_URL=https://tauos.vercel.app/api/taumail
```

### **Alerting and Monitoring**
```
ALERT_EMAIL=foundationtau@gmail.com
ALERT_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
ENABLE_MONITORING=true
GRAFANA_URL=http://localhost:3001
PROMETHEUS_URL=http://localhost:9090
```

### **Security Settings**
```
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
CORS_ORIGIN=https://tauos.vercel.app
CORS_CREDENTIALS=true
SSL_REJECT_UNAUTHORIZED=false
SESSION_SECRET=tauos-session-secret-2025-launch-s1e2c3r4e5t6k7e8y9a0b1c2d3e4f5g6h7i8j9k0l1m2n4o5p6q7r8s8t9u0v1w2x3y4z5
SESSION_MAX_AGE=86400000
WEBHOOK_SECRET=tauos-webhook-secret-2025-launch-w1e2b3h4o5o6k7s8e9c0r1e2t3k4e5y6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

### **Caching**
```
CACHE_TTL=3600
CACHE_MAX_SIZE=1000
```

### **Logging**
```
LOG_LEVEL=info
LOG_FORMAT=json
```

### **API Configuration**
```
API_VERSION=v1
API_PREFIX=/api
```

### **Feature Flags**
```
ENABLE_TAUAI=true
ENABLE_TAUCLOUD=true
ENABLE_TAUMAIL=true
ENABLE_TAUID=true
ENABLE_TAUSTORE=true
ENABLE_TAUBROWSER=true
```

### **Performance & Scaling**
```
MAX_CONCURRENT_REQUESTS=100
REQUEST_TIMEOUT=30000
RESPONSE_TIMEOUT=10000
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_ACQUIRE_TIMEOUT=60000
TAUMAIL_RATE_LIMIT=100
TAUCLOUD_RATE_LIMIT=200
TAUID_RATE_LIMIT=50
TAUSTORE_RATE_LIMIT=300
TAUBROWSER_RATE_LIMIT=150
TAUAI_RATE_LIMIT=500
TAUMAIL_DB_POOL_MAX=5
TAUCLOUD_DB_POOL_MAX=10
TAUID_DB_POOL_MAX=3
TAUSTORE_DB_POOL_MAX=8
TAUBROWSER_DB_POOL_MAX=5
TAUAI_DB_POOL_MAX=15
```

### **Analytics & Backup**
```
ANALYTICS_ENABLED=false
ANALYTICS_ID=tauos-analytics-2025
BACKUP_ENABLED=false
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
ALERTING_ENABLED=true
```

### **Node.js Environment**
```
NODE_ENV=production
```

## 3. Configure Vercel Load Balancers

The `vercel-production.json` file in the root of the `website` directory contains the necessary configurations for Vercel's Edge Network and serverless functions, including region distribution for load balancing. Ensure this file is present in your deployment.

## 4. Final Testing

Once deployed and environment variables are set in Vercel, perform comprehensive final testing on the live environment:

- **Website Accessibility**: Ensure `tauos.org` is live and all pages load correctly.
- **API Endpoints**: Test all critical API routes (e.g., user registration, login, email send/receive, cloud file operations).
- **Email System**: Verify welcome emails are sent and received, and basic email addresses are functional.
- **Database Connectivity**: Confirm the application can connect to Supabase and perform CRUD operations.
- **UI/UX**: Check for any visual glitches or broken functionalities on both desktop and mobile views.
- **Performance**: Monitor load times and responsiveness.
- **Security**: Basic checks for exposed secrets or vulnerabilities.
- **Documentation Hub**: Verify all documentation files are correctly displayed and accessible.

**Congratulations! TauOS is ready for launch!**
