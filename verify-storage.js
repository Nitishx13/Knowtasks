require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function verifyStorage() {
  console.log('Testing Database Storage...\n');
  
  try {
    // Test connection
    await sql`SELECT NOW()`;
    console.log('✅ Database connected\n');

    // Check each table
    const tables = [
      { name: 'uploaded_files', description: 'File uploads from /dashboard/upload-task' },
      { name: 'flashcards', description: 'Flashcard uploads' },
      { name: 'formula_bank', description: 'Formula bank PDFs' },
      { name: 'pyq', description: 'Previous year questions' },
      { name: 'concepts', description: 'Individual concepts' },
      { name: 'formulas', description: 'Individual formulas' }
    ];

    for (const table of tables) {
      try {
        const count = await sql`SELECT COUNT(*) as count FROM ${sql(table.name)}`;
        console.log(`✅ ${table.name}: ${count.rows[0].count} records - ${table.description}`);
      } catch (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ ${table.name}: TABLE MISSING - ${table.description}`);
        } else {
          console.log(`⚠️  ${table.name}: ERROR - ${error.message}`);
        }
      }
    }

    console.log('\nStorage Test Summary:');
    console.log('- All activities that use existing tables will store data properly');
    console.log('- Missing tables need to be created for full functionality');
    console.log('- /dashboard/data page will display data from uploaded_files table');

  } catch (error) {
    console.error('Database error:', error.message);
  }
}

verifyStorage();
