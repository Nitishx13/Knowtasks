import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Initialize OpenAI model
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.3,
  maxTokens: 2000,
});

// Text splitter for chunking large documents
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// Prompt template for summarization
const summaryPrompt = PromptTemplate.fromTemplate(`
You are an expert document summarizer. Please analyze the following PDF content and create a comprehensive summary.

Document Content:
{document}

Please provide:
1. A concise summary (2-3 paragraphs)
2. Key points extracted from the document (5-7 bullet points)
3. The main topic or theme of the document

Format your response as JSON with the following structure:
{
  "summary": "Your concise summary here",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "mainTopic": "Main topic or theme",
  "wordCount": estimated word count of original document
}

Be accurate, objective, and capture the most important information from the document.
`);

// Function to extract text from PDF
export async function extractTextFromPDF(pdfBuffer) {
  try {
    // Create a temporary file-like object for PDFLoader
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const loader = new PDFLoader(blob);
    
    const docs = await loader.load();
    const text = docs.map(doc => doc.pageContent).join('\n');
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Function to chunk text for processing
export async function chunkText(text) {
  try {
    const chunks = await textSplitter.splitText(text);
    return chunks;
  } catch (error) {
    console.error('Error chunking text:', error);
    throw new Error('Failed to chunk text');
  }
}

// Function to generate summary using LangChain
export async function generateSummary(text) {
  try {
    // If text is too long, chunk it and process in parts
    if (text.length > 4000) {
      const chunks = await chunkText(text);
      const chunkSummaries = [];
      
      // Process each chunk
      for (const chunk of chunks.slice(0, 3)) { // Limit to first 3 chunks to avoid token limits
        const response = await model.invoke([
          ['system', 'You are a helpful assistant that summarizes text chunks. Provide a brief summary of this chunk.'],
          ['human', chunk]
        ]);
        chunkSummaries.push(response.content);
      }
      
      // Combine chunk summaries and create final summary
      const combinedText = chunkSummaries.join('\n\n');
      return await generateFinalSummary(combinedText);
    } else {
      return await generateFinalSummary(text);
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}

// Function to generate final summary
async function generateFinalSummary(text) {
  try {
    const chain = summaryPrompt.pipe(model).pipe(new StringOutputParser());
    
    const result = await chain.invoke({
      document: text.substring(0, 3000) // Limit to avoid token limits
    });
    
    // Try to parse JSON response
    try {
      const parsed = JSON.parse(result);
      return {
        content: parsed.summary,
        keyPoints: parsed.keyPoints || [],
        mainTopic: parsed.mainTopic || 'Document Analysis',
        wordCount: parsed.wordCount || text.split(' ').length
      };
    } catch (parseError) {
      // If JSON parsing fails, return structured response
      return {
        content: result,
        keyPoints: extractKeyPoints(result),
        mainTopic: 'Document Analysis',
        wordCount: text.split(' ').length
      };
    }
  } catch (error) {
    console.error('Error in final summary generation:', error);
    throw new Error('Failed to generate final summary');
  }
}

// Helper function to extract key points from text
function extractKeyPoints(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  return sentences.slice(0, 5).map(s => s.trim());
}

// Function to analyze document structure
export async function analyzeDocumentStructure(text) {
  try {
    const analysisPrompt = PromptTemplate.fromTemplate(`
Analyze the following document and provide structural information:

Document:
{document}

Provide a JSON response with:
{
  "documentType": "research paper|article|report|other",
  "sections": ["section1", "section2", "section3"],
  "hasAbstract": true/false,
  "hasConclusion": true/false,
  "estimatedPages": number
}
`);

    const chain = analysisPrompt.pipe(model).pipe(new StringOutputParser());
    const result = await chain.invoke({ document: text.substring(0, 2000) });
    
    try {
      return JSON.parse(result);
    } catch {
      return {
        documentType: 'document',
        sections: [],
        hasAbstract: false,
        hasConclusion: false,
        estimatedPages: Math.ceil(text.length / 2000)
      };
    }
  } catch (error) {
    console.error('Error analyzing document structure:', error);
    return {
      documentType: 'document',
      sections: [],
      hasAbstract: false,
      hasConclusion: false,
      estimatedPages: Math.ceil(text.length / 2000)
    };
  }
}
