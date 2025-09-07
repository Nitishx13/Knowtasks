# Clerk Authentication Integration with Neon Database

## Overview

This document explains how Clerk authentication is integrated with the Neon PostgreSQL database in the Knowtasks application.

## Architecture

1. **Authentication Flow**:
   - Clerk handles user authentication (login, signup, session management)
   - The application middleware extracts the Clerk user ID
   - User data is synced with the Neon database for application-specific data storage

2. **Database Schema**:
   - The `users` table stores user information with the following columns:
     - `id`: Primary key (matches Clerk user ID)
     - `name`: User's full name
     - `email`: User's email address
     - `clerk_id`: Clerk user ID (redundant with id for flexibility)
     - `created_at`: Timestamp when the user was created
     - `updated_at`: Timestamp when the user was last updated

## Implementation Details

### Authentication Middleware

The `authMiddleware.js` file handles authentication for API routes:

1. Extracts the Clerk user ID from the request
2. Syncs user data with the Neon database
3. Adds the user ID to the request object for downstream handlers
4. Provides a fallback mechanism for development/testing

### Database Synchronization

User data is synchronized with the database in two ways:

1. **Real-time Sync**: When a user makes an authenticated request, the middleware checks if the user exists in the database and creates a record if needed.

2. **Batch Sync**: The `sync-clerk-users.js` script can be run to synchronize all Clerk users with the database.

### Scripts

The following scripts are available for managing user data:

- `npm run init-users`: Initializes the users table structure
- `npm run sync-clerk`: Synchronizes Clerk users with the database
- `npm run check-user-id`: Checks user IDs in the database

## Development and Testing

For development and testing without a Clerk API key:

1. The middleware includes a fallback mechanism that accepts a `user-id` header
2. The sync script includes mock user data for testing

## Troubleshooting

If you encounter authentication issues:

1. Check that the Clerk API key is properly set in `.env.local`
2. Verify that the users table is properly initialized
3. Check the server logs for authentication errors
4. Run `npm run check-user-id` to verify user data in the database