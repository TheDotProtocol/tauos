# TauStore Backend REST API

TauStore is the official app store backend for Tau OS, providing a secure and modern REST API for app discovery, reviews, and package management.

## Base URL
```
http://localhost:8000/
```

## Endpoints

### POST /register
- Register a new user
- **Request:**
```json
{
  "username": "alice",
  "password": "secret123"
}
```
- **Response:**
```json
{
  "id": 1,
  "username": "alice",
  "password_hash": "$2b$..."
}
```

### POST /auth
- User authentication (returns JWT)
- **Request:**
```json
{
  "username": "alice",
  "password": "secret123"
}
```
- **Response:**
```json
{
  "token": "<jwt-token>"
}
```

### GET /apps
- List all available apps
- **Response:**
```json
[
  {
    "id": 1,
    "name": "Tau Editor",
    "version": "1.0.0",
    "description": "A lightweight text editor for Tau OS.",
    "icon": null
  }
]
```

### GET /apps/{id}
- Get details for a specific app
- **Response:**
```json
{
  "id": 1,
  "name": "Tau Editor",
  "version": "1.0.0",
  "description": "A lightweight text editor for Tau OS.",
  "icon": null
}
```

### GET /apps/{id}/reviews
- Get reviews for an app
- **Response:**
```json
[
  {
    "id": 1,
    "app_id": 1,
    "user_id": 1,
    "rating": 5,
    "comment": "Great app!"
  }
]
```

### POST /upload
- Developer app upload (authenticated)
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Request:**
```json
{
  "app": { ...app fields... }
}
```
- **Response:**
```json
"App uploaded"
```

### POST /apps/{id}/reviews
- Post a new review (authenticated)
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Request:**
```json
{
  "id": 1,
  "app_id": 1,
  "user_id": 1,
  "rating": 5,
  "comment": "Great app!"
}
```
- **Response:**
```json
"Review posted"
```

## Authentication
- Register with `/register` and login with `/auth` to receive a JWT token.
- Use the JWT token in the `Authorization: Bearer <token>` header for protected endpoints.
- JWT tokens are signed and expire after 24 hours.

## Error Handling
- All errors return JSON with HTTP status codes and a message.
- Input is validated for all endpoints.

## Storage
- Uses SQLite for persistent storage of users, apps, and reviews.
- Passwords are hashed with bcrypt.

## Build & Run
```
cd taustore/backend
cargo build --release
./target/release/taustore-backend
```

---

**TauStore: Secure, Modern, and Open.** 