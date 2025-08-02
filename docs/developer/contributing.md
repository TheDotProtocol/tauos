# Contributing to TauOS

## Overview

Thank you for your interest in contributing to TauOS! This guide will help you get started with development, understand our coding standards, and contribute effectively to the project.

## Getting Started

### Prerequisites

- **Operating System**: macOS, Linux, or Windows
- **Rust**: Latest stable version (1.70+)
- **Node.js**: Version 18+ for cloud services
- **Git**: Version control
- **Docker**: For containerized development (optional)

### Development Environment Setup

1. **Clone the Repository**
```bash
git clone https://github.com/TheDotProtocol/tauos.git
cd tauos
```

2. **Install Rust Dependencies**
```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install build dependencies
rustup default stable
rustup target add x86_64-unknown-linux-gnu
```

3. **Install Node.js Dependencies**
```bash
# Install Node.js dependencies for cloud services
cd local-development/taumail-local && npm install
cd ../taucloud-local && npm install
cd ../../vercel-tauos-mail && npm install
cd ../vercel-tauos-cloud && npm install
```

4. **Setup Database**
```bash
# Configure Supabase connection
# Add DATABASE_URL to your environment variables
export DATABASE_URL="postgresql://postgres:Ak1233%40%405@db.tviqcormikopltejomkc.supabase.co:5432/postgres"
```

## Project Structure

```
tauos/
├── docs/                    # Documentation
├── local-development/       # Local development servers
│   ├── taumail-local/      # TauMail local server
│   └── taucloud-local/     # TauCloud local server
├── vercel-tauos-mail/      # TauMail production code
├── vercel-tauos-cloud/     # TauCloud production code
├── scripts/                # Build and deployment scripts
├── website/                # TauOS website (Next.js)
└── tauos/                  # Main TauOS repository (submodule)
    ├── core/               # Core system components
    ├── gui/                # GTK4 applications
    ├── apps/               # Desktop applications
    └── build/              # Build outputs
```

## Development Workflow

### 1. Desktop Applications (GTK4 + Rust)

**Location**: `tauos/gui/` and `tauos/apps/`

**Build Commands**:
```bash
cd tauos
cargo build --release
cargo test
```

**Run Applications**:
```bash
# Run specific application
cargo run --bin tau-home
cargo run --bin tau-browser
cargo run --bin tau-explorer
cargo run --bin tau-media-player
cargo run --bin tau-settings
cargo run --bin tau-store
```

### 2. Cloud Services (Node.js + Express)

**Location**: `local-development/` and `vercel-tauos-*/`

**Run Local Servers**:
```bash
# TauMail local server
cd local-development/taumail-local
npm start

# TauCloud local server
cd local-development/taucloud-local
npm start
```

**Test Endpoints**:
```bash
# Health checks
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health

# Registration test
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@tauos.org","password":"testpass"}'
```

### 3. Website Development (Next.js)

**Location**: `website/`

**Run Development Server**:
```bash
cd website
npm install
npm run dev
```

**Build for Production**:
```bash
npm run build
npm start
```

## Coding Standards

### Rust (Desktop Applications)

**Code Style**:
```rust
// Use snake_case for variables and functions
let user_name = "test_user";
fn calculate_storage_usage() -> u64 {
    // Implementation
}

// Use PascalCase for types and traits
struct UserProfile {
    id: u32,
    name: String,
}

// Use SCREAMING_SNAKE_CASE for constants
const MAX_STORAGE_SIZE: u64 = 5_368_709_120;
```

**Documentation**:
```rust
/// Calculate the storage usage for a user
/// 
/// # Arguments
/// * `user_id` - The ID of the user
/// 
/// # Returns
/// The total storage usage in bytes
pub fn get_user_storage_usage(user_id: u32) -> Result<u64, StorageError> {
    // Implementation
}
```

### JavaScript/TypeScript (Cloud Services)

**Code Style**:
```javascript
// Use camelCase for variables and functions
const userName = 'testUser';
function calculateStorageUsage() {
    // Implementation
}

// Use PascalCase for classes
class UserManager {
    constructor() {
        // Constructor
    }
}

// Use UPPER_SNAKE_CASE for constants
const MAX_STORAGE_SIZE = 5368709120;
```

**Error Handling**:
```javascript
// Always handle errors properly
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Process registration
        const result = await registerUser(username, email, password);
        res.json(result);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
```

## Testing

### Rust Testing

**Unit Tests**:
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_storage_calculation() {
        let usage = calculate_storage_usage(100);
        assert_eq!(usage, 1024);
    }
}
```

**Integration Tests**:
```rust
// tests/integration_test.rs
#[test]
fn test_user_registration() {
    // Test user registration flow
}
```

### JavaScript Testing

**Unit Tests**:
```javascript
// test/auth.test.js
const { registerUser } = require('../src/auth');

describe('User Registration', () => {
    test('should register a new user', async () => {
        const result = await registerUser('testuser', 'test@tauos.org', 'password');
        expect(result.success).toBe(true);
    });
});
```

**API Tests**:
```javascript
// test/api.test.js
const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
    test('GET /api/health should return healthy status', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('healthy');
    });
});
```

## Database Development

### Schema Changes

1. **Create Migration**:
```sql
-- Create new migration file
-- migrations/001_add_user_profiles.sql

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    display_name VARCHAR(255),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **Apply Migration**:
```bash
# Run in Supabase SQL Editor
psql $DATABASE_URL -f migrations/001_add_user_profiles.sql
```

3. **Update Application Code**:
```javascript
// Update API endpoints
app.get('/api/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const profile = await getUserProfile(userId);
    res.json(profile);
});
```

## Security Guidelines

### Authentication

**Password Hashing**:
```javascript
const bcrypt = require('bcryptjs');

// Always hash passwords
const hashedPassword = await bcrypt.hash(password, 12);

// Verify passwords
const isValid = await bcrypt.compare(password, hashedPassword);
```

**JWT Tokens**:
```javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Input Validation

**Sanitize Inputs**:
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/register', [
    body('username').isLength({ min: 3 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Process registration
});
```

## Performance Guidelines

### Database Optimization

**Use Indexes**:
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_files_user_id ON files(user_id);
```

**Optimize Queries**:
```javascript
// Use parameterized queries
const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
);
```

### Caching Strategy

**Response Caching**:
```javascript
// Cache static responses
app.use('/api/files', (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=300');
    next();
});
```

## Deployment

### Local Testing

**Test All Components**:
```bash
# Test desktop applications
cd tauos && cargo test

# Test cloud services
cd local-development/taumail-local && npm test
cd ../taucloud-local && npm test

# Test website
cd website && npm test
```

### Production Deployment

**Vercel Deployment**:
```bash
# Deploy to Vercel
vercel --prod
```

**Environment Variables**:
```bash
# Set production environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

## Code Review Process

### Pull Request Guidelines

1. **Create Feature Branch**:
```bash
git checkout -b feature/new-feature
```

2. **Make Changes**:
- Follow coding standards
- Add tests for new functionality
- Update documentation

3. **Commit Changes**:
```bash
git add .
git commit -m "feat: add new feature description"
```

4. **Push and Create PR**:
```bash
git push origin feature/new-feature
# Create PR on GitHub
```

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Privacy implications reviewed

## Communication

### Issue Reporting

**Bug Reports**:
- Provide clear description of the issue
- Include steps to reproduce
- Add relevant logs and screenshots
- Specify environment details

**Feature Requests**:
- Explain the use case
- Describe expected behavior
- Consider privacy implications
- Assess technical feasibility

### Community Guidelines

- **Be Respectful**: Treat all contributors with respect
- **Be Inclusive**: Welcome contributors from all backgrounds
- **Be Helpful**: Provide constructive feedback
- **Be Patient**: Development takes time and iteration

## Resources

### Documentation
- [TauOS Workbook](./../tauos/workbook.md)
- [System Architecture](./../architecture/)
- [API Documentation](./../developer/api-docs.md)

### External Resources
- [Rust Documentation](https://doc.rust-lang.org/)
- [GTK4 Documentation](https://docs.gtk.org/gtk4/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

*Last Updated: August 2, 2025*
*Status: Active Development* 