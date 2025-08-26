// Test script for file upload and summary generation
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TEST_PDF_PATH = path.join(__dirname, '../test-files/sample.pdf');
const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN; // Set this in your environment

async function testUploadAndSummarize() {
  try {
    console.log('Starting test for file upload and summary generation...');
    
    // Check if test file exists
    if (!fs.existsSync(TEST_PDF_PATH)) {
      console.error(`Test file not found: ${TEST_PDF_PATH}`);
      return false;
    }
    
    // Check if auth token is provided
    if (!AUTH_TOKEN) {
      console.error('No authentication token provided. Set TEST_AUTH_TOKEN environment variable.');
      return false;
    }
    
    // Step 1: Upload file to UploadThing
    console.log('Step 1: Uploading file to UploadThing...');
    // This is a simplified example. In a real test, you would use the UploadThing SDK
    // or simulate the upload process with appropriate API calls.
    console.log('File upload simulation completed.');
    
    // Step 2: Call the summarize API
    console.log('Step 2: Calling summarize API...');
    const summaryResponse = await fetch(`${API_URL}/api/summarize/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        fileUrl: 'https://example.com/test-file.pdf', // Simulated URL
        fileName: 'test-file.pdf'
      })
    });
    
    if (!summaryResponse.ok) {
      console.error(`API error: ${summaryResponse.status} ${summaryResponse.statusText}`);
      const errorText = await summaryResponse.text();
      console.error(`Error details: ${errorText}`);
      return false;
    }
    
    const summaryData = await summaryResponse.json();
    console.log('Summary generated successfully:', summaryData);
    
    // Step 3: Verify the summary was saved to the database
    console.log('Step 3: Verifying summary in database...');
    const libraryResponse = await fetch(`${API_URL}/api/summarize/list`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    if (!libraryResponse.ok) {
      console.error(`API error: ${libraryResponse.status} ${libraryResponse.statusText}`);
      return false;
    }
    
    const libraryData = await libraryResponse.json();
    const foundSummary = libraryData.summaries.find(s => s.id === summaryData.id);
    
    if (foundSummary) {
      console.log('Summary found in database:', foundSummary);
      console.log('✅ Test completed successfully!');
      return true;
    } else {
      console.error('Summary not found in database');
      return false;
    }
    
  } catch (error) {
    console.error('Test failed with error:', error);
    return false;
  }
}

// Run the test
testUploadAndSummarize()
  .then(success => {
    if (success) {
      console.log('✅ All tests passed');
      process.exit(0);
    } else {
      console.error('❌ Test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Test error:', error);
    process.exit(1);
  });