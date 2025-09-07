/**
 * Middleware for handling file uploads with formidable
 * This helps ensure consistent file upload handling across environments
 */

// Import formidable correctly for v3.5.4
import { formidable } from 'formidable';
import fs from 'fs';
import path from 'path';

// Configure uploads based on environment
const configureUploads = () => {
  // Check if we're in Vercel production environment
  const isVercelProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  console.log('Is Vercel production environment:', isVercelProduction);
  
  // For Vercel production, we'll use in-memory storage
  if (isVercelProduction) {
    console.log('Using in-memory storage for Vercel production');
    return { 
      keepExtensions: true,
      // Don't specify uploadDir for in-memory storage
      // This is critical for Vercel serverless functions
      maxFileSize: 50 * 1024 * 1024, // 50MB
      multiples: false
    };
  }
  
  // For local development, use filesystem
  const uploadsDir = path.join(process.cwd(), 'uploads');
  console.log('Checking uploads directory:', uploadsDir);
  
  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory:', uploadsDir);
    } catch (err) {
      console.error('Failed to create uploads directory:', err);
      throw new Error(`Failed to create uploads directory: ${err.message}`);
    }
  } else {
    console.log('Uploads directory already exists');
    
    // Verify directory is writable
    try {
      const testFile = path.join(uploadsDir, '.write-test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log('Uploads directory is writable');
    } catch (err) {
      console.error('Uploads directory is not writable:', err);
      throw new Error(`Uploads directory is not writable: ${err.message}`);
    }
  }
  
  return { 
    uploadDir: uploadsDir, 
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    multiples: false
  };
};

/**
 * Parse form data with files using formidable
 * @param {Object} req - The request object
 * @param {Object} options - Additional options for formidable
 * @returns {Promise<{fields: Object, files: Object}>} - Parsed fields and files
 */
export const parseFormData = (req, options = {}) => {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Current working directory:', process.cwd());
  console.log('Is Vercel:', process.env.VERCEL);
  
  try {
    const uploadConfig = configureUploads();
    
    return new Promise((resolve, reject) => {
      // Check if we're using in-memory storage
      const isInMemory = !uploadConfig.uploadDir;
      
      // Create formidable options
      const formOptions = {
        ...uploadConfig,
        ...options
      };
      
      // For Vercel production environment, ensure we're set up for in-memory processing
      if (isInMemory) {
        console.log('Setting up in-memory file processing');
        // Don't set fileWriteStreamHandler for in-memory mode
        // Formidable will handle this internally when uploadDir is not specified
      }
      
      console.log('Initializing formidable with options:', JSON.stringify(formOptions, null, 2));
      
      // Fix formidable constructor usage for v3.5.4
      const form = formidable(formOptions);
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        reject({
          error: 'Failed to parse form data',
          details: err.message || 'Unknown error',
          code: err.code || 'FORM_PARSE_ERROR'
        });
        return;
      }
      
      resolve({ fields, files });
    });
  });
  } catch (error) {
    console.error('Error in parseFormData:', error);
    return Promise.reject({
      error: 'Failed to initialize form parser',
      details: error.message,
      code: 'FORM_INIT_ERROR'
    });
  }
};

/**
 * Extract file information from formidable files object
 * Handles different possible structures of the files object
 * @param {Object} files - Files object from formidable
 * @returns {Object|null} - File object or null if no valid file found
 */
export const extractFileInfo = (files) => {
  console.log('Extracting file info from:', JSON.stringify(files, (key, value) => {
    // Avoid logging file content buffers
    if (key === 'buffer' && typeof value !== 'string') {
      return '[Buffer data]';
    }
    return value;
  }, 2));
  
  if (!files || Object.keys(files).length === 0) {
    console.log('No files found in request');
    return null;
  }
  
  let fileObj;
  
  // Try to get the file from different possible structures
  if (files.file) {
    fileObj = Array.isArray(files.file) ? files.file[0] : files.file;
  } else {
    // If files.file doesn't exist, try to get the first file from any key
    const firstKey = Object.keys(files)[0];
    fileObj = Array.isArray(files[firstKey]) ? files[firstKey][0] : files[firstKey];
  }
  
  if (!fileObj) {
    console.log('No valid file object found');
    return null;
  }
  
  console.log('File object structure:', Object.keys(fileObj));
  
  // Get file properties based on formidable structure
  const filePath = fileObj.filepath || fileObj.path;
  const fileName = fileObj.originalFilename || fileObj.name || 'unknown_file';
  const fileSize = fileObj.size;
  const fileType = fileObj.mimetype || fileObj.type;
  const fileExtension = path.extname(fileName).toLowerCase();
  
  // For in-memory files, we need to handle the buffer
  const fileBuffer = fileObj.buffer || null;
  
  console.log('Extracted file info:', { filePath, fileName, fileSize, fileType, fileExtension, hasBuffer: !!fileBuffer });
  
  return {
    filePath,
    fileName,
    fileSize,
    fileType,
    fileExtension,
    buffer: fileBuffer
  };
};