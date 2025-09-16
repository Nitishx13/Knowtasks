// Script to initialize users table for Clerk authentication
// Run with: node scripts/init-users-table.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

async function initUsersTable() {
  try {
    console.log('Initializing users table for Clerk authentication...');

    // Check if users table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `;

    if (tableExists.rows[0].exists) {
      console.log('Table users already exists. Checking structure...');
      
      // Get current columns
      const currentColumns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        ORDER BY ordinal_position
      `;
      
      const columnNames = currentColumns.rows.map(col => col.column_name);
      console.log('Current columns:', columnNames);
      
      // Add missing columns if they don't exist
      if (!columnNames.includes('clerk_id')) {
        console.log('Adding clerk_id column...');
        await sql`ALTER TABLE users ADD COLUMN clerk_id VARCHAR(255)`;
      }
      
      if (!columnNames.includes('created_at')) {
        console.log('Adding created_at column...');
        await sql`ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
      }
      
      if (!columnNames.includes('updated_at')) {
        console.log('Adding updated_at column...');
        await sql`ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
      }
      
    } else {
      console.log('Creating users table...');
      
      // Create users table
      await sql`
        CREATE TABLE users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          clerk_id VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
    }

    // Create indexes for better performance (ignore if they already exist)
    try {
      await sql`CREATE INDEX idx_users_email ON users(email)`;
      console.log('Created email index');
    } catch (e) {
      console.log('email index already exists');
    }
    
    try {
      await sql`CREATE INDEX idx_users_clerk_id ON users(clerk_id)`;
      console.log('Created clerk_id index');
    } catch (e) {
      console.log('clerk_id index already exists');
    }

    // Create a trigger to automatically update the updated_at column
    try {
      await sql`DROP TRIGGER IF EXISTS update_users_updated_at ON users`;
      await sql`
        CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `;
      console.log('Created updated_at trigger for users table');
    } catch (e) {
      console.log('Trigger already exists or error:', e.message);
    }

    console.log('Users table initialized successfully!');
    
    // Test the connection and table
    const result = await sql`SELECT COUNT(*) FROM users`;
    console.log(`Current user count: ${result.rows[0].count}`);

  } catch (error) {
    console.error('Error initializing users table:', error);
    process.exit(1);
  }
}

// Run the initialization
initUsersTable();