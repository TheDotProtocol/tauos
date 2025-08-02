# TauOS Cloud Services Architecture

## Overview

TauOS cloud services consist of TauMail (email service) and TauCloud (file storage), both built with Node.js/Express backends and PostgreSQL databases. These services provide privacy-first alternatives to mainstream cloud offerings.

## Service Architecture

### Technology Stack
- **Frontend**: HTML/CSS/JavaScript with responsive design
- **Backend**: Node.js/Express with REST APIs
- **Database**: Supabase PostgreSQL with multi-tenant architecture
- **Authentication**: JWT tokens with bcryptjs hashing
- **Deployment**: Vercel with custom domains
- **Security**: HTTPS, CORS, rate limiting

## TauMail - Email Service

### Live Application
- **URL**: https://mail.tauos.org
- **Vercel URL**: https://tauos-mail-f307q44qr-the-dot-protocol-co-ltds-projects.vercel.app
- **Status**: Production Ready ✅

### Features
- **User Authentication**: Registration, login, JWT tokens
- **Email Interface**: Gmail-style UI with modern design
- **Email Management**: Compose, inbox, sent, starred, trash
- **Security**: Password hashing with bcryptjs
- **Privacy**: Zero telemetry, privacy-first design
- **Database**: PostgreSQL with Supabase integration

### API Endpoints
```javascript
// Authentication
POST /api/register    // User registration
POST /api/login       // User login
POST /api/logout      // User logout

// Email Management
GET    /api/emails    // List emails
POST   /api/emails    // Send email
PUT    /api/emails/:id // Update email
DELETE /api/emails/:id // Delete email

// Health Check
GET /api/health       // Service health status
```

### Database Schema
```sql
-- Organizations table
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    storage_limit BIGINT DEFAULT 5368709120, -- 5GB default
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emails table
CREATE TABLE emails (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject VARCHAR(500),
    content TEXT,
    sender VARCHAR(255),
    recipients TEXT[],
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Frontend Components
```html
<!-- Main Interface -->
<div class="email-interface">
    <!-- Sidebar Navigation -->
    <nav class="sidebar">
        <div class="compose-btn">Compose</div>
        <ul class="folders">
            <li>Inbox</li>
            <li>Sent</li>
            <li>Starred</li>
            <li>Trash</li>
        </ul>
    </nav>
    
    <!-- Email List -->
    <div class="email-list">
        <!-- Email items -->
    </div>
    
    <!-- Email Content -->
    <div class="email-content">
        <!-- Email viewer/composer -->
    </div>
</div>
```

## TauCloud - File Storage Service

### Live Application
- **URL**: https://cloud.tauos.org
- **Vercel URL**: https://vercel-tauos-cloud-5z2nci0ys-the-dot-protocol-co-ltds-projects.vercel.app
- **Status**: Production Ready ✅

### Features
- **User Authentication**: Registration, login, JWT tokens
- **File Management**: Upload, download, delete, preview
- **File Organization**: Folders, search, filtering
- **Security**: Password hashing with bcryptjs
- **Privacy**: Zero telemetry, privacy-first design
- **Database**: PostgreSQL with Supabase integration

### API Endpoints
```javascript
// Authentication
POST /api/register    // User registration
POST /api/login       // User login
POST /api/logout      // User logout

// File Management
GET    /api/files     // List files
POST   /api/files     // Upload file
GET    /api/files/:id // Download file
PUT    /api/files/:id // Update file
DELETE /api/files/:id // Delete file

// Storage Stats
GET /api/storage      // Storage usage
GET /api/health       // Service health status
```

### Database Schema
```sql
-- Files table
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    size BIGINT NOT NULL,
    type VARCHAR(100),
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Folders table
CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    parent_id INTEGER REFERENCES folders(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Frontend Components
```html
<!-- Main Interface -->
<div class="cloud-interface">
    <!-- Sidebar Navigation -->
    <nav class="sidebar">
        <div class="upload-btn">Upload</div>
        <ul class="folders">
            <li>Home</li>
            <li>Documents</li>
            <li>Pictures</li>
            <li>Music</li>
            <li>Videos</li>
        </ul>
    </nav>
    
    <!-- File Grid -->
    <div class="file-grid">
        <!-- File items -->
    </div>
    
    <!-- File Preview -->
    <div class="file-preview">
        <!-- File viewer -->
    </div>
</div>
```

## Multi-Tenant Architecture

### Organization Structure
```sql
-- Sample organizations
INSERT INTO organizations (name, domain, storage_limit) VALUES 
('TauOS', 'tauos.org', 5368709120),           -- 5GB (Free)
('AR Holdings Group', 'arholdings.group', 107374182400); -- 100GB (Pro)
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own data" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only access their organization's data" ON emails
    FOR ALL USING (
        user_id IN (
            SELECT id FROM users WHERE organization_id = (
                SELECT organization_id FROM users WHERE id = auth.uid()
            )
        )
    );
```

## Authentication System

### JWT Token Structure
```javascript
// Token payload
{
  "user_id": 123,
  "organization_id": 1,
  "username": "user@tauos.org",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Password Security
```javascript
// Password hashing with bcryptjs
const bcrypt = require('bcryptjs');
const saltRounds = 12;

// Hash password
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

## Storage Management

### Business Functions
```sql
-- Storage usage tracking
CREATE OR REPLACE FUNCTION update_storage_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user storage usage
    UPDATE users 
    SET storage_used = (
        SELECT COALESCE(SUM(size), 0) 
        FROM files 
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Storage limit checking
CREATE OR REPLACE FUNCTION check_storage_limit(user_id INTEGER, file_size BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    current_usage BIGINT;
    storage_limit BIGINT;
BEGIN
    SELECT storage_used INTO current_usage FROM users WHERE id = user_id;
    SELECT storage_limit INTO storage_limit FROM organizations o
    JOIN users u ON u.organization_id = o.id WHERE u.id = user_id;
    
    RETURN (current_usage + file_size) <= storage_limit;
END;
$$ LANGUAGE plpgsql;
```

## Security Features

### HTTPS Configuration
```javascript
// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
```

### Rate Limiting
```javascript
// API rate limiting
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);
```

### CORS Configuration
```javascript
// CORS settings
app.use(cors({
    origin: ['https://mail.tauos.org', 'https://cloud.tauos.org'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Performance Optimization

### Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_files_path ON files(path);
```

### Caching Strategy
```javascript
// Response caching
app.use('/api/files', (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    next();
});
```

## Monitoring & Health Checks

### Health Endpoint
```javascript
// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});
```

## Deployment Configuration

### Vercel Configuration
```json
// vercel.json
{
    "version": 2,
    "builds": [
        {
            "src": "app.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/api/(.*)",
            "dest": "/app.js"
        }
    ]
}
```

### Environment Variables
```bash
# Production environment
DATABASE_URL=postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres
NODE_ENV=production
JWT_SECRET=tauos-secret-key-change-in-production
```

## Production Status

### ✅ Operational Services
- **TauMail**: https://mail.tauos.org ✅
- **TauCloud**: https://cloud.tauos.org ✅
- **Database**: Supabase PostgreSQL connected ✅
- **Authentication**: JWT tokens working ✅
- **Health Monitoring**: All endpoints operational ✅

### Test Results
```json
// TauMail Health Check
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-08-02T17:10:24.816Z"
}

// TauCloud Health Check
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-08-02T17:10:32.906Z"
}
```

---

*Last Updated: August 2, 2025*
*Status: Production Ready* 