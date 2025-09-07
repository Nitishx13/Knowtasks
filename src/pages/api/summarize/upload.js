import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';
import pdf from 'pdf-parse';
import { parseFormData, extractFileInfo } from '../../../lib/formidable-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use our middleware to parse the form data
    let fields, files;
    try {
      const result = await parseFormData(req);
      fields = result.fields;
      files = result.files;
    } catch (parseError) {
      console.error('Form parsing error:', parseError);
      return res.status(500).json(parseError);
    }

    // Log the files object structure to help debug
    console.log('Files received:', JSON.stringify(files, null, 2));
    
    // Extract file information using our utility function
    const fileInfo = extractFileInfo(files);
    
    if (!fileInfo) {
      return res.status(400).json({ error: 'No valid file found in the request' });
    }

    try {
      const { filePath, fileName, fileSize, fileExtension } = fileInfo;
      console.log('Processing file:', { filePath, fileName, fileSize, fileExtension });

      if (!filePath || !fileName) {
        return res.status(400).json({ error: 'Invalid file data received' });
      }

      let content = '';
      let summary = '';

      // Process different file types
      if (fileExtension === '.pdf') {
        try {
          const dataBuffer = fs.readFileSync(filePath);
          const pdfData = await pdf(dataBuffer);
          content = pdfData.text || 'PDF content extracted but appears empty';
          
          // Generate summary using advanced algorithm
          summary = await generateAdvancedSummary(content);
          console.log('PDF processed successfully, content length:', content.length);
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError);
          content = `PDF file "${fileName}" uploaded successfully. Text extraction failed: ${pdfError.message}`;
          summary = 'Unable to generate summary due to PDF parsing error.';
        }
      } else if (fileExtension === '.txt') {
        try {
          content = fs.readFileSync(filePath, 'utf8');
          summary = await generateAdvancedSummary(content);
          console.log('TXT processed successfully, content length:', content.length);
        } catch (readError) {
          console.error('TXT reading error:', readError);
          content = `Text file "${fileName}" uploaded successfully. Content reading failed: ${readError.message}`;
          summary = 'Unable to read text file content.';
        }
      } else if (fileExtension === '.doc' || fileExtension === '.docx') {
        content = `Word document "${fileName}" uploaded successfully. Text extraction from Word documents requires additional libraries.`;
        summary = 'Unable to generate summary for Word documents at this time.';
      } else {
        try {
          content = fs.readFileSync(filePath, 'utf8');
          summary = await generateAdvancedSummary(content);
        } catch (readError) {
          content = `File "${fileName}" uploaded successfully. Content extraction not available for this file type.`;
          summary = 'Unable to generate summary for this file type.';
        }
      }

      // Store file information in Neon database
      const userId = req.headers['user-id'] || 'anonymous';
      const uploadDate = new Date().toISOString();
      
      console.log('Inserting into database:', { fileName, fileSize, userId, uploadDate });
      
      const result = await sql`
        INSERT INTO uploaded_files (
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
        ) VALUES (
          ${fileName}, 
          ${`/uploads/${fileName}`}, 
          ${fileSize}, 
          ${userId}, 
          ${'web_upload'}, 
          ${uploadDate}, 
          ${'processed'},
          ${content},
          ${summary},
          ${fileExtension}
        ) RETURNING id
      `;

      const fileId = result.rows[0].id;
      console.log('File saved to database with ID:', fileId);

      // Clean up the uploaded file
      try {
        if (filePath && fs.existsSync(filePath)) {
          // Keep the file for now, but in production you might want to delete it
          // fs.unlinkSync(filePath);
          console.log('File kept for reference:', filePath);
        }
      } catch (cleanupError) {
        console.error('Error during file cleanup:', cleanupError);
      }

      // Return success response with file details and summary
      return res.status(200).json({
        success: true,
        fileId,
        fileName,
        fileSize,
        fileType: fileExtension,
        content: content.substring(0, 1000) + (content.length > 1000 ? '...' : ''),
        summary,
        wordCount: content.split(/\s+/).length,
        date: uploadDate
      });
    } catch (processingError) {
      console.error('File processing error:', processingError);
      return res.status(500).json({ 
        error: 'Error processing file', 
        details: processingError.message || 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: error.message || 'Unknown error'
    });
  }
}

// Advanced summarization algorithm
async function generateAdvancedSummary(text) {
  if (!text || text.length < 100) {
    return text || 'Content too short to summarize.';
  }

  // Clean and normalize text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Split into sentences
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  if (sentences.length <= 3) {
    return cleanText;
  }

  // Tokenize and clean words
  const words = cleanText.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !isStopWord(word));

  // Calculate word frequency
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Score sentences based on word frequency and position
  const sentenceScores = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequencyScore = sentenceWords.reduce((acc, word) => acc + (wordFreq[word] || 0), 0);
    const positionScore = 1 / (index + 1); // Earlier sentences get higher scores
    const lengthScore = Math.min(sentenceWords.length / 20, 1); // Optimal sentence length
    
    const totalScore = frequencyScore * 0.5 + positionScore * 0.3 + lengthScore * 0.2;
    
    return { sentence: sentence.trim(), score: totalScore };
  });

  // Select top sentences for summary
  const summaryLength = Math.min(5, Math.ceil(sentences.length * 0.25));
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, summaryLength)
    .map(item => item.sentence)
    .filter(s => s.length > 30);

  // Reconstruct summary
  return topSentences.join('. ') + '.';
}

// Common stop words to filter out
function isStopWord(word) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);
  return stopWords.has(word.toLowerCase());
}
