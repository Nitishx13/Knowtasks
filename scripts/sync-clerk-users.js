// Script to sync Clerk user data with Neon database
// Run with: node scripts/sync-clerk-users.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

// Mock Clerk users for development/testing
const MOCK_CLERK_USERS = [
  {
    id: 'user_2NNEqL2nrIRdJ194ndJqAFwEfxC',
    firstName: 'Test',
    lastName: 'User',
    emailAddresses: [{ emailAddress: 'test@example.com' }]
  },
  {
    id: 'user_2NNFpL3nrJSdK195ndKrBGxFgyD',
    firstName: 'Demo',
    lastName: 'Account',
    emailAddresses: [{ emailAddress: 'demo@example.com' }]
  }
];

async function syncClerkUsers() {
  try {
    console.log('Syncing Clerk users with Neon database...');

    // Use mock data instead of actual Clerk API
    console.log('Using mock Clerk users for development/testing');
    const clerkUsers = MOCK_CLERK_USERS;
    console.log(`Found ${clerkUsers.length} mock users`);

    // Process each Clerk user
    for (const clerkUser of clerkUsers) {
      const userId = clerkUser.id;
      const email = clerkUser.emailAddresses[0]?.emailAddress || 'unknown@example.com';
      const firstName = clerkUser.firstName || '';
      const lastName = clerkUser.lastName || '';
      const name = `${firstName} ${lastName}`.trim() || 'Unknown User';

      console.log(`Processing user: ${name} (${email})`);

      // Check if user already exists in database
      const existingUser = await sql`
        SELECT * FROM users WHERE id = ${userId} OR email = ${email}
      `;

      if (existingUser.rows.length > 0) {
        // Update existing user
        console.log(`Updating existing user: ${existingUser.rows[0].id}`);
        await sql`
          UPDATE users 
          SET 
            name = ${name},
            email = ${email},
            clerk_id = ${userId},
            updated_at = NOW()
          WHERE id = ${existingUser.rows[0].id}
        `;
      } else {
        // Create new user
        console.log(`Creating new user: ${userId}`);
        await sql`
          INSERT INTO users (id, name, email, clerk_id, created_at, updated_at)
          VALUES (${userId}, ${name}, ${email}, ${userId}, NOW(), NOW())
        `;
      }
    }

    // Verify sync results
    const dbUsers = await sql`SELECT COUNT(*) FROM users`;
    console.log(`Total users in database after sync: ${dbUsers.rows[0].count}`);

    console.log('Clerk user sync completed successfully!');
  } catch (error) {
    console.error('Error syncing Clerk users:', error);
    process.exit(1);
  }
}

// Run the sync
syncClerkUsers();