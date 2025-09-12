const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function testNewMentorLogin() {
  try {
    console.log('🔍 Testing new mentor login system...');

    // Test 1: Verify mentor exists in database
    console.log('\n1️⃣ Checking mentor in database...');
    const mentorCheck = await sql`
      SELECT mu.*, mp.total_students, mp.total_uploads, mp.rating
      FROM mentor_users mu
      LEFT JOIN mentor_profiles mp ON mu.id = mp.mentor_id
      WHERE mu.email = 'alex.thompson@mentor.com'
    `;

    if (mentorCheck.rows.length === 0) {
      console.log('❌ Mentor not found in database');
      return;
    }

    const mentor = mentorCheck.rows[0];
    console.log('✅ Mentor found:');
    console.log(`   Name: ${mentor.name}`);
    console.log(`   Email: ${mentor.email}`);
    console.log(`   Subject: ${mentor.subject}`);
    console.log(`   Status: ${mentor.status}`);
    console.log(`   Students: ${mentor.total_students || 0}`);

    // Test 2: Verify password hash
    console.log('\n2️⃣ Testing password verification...');
    const testPassword = 'MentorPass123!';
    const isValidPassword = await bcrypt.compare(testPassword, mentor.password_hash);
    
    if (isValidPassword) {
      console.log('✅ Password verification successful');
    } else {
      console.log('❌ Password verification failed');
      return;
    }

    // Test 3: Simulate API authentication
    console.log('\n3️⃣ Simulating API authentication...');
    
    // Get students for this mentor (should be empty for new mentor)
    const studentsResult = await sql`
      SELECT id, name, email, created_at
      FROM students 
      WHERE mentor_id = ${mentor.id}
      ORDER BY created_at DESC
    `;

    // Get content statistics
    const formulaCount = await sql`
      SELECT COUNT(*) as count FROM formula_bank WHERE uploaded_by = ${mentor.id}
    `;
    const flashcardCount = await sql`
      SELECT COUNT(*) as count FROM flashcards WHERE uploaded_by = ${mentor.id}
    `;
    const pyqCount = await sql`
      SELECT COUNT(*) as count FROM pyq WHERE uploaded_by = ${mentor.id}
    `;

    const authResponse = {
      success: true,
      mentor: {
        id: mentor.id,
        name: mentor.name,
        email: mentor.email,
        subject: mentor.subject,
        status: mentor.status,
        profile: {
          total_students: mentor.total_students || 0,
          total_uploads: mentor.total_uploads || 0,
          total_sessions: mentor.total_sessions || 0,
          rating: mentor.rating || 0
        },
        students: studentsResult.rows,
        content_stats: {
          formula_count: parseInt(formulaCount.rows[0].count),
          flashcard_count: parseInt(flashcardCount.rows[0].count),
          pyq_count: parseInt(pyqCount.rows[0].count)
        }
      }
    };

    console.log('✅ API response simulation successful');
    console.log(`   Students: ${authResponse.mentor.students.length}`);
    console.log(`   Formula Bank: ${authResponse.mentor.content_stats.formula_count}`);
    console.log(`   Flashcards: ${authResponse.mentor.content_stats.flashcard_count}`);
    console.log(`   PYQ: ${authResponse.mentor.content_stats.pyq_count}`);

    // Test 4: List all mentors
    console.log('\n4️⃣ Listing all mentors in system...');
    const allMentors = await sql`
      SELECT mu.name, mu.email, mu.subject, mu.status, mp.total_students
      FROM mentor_users mu
      LEFT JOIN mentor_profiles mp ON mu.id = mp.mentor_id
      ORDER BY mu.created_at DESC
    `;

    console.log(`✅ Total mentors in system: ${allMentors.rows.length}`);
    allMentors.rows.forEach((m, index) => {
      console.log(`   ${index + 1}. ${m.name} (${m.email}) - ${m.subject} - ${m.status} - ${m.total_students || 0} students`);
    });

    console.log('\n🎉 All tests passed! New mentor system is working correctly.');
    console.log('\n🔗 Next Steps:');
    console.log('1. Visit: /mentor/login-new');
    console.log('2. Login with: alex.thompson@mentor.com / MentorPass123!');
    console.log('3. Access dashboard: /mentor/dashboard-new');
    console.log('4. Or use SuperAdmin panel to manage mentors');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNewMentorLogin();
