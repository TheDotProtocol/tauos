# TauMail DNS Configuration

## Required DNS Records for tauos.org

### A Records
```
mail.tauos.org     A     [YOUR_EC2_PUBLIC_IP]
smtp.tauos.org     A     [YOUR_EC2_PUBLIC_IP]
web.mail.tauos.org A     [YOUR_EC2_PUBLIC_IP]
```

### MX Records
```
tauos.org          MX    10 mail.tauos.org
```

### TXT Records (Email Authentication)
```
tauos.org          TXT   "v=spf1 include:_spf.tauos.org ~all"
_spf.tauos.org     TXT   "v=spf1 ip4:[YOUR_EC2_PUBLIC_IP] ~all"
```

### DKIM Records
```
default._domainkey.tauos.org  TXT  "v=DKIM1; k=rsa; p=[YOUR_PUBLIC_KEY]"
```

### DMARC Record
```
_dmarc.tauos.org   TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc@tauos.org; ruf=mailto:dmarc@tauos.org; sp=quarantine; adkim=r; aspf=r;"
```

### CNAME Records
```
www.mail.tauos.org CNAME mail.tauos.org
```

## Route53 Configuration (if using AWS Route53)

### Hosted Zone Setup
1. Create hosted zone for `tauos.org`
2. Update nameservers with your domain registrar
3. Add all records above to the hosted zone

### Automatic DNS Updates
The CloudFormation template includes IAM permissions for automatic DNS updates:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "route53:ChangeResourceRecordSets",
        "route53:GetChange",
        "route53:ListResourceRecordSets"
      ],
      "Resource": [
        "arn:aws:route53:::hosted-zone/*",
        "arn:aws:route53:::change/*"
      ]
    }
  ]
}
```

## SSL Certificate Configuration

### Let's Encrypt Setup
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d mail.tauos.org -d smtp.tauos.org -d web.mail.tauos.org

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Certificate Paths
- Certificate: `/etc/letsencrypt/live/mail.tauos.org/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/mail.tauos.org/privkey.pem`

## Email Testing

### Test Commands
```bash
# Test SMTP
telnet smtp.tauos.org 25
telnet smtp.tauos.org 587

# Test IMAP
telnet mail.tauos.org 143
telnet mail.tauos.org 993

# Test POP3
telnet mail.tauos.org 110
telnet mail.tauos.org 995
```

### Email Authentication Testing
```bash
# Test SPF
dig TXT tauos.org
dig TXT _spf.tauos.org

# Test DKIM
dig TXT default._domainkey.tauos.org

# Test DMARC
dig TXT _dmarc.tauos.org
```

## Security Headers

### Nginx Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
``` 