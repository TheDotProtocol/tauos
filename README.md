# TauOS Communication Suite

A comprehensive, privacy-first communication ecosystem providing secure email, messaging, video calling, calendar management, and cloud storage services.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/tauos/tauos.git
cd tauos

# Deploy the complete suite
./scripts/deploy_tau_suite_complete.sh production tauos
```

## 📧 Services Overview

### TauMail - Secure Email Service
- **Webmail Interface**: Modern Next.js + TypeScript UI
- **Mail Server**: Postfix + Dovecot + Rspamd
- **Security**: PGP/SMIME, SPF/DKIM/DMARC, E2E encryption
- **Integration**: Seamless integration with all other services

### TauConnect - Video/Voice Calling
- **WebRTC**: High-quality video and voice calls
- **Mediasoup**: Scalable media server
- **Integration**: Direct calling from emails and calendar events

### TauMessenger - Instant Messaging
- **Signal Protocol**: End-to-end encrypted messaging
- **Real-time**: Instant message delivery
- **Integration**: Chat from email threads

### TauCalendar - Calendar & Tasks
- **Event Management**: Full calendar functionality
- **Task Tracking**: Comprehensive task management
- **Integration**: Email-to-event conversion

### TauCloud - Private Cloud Storage
- **S3-Compatible**: MinIO-based storage
- **File Sync**: Real-time file synchronization
- **Integration**: Email attachment storage

## 🔗 Service Integration

All services work together seamlessly:

- **Email → Video Call**: Click to call from any email
- **Email → Chat**: Start messaging from email threads
- **Email → Calendar**: Convert emails to calendar events
- **Email → Storage**: Store attachments in TauCloud
- **Calendar → Video Call**: Schedule calls from events
- **Chat → Video Call**: Escalate chat to video call

## 🛡️ Security & Privacy

- **Zero Telemetry**: No data collection or analytics
- **Self-Hosted**: Complete data sovereignty
- **E2E Encryption**: End-to-end encryption for all communications
- **GDPR Compliant**: Full privacy regulation compliance
- **TLS 1.3**: Latest transport security

## 🏗️ Architecture

```
TauOS Communication Suite/
├── TauMail (mail.tauos.org)
│   ├── Webmail Interface (Next.js + TypeScript)
│   ├── Mail Server (Postfix + Dovecot + Rspamd)
│   ├── Admin Dashboard
│   └── API Gateway
├── TauConnect (connect.tauos.org)
│   ├── Video/Voice Calling (WebRTC + Mediasoup)
│   ├── Signaling Server
│   └── Media Server
├── TauMessenger (messenger.tauos.org)
│   ├── Instant Messaging (Signal Protocol)
│   ├── Message Server
│   └── Presence Server
├── TauCalendar (calendar.tauos.org)
│   ├── Calendar Management
│   ├── Task Management
│   └── Event Scheduling
└── TauCloud (cloud.tauos.org)
    ├── File Storage (MinIO S3-compatible)
    ├── File Sync
    └── Sharing Service
```

## 📦 Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+
- npm 8+
- Git
- OpenSSL

### Quick Deployment
```bash
# Deploy everything with one command
./scripts/deploy_tau_suite_complete.sh production tauos
```

### Manual Deployment
```bash
# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Deploy each service
cd taumail && docker-compose up -d --build
cd ../tauconnect && docker-compose up -d --build
cd ../taumessenger && docker-compose up -d --build
cd ../taucalendar && docker-compose up -d --build
cd ../taucloud && docker-compose up -d --build
```

## 🔧 Configuration

### Environment Variables
```bash
# Service Domains
TAUMAIL_DOMAIN=mail.tauos.org
TAUCONNECT_DOMAIN=connect.tauos.org
TAUMESSENGER_DOMAIN=messenger.tauos.org
TAUCALENDAR_DOMAIN=calendar.tauos.org
TAUCLOUD_DOMAIN=cloud.tauos.org

# Database & Redis
DATABASE_URL=postgresql://tauos:password@postgres:5432/tauos_suite
REDIS_PASSWORD=your_redis_password

# API Secrets
API_SECRET=your_api_secret
ADMIN_SECRET=your_admin_secret
JWT_SECRET=your_jwt_secret
```

### DNS Configuration
```
# A Records
mail.tauos.org -> YOUR_SERVER_IP
connect.tauos.org -> YOUR_SERVER_IP
messenger.tauos.org -> YOUR_SERVER_IP
calendar.tauos.org -> YOUR_SERVER_IP
cloud.tauos.org -> YOUR_SERVER_IP

# MX Records
mail.tauos.org -> mail.tauos.org (priority 10)

# TXT Records (SPF)
mail.tauos.org -> "v=spf1 mx a ip4:YOUR_SERVER_IP ~all"
```

## 📊 Monitoring

### Health Checks
```bash
# Check all services
curl https://mail.tauos.org/api/health
curl https://connect.tauos.org/api/health
curl https://messenger.tauos.org/api/health
curl https://calendar.tauos.org/api/health
curl https://cloud.tauos.org/api/health
```

### Prometheus + Grafana
- Real-time service monitoring
- Performance analytics
- Error tracking
- User activity metrics

## 🔄 Backup & Recovery

```bash
# Create backup
./scripts/backup_tau_suite.sh

# Restore from backup
./scripts/restore_tau_suite.sh backup-2024-01-01.tar.gz
```

## 🧪 Development

### Local Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Run tests
npm test

# Lint code
npm run lint
```

### API Development
```bash
# Start API server
cd taumail/webmail
npm run dev

# Test API endpoints
curl http://localhost:3000/api/health
```

## 📚 Documentation

- [Complete Documentation](docs/tauos_communication_suite.md)
- [API Reference](https://api.tauos.org/docs)
- [User Guide](https://docs.tauos.org)
- [Developer Guide](https://dev.tauos.org)

## 🐛 Troubleshooting

### Common Issues

1. **Services not starting**
   ```bash
   # Check logs
   docker-compose logs
   
   # Check service status
   docker-compose ps
   ```

2. **SSL certificate issues**
   ```bash
   # Renew certificates
   certbot renew
   ```

3. **Database connection issues**
   ```bash
   # Check database connectivity
   docker exec -it postgres psql -U tauos -d tauos_suite
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

TauOS Communication Suite is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.tauos.org](https://docs.tauos.org)
- **Issues**: [GitHub Issues](https://github.com/tauos/tauos/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tauos/tauos/discussions)
- **Email**: support@tauos.org

## 🌟 Features

### TauMail Features
- ✅ Modern webmail interface
- ✅ PGP/SMIME encryption
- ✅ Anti-spam protection
- ✅ Cross-platform clients
- ✅ Admin dashboard
- ✅ API integration

### TauConnect Features
- ✅ High-quality video calls
- ✅ Voice-only calls
- ✅ Screen sharing
- ✅ Recording capabilities
- ✅ WebRTC technology
- ✅ Scalable architecture

### TauMessenger Features
- ✅ End-to-end encryption
- ✅ Group chats
- ✅ File sharing
- ✅ Voice messages
- ✅ Read receipts
- ✅ Signal Protocol

### TauCalendar Features
- ✅ Event management
- ✅ Task tracking
- ✅ Recurring events
- ✅ Calendar sharing
- ✅ iCal support
- ✅ Mobile sync

### TauCloud Features
- ✅ S3-compatible storage
- ✅ File synchronization
- ✅ Sharing capabilities
- ✅ Version control
- ✅ Backup integration
- ✅ Cross-platform clients

---

**TauOS Communication Suite** - Secure, Private, Self-Hosted Communication for the Modern Web

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Security](https://img.shields.io/badge/Security-E2E%20Encrypted-green.svg)](https://en.wikipedia.org/wiki/End-to-end_encryption)
[![Privacy](https://img.shields.io/badge/Privacy-Zero%20Telemetry-red.svg)](https://en.wikipedia.org/wiki/Telemetry) 