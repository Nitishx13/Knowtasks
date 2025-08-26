import { getAuth } from "@clerk/nextjs/server";
import { getSummaryById, deleteSummary } from "../../../lib/neo4j";

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Get authenticated user
  const { userId } = await getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle GET request - Get a specific summary
  if (req.method === 'GET') {
    try {
      const summary = await getSummaryById(id);
      
      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }
      
      // Check if the summary belongs to the authenticated user
      if (summary.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      res.status(200).json({ success: true, summary });
    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({ error: 'Failed to fetch summary', details: error.message });
    }
  }
  
  // Handle DELETE request - Delete a summary
  else if (req.method === 'DELETE') {
    try {
      const summary = await getSummaryById(id);
      
      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }
      
      // Check if the summary belongs to the authenticated user
      if (summary.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      await deleteSummary(id);
      
      res.status(200).json({ success: true, message: 'Summary deleted successfully' });
    } catch (error) {
      console.error('Error deleting summary:', error);
      res.status(500).json({ error: 'Failed to delete summary', details: error.message });
    }
  }
  
  // Handle unsupported methods
  else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}