/**
 * Test script to verify file upload functionality with in-memory storage
 * This simulates how Vercel would handle file uploads in production
 */

const fs = require('fs');
const path = require('path');
const { formidable } = require('formidable');

// Mock environment variables to simulate Vercel production
process.env.VERCEL = '1';
process.env.NODE_ENV = 'production';

// Create a mock request with a file
const mockFile = path.join(__dirname, 'test-upload.txt');
const fileContent = 'This is a test file for upload simulation';

// Create test file if it doesn't exist
if (!fs.existsSync(mockFile)) {
  fs.writeFileSync(mockFile, fileContent);
  console.log('Created test file:', mockFile);
}

// Function to test in-memory file parsing
async function testInMemoryParsing() {
  console.log('Testing in-memory file parsing...');
  
  // Create a PassThrough stream handler for in-memory storage
  const { PassThrough } = require('stream');
  const fileWriteStreamHandler = () => new PassThrough();
  
  // Initialize formidable with in-memory configuration
  const form = formidable({
    uploadDir: undefined, // No upload directory for in-memory
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    multiples: false,
    fileWriteStreamHandler
  });
  
  // Create a mock request with the file
  const mockReq = {
    headers: {
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryABC123'
    },
    pipe: (writable) => {
      // Simulate multipart form data with a file
      const boundary = '----WebKitFormBoundaryABC123';
      const fileBuffer = fs.readFileSync(mockFile);
      
      const formData = Buffer.concat([
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from('Content-Disposition: form-data; name="file"; filename="test-upload.txt"\r\n'),
        Buffer.from('Content-Type: text/plain\r\n\r\n'),
        fileBuffer,
        Buffer.from(`\r\n--${boundary}--\r\n`)
      ]);
      
      // Write the form data to the writable stream
      writable.write(formData);
      writable.end();
      
      return writable;
    }
  };
  
  // Parse the mock request
  return new Promise((resolve, reject) => {
    form.parse(mockReq, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        reject(err);
        return;
      }
      
      console.log('Form parsed successfully!');
      console.log('Files:', Object.keys(files));
      
      // Extract file info
      const fileObj = files.file;
      console.log('File object keys:', Object.keys(fileObj));
      
      // Check if we have the buffer (in-memory storage)
      if (fileObj.buffer) {
        console.log('Buffer exists! Size:', fileObj.buffer.length);
        console.log('File content:', fileObj.buffer.toString().substring(0, 50) + '...');
      } else {
        console.log('No buffer found in file object');
      }
      
      resolve({ fields, files });
    });
  });
}

// Run the test
testInMemoryParsing()
  .then(() => {
    console.log('Test completed successfully!');
  })
  .catch(err => {
    console.error('Test failed:', err);
  });