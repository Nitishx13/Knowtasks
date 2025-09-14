const { sql } = require('@vercel/postgres');
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get authenticated user ID
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Authentication required',
          message: 'User must be authenticated to access library'
        });
      }

      // Get user's own content + shared mentor content
      const userContent = await sql`
        SELECT 
          id, title, content, key_points, file_name, file_url, 
          word_count, document_type, estimated_pages, created_at,
          'user' as content_type, user_id as creator_id
        FROM uploaded_files 
        WHERE user_id = ${userId} AND status = 'processed'
        ORDER BY created_at DESC
      `;

      // Get shared mentor content (formulas, flashcards, PYQs)
      const mentorFormulas = await sql`
        SELECT 
          id, title, description as content, '' as key_points, 
          file_name, file_path as file_url, file_size as word_count,
          'Formula' as document_type, 1 as estimated_pages, created_at,
          'mentor_formula' as content_type, user_id as creator_id,
          category, subject
        FROM formula_bank 
        WHERE status = 'active'
        ORDER BY created_at DESC
        LIMIT 50
      `;

      const mentorFlashcards = await sql`
        SELECT 
          id, title, description as content, '' as key_points,
          '' as file_name, '' as file_url, 0 as word_count,
          'Flashcard' as document_type, 1 as estimated_pages, created_at,
          'mentor_flashcard' as content_type, user_id as creator_id,
          category, subject
        FROM flashcards
        ORDER BY created_at DESC
        LIMIT 50
      `;

      const mentorPYQs = await sql`
        SELECT 
          id, title, description as content, '' as key_points,
          '' as file_name, '' as file_url, 0 as word_count,
          'PYQ' as document_type, 1 as estimated_pages, created_at,
          'mentor_pyq' as content_type, user_id as creator_id,
          category, subject, year, exam_type
        FROM pyq
        ORDER BY created_at DESC
        LIMIT 50
      `;

      // Combine all content
      const allContent = [
        ...userContent.rows,
        ...mentorFormulas.rows,
        ...mentorFlashcards.rows,
        ...mentorPYQs.rows
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      res.status(200).json({
        success: true,
        library: allContent,
        stats: {
          user_content: userContent.rows.length,
          mentor_formulas: mentorFormulas.rows.length,
          mentor_flashcards: mentorFlashcards.rows.length,
          mentor_pyqs: mentorPYQs.rows.length,
          total: allContent.length
        }
      });
      
    } else if (req.method === 'POST') {
      // Get authenticated user ID for POST operations
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Authentication required',
          message: 'User must be authenticated to save content'
        });
      }

      // Save a new summary with user ID
      const { title, content, keyPoints, fileName, fileUrl, wordCount, documentType, estimatedPages } = req.body;
      
      if (!title || !content || !fileName) {
        return res.status(400).json({ error: 'Title, content, and filename are required' });
      }
      
      const result = await sql`
        INSERT INTO uploaded_files (
          file_name, file_url, file_size, user_id, upload_source, 
          upload_date, status, content, summary, file_type
        )
        VALUES (
          ${fileName}, ${fileUrl || ''}, ${wordCount || 0}, ${userId}, 'library',
          NOW(), 'processed', ${content}, ${title}, ${documentType || 'PDF'}
        )
        RETURNING *
      `;
      
      res.status(201).json({
        success: true,
        summary: result.rows[0]
      });
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Library API error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Check server logs for more information'
    });
  }
}

// Apply auth middleware to protect this route and ensure data privacy
export default authMiddleware(handler);
