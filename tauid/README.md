# TauID - Decentralized Identity System

## Overview

TauID is a privacy-first decentralized identity system built on the DID:WEB standard. It provides secure, self-sovereign identity management without blockchain dependencies.

## Features

- **DID:WEB Implementation**: Identity documents stored at `.well-known/did.json`
- **Local Key Generation**: Secure key generation and storage
- **Zero Blockchain Dependency**: Works without any blockchain
- **Privacy-First**: No tracking, no telemetry, complete user control
- **TauOS Integration**: Seamless integration with TauOS desktop

## Architecture

```
TauID System
├── DID Document (.well-known/did.json)
├── Local Key Storage
├── Authentication Service
├── Identity Management UI
└── TauOS Integration
```

## Components

### 1. DID Document Structure
```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:tauos.org",
  "verificationMethod": [
    {
      "id": "did:web:tauos.org#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:web:tauos.org",
      "publicKeyMultibase": "z..."
    }
  ],
  "authentication": ["did:web:tauos.org#key-1"],
  "service": [
    {
      "id": "did:web:tauos.org#tauid",
      "type": "TauIDService",
      "serviceEndpoint": "https://tauid.tauos.org"
    }
  ]
}
```

### 2. Local Key Management
- Ed25519 key pairs for authentication
- Secure local storage with encryption
- Key rotation capabilities
- Backup and recovery options

### 3. Authentication Flow
1. User creates TauID account
2. Local keys generated and stored
3. DID document created and published
4. Authentication via cryptographic proofs
5. Session management with JWT tokens

## Implementation

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- Docker & Docker Compose

### Quick Start

1. **Clone and Setup**:
```bash
cd tauos/tauid
npm install
```

2. **Environment Configuration**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**:
```bash
npm run db:migrate
npm run db:seed
```

4. **Start Services**:
```bash
docker-compose up -d
```

5. **Access TauID**:
- Web Interface: https://tauid.tauos.org
- API Documentation: https://tauid.tauos.org/docs

## API Endpoints

### Identity Management
- `POST /api/identity/create` - Create new TauID
- `GET /api/identity/:did` - Get identity document
- `PUT /api/identity/:did` - Update identity document
- `DELETE /api/identity/:did` - Delete identity

### Authentication
- `POST /api/auth/login` - Login with TauID
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify session
- `POST /api/auth/refresh` - Refresh token

### Key Management
- `POST /api/keys/generate` - Generate new key pair
- `GET /api/keys/:did` - Get public keys
- `PUT /api/keys/:did` - Update keys
- `DELETE /api/keys/:did` - Revoke keys

## Security Features

- **Zero Knowledge**: No personal data stored
- **End-to-End Encryption**: All communications encrypted
- **Local Key Storage**: Keys never leave user's device
- **Audit Logging**: Complete audit trail
- **GDPR Compliant**: Full privacy compliance

## Integration with TauOS

### Desktop Integration
- TauOS login screen integration
- System-wide identity management
- Application authentication
- File encryption with TauID keys

### Service Integration
- TauMail authentication
- TauCloud access control
- Tau Store user management
- System settings integration

## Development

### Local Development
```bash
npm run dev
npm run test
npm run build
```

### Docker Development
```bash
docker-compose -f docker-compose.dev.yml up
```

## Deployment

### Production Deployment
```bash
./deploy.sh
```

### Environment Variables
- `TAUID_DOMAIN` - TauID domain (default: tauid.tauos.org)
- `TAUID_SECRET` - JWT secret key
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string

## Monitoring

- **Health Checks**: `/health` endpoint
- **Metrics**: Prometheus metrics
- **Logs**: Structured JSON logging
- **Alerts**: Automated alerting

## Support

- **Documentation**: https://docs.tauos.org/tauid
- **Issues**: GitHub Issues
- **Community**: Discord #tauid
- **Email**: tauid@tauos.org

## License

MIT License - See LICENSE file for details. 