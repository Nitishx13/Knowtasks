const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function checkFormulaBankTable() {
  try {
    console.log('Checking formula_bank table...');
    
    // Check if table exists and get count
    const countResult = await sql`SELECT COUNT(*) FROM formula_bank`;
    console.log('Total records in formula_bank:', countResult.rows[0].count);
    
    // Get all records
    const result = await sql`
      SELECT id, title, description, file_name, category, subject, 
             uploaded_by, uploader_role, status, created_at
      FROM formula_bank 
      ORDER BY created_at DESC
    `;
    
    console.log('\nFormula Bank Records:');
    if (result.rows.length === 0) {
      console.log('No records found in formula_bank table');
    } else {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.title} (${row.category})`);
        console.log(`   File: ${row.file_name}`);
        console.log(`   Status: ${row.status}`);
        console.log(`   Uploaded: ${row.created_at}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error checking formula_bank table:', error);
  }
}

checkFormulaBankTable();
