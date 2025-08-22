# Notel API Documentation

## Overview

This document provides detailed information about the Notel API endpoints, request/response formats, and authentication mechanisms.

## Base URL

All API endpoints are relative to the base URL of your deployed application:

```
https://your-app-name.vercel.app/api
```

For local development:

```
http://localhost:5173/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Register a new user

```
POST /auth/register
```

Request body:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

#### Login with email and password

```
POST /auth/login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

#### Login with Google

```
POST /auth/google
```

Request body:

```json
{
  "token": "google_id_token"
}
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

## Summarization

### Summarize Text

```
POST /summarize/text
```

Request body:

```json
{
  "text": "Long text to summarize..."
}
```

Response:

```json
{
  "success": true,
  "summary": {
    "text": "Summarized text...",
    "keyPoints": ["Point 1", "Point 2", "Point 3"]
  }
}
```

### Summarize Video

```
POST /summarize/video
```

Request body:

```json
{
  "url": "https://www.youtube.com/watch?v=video_id"
}
```

Response:

```json
{
  "success": true,
  "summary": {
    "text": "Video summary...",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "videoId": "video_id",
    "title": "Video Title"
  }
}
```

### Summarize Document

```
POST /summarize/document
```

Request body (multipart/form-data):

```
file: [Binary file data]
```

Response:

```json
{
  "success": true,
  "summary": {
    "text": "Document summary...",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "fileName": "document.pdf",
    "fileType": "application/pdf"
  }
}
```

## Notes

### Get All Notes

```
GET /notes
```

Response:

```json
{
  "success": true,
  "notes": [
    {
      "id": 1,
      "title": "Note Title",
      "content": "Note content...",
      "date": "2023-08-21"
    },
    {
      "id": 2,
      "title": "Another Note",
      "content": "More content...",
      "date": "2023-08-20"
    }
  ]
}
```

### Create a New Note

```
POST /notes
```

Request body:

```json
{
  "title": "New Note",
  "content": "Note content..."
}
```

Response:

```json
{
  "success": true,
  "note": {
    "id": 3,
    "title": "New Note",
    "content": "Note content...",
    "date": "2023-08-22"
  }
}
```

### Get a Specific Note

```
GET /notes/:id
```

Response:

```json
{
  "success": true,
  "note": {
    "id": 1,
    "title": "Note Title",
    "content": "Note content...",
    "date": "2023-08-21"
  }
}
```

### Update a Note

```
PUT /notes/:id
```

Request body:

```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

Response:

```json
{
  "success": true,
  "note": {
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content...",
    "date": "2023-08-21"
  }
}
```

### Delete a Note

```
DELETE /notes/:id
```

Response:

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages in case of failure:

```json
{
  "error": "Error message"
}
```

Common status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per minute per IP address. Exceeding this limit will result in a 429 (Too Many Requests) response.

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all origins in development. In production, CORS is restricted to the application's domain.