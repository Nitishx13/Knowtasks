const { sql } = require('@vercel/postgres');

// Database operations for text files
async function createTextFile(userId, textData) {
  try {
    const result = await sql`
      INSERT INTO text_files (
        user_id, 
        title, 
        content, 
        summary, 
        word_count, 
        created_at, 
        updated_at,
        status
      )
      VALUES (
        ${userId || 'anonymous'}, 
        ${textData.title || 'Untitled Text'}, 
        ${textData.content}, 
        ${textData.summary || ''}, 
        ${textData.wordCount || textData.content.split(/\s+/).length}, 
        NOW(), 
        NOW(),
        ${'processed'}
      )
      RETURNING *
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating text file:', error);
    throw error;
  }
}

async function getTextFileById(fileId) {
  try {
    const result = await sql`
      SELECT * FROM text_files WHERE id = ${fileId}
    `;
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting text file:', error);
    throw error;
  }
}

async function getUserTextFiles(userId) {
  try {
    const result = await sql`
      SELECT * FROM text_files 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    
    return result.rows;
  } catch (error) {
    console.error('Error getting user text files:', error);
    throw error;
  }
}

async function getAllTextFiles(page = 1, limit = 20) {
  try {
    const offset = (page - 1) * limit;
    
    const result = await sql`
      SELECT * FROM text_files
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    // Get total count for pagination
    const countResult = await sql`SELECT COUNT(*) FROM text_files`;
    const totalCount = parseInt(countResult.rows[0].count);
    
    return {
      files: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error getting all text files:', error);
    throw error;
  }
}

async function updateTextFile(fileId, updateData) {
  try {
    const result = await sql`
      UPDATE text_files
      SET 
        title = COALESCE(${updateData.title}, title),
        content = COALESCE(${updateData.content}, content),
        summary = COALESCE(${updateData.summary}, summary),
        word_count = COALESCE(${updateData.wordCount}, word_count),
        updated_at = NOW()
      WHERE id = ${fileId}
      RETURNING *
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating text file:', error);
    throw error;
  }
}

async function deleteTextFile(fileId) {
  try {
    const result = await sql`
      DELETE FROM text_files
      WHERE id = ${fileId}
      RETURNING id
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting text file:', error);
    throw error;
  }
}

module.exports = {
  createTextFile,
  getTextFileById,
  getUserTextFiles,
  getAllTextFiles,
  updateTextFile,
  deleteTextFile
};