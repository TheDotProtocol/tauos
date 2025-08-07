# Custom Domain Configuration Guide

## Current Status
- ✅ New redirect projects deployed successfully
- ✅ Redirects configured to point to landing pages
- ⏳ Custom domains need to be reconfigured

## Projects Deployed

### Mail Project
- **Project Name**: `vercel-tauos-mail`
- **URL**: https://vercel-tauos-mail-m1zuzff4d-the-dot-protocol-co-ltds-projects.vercel.app
- **Redirects to**: https://www.tauos.org/taumail

### Cloud Project  
- **Project Name**: `vercel-tauos-cloud`
- **URL**: https://vercel-tauos-cloud-ezt9oqxm6-the-dot-protocol-co-ltds-projects.vercel.app
- **Redirects to**: https://www.tauos.org/taucloud

## Steps to Configure Custom Domains

### 1. Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Navigate to the `vercel-tauos-mail` project
3. Go to Settings → Domains
4. Add custom domain: `mail.tauos.org`
5. Follow the DNS configuration instructions

### 2. Configure Mail Domain
1. In your DNS provider (likely Squarespace or similar):
   - Add CNAME record: `mail.tauos.org` → `vercel-tauos-mail-m1zuzff4d-the-dot-protocol-co-ltds-projects.vercel.app`
   - Or use the Vercel-provided DNS records

### 3. Configure Cloud Domain
1. Navigate to the `vercel-tauos-cloud` project
2. Go to Settings → Domains
3. Add custom domain: `cloud.tauos.org`
4. Configure DNS records as instructed

### 4. Verify Configuration
After DNS propagation (can take up to 24 hours):
- `mail.tauos.org` should redirect to `https://www.tauos.org/taumail`
- `cloud.tauos.org` should redirect to `https://www.tauos.org/taucloud`

## Expected Behavior
- Users visiting `mail.tauos.org` → redirected to TauMail landing page
- Users visiting `cloud.tauos.org` → redirected to TauCloud landing page
- Registration/login buttons on landing pages → redirect to actual applications

## Current Status
- ✅ Landing pages live at `/taumail` and `/taucloud`
- ✅ Redirect projects deployed
- ⏳ Custom domains need DNS configuration 