const { sql } = require('@vercel/postgres');
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user ID
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to access mentor content'
      });
    }

    const { type, category, subject, search } = req.query;

    let mentorContent = [];

    // Get mentor formulas
    if (!type || type === 'formula') {
      let formulaQuery = `
        SELECT 
          fb.id, fb.title, fb.description, fb.category, fb.subject,
          fb.file_name, fb.file_path, fb.created_at, fb.download_count,
          mu.name as mentor_name, mu.email as mentor_email
        FROM formula_bank fb
        LEFT JOIN mentor_users mu ON fb.user_id = mu.id
        WHERE fb.status = 'active'
      `;
      
      const params = [];
      let paramCount = 0;

      if (category && category !== 'all') {
        paramCount++;
        formulaQuery += ` AND fb.category = $${paramCount}`;
        params.push(category);
      }

      if (subject && subject !== 'all') {
        paramCount++;
        formulaQuery += ` AND fb.subject = $${paramCount}`;
        params.push(subject);
      }

      if (search) {
        paramCount++;
        formulaQuery += ` AND (fb.title ILIKE $${paramCount} OR fb.description ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      formulaQuery += ` ORDER BY fb.created_at DESC LIMIT 50`;

      const formulas = await sql.query(formulaQuery, params);
      
      mentorContent.push(...formulas.rows.map(item => ({
        ...item,
        content_type: 'mentor_formula',
        document_type: 'Formula'
      })));
    }

    // Get mentor flashcards
    if (!type || type === 'flashcard') {
      let flashcardQuery = `
        SELECT 
          fc.id, fc.title, fc.description, fc.category, fc.subject,
          fc.created_at,
          mu.name as mentor_name, mu.email as mentor_email
        FROM flashcards fc
        LEFT JOIN mentor_users mu ON fc.user_id = mu.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;

      if (category && category !== 'all') {
        paramCount++;
        flashcardQuery += ` AND fc.category = $${paramCount}`;
        params.push(category);
      }

      if (subject && subject !== 'all') {
        paramCount++;
        flashcardQuery += ` AND fc.subject = $${paramCount}`;
        params.push(subject);
      }

      if (search) {
        paramCount++;
        flashcardQuery += ` AND (fc.title ILIKE $${paramCount} OR fc.description ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      flashcardQuery += ` ORDER BY fc.created_at DESC LIMIT 50`;

      const flashcards = await sql.query(flashcardQuery, params);
      
      mentorContent.push(...flashcards.rows.map(item => ({
        ...item,
        content_type: 'mentor_flashcard',
        document_type: 'Flashcard'
      })));
    }

    // Get mentor PYQs
    if (!type || type === 'pyq') {
      let pyqQuery = `
        SELECT 
          pyq.id, pyq.title, pyq.description, pyq.category, pyq.subject,
          pyq.year, pyq.exam_type, pyq.created_at,
          mu.name as mentor_name, mu.email as mentor_email
        FROM pyq
        LEFT JOIN mentor_users mu ON pyq.user_id = mu.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;

      if (category && category !== 'all') {
        paramCount++;
        pyqQuery += ` AND pyq.category = $${paramCount}`;
        params.push(category);
      }

      if (subject && subject !== 'all') {
        paramCount++;
        pyqQuery += ` AND pyq.subject = $${paramCount}`;
        params.push(subject);
      }

      if (search) {
        paramCount++;
        pyqQuery += ` AND (pyq.title ILIKE $${paramCount} OR pyq.description ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      pyqQuery += ` ORDER BY pyq.created_at DESC LIMIT 50`;

      const pyqs = await sql.query(pyqQuery, params);
      
      mentorContent.push(...pyqs.rows.map(item => ({
        ...item,
        content_type: 'mentor_pyq',
        document_type: 'PYQ'
      })));
    }

    // Sort all content by creation date
    mentorContent.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.status(200).json({
      success: true,
      content: mentorContent,
      total: mentorContent.length,
      filters: {
        type: type || 'all',
        category: category || 'all',
        subject: subject || 'all',
        search: search || ''
      }
    });

  } catch (error) {
    console.error('Mentor content API error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
