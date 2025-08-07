# AWS Setup Instructions for TauMail

## Quick Start

1. **Launch EC2 Instance**
   - Instance Type: t3.medium
   - AMI: Amazon Linux 2
   - Security Group: Allow ports 22, 25, 587, 465, 143, 993, 110, 995, 80, 443

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ec2-user@YOUR_INSTANCE_IP
   ```

3. **Install Docker**
   ```bash
   sudo yum update -y
   sudo yum install -y docker git
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user
   ```

4. **Install Docker Compose**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

5. **Upload Deployment Package**
   ```bash
   scp -i your-key.pem infrastructure/taumail-deployment.tar.gz ec2-user@YOUR_INSTANCE_IP:~/
   ```

6. **Extract and Setup**
   ```bash
   ssh -i your-key.pem ec2-user@YOUR_INSTANCE_IP
   mkdir -p /opt/taumail
   cd /opt/taumail
   tar -xzf ~/taumail-deployment.tar.gz
   mv taumail-web/* .
   rm -rf taumail-web
   ```

7. **Start Services**
   ```bash
   docker-compose up -d
   ```

8. **Configure DNS**
   - Add A records for mail.tauos.org, smtp.tauos.org
   - Add MX record for tauos.org
   - Add SPF, DKIM, DMARC records

9. **Setup SSL**
   ```bash
   sudo yum install -y certbot
   sudo certbot certonly --standalone -d mail.tauos.org -d smtp.tauos.org
   ```

10. **Test Email**
    ```bash
    curl -X POST http://YOUR_INSTANCE_IP:3001/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"username": "testuser", "email": "testuser@tauos.org", "password": "password"}'
    ```

## DNS Records Required

```
mail.tauos.org     A     YOUR_EC2_IP
smtp.tauos.org     A     YOUR_EC2_IP
tauos.org          MX    10 mail.tauos.org
tauos.org          TXT   "v=spf1 include:_spf.tauos.org ~all"
_spf.tauos.org     TXT   "v=spf1 ip4:YOUR_EC2_IP ~all"
_dmarc.tauos.org   TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc@tauos.org; ruf=mailto:dmarc@tauos.org; sp=quarantine; adkim=r; aspf=r;"
```

## Test Email Command

```bash
curl -X POST http://YOUR_EC2_IP:3001/api/emails/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "to": "akumartrabaajo@gmail.com",
    "subject": "TauMail Test - Independent Email Service",
    "body": "Hello from TauMail! 🚀\n\nThis email was sent from our independent email infrastructure.\n\nFeatures:\n✅ Independent SMTP/IMAP servers\n✅ Privacy-first design\n✅ Zero third-party dependencies\n✅ Complete control over email infrastructure\n\nSent from: testuser@tauos.org\nTo: akumartrabaajo@gmail.com\n\nBest regards,\nTauMail Team"
  }'
```
