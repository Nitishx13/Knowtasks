/**
 * API endpoint for users to access all shared mentor content
 * No authentication required - this is public content for all users
 */

import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Fetching all mentor content for users');
    
    const { type, subject, category, search } = req.query;
    
    // Build dynamic query based on filters
    let query = `
      SELECT 
        mu.id,
        mu.title,
        mu.description,
        mu.subject,
        mu.category,
        mu.type,
        mu.year,
        mu.exam_type,
        mu.file_name,
        mu.created_at,
        m.name as mentor_name,
        m.experience as mentor_experience
      FROM mentor_uploads mu
      LEFT JOIN mentor_users m ON mu.user_id = m.user_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    // Add filters
    if (type) {
      query += ` AND mu.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    
    if (subject) {
      query += ` AND mu.subject = $${paramIndex}`;
      params.push(subject);
      paramIndex++;
    }
    
    if (category) {
      query += ` AND mu.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (mu.title ILIKE $${paramIndex} OR mu.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    query += ` ORDER BY mu.created_at DESC`;
    
    console.log('Executing query:', query);
    console.log('With params:', params);
    
    const result = await sql.query(query, params);
    
    // Ensure result and rows exist to prevent undefined errors
    const rows = result && result.rows ? result.rows : [];
    console.log(`Found ${rows.length} mentor content items`);
    
    // Format the response
    const content = rows.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      subject: item.subject,
      category: item.category,
      type: item.type,
      year: item.year,
      examType: item.exam_type,
      fileName: item.file_name,
      createdAt: item.created_at,
      mentor: {
        name: item.mentor_name || 'Anonymous Mentor',
        experience: item.mentor_experience
      }
    }));
    
    // Group content by type for easier frontend handling
    const groupedContent = {
      notes: content.filter(item => item.type === 'notes'),
      formula: content.filter(item => item.type === 'formula'),
      flashcard: content.filter(item => item.type === 'flashcard'),
      pyq: content.filter(item => item.type === 'pyq')
    };
    
    res.status(200).json({
      success: true,
      content: content,
      grouped: groupedContent,
      total: content.length,
      filters: {
        type: type || 'all',
        subject: subject || 'all',
        category: category || 'all',
        search: search || ''
      }
    });
    
  } catch (error) {
    console.error('Error fetching mentor content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentor content',
      message: error.message
    });
  }
}
