# Squarespace DNS Configuration Guide for TauMail

## Overview

This guide provides step-by-step instructions for configuring DNS records in Squarespace to support TauMail deployment for the TauOS project.

## Domain Configuration

- **Primary Domain**: arholdings.group
- **Subdomain**: tauos
- **Mail Domain**: mail.tauos.arholdings.group
- **Webmail Domain**: webmail.tauos.arholdings.group
- **API Domain**: api.tauos.arholdings.group

## Step-by-Step DNS Configuration

### 1. Access Squarespace Domain Manager

1. Log in to your Squarespace account
2. Navigate to **Settings** → **Domains**
3. Select **arholdings.group**
4. Click on **DNS Settings**

### 2. Add A Records

Add the following A records pointing to your server IP address:

| Name | Type | Value | TTL |
|------|------|-------|-----|
| `mail.tauos` | A | `YOUR_SERVER_IP` | 3600 |
| `webmail.tauos` | A | `YOUR_SERVER_IP` | 3600 |
| `api.tauos` | A | `YOUR_SERVER_IP` | 3600 |

**Instructions:**
1. Click **Add Record**
2. Select **A** as the record type
3. Enter the name (e.g., `mail.tauos`)
4. Enter your server IP address
5. Set TTL to 3600 (1 hour)
6. Click **Save**

### 3. Add MX Records

Add MX records for mail server configuration:

| Name | Type | Value | Priority | TTL |
|------|------|-------|----------|-----|
| `mail.tauos` | MX | `mail.tauos.arholdings.group` | 10 | 3600 |

**Instructions:**
1. Click **Add Record**
2. Select **MX** as the record type
3. Enter `mail.tauos` as the name
4. Enter `mail.tauos.arholdings.group` as the value
5. Set priority to 10
6. Set TTL to 3600
7. Click **Save**

### 4. Add TXT Records for Email Security

#### SPF Record
| Name | Type | Value | TTL |
|------|------|-------|-----|
| `mail.tauos` | TXT | `v=spf1 mx a ip4:YOUR_SERVER_IP ~all` | 3600 |

#### DMARC Record
| Name | Type | Value | TTL |
|------|------|-------|-----|
| `_dmarc.mail.tauos` | TXT | `v=DMARC1; p=quarantine; rua=mailto:dmarc@mail.tauos.arholdings.group; ruf=mailto:dmarc@mail.tauos.arholdings.group` | 3600 |

#### DKIM Record (After generating DKIM key)
| Name | Type | Value | TTL |
|------|------|-------|-----|
| `default._domainkey.mail.tauos` | TXT | `v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY` | 3600 |

### 5. Add CNAME Records

| Name | Type | Value | TTL |
|------|------|-------|-----|
| `webmail.tauos` | CNAME | `mail.tauos.arholdings.group` | 3600 |
| `api.tauos` | CNAME | `mail.tauos.arholdings.group` | 3600 |

## Port Configuration

Ensure your server allows the following ports:

| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| SMTP | 587 | STARTTLS | Mail submission |
| SMTP | 465 | SSL | Secure mail submission |
| IMAP | 993 | SSL | Secure mail retrieval |
| POP3 | 995 | SSL | Secure mail retrieval |
| HTTP | 80 | HTTP | Webmail and redirects |
| HTTPS | 443 | HTTPS | Secure webmail |

## SSL Certificate Configuration

### Let's Encrypt Certificates

The deployment script will automatically generate SSL certificates for:
- `mail.tauos.arholdings.group`
- `webmail.tauos.arholdings.group`
- `api.tauos.arholdings.group`

### Certificate Renewal

Certificates will auto-renew via cron job:
```bash
0 12 * * * /usr/bin/certbot renew --quiet
```

## Testing DNS Configuration

### 1. Test A Records
```bash
nslookup mail.tauos.arholdings.group
nslookup webmail.tauos.arholdings.group
nslookup api.tauos.arholdings.group
```

### 2. Test MX Records
```bash
nslookup -type=mx mail.tauos.arholdings.group
```

### 3. Test TXT Records
```bash
nslookup -type=txt mail.tauos.arholdings.group
nslookup -type=txt _dmarc.mail.tauos.arholdings.group
```

### 4. Test Mail Server
```bash
telnet mail.tauos.arholdings.group 587
telnet mail.tauos.arholdings.group 993
```

## Troubleshooting

### Common Issues

1. **DNS Propagation Delay**
   - DNS changes can take up to 48 hours to propagate
   - Use online DNS checkers to verify propagation

2. **SSL Certificate Issues**
   - Ensure ports 80 and 443 are open for certificate validation
   - Check firewall settings

3. **Mail Server Not Responding**
   - Verify server IP is correct
   - Check firewall rules for mail ports
   - Ensure mail services are running

### Verification Commands

```bash
# Check DNS resolution
dig mail.tauos.arholdings.group
dig webmail.tauos.arholdings.group

# Check mail server connectivity
telnet mail.tauos.arholdings.group 587
telnet mail.tauos.arholdings.group 993

# Check SSL certificate
openssl s_client -connect webmail.tauos.arholdings.group:443 -servername webmail.tauos.arholdings.group
```

## Security Considerations

### Firewall Configuration
Ensure your server firewall allows:
- Port 80 (HTTP) - for certificate validation
- Port 443 (HTTPS) - for webmail
- Port 587 (SMTP) - for mail submission
- Port 993 (IMAP) - for mail retrieval

### Rate Limiting
Configure rate limiting to prevent abuse:
- SMTP: 100 messages per hour per IP
- IMAP: 10 connections per minute per IP
- Webmail: 1000 requests per hour per IP

## Monitoring

### DNS Health Checks
Set up monitoring for:
- DNS resolution
- SSL certificate expiration
- Mail server availability
- Webmail accessibility

### Alert Configuration
Configure alerts for:
- Certificate expiration (30 days before)
- Mail server downtime
- High resource usage
- Failed login attempts

## Next Steps

After DNS configuration:

1. **Deploy TauMail**: Run the production deployment script
2. **Test Email**: Send test emails to verify functionality
3. **Configure Mail Clients**: Set up Thunderbird, Apple Mail, etc.
4. **Monitor Performance**: Set up monitoring and alerting
5. **Launch Beta**: Begin internal beta testing

## Support

For DNS configuration issues:
- Check Squarespace DNS documentation
- Verify server IP address
- Test DNS propagation with online tools
- Contact Squarespace support if needed

For TauMail deployment issues:
- Check deployment logs
- Verify SSL certificate generation
- Test mail server connectivity
- Review firewall configuration 