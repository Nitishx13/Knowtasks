import { getTextFileById } from '../../../lib/textDatabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, userId } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'File ID is required'
      });
    }
    
    const file = await getTextFileById(id);
    
    // Check if userId is provided and matches the file's user_id
    if (userId && file && file.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not have permission to view this file'
      });
    }
    
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Text file not found'
      });
    }
    
    res.status(200).json({
      success: true,
      file: {
        id: file.id,
        title: file.title,
        content: file.content,
        summary: file.summary,
        wordCount: file.word_count,
        userId: file.user_id,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
        formattedDate: new Date(file.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    });
  } catch (error) {
    console.error('Error viewing text file:', error);
    res.status(500).json({ error: 'Failed to view text file: ' + error.message });
  }
}