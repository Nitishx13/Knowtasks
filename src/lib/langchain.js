const { ChatOpenAI } = require('@langchain/openai');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { PromptTemplate } = require('@langchain/core/prompts');

// Initialize OpenAI model
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.3,
});

// Extract text from PDF file
async function extractTextFromPDF(filePath) {
  try {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    
    // Combine all pages into one text
    const text = docs.map(doc => doc.pageContent).join('\n');
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Generate AI summary using OpenAI
async function generateSummary(text, fileName) {
  try {
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert document analyst. Please analyze the following document and provide a comprehensive summary.
      
      Document: {fileName}
      Content: {text}
      
      Please provide:
      1. A concise summary of the main content
      2. Key points and insights
      3. Writing style analysis
      4. Complexity level assessment
      5. Estimated word count and pages
      
      Format your response as JSON with the following structure:
      {
        "title": "Document title",
        "content": "Main summary content",
        "keyPoints": ["point1", "point2", "point3"],
        "writingStyle": "Academic/Professional/Casual/etc",
        "complexityLevel": "Beginner/Intermediate/Advanced",
        "wordCount": 150,
        "estimatedPages": 2
      }
    `);

    const formattedPrompt = await prompt.format({
      fileName: fileName,
      text: text.substring(0, 4000) // Limit text length for API
    });

    const response = await model.invoke(formattedPrompt);
    const summaryText = response.content;
    
    // Try to parse JSON response
    try {
      return JSON.parse(summaryText);
    } catch (parseError) {
      // Fallback to structured response if JSON parsing fails
      return {
        title: fileName.replace('.pdf', ''),
        content: summaryText,
        keyPoints: ['Key insights extracted from document'],
        writingStyle: 'Professional',
        complexityLevel: 'Intermediate',
        wordCount: text.split(' ').length,
        estimatedPages: Math.ceil(text.length / 2000)
      };
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate AI summary');
  }
}

// Analyze document structure
async function analyzeDocumentStructure(text) {
  try {
    const prompt = PromptTemplate.fromTemplate(`
      Analyze the following document text and provide structural insights:
      
      Text: {text}
      
      Please identify:
      1. Document type (Academic, Business, Technical, etc.)
      2. Main sections or topics
      3. Writing tone and style
      4. Target audience
      
      Format as JSON:
      {
        "documentType": "Academic",
        "sections": ["section1", "section2"],
        "tone": "Professional",
        "audience": "Researchers"
      }
    `);

    const formattedPrompt = await prompt.format({
      text: text.substring(0, 2000)
    });

    const response = await model.invoke(formattedPrompt);
    const analysisText = response.content;
    
    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      return {
        documentType: 'Document',
        sections: ['Main content'],
        tone: 'Professional',
        audience: 'General'
      };
    }
  } catch (error) {
    console.error('Error analyzing document structure:', error);
    return {
      documentType: 'Document',
      sections: ['Main content'],
      tone: 'Professional',
      audience: 'General'
    };
  }
}

module.exports = {
  extractTextFromPDF,
  generateSummary,
  analyzeDocumentStructure
};
