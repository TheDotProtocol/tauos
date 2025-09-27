# TauOS Mail - Vercel Deployment Guide

## 📋 STEP 1: RUN DATABASE SQL

**Run this SQL file in your Supabase SQL Editor:**
- File: `tauos-mail-simple-database.sql`
- This creates all required tables: `sent_emails`, `incoming_emails`, `drafts`, `trash_emails`

## 📋 STEP 2: DELETE OLD VERCEL DEPLOYMENTS

1. Go to Vercel Dashboard
2. Delete the old TauMail deployment
3. Delete the old TauCloud deployment

## 📋 STEP 3: IMPORT NEW PROJECTS

### For TauMail Backend:
1. **Repository**: `https://github.com/TheDotProtocol/tauos.git`
2. **Root Directory**: `tauos-mail-backend`
3. **Framework Preset**: Other
4. **Build Command**: `echo "TauOS Mail Backend - Production Ready"`
5. **Output Directory**: Leave empty

### For Website Frontend:
1. **Repository**: `https://github.com/TheDotProtocol/tauos.git`
2. **Root Directory**: `website`
3. **Framework Preset**: Next.js
4. **Build Command**: `npm run build`
5. **Output Directory**: `.next`

## 📋 STEP 4: ENVIRONMENT VARIABLES

### TauMail Backend Environment Variables:
```
DATABASE_URL=postgresql://postgres:Ak1233%40%405_HIDDEN@db.tviqcormikopltejomkc.supabase.co:5432/postgres
JWT_SECRET=442942d0670e02db9fdcb991b079a24631fe72daecd1ecac7269405acc0e0dff8b97a97cb774a81278e9f9648373ed70cfcce6eec252ebf1d313f152f890adaa
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
NODE_ENV=production
```

### Website Frontend Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-tauos-mail-backend.vercel.app
```

## 📋 STEP 5: CUSTOM DOMAINS (Optional)

### TauMail Backend:
- Domain: `mail-api.tauos.org` or `api.tauos.org`

### Website Frontend:
- Domain: `www.tauos.org` (already configured)

## 📋 STEP 6: TESTING

1. **Backend Health Check**: `https://your-backend-url.vercel.app/health`
2. **Frontend**: `https://www.tauos.org/apps/mail`
3. **Test Registration**: Create a test user
4. **Test Email Sending**: Send a test email
5. **Test All Pages**: Inbox, Sent, Drafts, Trash, Compose

## 📋 FILES READY FOR DEPLOYMENT:

✅ **Backend**: `tauos-mail-backend/` - Complete API with all endpoints
✅ **Frontend**: `website/` - Complete UI with all pages
✅ **Database**: `tauos-mail-simple-database.sql` - All required tables
✅ **Environment**: `tauos-mail-vercel-env.txt` - All required variables

## 🚀 DEPLOYMENT CHECKLIST:

- [ ] Run SQL file in Supabase
- [ ] Delete old Vercel deployments
- [ ] Import TauMail backend project
- [ ] Import website frontend project
- [ ] Set environment variables
- [ ] Test backend health check
- [ ] Test frontend loading
- [ ] Test user registration
- [ ] Test email sending
- [ ] Test all email pages

## 🎯 EXPECTED RESULTS:

- ✅ **Backend**: All API endpoints working (200 status)
- ✅ **Frontend**: All pages loading (no 404 errors)
- ✅ **Database**: All tables created successfully
- ✅ **Email**: SendGrid integration working
- ✅ **User Flow**: Complete registration → dashboard → email pages
