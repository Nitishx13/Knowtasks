import { getAuth } from "@clerk/nextjs/server";
import { extractTextFromPDF, generateSummary, analyzeDocumentStructure } from "../../../lib/langchain";
import { createSummary, initializeDatabase } from "../../../lib/neo4j";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const { userId } = await getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Initialize database if needed
    await initializeDatabase();

    const { fileUrl, fileName } = req.body;

    if (!fileUrl || !fileName) {
      return res.status(400).json({ error: 'File URL and filename are required' });
    }

    // Download the PDF file from UploadThing
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Failed to download PDF file');
    }

    const pdfBuffer = await response.arrayBuffer();

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(pdfBuffer);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the PDF' });
    }

    // Analyze document structure
    const documentAnalysis = await analyzeDocumentStructure(extractedText);

    // Generate summary using LangChain and OpenAI
    const summaryResult = await generateSummary(extractedText);

    // Prepare summary data for database
    const summaryData = {
      title: fileName.replace('.pdf', ''),
      content: summaryResult.content,
      keyPoints: summaryResult.keyPoints,
      fileName: fileName,
      fileUrl: fileUrl,
      wordCount: summaryResult.wordCount,
      documentType: documentAnalysis.documentType,
      estimatedPages: documentAnalysis.estimatedPages
    };

    // Save to NeoDB
    const savedSummary = await createSummary(userId, summaryData);

    // Return the complete summary
    const result = {
      success: true,
      summary: {
        id: savedSummary.id,
        title: savedSummary.title,
        content: savedSummary.content,
        keyPoints: savedSummary.keyPoints,
        fileName: savedSummary.fileName,
        fileUrl: savedSummary.fileUrl,
        wordCount: savedSummary.wordCount,
        documentType: savedSummary.documentType,
        estimatedPages: savedSummary.estimatedPages,
        createdAt: savedSummary.createdAt,
        date: new Date().toISOString()
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ 
      error: 'Failed to process PDF', 
      details: error.message 
    });
  }
}
