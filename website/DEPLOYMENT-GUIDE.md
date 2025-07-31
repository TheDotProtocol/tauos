# TauOS Website Deployment Guide

## Clean Deployment Process

### Step 1: Delete Current Vercel Project
1. Go to https://vercel.com/the-dot-protocol-co-ltds-projects/tauos
2. Navigate to Settings → General
3. Scroll down to "Delete Project"
4. Confirm deletion

### Step 2: Push Clean Code to GitHub
```bash
# From the tauos directory
git add .
git commit -m "Clean deployment: Updated Vercel config and removed cache files"
git push origin main
```

### Step 3: Import Fresh Project to Vercel
1. Go to https://vercel.com/new
2. Import from GitHub: `https://github.com/TheDotProtocol/tauos.git`
3. **Important Settings:**
   - Framework Preset: `Next.js`
   - Root Directory: `tauos/website`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 4: Configure Project Settings
1. Go to Project Settings → General
2. Set Project Name: `tauos-website`
3. Go to Project Settings → Security
4. **Disable all protection:**
   - Password Protection: OFF
   - Team Protection: OFF
   - Domain Protection: OFF

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Test the deployment URL

## Expected Result
- Clean deployment without authentication
- All TauOS landing page content visible
- Debug indicator shows "✅ TauOS Live" for 5 seconds
- All sections (Hero, Features, About, TauMail, TauCloud, Tau Store) working

## Troubleshooting
- If still showing authentication, check Project Settings → Security
- If build fails, check Root Directory is set to `tauos/website`
- If content missing, verify `src/app/page.tsx` is correct

## Files to Verify
- ✅ `tauos/website/vercel.json` - Clean configuration
- ✅ `tauos/website/src/app/page.tsx` - Complete landing page
- ✅ `tauos/website/package.json` - Correct dependencies
- ✅ `tauos/website/.gitignore` - Excludes cache files 