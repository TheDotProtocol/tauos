# 🚀 Final Deployment Checklist for TauOS Mail

## **Phase 1: Server Verification (SSH into GCP)**

### **1. SSH into the server:**
```bash
ssh foundationtau@34.30.189.200
```

### **2. Run the verification script:**
```bash
cd /home/foundationtau
chmod +x verify-server-status.sh
./verify-server-status.sh
```

### **3. All checks should show ✅:**
- ✅ Postfix is running
- ✅ saslauthd is running  
- ✅ saslauthd socket exists
- ✅ Port 587 is listening
- ✅ Authentication working
- ✅ DNS resolves correctly
- ✅ Local SMTP connection working
- ✅ Port 587 allowed in firewall

## **Phase 2: Vercel Environment Variables**

### **Add these to Vercel Dashboard → Settings → Environment Variables:**

```
DATABASE_URL=postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
JWT_SECRET=tauos-secret-key-change-in-production
SMTP_USER=noreply@tauos.org
SMTP_PASS=TauOS2024!Secure
SMTP_HOST=34.30.189.200
SMTP_PORT=587
MAILTRAP_USER=e5b253ac8d7940
MAILTRAP_PASS=aec7
```

## **Phase 3: Deployment**

### **1. Deploy to Vercel:**
- Connect GitHub repository
- Deploy from `vercel-tauos-mail` directory
- Wait for deployment to complete

### **2. Verify deployment:**
```bash
node check-vercel-env.js
```

### **3. Test functionality:**
- ✅ User registration works
- ✅ Login works
- ✅ Email sending shows "sent" status (not "database_only")
- ✅ Emails reach Gmail

## **Phase 4: Final Testing**

### **Test Email Flow:**
1. Register new user
2. Login
3. Send email to external address (Gmail)
4. Check email status shows "sent"
5. Verify email arrives in Gmail inbox

## **🎯 Success Criteria:**

- [ ] All server checks pass ✅
- [ ] Environment variables set in Vercel ✅
- [ ] Deployment successful ✅
- [ ] Email sending works ✅
- [ ] Gmail delivery works ✅
- [ ] No "database_only" status ✅

## **🔧 Troubleshooting:**

### **If "database_only" persists:**
1. Check environment variables are set
2. Verify SMTP credentials
3. Check server authentication
4. Review mail logs

### **If emails don't reach Gmail:**
1. Check DNS propagation
2. Verify SPF/DKIM records
3. Check mail server logs
4. Test SMTP connection

## **📞 Support:**
- Server IP: `34.30.189.200`
- SMTP Port: `587`
- Username: `noreply@tauos.org`
- Password: `TauOS2024!Secure`

**Ready for sovereign email delivery! 🚀** 