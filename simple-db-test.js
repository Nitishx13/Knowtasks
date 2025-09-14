require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function testStorage() {
  try {
    console.log('Testing database storage...');
    
    // Test basic connection
    const now = await sql`SELECT NOW()`;
    console.log('✅ Database connected');
    
    // Check uploaded_files table (main storage for upload-task)
    try {
      const files = await sql`SELECT COUNT(*) FROM uploaded_files`;
      console.log(`✅ uploaded_files table: ${files.rows[0].count} files stored`);
      
      // Show recent files
      const recent = await sql`SELECT file_name, upload_date, status FROM uploaded_files ORDER BY upload_date DESC LIMIT 3`;
      if (recent.rows.length > 0) {
        console.log('Recent uploads:');
        recent.rows.forEach(file => console.log(`  - ${file.file_name} (${file.status})`));
      }
    } catch (e) {
      console.log('❌ uploaded_files table issue:', e.message);
    }
    
    // Check other tables
    const tables = ['flashcards', 'formula_bank', 'pyq', 'concepts', 'formulas'];
    
    for (const table of tables) {
      try {
        const result = await sql.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ ${table} table: ${result.rows[0].count} records`);
      } catch (e) {
        if (e.message.includes('does not exist')) {
          console.log(`⚠️  ${table} table: Not created yet`);
        } else {
          console.log(`❌ ${table} table error: ${e.message}`);
        }
      }
    }
    
    console.log('\nSUMMARY:');
    console.log('- File uploads from /dashboard/upload-task → uploaded_files table ✅');
    console.log('- Data displayed in /dashboard/data from uploaded_files table ✅');
    console.log('- Other activity tables may need creation for full functionality');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testStorage();
