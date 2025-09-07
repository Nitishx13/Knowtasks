// Test script to diagnose file upload issues
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
// Use dynamic import for node-fetch (ESM module)

async function testFileUpload() {
  // Import fetch dynamically
  const { default: fetch } = await import('node-fetch');
  try {
    // Create test file if it doesn't exist
    const testFilePath = path.join(__dirname, 'test-upload.txt');
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'This is a test file for upload functionality.\n' +
        'It contains some text that will be used to test the file upload and summarization feature.\n' +
        'The purpose is to diagnose the \'Upload failed\' error that occurs during file uploads.');
      console.log('Created test file:', testFilePath);
    }

    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));

    console.log('Sending request to upload endpoint...');
    
    // Send request to local server
    console.log('Form data created, sending to endpoint...');
    const response = await fetch('http://localhost:3000/api/summarize/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    console.log('Request sent, waiting for response...');

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('Upload successful!');
    } else {
      console.error('Upload failed:', data.error);
      if (data.details) {
        console.error('Error details:', data.details);
      }
      if (data.code) {
        console.error('Error code:', data.code);
      }
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

testFileUpload();