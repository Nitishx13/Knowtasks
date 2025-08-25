import { getAuth } from "@clerk/nextjs/server";
import { getUserSummaries } from "../../../lib/neo4j";

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

    // Get user's summaries from database
    const summaries = await getUserSummaries(userId);

    // Format the response
    const formattedSummaries = summaries.map(summary => ({
      id: summary.id,
      title: summary.title,
      fileName: summary.fileName,
      wordCount: summary.wordCount,
      documentType: summary.documentType,
      createdAt: summary.createdAt,
      updatedAt: summary.updatedAt
    }));

    res.status(200).json({
      success: true,
      summaries: formattedSummaries
    });

  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).json({ 
      error: 'Failed to fetch summaries', 
      details: error.message 
    });
  }
}
