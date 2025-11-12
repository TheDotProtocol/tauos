# Upstash Redis Setup - Step by Step
**Date**: January 2025  
**Purpose**: Set up Upstash Redis for production deployment

---

## 🚀 Quick Setup Steps

### Step 1: Create Upstash Account
1. **Go to**: https://upstash.com
2. **Click**: "Sign Up" or "Log In"
3. **Sign up with**: GitHub (recommended) or email

### Step 2: Create Redis Database
1. Once logged in, click **"Create Database"** (or "New Database")
2. Fill in the form:
   - **Name**: `tauos-developer-hub` (or any name you prefer)
   - **Type**: **Redis** (should be default)
   - **Region**: Choose closest to your users
     - Recommended: `us-east-1` (US), `eu-west-1` (Europe), or `ap-southeast-1` (Asia)
   - **Primary Region**: Same as region
   - **TLS**: **Enabled** ✅ (recommended for production)
   - **Eviction**: **No eviction** (for session persistence)
3. Click **"Create"** or **"Create Database"**

### Step 3: Get Connection Details
1. After creation, you'll see your database in the dashboard
2. **Click on your database name** to open details
3. You'll see:
   - **Endpoint**: Something like `tauos-devhub-12345.upstash.io`
   - **Port**: `6380` (for TLS) or `6379` (for non-TLS)
   - **Password**: Click "Show" or "Reveal" to see it

### Step 4: Construct REDIS_URL
**Format**: `rediss://default:PASSWORD@ENDPOINT:PORT`

**Example**:
```
rediss://default:Ak1233@@5@tauos-devhub-12345.upstash.io:6380
```

**Important**:
- Use `rediss://` (with double 's') for TLS/SSL ✅
- Use `redis://` (single 's') for non-TLS
- Port `6380` is for TLS, `6379` is for non-TLS
- `default` is the username (Upstash uses this)

### Step 5: Copy Your REDIS_URL
Once you have your REDIS_URL, we'll update the environment variables file.

---

## 📋 What You'll Need

After setup, you'll have:
- ✅ **REDIS_URL**: Full connection string (most important)
- ✅ **REDIS_HOST**: Endpoint hostname (optional)
- ✅ **REDIS_PORT**: Port number (optional)
- ✅ **REDIS_PASSWORD**: Password (optional)

**For Vercel, you only need `REDIS_URL`** (the full connection string).

---

## ✅ Verification (Optional)

You can test the connection locally:
```bash
redis-cli -u rediss://default:PASSWORD@ENDPOINT:6380 ping
# Should return: PONG
```

---

## 🎯 Next Steps After Setup

1. ✅ Get your REDIS_URL from Upstash
2. ✅ Update `VERCEL_ENV_VARIABLES_COMPLETE.txt` with your REDIS_URL
3. ✅ Copy all variables to Vercel Dashboard
4. ✅ Deploy to production

---

## 💡 Tips

- **Free Tier**: Upstash free tier includes 10,000 commands/day (plenty for development)
- **TLS/SSL**: Always use TLS in production (`rediss://`)
- **Region**: Choose region closest to your Vercel deployment
- **Backup**: Upstash automatically backs up your data
- **Monitoring**: Upstash dashboard shows usage and performance

---

**Ready to start?** Go to https://upstash.com and follow the steps above! 🚀

