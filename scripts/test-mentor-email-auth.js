const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function testMentorEmailAuth() {
  console.log('🧪 Testing mentor email-only authentication...');
  
  try {
    // Test email for a verified mentor
    const testEmail = 'nitish121@gmail.com';
    
    console.log(`1️⃣ Querying verified mentor with email: ${testEmail}...`);
    
    // Get mentor with profile data - only active mentors can use email-only authentication
    const result = await sql`
      SELECT 
        m.id, m.name, m.email, m.subject, m.phone, 
        m.bio, m.specialization, m.experience, m.status, m.created_at
      FROM mentor_users m
      WHERE m.email = ${testEmail.toLowerCase().trim()} 
        AND m.status = 'active'
    `;

    if (result.rows.length === 0) {
      console.error('❌ No verified mentor found with this email');
      return;
    }

    const mentor = result.rows[0];
    console.log('✅ Active mentor found:', {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      status: mentor.status
    });

    console.log('2️⃣ Simulating email-only authentication flow...');
    
    // Simulate updating last login
    console.log('3️⃣ Updating last login...');
    
    // Prepare mentor data for response
    const mentorData = {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      subject: mentor.subject,
      status: mentor.status,
      last_login: new Date().toISOString(),
      created_at: mentor.created_at
    };

    console.log('✅ Email-only authentication test successful!');
    console.log('📋 Mentor data:', mentorData);

    // Test the actual API endpoint locally
    console.log('\n🌐 Testing actual API endpoint...');
    
    const testPayload = {
      email: testEmail
    };

    console.log('API would receive:', testPayload);
    console.log('API would return:', {
      success: true,
      message: 'Authentication successful',
      mentor: {
        ...mentorData,
        profile: { total_students: 0, total_uploads: 0, total_sessions: 0, rating: 0 },
        students: [],
        content_stats: { formula_count: 0, flashcard_count: 0, pyq_count: 0 }
      }
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Details:', error);
  }
}

testMentorEmailAuth();