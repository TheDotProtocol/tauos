# Upstash Redis Connection Information
**Date**: January 2025

---

## ✅ What We Have

- **Endpoint**: `ultimate-cheetah-9515.upstash.io`
- **TLS**: Enabled ✅
- **REST URL**: `https://ultimate-cheetah-9515.upstash.io`
- **REST Token**: `ASUrAAImcDI2NDg2NmE2N2VmNDg0MWU1YjRmZWExYWUwZTMxMTlhZnAyOTUxNQ`

---

## ⚠️ What We Need

### Redis Password (Not REST Token)
In your Upstash dashboard:
1. Click on your database: `ultimate-cheetah-9515`
2. Go to the **"Details"** or **"Connect"** tab
3. Look for **"Password"** field (separate from REST Token)
4. Click **"Show"** or **"Reveal"** to see the password
5. Copy the password

### Port Information
- With **TLS Enabled**: Use port **6380** ✅
- Without TLS: Use port 6379
- Since TLS is enabled, we'll use **6380**

---

## 🔧 REDIS_URL Format

Once you have the password, the format will be:

```
rediss://default:PASSWORD@ultimate-cheetah-9515.upstash.io:6380
```

**Example** (replace `YOUR_PASSWORD` with actual password):
```
rediss://default:YOUR_PASSWORD@ultimate-cheetah-9515.upstash.io:6380
```

---

## 📋 Where to Find Password in Upstash

1. **Dashboard** → Click on your database
2. **Details Tab** → Look for "Password" section
3. **Connect Tab** → May show password in connection string
4. **Settings** → Database settings may show password

The password is usually a long string of characters, different from the REST token.

---

## ✅ Next Steps

1. Find and copy the Redis password from Upstash dashboard
2. Share it here (or the full REDIS_URL if you construct it)
3. I'll update the environment variables file
4. Then we'll deploy to Vercel!

---

**Note**: The REST token is for REST API calls, not for Redis protocol connections. We need the actual Redis password for the connection string.

