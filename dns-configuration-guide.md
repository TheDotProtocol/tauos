# TauOS Email Server DNS Configuration Guide

## 🌐 **DNS Records Required**

### **For Domain: tauos.org**

You need to configure these DNS records in your domain registrar (Squarespace, Cloudflare, etc.):

### **1. A Records (IPv4)**
```
mailserver.tauos.org    A    136.244.83.147
tauos.org               A    136.244.83.147
```

### **2. MX Record (Mail Exchange)**
```
tauos.org               MX   10    mailserver.tauos.org
```

### **3. SPF Record (Sender Policy Framework)**
```
tauos.org               TXT  "v=spf1 mx a ip4:136.244.83.147 ~all"
```

### **4. DKIM Record (DomainKeys Identified Mail)**
```
default._domainkey.tauos.org    TXT  "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

### **5. DMARC Record (Domain-based Message Authentication)**
```
_dmarc.tauos.org        TXT  "v=DMARC1; p=quarantine; rua=mailto:admin@tauos.org"
```

### **6. CNAME Records (Optional)**
```
mail.tauos.org          CNAME    mailserver.tauos.org
smtp.tauos.org          CNAME    mailserver.tauos.org
imap.tauos.org          CNAME    mailserver.tauos.org
```

---

## 🔧 **Step-by-Step DNS Setup**

### **Step 1: A Records**
1. Go to your DNS management panel
2. Add A record: `mailserver.tauos.org` → `136.244.83.147`
3. Add A record: `tauos.org` → `136.244.83.147`

### **Step 2: MX Record**
1. Add MX record: `tauos.org` → `mailserver.tauos.org` (Priority: 10)

### **Step 3: SPF Record**
1. Add TXT record: `tauos.org` → `"v=spf1 mx a ip4:136.244.83.147 ~all"`

### **Step 4: DKIM Record**
1. Run the email server setup script first
2. Generate DKIM key on the server
3. Add TXT record: `default._domainkey.tauos.org` → `"v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"`

### **Step 5: DMARC Record**
1. Add TXT record: `_dmarc.tauos.org` → `"v=DMARC1; p=quarantine; rua=mailto:admin@tauos.org"`

---

## ⏱️ **DNS Propagation Time**

- **A Records**: 5-15 minutes
- **MX Records**: 15-30 minutes
- **TXT Records**: 15-30 minutes
- **Full Propagation**: Up to 48 hours (usually much faster)

---

## 🧪 **Testing DNS Configuration**

### **Test Commands:**
```bash
# Test A record
nslookup mailserver.tauos.org

# Test MX record
nslookup -type=MX tauos.org

# Test SPF record
nslookup -type=TXT tauos.org

# Test DKIM record
nslookup -type=TXT default._domainkey.tauos.org

# Test DMARC record
nslookup -type=TXT _dmarc.tauos.org
```

### **Online DNS Checkers:**
- https://mxtoolbox.com/
- https://dnschecker.org/
- https://www.whatsmydns.net/

---

## 🚨 **Important Notes**

1. **DNS Propagation**: Wait for DNS to propagate before testing email
2. **DKIM Key**: Will be generated during server setup
3. **SSL Certificate**: Let's Encrypt will be configured after DNS is ready
4. **Firewall**: Ports 25, 587, 993, 995 are already configured on the server

---

## 📧 **Email Client Configuration**

### **IMAP Settings:**
- **Server**: mailserver.tauos.org
- **Port**: 993
- **Security**: SSL/TLS
- **Authentication**: Username/Password

### **POP3 Settings:**
- **Server**: mailserver.tauos.org
- **Port**: 995
- **Security**: SSL/TLS
- **Authentication**: Username/Password

### **SMTP Settings:**
- **Server**: mailserver.tauos.org
- **Port**: 587
- **Security**: STARTTLS
- **Authentication**: Username/Password

---

## 🎯 **Next Steps After DNS Setup**

1. ✅ Run the email server setup script
2. ✅ Configure DNS records (this guide)
3. ✅ Wait for DNS propagation
4. ✅ Test email sending/receiving
5. ✅ Configure Let's Encrypt SSL
6. ✅ Update TauOS applications with SMTP credentials
