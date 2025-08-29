import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';
import pdf from 'pdf-parse';

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
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        // Handle both single file and array of files
        const fileObj = Array.isArray(file) ? file[0] : file;
        
        const filePath = fileObj.filepath;
        const fileName = fileObj.originalFilename || 'unknown_file';
        const fileSize = fileObj.size;
        const fileExtension = path.extname(fileName).toLowerCase();

        console.log('Processing file:', { fileName, fileExtension, fileSize, filePath });

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
            fs.unlinkSync(filePath);
            console.log('Temporary file cleaned up');
          }
        } catch (cleanupError) {
          console.warn('Could not clean up temporary file:', cleanupError);
        }

        res.status(200).json({
          success: true,
          fileId,
          fileName,
          content,
          summary,
          wordCount: content.split(/\s+/).length,
          fileSize,
          fileType: fileExtension,
          uploadDate
        });

      } catch (fileError) {
        console.error('File processing error:', fileError);
        res.status(500).json({ error: 'Failed to process file: ' + fileError.message });
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
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
