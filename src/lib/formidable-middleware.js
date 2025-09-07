/**
 * Middleware for handling file uploads with formidable
 * This helps ensure consistent file upload handling across environments
 */

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory:', uploadsDir);
    } catch (err) {
      console.error('Failed to create uploads directory:', err);
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
  ensureUploadsDir();
  
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      uploadDir: path.join(process.cwd(), 'uploads'),
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