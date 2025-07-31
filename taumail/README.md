# TauMail - Self-Hosted Secure Email Service

## Overview

TauMail is a comprehensive, self-hosted email service designed to be the default email client on TauOS while providing cross-platform accessibility. It prioritizes security, privacy, and performance while matching or exceeding the UX of Gmail/Outlook.

## Features

### 🔐 Security & Privacy
- **Zero Telemetry**: No data tracking or analytics
- **End-to-End Encryption**: Optional E2E encryption for local drafts and inbox
- **PGP Integration**: Built-in PGP key generation and management
- **Anti-Phishing**: Custom filters and header inspection
- **SPF/DKIM/DMARC**: Strict policies for all hosted domains
- **S/MIME Support**: Full support for encrypted attachments

### 🌐 Cross-Platform Support
- **TauOS**: Native default email client
- **Windows/macOS**: Electron-based desktop apps
- **Android/iOS**: Flutter-based mobile apps
- **Web**: Accessible via `mail.tauos.org`
- **External Clients**: IMAP/SMTP credentials for Outlook/Thunderbird

### 📧 Mail Server Infrastructure
- **Postfix**: SMTP server with advanced filtering
- **Dovecot**: IMAP/POP3 server with modern features
- **Rspamd**: Anti-spam and DKIM signing
- **TLS/SSL**: Let's Encrypt integration
- **Auto-scaling**: Dedicated server cluster

### 🎨 Webmail Interface
- **Next.js + TypeScript**: Modern, fast web framework
- **TailwindCSS**: Beautiful, responsive design
- **Gmail-style Layout**: Familiar user experience
- **PWA Support**: Progressive Web App capabilities
- **Real-time Sync**: IMAP IDLE for instant notifications

### 🛠 Admin Tools
- **Dashboard**: Domain & DNS setup, user management
- **Queue Manager**: Email queue monitoring and management
- **Backup/Restore**: Automated backup system
- **Migration Scripts**: From GSuite, Zoho, cPanel

### 🔌 Developer Features
- **OAuth2**: TauID integration
- **Public API**: Mail send, fetch, notifications
- **Webhooks**: Event triggers for new mail, replies, bounces

## Hosted Domains

TauMail will host email for all AR Holdings domains:
- `arholdings.group`
- `tauos.org`
- `thedotprotocol.com`
- `thebraindefence.org`
- `globaldotbank.org`
- `kibouor.org`
- `dotprotocolscan.com`
- `asktrabaajo.com`

## Architecture

```
TauMail/
├── server/           # Mail server infrastructure
│   ├── postfix/     # SMTP server configuration
│   ├── dovecot/     # IMAP/POP3 server configuration
│   ├── rspamd/      # Anti-spam and DKIM
│   └── ssl/         # TLS/SSL certificates
├── webmail/         # Next.js webmail interface
│   ├── src/         # TypeScript source code
│   ├── components/  # React components
│   └── styles/      # TailwindCSS styles
├── admin/           # Admin dashboard and tools
│   ├── dashboard/   # Admin web interface
│   └── api/         # Admin API endpoints
├── clients/         # Cross-platform native clients
│   ├── tauos/       # TauOS native client
│   ├── windows/     # Windows Electron app
│   ├── macos/       # macOS Electron app
│   ├── android/     # Android Flutter app
│   └── ios/         # iOS Flutter app
├── config/          # Configuration files
├── docs/            # Documentation
└── scripts/         # Deployment and maintenance scripts
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Domain names with DNS access
- Server with Ubuntu 22.04+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tauos/taumail.git
   cd taumail
   ```

2. **Configure domains**
   ```bash
   cp config/domains.example.yml config/domains.yml
   # Edit domains.yml with your domain configurations
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Access webmail**
   - Webmail: https://mail.tauos.org
   - Admin: https://mail.tauos.org/admin

## Development

### Webmail Development
```bash
cd webmail
npm install
npm run dev
```

### Server Configuration
```bash
cd server
# Edit postfix, dovecot, and rspamd configurations
```

### Client Development
```bash
# TauOS native client
cd clients/tauos
cargo build

# Desktop clients
cd clients/windows
npm install
npm run dev
```

## Security Features

### Encryption
- **TLS/SSL**: All connections encrypted with Let's Encrypt certificates
- **E2E Encryption**: Optional client-side encryption for sensitive emails
- **PGP Support**: Full PGP key management and encryption
- **S/MIME**: Support for S/MIME certificates and encrypted attachments

### Anti-Spam & Security
- **Rspamd**: Advanced spam filtering with machine learning
- **DKIM Signing**: Email authentication and integrity
- **SPF/DMARC**: Domain reputation protection
- **Custom Filters**: Anti-phishing and header inspection

### Privacy
- **Zero Telemetry**: No data collection or analytics
- **Local Processing**: All filtering and processing done locally
- **No Third-Party Services**: Complete self-hosted solution
- **Data Ownership**: Full control over all email data

## Performance

### Optimizations
- **IMAP IDLE**: Real-time email notifications
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis-based caching for fast access
- **CDN Integration**: Global content delivery
- **Auto-scaling**: Kubernetes-based scaling

### Benchmarks
- **Email Delivery**: < 1 second for local delivery
- **Webmail Load**: < 2 seconds for inbox loading
- **Search**: < 500ms for full-text search
- **Sync**: Real-time across all platforms

## Deployment

### Production Deployment
```bash
# Deploy to production server
./scripts/deploy.sh production

# Configure SSL certificates
./scripts/ssl-setup.sh

# Set up monitoring
./scripts/monitoring-setup.sh
```

### Docker Deployment
```bash
# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale webmail=3
```

## Monitoring & Maintenance

### Health Checks
```bash
# Check service health
./scripts/health-check.sh

# Monitor email queue
./scripts/queue-monitor.sh

# Check SSL certificates
./scripts/ssl-check.sh
```

### Backup & Recovery
```bash
# Create backup
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh backup-2024-01-01.tar.gz
```

## API Documentation

### REST API
- **Authentication**: OAuth2 with TauID
- **Rate Limiting**: 1000 requests per hour per user
- **Webhooks**: Real-time event notifications

### SDK Libraries
- **JavaScript/TypeScript**: `@taumail/sdk`
- **Python**: `taumail-python`
- **Rust**: `taumail-rust`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

TauMail is licensed under the MIT License. See LICENSE file for details.

## Support

- **Documentation**: https://docs.taumail.org
- **Issues**: https://github.com/tauos/taumail/issues
- **Discussions**: https://github.com/tauos/taumail/discussions
- **Email**: support@taumail.org

---

**TauMail** - Secure, Private, Self-Hosted Email for the Modern Web 