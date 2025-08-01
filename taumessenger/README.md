# TauMessenger - Secure Instant Messaging

## Overview

TauMessenger is a privacy-first instant messaging application built for the TauOS ecosystem. It provides secure, end-to-end encrypted messaging with features matching or exceeding iMessage and WhatsApp, fully integrated with TauMail.

## Features

### 💬 Instant Messaging
- **1-on-1 and Group Chats**: Support for unlimited participants
- **End-to-End Encryption**: Signal Protocol for all messages
- **File Sharing**: Secure file, image, and document sharing
- **Voice Messages**: High-quality voice note recording
- **Emojis and Reactions**: Rich emoji support with message reactions
- **Read Receipts**: Message delivery and read status
- **Typing Indicators**: Real-time typing notifications

### 🔐 Security & Privacy
- **Zero Knowledge**: No message metadata stored on servers
- **Self-Hosted**: Complete control over your messaging infrastructure
- **No Telemetry**: Zero analytics or data collection
- **Message Encryption**: All messages encrypted at rest and in transit
- **Perfect Forward Secrecy**: Automatic key rotation

### 📱 Cross-Platform Support
- **TauOS Native**: GTK4 + Rust application
- **Mobile Apps**: Flutter apps for Android & iOS
- **Desktop Apps**: Electron apps for Windows & macOS
- **Web Client**: Progressive Web App for browsers
- **TauMail Integration**: Seamless integration with email

### 🔔 Smart Features
- **Offline Sync**: Messages sync when back online
- **Contact Sync**: Automatic contact discovery via TauID
- **Push Notifications**: Instant notifications for new messages
- **Message Search**: Full-text search across all conversations
- **Message Backup**: Encrypted local and cloud backups
- **Message Expiry**: Optional self-destructing messages

## Architecture

```
TauMessenger/
├── server/           # Backend services
│   ├── messaging/    # Message handling service
│   ├── presence/     # Online status service
│   ├── sync/         # Message sync service
│   ├── push/         # Push notification service
│   └── auth/         # Authentication service
├── clients/          # Client applications
│   ├── tauos/        # TauOS native client
│   ├── mobile/       # Flutter mobile apps
│   ├── desktop/      # Electron desktop apps
│   └── web/          # Web client
├── shared/           # Shared libraries
│   ├── protocol/     # Messaging protocol
│   └── crypto/       # Encryption utilities
└── docs/             # Documentation
```

## Quick Start

### Prerequisites
- Rust 1.70+
- Flutter 3.10+
- Node.js 18+
- Docker & Docker Compose

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tauos/taumessenger.git
   cd taumessenger
   ```

2. **Start backend services**
   ```bash
   docker-compose up -d
   ```

3. **Run TauOS native client**
   ```bash
   cd clients/tauos
   cargo run
   ```

4. **Run mobile app**
   ```bash
   cd clients/mobile
   flutter run
   ```

## API Documentation

### REST API
- **Base URL**: `https://messenger.tauos.org/api/v1`
- **Authentication**: OAuth2 with TauID
- **Rate Limiting**: 1000 requests per hour

### WebSocket API
- **WebSocket**: `wss://messenger.tauos.org/ws`
- **Protocol**: Custom JSON-based messaging protocol
- **Encryption**: TLS 1.3 for all connections

### Message Protocol
- **Message Types**: Text, Image, File, Voice, Location
- **Group Support**: Create, join, leave, admin management
- **Sync Protocol**: Efficient message synchronization
- **Push Notifications**: Real-time message delivery

## Security

### Encryption
- **Message Encryption**: Signal Protocol for E2E encryption
- **Transport Security**: TLS 1.3 for all connections
- **Key Management**: Automatic key rotation and verification
- **Perfect Forward Secrecy**: New keys for each session

### Privacy
- **No Message Logs**: Message content not stored on servers
- **No Metadata**: Minimal metadata collection
- **Self-Hosted**: Complete data sovereignty
- **GDPR Compliant**: Full compliance with privacy regulations

## Performance

### Optimization
- **Message Compression**: Efficient message encoding
- **Image Optimization**: Automatic image compression
- **Offline Support**: Full offline functionality
- **Battery Optimization**: Efficient power usage on mobile

### Benchmarks
- **Message Delivery**: < 100ms for local messages
- **Image Sharing**: < 2s for 5MB images
- **Sync Speed**: < 5s for 1000 messages
- **Reliability**: 99.9% uptime

## Integration with TauMail

### Unified Experience
- **Single App**: Access mail and messages in one interface
- **Shared Contacts**: Contact sync between mail and messaging
- **Unified Notifications**: Combined notification center
- **Cross-Platform Sync**: Messages and mail sync across devices

### Features
- **Email-to-Chat**: Convert email threads to chat
- **Chat-to-Email**: Send chat messages as email
- **File Sharing**: Shared file storage between mail and chat
- **Contact Management**: Unified contact management

## Deployment

### Production Deployment
```bash
# Deploy to production
./scripts/deploy.sh production

# Configure SSL certificates
./scripts/ssl-setup.sh

# Set up monitoring
./scripts/monitoring-setup.sh
```

### Docker Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale messaging=3
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

TauMessenger is licensed under the MIT License. See LICENSE file for details.

## Support

- **Documentation**: https://docs.taumessenger.org
- **Issues**: https://github.com/tauos/taumessenger/issues
- **Discussions**: https://github.com/tauos/taumessenger/discussions
- **Email**: support@taumessenger.org

---

**TauMessenger** - Secure, Private, Self-Hosted Messaging for the Modern Web 