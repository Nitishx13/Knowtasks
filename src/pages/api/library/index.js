const { sql } = require('@vercel/postgres');
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get authenticated user ID from middleware or headers
      let userId = req.userId;
      
      // Fallback to user-id header for development
      if (!userId) {
        userId = req.headers['user-id'];
      }
      
      // Development fallback
      if (!userId && process.env.NODE_ENV === 'development') {
        userId = 'test_user_123';
      }
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Authentication required',
          message: 'User must be authenticated to access library'
        });
      }

      // Get user's own content + shared mentor content
      let userContent;
      try {
        userContent = await sql`
          SELECT 
            id, title, content, key_points, file_name, file_url, 
            word_count, document_type, estimated_pages, created_at,
            'user' as content_type, user_id as creator_id
          FROM uploaded_files 
          WHERE user_id = ${userId} AND status = 'processed'
          ORDER BY created_at DESC
        `;
      } catch (error) {
        console.log('User content query failed (table may not exist):', error.message);
        userContent = { rows: [] };
      }

      // Get shared mentor content from mentor_uploads table with mentor info
      let mentorContent;
      try {
        console.log('🔍 Querying mentor_uploads table...');
        
        // First, check if mentor_uploads table has any data at all
        const uploadCheck = await sql`SELECT COUNT(*) as total FROM mentor_uploads`;
        console.log(`📊 Total mentor_uploads records: ${uploadCheck.rows[0]?.total || 0}`);
        
        // Check mentor_users table
        const userCheck = await sql`SELECT COUNT(*) as total FROM mentor_users`;
        console.log(`👥 Total mentor_users records: ${userCheck.rows[0]?.total || 0}`);
        
        // Test the JOIN without filters first
        const joinTest = await sql`
          SELECT mu.id, mu.user_id, m.id as mentor_id, m.user_id as mentor_user_id, m.name
          FROM mentor_uploads mu
          LEFT JOIN mentor_users m ON mu.user_id = m.user_id
          LIMIT 5
        `;
        console.log(`🔗 JOIN test results: ${joinTest.rows.length} rows`);
        if (joinTest.rows.length > 0) {
          console.log('🔗 Sample JOIN result:', joinTest.rows[0]);
        }
        
        mentorContent = await sql`
          SELECT 
            mu.id, mu.title, mu.description as content, '' as key_points, 
            mu.file_name, mu.file_path as file_url, mu.file_size as word_count,
            mu.type as document_type, 1 as estimated_pages, mu.created_at,
            CASE 
              WHEN mu.type = 'formula' THEN 'mentor_formula'
              WHEN mu.type = 'flashcard' THEN 'mentor_flashcard' 
              WHEN mu.type = 'pyq' THEN 'mentor_pyq'
              WHEN mu.type = 'notes' THEN 'mentor_notes'
              ELSE 'mentor_content'
            END as content_type,
            mu.user_id as creator_id, mu.category, mu.subject, mu.year, mu.exam_type,
            COALESCE(m.name, 'Expert Mentor') as mentor_name, m.experience as expertise
          FROM mentor_uploads mu
          LEFT JOIN mentor_users m ON mu.user_id = m.user_id
          ORDER BY mu.created_at DESC
          LIMIT 100
        `;
        console.log(`📊 Mentor query returned ${mentorContent.rows.length} rows`);
        if (mentorContent.rows.length > 0) {
          console.log('📋 First mentor item:', mentorContent.rows[0]);
        }
      } catch (error) {
        console.error('❌ Mentor content query failed:', error.message);
        mentorContent = { rows: [] };
      }

      // Combine all content and remove duplicates - ensure rows exist
      const allContent = [
        ...(userContent && userContent.rows ? userContent.rows : []),
        ...(mentorContent && mentorContent.rows ? mentorContent.rows : [])
      ];
      
      console.log(`📊 Combined content: ${allContent.length} items`);
      console.log(`👤 User content: ${userContent && userContent.rows ? userContent.rows.length : 0} items`);
      console.log(`👨‍🏫 Mentor content: ${mentorContent && mentorContent.rows ? mentorContent.rows.length : 0} items`);
      
      // Remove duplicates based on unique combination of id, content_type, and creator_id
      const uniqueContent = allContent.filter((item, index, self) => 
        index === self.findIndex(t => 
          t.id === item.id && 
          t.content_type === item.content_type &&
          t.creator_id === item.creator_id
        )
      ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      console.log(`✅ Final unique content: ${uniqueContent.length} items`);
      
      // Calculate stats by content type - ensure mentorContent.rows exists
      const mentorStats = (mentorContent && mentorContent.rows ? mentorContent.rows : []).reduce((acc, item) => {
        const type = item.content_type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      
      res.status(200).json({
        success: true,
        library: uniqueContent,
        stats: {
          user_content: (userContent && userContent.rows ? userContent.rows.length : 0),
          mentor_formulas: mentorStats.mentor_formula || 0,
          mentor_flashcards: mentorStats.mentor_flashcard || 0,
          mentor_pyqs: mentorStats.mentor_pyq || 0,
          mentor_notes: mentorStats.mentor_notes || 0,
          total: uniqueContent.length
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
