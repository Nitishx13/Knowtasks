const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function addTestFormulaBankData() {
  try {
    console.log('Adding test Formula Bank data...');
    
    // Insert test data
    const result = await sql`
      INSERT INTO formula_bank (
        title, description, file_name, file_url, file_size,
        category, subject, uploaded_by, uploader_role, 
        tags, is_public, status, download_count
      ) VALUES 
      (
        'Physics Formulas - Mechanics', 
        'Essential mechanics formulas for JEE preparation',
        'physics-mechanics-formulas.pdf',
        '/uploads/physics-mechanics-formulas.pdf',
        1024000,
        'Physics',
        'Physics',
        'mentor',
        'mentor',
        ARRAY['mechanics', 'physics', 'jee'],
        true,
        'active',
        0
      ),
      (
        'Chemistry Organic Reactions', 
        'Important organic chemistry reactions and mechanisms',
        'chemistry-organic-reactions.pdf',
        '/uploads/chemistry-organic-reactions.pdf',
        2048000,
        'Chemistry',
        'Chemistry',
        'mentor',
        'mentor',
        ARRAY['organic', 'chemistry', 'reactions'],
        true,
        'active',
        0
      ),
      (
        'Mathematics Calculus Formulas', 
        'Differential and integral calculus formulas',
        'math-calculus-formulas.pdf',
        '/uploads/math-calculus-formulas.pdf',
        1536000,
        'Mathematics',
        'Mathematics',
        'mentor',
        'mentor',
        ARRAY['calculus', 'mathematics', 'derivatives'],
        true,
        'active',
        0
      )
      RETURNING id, title;
    `;
    
    console.log('Test data added successfully:');
    result.rows.forEach(row => {
      console.log(`- ${row.title} (ID: ${row.id})`);
    });
    
    // Verify the data
    const countResult = await sql`SELECT COUNT(*) FROM formula_bank WHERE status = 'active'`;
    console.log(`\nTotal active Formula Bank items: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('Error adding test data:', error);
  }
}

addTestFormulaBankData();
