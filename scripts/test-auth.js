// Script to test Clerk authentication integration
// Run with: node scripts/test-auth.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

async function testAuth() {
  try {
    console.log('Testing Clerk authentication integration with Neon database...');

    // 1. Check if users table exists and has the correct structure
    console.log('\nChecking users table structure:');
    const tableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;

    if (tableInfo.rows.length === 0) {
      console.error('Error: Users table not found!');
      process.exit(1);
    }

    console.log('Users table structure:');
    tableInfo.rows.forEach(column => {
      console.log(`  - ${column.column_name}: ${column.data_type}`);
    });

    // 2. Check if users exist in the database
    console.log('\nChecking for users in the database:');
    const users = await sql`SELECT * FROM users`;
    
    if (users.rows.length === 0) {
      console.log('  No users found in the database.');
      console.log('  Run npm run sync-clerk to add test users.');
    } else {
      console.log(`  Found ${users.rows.length} users:`);
      users.rows.forEach(user => {
        console.log(`  - ID: ${user.id}`);
        console.log(`    Name: ${user.name}`);
        console.log(`    Email: ${user.email}`);
        console.log(`    Clerk ID: ${user.clerk_id || 'Not set'}`);
        console.log('');
      });
    }

    // 3. Test authentication middleware simulation
    console.log('\nSimulating authentication middleware:');
    const testUserId = users.rows.length > 0 ? users.rows[0].id : 'user_2NNEqL2nrIRdJ194ndJqAFwEfxC';
    
    console.log(`  Using test user ID: ${testUserId}`);
    console.log('  In a real request, the middleware would:');
    console.log('  1. Extract this ID from Clerk authentication');
    console.log('  2. Check if the user exists in the database');
    console.log('  3. Create the user if they don\'t exist');
    console.log('  4. Add the user ID to the request object');

    // 4. Check if indexes exist on the users table
    console.log('\nChecking indexes on users table:');
    const indexes = await sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'users';
    `;

    if (indexes.rows.length === 0) {
      console.log('  No indexes found on users table.');
    } else {
      console.log(`  Found ${indexes.rows.length} indexes:`);
      indexes.rows.forEach(index => {
        console.log(`  - ${index.indexname}: ${index.indexdef}`);
      });
    }

    console.log('\nAuth integration test completed successfully!');
  } catch (error) {
    console.error('Error testing auth integration:', error);
    process.exit(1);
  }
}

// Run the test
testAuth();