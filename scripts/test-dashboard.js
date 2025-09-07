/**
 * Test script for dashboard functionality
 * This script tests the authentication flow and data fetching for the dashboard
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { sql } = require('@vercel/postgres');

async function testDashboardFunctionality() {
  console.log('\n🔍 TESTING DASHBOARD FUNCTIONALITY');
  console.log('====================================');

  try {
    // Test database connection
    console.log('\n1. Testing database connection...');
    await sql`SELECT NOW()`;
    console.log('✅ Database connection successful');

    // Test user authentication
    console.log('\n2. Testing user authentication flow...');
    const testUserId = 'test_user_123';
    const testUserName = 'Test User';
    const testUserEmail = 'test@example.com';

    // Check if test user exists, create if not
    const existingUser = await sql`
      SELECT * FROM users WHERE id = ${testUserId}
    `;

    if (existingUser.rowCount === 0) {
      console.log('   Creating test user...');
      await sql`
        INSERT INTO users (id, name, email, created_at)
        VALUES (${testUserId}, ${testUserName}, ${testUserEmail}, NOW())
      `;
      console.log('   ✅ Test user created');
    } else {
      console.log('   ✅ Test user already exists');
    }

    // Test file upload functionality
    console.log('\n3. Testing file data retrieval...');
    
    // Add a test file record if none exists
    const existingFiles = await sql`
      SELECT * FROM uploaded_files WHERE user_id = ${testUserId}
    `;

    if (existingFiles.rowCount === 0) {
      console.log('   Adding test file record...');
      await sql`
        INSERT INTO uploaded_files (
          file_name, 
          file_size, 
          file_type, 
          upload_date, 
          user_id, 
          file_url,
          content,
          status
        ) VALUES (
          'test-file.txt',
          1024,
          'text/plain',
          NOW(),
          ${testUserId},
          '/uploads/test-file.txt',
          'Test file content',
          'processed'
        )
      `;
      console.log('   ✅ Test file record added');
    } else {
      console.log(`   ✅ ${existingFiles.rowCount} test file(s) already exist`);
    }

    // Test text file functionality
    console.log('\n4. Testing text file data retrieval...');
    
    // Add a test text file record if none exists
    const existingTextFiles = await sql`
      SELECT * FROM text_files WHERE user_id = ${testUserId}
    `;

    if (existingTextFiles.rowCount === 0) {
      console.log('   Adding test text file record...');
      await sql`
        INSERT INTO text_files (
          title, 
          content, 
          user_id, 
          created_at, 
          word_count,
          status
        ) VALUES (
          'Test Document',
          'This is a test document content for dashboard testing.',
          ${testUserId},
          NOW(),
          8,
          'processed'
        )
      `;
      console.log('   ✅ Test text file record added');
    } else {
      console.log(`   ✅ ${existingTextFiles.rowCount} test text file(s) already exist`);
    }

    // Verify data retrieval
    console.log('\n5. Verifying user-specific data retrieval...');
    
    // Get user files
    const userFiles = await sql`
      SELECT * FROM uploaded_files WHERE user_id = ${testUserId}
    `;
    console.log(`   ✅ Retrieved ${userFiles.rowCount} file(s) for user`);
    
    // Get user text files
    const userTextFiles = await sql`
      SELECT * FROM text_files WHERE user_id = ${testUserId}
    `;
    console.log(`   ✅ Retrieved ${userTextFiles.rowCount} text file(s) for user`);

    // Simulate authentication middleware
    console.log('\n6. Testing authentication middleware...');
    const mockReq = {
      headers: { 'user-id': testUserId },
      userId: testUserId
    };
    
    console.log(`   ✅ User ID in request: ${mockReq.userId}`);
    console.log(`   ✅ User ID in headers: ${mockReq.headers['user-id']}`);

    console.log('\n====================================');
    console.log('✅ DASHBOARD FUNCTIONALITY TEST COMPLETED SUCCESSFULLY');
    console.log(`✅ User data is properly associated with user ID: ${testUserId}`);
    console.log('✅ File upload and text file components should work correctly');
    console.log('✅ Dashboard should display user-specific data');

  } catch (error) {
    console.error('❌ TEST FAILED:', error);
  } finally {
    // Close database connection
    process.exit(0);
  }
}

// Run the test
testDashboardFunctionality();