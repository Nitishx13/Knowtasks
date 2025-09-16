import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Summary ID is required' });
    }

    const result = await sql`
      SELECT 
        id, 
        file_name, 
        file_url, 
        file_size, 
        user_id, 
        upload_source, 
        upload_date, 
        status,
        content,
        summary,
        file_type
      FROM uploaded_files 
      WHERE id = ${id} AND status = 'processed'
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Summary not found' });
    }

    const file = result.rows[0];
    
    const summary = {
      id: file.id,
      fileName: file.file_name,
      fileUrl: file.file_url,
      fileSize: file.file_size,
      userId: file.user_id,
      uploadSource: file.upload_source,
      uploadDate: file.upload_date,
      status: file.status,
      content: file.content,
      summary: file.summary,
      fileType: file.file_type,
      wordCount: file.content ? file.content.split(/\s+/).length : 0,
      formattedSize: formatFileSize(file.file_size),
      formattedDate: new Date(file.upload_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      estimatedPages: file.content ? Math.ceil(file.content.split(/\s+/).length / 250) : 0
    };

    res.status(200).json({
      success: true,
      summary
    });

  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ 
      error: error.message, 
      details: 'Check server logs for more information' 
    });
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
