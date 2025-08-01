# TauCloud - Privacy-First Cloud Storage

TauCloud is a privacy-focused cloud storage system built on TauOS principles. It provides secure, encrypted file storage with zero telemetry and complete user control over data.

## Features

### 🔒 Privacy & Security
- **Client-side AES256 encryption** - Files encrypted before upload
- **Zero telemetry** - No data collection or analytics
- **OAuth2/JWT authentication** - Secure user management
- **End-to-end encryption** - Only users can decrypt their data
- **GDPR compliant** - Full privacy regulation compliance

### 📁 File Management
- **Folder creation and organization** - Hierarchical file structure
- **File operations** - Upload, download, rename, delete, move
- **File sharing** - Secure sharing with expiration and permissions
- **File preview** - PDF, images, documents, videos
- **Version history** - File versioning and recovery
- **Trash recovery** - Deleted file restoration

### 🖥️ Cross-Platform Support
- **Web UI** - Modern responsive interface
- **Desktop sync client** - Native TauOS, Windows, macOS
- **Mobile app** - iOS and Android support
- **CLI tools** - Command-line interface

### 🛠️ Admin Features
- **Storage monitoring** - Usage analytics and quotas
- **User management** - Admin dashboard
- **System health** - Performance monitoring
- **Backup management** - Automated backups

## Architecture

```
TauCloud/
├── frontend/          # Next.js web application
├── backend/           # Node.js Express API
├── desktop-client/    # Electron desktop app
├── mobile-client/     # React Native mobile app
├── cli/              # Command-line tools
├── docker/           # Docker configuration
└── docs/             # Documentation
```

## Technology Stack

### Frontend
- **Next.js 14** - React framework with SSR
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **TauUI** - Custom TauOS design system
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **MinIO** - S3-compatible object storage
- **JWT** - Authentication tokens

### Security
- **AES256-GCM** - Client-side encryption
- **Argon2** - Password hashing
- **Rate limiting** - API protection
- **CORS** - Cross-origin security
- **Helmet** - Security headers

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **Nginx** - Reverse proxy
- **Let's Encrypt** - SSL certificates
- **Prometheus** - Monitoring
- **Grafana** - Dashboards

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ and npm
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/tauos/taucloud.git
cd taucloud
```

2. **Start with Docker**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

3. **Manual Setup**
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development servers
npm run dev:frontend
npm run dev:backend
```

### Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## API Documentation

The API is documented with Swagger/OpenAPI and available at:
- **Development**: http://localhost:3001/api/docs
- **Production**: https://cloud.arholdings.group/api/docs

## Security Features

### Encryption
- **Client-side AES256-GCM** encryption
- **Zero-knowledge** architecture
- **End-to-end** encryption for all data
- **Secure key derivation** with PBKDF2

### Authentication
- **OAuth2** integration with TauID
- **JWT tokens** with short expiration
- **Refresh tokens** for session management
- **Multi-factor authentication** support

### Data Protection
- **GDPR compliance** - Right to be forgotten
- **Data residency** - Choose storage location
- **Audit logging** - Complete access logs
- **Backup encryption** - Encrypted backups

## File Operations

### Upload
1. File encrypted with AES256-GCM on client
2. Encrypted file uploaded to MinIO
3. Metadata stored in PostgreSQL
4. File accessible only to owner

### Download
1. Encrypted file retrieved from MinIO
2. Decrypted on client using user's key
3. Original file restored to user

### Sharing
1. Generate temporary access token
2. Set expiration and permissions
3. Share link with recipient
4. Recipient can access within limits

## Monitoring

### Metrics
- **Storage usage** - Per user and total
- **API performance** - Response times
- **Error rates** - System health
- **User activity** - Usage patterns

### Alerts
- **Storage quota** - Usage warnings
- **System health** - Service availability
- **Security events** - Suspicious activity
- **Performance** - Slow response times

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

TauCloud is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: https://docs.tauos.arholdings.group/taucloud
- **Issues**: https://github.com/tauos/taucloud/issues
- **Discussions**: https://github.com/tauos/taucloud/discussions
- **Email**: support@arholdings.group

---

Built with ❤️ for privacy and security by the TauOS team. 