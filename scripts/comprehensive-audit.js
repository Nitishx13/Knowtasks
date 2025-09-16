require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function comprehensiveAudit() {
  console.log('🔍 COMPREHENSIVE MENTOR SYSTEM AUDIT\n');
  
  try {
    // 1. DATABASE TABLES AUDIT
    console.log('=== 1. DATABASE TABLES AUDIT ===');
    
    // Check if mentor_users table exists
    const mentorUsersTable = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'mentor_users'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📊 mentor_users table schema:');
    if (mentorUsersTable.rows.length === 0) {
      console.log('❌ mentor_users table does NOT exist');
    } else {
      mentorUsersTable.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'}`);
      });
    }
    
    // Check if mentor_uploads table exists
    const mentorUploadsTable = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'mentor_uploads'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📊 mentor_uploads table schema:');
    if (mentorUploadsTable.rows.length === 0) {
      console.log('❌ mentor_uploads table does NOT exist');
    } else {
      mentorUploadsTable.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'}`);
      });
    }
    
    // 2. DATA AUDIT
    console.log('\n=== 2. DATA AUDIT ===');
    
    // Check mentor_users data
    const mentorUsers = await sql`SELECT * FROM mentor_users ORDER BY created_at DESC LIMIT 5`;
    console.log(`\n👥 mentor_users records (${mentorUsers.rows.length} shown):`);
    mentorUsers.rows.forEach(user => {
      console.log(`  - ID: ${user.id}, user_id: ${user.user_id}, name: ${user.name}, email: ${user.email}`);
    });
    
    // Check mentor_uploads data
    try {
      const mentorUploads = await sql`SELECT * FROM mentor_uploads ORDER BY created_at DESC LIMIT 5`;
      console.log(`\n📁 mentor_uploads records (${mentorUploads.rows.length} shown):`);
      mentorUploads.rows.forEach(upload => {
        console.log(`  - ID: ${upload.id}, user_id: ${upload.user_id}, title: ${upload.title}, type: ${upload.type}`);
      });
    } catch (error) {
      console.log('\n📁 mentor_uploads: ❌ Table does not exist or error:', error.message);
    }
    
    // 3. API ENDPOINTS TEST
    console.log('\n=== 3. API ENDPOINTS TEST ===');
    
    // Test mentor profile API
    console.log('\n🔗 Testing /api/mentor/profile with test_user_123:');
    try {
      const profileResponse = await fetch('http://localhost:3000/api/mentor/profile', {
        method: 'GET',
        headers: {
          'user-id': 'test_user_123',
          'Content-Type': 'application/json'
        }
      });
      
      const profileData = await profileResponse.json();
      console.log(`  Status: ${profileResponse.status}`);
      console.log(`  Response:`, JSON.stringify(profileData, null, 2));
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    // Test mentor content fetch API
    console.log('\n🔗 Testing /api/uploads/get-mentor-content?type=notes:');
    try {
      const contentResponse = await fetch('http://localhost:3000/api/uploads/get-mentor-content?type=notes', {
        method: 'GET',
        headers: {
          'user-id': 'test_user_123',
          'Content-Type': 'application/json'
        }
      });
      
      const contentData = await contentResponse.json();
      console.log(`  Status: ${contentResponse.status}`);
      console.log(`  Response:`, JSON.stringify(contentData, null, 2));
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    // Test user mentor content API (public)
    console.log('\n🔗 Testing /api/user/mentor-content (public):');
    try {
      const userContentResponse = await fetch('http://localhost:3000/api/user/mentor-content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const userContentData = await userContentResponse.json();
      console.log(`  Status: ${userContentResponse.status}`);
      console.log(`  Response:`, JSON.stringify(userContentData, null, 2));
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    // 4. AUTHENTICATION FLOW TEST
    console.log('\n=== 4. AUTHENTICATION FLOW TEST ===');
    
    // Test different user IDs
    const testUserIds = ['test_user_123', 'mentor_test_123', 'nonexistent_user'];
    
    for (const userId of testUserIds) {
      console.log(`\n🔐 Testing authentication with user_id: ${userId}`);
      try {
        const authResponse = await fetch('http://localhost:3000/api/mentor/profile', {
          method: 'GET',
          headers: {
            'user-id': userId,
            'Content-Type': 'application/json'
          }
        });
        
        const authData = await authResponse.json();
        console.log(`  Status: ${authResponse.status} - ${authData.success ? '✅ Success' : '❌ Failed'}`);
        if (authData.error) {
          console.log(`  Error: ${authData.error}`);
        }
      } catch (error) {
        console.log(`  ❌ Network Error: ${error.message}`);
      }
    }
    
    // 5. RECOMMENDATIONS
    console.log('\n=== 5. RECOMMENDATIONS ===');
    
    console.log('\n📋 Based on audit results:');
    
    if (mentorUploadsTable.rows.length === 0) {
      console.log('❗ CRITICAL: mentor_uploads table missing - need to create it');
    }
    
    if (mentorUsers.rows.length === 0) {
      console.log('❗ WARNING: No mentor users found - need test data');
    }
    
    console.log('\n🔧 Suggested fixes:');
    console.log('1. Ensure mentor_uploads table exists with proper schema');
    console.log('2. Verify authentication middleware is working');
    console.log('3. Test file upload functionality separately');
    console.log('4. Check server is running on localhost:3000');
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
  }
}

comprehensiveAudit();
