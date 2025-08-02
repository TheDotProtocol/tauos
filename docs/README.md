# TauOS Project Documentation

## Overview

TauOS is a privacy-first, security-focused operating system designed to provide users with complete control over their Gateway to the Future of Computing. This documentation provides comprehensive technical details for whitepaper creation, branding, and community governance.

## Documentation Structure

### 📋 [System Architecture](./architecture/)
- **Kernel & Bootloader**: Custom Linux kernel, U-Boot, GRUB integration
- **Desktop Environment**: GTK4 stack, TauHome, TauDock, TauStore
- **Applications**: TauMail, TauCloud backend architecture
- **Service Interaction**: Detailed system component diagrams

### 👨‍💻 [Developer Documentation](./developer/)
- **Module Breakdown**: Technical details for each component
- **Build System**: Cargo workspace, testing, deployment
- **Contributing Guide**: Development environment setup
- **API Documentation**: REST endpoints and authentication

### 🔐 [Compliance Strategy](./compliance/)
- **GDPR + DPDP**: Privacy dashboard implementation
- **TauID System**: DID:WEB decentralized identity
- **TauVoice**: Privacy-first STT/TTS architecture
- **Data Management**: Export, delete, reset functionality

### 🎨 [Release Assets](./assets/)
- **Screenshots**: High-quality images of all applications
- **App Icons**: SVG assets and branding materials
- **UI Components**: Design system and visual elements
- **Marketing Assets**: Professional presentation materials

### 📦 [Release Documentation](./releases/)
- **Changelog**: Detailed version history
- **QA Results**: Testing reports and quality metrics
- **Release Notes**: Component-specific documentation
- **Deployment Guides**: Production setup instructions

## Quick Links

- **Live Applications**: 
  - [TauMail](https://mail.tauos.org) - Email service
  - [TauCloud](https://cloud.tauos.org) - Cloud storage
  - [TauOS Website](https://www.tauos.org) - Main site
- **GitHub Repository**: [TheDotProtocol/tauos](https://github.com/TheDotProtocol/tauos)
- **Production Status**: All systems operational with PostgreSQL integration

## Technology Stack

- **Kernel**: Custom Linux (6.6.30)
- **Desktop**: GTK4 with Rust backend
- **Applications**: Node.js/Express with PostgreSQL
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel with custom domains
- **Security**: JWT authentication, bcryptjs hashing
- **Privacy**: Zero telemetry, GDPR compliant

## Production Status

✅ **All Systems Operational**
- TauMail: https://mail.tauos.org
- TauCloud: https://cloud.tauos.org
- Website: https://www.tauos.org
- Database: Supabase PostgreSQL connected
- Authentication: JWT tokens working
- Health Monitoring: All endpoints operational

---

*Last Updated: August 2, 2025*
*Status: Production Ready for Public Launch* 