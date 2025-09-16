require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function addTestMentorData() {
  try {
    console.log('🔍 Adding test mentor data...\n');
    
    // First check existing data
    const existing = await sql`
      SELECT id, title, type, user_id FROM mentor_uploads 
      ORDER BY created_at DESC
    `;
    
    console.log(`📊 Current mentor uploads: ${existing.rows.length}`);
    existing.rows.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} (${item.type}) - User: ${item.user_id}`);
    });
    
    // Add test data if needed
    if (existing.rows.length < 4) {
      console.log('\n➕ Adding test mentor data...');
      
      const testData = [
        {
          title: 'JEE Physics Formula Collection',
          description: 'Complete collection of physics formulas for JEE Main and Advanced',
          type: 'formula',
          category: 'Physics',
          subject: 'Physics',
          user_id: 'test_user_123',
          file_name: 'jee-physics-formulas.pdf',
          file_path: 'uploads/mentor-content/jee-physics-formulas.pdf',
          file_size: 2048000
        },
        {
          title: 'NEET Chemistry Flashcards',
          description: 'Interactive flashcards for organic chemistry reactions',
          type: 'flashcard',
          category: 'Chemistry', 
          subject: 'Chemistry',
          user_id: 'test_user_123',
          file_name: 'neet-chemistry-flashcards.pdf',
          file_path: 'uploads/mentor-content/neet-chemistry-flashcards.pdf',
          file_size: 1536000
        },
        {
          title: 'JEE Advanced Math PYQ 2023',
          description: 'Previous year questions from JEE Advanced 2023 mathematics',
          type: 'pyq',
          category: 'Mathematics',
          subject: 'Mathematics',
          user_id: 'test_user_123',
          file_name: 'jee-advanced-math-2023.pdf',
          file_path: 'uploads/mentor-content/jee-advanced-math-2023.pdf',
          file_size: 3072000,
          year: 2023,
          exam_type: 'JEE Advanced'
        },
        {
          title: 'NEET Biology Study Notes',
          description: 'Comprehensive study notes for NEET biology preparation',
          type: 'notes',
          category: 'Biology',
          subject: 'Biology', 
          user_id: 'test_user_123',
          file_name: 'neet-biology-notes.pdf',
          file_path: 'uploads/mentor-content/neet-biology-notes.pdf',
          file_size: 4096000
        }
      ];
      
      for (const item of testData) {
        const result = await sql`
          INSERT INTO mentor_uploads (
            title, description, type, category, subject, user_id, 
            file_name, file_path, file_size, year, exam_type, created_at
          ) VALUES (
            ${item.title}, ${item.description}, ${item.type}, 
            ${item.category}, ${item.subject}, ${item.user_id},
            ${item.file_name}, ${item.file_path}, ${item.file_size},
            ${item.year || null}, ${item.exam_type || null}, NOW()
          )
          RETURNING id, title, type
        `;
        
        console.log(`✅ Added: ${result.rows[0].title} (${result.rows[0].type})`);
      }
    }
    
    // Final check
    const final = await sql`
      SELECT 
        mu.id, mu.title, mu.type, mu.category, mu.subject, mu.user_id,
        m.name as mentor_name
      FROM mentor_uploads mu
      LEFT JOIN mentor_users m ON mu.user_id = m.user_id
      ORDER BY mu.created_at DESC
    `;
    
    console.log(`\n📈 Final count: ${final.rows.length} mentor uploads`);
    console.log('\n📋 All Mentor Content:');
    console.log('─'.repeat(80));
    
    final.rows.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   Type: ${item.type} | Subject: ${item.subject}`);
      console.log(`   Mentor: ${item.mentor_name || 'Unknown'} | User ID: ${item.user_id}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

addTestMentorData();
