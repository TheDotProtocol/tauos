# TauCalendar - Secure Calendar & Task Management

## Overview

TauCalendar is a privacy-first calendar and task management application built for the TauOS ecosystem. It provides secure, end-to-end encrypted calendar syncing with features matching or exceeding Google Calendar and Apple Calendar.

## Features

### 📅 Calendar Management
- **Event Creation**: Create, edit, and manage calendar events
- **Multiple Views**: Daily, weekly, monthly, and yearly views
- **Recurring Events**: Support for complex recurring patterns
- **Event Reminders**: Customizable reminder notifications
- **Event Invitations**: Send and manage event invitations
- **Calendar Sharing**: Share calendars with specific users or groups
- **Calendar Sync**: Sync with Google Calendar, Outlook, and iCal

### ✅ Task Management
- **Task Lists**: Create and organize task lists
- **Due Dates**: Set due dates and priorities for tasks
- **Task Assignment**: Assign tasks to team members
- **Progress Tracking**: Track task completion and progress
- **Email Integration**: Convert emails to tasks from TauMail
- **Drag-and-Drop**: Intuitive drag-and-drop interface
- **Task Templates**: Reusable task templates

### 🔐 Security & Privacy
- **End-to-End Encryption**: All calendar data encrypted
- **Zero Knowledge**: No calendar metadata stored on servers
- **Self-Hosted**: Complete control over your calendar data
- **No Telemetry**: Zero analytics or data collection
- **Data Sovereignty**: Full ownership of all calendar data

### 📱 Cross-Platform Support
- **TauOS Native**: GTK4 + Rust application
- **Mobile Apps**: Flutter apps for Android & iOS
- **Desktop Apps**: Electron apps for Windows & macOS
- **Web Client**: Progressive Web App for browsers
- **Calendar Sync**: Sync across all devices and platforms

### 🔔 Smart Features
- **Smart Scheduling**: AI-powered scheduling suggestions
- **Conflict Detection**: Automatic conflict detection and resolution
- **Travel Time**: Automatic travel time calculation
- **Weather Integration**: Weather information for outdoor events
- **Location Services**: Location-based event suggestions
- **Time Zone Support**: Automatic time zone handling

## Architecture

```
TauCalendar/
├── server/           # Backend services
│   ├── calendar/     # Calendar service
│   ├── tasks/        # Task management service
│   ├── sync/         # Calendar sync service
│   ├── notifications/ # Reminder service
│   └── auth/         # Authentication service
├── clients/          # Client applications
│   ├── tauos/        # TauOS native client
│   ├── mobile/       # Flutter mobile apps
│   ├── desktop/      # Electron desktop apps
│   └── web/          # Web client
├── shared/           # Shared libraries
│   ├── protocol/     # Calendar protocol
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
   git clone https://github.com/tauos/taucalendar.git
   cd taucalendar
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
- **Base URL**: `https://calendar.tauos.org/api/v1`
- **Authentication**: OAuth2 with TauID
- **Rate Limiting**: 1000 requests per hour

### Calendar Protocol
- **iCal Support**: Full iCalendar format support
- **CalDAV Support**: CalDAV protocol for calendar sync
- **Event Types**: Meetings, reminders, tasks, all-day events
- **Recurrence**: Complex recurring event patterns

### Task Protocol
- **Task Types**: Personal, work, shared, recurring
- **Priority Levels**: High, medium, low, none
- **Status Tracking**: Not started, in progress, completed
- **Assignment**: User assignment and delegation

## Security

### Encryption
- **Calendar Encryption**: AES-256 encryption for all data
- **Transport Security**: TLS 1.3 for all connections
- **Key Management**: Automatic key rotation and verification
- **Access Control**: Granular permissions for calendar sharing

### Privacy
- **No Calendar Logs**: Calendar data not stored on servers
- **No Metadata**: Minimal metadata collection
- **Self-Hosted**: Complete data sovereignty
- **GDPR Compliant**: Full compliance with privacy regulations

## Performance

### Optimization
- **Event Caching**: Intelligent event caching
- **Sync Optimization**: Efficient calendar synchronization
- **Offline Support**: Full offline functionality
- **Battery Optimization**: Efficient power usage on mobile

### Benchmarks
- **Event Creation**: < 100ms for new events
- **Calendar Sync**: < 2s for 1000 events
- **Search Speed**: < 500ms for event search
- **Reliability**: 99.9% uptime

## Integration Features

### TauMail Integration
- **Email-to-Event**: Convert emails to calendar events
- **Event Invitations**: Send event invitations via email
- **Reminder Notifications**: Email notifications for reminders
- **Shared Calendars**: Email calendar sharing

### TauConnect Integration
- **Video Call Integration**: Direct video call from events
- **Meeting Links**: Automatic meeting link generation
- **Call Scheduling**: Schedule calls directly from calendar
- **Presence Integration**: Show availability status

### TauCloud Integration
- **File Attachments**: Attach files from TauCloud to events
- **Document Sharing**: Share documents in calendar events
- **Backup Sync**: Calendar backup to TauCloud
- **Storage Integration**: Seamless file access

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
docker-compose up -d --scale calendar=3
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

TauCalendar is licensed under the MIT License. See LICENSE file for details.

## Support

- **Documentation**: https://docs.taucalendar.org
- **Issues**: https://github.com/tauos/taucalendar/issues
- **Discussions**: https://github.com/tauos/taucalendar/discussions
- **Email**: support@taucalendar.org

---

**TauCalendar** - Secure, Private, Self-Hosted Calendar for the Modern Web 