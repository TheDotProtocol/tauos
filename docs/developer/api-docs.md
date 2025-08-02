# TauOS API Documentation

## Overview

TauOS provides comprehensive REST APIs for TauMail and TauCloud services. All APIs are built with Node.js/Express, use JWT authentication, and connect to Supabase PostgreSQL database.

## Base URLs

### Production
- **TauMail API**: https://mail.tauos.org/api
- **TauCloud API**: https://cloud.tauos.org/api

### Development
- **TauMail API**: http://localhost:3001/api
- **TauCloud API**: http://localhost:3002/api

## Authentication

### JWT Token Structure
```json
{
  "user_id": 123,
  "organization_id": 1,
  "username": "user@tauos.org",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Authentication Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## TauMail API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "newuser123",
  "email": "user@tauos.org",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 123,
    "username": "newuser123",
    "email": "user@tauos.org",
    "created_at": "2025-08-02T17:10:24.816Z"
  }
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "username": "newuser123",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "username": "newuser123",
    "email": "user@tauos.org"
  }
}
```

#### Logout User
```http
POST /api/logout
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Email Management Endpoints

#### List Emails
```http
GET /api/emails
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `folder`: inbox, sent, starred, trash (default: inbox)
- `page`: page number (default: 1)
- `limit`: items per page (default: 20)

**Response**:
```json
{
  "success": true,
  "emails": [
    {
      "id": 1,
      "subject": "Welcome to TauMail",
      "sender": "noreply@tauos.org",
      "recipients": ["user@tauos.org"],
      "content": "Welcome to your new email account...",
      "status": "read",
      "created_at": "2025-08-02T17:10:24.816Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

#### Get Email
```http
GET /api/emails/:id
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "email": {
    "id": 1,
    "subject": "Welcome to TauMail",
    "sender": "noreply@tauos.org",
    "recipients": ["user@tauos.org"],
    "content": "Welcome to your new email account...",
    "status": "read",
    "created_at": "2025-08-02T17:10:24.816Z",
    "updated_at": "2025-08-02T17:10:24.816Z"
  }
}
```

#### Send Email
```http
POST /api/emails
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "subject": "Test Email",
  "recipients": ["recipient@example.com"],
  "content": "This is a test email from TauMail."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "email": {
    "id": 2,
    "subject": "Test Email",
    "sender": "user@tauos.org",
    "recipients": ["recipient@example.com"],
    "content": "This is a test email from TauMail.",
    "status": "sent",
    "created_at": "2025-08-02T17:10:24.816Z"
  }
}
```

#### Update Email
```http
PUT /api/emails/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "starred"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email updated successfully",
  "email": {
    "id": 1,
    "status": "starred",
    "updated_at": "2025-08-02T17:10:24.816Z"
  }
}
```

#### Delete Email
```http
DELETE /api/emails/:id
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Email deleted successfully"
}
```

### Health Check
```http
GET /api/health
```

**Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-08-02T17:10:24.816Z"
}
```

## TauCloud API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "clouduser123",
  "email": "user@tauos.org",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 124,
    "username": "clouduser123",
    "email": "user@tauos.org",
    "created_at": "2025-08-02T17:10:32.906Z"
  }
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "username": "clouduser123",
  "password": "securepassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 124,
    "username": "clouduser123",
    "email": "user@tauos.org"
  }
}
```

### File Management Endpoints

#### List Files
```http
GET /api/files
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `folder`: folder path (default: root)
- `type`: file type filter (images, documents, videos, audio)
- `page`: page number (default: 1)
- `limit`: items per page (default: 20)

**Response**:
```json
{
  "success": true,
  "files": [
    {
      "id": 1,
      "name": "document.pdf",
      "path": "/documents/document.pdf",
      "size": 1024000,
      "type": "document",
      "mime_type": "application/pdf",
      "created_at": "2025-08-02T17:10:32.906Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

#### Upload File
```http
POST /api/files
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: <file_data>
folder: /documents
```

**Response**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "id": 2,
    "name": "uploaded-file.pdf",
    "path": "/documents/uploaded-file.pdf",
    "size": 2048000,
    "type": "document",
    "mime_type": "application/pdf",
    "created_at": "2025-08-02T17:10:32.906Z"
  }
}
```

#### Download File
```http
GET /api/files/:id/download
Authorization: Bearer <jwt_token>
```

**Response**: File binary data with appropriate headers

#### Get File Info
```http
GET /api/files/:id
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "file": {
    "id": 1,
    "name": "document.pdf",
    "path": "/documents/document.pdf",
    "size": 1024000,
    "type": "document",
    "mime_type": "application/pdf",
    "created_at": "2025-08-02T17:10:32.906Z",
    "updated_at": "2025-08-02T17:10:32.906Z"
  }
}
```

#### Update File
```http
PUT /api/files/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "renamed-file.pdf"
}
```

**Response**:
```json
{
  "success": true,
  "message": "File updated successfully",
  "file": {
    "id": 1,
    "name": "renamed-file.pdf",
    "updated_at": "2025-08-02T17:10:32.906Z"
  }
}
```

#### Delete File
```http
DELETE /api/files/:id
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### Folder Management Endpoints

#### List Folders
```http
GET /api/folders
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "folders": [
    {
      "id": 1,
      "name": "Documents",
      "path": "/documents",
      "parent_id": null,
      "created_at": "2025-08-02T17:10:32.906Z"
    }
  ]
}
```

#### Create Folder
```http
POST /api/folders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "New Folder",
  "path": "/documents/new-folder"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Folder created successfully",
  "folder": {
    "id": 2,
    "name": "New Folder",
    "path": "/documents/new-folder",
    "parent_id": 1,
    "created_at": "2025-08-02T17:10:32.906Z"
  }
}
```

### Storage Management Endpoints

#### Get Storage Stats
```http
GET /api/storage
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "storage": {
    "used": 3072000,
    "limit": 5368709120,
    "percentage": 0.06,
    "files_count": 3,
    "folders_count": 2
  }
}
```

### Health Check
```http
GET /api/health
```

**Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-08-02T17:10:32.906Z"
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired JWT token
- `INVALID_CREDENTIALS`: Invalid username or password
- `USER_EXISTS`: User already exists
- `FILE_TOO_LARGE`: File exceeds size limit
- `STORAGE_LIMIT`: Storage limit exceeded
- `FILE_NOT_FOUND`: File not found
- `PERMISSION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid input data
- `DATABASE_ERROR`: Database connection error

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `413`: Payload Too Large
- `500`: Internal Server Error

## Rate Limiting

### API Limits
- **Authentication**: 5 requests per minute
- **File Upload**: 10 requests per minute
- **General API**: 100 requests per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Security Features

### Input Validation
```javascript
// Example validation for user registration
const validationRules = {
    username: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9_]+$/
    },
    email: {
        required: true,
        format: 'email'
    },
    password: {
        required: true,
        minLength: 8,
        maxLength: 128
    }
};
```

### CORS Configuration
```javascript
// CORS settings for production
const corsOptions = {
    origin: ['https://mail.tauos.org', 'https://cloud.tauos.org'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
```

### Security Headers
```javascript
// Security headers configuration
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

## Testing

### API Testing Examples

#### Test User Registration
```bash
curl -X POST https://mail.tauos.org/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@tauos.org",
    "password": "testpass123"
  }'
```

#### Test Health Check
```bash
curl https://mail.tauos.org/api/health
```

#### Test File Upload
```bash
curl -X POST https://cloud.tauos.org/api/files \
  -H "Authorization: Bearer <jwt_token>" \
  -F "file=@/path/to/file.pdf" \
  -F "folder=/documents"
```

## SDK Examples

### JavaScript/Node.js
```javascript
class TauOSClient {
    constructor(baseUrl, token = null) {
        this.baseUrl = baseUrl;
        this.token = token;
    }
    
    async register(username, email, password) {
        const response = await fetch(`${this.baseUrl}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        return response.json();
    }
    
    async login(username, password) {
        const response = await fetch(`${this.baseUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (data.success) {
            this.token = data.token;
        }
        return data;
    }
    
    async uploadFile(file, folder = '/') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        
        const response = await fetch(`${this.baseUrl}/api/files`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${this.token}` },
            body: formData
        });
        return response.json();
    }
}
```

### Python
```python
import requests
import json

class TauOSClient:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.token = token
    
    def register(self, username, email, password):
        data = {
            'username': username,
            'email': email,
            'password': password
        }
        response = requests.post(f'{self.base_url}/api/register', json=data)
        return response.json()
    
    def login(self, username, password):
        data = {
            'username': username,
            'password': password
        }
        response = requests.post(f'{self.base_url}/api/login', json=data)
        result = response.json()
        if result['success']:
            self.token = result['token']
        return result
    
    def upload_file(self, file_path, folder='/'):
        headers = {'Authorization': f'Bearer {self.token}'}
        files = {'file': open(file_path, 'rb')}
        data = {'folder': folder}
        
        response = requests.post(
            f'{self.base_url}/api/files',
            headers=headers,
            files=files,
            data=data
        )
        return response.json()
```

---

*Last Updated: August 2, 2025*
*Status: Production Ready* 