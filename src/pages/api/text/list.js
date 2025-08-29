import { getAllTextFiles, getUserTextFiles } from '../../../lib/textDatabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = 1, limit = 20, userId } = req.query;
    
    // If no userId is provided, return an error as we don't want to expose all files
    if (!userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: User ID is required to view files'
      });
    }
    
    let result;
    
    // Get files for the specific user only
    const files = await getUserTextFiles(userId);
    result = {
      files,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: files.length,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
    
    // Format the response
    const formattedFiles = result.files.map(file => ({
      id: file.id,
      title: file.title,
      content: file.content.length > 300 ? file.content.substring(0, 300) + '...' : file.content,
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
    }));
    
    res.status(200).json({
      success: true,
      files: formattedFiles,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error listing text files:', error);
    res.status(500).json({ error: 'Failed to list text files: ' + error.message });
  }
}