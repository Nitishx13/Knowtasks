import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all table data
    const tables = {};

    // Superadmin users
    const superadmins = await sql`
      SELECT id, name, email, role, status, last_login, created_at
      FROM superadmin_users 
      ORDER BY created_at DESC
    `;
    tables.superadmin_users = superadmins.rows;

    // Mentor users
    const mentors = await sql`
      SELECT id, name, email, subject, role, status, students_count, last_login, created_at
      FROM mentor_users 
      ORDER BY created_at DESC
    `;
    tables.mentor_users = mentors.rows;

    // Formula bank
    const formulaBank = await sql`
      SELECT id, title, description, category, subject, file_name, file_size, uploaded_by, uploader_role, created_at
      FROM formula_bank 
      ORDER BY created_at DESC
      LIMIT 50
    `;
    tables.formula_bank = formulaBank.rows;

    // Flashcards
    const flashcards = await sql`
      SELECT id, title, description, category, subject, file_name, file_size, uploaded_by, uploader_role, created_at
      FROM flashcards 
      ORDER BY created_at DESC
      LIMIT 50
    `;
    tables.flashcards = flashcards.rows;

    // PYQ
    const pyq = await sql`
      SELECT id, title, description, category, subject, year, exam_type, file_name, file_size, uploaded_by, uploader_role, created_at
      FROM pyq 
      ORDER BY created_at DESC
      LIMIT 50
    `;
    tables.pyq = pyq.rows;

    // Users (if exists)
    try {
      const users = await sql`
        SELECT id, name, email, role, status, last_login, created_at
        FROM users 
        ORDER BY created_at DESC
        LIMIT 50
      `;
      tables.users = users.rows;
    } catch (error) {
      tables.users = [];
    }

    // Summaries (if exists)
    try {
      const summaries = await sql`
        SELECT id, title, content, word_count, user_id, created_at
        FROM summaries 
        ORDER BY created_at DESC
        LIMIT 50
      `;
      tables.summaries = summaries.rows;
    } catch (error) {
      tables.summaries = [];
    }

    // Notes (if exists)
    try {
      const notes = await sql`
        SELECT id, title, content, user_id, created_at
        FROM notes 
        ORDER BY created_at DESC
        LIMIT 50
      `;
      tables.notes = notes.rows;
    } catch (error) {
      tables.notes = [];
    }

    // Get table statistics
    const stats = {};
    for (const [tableName, data] of Object.entries(tables)) {
      stats[tableName] = {
        count: data.length,
        hasData: data.length > 0
      };
    }

    res.status(200).json({
      success: true,
      data: tables,
      stats: stats
    });

  } catch (error) {
    console.error('Error fetching table data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch table data', 
      details: error.message 
    });
  }
}
