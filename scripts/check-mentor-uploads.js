require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function checkMentorUploads() {
  try {
    console.log('🔍 Checking mentor uploads...\n');
    
    // Check mentor_uploads table
    const uploads = await sql`
      SELECT id, title, type, category, subject, user_id, created_at 
      FROM mentor_uploads 
      ORDER BY created_at DESC
    `;
    
    console.log(`📊 Total mentor uploads: ${uploads.rows.length}\n`);
    
    if (uploads.rows.length > 0) {
      console.log('📋 Mentor Uploads:');
      console.log('─'.repeat(80));
      
      const typeCount = {};
      
      uploads.rows.forEach((upload, index) => {
        console.log(`${index + 1}. ${upload.title}`);
        console.log(`   Type: ${upload.type} | Subject: ${upload.subject} | Category: ${upload.category}`);
        console.log(`   User: ${upload.user_id} | Created: ${new Date(upload.created_at).toLocaleDateString()}`);
        console.log('');
        
        typeCount[upload.type] = (typeCount[upload.type] || 0) + 1;
      });
      
      console.log('📈 Content Type Summary:');
      console.log('─'.repeat(40));
      Object.entries(typeCount).forEach(([type, count]) => {
        const emoji = type === 'notes' ? '📖' : 
                     type === 'formula' ? '🧮' : 
                     type === 'flashcard' ? '🃏' : 
                     type === 'pyq' ? '📝' : '📄';
        console.log(`${emoji} ${type}: ${count}`);
      });
    } else {
      console.log('❌ No mentor uploads found');
    }
    
    // Test library API query
    console.log('\n🔍 Testing library API query...');
    
    const libraryTest = await sql`
      SELECT 
        mu.id, mu.title, mu.type, mu.category, mu.subject,
        CASE 
          WHEN mu.type = 'formula' THEN 'mentor_formula'
          WHEN mu.type = 'flashcard' THEN 'mentor_flashcard' 
          WHEN mu.type = 'pyq' THEN 'mentor_pyq'
          WHEN mu.type = 'notes' THEN 'mentor_notes'
          ELSE 'mentor_content'
        END as content_type,
        m.name as mentor_name
      FROM mentor_uploads mu
      LEFT JOIN mentor_users m ON mu.user_id = m.user_id
      ORDER BY mu.created_at DESC
      LIMIT 10
    `;
    
    console.log(`✅ Library query returned ${libraryTest.rows.length} items`);
    
    if (libraryTest.rows.length > 0) {
      console.log('\n📚 Library API Results:');
      console.log('─'.repeat(60));
      libraryTest.rows.forEach(item => {
        console.log(`• ${item.title} (${item.content_type})`);
        console.log(`  Subject: ${item.subject} | Mentor: ${item.mentor_name || 'Unknown'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkMentorUploads();
