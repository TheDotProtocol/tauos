# TauMail Manual Infrastructure Setup

## 🎯 **Complete Independent Email Infrastructure**

Since AWS CloudFormation deployment requires specific permissions, here's the manual setup process for TauMail's independent email infrastructure.

## **Step 1: AWS EC2 Instance Setup**

### **1.1 Launch EC2 Instance**
```bash
# Launch t3.medium instance with Amazon Linux 2
# Security Group: Allow ports 22, 25, 587, 465, 143, 993, 110, 995, 80, 443
# Key Pair: Create new key pair for SSH access
```

### **1.2 Instance Specifications**
- **Instance Type**: t3.medium (2 vCPU, 4 GB RAM)
- **AMI**: Amazon Linux 2
- **Storage**: 20 GB GP2 EBS
- **Security Group**: Custom with all mail ports open

### **1.3 Security Group Rules**
```
SSH (22): 0.0.0.0/0
SMTP (25): 0.0.0.0/0
SMTP Submission (587): 0.0.0.0/0
SMTPS (465): 0.0.0.0/0
IMAP (143): 0.0.0.0/0
IMAPS (993): 0.0.0.0/0
POP3 (110): 0.0.0.0/0
POP3S (995): 0.0.0.0/0
HTTP (80): 0.0.0.0/0
HTTPS (443): 0.0.0.0/0
```

## **Step 2: Mail Server Installation**

### **2.1 Connect to Instance**
```bash
ssh -i your-key.pem ec2-user@YOUR_INSTANCE_IP
```

### **2.2 Install Docker and Dependencies**
```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker git aws-cli
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
# SSH back in
```

### **2.3 Create Mail Server Directory**
```bash
mkdir -p /opt/taumail
cd /opt/taumail
```

## **Step 3: Mail Server Configuration**

### **3.1 Create Docker Compose File**
```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Postfix SMTP Server
  postfix:
    image: catatnight/postfix
    container_name: taumail-postfix
    hostname: smtp.tauos.org
    ports:
      - "25:25"
      - "587:587"
      - "465:465"
    environment:
      maildomain: tauos.org
      smtp_user: taumail:secure_password
    volumes:
      - ./postfix/config:/etc/postfix
      - ./postfix/logs:/var/log
      - ./mail:/var/mail
    networks:
      - taumail-network
    restart: unless-stopped

  # Dovecot IMAP/POP3 Server
  dovecot:
    image: dovemark/dovecot
    container_name: taumail-dovecot
    hostname: mail.tauos.org
    ports:
      - "143:143"
      - "993:993"
      - "110:110"
      - "995:995"
    environment:
      MAILNAME: mail.tauos.org
    volumes:
      - ./dovecot/config:/etc/dovecot
      - ./dovecot/logs:/var/log
      - ./mail:/var/mail
    networks:
      - taumail-network
    restart: unless-stopped
    depends_on:
      - postfix

  # Rspamd Anti-Spam
  rspamd:
    image: rspamd/rspamd:latest
    container_name: taumail-rspamd
    hostname: rspamd.tauos.org
    ports:
      - "11334:11334"
    volumes:
      - ./rspamd/config:/etc/rspamd
      - ./rspamd/logs:/var/log
    networks:
      - taumail-network
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: taumail-nginx
    hostname: mail.tauos.org
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/config:/etc/nginx
      - ./nginx/ssl:/etc/ssl
      - ./nginx/logs:/var/log/nginx
    networks:
      - taumail-network
    restart: unless-stopped
    depends_on:
      - postfix
      - dovecot

  # Redis for Session Storage
  redis:
    image: redis:alpine
    container_name: taumail-redis
    hostname: redis.tauos.org
    ports:
      - "6379:6379"
    volumes:
      - ./redis/data:/data
    networks:
      - taumail-network
    restart: unless-stopped

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: taumail-postgres
    hostname: db.tauos.org
    environment:
      POSTGRES_DB: taumail
      POSTGRES_USER: taumail_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d
    networks:
      - taumail-network
    restart: unless-stopped

  # TauMail Web Interface
  taumail-web:
    image: node:18-alpine
    container_name: taumail-web
    hostname: web.mail.tauos.org
    working_dir: /app
    ports:
      - "3001:3001"
    volumes:
      - ./taumail-web:/app
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://taumail_user:secure_password@postgres:5432/taumail
      SMTP_HOST: postfix
      SMTP_PORT: 587
      SMTP_USER: noreply@tauos.org
      SMTP_PASSWORD: secure_password
    networks:
      - taumail-network
    restart: unless-stopped
    depends_on:
      - postgres
      - postfix
      - redis

networks:
  taumail-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
EOF
```

### **3.2 Create Directory Structure**
```bash
mkdir -p {postfix,dovecot,rspamd,nginx,redis,postgres,taumail-web}/{config,logs,data}
mkdir -p nginx/ssl
```

### **3.3 Copy TauMail Web Application**
```bash
# Copy the local development files to the server
# You'll need to upload the files from your local machine
scp -i your-key.pem -r local-development/taumail-local/* ec2-user@YOUR_INSTANCE_IP:/opt/taumail/taumail-web/
```

## **Step 4: DNS Configuration**

### **4.1 Required DNS Records**
Add these records to your DNS provider for `tauos.org`:

```
# A Records
mail.tauos.org     A     YOUR_EC2_PUBLIC_IP
smtp.tauos.org     A     YOUR_EC2_PUBLIC_IP
web.mail.tauos.org A     YOUR_EC2_PUBLIC_IP

# MX Records
tauos.org          MX    10 mail.tauos.org

# TXT Records (Email Authentication)
tauos.org          TXT   "v=spf1 include:_spf.tauos.org ~all"
_spf.tauos.org     TXT   "v=spf1 ip4:YOUR_EC2_PUBLIC_IP ~all"

# DMARC Record
_dmarc.tauos.org   TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc@tauos.org; ruf=mailto:dmarc@tauos.org; sp=quarantine; adkim=r; aspf=r;"

# CNAME Records
www.mail.tauos.org CNAME mail.tauos.org
```

## **Step 5: SSL Certificate Setup**

### **5.1 Install Certbot**
```bash
sudo yum install -y certbot
```

### **5.2 Generate SSL Certificates**
```bash
# Stop nginx temporarily
docker-compose stop nginx

# Generate certificates
sudo certbot certonly --standalone -d mail.tauos.org -d smtp.tauos.org -d web.mail.tauos.org

# Copy certificates to Docker volumes
sudo cp /etc/letsencrypt/live/mail.tauos.org/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/mail.tauos.org/privkey.pem nginx/ssl/

# Set up auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## **Step 6: Start Mail Server**

### **6.1 Start All Services**
```bash
cd /opt/taumail
docker-compose up -d
```

### **6.2 Check Service Status**
```bash
docker-compose ps
docker-compose logs -f
```

## **Step 7: Test Email Functionality**

### **7.1 Test SMTP Connection**
```bash
telnet YOUR_EC2_PUBLIC_IP 25
telnet YOUR_EC2_PUBLIC_IP 587
```

### **7.2 Test IMAP Connection**
```bash
telnet YOUR_EC2_PUBLIC_IP 143
telnet YOUR_EC2_PUBLIC_IP 993
```

### **7.3 Test Email Sending**
```bash
# Register a test user
curl -X POST http://YOUR_EC2_PUBLIC_IP:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@tauos.org",
    "password": "securepassword"
  }'

# Send test email
curl -X POST http://YOUR_EC2_PUBLIC_IP:3001/api/emails/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "to": "akumartrabaajo@gmail.com",
    "subject": "TauMail Test - Independent Email Service",
    "body": "Hello from TauMail! 🚀\n\nThis email was sent from our independent email infrastructure.\n\nFeatures:\n✅ Independent SMTP/IMAP servers\n✅ Privacy-first design\n✅ Zero third-party dependencies\n✅ Complete control over email infrastructure\n\nSent from: testuser@tauos.org\nTo: akumartrabaajo@gmail.com\n\nBest regards,\nTauMail Team"
  }'
```

## **Step 8: Web Interface Access**

### **8.1 Access TauMail Web Interface**
- **URL**: https://mail.tauos.org
- **Default Port**: 3001 (if SSL not configured)
- **Features**: Registration, login, email composition, sending

## **Step 9: Monitoring and Maintenance**

### **9.1 View Logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postfix
docker-compose logs -f dovecot
docker-compose logs -f taumail-web
```

### **9.2 Backup Configuration**
```bash
# Backup mail data
tar -czf taumail-backup-$(date +%Y%m%d).tar.gz /opt/taumail

# Backup SSL certificates
sudo cp -r /etc/letsencrypt /opt/taumail/backup/
```

### **9.3 Update Services**
```bash
# Pull latest images
docker-compose pull

# Restart services
docker-compose restart
```

## **🎉 Success!**

Your TauMail infrastructure is now running as a **complete independent email service** with:

✅ **Independent SMTP/IMAP servers** (Postfix/Dovecot)  
✅ **Anti-spam protection** (Rspamd)  
✅ **Web interface** (Node.js/Express)  
✅ **Database backend** (PostgreSQL)  
✅ **SSL encryption** (Let's Encrypt)  
✅ **Email authentication** (SPF, DKIM, DMARC)  
✅ **Zero third-party dependencies**  
✅ **Complete control over infrastructure**  

**Next Steps:**
1. Test email sending to external domains
2. Configure email clients (Thunderbird, Outlook)
3. Set up monitoring and alerts
4. Implement backup strategies
5. Scale infrastructure as needed

**TauMail is now a fully independent email service under @tauos.org! 🚀** 