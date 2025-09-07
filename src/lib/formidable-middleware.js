/**
 * Middleware for handling file uploads with formidable
 * This helps ensure consistent file upload handling across environments
 */

// Import formidable correctly for v3.5.4
import { formidable } from 'formidable';
import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const ensureUploadsDir = () => {
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
  
  return uploadsDir;
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
  
  try {
    const uploadsDir = ensureUploadsDir();
    
    return new Promise((resolve, reject) => {
      console.log('Initializing formidable with options:', {
        uploadDir: uploadsDir,
        keepExtensions: true,
        maxFileSize: '50MB',
        multiples: false,
        ...options
      });
      
      // Fix formidable constructor usage for v3.5.4
      const form = formidable({
        uploadDir: uploadsDir,
        keepExtensions: true,
        maxFileSize: 50 * 1024 * 1024, // 50MB
        multiples: false,
        ...options
      });
    
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
  if (!files || Object.keys(files).length === 0) {
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
    return null;
  }
  
  // Get file properties based on formidable structure
  const filePath = fileObj.filepath || fileObj.path;
  const fileName = fileObj.originalFilename || fileObj.name || 'unknown_file';
  const fileSize = fileObj.size;
  const fileExtension = path.extname(fileName).toLowerCase();
  
  return {
    filePath,
    fileName,
    fileSize,
    fileExtension
  };
};