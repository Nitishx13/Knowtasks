# Authentication API Documentation

## Overview

This document provides detailed information about the authentication API endpoints, request/response formats, and authentication mechanisms.

## Base URL

All API endpoints are relative to the base URL of your deployed application:

```
https://your-app-name.vercel.app/api
```

For local development:

```
http://localhost:3000/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your_jwt_token>
```

Alternatively, the token is also stored in an HTTP-only cookie named `auth-token` which is automatically included in requests to the same domain.

## Endpoints

### Register a new user

```
POST /auth/register
```

**Request body:**

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt_token"
}
```

**Error Responses:**

- 400 Bad Request: Missing required fields or validation failed
- 409 Conflict: User with this email already exists
- 500 Server Error: Internal server error

### Login with email and password

```
POST /auth/login
```

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt_token"
}
```

**Error Responses:**

- 400 Bad Request: Missing required fields
- 401 Unauthorized: Invalid email or password
- 500 Server Error: Internal server error

### Get current user profile

```
GET /auth/me
```

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

- 401 Unauthorized: No authentication token provided or invalid token
- 500 Server Error: Internal server error

## Authentication Flow

1. **Registration**: User registers with name, email, and password
2. **Login**: User logs in with email and password
3. **Authentication**: For protected endpoints, include the JWT token in the Authorization header or rely on the HTTP-only cookie

## Security Considerations

- Passwords are hashed before storage
- JWT tokens expire after 24 hours
- Sensitive operations require re-authentication
- HTTP-only cookies are used to prevent XSS attacks