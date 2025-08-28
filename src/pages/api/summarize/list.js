import { getAuth } from "@clerk/nextjs/server";
import { getUserSummaries } from "../../../lib/postgres";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const { userId } = await getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's summaries from Postgres
    const summaries = await getUserSummaries(userId);

    // Transform data to match frontend expectations
    const transformedSummaries = summaries.map(summary => ({
      id: summary.id,
      title: summary.title,
      content: summary.content,
      keyPoints: summary.key_points || [],
      fileName: summary.file_name,
      fileUrl: summary.file_url,
      wordCount: summary.word_count,
      documentType: summary.document_type,
      estimatedPages: summary.estimated_pages,
      createdAt: summary.created_at,
      date: summary.created_at
    }));

    res.status(200).json({
      success: true,
      summaries: transformedSummaries
    });

  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).json({ 
      error: 'Failed to fetch summaries', 
      details: error.message 
    });
  }
}
