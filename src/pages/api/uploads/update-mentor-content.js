import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, title, description, category, subject, year, examType } = req.body;

    if (!id || !title || !category || !subject) {
      return res.status(400).json({ 
        error: 'Missing required fields: id, title, category, subject' 
      });
    }

    // Update the record
    const result = await sql`
      UPDATE mentor_uploads 
      SET 
        title = ${title},
        description = ${description || ''},
        category = ${category},
        subject = ${subject},
        year = ${year || null},
        exam_type = ${examType || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, title, description, category, subject, type, year, exam_type, file_name, created_at
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      content: result.rows[0]
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ 
      error: 'Failed to update content',
      details: error.message 
    });
  }
}
