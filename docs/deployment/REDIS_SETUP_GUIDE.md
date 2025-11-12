# Redis Setup Guide for Production
**Date**: January 2025  
**Purpose**: Set up Redis for Developer Hub session persistence  
**Recommended**: Upstash (Vercel Integration)

---

## 🚀 Quick Setup: Upstash Redis (Recommended)

### Why Upstash?
- ✅ Native Vercel integration
- ✅ Serverless (pay per use)
- ✅ Free tier available
- ✅ Automatic scaling
- ✅ Global edge network
- ✅ TLS/SSL included

---

## 📋 Step-by-Step Setup

### Step 1: Create Upstash Account
1. Go to **https://upstash.com**
2. Click **"Sign Up"** or **"Log In"**
3. Sign up with GitHub (recommended) or email

### Step 2: Create Redis Database
1. Once logged in, click **"Create Database"**
2. Fill in the form:
   - **Name**: `tauos-developer-hub` (or any name you prefer)
   - **Type**: **Redis** (default)
   - **Region**: Choose closest to your users (e.g., `us-east-1`, `eu-west-1`, `ap-southeast-1`)
   - **Primary Region**: Same as region
   - **TLS**: **Enabled** (recommended)
   - **Eviction**: **No eviction** (for session persistence)
3. Click **"Create"**

### Step 3: Get Connection Details
1. After creation, you'll see the database details
2. Click on your database name
3. Go to **"Details"** tab
4. You'll see:
   - **Endpoint**: `xxxxx.upstash.io`
   - **Port**: `6379` (or `6380` for TLS)
   - **Password**: `xxxxx` (click to reveal)

### Step 4: Construct REDIS_URL
Format: `rediss://default:PASSWORD@ENDPOINT:PORT`

Example:
```
rediss://default:Ak1233@@5@tauos-devhub-12345.upstash.io:6380
```

**Important Notes**:
- Use `rediss://` (with double 's') for TLS/SSL
- Use `redis://` (single 's') for non-TLS
- Port `6380` is for TLS, `6379` is for non-TLS
- `default` is the username (Upstash uses this)

### Step 5: Test Connection (Optional)
You can test the connection locally:
```bash
redis-cli -u rediss://default:PASSWORD@ENDPOINT:6380 ping
# Should return: PONG
```

---

## 🔧 Alternative: Redis Cloud

If you prefer Redis Cloud:

### Step 1: Create Account
1. Go to **https://redis.com/cloud**
2. Sign up for free account

### Step 2: Create Database
1. Click **"New Subscription"**
2. Choose **"Fixed"** plan (free tier available)
3. Select region
4. Create database

### Step 3: Get Connection URL
1. Go to database details
2. Copy the connection URL
3. Format: `redis://default:PASSWORD@ENDPOINT:PORT`

---

## 📝 What You'll Need

After setup, you'll have:
- ✅ **REDIS_URL**: Full connection string
- ✅ **REDIS_HOST**: Endpoint hostname (optional)
- ✅ **REDIS_PORT**: Port number (optional)
- ✅ **REDIS_PASSWORD**: Password (optional)

**For Vercel, you only need `REDIS_URL`** (the full connection string).

---

## ✅ Verification

Once you have `REDIS_URL`, you can verify it works:

### Test in Node.js
```javascript
const { createClient } = require('redis');

const client = createClient({
  url: 'rediss://default:PASSWORD@ENDPOINT:6380'
});

client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();
console.log('✅ Connected to Redis');
await client.ping(); // Should return 'PONG'
await client.disconnect();
```

### Test in Terminal
```bash
redis-cli -u rediss://default:PASSWORD@ENDPOINT:6380 ping
```

---

## 🎯 Next Steps

1. ✅ Set up Upstash Redis (or Redis Cloud)
2. ✅ Get `REDIS_URL` connection string
3. ✅ Add to complete environment variables file
4. ✅ Copy all variables to Vercel

---

## 💡 Tips

- **Free Tier**: Upstash free tier includes 10,000 commands/day (plenty for development)
- **TLS/SSL**: Always use TLS in production (`rediss://`)
- **Region**: Choose region closest to your Vercel deployment
- **Backup**: Upstash automatically backs up your data
- **Monitoring**: Upstash dashboard shows usage and performance

---

**Status**: Ready to set up  
**Estimated Time**: 5-10 minutes  
**Cost**: Free tier available

